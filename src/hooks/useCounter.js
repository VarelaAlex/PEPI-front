import { useState } from 'react';

const useCounter = (max) => {
    const [counter, setCounter] = useState(max);

    const decrease = () => {
        if (counter > 0) setCounter(counter - 1);
    };

    return { counter, setCounter, decrease };
};

export default useCounter;