import React from "react";
import { Alert } from "react-bootstrap";

function CustomAlert({ show, setShow, variant }) {
    return (
        <Alert
            show={show != null}
            variant={variant}
            onClose={() => {
                setShow(null);
            }}
            dismissible
        >
            {show}
        </Alert>
    );
}

export default CustomAlert;
