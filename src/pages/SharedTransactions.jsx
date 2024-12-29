import { Col, Container, Row } from "react-bootstrap";

export default function SharedTransactions() {
    return (
        <Container>
            <Row>
                <Col>
                    {"Total Balance (+/-)"}
                </Col>
            </Row>
            <Row>
                <Col>People you owe</Col>
                <Col>People you are owed</Col>
            </Row>
        </Container>
    )
}