import { Button, Col, Image, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../features/current-user/currentUserSlice";
import placeHolderProfilePic from '../assets/undraw_profile-pic_fatv.svg'
import cashcrewLogo from '../assets/cash-crew-logo-no-background.png'

export default function NavigationBar() {
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        auth.signOut()
            .then(() => dispatch(clearUser()))
            .then(() => navigate('/'))
    }

    return (
        <>
            <Navbar
                className="d-flex justify-content-between"
                style={{ background: '#f2f0e4', position: "sticky", top: "0", zIndex: "1000" }}
            >
                <Navbar.Brand
                    className="ms-3"
                    href={currentUser?.uid ? '/dashboard' : '/'}
                >
                    <div className="d-flex position-relative">
                        <Image src={cashcrewLogo} height='32px' width='32px' className="me-1" />
                        <div className="position-absolute" style={{ left: '38px', top: '1px', fontWeight: '500', color: '#282740', fontSize: '24px' }}>Cashcrew</div>
                    </div>
                </Navbar.Brand>
                {currentUser?.uid ?
                    <NavDropdown
                        className="me-4"
                        title={
                            <span>
                                <Image
                                    style={{ width: "34px", height: '34px', marginRight: "9px" }}
                                    src={currentUser?.photoURL || placeHolderProfilePic}
                                    roundedCircle
                                />
                                {currentUser?.displayName || currentUser.email}
                            </span>
                        }>
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
                    : <div className="me-4 d-flex gap-2">
                        <Button
                            style={{
                                background: "#bdb275",
                                border: "#b4a864"
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                        <Button
                            style={{
                                background: "#bdb275",
                                border: "#b4a864"
                            }}
                            onClick={() => navigate('/signup')}
                        >
                            Signup
                        </Button>
                    </div>
                }
            </Navbar >
            <Outlet />
            <div
                className="p-5"
                style={{
                    backgroundColor: '#f2f0e4',
                }}
            >
                <Row>
                    <Col sm={9} className="d-flex align-items-center">
                        © Cashcrew Terms of Service | Privacy Policy
                    </Col>
                    <Col sm={3} className="d-flex flex-row justify-content-end gap-2">
                        <Button variant="secondary rounded-circle"><i className="bi bi-facebook"></i></Button>
                        <Button variant="secondary rounded-circle"><i className="bi bi-instagram"></i></Button>
                        <Button variant="secondary rounded-circle"><i className="bi bi-twitter"></i></Button>
                    </Col>
                </Row >
            </div >
        </>
    )
}