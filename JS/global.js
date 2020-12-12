document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector(".js_header_burger_icon").addEventListener("click", toggleHeaderBurgerIcon);
}

document.querySelector(".js_header_burger_icon").addEventListener("click", toggleHeaderBurgerIcon);


function toggleHeaderBurgerIcon() {
    console.log("toggle menu");
    document.querySelector(".css_header_mobile").classList.toggle("css_header_mobile_open");

    document.querySelector(".kurv").classList.toggle("kurv_kom_frem");

    let isOpen = document.querySelector(".css_header_mobile").classList.contains("css_header_mobile_open");

    if (isOpen == true) {
        document.querySelector(".js_header_burger_icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    } else {
        document.querySelector(".js_header_burger_icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    }

}
