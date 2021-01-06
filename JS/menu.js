window.addEventListener("DOMContentLoaded", start);

let pageUrl = window.location.pathname;
console.log(pageUrl);
let htmlName = pageUrl.substring(pageUrl.lastIndexOf('/') + 1).replace('.html', '');
console.log(htmlName);
const pageName = htmlName;
const menuPageName = pageUrl.substring(pageUrl.lastIndexOf('/') + 1);
console.log('menuPageName', menuPageName);
const globalmenuContainer = document.querySelector(".js_globalmenu");

async function start() {
    getMenu(pageName);
}

/***** Vertikal menu  *****/
/*****

Globale variabler

*****/

// website url (index page)
let baseUrl;

if (location.hostname === "127.0.0.1") {
    baseUrl = 'https://schjoldby.dk/kea/10_eksamensprojekt/eksamen/wordpress/wp-json/';
} else {
    baseUrl = `${window.location.href}/wordpress/wp-json/`;
}

let apiRoute;

// API route
let apiRouteMenu = 'wp-api-menus/v2/';
let apiRouteContent = 'wp/v2/';

// Routes
let urlRoutePage = 'page';
let urlRouteCategories = 'category';
let urlRoutePosts = 'posts';
let urlRouteMenu = 'menus';

// Parameters
let parameterGetOneHundred = '?per_page=100';

// Post types
let urlRouteFacilitet = 'facilitet';
let urlRouteFag = 'fag';
let urlRoutePersonale = 'person';

// pages, categories and posts data
let pages;
let categories;
let personale;
let faciliteter;

/*****

Globale templates og containers

*****/

// Container
let sideNavigationContainer = document.querySelector(".js_side_navigation");

// Templates
// Link
let sideNavigationLinkTemplate = document.querySelector(".js_side_navigation_link_template").content;
// List
let sideNavigationListTemplate = document.querySelector(".js_side_navigation_list_template").content;
// List item
let sideNavigationListItemTemplate = document.querySelector(".js_side_navigation_list_item_template").content;

async function getData(urlRoute, urlParameter) {

    if (urlRoute === 'category') {
        urlRoute = 'categories';
        apiRoute = apiRouteContent;
    } else if (urlRoute === 'post') {
        urlRoute = 'posts';
        apiRoute = apiRouteContent;
    } else if (urlRoute === 'page') {
        urlRoute = 'pages';
        apiRoute = apiRouteContent;
    } else if (urlRoute === 'nav_menu') {
        urlRoute = 'menus/';
    } else if (urlRoute === pageName) {
        urlRoute = 'menus';
        apiRoute = apiRouteMenu;
    } else {
        apiRoute = apiRouteContent;
    }

    let response = await fetch(`${baseUrl}${apiRoute}${urlRoute}${urlParameter}`);

    let data = await response.json();

    console.log(data);

    return data;
}

async function getMenu(menuName) {
    categories = await getData(urlRouteCategories, parameterGetOneHundred);

    // Hent array liste med menuer
    let allMenus = await getData(menuName, '');

    // Hent alle menuer der skal vises på siden
    let menusOnPage = document.querySelectorAll("[data-menu]");

    menusOnPage = Array.prototype.slice.call(menusOnPage);

    for (let menu of menusOnPage) {

        // Find den rigtige menu
        let findMenu = allMenus.find(allmenus => allmenus.name === menu.dataset.menu);

        // Hent menu detaljer
        let menuDetails = await getData(findMenu.taxonomy, findMenu.ID);

        if (menuDetails.items.length > 0) {
            createMenu(menuDetails, menu);
        }
    }

}

function createMenu(menuDetails, menu) {

    function constructMenu(menuItems) {

        var nav_html = '';

        for (let i = 0; i < menuItems.length; i++) {
            let title = menuItems[i]['title'];
            let href = `${menuItems[i]['title']}.html`;
            href = href.toLowerCase();
            let submenu = menuItems[i]['children'];
            let typeLabel = menuItems[i]['type_label'];
            let objectType = menuItems[i]['object'];

            if (typeLabel === 'fag') {
                href = `fag.html?id=${menuItems[i]['object_id']}`;
            } else if (typeLabel === 'facilitet') {

            } else if (typeLabel === 'Category') {
                let objectId = menuItems[i]['object_id'];

                let categoryDetails = categories.find(category => category.id === objectId);

                if (categoryDetails.indtast_target_link != '') {
                    href = categoryDetails.indtast_target_link;
                }
            } else if (typeLabel === 'Page') {
                href = `${menuItems[i]['object_slug']}.html`;
            } else if (typeLabel === 'Custom Link') {
                href = menuItems[i]['url'];
            }

            if (submenu != null) {
                nav_html += `<li class="list__item"><a class="list__link has-submenu" href="${href}">${title}<span class="list__link-arrow"></span></a>`;
                nav_html += '<ul class="list__submenu">';


                nav_html += constructMenu(submenu);
                nav_html += '</ul>';
            } else {
                // Link til fagsingleview.html hvis det er en post, som har post typen "fag".
                nav_html += `<li class="list__item"><a class="list__link" href="${href}">${title}</a>`;
            }
            nav_html += '</li>';
        }
        return nav_html;
    }

    menu.innerHTML = `<ul class="list">${constructMenu(menuDetails.items)}</ul>`;

    console.log('globalMenuContainer', globalmenuContainer);
    const globalMenuItems = globalmenuContainer.querySelector(`a[href="${menuPageName}"]`);

    if (globalMenuItems != null) {
        globalMenuItems.classList.add("is-active");
    }

    console.log('globalMenuItems', globalMenuItems);

}
