
    
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if(window.innerWidth <= 768) {
                        navLinks.style.display = 'none';
                    }
                }
            });
        });

        // Form submission
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            // For this demo, we'll just show an alert
            alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
            
            // Reset form
            contactForm.reset();
        });

        // Skill bars animation on scroll
        const skillBars = document.querySelectorAll('.skill-level');
        
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease-in-out';
                    bar.style.width = width;
                }, 300);
            });
        };

        // Intersection Observer for skill bars
        const skillsSection = document.querySelector('.skills');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if(skillsSection) {
            observer.observe(skillsSection);
        }

        // Update copyright year
        document.querySelector('.copyright p').textContent = 
            `© ${new Date().getFullYear()} Alex Chen. All rights reserved.`;
    
// Dark Mode Toggle - Professional Implementation
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme on load
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
    } else {
        // Check system preference if no saved theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
            }
        }
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if(window.innerWidth <= 768) {
                    document.querySelector('.nav-links').style.display = 'none';
                }
            }
        });
    });
    
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--nav-bg)';
                navLinks.style.padding = '20px';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.borderBottom = '1px solid var(--border-light)';
            }
        });
    }
});
// SIMPLE DARK MODE TOGGLE - GUARANTEED TO WORK
document.addEventListener('DOMContentLoaded', function() {
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    }
    
    // Toggle function
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('light-mode')) {
                // Switch to dark
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                console.log('Switched to DARK mode'); // Check console
            } else {
                // Switch to light
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                console.log('Switched to LIGHT mode'); // Check console
            }
        });
    }
    
    // Force update backgrounds on all elements
    function forceDarkMode() {
        if (body.classList.contains('dark-mode')) {
            document.querySelectorAll('section, div, header, footer').forEach(el => {
                el.style.transition = 'background-color 0.3s';
            });
        }
    }
    
    // Call force update after toggle
    themeToggle.addEventListener('click', function() {
        setTimeout(forceDarkMode, 50);
    });
});