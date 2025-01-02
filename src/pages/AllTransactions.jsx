import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import TransactionRow from "../components/TransactionRow";
import { useNavigate } from "react-router-dom";

export default function AllTransactions() {
    const navigate = useNavigate();

    const transactions = useSelector((state) => state.transactions.transactions);
    const loading = useSelector((state) => state.transactions.loading.transactions);

    return (
        <Container>
            <h3>All Transactions</h3>
            <Row>
                <Col>
                    <h4>Expenses</h4>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/new-transaction')}
                    >
                        <i className="bi bi-plus"></i>
                    </Button>
                </Col>
                <Col>
                    <h4>Income</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    {loading ? <p>Loading...</p>
                        : Object.entries(transactions).length > 0 && !loading
                            ? Object.entries(transactions).map(([key, value]) => (
                                <TransactionRow
                                    transaction={value}
                                    key={key}
                                    onClick={() => navigate(`/transaction/${key}`)}
                                />
                            ))
                            : (<p>No transactions yet</p>)
                    }
                    <Row>
                        <Col lg={8}>Total</Col>
                        <Col lg={4}>
                            <strong>
                                {
                                    Object.entries(transactions).reduce((total, [key, value]) => {
                                        return total + parseFloat(value.total_amount)
                                    }, 0).toFixed(2)
                                }
                            </strong>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    Nothing here
                </Col>
            </Row>
        </Container>
    )
}