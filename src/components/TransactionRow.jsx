import { Card, Col, Row } from "react-bootstrap";
import '../app.css'

export default function TransactionRow({ transaction, onClick }) {
    return (
        <>
            <Card
                className="mb-1 transaction-row-card"
            >
                <Card.Body onClick={onClick}>
                    <Row className="m-0 p-0">
                        <Col
                            className="m-0 p-0"
                            lg={8}
                        >
                            {transaction.title}
                        </Col>
                        <Col className="d-flex m-0 p-0 pe-1 justify-content-end" lg={4}>
                            {transaction.total_amount}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}