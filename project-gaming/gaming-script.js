document.addEventListener('DOMContentLoaded', () => {

    // Main function to fetch data and initialize the page
    async function initializePage() {
        try {
            const response = await fetch('./gaming-data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            populateContent(data);
            setupParticles();
        } catch (error) {
            console.error("Could not load page data:", error);
        }
    }

    // Populates all content from the JSON file
    function populateContent(data) {
        // Header, About, Join
        document.getElementById('header-title').textContent = data.header.title;
        document.getElementById('header-tagline').textContent = data.header.tagline;
        document.getElementById('about-title').textContent = data.about.title;
        document.getElementById('about-text').textContent = data.about.text;
        document.getElementById('events-title').textContent = data.events.title;
        document.getElementById('join-title').textContent = data.join.title;
        document.getElementById('join-text').textContent = data.join.text;

        const joinButton = document.getElementById('join-button');
        joinButton.textContent = data.join.buttonText;
        joinButton.href = data.join.buttonLink;

        // FEATURE 3: Populate and Sort Dynamic Events
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to the start of the day for accurate comparison

        // Sort events by date, newest first
        const sortedEvents = data.events.items.sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const isFinished = eventDate < today;

            eventsList.innerHTML += `
                <div class="event-item ${isFinished ? 'finished' : ''}">
                    <h3>${event.title}</h3>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    <p><strong>Info:</strong> ${event.time}</p>
                </div>
            `;
        });
    }

    // FEATURE 1: Initialize tsParticles
    function setupParticles() {
        tsParticles.load("particles-js", {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                    resize: true,
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: { value: "#00ff41" },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.1,
                    width: 1,
                },
                collisions: { enable: true },
                move: {
                    direction: "none",
                    enable: true,
                    outMode: "bounce",
                    random: false,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: { enable: true, value_area: 800 },
                    value: 80,
                },
                opacity: { value: 0.3 },
                shape: { type: "circle" },
                size: { random: true, value: 3 },
            },
            detectRetina: true,
        });
    }

    // Start the page build process
    initializePage();
});