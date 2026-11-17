// =============================================
// TechFixPro - Landing Page JavaScript
// =============================================

/* ---- Navbar Scroll Effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ---- Smooth Scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Intersection Observer for Animations ---- */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      observer.unobserve(el);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

/* ---- Counter Animation ---- */
function animateCounter(el, target, duration = 2000) {
  const startTime = performance.now();
  const start = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing function
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current.toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ---- Contact Form Handler ---- */
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn = form.querySelector('button[type="submit"]');

  const nama = (form.nama.value || '').trim();
  const telp = (form.telp.value || '').trim();
  const perangkat = form.perangkat.value || '';
  const masalah = (form.masalah.value || '').trim();

  if (!nama || !telp || !perangkat || !masalah) {
    alert('Mohon lengkapi semua kolom pada formulir konsultasi.');
    return;
  }

  // Format pesan WhatsApp terstruktur dan rapi
  const pesan = `*FORMULIR KONSULTASI KILAT*
*Secure Next Computer Service - Servis Komputer & Laptop*
-----------------------------------------
👤 *Nama Pelanggan:* ${nama}
📱 *No. WhatsApp/HP:* ${telp}
💻 *Tipe Perangkat:* ${perangkat}
⚠️ *Keluhan / Gejala Kerusakan:*
"${masalah}"
-----------------------------------------
_Pesan ini dikirim otomatis melalui website Secure Next Computer Service_`;

  // Nomor WhatsApp tujuan
  const nomorWa = '6283159871744';
  const waUrl = `https://api.whatsapp.com/send?phone=${nomorWa}&text=${encodeURIComponent(pesan)}`;

  // Update status tombol
  const originalText = btn.innerHTML;
  btn.textContent = 'Menghubungkan ke WhatsApp...';
  btn.disabled = true;

  // Buka WhatsApp langsung secara sinkron (menghindari popup blocker browser)
  let waWindow = null;
  try {
    waWindow = window.open(waUrl, '_blank');
  } catch (err) {
    console.warn('Direct window.open blocked, using anchor fallback', err);
  }

  // Fallback jika window.open diblokir oleh browser
  if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
    const a = document.createElement('a');
    a.href = waUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Tampilkan kotak sukses dan tombol langsung jika WhatsApp tidak otomatis terbuka
  success.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 4px; color: var(--green);">
      ✓ Formulir Siap Dikirim!
    </div>
    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px; line-height: 1.5;">
      Menghubungkan ke nomor WhatsApp teknisi kami: <strong>+62 831-5987-1744</strong>.<br>
      Jika aplikasi WhatsApp tidak terbuka otomatis, silakan klik tombol di bawah:
    </div>
    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: flex; justify-content: center; width: 100%; text-decoration: none; padding: 10px 16px; font-size: 0.9rem;">
      💬 Klik di Sini untuk Kirim ke WhatsApp (+62 831-5987-1744) ↗
    </a>
  `;
  success.style.display = 'block';

  // Kembalikan tombol setelah beberapa saat
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 2500);
}

/* ---- Service Cards Hover Tilt Effect ---- */
document.querySelectorAll('.service-card, .testi-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -4;
    const rotateY = (x - centerX) / centerX * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => activeObserver.observe(sec));

// Add active nav style
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--citron); background: rgba(202, 209, 131, 0.14); border-bottom: 2px solid var(--citron); }`;
document.head.appendChild(style);

/* ---- Page Load Animation ---- */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

/* =============================================
   Interactive Cyber Particle Canvas & Spotlight
   ============================================= */
/* =============================================
   Water Bubble Background & Cursor Spotlight
   ============================================= */
/* =============================================
   Retro Bubbles (ikon retro naik seperti gelembung)
   ============================================= */
(function initRetroBubbles() {
  const container = document.querySelector('.bg-retro-decor');
  if (!container) return;

  const originals = Array.from(container.querySelectorAll('.retro-element'));
  if (!originals.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (min, max) => Math.random() * (max - min) + min;

  let W = window.innerWidth;
  let H = window.innerHeight;
  const mouse = { x: -1000, y: -1000 };

  // Perbanyak ikon dengan menggandakan 6 elemen asli
  const total = W < 768 ? 8 : 14;
  const bubbles = [];

  for (let i = 0; i < total; i++) {
    let el;
    if (i < originals.length) {
      el = originals[i];
    } else {
      el = originals[i % originals.length].cloneNode(true);
      container.appendChild(el);
    }
    el.removeAttribute('title');
    bubbles.push(makeBubble(el, true));
  }

  function makeBubble(el, initial) {
    // Ukuran bervariasi: banyak sedang, sedikit kecil dan besar
    const r = Math.random();
    const size = r < 0.3 ? rand(46, 64) : r < 0.8 ? rand(64, 92) : rand(92, 128);
    el.style.width = size + 'px';

    // Ukuran besar = lebih lambat & lebih transparan (kesan kedalaman)
    const depth = (size - 46) / (128 - 46);
    return {
      el,
      size,
      x: rand(0, Math.max(W - size, 1)),
      y: initial ? rand(0, H) : H + size + rand(0, 200),
      speed: rand(0.35, 0.8) * (1 - depth * 0.45),
      phase: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.008, 0.02),
      wobbleAmp: rand(0.3, 0.9),
      rot: rand(-10, 10),
      rotSpeed: rand(-0.12, 0.12),
      maxOpacity: rand(0.55, 0.9) - depth * 0.2,
      ox: 0, // dorongan dari kursor
      oy: 0
    };
  }

  function respawn(b) {
    Object.assign(b, makeBubble(b.el, false));
  }

  function frame() {
    for (const b of bubbles) {
      b.phase += b.wobbleSpeed;
      b.y -= b.speed;
      b.x += Math.sin(b.phase) * b.wobbleAmp;
      b.rot += b.rotSpeed;

      // Menghindar pelan dari kursor, lalu kembali halus
      const cx = b.x + b.ox + b.size / 2;
      const cy = b.y + b.oy + b.size / 2;
      const dx = cx - mouse.x;
      const dy = cy - mouse.y;
      const dist = Math.hypot(dx, dy);
      const reach = 120 + b.size / 2;
      if (dist < reach && dist > 0) {
        const f = (reach - dist) / reach;
        b.ox += (dx / dist) * f * 3;
        b.oy += (dy / dist) * f * 3;
      }
      b.ox *= 0.94;
      b.oy *= 0.94;

      // Bungkus horizontal; muncul lagi dari bawah setelah lewat atas
      if (b.x < -b.size) b.x = W;
      if (b.x > W) b.x = -b.size;
      if (b.y < -b.size - 20) respawn(b);

      // Fade-in dari bawah dan fade-out di atas
      const fadeIn = Math.min(1, Math.max(0, (H + b.size - b.y) / 120));
      const fadeOut = Math.min(1, Math.max(0, (b.y + b.size) / 140));
      b.el.style.opacity = (b.maxOpacity * Math.min(fadeIn, fadeOut)).toFixed(3);
      b.el.style.transform =
        `translate3d(${(b.x + b.ox).toFixed(1)}px, ${(b.y + b.oy).toFixed(1)}px, 0) rotate(${b.rot.toFixed(1)}deg)`;
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -1000;
  });
  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
  });

  if (reduceMotion) {
    // Pengguna menonaktifkan animasi: tampilkan statis
    bubbles.forEach((b) => {
      b.el.style.opacity = (b.maxOpacity * 0.6).toFixed(2);
      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    });
  } else {
    requestAnimationFrame(frame);
  }
})();

/* =============================================
   Interactive Water Bubbles Canvas
   ============================================= */
(function initWaterBubblesCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);
  const mouse = { x: -1000, y: -1000 };

  const bubbleCount = W < 768 ? 24 : 45;
  const bubbles = [];

  function createBubble(initial = false) {
    const radius = Math.random() < 0.6 ? 3 + Math.random() * 6 : 9 + Math.random() * 12;
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + radius + Math.random() * 80,
      radius,
      speedY: 0.35 + Math.random() * 0.85 * (14 / radius),
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      wobbleAmp: 0.4 + Math.random() * 1.0,
      wobbleAngle: Math.random() * Math.PI * 2,
      baseAlpha: 0.18 + Math.random() * 0.28,
      vx: 0,
      vy: 0
    };
  }

  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(createBubble(true));
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -1000;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];

      b.wobbleAngle += b.wobbleSpeed;
      b.y -= b.speedY;
      b.x += Math.sin(b.wobbleAngle) * b.wobbleAmp;

      // Interaksi kursor lembut
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const reach = 90 + b.radius;
      if (dist < reach && dist > 0) {
        const force = (reach - dist) / reach;
        b.vx += (dx / dist) * force * 1.5;
        b.vy += (dy / dist) * force * 1.5;
      }
      b.vx *= 0.92;
      b.vy *= 0.92;
      b.x += b.vx;
      b.y += b.vy;

      // Respawn jika lewat atas
      if (b.y < -b.radius - 20) {
        bubbles[i] = createBubble(false);
        continue;
      }
      if (b.x < -b.radius) b.x = W + b.radius;
      if (b.x > W + b.radius) b.x = -b.radius;

      // Gambar gelembung air kaca
      const grad = ctx.createRadialGradient(
        b.x - b.radius * 0.35,
        b.y - b.radius * 0.35,
        b.radius * 0.1,
        b.x,
        b.y,
        b.radius
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${b.baseAlpha * 1.3})`);
      grad.addColorStop(0.3, `rgba(202, 209, 131, ${b.baseAlpha * 0.4})`);
      grad.addColorStop(0.85, `rgba(102, 2, 60, ${b.baseAlpha * 0.25})`);
      grad.addColorStop(1, `rgba(202, 209, 131, ${b.baseAlpha * 0.8})`);

      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Cincin luar halus
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(202, 209, 131, ${b.baseAlpha * 0.85})`;
      ctx.stroke();

      // Kilau cahaya gelembung (specular reflection)
      ctx.beginPath();
      ctx.arc(
        b.x - b.radius * 0.36,
        b.y - b.radius * 0.36,
        Math.max(1, b.radius * 0.25),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.8, b.baseAlpha * 2.2)})`;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  if (reduceMotion) {
    // Statis jika reduced-motion
    ctx.clearRect(0, 0, W, H);
    bubbles.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(202, 209, 131, 0.15)';
      ctx.fill();
    });
  } else {
    requestAnimationFrame(draw);
  }
})();

/* =============================================
   Cursor Spotlight
   ============================================= */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let x = -1000, y = -1000, tx = -1000, ty = -1000;

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  window.addEventListener('pointerleave', () => {
    glow.style.opacity = '0';
    tx = ty = -1000;
  });

  (function loop() {
    if (tx !== -1000) {
      if (x === -1000) { x = tx; y = ty; }
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.style.opacity = '0.9';
    }
    requestAnimationFrame(loop);
  })();
})();