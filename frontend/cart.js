const CART_KEY = 'cart';

function getCart(){
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  syncCart(cart);
}

function cartAdd(id, variant = null, qty = 1){
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.variant === variant);
  if(item){
    item.qty += qty;
  } else {
    cart.push({id, variant, qty});
  }
  saveCart(cart);
}

function removeFromCart(id, variant = null){
  let cart = getCart();
  cart = cart.filter(i => !(i.id === id && i.variant === variant));
  saveCart(cart);
}

function updateQty(id, variant, qty){
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.variant === variant);
  if(item){
    item.qty = qty;
    if(item.qty <= 0){
      removeFromCart(id, variant);
      return;
    }
    saveCart(cart);
  }
}

async function syncCart(cart){
  try {
    await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(cart)
    });
  } catch(e) {
    // ignore sync failures
  }
}

function renderCart(){
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const cart = getCart();
  container.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if(!product) return;
    const price = item.variant != null ? product.variants[item.variant].price : product.price;
    const div = document.createElement('div');
    div.className = 'cart-row';
    div.innerHTML = `
      <span>${product.name}${item.variant!=null? ' - '+product.variants[item.variant].label:''}</span>
      <input type="number" value="${item.qty}" min="1" style="width:40px" />
      <button>Remove</button>
    `;
    div.querySelector('input').onchange = (e)=> updateQty(item.id, item.variant, parseInt(e.target.value,10));
    div.querySelector('button').onclick = ()=> removeFromCart(item.id, item.variant);
    container.appendChild(div);
    total += price * item.qty;
  });
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function renderCartPreview() {
  const preview = document.getElementById('cartPreview');
  if (!preview) return;
  const cart = getCart();
  if (!cart.length) {
    preview.innerHTML = '<p>Cart is empty</p>';
    return;
  }
  preview.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const price = item.variant != null ? product.variants[item.variant].price : product.price;
    total += price * item.qty;
    preview.innerHTML += `<div class="row"><img src="${product.image}" alt="${product.name}"><span>${item.qty} x ${product.name}</span></div>`;
  });
  preview.innerHTML += `<p>Total: $${total.toFixed(2)}</p><button id="viewCart">View Cart</button>`;
  preview.querySelector('#viewCart').onclick = () => { window.location.href = 'cart.html'; };
}

document.addEventListener('storage', e => {
  if (e.key === CART_KEY) {
    if (document.getElementById('cartItems')) renderCart();
    if (document.getElementById('cartPreview')) renderCartPreview();
  }
});
