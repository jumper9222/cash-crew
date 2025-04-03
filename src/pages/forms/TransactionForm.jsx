import { useContext } from "react"
import { TransactionFormContext } from "../../features/transactions/TransactionFormContextProvider"
import { Col, Form, InputGroup } from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function TransactionForm() {
    const { formData, updateForm, currencies, categories } = useContext(TransactionFormContext);

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            fontWeight: state.data.parentCategoryID === null ? "bold" : "normal",
            backgroundColor: state.isSelected
                ? "#007bff"
                : state.isFocused
                    ? "#f0f0f0"
                    : state.data.parentCategoryID === null
                        ? "#f8f9fa" // Light background for parent categories
                        : "#ffffff",
            color: state.isSelected ? "#fff" : "#333",
            paddingLeft: state.data.parentCategoryID ? 20 : 10, // Indent child categories

        })
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={e => updateForm("title", e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.description}
                    onChange={e => updateForm("description", e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                    type="date"
                    value={formData.date}
                    onChange={e => updateForm("date", e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Label>Amount</Form.Label>
            <InputGroup className="mb-3">
                <Col xs={7}>
                    <Form.Control
                        type="number"
                        step="0.01"
                        value={formData.totalAmount}
                        onChange={e => updateForm("totalAmount", e.target.value)}
                        onBlur={() => {
                            if (formData.totalAmount) {
                                updateForm("totalAmount", parseFloat(formData.totalAmount).toFixed(2))
                            }
                        }}
                        placeholder="Enter amount"
                        style={{
                            borderTopRightRadius: '0px',
                            borderBottomRightRadius: '0px'
                        }}
                        required
                    />
                </Col>
                <Col xs={5}>
                    <Select
                        options={currencies}
                        value={formData.currency}
                        onChange={value => updateForm("currency", value)}
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: '#fcfbf8',
                                borderRadius: '8px',
                                borderTopLeftRadius: '0px',
                                borderBottomLeftRadius: '0px',
                                borderColor: '#d9d0a6'
                            }),
                        }}
                        placeholder='Currency...'
                    />
                </Col>
            </InputGroup>
            <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <CreatableSelect
                    options={categories}
                    value={formData.category}
                    onChange={value => updateForm("category", value)}
                    styles={customStyles}
                    placeholder='Select a category'
                    required
                />
            </Form.Group>
        </>
    )
}