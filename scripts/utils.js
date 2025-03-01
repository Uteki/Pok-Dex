function clear() {
    document.querySelector("output").innerHTML = "";
    monsters = [];
}

function calcNr(num) {
    return num.toString().padStart(4, '0');
}