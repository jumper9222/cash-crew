import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
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
                navigate('/personal')
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const handleLoginWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                navigate('/personal')
            })
            .catch((error) => {
                console.error(error);
            })
    }

    return (
        <Container className="pt-5">
            <Row>
                <Col></Col>
                <Col md={8} lg={6} xl={5}>
                    <Card>
                        <Card.Header><Card.Title>Login</Card.Title></Card.Header>
                        <Form
                            onSubmit={handleLogin}
                        >
                            <Card.Body>
                                <div className="d-flex flex-column">
                                    <Button
                                        onClick={handleLoginWithGoogle}
                                    >
                                        <i className="bi bi-google"></i>{' '}Login with Google
                                    </Button>
                                </div>
                                <hr />
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    data-testid="emailInput"
                                    required
                                />
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    data-testid="passwordInput"
                                    required
                                />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-end">
                                <Button
                                    disabled={!isFormValid}
                                    type="submit"
                                    data-testid="submitButton"
                                >
                                    Login</Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </Container >
    )
}