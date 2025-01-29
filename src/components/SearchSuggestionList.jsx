import { ListGroup } from "react-bootstrap";

export default function SearchSuggestionList({ suggestions, handleSuggestionClick, splitIndex }) {
    return (
        <>
            <ListGroup
                onMouseDown={(e) => e.preventDefault()}
                className="position-absolute"
                style={{
                    zIndex: 1000,
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}
            >
                {suggestions.map((suggestion, index) =>
                    <ListGroup.Item
                        action
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion, splitIndex)}
                    >
                        {suggestion}
                    </ListGroup.Item>
                )}
            </ListGroup >
        </>
    )
}