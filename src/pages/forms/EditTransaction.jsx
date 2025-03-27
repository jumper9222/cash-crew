import { DateTime } from "luxon";
import { useState, useEffect, useRef } from "react";
import { Button, Col, Form, Image, InputGroup, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateTransaction } from "../../features/transactions/transactionsAsyncThunks";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { categoriesArray } from "../../features/current-user/currentUserSelector";
import Select from "react-select";

export default function EditTransaction({ show, onHide, transactionObject }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { uid } = useSelector(state => state.currentUser)
    const categories = useSelector(categoriesArray)

    const loading = useSelector(state => state.transactions.loading.transactions)
    const { transaction, splits } = transactionObject

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
    };

    //Form states
    const [title, setTitle] = useState(transaction?.title);
    const [description, setDescription] = useState(transaction?.description);
    const [date, setDate] = useState(transaction?.date);
    const [totalAmount, setTotalAmount] = useState(transaction?.total_amount);
    const [currency, setCurrency] = useState(null);
    const [category, setCategory] = useState(categories.find(cat => cat.value === transaction?.category));
    const [paidBy, setPaidBy] = useState(uid);
    const [image, setImage] = useState(null);
    const [updatedSplits, setUpdatedSplits] = useState([]);
    const [isSplit, setIsSplit] = useState(splits.length > 1 ? true : false);
    //Currencies state to store currencies array after fetching
    const [currencies, setCurrencies] = useState([])
    const [thumbnail, setThumbnail] = useState(transaction?.photo_url);

    //Modal state for image preview
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null)

    const fetchCurrencies = async () => {
        const currencies = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json')
        const currencyArray = Object.entries(currencies.data).filter(([_, value]) => {
            return value
        }).map(([key, value]) => {
            return { value: key.toUpperCase(), label: key.toUpperCase() + ' - ' + value }
        })
        return currencyArray
    }

    useEffect(() => {
        fetchCurrencies()
            .then((currencies) => {
                setCurrencies(currencies);
                setCurrency(currencies.find(currency => currency.value === transaction.currency.toUpperCase()));
            })
    }, [])

    useEffect(() => {
        setTitle(transaction?.title);
        setDescription(transaction?.description);
        setDate(transaction?.date);
        setTotalAmount(transaction?.total_amount);
        setCategory(categories.find(cat => cat.value === transaction?.category));
        setPaidBy(transaction?.paid_by);
        setUpdatedSplits([]);
        setIsSplit(splits.length > 1 ? true : false);
        setThumbnail(transaction?.photo_url);
    }, [transactionObject])

    const handleAddImage = () => {
        fileInputRef.current.click()
    }

    const handleSubmit = (e) => {
        e.preventDefault(e);
        const transactionData = {
            transaction_id: transaction?.id,
            title,
            description,
            date,
            totalAmount,
            currency: currency.value,
            dateModified: DateTime.local().toISO(),
            category: category.value,
            paidBy,
            isSplit,
            image,
            photoURL: transaction?.photo_url || null,
            splits: updatedSplits
        }
        dispatch(updateTransaction({ transactionData, user_id: uid }))
            .then(() => navigate(-1))
            .catch((error) => console.error("Error updating transaction: ", error))
    }

    console.log("debugging", currency, currencies)

    return (
        <Modal show={show === 'edit-transaction'} onHide={onHide} centered>
            <Modal.Header closeButton>Edit Transaction</Modal.Header>
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
                                value={currency || null}
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
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide} variant="secondary">Cancel</Button>
                    <Button type="submit" disabled={loading}>Submit{loading && <Spinner size="sm" />}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}