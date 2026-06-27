/**
 * JavaScript Interactions for Công ty TNHH TMDV Luân Thành Phát
 * Features: Mobile menu toggle, Header on scroll, Scroll reveal, Active nav state, Language Switcher, Form handler
 */

import translations from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Language Switcher Logic
    // ==========================================
    let currentLang = localStorage.getItem('lang') || 'vi';
    
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangText = document.getElementById('currentLangText');

    const updateLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        
        // Update button text
        if (currentLangText) currentLangText.textContent = lang.toUpperCase();
        
        // Update active state in dropdown
        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        // Translate standard elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        
        // Translate placeholder elements
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    };

    // Toggle Dropdown
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = langBtn.getAttribute('aria-expanded') === 'true';
            langBtn.setAttribute('aria-expanded', !isExpanded);
            langDropdown.classList.toggle('show');
        });

        // Close dropdown on click outside
        document.addEventListener('click', () => {
            langBtn.setAttribute('aria-expanded', 'false');
            langDropdown.classList.remove('show');
        });
    }

    // Handle Option Click
    langOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = opt.getAttribute('data-lang');
            updateLanguage(lang);
            if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
            if (langDropdown) langDropdown.classList.remove('show');
        });
    });

    // Initialize Language on load
    updateLanguage(currentLang);

    // ==========================================
    // 2. Sticky Header & Back to Top Toggle
    // ==========================================
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');
    
    const handleScrollEffects = () => {
        const scrollPos = window.scrollY;
        
        // Header sticky background change
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top button show/hide
        if (backToTopBtn) {
            if (scrollPos > 500) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    };
    
    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Initial run

    // Scroll back to top smoothly
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 3. Mobile Navigation Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        if (mobileToggle && navMenu) {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // 4. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 5. Active Nav Link Indicator based on Page
    // ==========================================
    const updateActiveNav = () => {
        const currentPath = window.location.pathname;
        let currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        if (!currentPage) {
            currentPage = 'index.html';
        }
        const hash = window.location.hash;

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === currentPage) {
                link.classList.add('active');
            } else if ((currentPage === 'index.html' || currentPage === '') && (href === 'index.html' || href.startsWith('index.html#'))) {
                if (href === 'index.html' && !hash) {
                    link.classList.add('active');
                } else if (href.includes('#') && hash && href.endsWith(hash)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            } else {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('hashchange', updateActiveNav);
    updateActiveNav(); // Initial run

    // ==========================================
    // 6. Contact Form Validation & Submission
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('formSubmitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear previous feedback
            if (formFeedback) {
                formFeedback.className = 'form-feedback';
                formFeedback.style.display = 'none';
            }
            
            // Grab inputs
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const message = document.getElementById('formMessage').value.trim();
            
            // Basic validations
            if (!name || !email || !phone || !message) {
                showFeedback(translations[currentLang].form_error_required, 'error');
                return;
            }
            
            // Validate phone number: support both local (0...) and international (+...) formats
            const phoneRegex = /^[0-9\+\s\-\(\)]{8,20}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                showFeedback(translations[currentLang].form_error_phone, 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback(translations[currentLang].form_error_email, 'error');
                return;
            }
            
            // Mocking API Submission
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = `<span>${translations[currentLang].form_status_sending}</span>`;
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    const successMsg = translations[currentLang].form_success_msg
                        .replace('{name}', name)
                        .replace('{phone}', phone)
                        .replace('{email}', email);
                    showFeedback(successMsg, 'success');
                    
                    // Reset form
                    contactForm.reset();
                }, 1500);
            }
        });
    }
    
    const showFeedback = (text, type) => {
        if (formFeedback) {
            formFeedback.innerHTML = text;
            formFeedback.className = `form-feedback ${type}`;
            formFeedback.style.display = 'block';
            
            if (type === 'error') {
                formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    };
});
