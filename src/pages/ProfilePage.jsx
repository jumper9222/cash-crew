import { useState } from "react";
import { Button, Card, Col, Container, Form, Image, ListGroup, Row, Spinner } from "react-bootstrap";
import { updateBasicInfo } from "../features/current-user/currentUserActions";
import { useDispatch, useSelector } from "react-redux";
import placeHolderProfilePic from '../assets/undraw_profile-pic_fatv.svg'

export default function ProfilePage() {
    //Import dispatch 
    const dispatch = useDispatch();

    //Import user information from firebase auth
    const currentUser = useSelector(state => state.currentUser)
    const loading = currentUser.loading;

    const genderFormatted = currentUser ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1) : null

    //Basic info react states
    const [editBasic, setEditBasic] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [displayName, setDisplayName] = useState(currentUser?.displayName);
    const [birthday, setBirthday] = useState(currentUser?.birthday.toString() || '');
    const [gender, setGender] = useState(currentUser?.gender || '');
    const [thumbnail, setThumbnail] = useState(currentUser?.photoURL);

    //Contact info react states
    const [email, setEmail] = useState(currentUser?.email || '')
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '')

    //Form utilities
    const handleUpdateBasicInfo = async (e) => {
        e.preventDefault();
        dispatch(updateBasicInfo({ currentUser, profilePicture, displayName, birthday, gender }));
    }

    // const updatePhoneNumber = () => {
    //     signInWithPhoneNumber(auth, phoneNumber)
    // }

    return (
        <Container
            style={{ height: "calc(100vh - 58px)" }}
            className="my-5"
        >
            <Row>
                <Col></Col>
                <Col md={8} lg={7} xl={6} className="d-flex flex-column gap-3">
                    <h4>Welcome to your profile!</h4>
                    <Card>
                        <Card.Header className="d-flex">
                            <Card.Title>Basic Info</Card.Title>
                            <div className="ms-auto">
                                <Button
                                    onClick={() => setEditBasic(!editBasic)}
                                    variant="secondary"
                                    size="sm"
                                >
                                    <i className="bi bi-pencil"></i>
                                </Button>
                            </div>
                        </Card.Header>
                        <Form onSubmit={e => handleUpdateBasicInfo(e)}>
                            <Card.Body>
                                <ListGroup>
                                    <ListGroup.Item className="d-flex">
                                        <Col
                                            className="d-flex align-items-center"
                                            xs={5}
                                            md={4}
                                        >
                                            Profile Picture:
                                        </Col>
                                        <Col className="d-flex flex-column">
                                            <Image
                                                className="my-2"
                                                style={{ 'width': '72px' }}
                                                src={thumbnail || placeHolderProfilePic}
                                                roundedCircle
                                            />
                                            {
                                                editBasic &&
                                                <div>
                                                    <Form.Control
                                                        type="file"
                                                        onChange={(e) => {
                                                            console.log(e.target.files)
                                                            const file = e.target.files[0]
                                                            setProfilePicture(file)
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setThumbnail(reader.result)
                                                                };
                                                                reader.readAsDataURL(file)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            }
                                        </Col>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex">
                                        <Col
                                            className="d-flex align-items-center"
                                            xs={5}
                                            md={4}
                                        >
                                            Display Name:
                                        </Col>
                                        {
                                            editBasic
                                                ? <>
                                                    <Form.Control
                                                        type="text"
                                                        value={displayName}
                                                        onChange={e => setDisplayName(e.target.value)}
                                                    />
                                                </>
                                                : <Col>{currentUser?.displayName || 'n/a'}</Col>
                                        }
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex">
                                        <Col
                                            className="d-flex align-items-center"
                                            xs={5}
                                            md={4}
                                        >
                                            Birthday:
                                        </Col>
                                        {
                                            editBasic
                                                ? <>
                                                    <Form.Control
                                                        type="date"
                                                        value={birthday}
                                                        onChange={e => setBirthday(e.target.value)}
                                                    />
                                                </>
                                                : <Col>{currentUser?.birthday || 'n/a'}</Col>
                                        }
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex">
                                        <Col
                                            className="d-flex align-items-center"
                                            xs={5}
                                            md={4}
                                        >
                                            Gender:
                                        </Col>
                                        {
                                            editBasic
                                                ? <>
                                                    <Form.Select
                                                        value={gender}
                                                        onChange={(e) => setGender(e.target.value)}
                                                    >
                                                        <option className='text-secondary' value={null}>Select a gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value={null}>Prefer not to say</option>
                                                    </Form.Select>
                                                </>
                                                : <Col>{currentUser?.gender ? genderFormatted : 'n/a'}</Col>
                                        }
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                            {editBasic &&
                                <Card.Footer className="d-flex justify-content-end">
                                    <Button type="submit" disabled={loading}>Submit {loading && <Spinner size='sm' />}</Button>
                                </Card.Footer>
                            }
                        </Form>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title>Contact Info</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup>
                                <ListGroup.Item className="d-flex">
                                    <Col xs={5} md={4}>
                                        Email:
                                    </Col>
                                    <Col>{currentUser?.email || 'n/a'}</Col>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex">
                                    <Col xs={5} md={4}>
                                        Phone number:
                                    </Col>
                                    <Col>{currentUser?.phoneNumber || <p>Link phone number</p>}</Col>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </Container >
    )
}