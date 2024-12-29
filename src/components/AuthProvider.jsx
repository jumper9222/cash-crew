import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        })
    }, [])

    const value = { currentUser, setCurrentUser }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export { AuthContext }