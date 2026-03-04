// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Email capture form handling
const emailForm = document.getElementById('email-form');
const formMessage = document.getElementById('form-message');

if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email-input');
        const submitBtn = emailForm.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();
        
        if (!email) return;
        
        // Disable form during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        
        try {
            const response = await fetch('https://app.hellolexa.space/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    source: 'hellolexa_landing' 
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (data.alreadyExists) {
                    formMessage.textContent = "You're already on the list! 📧";
                    formMessage.className = 'form-message exists';
                } else {
                    formMessage.textContent = "You're in! Check your inbox 🎉";
                    formMessage.className = 'form-message success';
                    emailInput.value = '';
                }
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Email capture error:', error);
            formMessage.textContent = 'Oops! Please try again.';
            formMessage.className = 'form-message error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        }
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add intersection observer classes to sections
document.addEventListener('DOMContentLoaded', () => {
    // Select elements to animate
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .section-header');

    animateElements.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Mouse tracking for glowing cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
