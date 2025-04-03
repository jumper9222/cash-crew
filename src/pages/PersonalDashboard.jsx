import { Card, Col, Container, Row } from "react-bootstrap";
import {
    calculateTotalPersonalExpenseByCategoryByMonth,
    calculateTotalPersonalExpenseByMonth
} from "../features/transactions/transactionsSelectors";
import { useSelector } from "react-redux";
import { DateTime } from "luxon";
import PersonalAndSharedTabs from "../components/PersonalAndSharedTabs";
import Chart from "react-google-charts";
import CategoriesAccordion from "../components/CategoriesAccordion";

export default function PersonalDashboard() {
    const user_id = useSelector(state => state.currentUser.uid)
    const date = DateTime.now()

    const totalPersonalExpense = useSelector(calculateTotalPersonalExpenseByMonth(user_id, date.month, date.year)).toFixed(2)
    const totalPersonalExpenseByCategory = useSelector(calculateTotalPersonalExpenseByCategoryByMonth(user_id, date.month, date.year))
    const categories = useSelector(state => state.currentUser.settings.categories)

    const chartData = [["Category", "Amount"],
    ...Object.values(totalPersonalExpenseByCategory).reduce((acc, category) => {
        return [...acc, ...Object.entries(category.subCategory).map(([id, amount]) => {
            return [categories[id].name, amount]
        })]
    }, [])
    ]
    const chartOptions = {
        colors: [
            "#c17070", "#c19970", "#c1c170", "#99c170", "#70c170", "#70c199",
            "#70c1c1", "#7098c1", "#7070c1", "#9870c1", "#c170c1", "#c17099",
            "#c17d70", "#c1a670", "#b4c170", "#8bc170", "#70c17d", "#70c1a6",
            "#70b4c1", "#708bc1", "#7d70c1", "#a670c1", "#c170b4", "#c1708b",
            "#c18b70", "#c1b470", "#a6c170", "#7dc170", "#70c18b", "#70c1b4",
            "#70a6c1", "#707dc1", "#8b70c1", "#b470c1", "#c170a6", "#c1707d"
        ],
        backgroundColor: { fill: "transparent" },
        chartArea: { width: '95%', height: '95%' },
        fontSize: 16,
        fontName: 'Helvetica',
        legendTextStyle: { color: "8f813d" },
        pieSliceTextStyle: {
            color: "white",
            fontName: "Helvetica",
            fontSize: 13
        },
    }

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
                            <CategoriesAccordion totals={totalPersonalExpenseByCategory} categories={categories} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card
                        style={Object.entries(totalPersonalExpenseByCategory).length < 1 ? { height: '400px' } : null}
                    >
                        <Card.Header>
                            Total Expense By Category
                        </Card.Header>
                        <Card.Body
                            className={Object.entries(totalPersonalExpenseByCategory).length < 1 && 'd-flex justify-content-center align-items-center'}
                        >
                            {
                                Object.entries(totalPersonalExpenseByCategory).length < 1
                                    ? <p>No transactions this month</p>
                                    : <Chart
                                        chartType="PieChart"
                                        data={chartData}
                                        options={chartOptions}
                                        width={"100%"}
                                        height={"360px"}
                                    />
                            }
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