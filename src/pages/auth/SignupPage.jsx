import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { setUserDoc } from "../../features/auth/firebaseUserActions";

export default function SignupPage() {
    const navigate = useNavigate();

    //form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(null);
    const [isPasswordValid, setIsPasswordValid] = useState(null);
    const [isFormValid, setIsFormValid] = useState(null);

    const checkFormValidity = () => {
        const form = document.querySelector('form');
        setIsFormValid(form.checkValidity());
    }

    const checkPasswordValidity = () => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,30}$/g
        setIsPasswordValid(regex.test(password))
    }

    useEffect(() => {
        checkFormValidity();
    }, [email, password, confirmPassword])

    useEffect(() => {
        checkPasswordValidity();
    }, [password])

    useEffect(() => {
        if (password === confirmPassword) {
            setPasswordsMatch(true)
        } else {
            setPasswordsMatch(false)
        }
    }, [password, confirmPassword])

    const handleSignup = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => setUserDoc(result.user))
            .then(() => navigate('/personal'))
            .catch((error) => {
                console.error(error)
            })
    }

    const handleSignupWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setUserDoc(user)
                navigate('/personal')
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error(errorCode, errorMessage, email, credential)
            });
    }

    return (
        <Container className="py-5">
            <Row>
                <Col></Col>
                <Col md={8} lg={6} xl={5}>
                    <Card>
                        <Form
                            onSubmit={handleSignup}
                        >
                            <Card.Header><Card.Title>Signup</Card.Title></Card.Header>
                            <Card.Body>
                                <div className="d-flex flex-column">
                                    <Button
                                        onClick={handleSignupWithGoogle}
                                    >
                                        <i className="bi bi-google"></i>{' '}Signup with Google
                                    </Button>
                                </div>
                                <hr />
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    className="mb-3"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    data-testid="emailInput"
                                    required
                                />
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    className="mb-2"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    data-testid="passwordInput"
                                    required
                                />
                                <Form.Text>
                                    Password should contain:
                                    <ul>
                                        <li className={/^(?=.*[A-Z]){1,}/g.test(password) ? "text-success" : "text-muted"}>One uppercase alphabet</li>
                                        <li className={/^(?=.*[a-z]){1,}/g.test(password) ? "text-success" : "text-muted"}>One lowercase alphabet</li>
                                        <li className={/^(?=.*\d){1,}/g.test(password) ? "text-success" : "text-muted"}>One digit</li>
                                        <li className={/^(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]){1,}/g.test(password) ? "text-success" : "text-muted"}>One special character</li>
                                        <li className={password.length >= 8 ? "text-success" : "text-muted"}>At least 8 characters</li>
                                    </ul>
                                </Form.Text>
                                <Form.Control
                                    className="mb-3"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
                                    data-testid="confirmPasswordInput"
                                    required
                                />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-end">
                                <Button
                                    disabled={!isFormValid || !passwordsMatch || !isPasswordValid}
                                    type="submit"
                                    data-testid="submitButton"
                                >
                                    Signup</Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </Container >
    )
}