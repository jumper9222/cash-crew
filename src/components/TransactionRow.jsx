import { Col, Row } from "react-bootstrap";

export default function TransactionRow({ transaction }) {
    return (
        <>
            <Row>
                <Col lg={8}>{transaction.title}</Col>
                <Col lg={4}>{transaction.total_amount}</Col>
            </Row>
        </>
    )
}