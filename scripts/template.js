function monsterTemplate(id, name, image, types) {
    return `
    <article style="background-color: red" onclick="" id="${id}">
        <img style="width: 20px" src=${image} alt="${name}">
        <span>Nr. ${calcNr(id)}</span>
        <h1>${name}</h1>
        <ul>
            ${types}
        </ul>
    </article>
    `
}