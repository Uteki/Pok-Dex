let loader = "0/1";
let max = 1025;
let next = "";

async function init() {
    await fetcher();
}

async function fetcher() {
    loader = "0/1";
    clear();

    try {
        await fetchEm("https://pokeapi.co/api/v2/pokemon?limit=12");
        await renderMonsters()
    } catch (err) {
       console.error(err);
    }
}

async function fetchEm(url) {
    try {
        let response = await fetch(url);
        let json = await response.json();

        if (json) {
            next = json.next;
            for (let monster of json.results) {
                await pushEm(monster);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function pushEm(monster) {
    try {
        let url = await monster.url;
        let response = await fetch(url);
        let json = await response.json();

        return monsters.push({
            id: json.id, name: json.name,
            image: json.sprites.other["official-artwork"].front_default,
            types: json.types.map(types => types.type.name)
        });
    } catch (err) {
        console.error(err);
    }
}

function renderMonsters() {
    for (let i = 0; i < monsters.length; i++) {

        if (document.getElementById(`${monsters[i].id}`)) continue;

        let types = monsters[i].types.map(type => {
            return `<li class="${type}">` + typeIcons[type.toLowerCase()] || "❓Unbekannt"
        }).join("</li>");

        document.querySelector("output").innerHTML += monsterTemplate(
            monsters[i].id, monsters[i].name,
            monsters[i].image, types,
        )
    }
}

function loadNext() {
    switch (loader) {
        case "0/1": {
            fetchEm(next).then(() => {
                renderMonsters();
            })
            break;
        }
        case "/": {
            return shuffleNext();
        }
    }
}

async function shuffleNext() {
    if (loader !== "/") clear();

    for (let i = 0; i < 12; i++) {
        let test = await fetch(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * max)}`);
        let json = await test.json();
        monsters.push({
            id: json.id, name: json.name,
            image: json.sprites.other["official-artwork"].front_default,
            types: json.types.map(types => types.type.name)
        });
    }
    renderMonsters();
    loader = "/"
}