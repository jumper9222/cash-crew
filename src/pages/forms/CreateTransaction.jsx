import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";
import SplitRow from "../../components/SplitRow";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthProvider";
import { postTransaction } from "../../features/transactions/transactionsAsyncThunks";

export default function CreateTransaction({ show, onHide }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user_id = useContext(AuthContext).currentUser.uid
    const email = useContext(AuthContext).currentUser.email
    const loading = useSelector((state) => state.transactions.loading.transactions)

    //form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const currentDate = DateTime.local().toFormat('yyyy-MM-dd');
    const [date, setDate] = useState(currentDate);
    const [totalAmount, setTotalAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [category, setCategory] = useState('');
    const [isSplit, setIsSplit] = useState(false)

    //split states
    const [splits, setSplits] = useState([]);
    const [splitUsers, setSplitUsers] = useState([email])
    const [splitUsersInput, setSplitUsersInput] = useState('')
    const [splitType, setSplitType] = useState('Equally');
    const [splitsAreValid, setSplitsAreValid] = useState(true);

    //split use effect
    useEffect(() => {
        if (splitType === "Equally") {
            setSplits(splits.map((split) => {
                return { ...split, amount: parseFloat(totalAmount / splits.length).toFixed(2) }
            }))
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
            return total + parseFloat(split.amount)
        }, 0)

        if (splitSum === totalAmount) {
            setSplitsAreValid(true)
        } else (
            setSplitsAreValid(false)
        )
    }, [splits, totalAmount])

    //handle functions
    const handleSplitTransaction = () => {
        setIsSplit(true)
        setSplits([{ user_id: user_id, amount: 0 }])
    }

    const handleDeleteSplit = (index) => {
        setSplits(splits.filter((_, i) => index !== i))
    }

    const handleUserIdChange = (index, user_id) => {
        setSplits(splits.map((split, i) => {
            if (i === index) {
                return { ...split, user_id: user_id }
            }
            return split
        }))
    }

    const handleSplitAmountChange = (index, amount) => {
        setSplits(splits.map((split, i) => {
            if (i === index) {
                return { ...split, amount: amount }
            }
            return split
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const transactionData = {
            title,
            description,
            date,
            totalAmount,
            currency,
            category,
            isSplit,
            splits
        }
        console.log(transactionData)
        dispatch(postTransaction({ transactionData, user_id }))
            .then(
                () => {
                    navigate('/personal/expenses');
                    onHide();
                }
            )
            .catch((error) => console.error("Error creating transaction: ", error))
    }

    return (
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
                            required
                        />
                        <Form.Select
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            required
                        >
                            <option>MYR</option>
                            <option value="MYR">MYR</option>
                        </Form.Select>
                    </InputGroup>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                        >
                            <option>Select a Category</option>
                            <option value="Eating Out">Eating Out</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Utilities">Utilities</option>
                        </Form.Select>
                    </Form.Group>
                    {!isSplit && <Button onClick={handleSplitTransaction}>Split Transaction</Button>}
                    {isSplit &&
                        <div className="d-flex flex-column gap-2">
                            <Form.Label>Split</Form.Label>
                            <Form.Select
                                value={splitType}
                                onChange={e => setSplitType(e.target.value)}
                            >
                                <option value="Equally">Equally</option>
                                <option value="As amounts">As amounts</option>
                                <option value="As parts">As parts</option>
                            </Form.Select>
                            <Form.Control
                                type='text'
                                value={splitUsersInput}
                                onChange={(e) => setSplitUsersInput(e.target.value)}
                                onBlur={(e) => {
                                    const splitUsersArray = e.target.value.split(',').map((entry) => {
                                        return entry.trim().toLowerCase()
                                    })
                                    setSplitUsers([user_id, ...splitUsersArray])
                                }}
                                placeholder="Enter an email address"
                            />
                            {/* continue here, add friends feature first */}
                            {splitUsers.map((email, index) => (
                                <SplitRow
                                    key={index}
                                    index={index}
                                    amount={split.amount}
                                    user_id={split.user_id}
                                    handleDeleteSplit={handleDeleteSplit}
                                    handleSplitAmountChange={handleSplitAmountChange}
                                    handleUserIdChange={handleUserIdChange}
                                />
                            ))}
                            {!splitsAreValid ? <Form.Text className="text-danger">Splits do not add up.</Form.Text> : null}
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" disabled={loading}>Submit {loading && <Spinner />}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}