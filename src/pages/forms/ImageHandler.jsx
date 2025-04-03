import { Button, Form, Image } from "react-bootstrap";
import { useImageHandler } from "../../hooks/useImageHandler"
import { useRef } from "react";

export default function ImageHandler() {
    const { handleImageChange, thumbnail } = useImageHandler();
    const fileInputRef = useRef(null);

    const handleAddImage = () => {
        fileInputRef.current.click()
    }

    return (
        <>
            {thumbnail &&
                <div style={{ width: '50px', height: '50px', overflow: "hidden" }} className="mb-3 d-flex justify-content-center align-items-center">
                    <Image width='50px' src={thumbnail} onClick={() => setShowModal(true)} fluid />
                </div>
            }
            <Form.Group className="mb-2">
                <Form.Control
                    className="d-none"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                />
                <Button onClick={handleAddImage}>Add Image</Button>
            </Form.Group>
        </>
    )
}