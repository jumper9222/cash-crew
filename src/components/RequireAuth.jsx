import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { getCurrentUserFromDB } from "../features/current-user/currentUserActions";
import { fetchCurrentUserFriends } from "../features/friends/friendsActions";
import { fetchTransactionsByUser } from "../features/transactions/transactionsActions";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { getLatestDateModified } from "../features/transactions/transactionsSelectors";

export default function RequireAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const uid = useSelector((state) => state.currentUser.uid);
  const userLoading = useSelector((state) => state.currentUser.loading);
  const friendsLoading = useSelector((state) => state.friends.loading);
  const transactionsLoading = useSelector(
    (state) => state.transactions.loading.fetchingTransactions
  );
  //Latest date modified from fetched transactions to sync with database
  const latestDateModified = useSelector(getLatestDateModified);

  //Get rehydrated state from redux persist
  const rehydrated = useSelector((state) => state._persist);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setCurrentUser(currentUser);
        //check if data is already in redux persist
        if (rehydrated && !uid) {
          //Fetch data if uid is not in currentUser redux state
          console.log("User logged in: ", currentUser);
          dispatch(getCurrentUserFromDB(currentUser.uid));
          dispatch(
            fetchTransactionsByUser({
              user_id: currentUser.uid,
              latestDateModified,
            })
          );
          dispatch(fetchCurrentUserFriends(currentUser.uid));
        } else if (rehydrated && uid) {
          //Don't fetch if data is rehydrated by redux persist
          console.log(
            "latest date modified: ",
            latestDateModified,
            currentUser.uid
          );
          dispatch(
            fetchTransactionsByUser({
              user_id: currentUser.uid,
              latestDateModified,
            })
          );
        }
      } else {
        setCurrentUser(null);
        console.log("User logged out: ", currentUser);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!currentUser || userLoading || friendsLoading || transactionsLoading) {
    return (
      <Container
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Spinner />
      </Container>
    );
  } else {
    return <Outlet />;
  }
}
