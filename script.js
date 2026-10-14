// ===== PRELOADER =====
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.classList.add("hidden"), 800);
});

// ===== CUSTOM CURSOR =====
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");
let outX = 0, outY = 0, mouseX = 0, mouseY = 0;

if (dot && outline) {
  document.addEventListener("mousemove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });
  function animCursor() {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + "px";
    outline.style.top  = outY + "px";
    requestAnimationFrame(animCursor);
  }
  animCursor();
  document.querySelectorAll("a, button, .project-card, .skill-card, .cert-card").forEach(el => {
    el.addEventListener("mouseenter", () => {
      outline.style.width = "56px"; outline.style.height = "56px"; outline.style.opacity = "0.8";
    });
    el.addEventListener("mouseleave", () => {
      outline.style.width = "36px"; outline.style.height = "36px"; outline.style.opacity = "0.5";
    });
  });
}

// ===== SCROLL PROGRESS =====
const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
  if (progressBar) progressBar.style.width = pct + "%";
});

// ===== NAVBAR =====
const navbar  = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
});

hamburger && hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

// Close mobile nav on link click
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    hamburger && hamburger.classList.remove("open");
    navLinks && navLinks.classList.remove("open");
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
});

// ===== DARK MODE (default: dark) =====
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
// Default is dark unless user explicitly chose light
if (savedTheme !== "light") {
  body.classList.add("dark-mode");
  if (themeBtn) themeBtn.querySelector("i").className = "fas fa-sun";
}

themeBtn && themeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  themeBtn.querySelector("i").className = isDark ? "fas fa-sun" : "fas fa-moon";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===== CANVAS PARTICLES =====
const canvas = document.getElementById("particles-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  const N = 60;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r  = Math.random() * 2.5 + 1;
      this.a  = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(108,99,255," + this.a + ")";
      ctx.fill();
    }
  }

  for (let i = 0; i < N; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(108,99,255," + (0.15 * (1 - d / 120)) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
}

// ===== TYPED TEXT =====
const typedEl = document.getElementById("typed-text");
if (typedEl) {
  const phrases = [
    "B.Tech IT Student",
    "AWS Student Builder",
    "Cybersecurity Enthusiast",
    "Cloud & Code Explorer",
    "Community Mentor"
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 80);
    } else {
      typedEl.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 600);
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCount(el) {
  const target = +el.getAttribute("data-target");
  let count = 0;
  const inc = Math.max(1, Math.floor(target / 40));
  const timer = setInterval(() => {
    count = Math.min(count + inc, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 40);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));

// ===== SKILL BARS =====
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target;
      fill.style.width = fill.getAttribute("data-width") + "%";
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".skill-fill").forEach(el => skillObserver.observe(el));

// ===== TABS =====
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(tab).classList.add("active");
    // Re-trigger skill bars in newly shown tab
    document.querySelectorAll("#" + tab + " .skill-fill").forEach(el => {
      el.style.width = el.getAttribute("data-width") + "%";
    });
    // Re-trigger reveal in newly shown tab
    document.querySelectorAll("#" + tab + " .reveal").forEach(el => {
      el.classList.add("visible");
    });
  });
});

// ===== PROJECT FILTER =====
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".project-card").forEach(card => {
      const match = filter === "all" || card.dataset.category === filter;
      card.style.display = match ? "flex" : "none";
      card.style.flexDirection = match ? "column" : "";
    });
  });
});

// ===== BACK TO TOP =====
const topBtn = document.getElementById("back-to-top");
if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("visible", window.scrollY > 400);
  });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== CONTACT FORM =====
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: "name",    errId: "name-error",    msg: "Please enter your name." },
      { id: "email",   errId: "email-error",   msg: "Please enter a valid email.", isEmail: true },
      { id: "subject", errId: "subject-error", msg: "Please enter a subject." },
      { id: "message", errId: "message-error", msg: "Please enter a message." }
    ];

    fields.forEach(f => {
      const el  = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      el.classList.remove("error");
      err.textContent = "";

      if (!el.value.trim()) {
        el.classList.add("error");
        err.textContent = f.msg;
        valid = false;
      } else if (f.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
        el.classList.add("error");
        err.textContent = f.msg;
        valid = false;
      }
    });

    if (valid) {
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      // Simulate sending (replace with EmailJS / Formspree for real sending)
      setTimeout(() => {
        document.getElementById("form-success").style.display = "flex";
        form.reset();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        setTimeout(() => {
          document.getElementById("form-success").style.display = "none";
        }, 5000);
      }, 1500);
    }
  });
}
