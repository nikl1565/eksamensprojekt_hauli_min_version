// Når DOMen er loadet..
document.addEventListener("DOMContentLoaded", init);

// Så kør start funktionen
function init() {
    // Ved klik på hamburger menu knappen --> toggleHeaderBurgerIcon()
    document.querySelector(".js_header_burger_icon").addEventListener("click", toggleHeaderBurgerIcon);
}

// Toggle / skift mellem åben og lukket mobilmenu
function toggleHeaderBurgerIcon() {
    console.log("toggle menu");

    // Hvis menuen er åben, så bliver "css_header_mobile_open" fjernet
    // Hvis menuen er lukket, så bliver "css_header_mobile_open" tilføjet
    document.querySelector("header").classList.toggle("css_header_mobile_open");


    document.querySelector(".kurv").classList.toggle("kurv_kom_frem");

    // Vi tjekker om menuen er åben, ved at se om
    // header har klassen "css_header_mobile_open".
    // Hvis den har, så er den åben
    let isOpen = document.querySelector("header").classList.contains("css_header_mobile_open");

    // Hvis menuen er åben i forvejen...
    if (isOpen == true) {
        // ... så udskift SVG kryds ikonet med SVG hamburger ikonet
        document.querySelector(".js_header_burger_icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    } else {
        // ... og hvis den ikke er, så udskift SVG hamburger ikonet med SVG kryds ikonet
        document.querySelector(".js_header_burger_icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    }

}
