import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <Container>
            <Row>
                <Col
                    className="pt-3"
                    style={{ 'background': '#f7f7f7' }}
                    md={2}
                >
                    <p onClick={() => navigate('/dashboard')}>Dashboard</p>
                    <p onClick={() => navigate('/monthly-budget')}>Monthly Budget</p>
                    <p onClick={() => navigate('/transactions')}>Transactions</p>
                    <p onClick={() => navigate('/shared-transactions')}>Shared Transactions</p>
                </Col>
                <Col className="pt-3" md={10}>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}