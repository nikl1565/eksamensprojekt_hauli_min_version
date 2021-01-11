// Indstillinger
const BASEURL = 'https://schjoldby.dk/kea/10_eksamensprojekt/eksamen/wordpress/wp-json/';
const ROUTES = {
    PAGES: {
        PATH: 'wp/v2/',
        ENDPOINT: 'pages'
    },
    CATEGORIES: {
        PATH: 'wp/v2/',
        ENDPOINT: 'categories'
    },
    POSTS: {
        PATH: 'wp/v2/',
        ENDPOINT: 'posts'
    },
    MENUS: {
        PATH: 'wp-api-menus/v2/',
        ENDPOINT: 'menus'
    },
    NAV_MENU: {
        PATH: 'wp-api-menus/v2/',
        ENDPOINT: 'menus/'
    }
}

// Det JSON data der bliver hentet ned fra Wordpress
let menuCategories;
let menuPosts;
let menuPages;
let menus;

// Når DOMen er loaded så kør startmenu funktionen
document.addEventListener("DOMContentLoaded", startMenu);

// Start menu funktion
async function startMenu() {
    console.log('Start menu');

    // Hent alt data fra Wordpress
    menuCategories = await getData(ROUTES.CATEGORIES.ENDPOINT, '');
    menuPages = await getData(ROUTES.PAGES.ENDPOINT, '');
    menuPosts = await getData(ROUTES.POSTS.ENDPOINT, '');

    // Find alle menuer på siden
    await findMenusOnPage();

    // Når alle menuer på siden er fundet og vist for brugeren
    const htmlBody = document.querySelector("body");

    // Hvis vi er på alle produkter siden..
    if (htmlBody.classList.contains("page-alle-produkter")) {
        // Så vis hvilken knap der er aktiv
        document.querySelector(`.js-category-button[data-category="${filter}"]`).classList.add("button-clicked");
        // Gør så man kan klikke på kategoriknapperne
        initCategoryButtons();
    }
}

// Find alle menuer på siden
async function findMenusOnPage() {
    console.log('Find menus on page');

    // Find alle menuer der skal vises på siden i HTML'en
    let menusOnPage = Array.prototype.slice.call(document.querySelectorAll("[data-menu-name]"));
    console.log('Menus on the page ', menusOnPage);

    // Hvis der er en wordpress Menu på siden...
    if (menusOnPage.length > 0) {
        menus = await getData(ROUTES.MENUS.ENDPOINT, '');

        //... Så loop igennem alle menuer på siden
        for (let menu of menusOnPage) {

            // Find den rigtige menu
            const findMenuInformation = menus.find(menuInformation => menuInformation.name === menu.dataset.menuName);
            console.log('Find menu information: ', findMenuInformation);

            // Hent menu detaljer
            const getMenuDetails = await getData(findMenuInformation.taxonomy, findMenuInformation.ID);
            console.log('Menu details: ', getMenuDetails);

            // Hvis menuen indeholder 1 eller flere menupunkter
            if (getMenuDetails.items.length > 0) {
                // Så find ud af hvilken menutype menuen er
                const menuType = menu.dataset.menuType;
                console.log('menuType', menuType);

                // Så lav menuen
                createMenu(getMenuDetails, menu);
            }
        }
    } else {
        //... Og hvis der ikke er, så stop funktionen her
        return console.log('Der er ingen menuer på siden');
    }


}

// Lav menuen via createMenu funktionen
function createMenu(menuDetails, menu) {
    // Og når den er lavet, så vis den for brugeren
    menu.innerHTML = `<ul class="category-list">${constructMenu(menuDetails.items)}</ul>`;
}

function constructMenu(menuItems) {
    let nav_html = '';

    // For hvert menupunkt i menuen
    for (let i = 0; i < menuItems.length; i++) {

        let title = menuItems[i]['title'];
        let link = `${menuItems[i]['title']}.html`.toLowerCase();
        let linkType = menuItems[i]['object'];
        let svgImage;
        let slug;

        let submenu = menuItems[i]['children'];

        switch (linkType) {
            // Hvis det er en kategori
            case 'category':
                console.log('Det er en kategori 🥳', menuItems[i]['title']);

                let objectId = menuItems[i]['object_id'];
                let categoryDetails = menuCategories.find(category => category.id === objectId);

                slug = categoryDetails.slug;



                if (categoryDetails.indtast_target_link != '') {
                    link = categoryDetails.indtast_target_link;
                } else {
                    link = `alle-produkter.html?filter=${categoryDetails.slug}`;
                }

                if (categoryDetails.svgImage != '') {
                    svgImage = categoryDetails.svg_image.guid;
                }

                break;

            case 'page':
                console.log('Det er en page 🥳', menuItems[i]['title']);
                link = `${menuItems[i]['object_slug']}.html`;
                break;

            case 'custom':
                console.log('Det er et custom link! 🥳', menuItems[i]['title']);
                link = menuItems[i]['url'];
                break;

            case 'produkt':
                console.log('Det er et produkt link! 🥳', menuItems[i]['title']);
                break;

            default:
                console.log('Jeg ved ikke hvad det her er 😢', menuItems[i]['title']);
        }


        if (submenu != null) {
            constructSubmenu(menuItems[i]);
        } else {
            if (svgImage != undefined) {
                nav_html +=
                    `<li class="category-list__item">
                        <a href="${link}" class="category-list__link js-category-button" data-category="${slug}">
                            <div class="category-list__icon-container">
                                <img src="${svgImage}" alt="${title}" class="category-list__icon">
                            </div>
                            <h3 class="category-list__category-title">${title}</h3>
                        </a>
                    </li>`;

            } else {
                nav_html +=
                    `<li class="category-list__item">
                        <a href="${link}" class="category-list__link js-category-button" data-category="${slug}">
                            <div class="category-list__icon-container">
                                <img src="img/alle-produkter.svg" alt="${title}" class="category-list__icon">
                            </div>
                            <h3 class="category-list__category-title">${title}</h3>
                        </a>
                    </li>`;
            }
        }
        nav_html += '</li>';
    }

    return nav_html;
}

function constructSubmenu(submenu) {
    console.log('submenu', submenu);

    nav_html +=
        `<li class="list__item">
            <a class="list__link has-submenu" href="${href}">
                ${title}
                    <span class="list__link-arrow"></span>
            </a>`;
    nav_html += '<ul class="list__submenu">';
    nav_html += constructMenu(submenu);
    nav_html += '</ul>';
}

// Henter data fra Wordpress ned asynkront
async function getData(contentType, parameters) {

    let path;
    let endpoint;

    switch (contentType) {
        case 'categories':
            path = ROUTES.CATEGORIES.PATH;
            endpoint = ROUTES.CATEGORIES.ENDPOINT;
            break;

        case 'posts':
            path = ROUTES.POSTS.PATH;
            endpoint = ROUTES.POSTS.ENDPOINT;
            break;

        case 'pages':
            path = ROUTES.PAGES.PATH;
            endpoint = ROUTES.PAGES.ENDPOINT;
            break;

        case 'menus':
            path = ROUTES.MENUS.PATH;
            endpoint = ROUTES.MENUS.ENDPOINT;
            break;

        case 'nav_menu':
            path = ROUTES.NAV_MENU.PATH;
            endpoint = ROUTES.NAV_MENU.ENDPOINT;
            break;

        default:
            return console.log('Kunne ikke hente JSON ned');
            break;
    }

    const RESPONSE = await fetch(`${BASEURL}${path}${endpoint}${parameters}`);
    const DATA = await RESPONSE.json();

    return DATA;
}









function constructMenuItem() {
    console.log('constructMenuItem');

    /* Detect what link should be made */

    // createCategoryLink

    // createPageLink

    // createCustomLink

    // createProductLink
}

function createCategoryLink() {
    console.log('constructCategory');
}

function constructPageLink() {
    console.log('constructPage');
}

function constructCustomLink() {
    console.log('constructCustomLink');
}

function constructSubMenu() {}

function showMenu() {}
