import React from "react";
import ReactDOM from "react-dom";

const GifComponent = ({ show }) => {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div style={overlayStyle}>
            <img
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTNrcTh2M2RmZWltajQ4ZnZoZnZ4NTBjMml4NWVkZzVkeW45bTF5OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/kyELaYTD1Q9lYStywD/giphy.gif"
                alt="Loading"
                style={{ width: "200px" }}
            />
        </div>,
        document.body
    );
};

const overlayStyle = {
    position: "fixed",
    bottom: 100,
    left: 300,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
};

export default GifComponent;