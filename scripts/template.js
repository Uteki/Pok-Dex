function monsterTemplate(id, name, image, types) {
    return `
        <article style="background-color: red" onclick="test(${id})" id="${id}">
            <img style="width: 20px" src=${image} alt="${name}">
            <span>Nr. ${calcNr(id)}</span>
            <h3>${name}</h3>
            <ul>
                ${types}
            </ul>
        </article>
    `
}

function catchMonster(json) {
    return {
        id: json.id,
        name: json.name,
        image: json.sprites.other["official-artwork"].front_default,
        types: json.types.map(typeInfo => typeInfo.type.name)
    };
}