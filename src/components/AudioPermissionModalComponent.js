import { useEffect, useState, useRef } from "react";
import { Modal, Button } from "antd";

export default function AudioPermissionModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("audioPermission");

        if (!accepted) {
            setOpen(true);
        }
    }, []);

    return (
        <Modal
            open={open}
            centered
            mask={{closable: false}}
            footer={null}
            getContainer={false}
            style={{ zIndex: 999999 }}
        >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
                Permiso para reproducir audio
            </h2>

            <p style={{ marginBottom: "1.5rem" }}>
                Esta aplicación reproduce audio dividido en varias pistas.
                ¿Permites la reproducción automática?
            </p>

            <Button
                type="primary"
                size="large"
                style={{ width: "100%" }}
                onClick={()=>{
                    localStorage.setItem("audioPermission", "true");
                    setOpen(false);
                }}
            >
                Aceptar
            </Button>
        </Modal>
    );
}