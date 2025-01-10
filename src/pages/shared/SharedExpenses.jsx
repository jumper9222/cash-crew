import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import TransactionRow from "../../components/TransactionRow";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { DateTime } from "luxon";
import CreateTransaction from "../forms/CreateTransaction";

export default function SharedExpenses() {
    const navigate = useNavigate();
    const params = useParams();

    const transactions = useSelector(state => state.transactions.transactions);
    const transactionIds = useSelector(state => state.transactions.transactionIds);
    const loading = useSelector((state) => state.transactions.loading.transactions);

    const [show, setShow] = useState('');

    const onHide = () => {
        setShow('')
    }

    const handleOpenTransaction = (transaction_id) => {
        if (!params.transaction_id) {
            navigate(`/personal/expenses/${transaction_id}`)
        } else {
            navigate('/personal/expenses')
        }
    }

    return (
        <Container>
            <Row>
                <Col className="d-flex flex-column">
                    <h4 className="mb-3">Shared Expenses</h4>
                    <Card
                        onClick={() => setShow('add-transaction')}
                    >
                        <Card.Body
                            className="d-flex justify-content-center "
                        >
                            <i className="bi bi-plus"></i>
                        </Card.Body>
                    </Card>
                    {loading ? <p>Loading...</p>
                        : transactionIds.length > 0 && !loading
                            ? transactionIds.map((id, index) => {
                                const prevId = index !== 0 ? transactionIds[index - 1] : null
                                console.log(id, prevId)
                                const currentDate = DateTime.fromISO(transactions[id].date).toFormat('EEEE, dd MMMM yyyy')
                                const prevDate = prevId !== null ? DateTime.fromISO(transactions[prevId].date).toFormat('EEEE, dd MMMM yyyy') : null
                                console.log("next date", prevDate, 'Current date: ', currentDate, transactions[id], transactions[prevId])

                                if (index === 0 || prevDate !== currentDate) {
                                    return (
                                        <React.Fragment key={id}>
                                            <h5 className="mt-2">{currentDate}</h5>
                                            <TransactionRow
                                                transaction={transactions[id]}
                                                onClick={() => handleOpenTransaction(id)}
                                            />
                                        </React.Fragment>
                                    )
                                } else if (prevDate === currentDate) {
                                    return (
                                        <TransactionRow
                                            transaction={transactions[id]}
                                            key={id}
                                            onClick={() => handleOpenTransaction(id)}
                                        />
                                    )
                                }
                            })
                            : (<p>No transactions yet</p>)
                    }
                    <Card style={{ "border": "0px" }}>
                        <Card.Body>
                            <Row>
                                <Col lg={8}>Total</Col>
                                <Col
                                    lg={4}
                                    className="d-flex m-0 p-0 pe-3 justify-content-end"
                                >
                                    <strong>
                                        {
                                            Object.values(transactions).reduce((total, value) => {
                                                return total + parseFloat(value.total_amount)
                                            }, 0).toFixed(2)
                                        }
                                    </strong>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Outlet />
                </Col>
            </Row>
            <CreateTransaction show={show} onHide={onHide} />
        </Container>
    )
}