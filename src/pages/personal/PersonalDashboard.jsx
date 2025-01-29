import { Card, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import {
    calculateTotalPersonalExpenseByCategoryByMonth,
    calculateTotalPersonalExpenseByMonth
} from "../../features/transactions/transactionsSelectors";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import PersonalAndSharedTabs from "../../components/PersonalAndSharedTabs";
import { DateTime } from "luxon";
import Chart from "react-google-charts";

export default function PersonalDashboard() {
    const user_id = auth.currentUser.uid;
    const date = DateTime.now()

    const totalPersonalExpense = useSelector(calculateTotalPersonalExpenseByMonth(user_id, date.month, date.year)).toFixed(2)
    const totalPersonalExpenseByCategory = useSelector(calculateTotalPersonalExpenseByCategoryByMonth(user_id, date.month, date.year))

    const chartData = [["Category", "Amount"], ...Object.entries(totalPersonalExpenseByCategory)]
    const chartOptions = { title: "Total Expense by Categorty" }

    return (
        <Container>
            <h3 className="mb-3">Personal Dashboard</h3>
            <PersonalAndSharedTabs currentPage='/dashboard' />
            <Row>
                <Col lg={6}>
                    <Card className="mb-3">
                        <Card.Header>
                            <Card.Text>Total Expense This Month*</Card.Text>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title className="mb-0">{totalPersonalExpense} <span className="fs-6">MYR</span></Card.Title>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Header>
                            <Card.Text>Total Expense By Category*</Card.Text>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup>
                                {Object.entries(totalPersonalExpenseByCategory).map(([key, value]) => {
                                    return (
                                        <ListGroupItem key={key}>
                                            <Row>
                                                <Col>{key}</Col>
                                                <Col lg={4} className="text-end fw-semibold">{value.toFixed(2)}</Col>
                                                <Col lg={2}>MYR</Col>
                                            </Row>
                                        </ListGroupItem>
                                    )
                                })}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card >
                        <Card.Body >
                            <Chart
                                chartType="PieChart"
                                data={chartData}
                                options={chartOptions}
                                width={"100%"}
                                height={"360px"}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className="text-secondary" style={{ fontSize: "13px" }}>
                <p>* Does not include transactions in foreign currencies. </p>
            </div>
        </Container >
    )
}