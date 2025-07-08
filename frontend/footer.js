function updateCartBadge(){
  const badge = document.getElementById('cartBadge') || document.getElementById('cartCount');
  if(!badge) return;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((s,i)=>s+i.qty,0);
  badge.textContent = count;
  badge.classList.toggle('hidden', count===0);
}

const nav = document.getElementById('bottomNav');
if(nav){
  nav.addEventListener('click',e=>{
    const btn = e.target.closest('.navBtn');
    if(!btn) return;
    nav.querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
  updateCartBadge();
}

window.addEventListener('storage',e=>{ if(e.key==='cart') updateCartBadge(); });
