const setLocalStorage = (key, value) => {
    window.sessionStorage.setItem(key, value);
};

const getLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        return window.sessionStorage.getItem(key);
    }
}

export { setLocalStorage, getLocalStorage };