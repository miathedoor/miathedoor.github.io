document.addEventListener('DOMContentLoaded', () => {
    loadPageContent();
    window.addEventListener('scroll', () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) return;
        const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
        document.body.style.backgroundPosition = `0% ${scrollPercentage}%`;
    });
});

async function loadPageContent() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        populatePersonalInfo(data.personalInfo);
        populatePortfolio(data.projects);
        initializeTilt();
    } catch (error) {
        console.error("Could not load page data:", error);
    }
}

function populatePersonalInfo(info) {
    // UPDATED: The next two lines that populated the old header are now removed.
    document.getElementById('about-heading').textContent = `Hi, I'm ${info.name}!`;
    document.getElementById('about-me-p').textContent = info.aboutMe;
    document.getElementById('title-tag').textContent = `${info.name} | Web Development Portfolio`;
    document.getElementById('portfolio-title').textContent = info.portfolioTitle;
    document.getElementById('contact-title').textContent = info.contactTitle;
    document.getElementById('contact-description').textContent = info.contactDescription;
    const emailLink = document.getElementById('contact-email-link');
    const emailText = document.getElementById('contact-email-text');
    emailLink.href = `mailto:${info.email}`;
    emailText.textContent = info.email;
    document.getElementById('copyright-year').textContent = info.copyrightYear;
    document.getElementById('copyright-name').textContent = info.name;
}

function populatePortfolio(projects) {
    const grid = document.getElementById('portfolio-grid');
    grid.innerHTML = '';

    projects.forEach(project => {
        const isExternal = project.liveSiteUrl.startsWith('http');
        const linkTarget = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
        let tagsHTML = '';
        if (project.tags && project.tags.length > 0) {
            tagsHTML = `
                <div class="portfolio-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
        }

        const tileHTML = `
            <a href="${project.liveSiteUrl}" class="portfolio-tile" data-tilt ${linkTarget}>
                <img src="images/${project.imageTile}" alt="Screenshot of the ${project.title}">
                <h3>${project.title}</h3>
                <p>${project.tileDescription}</p>
                ${tagsHTML}
            </a>
        `;
        grid.innerHTML += tileHTML;
    });

    const placeholderHTML = `
        <div class="portfolio-tile placeholder">
             <h3>And more!</h3>
             <p>I'm always looking for new challenges.</p>
        </div>
    `;
    grid.innerHTML += placeholderHTML;
}

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
revealElements.forEach(element => observer.observe(element));

function initializeTilt() {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15, speed: 400, glare: true, "max-glare": 0.2
    });
}