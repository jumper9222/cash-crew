import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Form, Image, InputGroup, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { postTransaction } from "../../features/transactions/transactionsAsyncThunks";
import SplitRow from "../../components/SplitRow";
import ImagePreview from "../../components/ImagePreview";
import { categoriesArray } from "../../features/current-user/currentUserSelector";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

export default function CreateTransaction({ show, onHide }) {
    const dispatch = useDispatch();
    const { uid, email, settings } = useSelector(state => state.currentUser)
    const categories = useSelector(categoriesArray)
    const friendEmails = useSelector(state => state.friends.friendEmails)
    const friends = useSelector(state => state.friends.friends)
    const loading = useSelector((state) => state.transactions.loading.transactions)

    //React select component styling
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            fontWeight: state.data.parentCategoryID === null ? "bold" : "normal",
            backgroundColor: state.isSelected
                ? "#007bff"
                : state.isFocused
                    ? "#f0f0f0"
                    : state.data.parentCategoryID === null
                        ? "#f8f9fa" // Light background for parent categories
                        : "#ffffff",
            color: state.isSelected ? "#fff" : "#333",
            paddingLeft: state.data.parentCategoryID ? 20 : 10, // Indent child categories

        }),
    }

    //form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const currentDate = DateTime.local().toFormat('yyyy-MM-dd');
    const [date, setDate] = useState(currentDate);
    const [totalAmount, setTotalAmount] = useState(0.00);
    const [currency, setCurrency] = useState('');
    const [category, setCategory] = useState('');
    const [isSplit, setIsSplit] = useState(false);
    //Fetched currencies for currency select
    const [currencies, setCurrencies] = useState([]);
    const [image, setImage] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const fileInputRef = useRef(null)

    //split states
    const [splits, setSplits] = useState([{ user_id: uid, split_amount: 0, category }]);
    const [suggestions, setSuggestions] = useState([]);
    const [splitUsers, setSplitUsers] = useState([email]);
    const [splitType, setSplitType] = useState('Equally');
    //Split for calculating split history when set to "as amounts"
    const [splitCalcHistory, setSplitCalcHistory] = useState({ totalModified: 0, indexesModified: [] });
    const [focusIndex, setFocusIndex] = useState(0);
    const [splitsAreValid, setSplitsAreValid] = useState(true);

    //Modal state for image preview
    const [showModal, setShowModal] = useState(false)

    //split use effect
    //Use effect functions
    //Reset split calculation history
    const divideAmountsEqually = () => {
        setSplitCalcHistory({ totalModified: 0, indexesModified: [] })
        setSplits(splits.map((split) => {
            return { ...split, split_amount: parseFloat(totalAmount / splits.length).toFixed(2) }
        }))
    }

    const fetchCurrencies = async () => {
        const currencies = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json')
        const currencyArray = Object.entries(currencies.data).filter(([_, value]) => {
            return value
        }).map(([key, value]) => {
            return { value: key.toUpperCase(), label: key.toUpperCase() + ' - ' + value }
        })
        console.log(currencyArray)
        return currencyArray
    }

    //Define split modified history function
    const updateSplitModHistory = (index) => {
        const { indexesModified } = splitCalcHistory;
        //Add modified index number if it doesn't already exist in the array
        const newModifiedIndexes = indexesModified.includes(index) ? indexesModified : [...indexesModified, index]
        //Iterate through modified split indices and calculate new modified total from modhistory state
        const newModifiedTotal = newModifiedIndexes.reduce((total, index) => {
            return total + parseFloat(splits[index].split_amount)
        }, 0)
        //Set new total modified and new modified indices
        setSplitCalcHistory(() => ({ totalModified: newModifiedTotal, indexesModified: newModifiedIndexes }))
        console.log("Split history", splitCalcHistory,)
    }

    useEffect(() => {
        fetchCurrencies()
            .then((currencies) => {
                setCurrencies(currencies);
                setCurrency(currencies.find(currency => currency.value === settings.defaultCurrency.toUpperCase()));
            })
    }, [])

    useEffect(() => {
        if (splitType === "Equally") {
            divideAmountsEqually();
        }

        if (splitType === "As amounts") {

        }
    }, [splits.length, splitType, totalAmount])

    useEffect(() => {
        if (splits.length > 1) {
            setIsSplit(true)
        } else {
            setIsSplit(false)
        }
    }, [splits.length])

    useEffect(() => {
        const splitSum = splits.reduce((total, split) => {
            return total + parseFloat(split.split_amount)
        }, 0)

        if (parseFloat(splitSum) === parseFloat(totalAmount)) {
            setSplitsAreValid(true)
        } else (
            setSplitsAreValid(false)
        )
    }, [splits, totalAmount])

    //handle functions
    const handleAddSplit = () => {
        setSplits([...splits, { user_id: '', split_amount: 0, category }]);
        setSplitUsers([...splitUsers, ''])
    }

    const handleEmailField = (e, index) => {
        e.preventDefault();
        const value = e.target.value;
        const newSplitUsers = [...splitUsers]
        newSplitUsers[index] = value
        setSplitUsers(newSplitUsers)

        if (value) {
            const suggestions = friendEmails.filter((email) =>
                email.toLowerCase().includes(value.toLowerCase())
            )
            setSuggestions([...suggestions])
        } else { setSuggestions([]) }
    }

    const handleEmailBlur = (index) => {
        setSuggestions([]);
        const newSplits = [...splits]
        newSplits[index].user_id = splitUsers[index] === email ? uid : Object.values(friends).find(friend => friend.email === splitUsers[index])?.uid || ''
        setSplits(newSplits)
    }

    const handleAmountField = (e, index) => {
        e.preventDefault();
        const value = e.target.value
        const newSplits = [...splits];
        newSplits[index].split_amount = value;
        setSplits(newSplits)
    }

    const handleAmountBlur = (e, index) => {
        e.preventDefault();

        //Prevent split amounts from changing when split type is set to equal
        if (splitType === "Equally") {
            divideAmountsEqually();
            return
        }

        //Calculate unmodified split amounts
        if (splitType === 'As amounts') {
            //Create new splits array from previous state
            const newSplits = [...splits];
            const newSplitAmount = parseFloat(newSplits[index].split_amount).toFixed(2);
            //Set newly modified amount
            newSplits[index].split_amount = newSplitAmount;
            updateSplitModHistory(index)
            const remainingAmount = parseFloat(parseFloat(totalAmount) - parseFloat(splitCalcHistory.totalModified)).toFixed(2);
            const remainingSplits = newSplits.map((split, i) => i).filter((i) => !splitCalcHistory.indexesModified.includes(i));
            const remainingSplitsAmount = remainingAmount / remainingSplits.length
            remainingSplits.forEach((split) => {
                return newSplits[split].split_amount = parseFloat(remainingSplitsAmount).toFixed(2)
            })
            setSplits(newSplits)
        }
    }

    const handleEmailFocus = (index) => {
        setFocusIndex(index)
        console.log('on focus', focusIndex)
    }

    const handleSuggestionClick = (suggestion, index) => {
        console.log('suggestion clicked', suggestion)
        const newSplitUsers = [...splitUsers];
        newSplitUsers[index] = suggestion;
        setSplitUsers(newSplitUsers);
        setSuggestions([]);
    }

    const handleDeleteSplit = () => {
        setSplits(splits.slice(0, -1))
        setSplitUsers(splitUsers.slice(0, -1))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transactionData = {
            title,
            description,
            date,
            totalAmount,
            currency: currency.value.toUpperCase(),
            category: category.value,
            isSplit,
            splits: isSplit ? splits : [],
            image
        }
        console.log(transactionData)
        await dispatch(postTransaction({ transactionData, user_id: uid }))
            .then(() => onHide())
            .then(() => {
                setTitle('');
                setDescription('');
                setDate('');
                setTotalAmount(0.00);
                setCurrency(settings.defaultCurrency.toUpperCase());
                setCategory('');
                setImage(null);
                setThumbnail(null);
            })
            .catch((error) => console.error("Error creating transaction: ", error))
    }

    const handleAddImage = () => {
        fileInputRef.current.click()
    }

    return (
        <>
            <Modal show={show === 'add-transaction'} onHide={onHide} centered>
                <Modal.Header closeButton>Add a transaction</Modal.Header>
                <Form
                    onSubmit={handleSubmit}
                >
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <InputGroup className="mb-3">
                            <Col xs={7}>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    value={totalAmount}
                                    onChange={e => setTotalAmount(e.target.value)}
                                    onBlur={() => {
                                        if (totalAmount) {
                                            setTotalAmount(parseFloat(totalAmount).toFixed(2))
                                        }
                                    }}
                                    placeholder="Enter amount"
                                    style={{
                                        borderTopRightRadius: '0px',
                                        borderBottomRightRadius: '0px'
                                    }}
                                    required
                                />
                            </Col>
                            <Col xs={5}>
                                <Select
                                    options={currencies}
                                    value={currency}
                                    onChange={setCurrency}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: '#fcfbf8', // Example background color
                                            borderRadius: '8px', // Default rounded corners
                                            borderTopLeftRadius: '0px', // Remove top-left corner roundness
                                            borderBottomLeftRadius: '0px', // Remove bottom-left corner roundness
                                            borderColor: '#d9d0a6'
                                        }),
                                    }}
                                    placeholder='Currency...'
                                />
                            </Col>
                        </InputGroup>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <CreatableSelect
                                options={categories}
                                value={category}
                                onChange={setCategory}
                                styles={customStyles}
                                placeholder='Select a category'
                                required
                            />
                        </Form.Group>
                        {thumbnail && <Image className="mb-3" width='50px' src={thumbnail} onClick={() => setShowModal(true)} fluid />}
                        <Form.Group className="mb-2">
                            <Form.Control
                                className="d-none"
                                type="file"
                                onChange={(e) => {
                                    console.log(e.target.files)
                                    const file = e.target.files[0]
                                    setImage(file)
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setThumbnail(reader.result)
                                        };
                                        reader.readAsDataURL(file)
                                    }
                                }}
                                ref={fileInputRef}
                            />
                            <Button onClick={handleAddImage}>Add Image</Button>
                        </Form.Group>
                        {!isSplit && <Button className="me-2" onClick={handleAddSplit} variant="light">Split Transaction <Badge bg='secondary'>Coming Soon</Badge></Button>}

                        {isSplit &&
                            <>
                                <Form.Label>Split</Form.Label>
                                <div className="d-flex flex-column gap-2">
                                    <Form.Select
                                        value={splitType}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setSplitType(e.target.value)
                                        }}
                                    >
                                        <option value="Equally">Equally</option>
                                        <option value="As amounts">As amounts</option>
                                        <option value="As parts">As parts</option>
                                    </Form.Select>
                                    <div className="d-flex flex-column gap-2">
                                        {splits.map((split, index) => (
                                            <SplitRow
                                                key={index}
                                                splitIndex={index}
                                                amount={split.split_amount}
                                                email={splitUsers[index]}
                                                handleEmailField={(e) => handleEmailField(e, index)}
                                                handleEmailBlur={() => handleEmailBlur(index)}
                                                handleEmailFocus={() => handleEmailFocus(index)}
                                                handleAmountField={(e) => handleAmountField(e, index)}
                                                handleAmountBlur={(e) => handleAmountBlur(e, index)}
                                                handleSuggestionClick={handleSuggestionClick}
                                                suggestions={suggestions}
                                                isActive={focusIndex === index}
                                            />
                                        ))}
                                    </div>
                                    {!splitsAreValid ? <Form.Text className="text-danger">Splits do not add up.</Form.Text> : null}
                                    <div className="d-flex gap-1">
                                        {splits.length > 1 &&
                                            <>
                                                <Button disabled={splits.length >= friendEmails.length + 1} size='sm' onClick={handleAddSplit}><i className="bi bi-plus-lg"></i> Add split</Button>
                                                <Button variant='danger' size="sm" onClick={handleDeleteSplit}><i className="bi bi-dash-lg"></i> Remove split</Button>
                                            </>
                                        }
                                    </div>
                                </div>
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" disabled={loading}>Submit {loading && <Spinner size="sm" />}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <ImagePreview show={showModal} onHide={() => setShowModal(false)} image={thumbnail} />
        </>
    )
}