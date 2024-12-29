import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(null);

    const checkFormValidity = () => {
        const form = document.querySelector('form');
        setIsFormValid(form.checkValidity());
    }

    useEffect(() => {
        checkFormValidity();
    }, [email, password])

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                console.log(result);
                navigate('/dashboard')
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const handleLoginWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                navigate('/dashboard')
            })
            .catch((error) => {
                console.error(error);
            })
    }

    return (
        <Container>
            <Button
                onClick={handleLoginWithGoogle}
            >
                <i className="bi bi-google"></i>{' '}Login with Google
            </Button>
            <Form
                onSubmit={handleLogin}
            >
                <Form.Label>Login</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    data-testid="emailInput"
                    required
                />
                <Form.Label>Login</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    data-testid="passwordInput"
                    required
                />
                <Button
                    disabled={!isFormValid}
                    type="submit"
                    data-testid="submitButton"
                >
                    Login</Button>
            </Form>
        </Container>
    )
}