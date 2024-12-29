import { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import Sidebar from "../components/Sidebar";
import MonthlyBudget from "./MonthlyBudget";

export default function Dashboard() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext)

    const transactions = useSelector((state) => state.transactions.transactions)
    const loading = useSelector((state) => state.transactions.loading.transactions)

    useEffect(() => {
        if (!currentUser) {
            navigate('/')
        }
    })

    return (
        <Container>
            <h1>Dashboard</h1>
            <Row>
                <Col lg={3}>
                    <Sidebar />
                </Col>
                <Col lg={9}>
                    <MonthlyBudget />
                </Col>
            </Row>
        </Container>
    )
}