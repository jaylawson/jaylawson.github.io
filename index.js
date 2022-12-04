//Author: Jared Lawson
//Date: 2022.11.29
//Description: Pulls header/content/footer files to create github pages

//Main Page
/*
    website will consist of four areas
    -sidebar:   for navigation
    -header:    for page overview
    -content:   for page info
    -footer:    for page end features
     ___ _______
    |   |_______| <-header
    |   |       |
    |NAV| INFO  |
    |   |_______|
    |___|_______| <-footer

    overview of site layout
*/

//sidebar creation for page
function sidebarCreate() {
    initSidebar();
}

//header creation for page
function headerCreate() {
    initHeader();
}

//content creation for page
function contentCreate() {
    initContent();
}

//footer creation for page
function footerCreate() {
    initFooter();
}
