/**
 * NexaCode - Interactive Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScrollAndActiveLinks();
    initTerminalSimulator();
    initFaqAccordion();
    initContactForm();
});

// ===== 1. Sticky Header Scroll Effect =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== 2. Mobile Menu Toggle =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuBtn || !navMenu) return;

    function toggleMenu() {
        const isActive = menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open on mobile
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuBtn.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

// ===== 3. Smooth Scroll & Active Nav Highlights =====
function initSmoothScrollAndActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link, .header-cta, .hero-actions a, .offer-footer a');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = 72;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update address bar state without jumping
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // IntersectionObserver to highlight current active navigation link
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the mid/upper screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// ===== 4. Hero Section Terminal Simulator =====
function initTerminalSimulator() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;

    // Define simulation steps
    const steps = [
        { type: 'typewriter', text: ' nexacode init project --package start', selector: null, prefix: '<span class="text-purple">$</span>' },
        { type: 'print', text: 'Inicjowanie modułów wdrażania...', delay: 600, class: 'text-muted' },
        { type: 'print', text: '<span class="text-teal">[OK]</span> Strona internetowa status: <span class="status-badge status-active">ACTIVE</span>', delay: 800 },
        { type: 'print', text: '<span class="text-teal">[OK]</span> Formularz kontaktowy: <span class="status-badge status-active">CONNECTED</span>', delay: 500 },
        { type: 'print', text: '<span class="text-teal">[OK]</span> Integracja WhatsApp: <span class="status-badge status-active">READY</span>', delay: 400 },
        { type: 'print', text: 'Generowanie parametrów projektu...', delay: 700, class: 'text-muted' },
        { type: 'print', text: '<span class="text-purple">[RUN]</span> Wdrażanie projektu... 100% SUCCESS', delay: 900 },
        { type: 'print', text: '<span class="text-teal">[INFO]</span> Wycena końcowa: od 500 PLN', delay: 500, class: 'text-glow' },
        { type: 'cursor-line', text: '', delay: 600 }
    ];

    // Clear initial content
    terminalBody.innerHTML = '';
    
    // Add active blinking cursor line to start
    const startLine = document.createElement('div');
    startLine.className = 'terminal-line';
    startLine.innerHTML = '<span class="text-purple">$</span><span class="terminal-cursor"></span>';
    terminalBody.appendChild(startLine);

    let stepIndex = 0;

    function runStep() {
        if (stepIndex >= steps.length) return;

        const step = steps[stepIndex];
        const lastLine = terminalBody.querySelector('.terminal-line:last-child');
        
        // Remove cursor from previous line
        const cursor = terminalBody.querySelector('.terminal-cursor');
        if (cursor) cursor.remove();

        if (step.type === 'typewriter') {
            let charIndex = 0;
            const textToType = step.text;
            
            // Re-create command line container
            lastLine.innerHTML = step.prefix;
            
            const typingInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    lastLine.innerHTML += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    // Add cursor back temporarily
                    lastLine.innerHTML += '<span class="terminal-cursor"></span>';
                    stepIndex++;
                    setTimeout(runStep, 400);
                }
            }, 50); // Typing speed
            
        } else if (step.type === 'print') {
            setTimeout(() => {
                const newLine = document.createElement('div');
                newLine.className = 'terminal-line' + (step.class ? ' ' + step.class : '');
                newLine.innerHTML = step.text + '<span class="terminal-cursor"></span>';
                terminalBody.appendChild(newLine);
                
                stepIndex++;
                runStep();
            }, step.delay);
            
        } else if (step.type === 'cursor-line') {
            setTimeout(() => {
                const newLine = document.createElement('div');
                newLine.className = 'terminal-line';
                newLine.innerHTML = '<span class="text-purple">$</span><span class="terminal-cursor"></span>';
                terminalBody.appendChild(newLine);
                
                stepIndex++;
                runStep();
            }, step.delay);
        }
    }

    // Start simulation after page load delay
    setTimeout(runStep, 800);
}

// ===== 5. FAQ Accordion Accordance =====
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== 6. Contact Form Validation & Handler =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;

        // Perform basic validations
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phone = form.querySelector('#phone').value.trim();
        const industry = form.querySelector('#industry').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !phone || !industry || !message) {
            alert('Proszę wypełnić wszystkie pola formularza.');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<span class="btn-loading"></span>';
        submitBtn.disabled = true;

        // Simulate API call (delay 1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        submitBtn.innerHTML = '✓ Zapytanie zostało wysłane!';
        submitBtn.classList.add('btn-success');
        
        // Reset inputs
        form.reset();

        // Reset button state after 3.5 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success');
        }, 3500);
    });
}
