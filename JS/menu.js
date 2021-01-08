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
let categories;
let posts;
let pages;
let menus;

// Start menu funktion
async function startMenu() {
    console.log('Start menu');

    // Hent alt data fra Wordpress
    categories = await getData(ROUTES.CATEGORIES.ENDPOINT, '');
    pages = await getData(ROUTES.PAGES.ENDPOINT, '');
    menus = await getData(ROUTES.MENUS.ENDPOINT, '');
    posts = await getData(ROUTES.POSTS.ENDPOINT, '');

    // Find alle menuer på siden
    findMenusOnPage();
}

// Find alle menuer på siden
async function findMenusOnPage() {
    console.log('Find menus on page');

    // Find alle menuer der skal vises på siden i HTML'en
    let menusOnPage = document.querySelectorAll("[data-menu]");
    console.log('Menus on the page ', menusOnPage);

    // Gør det muligt så vi kan brug et for loop
    menusOnPage = Array.prototype.slice.call(menusOnPage);
    console.log('Menus on the page ', menusOnPage);

    // Hvis der er en wordpress Menu på siden...
    if (menusOnPage.length > 0) {

        //... Så loop igennem alle menuer på siden
        for (let menu of menusOnPage) {

            // Find den rigtige menu
            let findMenuInformation = menus.find(menuInformation => menuInformation.name === menu.dataset.menu);
            console.log('Find menu information: ', findMenuInformation);

            // Hent menu detaljer
            let getMenuDetails = await getData(findMenuInformation.taxonomy, findMenuInformation.ID);
            console.log('Menu details: ', getMenuDetails);

            if (getMenuDetails.items.length > 0) {
                createMenu(getMenuDetails, menu);
            }
        }
    } else {
        //... Og hvis der ikke er, så stop funktionen her
        return console.log('Der er ingen menuer på siden');
    }

    // Hvis der er menuer på siden [...]

    // [...] Så
}

function constructMenu() {
    console.log('constructMenu');
}

function constructMenuItem() {
    console.log('constructMenuItem');

    /* Detect what link should be made */
    // createCategoryLink

    // createPageLink

    // createCustomLink

    // createProductLink
}

function constructSubMenu() {}

function displayMenuOnPage() {}









// Henter data fra Wordpress ned asynkront
async function getData(contentType, parameters) {
    //    console.log('Get Data content: ', contentType);

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

    //    console.log('Downloaded', contentType, DATA);
    return DATA;
}

function createMenu(menuDetails, menu) {
    menu.innerHTML = `<ul class="category-list">${constructMenu(menuDetails.items)}</ul>`;
}

function constructMenu(menuItems) {
    let nav_html = '';

    for (let i = 0; i < menuItems.length; i++) {

        let title = menuItems[i]['title'];
        let link = `${menuItems[i]['title']}.html`.toLowerCase();
        let linkType = menuItems[i]['type_label'];
        let svgImage;

        let submenu = menuItems[i]['children'];

        if (linkType === 'Category') {
            console.log('Det var en kategori', menuItems[i]);
            let objectId = menuItems[i]['object_id'];

            let categoryDetails = categories.find(category => category.id === objectId);

            if (categoryDetails.indtast_target_link != '') {
                link = categoryDetails.indtast_target_link;
            }

            if (categoryDetails.svgImage != '') {
                svgImage = categoryDetails.svg_image.guid;
            }
        } else if (linkType === 'Page') {
            link = `${menuItems[i]['object_slug']}.html`;
        } else if (linkType === 'Custom Link') {
            link = menuItems[i]['url'];
        }

        if (submenu != null) {
            constructSubmenu(menuItems[i]);
        } else {
            if (svgImage != undefined) {
                console.log('svgImage', svgImage);
                nav_html +=
                    `<li class="category-list__item">
                        <a href="${link}" class="category-list__link js-category-button">
                            <div class="category-list__icon-container">
                                <img src="${svgImage}" alt="${title}" class="category-list__icon">
                            </div>
                            <h3 class="category-list__category-title">${title}</h3>
                        </a>
                    </li>`;
            } else {
                nav_html +=
                    `<li class="category-list__item">
                        <a href="${link}" class="category-list__link js-category-button">
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

function constructCategoryLink() {
    console.log('constructCategory');
}

function constructPageLink() {
    console.log('constructPage');
}

function constructCustomLink() {
    console.log('constructCustomLink');
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
