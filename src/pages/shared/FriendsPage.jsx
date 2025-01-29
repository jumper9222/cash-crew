import { useState } from "react";
import { Button, Container, InputGroup, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addFriend } from "../../features/friends/friendsAsyncThunks";

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
            <div>
                {Object.values(friends).length > 0 && !loading
                    ? Object.entries(friends).map(([key, friend]) => {
                        return (
                            <Row className="mt-3" key={key}>
                                <Col>
                                    <p>Display name: <strong>{friend.displayName ? friend.displayName : friend.email}</strong></p>
                                    <p>Email: {friend.email}</p>
                                </Col>
                            </Row>
                        )
                    })
                    : loading
                        ? <p>Loading...</p>
                        : <p>You do not have any friends 😞</p>
                }
            </div>
        </Container>
    )
}