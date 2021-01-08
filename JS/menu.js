// Start scriptet når DOM'en er loaded
window.addEventListener("DOMContentLoaded", start);

// website url (index page)
const baseUrl = 'https://schjoldby.dk/kea/10_eksamensprojekt/eksamen/wordpress/wp-json/';

// API route
let apiRoute;
const apiRouteMenu = 'wp-api-menus/v2/';
const apiRouteContent = 'wp/v2/';

// Routes
const urlRoutePage = 'page';
const urlRouteCategories = 'category';
const urlRoutePosts = 'posts';
const urlRouteMenu = 'nav_menu';

// Parameters
const parameterGetOneHundred = '?per_page=100';

// JSON Data
let categoriesData;
let pagesData;
let menusData;



async function start() {
    categoriesData = await getData(urlRouteCategories, parameterGetOneHundred);
    menusData = await getData(urlRouteMenu, '');
    console.log('menusData', menusData);
    getMenu();
}





// Henter data fra Wordpress ned asynkront
async function getData(urlRoute, urlParameter) {

    switch (urlRoute) {
        case 'category':
            console.log('Category');
            urlRoute = 'categories';
            apiRoute = apiRouteContent;
            break;
        case 'post':
            console.log('Post');
            urlRoute = 'posts';
            apiRoute = apiRouteContent;
            break;
        case 'nav_menu':
            console.log('Menu');
            urlRoute = 'menus/';
            apiRoute = apiRouteMenu;
            break;
        default:
            return console.log('Kunne ikke hente JSON ned');
            break;
    }

    const response = await fetch(`${baseUrl}${apiRoute}${urlRoute}${urlParameter}`);
    const data = await response.json();

    console.log('getData', data);
    return data;
}





async function getMenu() {
    console.log('getMenu');

    // Find alle menuer der skal vises på siden i HTML'en
    let menusOnPage = document.querySelectorAll("[data-menu]");

    menusOnPage = Array.prototype.slice.call(menusOnPage);

    for (let menu of menusOnPage) {

        // Find den rigtige menu
        let findMenu = menusData.find(menuData => menuData.name === menu.dataset.menu);

        // Hent menu detaljer
        let menuDetails = await getData(findMenu.taxonomy, findMenu.ID);
        console.log('menuDetails', menuDetails);

        if (menuDetails.items.length > 0) {
            createMenu(menuDetails, menu);
        }
    }

}





function createMenu(menuDetails, menu) {
    menu.innerHTML = `<ul class="category-list">${constructMenu(menuDetails.items)}</ul>`;
}





function constructMenu(menuItems) {
    var nav_html = '';

    for (let i = 0; i < menuItems.length; i++) {

        let title = menuItems[i]['title'];
        let link = `${menuItems[i]['title']}.html`.toLowerCase();
        let linkType = menuItems[i]['type_label'];
        let svgImage;

        let submenu = menuItems[i]['children'];

        if (linkType === 'Category') {
            console.log('Det var en kategori', menuItems[i]);
            let objectId = menuItems[i]['object_id'];

            let categoryDetails = categoriesData.find(category => category.id === objectId);

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









document.addEventListener('DOMContentLoaded', pageLoaded);

async function pageLoaded() {
    console.log('init');
    categories = await getData('categories');
    menus = await getData('menus');
}

async function getData() {
    console.log('getData');
}

function findMenusOnPage() {}

function getMenuData() {}

function constructMenu() {}

function constructMenuItem() {

    /* Detect what link should be made */
    // createCategoryLink

    // createPageLink

    // createCustomLink

    // createProductLink
}

function createCategoryLink() {}

function createPageLink() {}

function createCustomLink() {}

function createProductLink() {}

function constructSubMenu() {}

function displayMenuOnPage() {}
