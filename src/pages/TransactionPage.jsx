import { Button, Card, Image, Modal, Placeholder, Row, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { convertToDefaultCurrency, deleteTransaction } from "../features/transactions/transactionsActions";
import { fetchTransactionFromId } from "../features/transactions/transactionsSelectors";
import { selectFriendDisplayNameById } from "../features/friends/friendsSelector";
import ImagePreview from "../components/ImagePreview";
import { TransactionFormContext } from "../features/transactions/TransactionFormContextProvider";

export default function TransactionPage() {
    //Defining react router functions
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showEditTransModal } = useContext(TransactionFormContext)

    //React states
    const [showModal, setShowModal] = useState('')
    const [convertedAmount, setConvertedAmount] = useState(0)

    //Params and Contexts
    const { transaction_id } = useParams();
    const currentUser = useSelector(state => state.currentUser)
    const { uid: user_id, displayName, settings } = currentUser

    //Selectors
    const { transaction, splits } = useSelector(fetchTransactionFromId(transaction_id));
    const splitEntries = Object.entries(splits);
    const categories = useSelector(state => state.currentUser.settings.categories);

    const loading = useSelector(state => state.transactions.loading.transactions)

    const formattedDate = DateTime.fromISO(transaction?.date).toFormat('EEEE, dd MMMM yyyy')

    //useEffects
    //Convert transaction amount
    useEffect(() => {
        if (transaction && transaction.currency !== settings.defaultCurrency) {
            dispatch(convertToDefaultCurrency({
                amount: transaction?.total_amount,
                transactionDate: transaction?.date,
                transactionCurrency: transaction?.currency.toLowerCase(),
                defaultCurrency: settings?.defaultCurrency.toLowerCase()
            }))
                .unwrap()
                .then((result) => {
                    setConvertedAmount(result.toFixed(2))
                })
                .catch((error) => console.error('There was a problem converting the amount: ', error.message))
        }
    }, [transaction])

    //Functions
    const onHide = () => {
        setShowModal('')
    }

    const handleDelete = () => {
        dispatch(deleteTransaction({ transaction_id, user_id: user_id, photo_url: transaction.photo_url }))
            .then(() => {
                onHide();
                navigate('/expenses')
            })
    }

    //Return
    return (
        <Card>
            <Card.Header className="d-flex ">
                <div>
                    <Button
                        onClick={() => navigate('/expenses')}
                        variant="secondary"
                        size="sm"
                    >
                        <i className="bi bi-x-lg"></i>
                    </Button>
                </div>
                <div className="ms-auto">

                    <Button
                        onClick={showEditTransModal}
                        variant="secondary"
                        size="sm"
                        disabled={loading}
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
            </Card.Header>
            <Card.Body>
                {!loading ?
                    <>
                        <h4 className="mb-0">
                            {categories[transaction?.category]?.emoji || '📃'}
                            {transaction?.title + ' ' || null}
                            {transaction?.is_split && <i className="bi bi-people-fill fs-6 text-secondary"></i>}
                        </h4>
                        <p className="mb-0 text-secondary">{categories[transaction?.category]?.name || transaction?.category || null}</p>
                        <p className="mb-3">{formattedDate}</p>
                        <p className="mb-0 text-secondary">{transaction?.is_split ? 'Your share' : 'Total amount'}</p>
                        <h5 className="mb-3">
                            {`${transaction?.is_split ? splits[user_id].split_amount : transaction?.total_amount} ${transaction?.currency.toUpperCase()} `}
                            {
                                transaction?.currency !== settings.defaultCurrency &&
                                <>
                                    <i className="bi bi-currency-exchange text-secondary"></i>
                                    {` ${convertedAmount} ${settings.defaultCurrency}`}
                                </>
                            }
                        </h5>
                        {transaction?.photo_url &&
                            <>
                                <p className="text-secondary mb-0">Photo</p>
                                <Image className='mb-3' src={transaction?.photo_url} width='64px' onClick={() => setShowModal('image-preview')} fluid />
                                <ImagePreview show={showModal === 'image-preview'} image={transaction?.photo_url} onHide={onHide} />
                            </>
                        }
                        {transaction?.description &&
                            <Card>
                                <Card.Body className="p-2">
                                    <p className="text-secondary mb-0">Description</p>
                                    {transaction?.description}
                                </Card.Body>
                            </Card>
                        }
                        {transaction?.is_split &&
                            <>
                                <p className="mt-3 mb-1 ps-2">Splits</p>
                                <Table bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Total amount</th>
                                            <th>{settings.currency === transaction?.currency ? transaction?.total_amount : convertedAmount}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {splitEntries.map(([key, value]) => (
                                            <SplitRow
                                                currentUser={currentUser}
                                                split={{ ...value, split_uid: key }}
                                            />
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        }
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
            </Card.Body>
            <Modal show={showModal === "delete"} onHide={onHide} centered>
                <Modal.Body>
                    Are you sure you want to delete this transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>Delete {loading && <Spinner size="sm" />}</Button>
                </Modal.Footer>
            </Modal>
        </Card >
    )
}

function SplitRow({ currentUser, split }) {
    const { uid: user_id, displayName: currentUserDisplayName } = currentUser
    const { split_amount, split_uid } = split
    const displayName = split_uid === user_id ? currentUserDisplayName : useSelector(selectFriendDisplayNameById(split_uid))
    console.log('split row: ', currentUser, split)

    return (
        <tr>
            <td>{split_uid === user_id ? currentUserDisplayName : displayName}</td>
            <td>{split_amount}</td>
        </tr>
    )
}

