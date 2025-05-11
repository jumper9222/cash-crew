import { Button, Col, Container, Image, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import placeHolderProfilePic from '../assets/undraw_profile-pic_fatv.svg'
import cashcrewLogo from '../assets/cash-crew-logo-no-background.png'
import { persistStore } from "redux-persist";
import store from "../store";
import { clearFriends } from "../features/friends/friendsSlice";
import { clearUser } from "../features/current-user/currentUserSlice";
import { clearTransactions } from "../features/transactions/transactionsSlice";

export default function NavigationBar() {
    const currentUser = useSelector(state => state.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const persistor = persistStore(store);

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                persistor.purge();
                dispatch(clearUser());
                dispatch(clearFriends());
                dispatch(clearTransactions());
                console.log('persistor', persistor)
            })
            .then(() => navigate('/'))
    }

    return (
        <>
            <Navbar
                bg="navbars"
                className="d-flex justify-content-between position-sticky sticky-top"
            >
                <Container
                    className="m-0"
                >
                    <Navbar.Brand
                        className="ms-3"
                        href={currentUser?.uid ? '/dashboard' : '/'}
                    >
                        <div className="d-flex position-relative">
                            <Image src={cashcrewLogo} height='32px' width='32px' className="me-1" />
                            <div className="position-absolute" style={{ left: '38px', top: '1px', fontWeight: '500', fontSize: '24px' }}>Cashcrew</div>
                        </div>
                    </Navbar.Brand>
                    {currentUser?.uid ?
                        <NavDropdown
                            className="pe-4"
                            align='end'
                            title={
                                <span>
                                    <Image
                                        style={{ width: "34px", height: '34px', marginRight: "9px" }}
                                        src={currentUser?.photoURL || placeHolderProfilePic}
                                        roundedCircle
                                    />
                                    <span className="d-none d-sm-inline">{currentUser?.displayName || currentUser.email}</span>
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
                </Container>
            </Navbar >
            <Outlet />
            <div
                className="p-5 bg-navbars"
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