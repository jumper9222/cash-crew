import { useState } from "react";
import { Button, Container, InputGroup, Form, Row, Col, ListGroup, ListGroupItem, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addFriend } from "../features/friends/friendsActions";
import placeholderImage from "../assets/undraw_profile-pic_fatv.svg";

export default function FriendsPage() {
    const dispatch = useDispatch();

    const { uid } = useSelector(state => state.currentUser)

    //Selectors
    const friends = useSelector(state => state.friends.friends)
    const loading = useSelector(state => state.friends.loading)

    //States
    const [query, setQuery] = useState('')

    //Form handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addFriend({ email: query, uid }))
            .then(() => console.log('Friend added successfully.'))
            .catch(error => console.error('Error adding friends: ', error.message))
    }

    return (
        <Container>
            <h3>Friends</h3>
            <Form onSubmit={e => handleSubmit(e)}>
                <InputGroup>
                    <Form.Control
                        type='text'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder='Find friends'
                    />
                    <Button type="submit">Add friend</Button>
                </InputGroup>
            </Form>
            <ListGroup
                className="mt-3 flex-grow-1 overflow-auto"
            >
                {Object.values(friends).length > 0 && !loading
                    ? Object.entries(friends).map(([key, friend]) => {
                        return (
                            <ListGroupItem key={key}>
                                <Row>
                                    <Col
                                        className="d-flex flex-column justify-content-center align-items-center"
                                        xs={'auto'}
                                    >
                                        <Image
                                            src={friend.photoURL ? friend.photoURL : placeholderImage}
                                            width={'56px'}
                                            fluid
                                            roundedCircle
                                        />
                                    </Col>
                                    <Col
                                        className="py-0 d-flex flex-column justify-content-center"
                                        xs={'auto'}
                                    >
                                        <p className="m-0">
                                            <strong>{friend.displayName ? friend.displayName : friend.email}</strong>
                                        </p>
                                        <p className="m-0 text-secondary">
                                            {friend.email}

                                        </p>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        )
                    })
                    : loading
                        ? <p>Loading...</p>
                        : <p>You do not have any friends 😞</p>
                }
            </ListGroup>
        </Container>
    )
}