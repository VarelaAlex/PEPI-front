export const executeWithProbability = (fn, probability = 0.2) => {
    if (typeof fn !== "function") return;

    if (Math.random() < probability) {
        fn();
    }
};