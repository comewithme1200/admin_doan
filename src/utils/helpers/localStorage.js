const setLocalStorage = (key, value) => {
    window.localStorage.setItem(key, value);
};

const getLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
    }
}

export { setLocalStorage, getLocalStorage };