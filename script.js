// ===== NexaCode - Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initContactForm();
    initParallaxEffect();
    initLanguageSwitcher();
});

// ===== Language System =====
let currentLang = 'pl'; // Default language is Polish

function initLanguage() {
    // Get saved language or default to Polish
    const savedLang = localStorage.getItem('aihelper_lang') || 'pl';
    currentLang = savedLang;
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Apply translations
    applyTranslations(currentLang);
    
    // Update language switcher UI
    updateLanguageSwitcherUI();
}

function initLanguageSwitcher() {
    const langSwitcher = document.querySelector('.lang-switcher');
    const langToggle = document.querySelector('.lang-switcher-toggle');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Toggle dropdown
    if (langToggle && langSwitcher) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langSwitcher.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langSwitcher.contains(e.target)) {
                langSwitcher.classList.remove('active');
            }
        });
    }
    
    // Handle language button clicks
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            if (lang && lang !== currentLang) {
                switchLanguage(lang);
            }
            // Close dropdown
            if (langSwitcher) {
                langSwitcher.classList.remove('active');
            }
        });
    });
}

function switchLanguage(lang) {
    if (!translations || !translations[lang]) return;
    
    currentLang = lang;
    localStorage.setItem('aihelper_lang', lang);
    document.documentElement.lang = lang;
    
    applyTranslations(lang);
    updateLanguageSwitcherUI();
}

function applyTranslations(lang) {
    if (!translations || !translations[lang]) return;
    
    const t = translations[lang];
    
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // Translate titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (t[key]) {
            el.title = t[key];
        }
    });
}

function updateLanguageSwitcherUI() {
    // Update toggle button text
    const langCurrent = document.querySelector('.lang-current');
    if (langCurrent) {
        langCurrent.textContent = currentLang.toUpperCase();
    }
    
    // Update active state on buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
    
    // Update active state on dropdown items
    document.querySelectorAll('.lang-dropdown-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === currentLang);
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        
        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        if (menuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
    
    // Observe cards and items
    document.querySelectorAll('.service-card, .pricing-card, .step, .value-card, .team-member, .testimonial-card, .faq-item').forEach(item => {
        item.classList.add('animate-on-scroll');
        observer.observe(item);
    });
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="btn-loading"></span>';
        submitBtn.disabled = true;
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success state
        submitBtn.innerHTML = '✓ ' + (translations[currentLang]?.contact_form_submit || 'Sent!');
        submitBtn.classList.add('btn-success');
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success');
        }, 3000);
    });
    
    // Animate form fields on focus
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (!input) return;
        
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                group.classList.remove('focused');
            }
        });
    });
}

// ===== Parallax Effect =====
function initParallaxEffect() {
    const heroGlow = document.querySelector('.hero-glow');
    if (!heroGlow) return;
    
    let ticking = false;
    
    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                heroGlow.style.transform = `translate(${x}px, ${y}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== Add CSS for animations =====
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .btn-loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .btn-success {
        background: #28a745 !important;
    }
    
    .form-group.focused label {
        color: var(--color-accent-primary);
    }
    
    .form-group.focused input,
    .form-group.focused textarea,
    .form-group.focused select {
        border-color: var(--color-accent-primary);
    }
    
    /* Language Switcher Styles */
    .lang-switcher {
        position: relative;
        margin-left: var(--spacing-md);
    }
    
    .lang-dropdown-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-bg-card);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .lang-dropdown-toggle:hover {
        border-color: var(--color-accent-primary);
        color: var(--color-text-primary);
    }
    
    .lang-dropdown-toggle svg {
        width: 12px;
        height: 12px;
        transition: transform var(--transition-fast);
    }
    
    .lang-dropdown.active .lang-dropdown-toggle svg {
        transform: rotate(180deg);
    }
    
    .lang-dropdown-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        min-width: 140px;
        background: var(--color-bg-secondary);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-lg);
        padding: var(--spacing-sm);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all var(--transition-fast);
        z-index: 100;
    }
    
    .lang-dropdown.active .lang-dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .lang-dropdown-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .lang-dropdown-item:hover {
        background: var(--color-bg-card);
        color: var(--color-text-primary);
    }
    
    .lang-dropdown-item.active {
        color: var(--color-accent-primary);
    }
    
    .lang-dropdown-item .lang-flag {
        font-size: 1.2em;
    }
    
    /* Mobile language switcher */
    .mobile-lang-switcher {
        display: flex;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-xl);
        padding-top: var(--spacing-xl);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .mobile-lang-switcher .lang-btn {
        flex: 1;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-bg-card);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .mobile-lang-switcher .lang-btn:hover,
    .mobile-lang-switcher .lang-btn.active {
        border-color: var(--color-accent-primary);
        color: var(--color-accent-primary);
    }
`;
document.head.appendChild(animationStyles);

