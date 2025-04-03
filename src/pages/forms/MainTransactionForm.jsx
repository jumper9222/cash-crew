import { Button, Form, Modal, Spinner } from "react-bootstrap";
import TransactionForm from "./TransactionForm";
import { useContext } from "react";
import { TransactionFormContext } from "../../features/transactions/TransactionFormContextProvider";
import ImageHandler from "./ImageHandler";
import { useDispatch, useSelector } from "react-redux";
import { postTransaction, updateTransaction } from "../../features/transactions/transactionsActions";

export default function MainTransactionForm() {
    const dispatch = useDispatch();
    const { showModal, onHide, formData } = useContext(TransactionFormContext)
    const user_id = useSelector(state => state.currentUser.uid);
    const loading = useSelector(state => state.transactions.loading.transactions)

    const handleSubmit = (e) => {
        e.preventDefault();
        const transactionData = {
            transactionData: {
                ...formData,
                category: formData.category.value,
                currency: formData.currency.value.toUpperCase(),
            },
            user_id
        }
        console.log('transactionData: ', transactionData)
        if (showModal === 'new') {
            dispatch(postTransaction(transactionData))
                .then(() => onHide())
        } else if (showModal === 'edit') {
            dispatch(updateTransaction(transactionData))
                .then(() => onHide())
        }

    }

    return (
        <Modal show={showModal} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{showModal === 'new' ? 'Create Transaction' : 'Edit Transaction'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <TransactionForm />
                    <ImageHandler />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={onHide}><i className="bi bi-x-lg"></i></Button>
                    <Button type='submit' disabled={loading}><i className="bi bi-check-lg"></i>{loading && <Spinner size="sm" className="ms-2" />}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}