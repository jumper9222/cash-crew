import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import SplitRow from "../../components/SplitRow";
import { useDispatch, useSelector } from "react-redux";
import { postTransaction } from "../../features/transactions/transactionsSlice";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthProvider";

export default function CreateTransaction() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user_id = useContext(AuthContext).currentUser.uid
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
    const handleAddSplit = () => {
        setSplits([...splits, { user_id: '', amount: 0 }])
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
            .then(() => navigate('/transactions'))
            .catch((error) => console.error("Error creating transaction: ", error))
    }

    return (
        <Container>
            <Form
                onSubmit={handleSubmit}
            >
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
                <Button onClick={handleAddSplit}>Add Split</Button>
                {splits.length > 1 &&
                    <>
                        <Form.Select
                            value={splitType}
                            onChange={e => setSplitType(e.target.value)}
                        >
                            <option value="Equally">Equally</option>
                            <option value="As amounts">As amounts</option>
                            <option value="As parts">As parts</option>
                        </Form.Select>
                        {splits.map((split, index) => (
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
                    </>
                }
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    )
}