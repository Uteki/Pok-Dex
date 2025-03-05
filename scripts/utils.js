function clear() {
    document.querySelector("output").innerHTML = "";
    monsters = [];
    max = 1025;
    limit = 12;
    offset = 0;
}

function calcNr(num) {
    return num.toString().padStart(4, '0');
}

function errMsg(query){
    query.placeholder = "Bitte 3 Buchstaben";
    query.value = "";

    enabler("load");
}

function isNumber(num){
    return Number(num) === num;
}

function checkLoad(a) {
    a === ascending
        ? (() =>  {if (loader !== "A/Z") clear(); change('Von A bis Z', "A/Z")})()
        : (() =>  {if (loader !== "Z/A") clear(); change('Von Z bis A', "Z/A")})()
}

function change(a, b) {
    document.querySelector("#dropdownMenu2 span").innerText = `${a}`;
    loader = b;
}

function ascending (a, b) {
    next = "ascending";
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function descending (a, b) {
    next = "descending";
    if (a.name > b.name) {
        return -1;
    }
    if (a.name < b.name) {
        return 1;
    }
    return 0;
}

function onEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("button-addon").click();
    }
}

function payloader() {
    document.getElementById("load").disabled = true;

    document.getElementById("loader").style.display = "flex";
    document.getElementById("loader").classList.toggle("d_none");
}

function changeloader(a, b) {
    change(a, b);
    payloader();
}