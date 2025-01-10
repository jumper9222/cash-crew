import { useContext, useState } from "react";
import { Button, Card, Col, Container, Form, Image, ListGroup, Row } from "react-bootstrap";
import { AuthContext } from "../components/AuthProvider";
import { auth } from "../firebase";

export default function ProfilePage() {
    //Import user information from firebase auth
    const currentUser = auth.currentUser;
    const { loading, setLoading } = useContext(AuthContext)

    //React states
    const [editBasic, setEditBasic] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [displayName, setDisplayName] = useState(currentUser?.displayName);
    const [birthday, setBirthday] = useState(currentUser?.birthday || '');
    const [gender, setGender] = useState(currentUser?.gender || '')

    return (
        <Container className="my-5">
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
                        <Form>

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
                                                src={currentUser.photoURL}
                                                roundedCircle
                                            />
                                            {
                                                editBasic &&
                                                <div>
                                                    <Form.Control
                                                        type="file"
                                                        value={profilePicture}
                                                        onChange={e => setProfilePicture(e.target.value)}
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
                                                        onChange={(e) => setGender(e)}
                                                    >
                                                        <option className='text-secondary' value={null}>Select a gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value={null}>Prefer not to say</option>
                                                    </Form.Select>
                                                </>
                                                : <Col>{currentUser?.gender || 'n/a'}</Col>
                                        }
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                            {editBasic &&
                                <Card.Footer className="d-flex justify-content-end">
                                    <Button type="submit">Submit {loading && <Spinner size='sm' />}</Button>
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
                                    <Col>{currentUser?.phoneNumber || 'n/a'}</Col>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}