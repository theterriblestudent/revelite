const body = document.querySelector('body');
const shopLink = document.querySelector(".shop-link");
const catalogueLinks = shopLink.querySelector('div');

shopLink.addEventListener('click', function() {
    catalogueLinks.classList.toggle("shown-catalogue");
});

body.addEventListener('click', function(event) {
    if (!shopLink.contains(event.target)) {
        catalogueLinks.classList.remove("shown-catalogue");
    }
})