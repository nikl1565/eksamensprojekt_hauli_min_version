document.addEventListener("DOMContentLoaded", init);

//let section = document.querySelector(".about_content").content;


function init() {
    let url = 'https://schjoldby.dk/kea/10_eksamensprojekt/hauli/wordpress/wp-json/wp/v2/pages?slug=om-os';

    getData(url);
}

async function getData(url) {
    console.log('getData');

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    showData(data);
}

function showData(data) {
    console.log(data);

    //    let section = document.querySelector(".about_content");
    //    let sectionContent = section.cloneNode(true).content;
    //
    //    console.log(sectionContent);

    document.querySelector(".about_content").innerHTML = data[0].content.rendered;

}
