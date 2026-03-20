import {Trans} from "react-i18next";

const CounterBadge = ({ current, max }) => {
    const styles = {
        container: {
            position: 'absolute',
            top: '10px',
            right: '200px',
            backgroundColor: 'rgba(0,22,40,0.9)',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '1.1rem',
            fontWeight: '400',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            zIndex: 1000,
            userSelect: 'none',
            letterSpacing: '0.3px',
        },
        current: {
            color: '#ffc754',
        },
    };

    return (
        <div style={styles.container}>
            <Trans
                i18nKey="counter"
                values={{ current, max }}
                components={{ current: <span style={styles.current} /> }}
            />
        </div>
    );
};

export default CounterBadge;