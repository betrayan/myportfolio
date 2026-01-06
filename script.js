/* --- Advanced Gaming Effects & Interactivity --- */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initHackerText();
    initSmartCards();
    initScrollReveal();
    initContactForm();
    initThruster();
    initFooterQuotes();

    // Delay particles slightly to allow LCP to fire immediately
    setTimeout(() => {
        initParticles();
    }, 200);
});

/* 7. Dynamic Footer Quotes */
function initFooterQuotes() {
    const quoteEl = document.getElementById('dynamic-quote');
    if (!quoteEl) return;

    const quotes = [
        "\"Talk is cheap. Show me the code.\" – Linus Torvalds",
        "\"First, solve the problem. Then, write the code.\" – John Johnson",
        "\"Experience is the name everyone gives to their mistakes.\" – Oscar Wilde",
        "\"Simplicity is the soul of efficiency.\" – Austin Freeman",
        "\"Make it work, make it right, make it fast.\" – Kent Beck",
        "\"Code is like humor. When you have to explain it, it’s bad.\" – Cory House",
        "\"Fix the cause, not the symptom.\" – Steve Maguire",
        "\"Optimism is an occupational hazard of programming: feedback is the treatment.\" – Kent Beck"
    ];

    let index = 0;

    // Change quote every 5 seconds
    setInterval(() => {
        // Fade out
        quoteEl.style.transition = "opacity 0.5s";
        quoteEl.style.opacity = 0;

        setTimeout(() => {
            // Update text
            index = (index + 1) % quotes.length;
            quoteEl.innerText = quotes[index];

            // Fade in
            quoteEl.style.opacity = 1;
        }, 500);
    }, 5000);
}

/* 6. Thruster (Back to Top) Logic */
function initThruster() {
    const thrusterBtn = document.getElementById('thruster-btn');
    if (!thrusterBtn) return;

    // Show button when scrolled down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            thrusterBtn.classList.add('visible');
        } else {
            thrusterBtn.classList.remove('visible');
            thrusterBtn.classList.remove('launch'); // Reset launch animation if user scrolls back up
        }
    });

    // Handle click
    thrusterBtn.addEventListener('click', () => {
        // Add launch class for animation
        thrusterBtn.classList.add('launch');

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Reset animation class after it finishes (approx 1s)
        setTimeout(() => {
            thrusterBtn.classList.remove('launch');
        }, 1000);
    });
}

/* 0. Custom Cursor Logic */
function initCustomCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    // Safety check if elements exist
    if (!cursorDot || !cursorOutline) return;

    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay using animate() for smoothness
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}

/* 1. Interactive Particle Network (Constellation Effect) */
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60; // Adjust for density
    const connectionDistance = 150;
    const mouseDistance = 200;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; // Cyan or Purple
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Mouse Interaction
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();

            /* Optimization: Only calculate connections for nearby indices (reduced complexity)
               or just check fewer particles to avoid O(N^2) on every frame if count is high.
               With 60 particles, N^2 is 3600 checks, which is okay, but let's check distance efficiently.
            */
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                // Quick bounding box check before sqrt
                if (Math.abs(p.x - p2.x) > connectionDistance || Math.abs(p.y - p2.y) > connectionDistance) continue;

                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    // Reduce opacity calculation frequency or simplify style
                    ctx.strokeStyle = `rgba(188, 19, 254, ${1 - dist / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connect to mouse - simplified check
            if (mouse.x) {
                if (Math.abs(p.x - mouse.x) < mouseDistance && Math.abs(p.y - mouse.y) < mouseDistance) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouseDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / mouseDistance})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

/* 2. "Hacker Style" Text Scramble Effect */
function initHackerText() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    const targets = document.querySelectorAll('.hacker-text');

    targets.forEach(target => {
        target.addEventListener('mouseover', event => {
            let iterations = 0;
            const originalText = event.target.dataset.value;

            const interval = setInterval(() => {
                event.target.innerText = event.target.innerText.split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * letters.length)]
                    })
                    .join("");

                if (iterations >= originalText.length) {
                    clearInterval(interval);
                }

                iterations += 1 / 3;
            }, 30);
        });
    });
}

/* 3. Smart Cards: 3D Tilt + Spotlight Effect */
function initSmartCards() {
    const cards = document.querySelectorAll('.card');

    // Init Spotlight logic
    const handleOnMouseMove = e => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS variables for spotlight position
        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);

        // 3D Tilt Calculation
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateX = ((y - midY) / midY) * -10; // Max 10 deg tilt
        const rotateY = ((x - midX) / midX) * 10;

        target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`; // Subtle scale
    };

    const handleOnMouseLeave = e => {
        const target = e.currentTarget;
        // Reset tilt
        target.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    for (const card of cards) {
        card.addEventListener("mousemove", handleOnMouseMove);
        card.addEventListener("mouseleave", handleOnMouseLeave);
    }
}

/* 4. Scroll Reveal Animation */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden-init');
    hiddenElements.forEach((el) => observer.observe(el));
}

/* 5. Contact Form Handling (WhatsApp Integration) */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = 'Opening WhatsApp...';

        // Get form data
        const name = document.getElementById('user_name').value;
        const email = document.getElementById('user_email').value;
        const msg = document.getElementById('message').value;

        // Construct WhatsApp Message
        // Using %0a for new lines
        const whatsappMessage = `*New Project Inquiry* %0a%0a*Name:* ${name}%0a*Email:* ${email}%0a*Message:* ${msg}`;

        // WhatsApp API URL (Global format: https://wa.me/<number>?text=...)
        // Secure: Redirect via backend to hide number
        const whatsappUrl = `http://localhost:3000/api/whatsapp?text=${whatsappMessage}`;

        // Open in new tab
        window.open(whatsappUrl, '_blank');

        // Reset UI
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            contactForm.reset();
        }, 1000);
    });
}
