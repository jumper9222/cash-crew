import { useContext, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

export default function HomePage() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (currentUser) {
            navigate("/dashboard")
        }
    })

    return (
        <Container>
            <h1>Cashcrew</h1>
            <Button
                onClick={() => navigate('/signup')}
            >
                Sign up now
            </Button>
            <Button
                onClick={() => navigate('/login')}
            >
                Sign in
            </Button>
        </Container>
    )
}