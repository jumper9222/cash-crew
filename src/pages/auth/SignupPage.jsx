import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

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
            .then((result) => {
                console.log(result);
                navigate('/dashboard')
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handleSignupWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                console.log(user, token)
                navigate('/dashboard')
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
        <Container>
            <Button
                onClick={handleSignupWithGoogle}
            >
                <i className="bi bi-google"></i>{' '}Signup with Google
            </Button>
            <Form
                onSubmit={handleSignup}
            >
                <Form.Label>Signup</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    data-testid="emailInput"
                    required
                />
                <Form.Label>Signup</Form.Label>
                <Form.Control
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
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    data-testid="confirmPasswordInput"
                    required
                />
                <Button
                    disabled={!isFormValid || !passwordsMatch || !isPasswordValid}
                    type="submit"
                    data-testid="submitButton"
                >
                    Signup</Button>
            </Form>
        </Container >
    )
}