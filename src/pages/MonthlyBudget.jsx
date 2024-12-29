import { Col, Container, Row } from "react-bootstrap";

export default function MonthlyBudget() {
    return (
        <Container>
            <Row>
                <Col>
                    Start Balance / End Balance
                </Col>
                <Col>
                    Saved this month
                </Col>
            </Row>
            <Row>
                <Col>
                    Expenses by category
                </Col>
                <Col>
                    Income by category
                </Col>
            </Row>
        </Container>
    )
}