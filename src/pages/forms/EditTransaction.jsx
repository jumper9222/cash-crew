import { DateTime } from "luxon";
import { useState, useEffect, useRef } from "react";
import { Button, Form, Image, InputGroup, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateTransaction } from "../../features/transactions/transactionsAsyncThunks";
import axios from "axios";

export default function EditTransaction({ show, onHide, transactionObject }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { uid, settings } = useSelector(state => state.currentUser)

    const loading = useSelector(state => state.transactions.loading.transactions)
    const { transaction, splits } = transactionObject

    const [title, setTitle] = useState(transaction?.title);
    const [description, setDescription] = useState(transaction?.description);
    const [date, setDate] = useState(transaction?.date);
    const [totalAmount, setTotalAmount] = useState(transaction?.total_amount);
    const [currency, setCurrency] = useState(transaction?.currency.toUpperCase());
    const [category, setCategory] = useState(transaction?.category);
    const [paidBy, setPaidBy] = useState(uid);
    const [image, setImage] = useState(null);
    const [updatedSplits, setUpdatedSplits] = useState([]);
    const [isSplit, setIsSplit] = useState(splits.length > 1 ? true : false);
    const [currencies, setCurrencies] = useState({})
    const [thumbnail, setThumbnail] = useState(transaction?.photo_url);

    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null)

    const fetchCurrencies = async () => {
        const currencies = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json')
        return currencies.data
    }

    useEffect(() => {
        setTitle(transaction?.title);
        setDescription(transaction?.description);
        setDate(transaction?.date);
        setTotalAmount(transaction?.total_amount);
        setCurrency(transaction?.currency.toUpperCase());
        setCategory(transaction?.category);
        setPaidBy(transaction?.paid_by);
        setUpdatedSplits([]);
        setIsSplit(splits.length > 1 ? true : false);
        setThumbnail(transaction?.photo_url);
    }, [transactionObject])

    useEffect(() => {
        fetchCurrencies().then((currencies) => {
            setCurrencies(currencies)
        })
    }, [])

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
            currency,
            dateModified: DateTime.local().toISO(),
            category,
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
                            <option>Select currency</option>
                            {Object.entries(currencies).map(([key, value]) => {
                                return (
                                    <option key={key} value={key.toUpperCase()}>{key.toUpperCase()} - {value}</option>
                                )
                            })}
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
                            {settings.categories.map((category, i) => (
                                <option key={i} value={category}>{category}</option>
                            ))}
                        </Form.Select>
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