/* ============================
   PRELOADER
   ============================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hide');
  }, 1800);
});

/* ============================
   CUSTOM CURSOR
   ============================ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animateFollower() {
  fx += (mx - fx) * 0.1;
  fy += (my - fy) * 0.1;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .tool-card, .timeline-content, .contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.width  = '60px';
    follower.style.height = '60px';
    follower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.width  = '38px';
    follower.style.height = '38px';
    follower.style.opacity = '1';
  });
});

/* ============================
   PARTICLE CANVAS
   ============================ */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.5 + 0.1
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });
  // Connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============================
   HEADER SCROLL
   ============================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});

/* ============================
   ACTIVE NAV
   ============================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}

/* ============================
   MOBILE MENU
   ============================ */
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navbar.classList.toggle('open');
});
navbar.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navbar.classList.remove('open');
  });
});

/* ============================
   TYPEWRITER
   ============================ */
const words = ['Web Developer', 'WordPress Expert', 'Plugin Creator', 'UI Designer', 'Problem Solver'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeWrite() {
  const word = words[wi];
  tw.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
  if (!deleting && ci > word.length) { deleting = true; setTimeout(typeWrite, 1200); return; }
  if (deleting && ci < 0)            { deleting = false; wi = (wi + 1) % words.length; }
  setTimeout(typeWrite, deleting ? 50 : 90);
}
setTimeout(typeWrite, 800);

/* ============================
   REVEAL ON SCROLL
   ============================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================
   COUNTER ANIMATION
   ============================ */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.dataset.target;
        let count = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          count += step;
          if (count >= target) { count = target; clearInterval(timer); }
          counter.textContent = count;
        }, 40);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.about-left').forEach(el => counterObserver.observe(el));

/* ============================
   SKILL BARS
   ============================ */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.dataset.width + '%';
          fill.classList.add('animated');
        }, i * 120);
      });
      entry.target.querySelectorAll('.tool-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, i * 60);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// Init tool cards hidden
document.querySelectorAll('.tool-card').forEach(c => {
  c.style.opacity = '0';
  c.style.transform = 'translateY(20px) scale(0.9)';
  c.style.transition = '0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
});

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ============================
   TIMELINE ANIMATE
   ============================ */
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.timeline-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `0.5s ease ${i * 0.12}s`;
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, 100 + i * 120);
      });
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.education-column').forEach(col => timelineObserver.observe(col));
function handleSubmit(e) {
  e.preventDefault();
  
  const btn = e.target.querySelector('button');
  const success = document.getElementById('formSuccess');
  
  btn.innerHTML = '<span>Sending...</span><i class="bx bx-loader-alt bx-spin"></i>';
  btn.disabled = true;

  // ইমেলের তথ্য খালি আসার সমস্যা সমাধান করতে e.target এর বদলে সরাসরি আইডি ব্যবহার করা হয়েছে
  emailjs.sendForm('service_wf5hrqo', 'template_bh02d9r', '#contact-form')
    .then(() => {
      btn.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
      btn.disabled = false;
      e.target.reset(); 
      
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, (error) => {
      console.error('EmailJS Error:', error);
      alert("Error! Message not sent.");
      btn.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
      btn.disabled = false;
    });
}

  // আপনার দেওয়া আইডিগুলো ব্যবহার করা হয়েছে
  emailjs.sendForm('service_wf5hrqo', 'template_bh02d9r', e.target)
    .then(() => {
      btn.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
      btn.disabled = false;
      e.target.reset(); 
      
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, (error) => {
      console.error('EmailJS Error:', error);
      alert("Error! Message not sent.");
      btn.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
      btn.disabled = false;
    });



/* ============================
   MAGNETIC BUTTONS
   ============================ */
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ============================
   TOOL CARD TILT
   ============================ */
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
