class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'system';
        this.themeToggles = document.querySelectorAll('.theme-toggle');
        this.themeDropdowns = document.querySelectorAll('.theme-dropdown');
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        this.init();
    }

    init() {
        // Apply the saved theme on page load
        this.applyTheme(this.theme);
        
        // Toggle dropdowns
        this.themeToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = toggle.nextElementSibling;
                
                // Close all other dropdowns first
                this.themeDropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('show');
                    }
                });
                
                // Toggle the clicked dropdown
                dropdown.classList.toggle('show');
            });
        });

        // Handle theme selection
        this.themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const newTheme = option.dataset.theme;
                this.setTheme(newTheme);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.themeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        });

        // Handle system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.theme === 'system') {
                this.applyTheme('system');
            }
        });
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        
        // Close all dropdowns
        this.themeDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    applyTheme(theme) {
        const root = document.documentElement;
        
        // Remove any existing theme
        root.removeAttribute('data-theme');

        if (theme === 'system') {
            // Apply system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        } else {
            // Apply selected theme
            root.setAttribute('data-theme', theme);
        }

        // Update all theme toggle icons
        const sunIcons = document.querySelectorAll('.sun-icon');
        const moonIcons = document.querySelectorAll('.moon-icon');
        const paletteIcons = document.querySelectorAll('.palette-icon');

        let effectiveTheme = theme;
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        sunIcons.forEach(icon => {
            icon.style.opacity = effectiveTheme === 'light' ? '1' : '0';
            icon.style.transform = effectiveTheme === 'light' ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0)';
        });

        moonIcons.forEach(icon => {
            icon.style.opacity = effectiveTheme === 'dark' ? '1' : '0';
            icon.style.transform = effectiveTheme === 'dark' ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)';
        });

        paletteIcons.forEach(icon => {
            icon.style.opacity = effectiveTheme === 'purple' ? '1' : '0';
            icon.style.transform = effectiveTheme === 'purple' ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)';
        });
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 