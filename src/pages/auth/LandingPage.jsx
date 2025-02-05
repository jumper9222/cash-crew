import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import image01 from "../../assets/undraw_success-factors_3eki.svg"

export default function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/dashboard')
            }
        })

        return () => unsubscribe();
    }, [navigate])

    return (
        <div>
            <Container
                className="d-flex flex-column justify-content-lg-center px-3 px-md-5 pt-5 bg-light"
                style={{
                    height: "calc(100vh - 58px)"
                }}
            >
                <Row>
                    <Col className="d-flex flex-column align-items-start align-items-lg-end justify-content-center" md={5} lg={4}>
                        <div>
                            <h1>Cashcrew™</h1>
                            <p className="me-5">Your all-in-one PERSONAL and SHARED* expense tracker!</p>
                            <div className="d-flex mb-3 gap-2">
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
                            <p
                                className="text-secondary"
                                style={{ fontSize: '13px' }}
                            >* Feature coming soon</p>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
                        <Image className='mt-5 mx-auto' src={image01} fluid />
                    </Col>
                </Row>
            </Container>

        </div>
    )
}