//Navbar componets
const body = document.querySelector('body');
const shopLink = document.querySelector(".shop-link");
const catalogueLinks = shopLink.querySelector('div');
const accountLink = document.querySelector(".account-link");
const acocuntSettings = accountLink && accountLink.querySelector("div");

const mobileNav = document.querySelector('.mobile-nav');
const closeNavButton = mobileNav.querySelector('.fa-times');
const openNavButton = document.querySelector(".fa-bars");
const openCartButton = document.querySelector(".cart-button");
const mobileCartButton = document.querySelector(".mobile-cart-button");
const cart = document.querySelector(".shopping-cart");
const closeCart = cart.querySelector(".fa-times");

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

//Open Cart 
function openCart(event) {
    cart.classList.add("shown-cart");
}

openCartButton.addEventListener("click", openCart)
mobileCartButton.addEventListener("click", openCart)

//Close Cart
closeCart.addEventListener("click", function(event) {
    cart.classList.remove("shown-cart");
})


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