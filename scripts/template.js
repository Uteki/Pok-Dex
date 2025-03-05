function monsterTemplate(id, name, image, types) {
    return `
        <article onclick="test(${id})" id="${id}">
            <img src=${image} alt="${name}">
            <div>
                <span>Nr. ${calcNr(id)}</span>
                <h3>${String(name).charAt(0).toUpperCase() + String(name).slice(1)}</h3>
                <ul>
                    ${types}
                </ul>
            </div>
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