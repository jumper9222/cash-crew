import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import React from "react";
import { DateTime } from "luxon";
import TransactionRow from "../../components/TransactionRow";
import PersonalAndSharedTabs from "../../components/PersonalAndSharedTabs";
import { groupPersonalTransactionsByDate } from "../../features/transactions/transactionsSelectors";

export default function PersonalExpenses() {
    const navigate = useNavigate();
    const params = useParams();

    const { uid } = useSelector(state => state.currentUser)
    const groupedTransactions = useSelector(groupPersonalTransactionsByDate(uid))
    const loading = useSelector((state) => state.transactions.loading.transactions);

    const handleOpenTransaction = (transaction_id) => {
        if (params.transaction_id !== transaction_id) {
            navigate(`/expenses/personal/${transaction_id}`)
        } else {
            navigate('/expenses')
        }
    }

    return (
        <Container>
            <Row>
                < h3 className="mb-3">Expenses</h3>
                <Col className="d-flex flex-column">
                    <div>
                        <PersonalAndSharedTabs currentPage='/expenses' />
                    </div>
                    {loading ? <p>Loading...</p>
                        : groupedTransactions.length > 0 && !loading
                            ? groupedTransactions.map(([date, transactions]) => {
                                const currentDate = DateTime.fromISO(date).toFormat('dd MMMM yyyy, EEEE')
                                return (
                                    <React.Fragment key={date}>
                                        <p className="text-secondary mb-1 ps-1">{currentDate}</p>
                                        <ListGroup className="mb-3">
                                            {transactions.map((transaction) => (
                                                <TransactionRow
                                                    key={transaction.id}
                                                    transaction={transaction}
                                                    onClick={() => handleOpenTransaction(transaction.id)}
                                                />
                                            ))}
                                        </ListGroup>
                                    </React.Fragment>
                                )
                            })
                            : (<p>No transactions yet</p>)
                    }
                </Col>
                <Col style={{ position: "sticky", top: "86px", alignSelf: "flex-start" }}>
                    <Outlet />
                </Col>
            </Row>
        </Container >
    )
}