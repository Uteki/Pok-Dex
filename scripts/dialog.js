let myModal;

function monsterDialog(id, move) {
    id = movement(id, move);
    if (!myModal) myModal = new bootstrap.Modal(document.getElementById("myModal"))
    document.querySelector(".modal-dialog").innerHTML = "";
    monsters.some(monster => {
        if (monster.id === id) {
            document.querySelector(".modal-dialog").innerHTML += dialogTemplate(
                //TODO: order values
                monster.name, monster.id, monster.image, monster.description, elements(monster)[0], monster.types[0], elements(monster)[1], monster.stats,
                monster.height, monster.weight, monster.cries, monster.captureRate, monster.species, monster.evolution
            )
        }
    })
    myModal.show();
}

function elements(monster) {
    let types = monster.types.map(type => {
        return `<li class="${type}">` + typeIcons[type.toLowerCase()] || "❓Unbekannt"
    }).join("</li>");

    let weaknesses = monster.weaknesses.map(weakness => {
        return `<li class="${weakness}">` + typeIcons[weakness.toLowerCase()] || "❓Unbekannt"
    }).join("</li>");

    return [types, weaknesses];
}

function movement(id, move) {
    let index = monsters.findIndex(monster => monster.id === id);

    index = move === "forwards" ? index + 1 : move === "backwards" ? index - 1 : index;
    index = index >= monsters.length ? 0 : index < 0 ? monsters.length - 1 : index;

    return monsters[index].id;
}

async function translateStuff(data) {
    let germanName = data.names.filter(entry => entry.language.name === "de");
    let germanEntries = data.flavor_text_entries.filter(entry => entry.language.name === "de");
    let germanSpecies = data.genera.filter(entry => entry.language.name === "de");
    let captureRate = data.capture_rate;

    let latestName = germanName.length > 0 ? germanName[germanName.length - 1].name : data.name;
    let latestDescription = germanEntries.length > 0 ? germanEntries[germanEntries.length - 1].flavor_text : "Keine Beschreibung gefunden.";
    let latestSpecies = germanSpecies.length > 0 ? germanSpecies[germanSpecies.length - 1].genus.split("-")[0] : "Anon";

    return [latestName, latestDescription, latestSpecies, captureRate, await evolution(data)];
}

async function evolution(data) {
    let evoArr = [];
    let chain = (await (await fetch(data.evolution_chain.url)).json()).chain;

    while (chain) {
        evoArr.push(await Promise.all([
            getGerName(chain.species.name),
            getImage(chain.species.name)
        ]));
        chain = chain.evolves_to[0] || null;
    }

    return evoArr;
}

async function getImage(monster) {
    monster = checkCatch(monster);
    try {
        let response = await fetch(api + `/${monster}`);
        let json = await response.json();
        return json.sprites.other["official-artwork"].front_default;
    } catch (err) { console.error(err) }
}

async function getGerName(monster) {
    let response = await fetch(api + `-species/${monster}`);
    let json = await response.json();
    let germanName = json.names.filter(entry => entry.language.name === "de");
    return germanName.length > 0 ? germanName[germanName.length - 1].name : json.name;
}

async function getTranslation(monster) {
    try {
        monster = checkEm(monster);
        let response = await fetch(api + `-species/${monster}`);
        if (!response.ok) {
            return [String(monster).charAt(0).toUpperCase() + String(monster).slice(1), "Keine Beschreibung gefunden."];
        }
        let json = await response.json();
        return translateStuff(json);
    } catch (err) { console.error(err) }
}

async function exploiter(json) {
    let save = [];
    let test = json.types.map(typeInfo => typeInfo.type.name);

    await Promise.all(
        test.map(async tes => {
            let response = await fetch(`https://pokeapi.co/api/v2/type/${tes}`);
            let typeData = await response.json();
            typeData.damage_relations.double_damage_from.forEach(test => save.push(test.name));
        })
    );
    save = [...new Set(save)].filter((el) => !test.includes(el));
    return save;
}