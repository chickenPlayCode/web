/**
 * JavaScript Interactions for Công ty TNHH TMDV Luân Thành Phát
 * Features: Mobile menu toggle, Header on scroll, Scroll reveal, Active nav state, Form handler
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Sticky Header & Back to Top Toggle
    // ==========================================
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');
    
    const handleScrollEffects = () => {
        const scrollPos = window.scrollY;
        
        // Header sticky background change
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button show/hide
        if (scrollPos > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    };
    
    window.addEventListener('scroll', handleScrollEffects);
    // Initial run in case page starts scrolled
    handleScrollEffects();

    // Scroll back to top smoothly
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // 2. Mobile Navigation Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent body scrolling when mobile menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // 3. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve since we only want to reveal once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 4. Active Nav Link Indicator on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNavMenu = () => {
        const scrollPos = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Offset for sticky navbar
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (correspondingLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavMenu);
    highlightNavMenu(); // Initial run

    // ==========================================
    // 5. Contact Form Validation & Submission
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('formSubmitBtn');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous feedback
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'none';
        
        // Grab inputs
        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const phone = document.getElementById('formPhone').value.trim();
        const message = document.getElementById('formMessage').value.trim();
        
        // Basic validations
        if (!name || !email || !phone || !message) {
            showFeedback('Vui lòng nhập đầy đủ các trường thông tin có dấu (*).', 'error');
            return;
        }
        
        // Validate Vietnamese phone number: starts with 0 or +84, followed by 9 digits
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showFeedback('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số điện thoại Việt Nam (ví dụ: 0966816118).', 'error');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFeedback('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.', 'error');
            return;
        }
        
        // Mocking API Submission
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Đang gửi yêu cầu...</span>';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            showFeedback(`Cảm ơn <strong>${name}</strong>! Yêu cầu tư vấn của bạn đã được gửi đi thành công. Giám đốc <strong>Benny Chen</strong> hoặc bộ phận tư vấn sẽ liên hệ lại với bạn qua số điện thoại <strong>${phone}</strong> hoặc email <strong>${email}</strong> trong thời gian sớm nhất!`, 'success');
            
            // Reset form
            contactForm.reset();
        }, 1500);
    });
    
    const showFeedback = (text, type) => {
        formFeedback.innerHTML = text;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.style.display = 'block';
        
        // Scroll slightly to feedback message for UX on mobile
        if (type === 'error') {
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };
});
