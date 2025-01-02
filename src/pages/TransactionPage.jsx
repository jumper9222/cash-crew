import { Button, Container, Modal, Placeholder, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTransaction, fetchTransactionFromId } from "../features/transactions/transactionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthProvider";

export default function TransactionPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState('')

    const { transaction_id } = useParams();
    const user_id = useContext(AuthContext).currentUser.uid
    const { transaction, splits } = useSelector(fetchTransactionFromId(transaction_id))
    const loading = useSelector(state => state.transactions.loading.transactions)

    const formattedDate = DateTime.fromISO(transaction?.date).toFormat('EEEE, dd MMMM yyyy')

    const handleDelete = () => {
        dispatch(deleteTransaction({ transaction_id, user_id }))
            .then(() => navigate(-1))
    }

    return (
        <Container>
            <div className="d-flex">
                <Button
                    onClick={() => navigate(-1)}
                    variant="secondary"
                >
                    <i className="bi bi-arrow-left"></i>
                </Button>
                <Button
                    onClick={() => setShowModal('delete')}
                    variant="danger"
                    className="ms-auto"
                >
                    <i className="bi bi-trash"></i>
                </Button>
            </div>
            <Row>
                {!loading ?
                    <>
                        <h3>{transaction?.title + ' ' || null}<i className="bi bi-pencil" onClick={() => navigate(`/edit-transaction/${transaction_id}`)}></i></h3>
                        <p>{formattedDate}</p>
                        <p>{transaction?.category || null}</p>
                        <p>{transaction?.description || null}</p>
                        <h3>{`${transaction?.total_amount} ${transaction?.currency}`}</h3>
                    </>
                    :
                    <>
                        <Placeholder animation="glow" as="h3">
                            <Placeholder md={4} />
                        </Placeholder>
                        <Placeholder animation="glow" as="p">
                            <Placeholder md={5} /><br />
                            <Placeholder md={5} /><br />
                            <Placeholder md={5} />
                        </Placeholder>
                        <Placeholder animation="glow" as="h3">
                            <Placeholder md={4} />
                        </Placeholder>
                    </>
                }
            </Row>
            <Modal show={showModal === "delete"} centered>
                <Modal.Body>
                    Are you sure you want to delete this transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal('')}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}