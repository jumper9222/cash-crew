import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import TransactionRow from "../components/TransactionRow";
import { useNavigate } from "react-router-dom";

export default function AllTransactions() {
    const navigate = useNavigate();

    const transactions = useSelector((state) => state.transactions.transactions);
    console.log(transactions)
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
                    {transactions.length > 0
                        ? transactions.map((transaction, index) => (
                            <TransactionRow transaction={transaction} key={transaction.id} />
                        ))
                        : null
                    }
                    <Row>
                        <Col lg={8}>Total</Col>
                        <Col lg={4}>
                            <strong>
                                {
                                    transactions.reduce((total, transaction) => {
                                        return total + parseFloat(transaction.total_amount)
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