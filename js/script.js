const SUPABASE_URL = "https://jawuclncecixexesrenf.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_VwrTf8Oax-8jhfcFZS_-1w_A0feposW"

let products =[

];

let cart = [

];

const productsContainer = document.querySelector(".products_container");
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


function displayProducts(products){
    productsContainer.innerHTML = " ";
    // застосування функції до кожного елемента в списку
    products.forEach(product => {
        productsContainer.innerHTML += createProductCard(product);
    });
}


// 1.Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function getJsonCookie(cookieName) {
    const allCookies = document.cookie.split('; ');
    const targetCookie = allCookies.find(row => row.startsWith(cookieName +
        '='));
    if (targetCookie) {

        const encodedData = targetCookie.split('=')[1];
        return JSON.parse(decodeURICompoіnent(encodedData));
    }
    return null;
}

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

    const cartProduct = cart.find(p => p.id === productId)
    if (cartProduct){
        cartProduct.quantity += 1;
    } else{
        cart.push({ title: product.title, price: product.price, image: product.image, quantity:1})
    }
    cart.push(product); // інакше добавляєм
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
            cart.splice(index=1)
            console.log("Видалено з кошика")
        } else {
            console.log(`Products ${product.id} not defined`)

        }
    saveJsonCookie("cart", cart, 3600*24*7);
    
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

        displayProducts(filtered);
    })
})


