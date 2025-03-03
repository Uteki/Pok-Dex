const api = "https://pokeapi.co/api/v2/pokemon";

let max = 1025;
let limit = 12;
let offset = 0;

let next = "";
let loader = "0/1";

async function init() {
    await fetchEm(api + `?limit=${limit}`);
    renderMonsters();
}

async function fetchEm(url) {
    url = (url === undefined) ? (api + `?limit=${limit}`) : url;
    if (loader !== "0/1") clear(); change('Kleinste Nummer', "0/1")

    try {
        let response = await fetch(url);
        let json = await response.json();

        if (json) {
            next = json.next;
            for (let monster of json.results) {
                await pushEm(monster);
            }
        }
    } catch (err) { console.error(err) } disabler("low");
}

async function pushEm(monster) {
    try {
        let url = await monster.url;
        let response = await fetch(url);
        let json = await response.json();

        return monsters.push(catchMonster(json));
    } catch (err) { console.error(err) }
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
            return azNext(ascending);
        case "Z/A":
            return azNext(descending);
    }
}

async function shuffleNext() {
    if (loader !== "/") clear(); change('Zufallsgenerator', "/")

    for (let i = 0; i < limit; i++) {
        let response = await fetch( api + `/${Math.floor(Math.random() * max)}`);
        let json = await response.json();
        monsters.push(catchMonster(json));
    }

    disabler("shuffle");
}

async function highNext() {
    if (loader !== "1/0") clear(); change('Größte Nummer', "1/0")

    for (let i = 0; i < 12 && max > 0; i++, max--) {
        let response = await fetch(api + `/${max}`);
        let json = await response.json();
        monsters.push(catchMonster(json));
    }

    disabler("high");
}

async function azNext(pending) {
    checkLoad(pending);

    let response = await fetch(api + `?limit=${max}&offset=0`);
    let json = await response.json();
    let pen = json.results.sort(pending);

    if (pen) {
        for (let i = offset; i < limit; i++) {
            await pushEm(pen[i]);
        }
    }
    offset+=12;limit+=12;
    disabler(next);
}

function disabler(test) {
    document.querySelectorAll("button").forEach(button => {
        button.disabled = false;
    });
    document.getElementById(`${test}`).disabled = true;
    renderMonsters();
}