import { Col, Container, Row, Table } from "react-bootstrap";
import { calculateTotalPersonalExpense, calculateTotalPersonalExpenseByCategory } from "../../features/transactions/transactionsSelectors";
import { useContext } from "react";
import { AuthContext } from "../../components/AuthProvider";
import { useSelector } from "react-redux";

export default function PersonalDashboard() {
    const user_id = useContext(AuthContext).currentUser.uid

    const totalPersonalExpense = useSelector(calculateTotalPersonalExpense(user_id)).toFixed(2)
    const totalPersonalExpenseByCategory = useSelector(calculateTotalPersonalExpenseByCategory(user_id))

    return (
        <Container>
            <h3>Personal Dashboard</h3>
            <Row>
                <Col>
                    <Table>
                        <tr>
                            <th>Total Expense This Month</th>
                            <th className="text-end">{totalPersonalExpense}</th>
                            <th>MYR</th>
                        </tr>
                        {Object.entries(totalPersonalExpenseByCategory).map(([key, value]) => {
                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td className="text-end">{value.toFixed(2)}</td>
                                    <td>MYR</td>
                                </tr>
                            )
                        })}
                    </Table>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}