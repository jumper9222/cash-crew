import { DateTime } from "luxon";
import { useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function EditTransaction() {
    const { transaction_id } = useParams();
    const transaction = useSelector(state => state.transactions.transaction_id)

    const [title, setTitle] = useState(transaction.title);
    const [description, setDescription] = useState(transaction.description);
    const [date, setDate] = useState(transaction.date);
    const [totalAmount, setTotalAmount] = useState(transaction.total_amount);
    const [currency, setCurrency] = useState(transaction.currency);
    const [category, setCategory] = useState(transaction.category);

    return (
        <Container>
            <Form>
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
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    )
}