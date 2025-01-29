import { Card, Col, ListGroup, Row } from "react-bootstrap";
import '../app.css'
import { useSelector } from "react-redux";

export default function TransactionRow({ transaction, onClick }) {
    const { settings } = useSelector(state => state.currentUser)

    return (
        <ListGroup.Item onClick={onClick}>
            <Row className="m-0 p-0">
                <Col
                    className="m-0 p-0"
                >
                    {transaction.title}
                    {' '}
                    {transaction.is_split && <i className="bi bi-people-fill text-secondary me-1"></i>}
                    {transaction.currency !== settings.defaultCurrency && <i className="bi bi-currency-exchange text-secondary me-1"></i>}
                    {transaction.photo_url && <i className="bi bi-camera-fill text-secondary me-1"></i>}
                </Col>
                <Col className="d-flex m-0 p-0 pe-1 justify-content-end" xs lg={3}>
                    <span className="fw-semibold">{transaction.total_amount}</span>
                </Col>
                <Col className='justify-content-end' xs md={2} lg={1}>
                    {transaction.currency}
                </Col>
            </Row>
        </ListGroup.Item >
    )
}