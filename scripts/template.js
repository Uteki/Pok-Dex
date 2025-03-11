function monsterTemplate(id, name, image, types) {
    return `
        <article onclick="monsterDialog(${id})" id="${id}">
            <img src=${image} alt="${name}">
            <div>
                <span>Nr. ${calcNr(id)}</span>
                <h3>${name}</h3>
                <ul>
                    ${types}
                </ul>
            </div>
        </article>
    `
}

function dialogTemplate(name, id, image, description, types, color, weaknesses, stats, height, weight, cries, captureRate, species, evolution) {
    return `
        <div class="modal-content ${color}">
            <div class="modal-header">
                <h5 class="modal-title">${name}</h5>
                <span>Nr. ${calcNr(id)}</span>
            </div>
            
            <div class="modal-body">
                <div>
                    <div class="wrapper-hero">
                        <div class="wrapper-image">
                            <div>
                                <img src=${image} alt="${name}" class="col w-50">
                            </div>
                        </div>
                        
                        <div class="wrapper-desc">
                            <p>${description}</p>
                        </div> 
                    </div>
                    
                    <menu class="nav-link btn-group">
                        <button class="nav-item btn btn-info actor" onclick="togInfo('attributes', 1)">Dexmon</button>
                        <button class="nav-item btn btn-info" onclick="togInfo('statistic', 2)">Stats</button>
                        <button class="nav-item btn btn-info" onclick="togInfo('information', 3)">Info</button>
                        <button class="nav-item btn btn-info" onclick="togInfo('evolution', 4)">Entwicklung</button>
                    </menu>

                     <section id="attributes">
                        <h5>Typ</h5>
                        <ul>${types}</ul>
    
                        <h5>Schwächen</h5>
                        <ul class="d-flex flex-wrap">${weaknesses}</ul>
                    </section>
                    
                    <section id="statistic" class="d-none d-flex align-items-center">
                        <div>
                            <div class="progress-stat">KP</div><div class="progress-stat">Angriff</div>
                            <div class="progress-stat">Vert.</div><div class="progress-stat">Sp.-Ang.</div>
                            <div class="progress-stat">Sp.-Vert.</div><div class="progress-stat">Initiative</div>
                        </div>
                        
                        <div class="w-100">
                            <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="${stats[0].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${stats[0].base_stat / 2}%; --bs-progress-bar-bg: #4CAF50">${stats[0].base_stat}</div>
                            </div>
                            <div class="progress" role="progressbar" aria-label="Segment two" aria-valuenow="${stats[1].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${stats[1].base_stat / 2}%; --bs-progress-bar-bg: #F44336">${stats[1].base_stat}</div>
                            </div>
                            <div class="progress" role="progressbar" aria-label="Segment three" aria-valuenow="${stats[2].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${stats[2].base_stat / 2}%; --bs-progress-bar-bg: #FF9800">${stats[2].base_stat}</div>
                            </div>
                            <div class="progress" role="progressbar" aria-label="Segment four" aria-valuenow="${stats[3].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${stats[3].base_stat / 2}%; --bs-progress-bar-bg: #2196F3">${stats[3].base_stat}</div>
                            </div>
                            <div class="progress" role="progressbar" aria-label="Segment five" aria-valuenow="${stats[4].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${stats[4].base_stat / 2}%; --bs-progress-bar-bg: #9C27B0">${stats[4].base_stat}</div>
                            </div>
                            <div class="progress" role="progressbar" aria-label="Segment six" aria-valuenow="${stats[5].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${stats[5].base_stat / 2}%; --bs-progress-bar-bg: #00BCD4">${stats[5].base_stat}</div>
                            </div>
                        </div>
                    </section id>
                    
                    <section id="information" class="d-none">
                        <div>
                            <div>
                                <p style="text-align: center">
                                    Größe: <span>${height*10}cm&nbsp;&nbsp;</span> Gewicht: <span>${weight/10}kg</span><br>
                                    Fangrate: <span>${((captureRate / 255) * 100).toFixed(2) + "%"}&nbsp;&nbsp;</span> Spezies: <span>${species}</span>
                                </p>  
                            </div>
                            
                            <div class="d-flex align-items-center justify-content-center gap-3">
                                <button class="btn btn-dark" onclick="document.getElementById('pokCry').play()">🔊 Schrei</button>
                                <audio id="pokCry">
                                    <source src="${cries}" type="audio/ogg">
                                </audio>
                            </div>
                        </div>
                    </section>
                    
                    <section id="evolution" class="d-none d-flex align-items-center">
                        ${emAll(evolution)}
                    </section>
                </div>
            </div>
        
            <div class="modal-footer">
                <div>
                    <button class="arrow col-5" onclick="monsterDialog(${id}, 'backwards')">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="${fillColor(color)}">
                            <polygon points="15,5 5,12 15,19" />
                        </svg>
                    </button>
    
                    <button class="arrow col-5" onclick="monsterDialog(${id}, 'forwards')">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="${fillColor(color)}">
                            <polygon points="9,5 19,12 9,19" />
                        </svg>
                    </button>
                </div>
                
                <button type="button" class="btn-close btn-close-${fillColor(color)}" data-bs-dismiss="modal"></button>
            </div>
        </div>
    `
}

async function catchMonster(json, translation) {
    return {
        id: json.id,
        stats: json.stats,
        height: json.height,
        weight: json.weight,
        name: translation[0],
        description: translation[1],
        species: translation[2],
        captureRate: translation[3],
        evolution: translation[4],
        image: json.sprites.other["official-artwork"].front_default,
        types: json.types.map(typeInfo => typeInfo.type.name),
        weaknesses: await exploiter(json),
        cries: json.cries.latest
    };
}

function emAll(evolution) {
    if (evolution.length === 3) {
        return `<figure><image class="w-25" src="${evolution[0][1]}" alt="${evolution[0][0]}"><figcaption>${evolution[0][0]}</figcaption></figure>
                <svg width="100" height="100" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="10,10 30,25 10,40" stroke="black" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <figure><image class="w-25" src="${evolution[1][1]}" alt="${evolution[1][0]}"><figcaption>${evolution[1][0]}</figcaption></figure>
                <svg width="100" height="100" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="10,10 30,25 10,40" stroke="black" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <figure><image class="w-25" src="${evolution[2][1]}" alt="${evolution[2][0]}"><figcaption>${evolution[2][0]}</figcaption></figure>`
    } else if (evolution.length === 2) {
        return `<figure><image class="w-25" src="${evolution[0][1]}" alt="${evolution[0][0]}"><figcaption>${evolution[0][0]}</figcaption></figure>
                <svg width="100" height="100" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="10,10 30,25 10,40" stroke="black" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <figure><image class="w-25" src="${evolution[1][1]}" alt="${evolution[1][0]}"><figcaption>${evolution[1][0]}</figcaption></figure>`
    } else {
        return `Keine Entwicklungen`
    }
}