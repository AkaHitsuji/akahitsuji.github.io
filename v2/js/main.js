class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuToggle = document.querySelector('.menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.filterButton = document.querySelector('.filter-button');
        this.selectedTags = document.querySelector('.selected-tags');
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.scrollBtn = document.querySelector('.scroll-btn');
        this.logoHomeLink = document.querySelector('.logo');
        this.allTags = new Set();
        
        this.init();
    }

    init() {
        // Handle scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Handle mobile menu
        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Handle smooth scrolling for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Handle scroll button click
        if (this.scrollBtn) {
            this.scrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = this.scrollBtn.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        }

        // Handle logo home link click
        if (this.logoHomeLink) {
            this.logoHomeLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = this.logoHomeLink.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenuToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.mobileMenu.classList.remove('show');
            }
        });

        // Initialize timeline filtering
        this.initTimelineFilter();
    }

    handleScroll() {
        if (window.scrollY > 10) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('show');
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.mobileMenu.classList.remove('show');
        }
    }

    initTimelineFilter() {
        // Collect all tags
        this.timelineItems.forEach(item => {
            const tags = item.querySelectorAll('.timeline-tags .tag');
            tags.forEach(tag => {
                this.allTags.add(tag.textContent);
            });
        });

        // Create filter dropdown
        const filterDropdown = document.createElement('div');
        filterDropdown.className = 'filter-dropdown';
        filterDropdown.style.display = 'none';

        // Add tag options
        this.allTags.forEach(tag => {
            const option = document.createElement('button');
            option.className = 'filter-option';
            option.textContent = tag;
            option.addEventListener('click', () => this.toggleTag(tag));
            filterDropdown.appendChild(option);
        });

        // Add dropdown to DOM
        this.filterButton.parentNode.appendChild(filterDropdown);

        // Toggle dropdown
        this.filterButton.addEventListener('click', () => {
            filterDropdown.style.display = filterDropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.filterButton.contains(e.target) && !filterDropdown.contains(e.target)) {
                filterDropdown.style.display = 'none';
            }
        });
    }

    toggleTag(tag) {
        const selectedTag = document.createElement('span');
        selectedTag.className = 'selected-tag';
        selectedTag.innerHTML = `${tag} <i class="fas fa-times"></i>`;
        
        // Add click handler to remove tag
        selectedTag.addEventListener('click', () => {
            selectedTag.remove();
            this.filterTimeline();
        });

        this.selectedTags.appendChild(selectedTag);
        this.filterTimeline();
    }

    filterTimeline() {
        const selectedTags = Array.from(this.selectedTags.querySelectorAll('.selected-tag'))
            .map(tag => tag.textContent.trim());

        this.timelineItems.forEach(item => {
            const itemTags = Array.from(item.querySelectorAll('.timeline-tags .tag'))
                .map(tag => tag.textContent);

            if (selectedTags.length === 0 || selectedTags.some(tag => itemTags.includes(tag))) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Initialize navigation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
}); 