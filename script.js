let loader = "0/1";
let max = 1025;
let next = "";

function init() {
    fetcher();
}

async function fetcher() {
    loader = "0/1";
    clearData();

    try {
        await fetchIt("https://pokeapi.co/api/v2/pokemon?limit=12");
        await renderMonsters()
    } catch (e) {
       console.error(e);
    }
}

function clearData() {
    document.querySelector("output").innerHTML = "";
    monsters = [];
}

async function fetchIt(url) {
    try {
        let response = await fetch(url);
        let json = await response.json();
        if (json) {
            next = json.next;
            for (let dexmon of json.results) {
                await tester(dexmon);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function tester(pok) {
    try {
        let poke = await pok.url;
        let test = await fetch(poke);
        let json = await test.json();

        return monsters.push({
            id: json.id, name: json.name,
            image: json.sprites.other["official-artwork"].front_default,
            types: json.types.map(types => types.type.name)
        });
    } catch (e) {
        console.log(e);
    }
}

function renderMonsters() {
    for (let i = 0; i < monsters.length; i++) {

        if (document.getElementById(`${monsters[i].id}`)) continue;

        let types = monsters[i].types.map(type => {
            return `<li class="${type}">` + typeIcons[type.toLowerCase()] || "❓Frage"
        }).join("</li>");

        document.querySelector("output").innerHTML += dexmonTemplate(
            monsters[i].name,
            monsters[i].image,
            monsters[i].id,
            types,
        )
    }
}


function loadNext() {
    if (loader === "0/1") {
        fetchIt(next).then(() => {
            renderMonsters();
        })
    } else if (loader === "/") {
        shuffleNext();
    }
}

async function shuffleNext() {
    if (loader !== "/") {
        clearData();
    }

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