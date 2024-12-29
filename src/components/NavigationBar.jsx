import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export default function NavigationBar() {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        setCurrentUser(null);
        navigate('/');
    }

    return (
        <>
            <Navbar>
                <Container>
                    <Navbar.Brand>
                        Cashcrew
                    </Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    {currentUser &&
                        <Button
                            variant="danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>

                    }
                </Container >
            </Navbar>
            <Outlet />
        </>
    )
}