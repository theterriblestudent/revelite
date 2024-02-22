//Navbar componets
const body = document.querySelector('body');
const shopLink = document.querySelector(".shop-link");
const catalogueLinks = shopLink.querySelector('div');
const accountLink = document.querySelector(".account-link");
const acocuntSettings = accountLink && accountLink.querySelector("div");

const mobileNav = document.querySelector('.mobile-nav');
const closeNavButton = document.querySelector('.fa-times');
const openNavButton = document.querySelector(".fa-bars");

//Event Listeners
shopLink.addEventListener('click', function() {
    catalogueLinks.classList.toggle("shown-catalogue");
});

if (accountLink) {
    accountLink.addEventListener('click', function() {
        acocuntSettings.classList.toggle("shown-catalogue");
    });
}

closeNavButton.addEventListener("click", function() {
    mobileNav.classList.remove("shown-nav");
});

openNavButton.addEventListener("click", function() {
    mobileNav.classList.add("shown-nav");
});


body.addEventListener('click', function(event) {
    if (!shopLink.contains(event.target)) {
        catalogueLinks.classList.remove("shown-catalogue");
    }
    if (accountLink && !accountLink.contains(event.target)) {
        acocuntSettings.classList.remove("shown-catalogue");
    }

    if (!document.querySelector('nav').contains(event.target)) {
        mobileNav.classList.remove("shown-nav");
    }
})