import { useContext } from "react";
import { Badge, Button, ButtonGroup, Col, Row, ToggleButton } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MainTransactionForm from "../pages/forms/MainTransactionForm";
import { TransactionFormContext } from "../features/transactions/TransactionFormContextProvider";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showNewTransModal } = useContext(TransactionFormContext)

    return (
        <div>
            <Row
                className="d-md-none p-2 ps-3 mb-1 no-scrollbar"
            >
                <ButtonGroup className="gap-2">
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
                    <SidebarButton disabled title={<span>Income</span>} />
                    <SidebarButton disabled title={<span>Budget</span>} />
                </ButtonGroup>
            </Row>
            <Row
                className="me-sm-0"
                style={{
                    marginLeft: '1px',
                    marginRight: "1px"
                }}
            >
                <Col
                    style={{
                        position: "sticky",
                        top: '58px',
                        height: "calc(100vh - 58px)",
                        width: "240px"
                    }}
                    className="d-none d-md-flex flex-column p-3 bg-navbars"
                    lg={'auto'}
                >
                    <Button
                        className='mb-5 rounded-pill'
                        variant="light"
                        size="lg"
                        onClick={showNewTransModal}
                    >
                        <i className="bi bi-plus-lg"></i> Create
                    </Button>
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
                    className="position-relative p-md-4 p-3 me-md-3 ms-md-0 mx-2 rounded-5 bg-light custom-scrollbar"
                >
                    <Outlet />
                    <div
                        className="d-flex d-md-none position-fixed bottom-0 end-0"
                    >
                        <Button
                            onClick={() => setShow('add-transaction')}
                            className="align-self-end ms-auto rounded-pill m-4"
                            size="lg"
                            style={{
                                width: '64px',
                                height: '64px',
                                zIndex: '1000'
                            }}
                        >
                            <i className="bi bi-plus-lg"></i>
                        </Button>
                    </div>
                </Col>
            </Row>
            <MainTransactionForm />
        </div >
    )
}

function SidebarButton({ title, disabled, onClick, location, value }) {
    return <ToggleButton
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