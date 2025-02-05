import { Image, Modal } from "react-bootstrap";

export default function ImagePreview({ image, show, onHide }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            className="custom-modal"
            centered
        >
            <Modal.Body>
                <Image src={image} fluid />
            </Modal.Body>
        </Modal>
    )
}