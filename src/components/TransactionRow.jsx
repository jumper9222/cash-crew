import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function TransactionRow({ transaction, onClick, category }) {
    const { settings } = useSelector(state => state.currentUser)

    return (
        <ListGroup.Item className="pe-0" onClick={onClick}>
            <Row className="m-0 p-0">
                <Col xs='auto' className="text-start ps-0">{category?.emoji || '📃'}</Col>
                <Col
                    className="m-0 p-0"
                >
                    {transaction.title}
                    {' '}
                    <div className="d-inline-block ms-1">
                        {transaction.is_split && <i className="bi bi-people-fill text-secondary"> </i>}
                        {transaction.currency !== settings.defaultCurrency && <i className="bi bi-currency-exchange text-secondary"> </i>}
                        {transaction.photo_url && <i className="bi bi-camera-fill text-secondary"> </i>}
                    </div>
                </Col>
                <Col className="text-end fw-semibold m-0 p-0 ms-3" xs={'auto'}>
                    {transaction.total_amount}
                </Col>
                <Col className='text-end' xs={'auto'}>
                    {transaction.currency}
                </Col>
            </Row>
        </ListGroup.Item >
    )
}