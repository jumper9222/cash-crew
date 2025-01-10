import { useState } from "react";
import { Col, Collapse, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    const [openPersonal, setOpenPersonal] = useState(false)
    const [openShared, setOpenShared] = useState(false)

    return (
        <Container>
            <Row>
                <Col
                    style={{ "height": "100vh", 'background': '#D2B48C' }}
                    className="py-4 ps-4"
                    md={3}
                    lg={2}
                >
                    <div>
                        <strong
                            onClick={() => setOpenPersonal(!openPersonal)}
                            aria-controls="personal-menu"
                            aria-expanded={openPersonal}
                        >
                            <i className={!openPersonal ? "bi bi-caret-right-fill" : "bi bi-caret-down-fill"}></i> Personal
                        </strong>
                        <Collapse in={openPersonal}>
                            <div className="ms-4 mt-3 mb-4" id="personal-menu">
                                <p onClick={() => navigate('/personal')}>Dashboard</p>
                                <p onClick={() => navigate('/personal/expenses')}>Expenses</p>
                                <p className="text-secondary">Income</p>
                                <p className="text-secondary">Budget</p>
                            </div>
                        </Collapse>
                    </div>
                    <div>
                        <strong
                            onClick={() => setOpenShared(!openShared)}
                            aria-controls="shared-menu"
                            aria-expanded={openShared}
                        >
                            <i className={!openShared ? "bi bi-caret-right-fill" : "bi bi-caret-down-fill"}></i> Shared
                        </strong>
                        <Collapse in={openShared}>
                            <div className="ms-4 mt-3" id={openShared}>
                                <p onClick={() => navigate('/shared')}>Dashboard</p>
                                <p onClick={() => navigate('/shared/expenses')}>Expenses</p>
                                <p onClick={() => navigate('/friends')}>Friends</p>
                                <p className="text-secondary">Groups</p>
                            </div>
                        </Collapse>
                    </div>
                </Col>
                <Col className="pt-3" md={9} lg={10}>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}