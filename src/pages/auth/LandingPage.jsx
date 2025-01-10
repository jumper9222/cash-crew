import { useContext, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthProvider";

export default function LandingPage() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (currentUser) {
            navigate("/personal")
        }
    })

    return (
        <Container className="py-5 ">
            <h1>Cashcrew</h1>
            <p>Your all-in-one PERSONAL and SHARED expense tracker!</p>
            <div className="d-flex gap-2">
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
            </div>
        </Container>
    )
}