let cartIcon = document.getElementById("cartIcon");
let card = document.querySelector(".myCard");
let closeCart = document.getElementById("closeCart");
let prouductsItem = document.querySelector(".prouductsItem");
let categoryBtn = document.querySelectorAll("#productBtn button");
let cartHover = document.getElementById("hoverCart");
let decrement = document.getElementById("decrement");
let increment = document.getElementById("increment");
let num = document.getElementById("number");
let hoverCart = document.getElementById("hoverCart");
let numOfItemsCart = document.getElementById("numOfItemsCart"); 
let exitLightBoxIcon = document.querySelector("#ligthBox i");
let shopMain = document.getElementById("shop");
let links = document.querySelectorAll(".nav-item .nav-link");
let myCartTabel = document.getElementById("myCartTabel");
let addBtn = document.getElementById("addToCartFromProduct");
let cartContainer = [];


addBtn?.addEventListener("click", (e) => {
    let product = JSON.parse(localStorage.getItem("product"));
    addToCartFromProduct(e, product.id);
})


links.forEach((e) => {
    e.classList.remove("active")
    if (window.location.pathname.includes(e.getAttribute("href"))) {
        e.classList.add("active")
    }
})




increment?.addEventListener("click", function () {
    num.innerText++;
})
decrement?.addEventListener("click", function () {
    num.innerText--;
})





cartIcon.addEventListener("click", function () {
    cartHover.classList.toggle("d-none");
})


async function getSpacificProuduct(id) {
    let fetchProuduct = await fetch(`https://fakestoreapi.com/products/${id}`);
    let prouductData = await fetchProuduct.json();
    return prouductData;
}






async function getUserAccount() {
     document.getElementById("loading").classList.remove("d-none");
     document.body.classList.add("overflow-hidden");
    let user = await fetch(`https://fakestoreapi.com/users/1`)
    let userData = await user.json();
    // console.log(userData);
    document.getElementById("userName").innerHTML = `(${userData.username})`;
     document.getElementById("loading").classList.add("d-none");
     document.body.classList.remove("overflow-hidden");
}




async function getData(category) {
    if (category === "All") {
        document.getElementById("loading").classList.remove("d-none");
        document.body.classList.add("overflow-hidden");
        let getData = await fetch(`https://fakestoreapi.com/products`);
        let data = await getData.json();
        displayData(data);
        document.getElementById("loading").classList.add("d-none");
        document.body.classList.remove("overflow-hidden");
    } else {
        document.getElementById("loading").classList.remove("d-none");
        document.body.classList.add("overflow-hidden");
        let getData = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        let data = await getData.json();
        displayData(data);
        document.getElementById("loading").classList.add("d-none");
        document.body.classList.remove("overflow-hidden");
    }
}



categoryBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        document.querySelector("#productBtn .active").classList.remove("active");
        e.target.classList.add("active");
        getData(e.target.dataset.category);
    })
})


function displayData(data) {
    let cartona = '';

    for (let i = 0; i < data.length; i++){
        let rate = startRate(data[i].rating.rate)
        cartona += `
           <div id="${data[i].id}" onclick="viewProduct(this.id)" class="proItem border overflow-hidden p-2 position-relative">
                <div id="proOver" class="d-flex flex-column justify-content-between ">
                    <i onclick="showLightBox(event,${data[i].id})" class="fa-solid fa-eye"></i>
                    <i onclick="likeProduct(event)" class="fa-regular fa-heart"></i>
                </div>
                <div class="img mb-3 overflow-hidden ">
                    <img class="w-100" src="${data[i].image}" alt="">
                </div>
                <div class="body ">
                    <h6 class="fw-bold fs-5">${data[i].title.split(" ").slice(0,4).join(" ")}</h6>
                    <p class="my-1 ho">
                        ${data[i].description.split(" ").slice(0,6).join(" ")+'....'}
                    </p>
                    <p class="ho mb-1">${data[i].category}</p>
                    <div id="rate" class="mb-1">
                        ${rate}
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="fw-bold fs-5">${data[i].price} $</p>
                        <p class="bg-success rounded-2 px-2 py-1 text-white">
                            <i onclick="addToCartHover(event,${data[i].id})" class="fa-solid fa-plus"></i>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    if (prouductsItem != null) {
        prouductsItem.innerHTML = cartona;
    }
}

function likeProduct(e) {
    e.stopPropagation();
    if (e.target.classList.contains("fa-regular")) {
        e.target.classList.replace("fa-regular", "fa-solid");
        e.target.style.color = "red";
        document.getElementById("heartCount").innerText++;
    }
    else {
        e.target.classList.replace("fa-solid", "fa-regular");
        e.target.style.color = "white";
        document.getElementById("heartCount").innerText--;
    }
}
if (localStorage.getItem("userCard") !== null) {
    cartContainer = JSON.parse(localStorage.getItem("userCard"));
    displayCart(cartContainer);
    calcCardItem();
    getTotalPriceItemsInCart();
}


async function addToCartHover(event, id) {
    event.stopPropagation();
    let item = await getSpacificProuduct(id);
    let product = {
        id: id,
        item: item,
        quantity: 1,
        totalPrice: item.price
    } 
    cartContainer.push(product);
    displayCart(cartContainer);
    localStorage.setItem("userCard", JSON.stringify(cartContainer));
    calcCardItem();
    console.log(cartContainer);
    getTotalPriceItemsInCart();
}
async function addToCartFromProduct(event, id) {
    event.stopPropagation();
    let item = await getSpacificProuduct(id);
    let product = {
        id: id,
        item: item,
        quantity: document.getElementById("number").innerText ,
        totalPrice: item.price
    } 
    cartContainer.push(product);
    displayCart(cartContainer);
    localStorage.setItem("userCard", JSON.stringify(cartContainer));
    calcCardItem();
    console.log(cartContainer);
    getTotalPriceItemsInCart();
    console.log(document.getElementById("number").innerText);
}


function calcCardItem() {
    let numofItems = cartContainer.length;
    document.getElementById("cartCount").innerText = numofItems;
    numOfItemsCart.innerText = numofItems;
}

function displayCart(array) {
    let cartona = ``;
    let cartona1 = '';
    array.forEach((e) => {
        cartona += `
            <div id="${e.id}" class="cartItem mb-3">
                <div class="cartItemImg">
                    <img class="w-100" src="${e.item.image}" alt="">
                </div>
                <div class="cartItemContent mb-4">
                    <p class="m-0 mb-2">${e.item.title.split(" ").slice(0,3).join(" ")}</p>
                    <div class="info d-flex justify-content-between align-items-center">
                        <p class="price m-0 me-3">${e.totalPrice} $</p>
                        <div class="customCounter text-bg-success d-flex justify-content-between px-1 py-1 rounded-2">
                            <span onclick="handlePriceAndQuantityDecrement(event,${e.id})" class="" id="decrement">-</span>
                            <span class="quantity" id="number">${e.quantity}</span>
                            <span onclick="handlePriceAndQuantityIncrement(event,${e.id})" id="increment">+</span>
                        </div>
                    </div>
                </div>
                <i onclick="removeItemFromCart(event,${e.id})" class="fa-solid fa-xmark p-1 text-bg-danger"></i>
            </div>
        `;
        cartona1 += `
            <tr>
                <td class="d-flex justify-content-evenly">
                    <img src="${e.item.image}" width="50px" alt="">
                    <h6>${e.item.title.split(" ").slice(0, 3).join(" ")}</h6>
                </td>
                <td>
                    <p>${e.item.price} $</p>
                </td>
                <td class="customCounter">
                    <span class="me-1" id="decrement">-</span>
                    <span id="number">${e.quantity}</span>
                    <span  id="increment">+</span>
                </td>
                <td>
                    <p>${e.totalPrice} $</p>
                </td>
            </tr>
        `;
    })

    document.getElementById("cartItemsHover").innerHTML = cartona;
    if (myCartTabel !== null) {
        myCartTabel.innerHTML = cartona1;
    }
}



function handlePriceAndQuantityIncrement(e,id) {
    let qa = e.target.parentElement.querySelector(".quantity");
    let priceElem = e.target.parentElement.parentElement.querySelector(".price");
    let item;
    qa.innerText++;
    console.log("tmm + ");
    console.log(id);
    cartContainer.forEach((ele) => {
        if (ele.id === id) {
            ele.quantity = Number(qa.innerText);
            item = ele;
        }
    })
    let totalPrice = item.quantity * item.item.price;
    priceElem.innerHTML = totalPrice + " $";
    console.log(item);
    item.totalPrice = totalPrice;
    console.log(cartContainer);
    localStorage.setItem("userCard", JSON.stringify(cartContainer));
    getTotalPriceItemsInCart();
}

function getTotalPriceItemsInCart() {
    let total=0;
    cartContainer.forEach((e) => {
        total+= +e.totalPrice;
        console.log(e.totalPrice);
    })
    console.log(total);
    document.getElementById("totalPriceCart").innerHTML=`Total Price : ${total} $`;
}

function handlePriceAndQuantityDecrement(e, id) {
    let qa = e.target.parentElement.querySelector(".quantity");
    let priceElem = e.target.parentElement.parentElement.querySelector(".price");
    let item;
    qa.innerText--;
    console.log("tmm - ");
    console.log(id);
    cartContainer.forEach((ele) => {
        if (ele.id === id) {
            ele.quantity = Number(qa.innerText);
            item = ele;
        }
    })
    let totalPrice = item.quantity * item.item.price;
    priceElem.innerHTML = totalPrice + " $";
    item.totalPrice = totalPrice;
    console.log(cartContainer);
    localStorage.setItem("userCard", JSON.stringify(cartContainer));
    getTotalPriceItemsInCart();
}

function removeItemFromCart(event,id){
    for (let i = 0; i < cartContainer.length; i++){
        if (cartContainer[i].id === id) {
            cartContainer.splice(i, 1); 
        }
    }
    localStorage.setItem("userCard", JSON.stringify(cartContainer));
    displayCart(cartContainer);
    calcCardItem();
    getTotalPriceItemsInCart();
};


function startRate(rate) {
    let cartona = ``;
    let roundRate = Math.round(Number(rate));
    for (let i = 1; i <= roundRate; i++){
        cartona += `<i class="fa-solid fa-star cold me-1"></i>`;
    }
    return cartona;
}


getUserAccount().then(function () {
    getData("All");
});

async function viewProduct(id) {
    let data = await getSpacificProuduct(id);
    localStorage.setItem("product", JSON.stringify(data));
    window.location.pathname = "/product.html";
}

if (window.location.pathname === "/product.html") {
    if (localStorage.getItem("product") !== null) {
        pro = JSON.parse(localStorage.getItem("product"));
        document.getElementById("spcTitle").innerHTML = pro.title;
        document.getElementById("spcCategory").innerHTML = pro.category;
        document.getElementById("spcPrice").innerHTML = `${pro.price} $`;
        let proRate = startRate(pro.rating.rate);
        document.getElementById("proRate").innerHTML = proRate;
        document.getElementById("proDetails").innerHTML = pro.description;
        document.getElementById("proImg").setAttribute("src", `${pro.image}`);
    }
}

async function showLightBox(event, id) {
    event.stopPropagation();
    let product = await getSpacificProuduct(id);
    let productImg = product.image;
    let ligthBox = document.getElementById("ligthBox");
    ligthBox.classList.remove("d-none");
    ligthBox.querySelector(".container img").setAttribute("src", `${productImg}`);
    document.body.classList.add("overflow-hidden");
}

exitLightBoxIcon?.addEventListener("click", function () {
    document.getElementById("ligthBox").classList.add("d-none");
    document.body.classList.remove("overflow-hidden");
})