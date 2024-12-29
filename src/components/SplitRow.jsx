import { Button, Form, InputGroup } from "react-bootstrap";

export default function SplitRow({ amount, user_id, index, handleDeleteSplit, handleUserIdChange, handleSplitAmountChange }) {
    return (
        <>
            <InputGroup>
                <Form.Select
                    value={user_id}
                    onChange={e => handleUserIdChange(index, e.target.value)}
                >
                    <option value="Person 1">Person 1</option>
                    <option value="Person 2">Person 2</option>
                    <option value="Person 3">Person 3</option>
                </Form.Select>
                <Form.Control
                    type="number"
                    value={amount}
                    onChange={e => handleSplitAmountChange(index, e.target.value)}
                    onBlur={() => {
                        if (amount) {
                            handleSplitAmountChange(index, parseFloat(amount).toFixed(2))
                        }
                    }}
                    step="0.01"
                />
            </InputGroup>
            <Button onClick={() => handleDeleteSplit(index)}>Delete</Button>
        </>
    )
}