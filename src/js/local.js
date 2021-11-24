function setStorage( name, data ) {
    window.localStorage.setItem(name, JSON.stringify(data));
};

function getStorage( name ) {
 return JSON.parse(window.localStorage.getItem(name));
};

module.exports = {
    setStorage,
    getStorage
};