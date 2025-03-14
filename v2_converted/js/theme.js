class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'system';
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeDropdown = document.querySelector('.theme-dropdown');
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        this.init();
    }

    init() {
        // Set initial theme
        this.applyTheme(this.theme);

        // Add event listeners
        this.themeToggle.addEventListener('click', () => {
            this.themeDropdown.classList.toggle('show');
        });

        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const newTheme = option.dataset.theme;
                this.setTheme(newTheme);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.themeToggle.contains(e.target) && !this.themeDropdown.contains(e.target)) {
                this.themeDropdown.classList.remove('show');
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.theme === 'system') {
                this.applyTheme('system');
            }
        });
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        this.themeDropdown.classList.remove('show');
    }

    applyTheme(theme) {
        const root = document.documentElement;
        root.removeAttribute('data-theme');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        } else {
            root.setAttribute('data-theme', theme);
        }

        // Update theme toggle icons
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        const paletteIcon = document.querySelector('.palette-icon');

        sunIcon.style.transform = theme === 'light' ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0)';
        moonIcon.style.transform = theme === 'dark' ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)';
        paletteIcon.style.transform = theme === 'purple' ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)';
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 