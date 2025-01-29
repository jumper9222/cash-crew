import { Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import SearchSuggestionList from "./SearchSuggestionList";

export default function SplitRow({
    amount,
    email,
    handleEmailField,
    handleAmountField,
    handleAmountBlur,
    handleEmailFocus,
    handleEmailBlur,
    handleSuggestionClick,
    suggestions,
    isActive,
    splitIndex
}) {
    const friends = useSelector(state => state.friends.friends);

    return (
        <div>
            <InputGroup >
                <Form.Control
                    type="text"
                    value={email || ''}
                    onChange={handleEmailField}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                />
                <Form.Control
                    type="number"
                    value={amount || 0}
                    onChange={handleAmountField}
                    onBlur={handleAmountBlur}
                    step="0.01"
                />
            </InputGroup>
            {suggestions.length > 0 && isActive &&
                <SearchSuggestionList
                    splitIndex={splitIndex}
                    suggestions={suggestions}
                    handleSuggestionClick={handleSuggestionClick}
                />
            }
        </div>
    )
}