document.addEventListener('DOMContentLoaded', () => {
    // We will store the fetched data globally within this script's scope
    let pageData = {};

    // --- FEATURE 3: BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // Show button after scrolling 300px
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    // --- END FEATURE 3 ---

    // Main function to fetch data and initialize the page
    async function initializePage() {
        try {
            const response = await fetch('./coffee-data.json'); // Use ./ for robustness
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            pageData = await response.json();

            // Populate each section of the page with the data
            populateHeader(pageData.header);
            populateAbout(pageData.about);
            setupMenu(pageData.menu); // New setup function for the menu
            populateContact(pageData.contact);

        } catch (error) {
            console.error("Could not load page data:", error);
        }
    }

    // --- FEATURE 2: KEN BURNS HEADER ---
    function populateHeader(headerData) {
        document.getElementById('header-title').textContent = headerData.title;
        document.getElementById('header-tagline').textContent = headerData.tagline;

        // Inject a style rule for the ::before element's background
        const styleSheet = document.styleSheets[0]; // Get the first stylesheet
        const imageUrl = `images/${headerData.backgroundImage}`;
        // Important: We escape backslashes in the url for safety
        const safeImageUrl = imageUrl.replace(/\\/g, '\\\\');
        const rule = `header::before { background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${safeImageUrl}'); }`;

        // Add the rule to the stylesheet
        styleSheet.insertRule(rule, styleSheet.cssRules.length);
    }
    // --- END FEATURE 2 ---

    function populateAbout(aboutData) {
        document.getElementById('about-title').textContent = aboutData.title;
        document.getElementById('about-story').textContent = aboutData.storyText;
    }

    // --- FEATURE 1: FILTERABLE MENU ---
    function setupMenu(menuData) {
        document.getElementById('menu-title').textContent = menuData.title;
        const filtersContainer = document.getElementById('menu-filters');

        // 1. Create the filter buttons dynamically
        menuData.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize
            button.dataset.category = category;
            if (category === 'all') {
                button.classList.add('active'); // Set 'All' as active by default
            }
            filtersContainer.appendChild(button);
        });

        // 2. Add event listener to the container for all buttons (event delegation)
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const category = e.target.dataset.category;

                // Update active button style
                filtersContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                // Filter and display the menu items
                filterMenuItems(category);
            }
        });

        // 3. Initial population of all menu items
        populateMenuItems(menuData.items);
    }

    // This function just renders the items it's given
    function populateMenuItems(items) {
        const grid = document.getElementById('menu-grid');
        grid.innerHTML = ''; // Clear existing content
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <img src="images/${item.image}" alt="${item.title}" loading="lazy">
                <div class="overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            grid.appendChild(itemElement);
        });
    }

    // This function handles the filtering logic and animation
    function filterMenuItems(category) {
        const allItems = pageData.menu.items;
        const grid = document.getElementById('menu-grid');

        const itemsToHide = (category === 'all')
            ? []
            : allItems.filter(item => item.category !== category);

        const itemsToShow = (category === 'all')
            ? allItems
            : allItems.filter(item => item.category === category);

        // A simple animation approach: hide all, then show the filtered ones
        grid.innerHTML = ''; // Clear instantly
        populateMenuItems(itemsToShow); // Re-populate with the correct items
    }
    // --- END FEATURE 1 ---

    function populateContact(contactData) {
        document.getElementById('contact-title').textContent = contactData.title;
        document.getElementById('contact-address').textContent = contactData.address;
        document.getElementById('contact-hours').textContent = contactData.hours;
    }

    // Start the process
    initializePage();
});