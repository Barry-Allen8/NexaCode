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
    initPortfolioFilters();
    initPricingCalculator();
    initChatbot();
    initFaqAccordion();
    initLeadPopup();
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
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
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
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    if (!('IntersectionObserver' in window)) {
        return;
    }

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

                observer.unobserve(entry.target);
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

// ===== Portfolio Filters =====
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card, .case-study');

    if (!filterBtns.length || !portfolioCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter cards
            portfolioCards.forEach(card => {
                const categories = (card.dataset.category || '').split(' ').filter(Boolean);
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== Pricing Calculator =====
function initPricingCalculator() {
    const checkboxes = document.querySelectorAll('.calculator-option input[type="checkbox"]');
    const totalElement = document.getElementById('calculatorTotal');
    const currencyBtns = document.querySelectorAll('.currency-btn');
    const currencyDisplay = document.querySelector('.amount-currency');
    const packageBtns = document.querySelectorAll('.package-btn');
    const getQuoteBtn = document.getElementById('getQuoteBtn');

    if (!checkboxes.length || !totalElement) return;

    let currentCurrency = 'PLN';
    const exchangeRates = {
        'PLN': 1,
        'EUR': 0.23,
        'USD': 0.25
    };

    // Calculate total
    function calculateTotal() {
        let total = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.dataset.price) || 0;
            }
        });
        return total;
    }

    // Update display
    function updateDisplay() {
        const totalPLN = calculateTotal();
        const converted = Math.round(totalPLN * exchangeRates[currentCurrency]);
        totalElement.textContent = converted.toLocaleString();
        if (currencyDisplay) {
            currencyDisplay.textContent = currentCurrency;
        }

        // Save to localStorage
        const selectedServices = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedServices.push(checkbox.value);
            }
        });
        localStorage.setItem('calculator_selection', JSON.stringify(selectedServices));
    }

    // Checkbox change handler
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDisplay);
    });

    // Currency toggle
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCurrency = btn.dataset.currency;
            updateDisplay();
        });
    });

    // Package presets
    packageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const services = btn.dataset.services.split(',');

            // Clear all
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Select package services
            services.forEach(service => {
                const checkbox = document.querySelector(`.calculator-option input[value="${service}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });

            updateDisplay();
        });
    });

    // Load saved selection
    const savedSelection = localStorage.getItem('calculator_selection');
    if (savedSelection) {
        try {
            const services = JSON.parse(savedSelection);
            services.forEach(service => {
                const checkbox = document.querySelector(`.calculator-option input[value="${service}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            updateDisplay();
        } catch (e) {
            // Invalid saved data, ignore
        }
    }

    // Get Quote button - pass selection to contact form
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', (e) => {
            const selectedServices = [];
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const label = checkbox.closest('.calculator-option').querySelector('.option-name');
                    if (label) {
                        selectedServices.push(label.textContent);
                    }
                }
            });

            if (selectedServices.length > 0) {
                localStorage.setItem('quote_services', selectedServices.join(', '));
                localStorage.setItem('quote_total', calculateTotal());
            }
        });
    }
}

// ===== Chatbot =====
function initChatbot() {
    const chatbot = document.getElementById('chatbot');
    const toggleBtn = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const messagesContainer = document.getElementById('chatbotMessages');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const quickActions = document.querySelectorAll('.quick-action-btn');

    if (!chatbot || !toggleBtn) return;

    // Chatbot responses
    const responses = {
        'pricing': {
            text: {
                'pl': 'Nasze ceny:\n\n- Landing page: od $500\n- Strona korporacyjna: od $900\n- Chatbot AI: od $650\n- E-commerce: od $1,500\n- Integracja AI: od $1,100\n- Automatyzacja: od $750\n\nCena zalezy od zlozonosci projektu.',
                'uk': 'Nashi tsiny:\n\n- Landing page: vid $500\n- Korporatyvnyy sayt: vid $900\n- Chatbot AI: vid $650\n- E-commerce: vid $1,500\n- AI intehratsiya: vid $1,100\n- Avtomatyzatsiya: vid $750',
                'en': 'Our pricing:\n\n- Landing page: from $500\n- Corporate website: from $900\n- AI Chatbot: from $650\n- E-commerce: from $1,500\n- AI Integration: from $1,100\n- Automation: from $750\n\nFinal price depends on project complexity.'
            },
            followUp: ['calculator', 'contact']
        },
        'timeline': {
            text: {
                'pl': 'Standardowe terminy realizacji:\n\n- Landing page: 3-5 dni\n- Strona korporacyjna: 7-14 dni\n- E-commerce: 14-30 dni\n- Chatbot: 5-10 dni\n\nTermin zalezy od zlozonosci i dostepnosci materialow.',
                'uk': 'Standartni terminy:\n\n- Landing page: 3-5 dniv\n- Korporatyvnyy sayt: 7-14 dniv\n- E-commerce: 14-30 dniv\n- Chatbot: 5-10 dniv',
                'en': 'Standard delivery times:\n\n- Landing page: 3-5 days\n- Corporate website: 7-14 days\n- E-commerce: 14-30 days\n- Chatbot: 5-10 days\n\nTimeline depends on complexity and material availability.'
            },
            followUp: ['contact', 'portfolio']
        },
        'technologies': {
            text: {
                'pl': 'Technologie, ktorych uzywamy:\n\n Frontend: React, Next.js, Vue.js, Tailwind CSS\n Backend: Node.js, Python, Firebase\n AI/ML: OpenAI GPT-4, Claude API, LangChain\n Boty: Telegram API, Viber, Instagram\n Hosting: Vercel, AWS, Firebase',
                'uk': 'Tekhnolohii, yaki my vykorystovuemo:\n\n Frontend: React, Next.js, Vue.js\n Backend: Node.js, Python\n AI/ML: OpenAI, Claude API\n Boty: Telegram, Viber, Instagram',
                'en': 'Technologies we use:\n\n Frontend: React, Next.js, Vue.js, Tailwind CSS\n Backend: Node.js, Python, Firebase\n AI/ML: OpenAI GPT-4, Claude API, LangChain\n Bots: Telegram API, Viber, Instagram\n Hosting: Vercel, AWS, Firebase'
            },
            followUp: ['portfolio', 'contact']
        },
        'portfolio': {
            text: {
                'pl': 'Zobacz nasze realizacje na stronie Portfolio! Mamy projekty z roznych branz:\n\n- Sklepy internetowe\n- Chatboty dla firm\n- Rozwiazania AI\n- Strony korporacyjne',
                'uk': 'Podyvitsya nashi roboty na storintsi Portfolio!',
                'en': 'Check our work on the Portfolio page! We have projects from various industries:\n\n- E-commerce stores\n- Business chatbots\n- AI solutions\n- Corporate websites'
            },
            followUp: ['pricing', 'contact'],
            action: 'scrollToPortfolio'
        },
        'contact': {
            text: {
                'pl': 'Chetnie porozmawiamy o Twoim projekcie!\n\n Email: hello@nexacode.pl\n Telegram: @nexacode\n\nMozesz tez wypelnic formularz na stronie kontaktowej.',
                'uk': 'Z radistyu pohovorimo pro vash proekt!\n\n Email: hello@nexacode.pl\n Telegram: @nexacode',
                'en': 'We are happy to discuss your project!\n\n Email: hello@nexacode.pl\n Telegram: @nexacode\n\nYou can also fill out the contact form.'
            },
            followUp: ['calculator'],
            action: 'goToContact'
        },
        'calculator': {
            text: {
                'pl': 'Uzyj naszego kalkulatora cen na stronie glownej, zeby oszacowac koszt projektu!',
                'uk': 'Skorystaysya nashym kalkulyatorom tsin!',
                'en': 'Use our price calculator on the homepage to estimate your project cost!'
            },
            followUp: ['contact', 'portfolio'],
            action: 'scrollToCalculator'
        },
        'default': {
            text: {
                'pl': 'Dziekuje za wiadomosc! Moge pomoc Ci z:\n\n1. Informacje o cenach\n2. Terminy realizacji\n3. Technologie, ktorych uzywamy\n4. Portfolio\n5. Kontakt\n\nCo Cie interesuje?',
                'uk': 'Dyakuyu za povidomlennya! Ya mozhu dopomohty z:\n\n1. Informatsiya pro tsiny\n2. Terminy realizatsiyi\n3. Tekhnolohiyi\n4. Portfolio\n5. Kontakt',
                'en': 'Thanks for your message! I can help you with:\n\n1. Pricing information\n2. Project timelines\n3. Technologies we use\n4. Portfolio\n5. Contact information\n\nWhat would you like to know?'
            },
            followUp: ['pricing', 'timeline', 'portfolio', 'contact']
        }
    };

    const followUpLabels = {
        'pl': {
            'pricing': 'Ile kosztuje?',
            'timeline': 'Jak dlugo?',
            'technologies': 'Technologie',
            'portfolio': 'Portfolio',
            'contact': 'Kontakt',
            'calculator': 'Kalkulator'
        },
        'uk': {
            'pricing': 'Skilky koshtuye?',
            'timeline': 'Yak dovho?',
            'technologies': 'Tekhnolohiyi',
            'portfolio': 'Portfolio',
            'contact': 'Kontakt',
            'calculator': 'Kalkulyator'
        },
        'en': {
            'pricing': 'How much?',
            'timeline': 'How long?',
            'technologies': 'Technologies',
            'portfolio': 'Portfolio',
            'contact': 'Contact',
            'calculator': 'Calculator'
        }
    };

    // Toggle chatbot
    function toggleChatbot() {
        chatbot.classList.toggle('active');
        if (chatbot.classList.contains('active') && messagesContainer.children.length === 0) {
            // Show welcome message
            setTimeout(() => {
                addBotMessage(getWelcomeMessage());
            }, 500);
        }
    }

    // Get welcome message based on language
    function getWelcomeMessage() {
        const lang = currentLang || 'pl';
        const messages = {
            'pl': 'Czesc! Jestem asystentem NexaCode. W czym moge Ci pomoc?\n\nMoge odpowiedziec na pytania o ceny, terminy, technologie lub pokazac portfolio.',
            'uk': 'Pryvit! Ya asystent NexaCode. Chym mozhu dopomohty?\n\nYa mozhu vidpovisty na pytannya pro tsiny, terminy, tekhnolohiyi abo pokazaty portfolio.',
            'en': 'Hi! I am the NexaCode assistant. How can I help you?\n\nI can answer questions about pricing, timelines, technologies, or show our portfolio.'
        };
        return messages[lang] || messages['pl'];
    }

    // Add bot message
    function addBotMessage(text, followUp = null) {
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Replace with actual message after delay
        setTimeout(() => {
            typingDiv.remove();

            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message bot';
            messageDiv.innerHTML = text.replace(/\n/g, '<br>');

            // Add follow-up buttons if provided
            if (followUp && followUp.length > 0) {
                const lang = currentLang || 'pl';
                const labels = followUpLabels[lang] || followUpLabels['pl'];

                const followUpDiv = document.createElement('div');
                followUpDiv.className = 'chat-follow-up';

                followUp.forEach(action => {
                    const btn = document.createElement('button');
                    btn.className = 'follow-up-btn';
                    btn.textContent = labels[action] || action;
                    btn.dataset.action = action;
                    btn.addEventListener('click', () => handleAction(action));
                    followUpDiv.appendChild(btn);
                });

                messageDiv.appendChild(followUpDiv);
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000 + Math.random() * 500);
    }

    // Add user message
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Handle action
    function handleAction(action) {
        const lang = currentLang || 'pl';
        const response = responses[action] || responses['default'];

        const text = response.text[lang] || response.text['pl'];
        addBotMessage(text, response.followUp);

        // Execute action if defined
        if (response.action) {
            setTimeout(() => {
                if (response.action === 'scrollToPortfolio') {
                    const portfolio = document.getElementById('portfolio');
                    if (portfolio) {
                        chatbot.classList.remove('active');
                        portfolio.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (response.action === 'scrollToCalculator') {
                    const calculator = document.getElementById('calculator');
                    if (calculator) {
                        chatbot.classList.remove('active');
                        calculator.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (response.action === 'goToContact') {
                    setTimeout(() => {
                        window.location.href = 'contact.html';
                    }, 1500);
                }
            }, 2000);
        }
    }

    // Process user input
    function processInput(userText) {
        addUserMessage(userText);

        const text = userText.toLowerCase();
        let action = 'default';

        // Simple keyword matching
        if (text.includes('cen') || text.includes('koszt') || text.includes('price') || text.includes('ile')) {
            action = 'pricing';
        } else if (text.includes('czas') || text.includes('dlugo') || text.includes('termin') || text.includes('time') || text.includes('how long')) {
            action = 'timeline';
        } else if (text.includes('tech') || text.includes('stack') || text.includes('jakie')) {
            action = 'technologies';
        } else if (text.includes('portfolio') || text.includes('projekt') || text.includes('realizacj') || text.includes('work')) {
            action = 'portfolio';
        } else if (text.includes('kontakt') || text.includes('contact') || text.includes('email') || text.includes('telefon')) {
            action = 'contact';
        } else if (text.includes('kalkulator') || text.includes('calculator') || text.includes('oblicz')) {
            action = 'calculator';
        }

        setTimeout(() => handleAction(action), 500);
    }

    // Event listeners
    toggleBtn.addEventListener('click', toggleChatbot);

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatbot.classList.remove('active');
        });
    }

    // Quick actions
    quickActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const lang = currentLang || 'pl';
            const labels = followUpLabels[lang] || followUpLabels['pl'];
            addUserMessage(labels[action] || btn.textContent);
            setTimeout(() => handleAction(action), 500);
        });
    });

    // Send message
    function sendMessage() {
        const text = input.value.trim();
        if (text) {
            processInput(text);
            input.value = '';
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Auto-open chatbot after 30 seconds (only once per session)
    if (!sessionStorage.getItem('chatbot_shown')) {
        setTimeout(() => {
            if (!chatbot.classList.contains('active')) {
                // Just pulse the badge, don't auto-open
                const badge = chatbot.querySelector('.chatbot-badge');
                if (badge) {
                    badge.style.animation = 'pulse 0.5s ease 3';
                }
            }
        }, 30000);
        sessionStorage.setItem('chatbot_shown', 'true');
    }
}

// ===== FAQ Accordion =====
function initFaqAccordion() {
    const faqItems = Array.from(document.querySelectorAll('.faq-item')).filter(item => {
        return Boolean(item.querySelector('button.faq-question') && item.querySelector('.faq-answer'));
    });
    if (faqItems.length === 0) return;

    function closeItem(item) {
        const button = item.querySelector('button.faq-question');
        const answer = item.querySelector('.faq-answer');
        item.classList.remove('active');
        if (button) button.setAttribute('aria-expanded', 'false');
        if (answer) answer.hidden = true;
    }

    function openItem(item) {
        const button = item.querySelector('button.faq-question');
        const answer = item.querySelector('.faq-answer');
        item.classList.add('active');
        if (button) button.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
    }

    faqItems.forEach(item => closeItem(item));
    openItem(faqItems[0]);

    faqItems.forEach(item => {
        const button = item.querySelector('button.faq-question');
        if (!button) return;

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem !== item) closeItem(otherItem);
            });

            if (isOpen) {
                closeItem(item);
            } else {
                openItem(item);
            }
        });
    });
}

// ===== Lead Capture Popup =====
function initLeadPopup() {
    const popup = document.getElementById('leadPopup');
    const overlay = document.getElementById('leadPopupOverlay');
    const closeBtn = document.getElementById('leadPopupClose');
    const form = document.getElementById('leadPopupForm');

    if (!popup) return;

    // Check if already shown this session or user already subscribed
    const alreadySubscribed = localStorage.getItem('nexacode_subscribed');
    const shownThisSession = sessionStorage.getItem('popup_shown');

    if (alreadySubscribed || shownThisSession) return;

    // Show popup after 45 seconds of browsing
    const showTimeout = setTimeout(() => {
        popup.classList.add('active');
        sessionStorage.setItem('popup_shown', 'true');
    }, 45000);

    // Also show on exit intent (mouse leaves viewport)
    let exitIntentShown = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !exitIntentShown && !shownThisSession && !alreadySubscribed) {
            clearTimeout(showTimeout);
            popup.classList.add('active');
            sessionStorage.setItem('popup_shown', 'true');
            exitIntentShown = true;
        }
    });

    // Close handlers
    function closePopup() {
        popup.classList.remove('active');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }

    if (overlay) {
        overlay.addEventListener('click', closePopup);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
                return;
            }

            const emailInput = document.getElementById('leadEmail');
            if (!emailInput || !emailInput.value) return;

            const email = emailInput.value;

            // Here you would typically send this to your backend
            // For now, we'll just simulate success
            console.log('Lead captured:', email);

            // Mark as subscribed
            localStorage.setItem('nexacode_subscribed', 'true');

            // Show success message
            const content = popup.querySelector('.lead-popup-content');
            if (content) {
                content.innerHTML = '';

                const wrapper = document.createElement('div');
                wrapper.className = 'lead-popup-success';

                const icon = document.createElement('div');
                icon.className = 'lead-popup-icon';
                icon.innerHTML = `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                const title = document.createElement('h3');
                title.className = 'lead-popup-title';
                title.style.marginTop = '1rem';
                title.textContent = 'Thank you!';

                const description = document.createElement('p');
                description.className = 'lead-popup-description';
                description.textContent = `We'll send your free audit results to ${email} within 24 hours.`;

                const closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.className = 'btn btn-primary';
                closeButton.textContent = 'Close';
                closeButton.addEventListener('click', closePopup);

                wrapper.appendChild(icon);
                wrapper.appendChild(title);
                wrapper.appendChild(description);
                wrapper.appendChild(closeButton);
                content.appendChild(wrapper);
            }
        });
    }
}
