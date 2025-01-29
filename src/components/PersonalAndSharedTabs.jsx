import { useState } from "react";
import { Badge, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function PersonalAndSharedTabs({ currentPage }) {
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState(currentPage)

    return (
        <ButtonGroup className="mb-3 gap-2">
            <PersonalAndSharedButton
                title='Personal'
                value={`${currentPage}`}
                onClick={() => {
                    navigate(`${currentPage}`)
                    setSelectedValue(`${currentPage}`)
                }}
                selectedValue={selectedValue}
            />
            <PersonalAndSharedButton
                title={<span>Shared <Badge bg="secondary">Coming Soon</Badge></span>}
                value={`${currentPage}/shared`}
                onClick={() => {
                    navigate(`${currentPage}/shared`)
                    setSelectedValue(`${currentPage}/shared`)
                }}
                selectedValue={selectedValue}
                disabled
            />
        </ButtonGroup>
    )
}

function PersonalAndSharedButton({ title, disabled, onClick, selectedValue, value }) {
    return <ToggleButton
        variant="light"
        className={"d-flex rounded-pill align-items-start"}
        disabled={disabled}
        onClick={onClick}
        type="radio"
        value={value}
        checked={selectedValue === value}
    >
        {title}
    </ToggleButton>
}