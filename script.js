// Data
const services = [
  { id:'cctv-install', name:'CCTV Installation', price:1499, img:'images/cat-cctv.jpg' },
  { id:'cctv-repair', name:'CCTV Repair', price:499, img:'images/cat-cctv.jpg' },
  { id:'intercom', name:'Intercom Setup', price:1299, img:'images/cat-intercom.jpg' },
  { id:'biometric', name:'Biometric Access', price:2499, img:'images/cat-biometric.jpg' },
  { id:'smartlock', name:'Smart Locks', price:1999, img:'images/cat-smartlock.jpg' },
  { id:'amc', name:'Annual Maintenance', price:999, img:'images/cat-cctv.jpg' },
];

const packages = [
  { id:'home', name:'Home Starter — 4 Cameras', price:14999, img:'images/pkg-cctv-home.jpg',
    features:['4 HD Dome Cameras','1TB DVR with 30-day storage','Mobile app access','Free installation & setup','6-month warranty']},
  { id:'shop', name:'Shop Secure — 6 Cameras', price:21999, img:'images/pkg-shop.jpg',
    features:['6 2MP Cameras (indoor + outdoor)','2TB Storage','Night vision + motion alerts','Cloud backup ready','12-month warranty']},
  { id:'office', name:'Office Pro — 8 Cameras', price:32999, img:'images/pkg-office.jpg',
    features:['8 4MP Cameras','Biometric + intercom integration','4TB enterprise DVR','Remote 24/7 monitoring','12-month warranty']},
];

const reviews = [
  { name:'Anjali Sharma', loc:'Bengaluru', svc:'CCTV Installation', stars:5, text:'Technician was on time, polite, and finished the 4-camera setup in under 3 hours. Mobile app worked instantly.' },
  { name:'Rahul Verma', loc:'Mumbai', svc:'Smart Lock', stars:5, text:'Very smooth experience. Got a same-day slot and the lock works flawlessly with the app.' },
  { name:'Priya Iyer', loc:'Pune', svc:'Biometric', stars:4, text:'Great service and clean install at our office entrance. Pricing was exactly as quoted.' },
  { name:'Mohit Singh', loc:'Delhi NCR', svc:'CCTV Repair', stars:5, text:'My old DVR stopped working — they fixed it without upselling a new one. Honest team.' },
];

// Render categories
document.getElementById('cat-grid').innerHTML = services.map(s => `
  <div class="cat" data-svc="${s.id}">
    <div class="img">
      <img src="${s.img}" alt="${s.name}" loading="lazy" />
      <div class="overlay"></div>
      <div class="label">
        <div class="name">${s.name}</div>
        <div class="price">From ₹${s.price.toLocaleString('en-IN')}</div>
      </div>
    </div>
  </div>
`).join('');

// Render packages
document.getElementById('pkg-grid').innerHTML = packages.map(p => `
  <article class="pkg">
    <div class="img"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
    <div class="body">
      <h3>${p.name}</h3>
      <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
      <ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>
      <button class="btn btn-cta" data-pkg="${p.id}">Book this package</button>
    </div>
  </article>
`).join('');

// Render reviews
document.getElementById('reviews').innerHTML = reviews.map(r => `
  <div class="review">
    <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
    <p>"${r.text}"</p>
    <div class="reviewer">
      <div class="avatar">${r.name[0]}</div>
      <div>
        <div class="name">${r.name}</div>
        <div class="meta">${r.loc} • ${r.svc}</div>
      </div>
    </div>
  </div>
`).join('');

document.getElementById('year').textContent = new Date().getFullYear();

// Booking flow
const modal = document.getElementById('bookingModal');
const content = document.getElementById('bookingContent');
let booking = { service:'', date:'', time:'', name:'', phone:'', address:'' };
let step = 1;

function openBooking(svcId){
  booking = { service: svcId || '', date:'', time:'', name:'', phone:'', address:'' };
  step = 1;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  render();
}
function closeBooking(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }

modal.addEventListener('click', e => { if(e.target.matches('[data-close]')) closeBooking(); });

document.querySelectorAll('[data-svc]').forEach(el=>el.addEventListener('click',()=>openBooking(el.dataset.svc)));
document.querySelectorAll('[data-pkg]').forEach(el=>el.addEventListener('click',()=>openBooking(el.dataset.pkg)));
document.querySelectorAll('a[href="#book"], [data-open-booking]').forEach(el=>{
  el.addEventListener('click', e=>{ e.preventDefault(); openBooking(); });
});

function render(){
  const stepsBar = `<div class="steps-bar">
    <div class="${step>=1?'active':''}"></div>
    <div class="${step>=2?'active':''}"></div>
    <div class="${step>=3?'active':''}"></div>
  </div>`;

  if (step === 1) {
    content.innerHTML = stepsBar + `
      <h2 style="margin-bottom:6px">Choose service</h2>
      <p class="muted small" style="margin-bottom:18px">Pick what you'd like installed or fixed.</p>
      <div class="field">
        <label for="svc">Service</label>
        <select id="svc">
          <option value="">Select a service</option>
          ${services.map(s=>`<option value="${s.id}" ${s.id===booking.service?'selected':''}>${s.name} — ₹${s.price}</option>`).join('')}
        </select>
        <div class="err">Please select a service</div>
      </div>
      <div class="modal-actions">
        <span></span>
        <button class="btn btn-cta" id="next">Continue</button>
      </div>`;
    document.getElementById('next').onclick = ()=>{
      const sel = document.getElementById('svc');
      if(!sel.value){ sel.parentElement.classList.add('invalid'); return; }
      booking.service = sel.value; step = 2; render();
    };
  } else if (step === 2) {
    const today = new Date().toISOString().split('T')[0];
    content.innerHTML = stepsBar + `
      <h2 style="margin-bottom:6px">Date, time & address</h2>
      <p class="muted small" style="margin-bottom:18px">When and where should our pro visit?</p>
      <div class="field"><label>Date</label><input type="date" id="date" min="${today}" value="${booking.date}"/><div class="err">Pick a date</div></div>
      <div class="field"><label>Time slot</label>
        <select id="time">
          <option value="">Select time</option>
          ${['09:00 AM','11:00 AM','01:00 PM','03:00 PM','05:00 PM'].map(t=>`<option ${t===booking.time?'selected':''}>${t}</option>`).join('')}
        </select><div class="err">Pick a time</div>
      </div>
      <div class="field"><label>Full name</label><input id="name" value="${booking.name}" placeholder="Your name"/><div class="err">Enter name</div></div>
      <div class="field"><label>Phone</label><input id="phone" inputmode="numeric" value="${booking.phone}" placeholder="10-digit mobile"/><div class="err">Enter valid 10-digit phone</div></div>
      <div class="field"><label>Address</label><textarea id="address" rows="3" placeholder="Flat / street / city">${booking.address}</textarea><div class="err">Enter address</div></div>
      <div class="modal-actions">
        <button class="btn btn-outline" id="back">Back</button>
        <button class="btn btn-cta" id="next">Review</button>
      </div>`;
    document.getElementById('back').onclick = ()=>{ step=1; render(); };
    document.getElementById('next').onclick = ()=>{
      let ok = true;
      const fields = ['date','time','name','phone','address'];
      fields.forEach(f=>{
        const el=document.getElementById(f); const val=el.value.trim();
        let bad=!val;
        if(f==='phone' && !/^\d{10}$/.test(val)) bad=true;
        el.parentElement.classList.toggle('invalid',bad);
        if(bad) ok=false; else booking[f]=val;
      });
      if(ok){ step=3; render(); }
    };
  } else if (step === 3) {
    const svc = services.find(s=>s.id===booking.service) || packages.find(p=>p.id===booking.service);
    const price = svc?.price || 0;
    content.innerHTML = stepsBar + `
      <h2 style="margin-bottom:6px">Review & confirm</h2>
      <p class="muted small" style="margin-bottom:18px">Please confirm your booking details.</p>
      <div class="summary">
        <div><span>Service</span><strong>${svc?.name||'-'}</strong></div>
        <div><span>Date</span><strong>${booking.date}</strong></div>
        <div><span>Time</span><strong>${booking.time}</strong></div>
        <div><span>Name</span><strong>${booking.name}</strong></div>
        <div><span>Phone</span><strong>${booking.phone}</strong></div>
        <div><span>Address</span><strong style="text-align:right;max-width:60%">${booking.address}</strong></div>
        <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:8px"><span>Total</span><strong>₹${price.toLocaleString('en-IN')}</strong></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-outline" id="back">Back</button>
        <button class="btn btn-cta" id="confirm">Confirm booking</button>
      </div>`;
    document.getElementById('back').onclick = ()=>{ step=2; render(); };
    document.getElementById('confirm').onclick = (e)=>{
      const btn=e.currentTarget;
      btn.innerHTML='<span class="spinner"></span> Booking...';
      btn.disabled=true;
      setTimeout(()=>{ step=4; render(); }, 1100);
    };
  } else {
    content.innerHTML = `
      <div class="success">
        <div class="check">✓</div>
        <h2>Booking confirmed!</h2>
        <p class="muted" style="margin:10px 0 18px">We've sent a confirmation to ${booking.phone}. Our pro will reach you on ${booking.date} at ${booking.time}.</p>
        <button class="btn btn-cta" data-close>Done</button>
      </div>`;
  }
}
