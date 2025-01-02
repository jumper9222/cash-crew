import { Col, Row } from "react-bootstrap";

export default function TransactionRow({ transaction, onClick }) {
    return (
        <>
            <Row onClick={onClick}>
                <Col lg={8}>{transaction.title}</Col>
                <Col lg={4}>{transaction.total_amount}</Col>
            </Row>
        </>
    )
}