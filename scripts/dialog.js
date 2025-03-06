function test(id) {
    const myModal = new bootstrap.Modal(document.getElementById("myModal"));
    document.getElementById("myModal").style.paddingRight = "0";
    monsters.some(monster => {
        if (monster.id === id) {
            console.log(monster.name, monster.id, monster.types);
            //TODO: innerHTML += Template
        }
    })

    myModal.show();
}