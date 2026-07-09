/**
 * NexaCode - Interactive Multilingual Landing Page Logic
 */

let currentLang = 'pl';
let terminalInterval = null;
let terminalTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScrollAndActiveLinks();
    initFaqAccordion();
    initContactForm();
});

// ===== 1. Language Swapping System =====
function initLanguage() {
    // Get saved language or default to Polish
    const savedLang = localStorage.getItem('nexacode_lang') || 'pl';
    currentLang = savedLang;

    // Apply translations
    applyTranslations(currentLang);
    updateLanguageSwitcherUI(currentLang);
    initTerminalSimulator();

    // Support multiple switchers (e.g. Header and Mobile Menu)
    const langSwitchers = document.querySelectorAll('.lang-switcher');

    langSwitchers.forEach(switcher => {
        const toggle = switcher.querySelector('.lang-toggle');
        const selectButtons = switcher.querySelectorAll('.lang-select');

        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close all other switchers first
                langSwitchers.forEach(other => {
                    if (other !== switcher) {
                        other.classList.remove('active');
                        const otherToggle = other.querySelector('.lang-toggle');
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });

                switcher.classList.toggle('active');
                const isExpanded = switcher.classList.contains('active');
                toggle.setAttribute('aria-expanded', isExpanded);
            });
        }

        selectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.dataset.lang;
                if (lang && lang !== currentLang) {
                    switchLanguage(lang);
                }
                switcher.classList.remove('active');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        langSwitchers.forEach(switcher => {
            if (!switcher.contains(e.target)) {
                switcher.classList.remove('active');
                const toggle = switcher.querySelector('.lang-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function switchLanguage(lang) {
    if (!translations || !translations[lang]) return;
    
    currentLang = lang;
    localStorage.setItem('nexacode_lang', lang);
    
    applyTranslations(lang);
    updateLanguageSwitcherUI(lang);
    initTerminalSimulator(); // Restart terminal with localized logs
}

function updateLanguageSwitcherUI(lang) {
    const langSwitchers = document.querySelectorAll('.lang-switcher');
    langSwitchers.forEach(switcher => {
        const langCurrentSpan = switcher.querySelector('.lang-current');
        if (langCurrentSpan) {
            langCurrentSpan.textContent = lang === 'uk' ? 'UA' : lang.toUpperCase();
        }
    });
}

function applyTranslations(lang) {
    if (!translations || !translations[lang]) return;

    const t = translations[lang];

    // Set document lang attribute
    document.documentElement.lang = lang === 'uk' ? 'uk' : lang;

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    // Translate all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });

    // Dynamic SEO update for index.html only
    const isMainPage = !window.location.pathname.includes('privacy-policy') && !window.location.pathname.includes('cookies-policy');
    if (isMainPage) {
        if (t['seo-title']) {
            document.title = t['seo-title'];
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t['seo-description']) {
            metaDesc.setAttribute('content', t['seo-description']);
        }
    }

    refreshFaqHeights();
}

// ===== 2. Sticky Header Scroll Effect =====
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

// ===== 3. Mobile Menu Toggle =====
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

// ===== 4. Smooth Scroll & Active Nav Highlights =====
function initSmoothScrollAndActiveLinks() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) + 18 : 90;
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

// ===== 5. Hero Section Terminal Simulator =====
function initTerminalSimulator() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;

    // Clear any currently running animations from previous language switches
    if (terminalInterval) clearInterval(terminalInterval);
    if (terminalTimeout) clearTimeout(terminalTimeout);

    const t = translations[currentLang];
    
    // Define localized simulation steps
    const steps = [
        { type: 'typewriter', text: ' nexacode init project --package start', prefix: '<span class="text-purple">$</span>' },
        { type: 'print', text: t['terminal-init'] || 'Inicjowanie modułów wdrażania...', delay: 600, class: 'text-muted' },
        { type: 'print', text: `<span class="text-teal">[OK]</span> ${t['terminal-status-web'] || 'Strona internetowa status:'} <span class="status-badge status-active">ACTIVE</span>`, delay: 800 },
        { type: 'print', text: `<span class="text-teal">[OK]</span> ${t['terminal-status-form'] || 'Formularz kontaktowy:'} <span class="status-badge status-active">CONNECTED</span>`, delay: 500 },
        { type: 'print', text: `<span class="text-teal">[OK]</span> ${t['terminal-status-wa'] || 'Integracja WhatsApp:'} <span class="status-badge status-active">READY</span>`, delay: 400 },
        { type: 'print', text: t['terminal-generating'] || 'Generowanie parametrów projektu...', delay: 700, class: 'text-muted' },
        { type: 'print', text: `<span class="text-purple">[RUN]</span> ${t['terminal-deploying'] || 'Wdrażanie projektu...'} 100% SUCCESS`, delay: 900 },
        { type: 'print', text: `<span class="text-teal">[INFO]</span> ${t['terminal-price'] || 'Wycena końcowa: od 500 PLN'}`, delay: 500, class: 'text-glow' },
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
            
            terminalInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    lastLine.innerHTML += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(terminalInterval);
                    // Add cursor back temporarily
                    lastLine.innerHTML += '<span class="terminal-cursor"></span>';
                    stepIndex++;
                    terminalTimeout = setTimeout(runStep, 400);
                }
            }, 50); // Typing speed
            
        } else if (step.type === 'print') {
            terminalTimeout = setTimeout(() => {
                const newLine = document.createElement('div');
                newLine.className = 'terminal-line' + (step.class ? ' ' + step.class : '');
                newLine.innerHTML = step.text + '<span class="terminal-cursor"></span>';
                terminalBody.appendChild(newLine);
                
                stepIndex++;
                runStep();
            }, step.delay);
            
        } else if (step.type === 'cursor-line') {
            terminalTimeout = setTimeout(() => {
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
    terminalTimeout = setTimeout(runStep, 800);
}

// ===== 6. FAQ Accordion Accordance =====
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        const answerId = answer.id || `faq-answer-${index + 1}`;
        answer.id = answerId;
        btn.setAttribute('aria-controls', answerId);
        btn.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
        answer.style.height = item.classList.contains('active') ? `${answer.scrollHeight}px` : '0px';
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(el => {
                const elButton = el.querySelector('.faq-question');
                const elAnswer = el.querySelector('.faq-answer');
                el.classList.remove('active');
                if (elButton) elButton.setAttribute('aria-expanded', 'false');
                if (elAnswer) elAnswer.style.height = '0px';
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                if (answer) answer.style.height = `${answer.scrollHeight}px`;
            }
        });
    });

    window.addEventListener('resize', refreshFaqHeights);
}

function refreshFaqHeights() {
    document.querySelectorAll('.faq-item.active .faq-answer').forEach(answer => {
        answer.style.height = `${answer.scrollHeight}px`;
    });
}

// ===== 7. Contact Form Validation & Handler =====
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

        const t = translations[currentLang];

        if (!name || !email || !phone || !industry || !message) {
            alert(t['validation-alert'] || 'Proszę wypełnić wszystkie pola formularza.');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<span class="btn-loading"></span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Phone: phone,
                    Industry: industry,
                    Message: message
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Show success state
            submitBtn.innerHTML = t['submit-success'] || '✓ Zapytanie zostało wysłane!';
            submitBtn.classList.add('btn-success');
            
            // Reset inputs
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.innerHTML = t['submit-error'] || '❌ Błąd. Spróbuj ponownie.';
            submitBtn.classList.add('btn-error');
        } finally {
            // Reset button state after 3.5 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-success', 'btn-error');
            }, 3500);
        }
    });
}
