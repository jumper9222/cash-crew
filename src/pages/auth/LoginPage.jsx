import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkFormValidity = () => {
        const form = document.querySelector('form');
        setIsFormValid(form.checkValidity());
    }

    useEffect(() => {
        checkFormValidity();
    }, [email, password])

    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                console.log(result);
                setLoading(false);
                navigate('/dashboard')
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            })
    }

    const handleLoginWithGoogle = () => {
        setLoading(true);
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                setLoading(false);
                navigate('/dashboard')
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            })
    }

    return (
        <Container
            className="pt-5 bg-light"
            style={{
                height: "calc(100vh - 58px)"
            }}
        >
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
                                    disabled={!isFormValid || loading}
                                    type="submit"
                                    data-testid="submitButton"
                                >
                                    Login {loading && <Spinner size="sm" />}</Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </Container >
    )
}