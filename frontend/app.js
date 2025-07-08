const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
// Base URL for backend API calls
const API_BASE_URL = 'https://curly-space-enigma-q7xpvgxjpxgqh6x5j-8000.app.github.dev';

let searchTimeout;
function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(handleSearch, 300);
}

async function getSuggestions(q) {
  try {
    const res = await fetch(`${API_BASE_URL}/suggest?q=${encodeURIComponent(q)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // network failure, fall back to local search
  }
  return new Promise(res => {
    setTimeout(() => {
      res(products.filter(p => p.name.toLowerCase().includes(q)).slice(0,5));
    }, 100);
  });
}

function renderProducts(list) {
  const container = $('#productList');
  container.innerHTML = '';
  const cart = getCart();
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    const cartItem = cart.find(i => i.id === p.id && i.variant === null);
    const qty = cartItem ? cartItem.qty : 0;
    if (p.stock === 0) {
      card.classList.add('out-of-stock');
    } else {
      card.classList.add('in-stock');
    }
    const discount = p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0;
    card.innerHTML = `
      <div class="image-container">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/150'" />
        ${discount > 0 ? `<span class="offer-tag">${discount}% OFF</span>` : ''}
        <div class="qty-controls ${qty ? '' : 'hidden'}">
          <button class="qty-btn minus">-</button>
          <span class="qty">${qty}</span>
          <button class="qty-btn plus">+</button>
        </div>
      </div>
      <div class="delivery-label"><span class="dot"></span>⏱️ 5 mins</div>
      <h3 class="product-name">${p.name}</h3>
      <div class="eta">${p.variants && p.variants[0] ? p.variants[0].label : '1 pc'}</div>
      <div class="price-row">
        <span class="price">$${p.price.toFixed(2)}</span>
        ${p.mrp ? `<span class="mrp">$${p.mrp.toFixed(2)}</span>` : ''}
      </div>
      <div class="tagline">Har Din Sasta!</div>
      <div class="add-section">
        <button class="qty-btn plus main" ${p.stock > 0 ? '' : 'disabled'}>+</button>
      </div>
    `;
    const plusMain = card.querySelector('.add-section .plus');
    const controls = card.querySelector('.qty-controls');
    const plus = card.querySelector('.qty-controls .plus');
    const minus = card.querySelector('.qty-controls .minus');
    const qtySpan = card.querySelector('.qty-controls .qty');
    const update = (newQty) => {
      qtySpan.textContent = newQty;
      controls.classList.toggle('hidden', newQty === 0);
      plusMain.style.display = newQty === 0 ? 'block' : 'none';
    };
    update(qty);
    if (p.stock > 0) {
      plusMain.onclick = e => { e.stopPropagation(); cartAdd(p.id); update(parseInt(qtySpan.textContent)+1); };
      plus.onclick = e => { e.stopPropagation(); cartAdd(p.id); update(parseInt(qtySpan.textContent)+1); };
      minus.onclick = e => { e.stopPropagation(); updateQty(p.id, null, parseInt(qtySpan.textContent)-1); update(parseInt(qtySpan.textContent)-1); };
      card.onclick = () => openModal(p);
    }
    container.appendChild(card);
  });
}

function openModal(product) {
  const modal = $('#modal');
  const reviews = JSON.parse(localStorage.getItem('reviews') || '{}')[product.id] || [];
  $('#modalBody').innerHTML = `
    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150'" />
    <h2>${product.name}</h2>
    <div>
      <span class="price">$${product.price.toFixed(2)}</span>
      ${product.mrp ? `<span class="mrp">$${product.mrp.toFixed(2)}</span>` : ''}
      <span class="eta">${product.eta || ''}</span>
    </div>
    <p>${product.description}</p>
    ${product.variants ? `<select id="variantSelect">${product.variants.map((v,i)=>`<option value="${i}">${v.label} - $${v.price.toFixed(2)}</option>`).join('')}</select>` : ''}
    <button onclick="addToCart(${product.id})">Add to cart</button>
    <h3>Leave a review</h3>
    <form id="reviewForm">
      <input type="number" id="rating" min="1" max="5" placeholder="Rating" required />
      <input type="text" id="review" placeholder="Comment" required />
      <button type="submit">Submit</button>
    </form>
    <div id="reviews">${reviews.map(r=>`<p>${r.rating}/5 - ${r.text}</p>`).join('')}</div>
  `;
  $('#reviewForm').onsubmit = e => {
    e.preventDefault();
    const rating = +$('#rating').value;
    const text = $('#review').value;
    const all = JSON.parse(localStorage.getItem('reviews') || '{}');
    all[product.id] = all[product.id] || [];
    all[product.id].push({rating,text});
    localStorage.setItem('reviews', JSON.stringify(all));
    openModal(product);
  };
  const viewed = JSON.parse(localStorage.getItem('viewed') || '[]');
  if (!viewed.includes(product.id)) {
    viewed.push(product.id);
    localStorage.setItem('viewed', JSON.stringify(viewed));
    showRecommendations();
  }
  modal.classList.remove('hidden');
}

function closeModal() { $('#modal').classList.add('hidden'); }

function addToCart(id) {
  const select = document.getElementById('variantSelect');
  const variant = select ? +select.value : null;
  cartAdd(id, variant);
  toast('Item added');
  closeModal();
}

async function handleSearch() {
  const query = $('#searchBar').value.toLowerCase();
  const suggestions = await getSuggestions(query);
  const list = $('#autocomplete');
  list.innerHTML = suggestions.map(s=>`<div class="autocomplete-item">${s.name}</div>`).join('');
  list.classList.toggle('hidden', !query);
  list.querySelectorAll('.autocomplete-item').forEach((el,i)=>{
    el.onclick=()=>{
      $('#searchBar').value = suggestions[i].name;
      list.classList.add('hidden');
      applyFilters();
    };
  });
  applyFilters();
}

function applyFilters() {
  let filtered = products.slice();
  const q = $('#searchBar').value.toLowerCase();
  if (q) filtered = filtered.filter(p=>p.name.toLowerCase().includes(q));
  const brand = $('#brandFilter').value;
  if (brand) filtered = filtered.filter(p=>p.brand===brand);
  const cat = $('#categoryFilter').value;
  if (cat) filtered = filtered.filter(p=>p.category===cat);
  const min = parseFloat($('#minPrice').value); if(!isNaN(min)) filtered = filtered.filter(p=>p.price>=min);
  const max = parseFloat($('#maxPrice').value); if(!isNaN(max)) filtered = filtered.filter(p=>p.price<=max);
  if ($('#inStock').checked) filtered = filtered.filter(p=>p.stock>0);
  const sort = $('#sortBy').value;
  if (sort==='priceAsc') filtered.sort((a,b)=>a.price-b.price);
  if (sort==='priceDesc') filtered.sort((a,b)=>b.price-a.price);
  if (sort==='popularity') filtered.sort((a,b)=>b.popularity-a.popularity);
  renderProducts(filtered);
  const tags = [];
  if (brand) tags.push(brand);
  if (cat) tags.push(cat);
  if (!isNaN(min)) tags.push('> $'+min);
  if (!isNaN(max)) tags.push('< $'+max);
  if ($('#inStock').checked) tags.push('In Stock');
  if (sort) tags.push($('#sortBy').selectedOptions[0].textContent);
  $('#filterTags').innerHTML = tags.map(t=>`<span class="tag">${t}</span>`).join('');
}

function setupVoiceSearch() {
  const btn = $('#voiceSearchBtn');
  if (!('webkitSpeechRecognition' in window)) { btn.style.display='none'; return; }
  const recognition = new webkitSpeechRecognition();
  recognition.lang='en-US';
  recognition.onresult=e=>{ $('#searchBar').value = e.results[0][0].transcript; handleSearch(); };
  btn.onclick=()=>recognition.start();
}

function showRecommendations() {
  const viewed = JSON.parse(localStorage.getItem('viewed') || '[]');
  const container = $('#recommended');
  const title = $('#recTitle');
  if (!viewed.length) {
    container.innerHTML = '';
    title.classList.add('hidden');
    return;
  }
  const recommended = products.filter(p => viewed.includes(p.id));
  title.classList.remove('hidden');
  container.innerHTML = '';
  recommended.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `<img src="${p.image}" alt="${p.name}" /><h3>${p.name}</h3><p>$${p.price.toFixed(2)}</p>`;
    card.onclick = () => openModal(p);
    container.appendChild(card);
  });
}

const translations = {
  en: { title:'FreshCart', filters:'Filters', filterHeading:'Filters', inStock:'In stock', apply:'Apply' },
  es: { title:'Carrito Fresco', filters:'Filtros', filterHeading:'Filtros', inStock:'En stock', apply:'Aplicar' }
};

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
}


function showPromo() {
  if (localStorage.getItem('promoShown')) return;
  const modal = document.getElementById('promoModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  new Swiper('#promoSwiper', { pagination: { el: '.swiper-pagination' } });
  document.getElementById('closePromo').onclick = () => {
    modal.classList.add('hidden');
    localStorage.setItem('promoShown', 'true');
  };
}

function initBanner() {
  if (document.getElementById('bannerSwiper')) {
    new Swiper('#bannerSwiper', {
      pagination: { el: '#bannerSwiper .swiper-pagination' },
      autoplay: { delay: 3000 }
    });
  }
}

function showSkeletons() {
  const container = $('#productList');
  container.innerHTML = '';
  for(let i=0;i<4;i++) {
    const card = document.createElement('div');
    card.className = 'product-card skeleton';
    container.appendChild(card);
  }
}

window.onload = () => {
  updateCartBadge();
  const brands = [...new Set(products.map(p=>p.brand))];
  const cats = [...new Set(products.map(p=>p.category))];
  $('#brandFilter').innerHTML += brands.map(b=>`<option>${b}</option>`).join('');
  $('#categoryFilter').innerHTML += cats.map(c=>`<option>${c}</option>`).join('');
  ['brandFilter','categoryFilter','minPrice','maxPrice','sortBy','inStock'].forEach(id=>$("#"+id).addEventListener('input',applyFilters));
  $('#searchBar').addEventListener('input',debounceSearch);
  $('#filterBtn').onclick = () => {
    document.getElementById('drawer').classList.remove('open');
    $('#filterPanel').classList.toggle('hidden');
  };
  $('#applyFiltersBtn').onclick = () => { $('#filterPanel').classList.add('hidden'); applyFilters(); };
  $('#themeSelect').onchange = () => { document.body.classList.toggle('colorful', $('#themeSelect').value==='colorful'); };
  const savedLang = localStorage.getItem('lang') || 'en';
  $('#langSelect').value = savedLang;
  $('#langSelect').onchange = () => applyLang($('#langSelect').value);
  applyLang(savedLang);
  showSkeletons();
  setTimeout(() => renderProducts(products), 1000);
  $('#closeModal').addEventListener('click', closeModal);
  setupVoiceSearch();
  showRecommendations();
  const drawer = document.getElementById('drawer');
  const menuBtn = document.getElementById('menuBtn');
  if (drawer && menuBtn) {
    menuBtn.onclick = () => drawer.classList.toggle('open');
  }
  const drawerLogin = document.getElementById('drawerLogin');
  if (drawerLogin) drawerLogin.onclick = () => { drawer.classList.remove('open'); showLoginForm(); };
  const catBox = document.getElementById('drawerCategories');
  if (catBox) {
    catBox.innerHTML = cats.map(c=>`<a href="#" data-cat="${c}" class="drawer-cat">${c}</a>`).join('');
    catBox.querySelectorAll('.drawer-cat').forEach(el=>{
      el.onclick = e => {
        e.preventDefault();
        document.getElementById('categoryFilter').value = el.dataset.cat;
        applyFilters();
        drawer.classList.remove('open');
      };
    });
  }
  const catCarousel = document.getElementById('catCarousel');
  if (catCarousel) {
    catCarousel.innerHTML = cats.map(c=>`<div class="cat-item" data-cat="${c}"><img src="https://via.placeholder.com/80?text=${encodeURIComponent(c.charAt(0))}" alt="${c}"><div>${c}</div></div>`).join('');
    catCarousel.querySelectorAll('.cat-item').forEach(el=>{
      el.onclick = () => {
        document.getElementById('categoryFilter').value = el.dataset.cat;
        applyFilters();
      };
    });
  }
  const drawerDark = document.getElementById('drawerDarkToggle');
  if (drawerDark) {
    drawerDark.checked = localStorage.getItem('dark') === 'true';
    drawerDark.onchange = () => {
      localStorage.setItem('dark', drawerDark.checked);
      document.body.classList.toggle('dark', drawerDark.checked);
    };
  }
  const pinInput = document.getElementById('pincodeInputHeader');
  if (pinInput) {
    pinInput.value = localStorage.getItem('pincode') || '';
    pinInput.onchange = () => {
      localStorage.setItem('pincode', pinInput.value);
      toast('Location saved');
    };
  }
  initBanner();
  showPromo();
};
