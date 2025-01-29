import React from "react";
import { useState } from "react";
import { Badge, Button, ButtonGroup, Col, Offcanvas, Row, ToggleButton } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CreateTransaction from "../pages/forms/CreateTransaction";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [show, setShow] = useState('');

    const onHide = () => {
        setShow('')
    }

    return (
        <div>
            <Row style={{ margin: "0" }}>
                <Col
                    style={{ position: "sticky", top: '58px', height: "calc(100vh - 58px)", backgroundColor: "#f2f0e4" }}
                    className="d-flex flex-column py-3"
                    md={3}
                    lg={2}
                >
                    <Button className='mb-5 rounded-pill' variant="light" size="lg" onClick={() => setShow('add-transaction')}><i className="bi bi-plus-lg"></i> Create</Button>
                    <ButtonGroup vertical className="gap-2">
                        <SidebarButton
                            title="Dashboard"
                            location={location.pathname}
                            onClick={() => navigate('/dashboard')}
                            value='/dashboard'
                        />
                        <SidebarButton
                            title="Expenses"
                            location={location.pathname}
                            onClick={() => navigate('/expenses')}
                            value='/expenses'
                        />
                        <SidebarButton
                            title="Friends"
                            location={location.pathname}
                            onClick={() => navigate('/friends')}
                            value='/friends'
                        />
                        <SidebarButton disabled title={<span>Income <Badge bg="secondary">Coming Soon!</Badge></span>} />
                        <SidebarButton disabled title={<span>Budget <Badge bg="secondary">Coming Soon!</Badge></span>} />
                    </ButtonGroup>
                </Col>
                <Col
                    className="p-3 pt-4"
                    md={9}
                    lg={10}
                >
                    <Outlet />
                </Col>
            </Row>
            <CreateTransaction show={show} onHide={onHide} />
        </div>
    )
}

function SidebarButton({ title, disabled, onClick, location, value }) {
    return <ToggleButton
        style={{
            color: '#282740'
        }}
        variant="light"
        className={"d-flex rounded-pill align-items-start"}
        disabled={disabled}
        onClick={onClick}
        type="radio"
        value={value}
        checked={location && location.includes(value)}
    >
        {title}
    </ToggleButton>
}