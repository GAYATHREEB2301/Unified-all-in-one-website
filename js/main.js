// Theme Management
const initTheme = () => {
    const savedTheme = localStorage.getItem('nexus_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    document.body.setAttribute('data-theme', theme);
    updateThemeAria(theme);
};

const updateThemeAria = (theme) => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
    }
};

// Apply theme as soon as possible
initTheme();

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('nexus_theme', newTheme);
            updateThemeAria(newTheme);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('nexus_theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            updateThemeAria(newTheme);
        }
    });

    // Hamburger Menu Logic
    const hamburger = document.getElementById('hamburgerToggle');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Dropdown Toggles
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.user-nav-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = dropdown.classList.toggle('active');
                toggle.setAttribute('aria-expanded', isActive);
            });
        }
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown').forEach(d => {
            d.classList.remove('active');
            const toggle = d.querySelector('.user-nav-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Keyboard support for closing dropdown
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d.classList.contains('active')) {
                    d.classList.remove('active');
                    const toggle = d.querySelector('.user-nav-toggle');
                    if (toggle) {
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.focus();
                    }
                }
            });
        }
    });

    // Login & Account Functionality
    const accountDropdown = document.getElementById('accountDropdown');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.querySelector('a[href*="logout"], .dropdown-item[role="menuitem"]:last-child');

    const updateUIForLoginState = () => {
        const isLoggedIn = localStorage.getItem('nexus_logged_in') === 'true';
        const userRole = localStorage.getItem('nexus_role') || 'Standard User';

        if (accountDropdown && loginBtn && signupBtn) {
            if (isLoggedIn) {
                accountDropdown.style.display = 'inline-block';
                const roleBadge = accountDropdown.querySelector('.user-role-badge');
                if (roleBadge) roleBadge.textContent = userRole.charAt(0).toUpperCase() + userRole.slice(1);

                loginBtn.style.display = 'none';
                signupBtn.style.display = 'none';
            } else {
                accountDropdown.style.display = 'none';
                loginBtn.style.display = 'inline-flex';
                signupBtn.style.display = 'inline-flex';
            }
        }
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('nexus_logged_in');
            updateUIForLoginState();
            window.location.href = loginBtn ? loginBtn.getAttribute('href') : '../auth/login.html';
        });
    }

    // Initial check
    updateUIForLoginState();

    // Attach to other dropdown items for feedback
    document.querySelectorAll('.dropdown-item:not([href*="logout"])').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.getAttribute('href') === '#') {
                e.preventDefault();
                const action = item.textContent.trim();
                alert(`${action} functionality coming soon in v4.1!`);
            }
        });
    });
});
