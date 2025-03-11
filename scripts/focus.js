let lastFocusedElement;
let lastScrollY;

function fixFocus() {
    const modal = document.getElementById("myModal");
    modal.addEventListener("show.bs.modal", () => {
        [lastFocusedElement, lastScrollY] = saveState();
    });

    modal.addEventListener("hide.bs.modal", () => modal.setAttribute("inert", "true"));
    modal.addEventListener("hidden.bs.modal", () => restoreState(modal, lastFocusedElement, lastScrollY));
}


function saveState() {
    return [
        document.activeElement,
        window.scrollY
    ];
}

function restoreState(modal, lastFocusedElement, lastScrollY) {
    modal.removeAttribute("inert");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    requestAnimationFrame(() => {
        lastFocusedElement?.focus();
        window.scrollTo(0, lastScrollY);
    });
}
