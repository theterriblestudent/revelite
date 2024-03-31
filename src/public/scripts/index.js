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
                    <h2 class="[ item-price ][ heading ][ fs-24 ]">R ${item.price}</h2>
                    <div class="[ qty-selector ][ flx row g-20 ai-center jc-start pl-10 pr-10 ]">
                        <p class="[ remove-quantity-button ][ heading ][ fs-20 fw-bold pointer pl-5 pr-5 pt-5 pb-5 ]">-</p>
                        <p class="[ qty ][ heading ][ fs-20 fw-bold ]">${item.qty || 1}</p>
                        <p class="[ add-quantity-button ][ heading ][ fs-20 fw-bold pointer pl-5 pr-5 pt-5 pb-5 ]">+</p>
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

                        updateTotals();
                    }
                });

                if (!alreadyInCart) {
                    currentCart.push({id: item_id, qty: 1, price, name, image});
                    cartItemsDiv.innerHTML += getItemHTML({id: item_id, name, image, price});

                    window.setTimeout(() => {
                        addItemEventListeners();
                    }, 10);

                }
                localStorage.setItem("cart", JSON.stringify(currentCart));

            }else if (response.status === 200) {

                if(cartItemHTML) {
                    cartItemHTML.querySelector(".qty").innerHTML = `${parseInt(cartItemHTML.querySelector(".qty").innerHTML) + 1}`;
                    updateTotals();
                }
                else  {
                    cartItemsDiv.innerHTML += getItemHTML(data);
                    window.setTimeout(() => {
                        addItemEventListeners();
                    }, 10);
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
            updateTotals();

        } else if (response.status === 401) {
            let currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
            currentCart = currentCart.filter(item => item.id !== item_id);
            localStorage.setItem("cart", JSON.stringify(currentCart));

            cartItemsContainer.removeChild(document.getElementById(`item-${item_id}`));
            updateTotals();
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
            updateTotals();
        } else if (response.status === 401) {
            const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

            localCart.forEach(item => {
                if (item.id == item_id) {
                    item.qty--;
                }
            })

            localStorage.setItem("cart", JSON.stringify(localCart));
            cartItemsContainer.querySelector(`#item-${item_id}`).querySelector(".qty").innerHTML = qty - 1;
            updateTotals();
        }
    }))
}

function eventHandlers(event) {
    const target = event.target;

    if (target.classList.contains("add-quantity-button")) {
        addToCart(parseInt(target.closest(".cart-item").id.split("-")[1]));
    } else if (target.classList.contains("remove-quantity-button")) {
        removeItemQuantity(parseInt(target.closest(".cart-item").id.split("-")[1]), target.closest(".cart-item").querySelector(".qty").innerHTML);
    } else if(target.classList.contains("delete-item-button")) {
        removeFromCart(parseInt(target.closest(".cart-item").id.split("-")[1]));
    }
}

function updateTotals() {
    const totalCostP = document.querySelector("#total-price");
    const totalQtyP = document.getElementById("items-no");

    let totalCost = 0;
    let totalQty = 0;

    cartItemsContainer.querySelectorAll(".cart-item").forEach(item => {
        totalCost += parseFloat(item.querySelector(".item-price").innerHTML.split(" ")[1]) * parseInt(item.querySelector(".qty").innerHTML);
        totalQty += parseInt(item.querySelector(".qty").innerHTML);
    });

    totalCostP.innerHTML = `R ${totalCost}`;
    totalQtyP.innerHTML = `(${totalQty} items)`;
}

function addItemEventListeners() {
    cartItemsContainer.removeEventListener("click", eventHandlers);
    cartItemsContainer.addEventListener("click", eventHandlers);

    updateTotals();
}

fetch("/shop/cart").then(response => {
    if(response.status === 200) {
        response.json().then(data => {
            data.cart.forEach(item => {
                cartItemsContainer.innerHTML += getItemHTML(item);
            });
            addItemEventListeners({totalCost, totalItems});
        })
    }
    else if(response.status === 401) {
        localCart.forEach(item =>  {
            cartItemsContainer.innerHTML += getItemHTML(item);
        });
        addItemEventListeners();
    }
});
