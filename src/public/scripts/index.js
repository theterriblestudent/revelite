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

let isCategorySectionShown = false;

const categoryChev = document.querySelector(".fa-chevron-down");
const productsSection = document.querySelector(".products");
const categorySelector = document.querySelector(".category-selector");

const cartItemsContainer = document.querySelector(".cart-items");
const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

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

productsSection.style.top = `${categoryChev.getBoundingClientRect().bottom - 90}px`;

categoryChev.addEventListener('click', function(event) {
    categoryChev.classList.toggle("opened-category-selector-chevron")

    if (isCategorySectionShown = !isCategorySectionShown) 
        productsSection.style.top = `${categorySelector.getBoundingClientRect().bottom - 60}px`;
    else 
        productsSection.style.top = `${categoryChev.getBoundingClientRect().bottom - 90}px`;
});

function getItemHTML(item) {
    return(
        `
            <div id="item-${item.id}" class="[ cart-item ][ grd g-20 ]">
                <div class="[ img-bg ][ flx jc-center ai-center ]">
                    <img src="/static/product_images${item.image}" alt="">
                </div>
                <div class="[ flx row js-sb ai-start g-50 ]">
                    <h2 class="[ item-name ][ font-primary clr-dark fs-20 fw-norm ]">${item.name}</h2>
                    <i class="[ delete-item-button ][ fa-solid fa-trash-can ][ pt-5 fs-18 ]" aria-hidden="true"></i>
                </div>
                <div class="[ w-fit ][ flx row jc-sb ai-center ]">
                    <h2 class="[ heading ][ fs-24 ]">R ${item.price}</h2>
                    <div class="[ qty-selector ][ flx row g-20 ai-center jc-start pt-5 pb-5 pl-25 pr-25 ]">
                        <p class="[ remove-quantity-button ][ heading ][ fs-20 fw-bold pointer ]">-</p>
                        <p class="[ qty ][ heading ][ fs-20 fw-bold ]">${item.qty || 1}</p>
                        <p class="[ add-quantity-button ][ heading ][ fs-20 fw-bold pointer ]">+</p>
                    </div>
                </div>
            </div>
        `
    )
}

function addToCart(item_id, price = 0.00, name = "", image = "") {
    fetch("/shop/cart", {
        method: 'POST',
        body: JSON.stringify(
            {
                item_id,
                qty: 1
            }
        ),
        headers: {"Content-Type": "application/json"}
    })
    .then(response => {
        response.json()
        .then(function(data) {
            const cartItemHTML = document.querySelector(`#item-${data.id}`);
            const cartItemsDiv = document.querySelector(".cart-items");
            
            if(response.status === 401) {
                const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
                let alreadyInCart = false;

                currentCart.forEach((cart_item) => {
                    if(cart_item.id == item_id) {
                        document.querySelector(`#item-${item_id}`).querySelector(".qty").innerHTML =
                        parseInt(document.querySelector(`#item-${item_id}`).querySelector(".qty").innerHTML) + 1;
                        cart_item.qty++;
                        alreadyInCart = true;
                    }
                });

                if (!alreadyInCart) {
                    currentCart.push({id: item_id, qty: 1, price, name, image});
                    cartItemsDiv.innerHTML += getItemHTML({id: item_id, name, image, price});
                }
                localStorage.setItem("cart", JSON.stringify(currentCart));

            }else if (response.status === 200) {

                if(cartItemHTML) {
                    cartItemHTML.querySelector(".qty").innerHTML = `${parseInt(cartItemHTML.querySelector(".qty").innerHTML) + 1}`;
                }
                else  {
                    cartItemsDiv.innerHTML += getItemHTML(data)
                };
            }
        })
        .catch(error => console.log(error));
    }).catch((error) => {
        console.log(error);
    })    
}

function removeFromCart(item_id) {
    fetch('/shop/cart', {
        method: 'DELETE',
        body: JSON.stringify({
            item_id
        }),
        headers: {"Content-Type": "application/json"}
    })
    .then(response => response.json().then(data => {
        if (response.status === 200) {
            cartItemsContainer.removeChild(document.getElementById(`item-${item_id}`));

        } else if (response.status === 401) {
            let currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
            currentCart = currentCart.filter(item => item.id !== item_id);
            localStorage.setItem("cart", JSON.stringify(currentCart));

            cartItemsContainer.removeChild(document.getElementById(`item-${item_id}`));
        }
    })
    .catch(error => console.log(error)))
    .catch(error => console.log(error));
}

function removeItemQuantity(item_id, qty_str) {
    const qty = parseInt(qty_str);

    if (qty === 1) {
        removeFromCart(item_id);
        return;
    }

    fetch("/shop/cart", {
        method: 'PATCH',
        body: JSON.stringify({
            item_id
        }),
        headers: {"Content-Type": "application/json"}
    }).then(response => response.json().then(data => {
        if(response.status === 200) {
            cartItemsContainer.querySelector(`#item-${item_id}`).querySelector(".qty").innerHTML = qty - 1;
        } else if (response.status === 401) {
            const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

            localCart.forEach(item => {
                if (item.id == item_id) {
                    item.qty--;
                }
            })

            localStorage.setItem("cart", JSON.stringify(localCart));
            cartItemsContainer.querySelector(`#item-${item_id}`).querySelector(".qty").innerHTML = qty - 1;
        }
    }))
}

function addItemClickEvents(item) {
    item.querySelector(".add-quantity-button").addEventListener("click", function(event) {
        addToCart(parseInt(item.id.split("-")[1]));
    });
    item.querySelector(".delete-item-button").addEventListener("click", function(event) {
        removeFromCart(parseInt(item.id.split("-")[1]));
    });
    item.querySelector(".remove-quantity-button").addEventListener("click", function(event) {
        removeItemQuantity(parseInt(item.id.split("-")[1]), item.querySelector(".qty").innerHTML);
    });
}

function addItemEventListeners() {
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach(cartItem => {
        addItemClickEvents(cartItem);
    })
}

fetch("/shop/cart").then(response => {
    if(response.status === 200) {
        response.json().then(data => {
            data.cart.forEach(item => {
                cartItemsContainer.innerHTML += getItemHTML(item);  
            });
            addItemEventListeners();
        })
    }
    else if(response.status === 401) {
        localCart.forEach(item =>  {
            cartItemsContainer.innerHTML += getItemHTML(item)
        });
        addItemEventListeners();
    }
});
