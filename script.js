const api = "https://pokeapi.co/api/v2/pokemon";

let max = 1025;
let limit = 12;
let offset = 0;

let next = "";
let loader = "0/1";

async function init() {
    await fetchEm(api + `?limit=${limit}`);
    renderMonsters();
    fixFocus();
}

async function fetchEm(url) {
    url = (url === undefined) ? (api + `?limit=${limit}`) : url;
    if (loader !== "0/1") clear(); changeloader('Kleinste Nummer', "0/1")
    try {
        let json = await (await fetch(url)).json();

        if (json) {
            next = json.next;
            for (let monster of json.results) {
                await pushEm(monster);
            }
        }
    } catch (err) { console.error(err) } enabler("low");
}

async function pushEm(monster) {
    try {
        let url = await monster.url;
        let json = await (await fetch(url)).json();

        let translation = await getTranslation(json.name);
        return monsters.push(await catchMonster(json, translation));
    } catch (err) { console.error(err) }
}

async function shuffleNext() {
    if (loader !== "/") clear(); changeloader('Zufallsgenerator', "/")

    for (let i = 0; i < limit; i++) {
        let response = await fetch( api + `/${Math.floor(Math.random() * max)}`);
        let json = await response.json();
        let translation = await getTranslation(json.name);
        monsters.push(await catchMonster(json, translation));
    }

    enabler("shuffle");
}

async function highNext() {
    if (loader !== "1/0") clear(); changeloader('Größte Nummer', "1/0")

    for (let i = 0; i < 12 && max > 0; i++, max--) {
        let response = await fetch(api + `/${max}`);
        let json = await response.json();
        let translation = await getTranslation(json.name);
        monsters.push(await catchMonster(json, translation));
    }

    enabler("high");
}

async function alphabeticNext(pending) {
    checkLoad(pending); payloader()

    let response = await fetch(api + `?limit=${135}&offset=0`);
    let json = await response.json(); await translateName(json)

    let pen = json.results.sort(pending);
    if (pen) {
        for (let i = offset; i < limit; i++) {
            await pushEm(pen[i]);
        }
    }
    offset+=12;limit+=12;enabler(next);
}

async function search() {
    clear(); changeloader('Dexmon Suche', "search")
    const query = document.querySelector("input");

    let input = query.value.toLowerCase();
    let integer = parseInt(input);
    if (input.length < 3 && !isNumber(integer)) {errMsg(query); return}
    if (isNaN(integer)) integer = input;

    await engine(integer, input);
    query.value = ""; query.placeholder = "Dexmon suchen";
    enabler("load");
}

async function engine(integer, input) {
    let response = await fetch(api + `?limit=${135}&offset=0`);
    let json = await response.json();

    if (typeof integer === "string") {
        await translateName(json);
        let pen = json.results.filter(mon => mon.name.toLowerCase().indexOf(integer.toString()) > -1);
        for (let monster of pen) {
            await pushEm(monster);
        }
    } else {
        await pushEm(json.results[input -1]);
    }
}

async function translateName(json) {
    for (const monster of json.results) {
        let gerVer =  await getTranslation(monster.name);
        monster.name = gerVer[0];
    }
}

function enabler(id) {
    payloader();

    document.querySelectorAll("button").forEach(button => {
        button.disabled = false;
    });
    document.getElementById(`${id}`).disabled = true;

    renderMonsters();
}

function renderMonsters() {
    for (let i = 0; i < monsters.length; i++) {

        if (document.getElementById(`${monsters[i].id}`)) continue;

        let types = monsters[i].types.map(type => {
            return `<li class="${type}">` + typeIcons[type.toLowerCase()] || "❓Unbekannt"
        }).join("</li>");

        document.querySelector("output").innerHTML += monsterTemplate(
            monsters[i].id, monsters[i].name, monsters[i].image, types
        )
    }
}

function loadNext() {
    switch (loader) {
        case "0/1":
            return fetchEm(next).then(renderMonsters);
        case "1/0":
            return highNext();
        case "/":
            return shuffleNext();
        case "A/Z":
            return alphabeticNext(ascending);
        case "Z/A":
            return alphabeticNext(descending);
    }
}