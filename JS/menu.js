// Indstillinger

const BASEURL = 'https://schjoldby.dk/kea/10_eksamensprojekt/eksamen/wordpress/wp-json/';

// Et object der beskriver hvilke endpoints der er til de forskellige ting man kan hente
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

// Globale variabler
// Skal indeholde det JSON data der bliver hentet ned fra Wordpress
// Som vi skal bruge til menuen
let menuCategories;
let menuPosts;
let menuPages;
let menus;





// Når DOMen er loaded så kør startMenu funktionen
document.addEventListener("DOMContentLoaded", startMenu);





// Start menu funktion
async function startMenu() {
    console.log('Start menu');

    // Hent alt data fra Wordpress som vi skal bruge til menupunkterne
    menuCategories = await getData(ROUTES.CATEGORIES.ENDPOINT, '');
    menuPages = await getData(ROUTES.PAGES.ENDPOINT, '');
    menuPosts = await getData(ROUTES.POSTS.ENDPOINT, '');

    // Find alle menuer på siden
    await findMenusOnPage();

    // Når alle menuer på siden er fundet og vist for brugeren
    const htmlBody = document.querySelector("body");

    // Hvis vi er på alle-produkter.html siden..
    if (htmlBody.classList.contains("page-alle-produkter")) {

        // Så vis hvilken knap der er aktiv
        document.querySelector(`[data-category="${filter}"]`).classList.add("button-clicked");
        // Gør så man kan klikke på kategoriknapperne
        initCategoryButtons();
    }
}

// Find alle menuer på siden
async function findMenusOnPage() {
    console.log('Find menus on page');

    // Find alle menuer der skal vises på siden i HTML'en
    let menusOnPage = Array.prototype.slice.call(document.querySelectorAll("[data-menu-name]"));

    // Hvis der er en eller flere menuer på siden...
    if (menusOnPage.length > 0) {
        // Så hent basic info om alle menuer fra Wordpress
        menus = await getData(ROUTES.MENUS.ENDPOINT, '');
        console.log('Menuer fra Wordpress', menus);

        // og loop herefter igennem alle menuer på siden
        for (let menu of menusOnPage) {

            // Find den rigtige menu fra basic info
            const findMenuInformation = menus.find(menuInformation => menuInformation.name === menu.dataset.menuName);

            // Herefter hent detaljerne om menuen
            const getMenuDetails = await getData(findMenuInformation.taxonomy, findMenuInformation.ID);

            // Hvis menuen indeholder 1 eller flere menupunkter...
            if (getMenuDetails.items.length > 0) {
                //... Så find ud af hvilken menutype menuen er
                const menuType = menu.dataset.menuType;

                // Viser menunavn og menutype i konsollen med rød baggrund
                console.table(`%cMenunavnet er: ${getMenuDetails.name} 🤓`, 'background: #FFE4E4; font-size: 1rem;');
                console.log(`%cMenutypen er ${menuType} 🤓`, 'background: #FFE4E4; font-size: 0.8rem;');

                // og lav menuen
                createMenu(getMenuDetails, menu);
            } else {
                // ... og hvis ikke så stop funktionen her
                return console.log('Menuen indeholder ingen menupunkter 😔');
            }
        }
    } else {
        //... Og hvis der ikke er, så stop funktionen her
        return console.log('Der er ingen menuer på siden 😔');
    }


}



// Lav menuen via createMenu funktionen
function createMenu(menuDetails, menu) {

    let menuType = menu.dataset.menuType;

    // Og når den er lavet, så vis den for brugeren
    // i forskellige layouts alt efter hvilken slags menu det er
    switch (menuType) {
        case 'header':
            menu.innerHTML = `<ul>${constructMenu(menuDetails.items, menuType)}</ul>`;
            break;

        case 'footer':
            menu.innerHTML = `<ul>${constructMenu(menuDetails.items, menuType)}</ul>`;
            break;

        case 'slider':
            menu.innerHTML = `<ul class="category-list">${constructMenu(menuDetails.items, menuType)}</ul>`;
            break;

        default:
            console.log('Jeg ved ikke hvilken menutype det er 😔');
            break;
    }
}






function constructMenu(menuItems, menuType) {
    // Hele menustrukturen for menuen
    let menuStructure = '';

    // For hvert menupunkt i menuen
    for (let i = 0; i < menuItems.length; i++) {


        let link = `${menuItems[i]['title']}.html`.toLowerCase();

        let menuItemInfo = {
            title: menuItems[i]['title'],
            link: link,
            linkType: menuItems[i]["object"],
            svgImage: '',
            slug: '',
            submenu: menuItems[i]['children']
        }

        switch (menuItemInfo.linkType) {
            case 'category':
                console.log(`Menupunkt nr. ${i + 1} er et kategori link 🥳 ${menuItems[i]['title']}`);

                menuStructure += createCategoryLink(menuItems[i], menuType);
                break;

            case 'page':
                console.log(`Menupunkt nr. ${i + 1} er en page 🥳 ${menuItems[i]['title']}`);
                menuStructure += createPageLink(menuItems[i], menuType);
                break;

            case 'custom':
                console.log(`Menupunkt nr. ${i + 1} er et custom link 🥳 ${menuItems[i]['title']}`);
                link = menuItems[i]['url'];
                menuStructure += createCustomLink(menuItems[i], menuType);
                break;

            case 'produkt':
                console.log(`Menupunkt nr. ${i + 1} er et produkt link 🥳 ${menuItems[i]['title']}`);
                menuStructure += createProductLink(menuItems[i], menuType);
                break;

            default:
                console.log('Jeg ved ikke hvad det her er 😢', menuItems[i]['title']);
        }

        // Later 🐊
        //        if (menuItemInfo.submenu != null) {
        //            createSubmenu(menuItems[i]);
        //        } else { menuStructure += '</li>'; }

        menuStructure += '</li>';
    }

    return menuStructure;
}





function createProductLink(menuItem, menuType) {

    switch (menuType) {
        case 'header':
            break;

        case 'footer':
            break;

        case 'slider':
            break;

        default:
            break;
    }
}





function createCategoryLink(menuItem, menuType) {
    // Det link vi opretter
    let html;


    let objectId = menuItem.object_id;
    let categoryDetails = menuCategories.find(category => category.id === objectId);

    menuItem.slug = categoryDetails.slug;

    if (categoryDetails.indtast_target_link != '') {
        menuItem.link = categoryDetails.indtast_target_link;
    } else {
        menuItem.link = `alle-produkter.html?filter=${categoryDetails.slug}`;
    }

    if (categoryDetails.svgImage != '') {
        menuItem.svgImage = categoryDetails.svg_image.guid;
    }

    switch (menuType) {
        case 'header':
            html = `
                <li class="overpunkter mobile_styling">
                    <a href="${menuItem.link}" class="overpunkter_styling">${menuItem.title}</a>
                </li>`;
            break;

        case 'footer':
            html = `
                <li>
                    <a class="footer_link" href="${menuItem.link}">${menuItem.title}</a>
                </li>`;
            break;

        case 'slider':
            html = `<li class="category-list__item">
                        <a href="${menuItem.link}" class="category-list__link js-category-button" data-category="${menuItem.slug}">
                            <div class="category-list__icon-container">
                                <img src="${menuItem.svgImage ? menuItem.svgImage : 'img/alle-produkter.svg'}" alt="${menuItem.title}" class="category-list__icon">
                            </div>
                            <h3 class="category-list__category-title">${menuItem.title}</h3>
                        </a>
                    </li>`;
            break;

        default:
            console.log('Jeg ved ikke hvilken menutype det er 😔');
            break;
    }

    return html;
}





function createPageLink(menuItem, menuType) {

    let html;

    menuItem.link = `${menuItem.object_slug}.html`;

    switch (menuType) {
        case 'header':
            html = `
                <li class="overpunkter mobile_styling">
                    <a href="${menuItem.link}" class="overpunkter_styling">${menuItem.title}</a>
                </li>`;


            break;

        case 'footer':
            html = `
                <li>
                    <a class="footer_link" href="${menuItem.link}">${menuItem.title}</a>
                </li>`;
            break;

        case 'slider':
            break;

        default:
            console.log('Jeg ved ikke hvilken menutype det er 😔');
            break;
    }

    return html;
}





function createCustomLink(menuItem, menuType) {

    let html;

    menuItem.link = menuItem.url;

    switch (menuType) {
        case 'header':
            html = `
                <li class="overpunkter mobile_styling">
                    <a href="${menuItem.link}" class="overpunkter_styling">${menuItem.title}</a>
                </li>`;
            break;
        case 'footer':
            html = `
                <li>
                    <a class="footer_link" href="${menuItem.link}">${menuItem.title}</a>
                </li>`;
            break;
        case 'slider':
            break;
        default:
            console.log('Jeg ved ikke hvilken menutype det er 😔');
            break;
    }

    return html;
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







/* :-) */
function createSubmenu(submenu) {
    console.log('createSubMenu', submenu);

    menuStructure +=
        `<li class="list__item">
            <a class="list__link has-submenu" href="${href}">
                ${title}
                    <span class="list__link-arrow"></span>
            </a>`;
    menuStructure += '<ul class="list__submenu">';
    menuStructure += constructMenu(submenu);
    menuStructure += '</ul>';
}
