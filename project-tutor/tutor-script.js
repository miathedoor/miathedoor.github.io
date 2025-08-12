document.addEventListener('DOMContentLoaded', () => {

    // Main function to fetch data and initialize the entire page
    async function initializePage() {
        try {
            const response = await fetch('./tutor-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            populateStaticContent(data);
            setupInteractiveComponents(data);
        } catch (error) {
            console.error("Could not load page data:", error);
        }
    }

    // Populates all the non-interactive content
    function populateStaticContent(data) {
        document.getElementById('logo-text').textContent = data.logoText;
        document.getElementById('header-title').textContent = data.header.title;
        document.getElementById('header-tagline').textContent = data.header.tagline;
        document.getElementById('header-cta').textContent = data.header.ctaButtonText;
        document.getElementById('subjects-title').textContent = data.subjects.title;
        document.getElementById('testimonials-title').textContent = data.testimonials.title;
        document.getElementById('faq-title').textContent = data.faq.title;
        document.getElementById('contact-title').textContent = data.contact.title;
        document.getElementById('contact-tagline').textContent = data.contact.tagline;
        document.getElementById('contact-email').textContent = data.contact.email;

        // Populate Subjects Grid
        const subjectsGrid = document.getElementById('subjects-grid');
        subjectsGrid.innerHTML = '';
        data.subjects.items.forEach(item => {
            subjectsGrid.innerHTML += `
                <div class="subject-card">
                    <div class="subject-icon">${item.icon}</div>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
        });
    }

    // Sets up all components that require user interaction or animation
    function setupInteractiveComponents(data) {
        setupStickyNav();
        setupStatsCounter(data.stats);
        setupTestimonialCarousel(data.testimonials);
        setupFaqAccordion(data.faq);
    }

    // --- FEATURE 2: STICKY NAVIGATION ---
    function setupStickyNav() {
        const navbar = document.getElementById('navbar');
        // Get the initial top offset of the navbar
        const stickyOffset = navbar.offsetTop;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > stickyOffset) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        });
    }

    // --- FEATURE 1: ANIMATED STATS COUNTER ---
    function setupStatsCounter(statsData) {
        const statsGrid = document.getElementById('stats-grid');
        statsGrid.innerHTML = '';
        statsData.items.forEach(item => {
            statsGrid.innerHTML += `
                <div class="stat-item">
                    <div class="stat-number" data-target="${item.number}">0</div>
                    <div class="stat-label">${item.label}${item.suffix || ''}</div>
                </div>
            `;
        });

        const animateCounter = (el) => {
            const target = +el.dataset.target;
            let count = 0;
            const duration = 2000; // 2 seconds
            // Calculate increment step time. Avoid dividing by zero.
            const stepTime = target > 0 ? Math.floor(duration / target) : duration;

            const timer = setInterval(() => {
                count++;
                el.textContent = count;
                if (count >= target) {
                    clearInterval(timer);
                    el.textContent = target; // Ensure it ends on the exact target
                }
            }, stepTime);
        };

        const statObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target.querySelector('.stat-number'));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        document.querySelectorAll('.stat-item').forEach(item => statObserver.observe(item));
    }

    // --- Testimonial Carousel ---
    function setupTestimonialCarousel(testimonialsData) {
        const slider = document.getElementById('testimonial-slider');
        slider.innerHTML = '';
        testimonialsData.reviews.forEach(review => {
            slider.innerHTML += `
                <div class="testimonial-slide">
                    <blockquote>“${review.quote}”</blockquote>
                    <p class="author">${review.author}, ${review.role}</p>
                </div>
            `;
        });

        let currentIndex = 0;
        const slides = slider.children;
        const totalSlides = slides.length;
        const updateSliderPosition = () => slider.style.transform = `translateX(-${currentIndex * 100}%)`;

        document.getElementById('next-btn').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSliderPosition();
        });
        document.getElementById('prev-btn').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSliderPosition();
        });
    }

    // --- FEATURE 3: FAQ ACCORDION ---
    function setupFaqAccordion(faqData) {
        const accordion = document.getElementById('faq-accordion');
        accordion.innerHTML = '';
        faqData.items.forEach(item => {
            accordion.innerHTML += `
                <div class="faq-item">
                    <button class="faq-question">${item.question}</button>
                    <div class="faq-answer">
                        <p>${item.answer}</p>
                    </div>
                </div>
            `;
        });

        accordion.addEventListener('click', e => {
            const questionButton = e.target.closest('.faq-question');
            if (!questionButton) return; // Exit if the click was not on a question button

            const parentItem = questionButton.parentElement;
            const wasActive = parentItem.classList.contains('active');

            // Close all other active items
            accordion.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If the clicked item was not already active, open it
            if (!wasActive) {
                parentItem.classList.add('active');
                const answer = parentItem.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    }

    // Start the entire process by calling the main function
    initializePage();

}); // <-- This is the closing bracket for the 'DOMContentLoaded' event listener.