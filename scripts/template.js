function dexmonTemplate(a, b, c, d) {
    return `
    <article style="background-color: red" onclick="" id="${c}">
        <img style="width: 20px" src=${b} alt="${a}">
        <span>Nr. ${calcNr(c)}</span>
        <h1>${a}</h1>
        <ul>
            ${d}
        </ul>
    </article>
    `
}