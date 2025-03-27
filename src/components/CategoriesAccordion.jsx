import { Accordion, Col, ListGroup, Row } from "react-bootstrap"

export default function CategoriesAccordion({ totals, categories }) {
    console.log('categories total', totals)
    return (
        <Accordion alwaysOpen>
            {Object.entries(totals).map(([id, value]) => {
                console.log(value)
                return (
                    <Accordion.Item key={id} eventKey={id}>
                        <Accordion.Header>
                            <Row>
                                <Col>{`${categories[id].emoji} ${categories[id].name}`}</Col>
                                <Col xs='auto' className="text-end">{value.total.toFixed(2)}</Col>
                            </Row>
                        </Accordion.Header>
                        <Accordion.Body className="p-0">
                            <ListGroup>
                                {Object.entries(value.subCategory).map(([subCategoryId, subCategoryTotal], index, array) => {
                                    return (
                                        <ListGroup.Item key={subCategoryId} style={
                                            index === 0
                                                ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 }
                                                : index === array.length - 1
                                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                    : null
                                        }>
                                            <Row className="w-100">
                                                <Col>
                                                    {`${categories[subCategoryId].emoji} ${categories[subCategoryId].name}`}
                                                </Col>
                                                <Col xs='auto' className="text-end">
                                                    {subCategoryTotal.toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                )
            })}
        </Accordion>
    )
}