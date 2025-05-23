import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { fetchTransactionsByUser } from "../features/transactions/transactionsActions";
import { fetchFriendsByEmail } from "../features/friends/friendsActions";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchTransactionsByUser(currentUser.uid))
            dispatch(fetchFriendsByEmail(currentUser.uid))
        }
    }, [currentUser])

    const value = { currentUser, setCurrentUser, loading, setLoading }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export { AuthContext }