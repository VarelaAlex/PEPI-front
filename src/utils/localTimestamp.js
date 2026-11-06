const localTimestamp = () => {
    const now = new Date();
    return now.getTime() - now.getTimezoneOffset() * 60_000;
};

export default localTimestamp;
