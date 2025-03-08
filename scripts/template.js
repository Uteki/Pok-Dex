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

function dialogTemplate(name, id, image, description, types, color, weaknesses, stats, height, weight, cries, captureRate, species) {
    //TODO: order values, change divs
    return `
        <div class="modal-content ${color}">
            <div class="modal-header">
                <h5 class="modal-title">${name}</h5>
                <span>Nr. ${calcNr(id)}</span>
            </div>
            
            <div class="modal-body">
            <div class="nav-link">
                <a class="nav-item">Dexmon</a>
                <a class="nav-item">Stats</a>
                <a class="nav-item">Info</a>
                <a class="nav-item">Entwicklung</a>
            </div>
                <div>
                    <img src=${image} alt="${name}" class="col w-50">
                    
                    <p>${description}</p>
                     
                     <div>
                        <h5>Typ</h5>
                        <ul>${types}</ul>
    
                        <h5>Schwächen</h5>
                        <ul class="d-flex flex-wrap">${weaknesses}</ul>
                    </div>
                    
                    <div class="d-flex align-items-center" style="background-color: #a4a4a4">
                        <div style="font-size: 11px !important;">
                            <div>KP</div><div>Angriff</div><div>Vert.</div><div>Sp.-Ang.</div><div>Sp.-Vert.</div><div>Initiative</div>
                        </div>
                        
                        <div class="w-100">
                            <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="${stats[0].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${stats[0].base_stat / 2}%">${stats[0].base_stat}</div>
                            </div>
                            
                            <div class="progress" role="progressbar" aria-label="Segment two" aria-valuenow="${stats[1].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: ${stats[1].base_stat / 2}%">${stats[1].base_stat}</div>
                            </div>
                            
                            <div class="progress" role="progressbar" aria-label="Segment three" aria-valuenow="${stats[2].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" style="width: ${stats[2].base_stat / 2}%">${stats[2].base_stat}</div>
                            </div>
                            
                            <div class="progress" role="progressbar" aria-label="Segment four" aria-valuenow="${stats[3].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" style="width: ${stats[3].base_stat / 2}%">${stats[3].base_stat}</div>
                            </div>
                           
                            <div class="progress" role="progressbar" aria-label="Segment five" aria-valuenow="${stats[4].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" style="width: ${stats[4].base_stat / 2}%">${stats[4].base_stat}</div>
                            </div>
                            
                            <div class="progress" role="progressbar" aria-label="Segment six" aria-valuenow="${stats[5].base_stat}" aria-valuemin="0" aria-valuemax="252">
                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" style="width: ${stats[5].base_stat / 2}%">${stats[5].base_stat}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>Größe: ${height*10}cm Gewicht: ${weight/10}kg Fangrate: ${((captureRate / 255) * 100).toFixed(2) + "%"} Spezies: ${species}</div>
                    
                    <div class="d-flex align-items-center gap-3">
                        <button class="btn btn-primary" onclick="document.getElementById('pokeCry').play()">🔊 Schrei</button>
                        <audio id="pokeCry">
                            <source src="${cries}" type="audio/ogg">
                        </audio>
                    </div>

                </div>
            </div>
        
            <div class="modal-footer">
                <button onclick="monsterDialog(${id}, 'backwards')">left</button><button onclick="monsterDialog(${id}, 'forwards')">right</button>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
        image: json.sprites.other["official-artwork"].front_default,
        types: json.types.map(typeInfo => typeInfo.type.name),
        weaknesses: await exploiter(json),
        cries: json.cries.latest
    };
}