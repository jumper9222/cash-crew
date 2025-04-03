import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect } from "react";
import { getCurrentUserFromDB } from "../features/current-user/currentUserActions";
import { fetchFriendsByEmail } from "../features/friends/friendsActions";
import { fetchTransactionsByUser } from "../features/transactions/transactionsActions";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

export default function RequireAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = auth.currentUser;
    const userLoading = useSelector(state => state.currentUser.loading)
    const friendsLoading = useSelector(state => state.friends.loading)
    const transactionsLoading = useSelector(state => state.transactions.loading.fetchingTransactions)

    //FIXME: Fix how app fetches data on login. App crashes on first load. 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                dispatch(getCurrentUserFromDB(currentUser.uid))
                dispatch(fetchTransactionsByUser(currentUser.uid));
                dispatch(fetchFriendsByEmail(currentUser.uid));
            } else {
                console.log('User logged out: ', currentUser)
                navigate('/')
            }
        });

        return () => unsubscribe();
    }, [])


    if (!currentUser || userLoading || friendsLoading || transactionsLoading) {
        return (
            <Container
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ "height": "100vh" }}
            >
                <Spinner />
            </Container>
        )
    } else {
        return <Outlet />
    }
}