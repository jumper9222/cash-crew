import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
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
            <Navbar
                style={{ 'background': '#6B8E23' }}
            >
                <Container>
                    <Navbar.Brand
                        href='/'
                    >
                        Cashcrew
                    </Navbar.Brand>
                    {currentUser ?
                        <NavDropdown title="Current user">
                            <NavDropdown.Item href="/profile">
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={handleLogout}
                            >
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                        : <div className="d-flex gap-2">
                            <Button
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => navigate('/signup')}
                            >
                                Signup
                            </Button>
                        </div>
                    }
                </Container >
            </Navbar>
            <Outlet />
        </>
    )
}