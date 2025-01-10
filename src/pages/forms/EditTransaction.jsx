import { DateTime } from "luxon";
import { useContext, useState } from "react";
import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthProvider";
import { updateTransaction } from "../../features/transactions/transactionsAsyncThunks";

export default function EditTransaction({ show, onHide, transactionObject }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user_id = useContext(AuthContext).currentUser.uid

    const loading = useSelector(state => state.transactions.loading.transactions)
    const { transaction, splits } = transactionObject

    const [title, setTitle] = useState(transaction?.title);
    const [description, setDescription] = useState(transaction?.description);
    const [date, setDate] = useState(transaction?.date);
    const [totalAmount, setTotalAmount] = useState(transaction?.total_amount);
    const [currency, setCurrency] = useState(transaction?.currency);
    const [category, setCategory] = useState(transaction?.category);
    const [paidBy, setPaidBy] = useState(user_id);
    const [updatedSplits, setUpdatedSplits] = useState([]);
    const [isSplit, setIsSplit] = useState(splits.length > 1 ? true : false);

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
            splits: updatedSplits
        }
        dispatch(updateTransaction({ transactionData, user_id }))
            .then(() => navigate(-1))
            .catch((error) => console.error("Error updating transaction: ", error))
    }

    return (
        <Modal show={show === 'edit-transaction'} onHide={onHide} centered>
            <Modal.Header>Edit Transaction</Modal.Header>
            <Form onSubmit={handleSubmit}>
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
                            onChange={e => {
                                setDate(e.target.value)
                                console.log(date)
                            }}
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
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide} variant="secondary">Cancel</Button>
                    <Button type="submit" disabled={loading}>Submit{loading && <Spinner size="sm" />}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}