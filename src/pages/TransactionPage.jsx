import { Button, Container, Modal, Placeholder, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthProvider";
import { deleteTransaction } from "../features/transactions/transactionsAsyncThunks";
import { fetchTransactionFromId } from "../features/transactions/transactionsSelectors";
import EditTransaction from "./forms/EditTransaction";

export default function TransactionPage() {
    //Defining react router functions
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //React states
    const [showModal, setShowModal] = useState('')

    //Params and Contexts
    const { transaction_id } = useParams();
    const user_id = useContext(AuthContext).currentUser.uid

    //Selectors
    const { transaction, splits } = useSelector(fetchTransactionFromId(transaction_id))
    const loading = useSelector(state => state.transactions.loading.transactions)

    const formattedDate = DateTime.fromISO(transaction?.date).toFormat('EEEE, dd MMMM yyyy')


    //Functions
    const onHide = () => {
        setShowModal('')
    }

    const handleDelete = () => {
        dispatch(deleteTransaction({ transaction_id, user_id }))
            .then(() => navigate('/personal/expenses'))
    }

    //Return
    return (
        <Container>
            <div className="d-flex mb-3">
                <div>
                    <Button
                        onClick={() => navigate('/personal/expenses')}
                        variant="secondary"
                        size="sm"
                    >
                        <i className="bi bi-x-lg"></i>
                    </Button>
                </div>
                <div className="ms-auto">

                    <Button
                        onClick={() => setShowModal('edit-transaction')}
                        variant="secondary"
                        size="sm"
                    >
                        <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                        onClick={() => setShowModal('delete')}
                        variant="danger"
                        className="ms-1"
                        size="sm"
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                </div>
            </div>
            <Row>
                {!loading ?
                    <>
                        <h4>{transaction?.title + ' ' || null}</h4>
                        <p>{formattedDate}</p>
                        <p>{transaction?.category || null}</p>
                        <p>{transaction?.description || null}</p>
                        <h5>{`${transaction?.total_amount} ${transaction?.currency}`}</h5>
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
            <Modal show={showModal === "delete"} onHide={onHide} centered>
                <Modal.Body>
                    Are you sure you want to delete this transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
            {
                !loading && transaction &&
                <EditTransaction show={showModal} onHide={onHide} transactionObject={{ transaction, splits }} />
            }
        </Container>
    )
}