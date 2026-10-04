const SUPABASE_URL = "https://jawuclncecixexesrenf.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_VwrTf8Oax-8jhfcFZS_-1w_A0feposW"

let products =[

];



const productsContainer = document.querySelector(".products_container");
const cartContainer = document.querySelector(".cart_container");
const orderM = document.querySelector(".order");

// отримання бази данних
async function fetchData(){
    const responce = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Autorization": `Bearer ${SUPABASE_ANON_KEY}`,
        }
    });
    const data = await responce.json();
    console.log(data)
    products = data;
    displayProducts(products)
}


function createProductCard(product) {
    return `
        <div class="card" style="width: 18rem;">
            <img src="img/${product.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price}</p>
                <button onclick="addToCart(${product.id})" type="button" class="btn btn-warning">
                    <i class="bi bi-cart-plus"></i> В кошик
                </button>
            </div>
        </div>
    `
}


function createProductCart(product) {
    return `
        <div class="card d-flex flex-row p-3" style="height: 12rem;">
            <img src="img/${product.image}" class="img-fluid rounded-start" alt="...">
            <div class="card-body bb">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price}</p>
                <p class="quality"> Кількість: ${product.quantity}</p>
                <button onclick="delToCart(${product.id})" type="button" class="btn btn-warning">
                    <i class="bi bi-bag-dash-fill"></i> видалити з кошика
                </button>
            </div>
        </div>
    `
}

function createOrder() {
    return `
        <form>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Імя, Фамілія</label>
                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">адрес</label>
                <input type="text" class="form-control" id="exampleInputPassword1">
            </div>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
                <button type="submit" class="btn btn-primary">Підтвердити</button>
            </div>
        </form>
    `
}
function displayProducts(products){
    if (productsContainer){
        productsContainer.innerHTML = " ";
        // застосування функції до кожного елемента в списку
        products.forEach(product => {
            productsContainer.innerHTML += createProductCard(product);
            })};
}

function displayCart(cart){
    cartContainer.innerHTML = " ";
    
    cart.forEach(carts => {
        cartContainer.innerHTML += createProductCart(carts)}
    )
}

function displayOrderMenu(){
    
    orderM.innerHTML = " ";
    orderM.innerHTML += createOrder();
}
// 1.Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function getJsonCookie(cookieName) {
    const allCookies = document.cookie.split('; ');
    const targetCookie = allCookies.find(row => row.startsWith(cookieName +
        '='));
    if (targetCookie) {

        const encodedData = targetCookie.split('=')[1];
        console.log(encodedData)
        return JSON.parse(decodeURIComponent(encodedData));
    }

    return null;
}

let cart = getJsonCookie("cart") || [];

console.log(getJsonCookie("cart"))
// 2. Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function saveJsonCookie(cookieName, data, seconds) {
    const jsonString = JSON.stringify(data);
    const safeString = encodeURIComponent(jsonString);
    document.cookie = `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}


// Додавання елементу в кошик
function addToCart(productId) {
    const product = products.find(p => p.id === productId); // шукаєм елемент по айді
    if (!product) return;   // якщо немає то нічого не повертаєм
    cart = getJsonCookie("cart") || [];
    const cartProduct = cart.find(p => p.id === productId)
    if (cartProduct){
        cartProduct.quantity += 1;

    } else{
        cart.push({id: product.id, name: product.name, price: product.price, image: product.image, quantity:1})
        console.log(cart)
    }
     // інакше добавляєм
    console.log(cart)
    saveJsonCookie("cart", cart, 3600*24*7); // Зберігаємо кошик у cookie на 1 годину *тиждень
    console.log("Додано в кошик:", product);
}

function delToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return
    
    const cartProduct = cart.find(p => p.id === productId)
    const index = cart.indexOf(cartProduct)
    if (cartProduct){
        cartProduct.quantity -= 1;
        if (cartProduct.quantity <= 0){
            cart.splice(index, 1);
            console.log("Видалено з кошика")
        } else {
            console.log(`Products ${product.id} not defined`)

        }
    saveJsonCookie("cart", cart, 3600*24*7);
    location.reload()
    }
}

const searchProduct = document.querySelector(".searchP")


//  після завантаження сторінки
document.addEventListener("DOMContentLoaded",()=>{
    fetchData();
    
    searchProduct.addEventListener('input', function(){
        const text = searchProduct.value.toLowerCase();

        const filtered = products.filter(product => 
                        product.name.toLowerCase().includes(text));
        if (cart.length>0){
        const filteredCart = cart.filter(product => product.name.toLowerCase().includes(text));
            displayCart(filteredCart);
            if (!filteredCart){
                orderM.innerHTML ="<h1>У вас немає такого товару</h1>"
            }
        }

        displayProducts(filtered);

        
    })
    if (cartContainer && cart.length > 0){
        displayCart(cart);
        displayOrderMenu();
        console.log(cart)
        
    }
    
    
    
})


