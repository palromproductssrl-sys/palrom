document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Header Scroll Effect & Mobile Menu
    // ==========================================
    const header = document.querySelector('.main-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileNavToggle.classList.toggle('active');
        
        // Animated hamburger transform
        const bars = mobileNavToggle.querySelectorAll('.bar');
        if (mobileNavToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileNavToggle.classList.remove('active');
            const bars = mobileNavToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // ==========================================
    // 2. Active Link Highlighting via Page Path & Scroll
    // ==========================================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Determine which page should be highlighted as active
    let activePage = currentPath;
    if (['dowels.html', 'four-sides-planed.html', 'profiles.html', 'specials.html'].includes(currentPath)) {
        activePage = 'products.html';
    } else if (currentPath === '' || currentPath === '/') {
        activePage = 'index.html';
    }

    function setPageActive() {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Extract page name from href (e.g. "about.html#contact" -> "about.html", "#contact" -> "")
            const linkPage = href.startsWith('#') ? 'index.html' : href.split('#')[0];
            
            if (linkPage === activePage && !href.startsWith('#')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setPageActive();

    // Scroll observer to highlight "Contact Us" when scrolled to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const contactObserverOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const contactLink = Array.from(navLinks).find(link => {
                    const href = link.getAttribute('href');
                    return href === '#contact' || href.endsWith('#contact');
                });
                
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    if (contactLink) contactLink.classList.add('active');
                } else {
                    if (contactLink) contactLink.classList.remove('active');
                    setPageActive();
                }
            });
        }, contactObserverOptions);
        contactObserver.observe(contactSection);
    }

    // ==========================================
    // 3. Product Catalogue Filter
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    // Show matching card
                    card.classList.remove('hidden');
                    // Trigger fade-in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide non-matching card
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    // Delay hiding from display to allow transition
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // Setup initial transition styles for cards
    productCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });

    // ==========================================
    // 4. Entrance Scroll Animations
    // ==========================================
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it's a timeline section, make sure items animate in sequence
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('visible');
                }
                scrollObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, scrollObserverOptions);

    scrollElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Special observer for timeline items explicitly
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        scrollObserver.observe(item);
    });

    // ==========================================
    // 5. Contact Form Handler (Simulated Submit)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.strip ? document.getElementById('name').value.strip() : document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const product = document.getElementById('product_type').value;
            const message = document.getElementById('message').value;

            // Simple check
            if (!name || !email || !product || !message) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            // Simulate server request
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Sending inquiry...';

            setTimeout(() => {
                // Success
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                const productMsg = product === 'careers' 
                    ? 'application has been received by our Human Resources department' 
                    : `inquiry regarding our "${product}" beechwood products has been sent to our Brad office`;
                
                showFeedback(`Thank you, ${name}! Your ${productMsg}. We will reply in 24 hours.`, 'success');
                contactForm.reset();
            }, 1800);
        });
    }

    function showFeedback(msg, type) {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 10 seconds, keep error
        if (type === 'success') {
            setTimeout(() => {
                formFeedback.className = 'form-feedback hidden';
            }, 10000);
        }
    }

    // ==========================================
    // 6. Cookie Consent popup Modal
    // ==========================================
    const cookieModal = document.getElementById('cookieModal');
    const denyCookies = document.getElementById('denyCookies');
    const allowCookies = document.getElementById('allowCookies');
    const openCookieSettings = document.getElementById('openCookieSettings');

    function checkCookieConsent() {
        const consent = localStorage.getItem('palrom_cookies_accepted');
        if (consent === null) {
            // Show modal after 1.5 seconds
            setTimeout(() => {
                cookieModal.classList.remove('hidden');
            }, 1500);
        }
    }

    if (allowCookies && denyCookies && cookieModal) {
        allowCookies.addEventListener('click', () => {
            localStorage.setItem('palrom_cookies_accepted', 'true');
            cookieModal.classList.add('hidden');
        });

        denyCookies.addEventListener('click', () => {
            localStorage.setItem('palrom_cookies_accepted', 'false');
            cookieModal.classList.add('hidden');
        });
    }

    if (openCookieSettings) {
        openCookieSettings.addEventListener('click', (e) => {
            e.preventDefault();
            cookieModal.classList.remove('hidden');
        });
    }

    // ==========================================
    // 7. Query Parameter Routing & Form Pre-selection
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    
    if (productParam) {
        const productSelect = document.getElementById('product_type');
        const contactSection = document.getElementById('contact');
        
        if (productSelect) {
            const validParams = ['dowels', 'planed', 'profiles', 'specials', 'careers'];
            if (validParams.includes(productParam)) {
                productSelect.value = productParam;
            }
        }
        
        if (contactSection) {
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }

    // ==========================================
    // 8. Job Application Form Handler & File Upload
    // ==========================================
    const applyForm = document.getElementById('applyForm');
    const cvDropzone = document.getElementById('cvDropzone');
    const cvInput = document.getElementById('cvFile');
    const fileInfo = document.getElementById('fileInfo');
    const fileNameSpan = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFile');
    const applyFeedback = document.getElementById('applyFeedback');

    // Job pre-selection via URL ?job=
    const jobParam = urlParams.get('job');
    if (jobParam) {
        const jobSelect = document.getElementById('apply_job_type');
        if (jobSelect) {
            const validJobs = {
                'planing': 'planing_operator',
                'quality': 'quality_inspector',
                'logistics': 'logistics_coordinator',
                'maintenance': 'maintenance_mechanic'
            };
            if (validJobs[jobParam]) {
                jobSelect.value = validJobs[jobParam];
            }
        }
    }

    if (cvDropzone && cvInput) {
        // Drag events
        ['dragenter', 'dragover'].forEach(eventName => {
            cvDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                cvDropzone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            cvDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                cvDropzone.classList.remove('dragover');
            }, false);
        });

        // Drop event
        cvDropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                cvInput.files = files;
                handleFileSelection(files[0]);
            }
        });

        // Click on dropzone to trigger file input
        cvDropzone.addEventListener('click', () => {
            cvInput.click();
        });

        // File input change
        cvInput.addEventListener('change', () => {
            if (cvInput.files.length > 0) {
                handleFileSelection(cvInput.files[0]);
            }
        });
    }

    function handleFileSelection(file) {
        // Validation: PDF, DOC, DOCX, maximum 5MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const maxSizeBytes = 5 * 1024 * 1024; // 5MB

        // Fallback check based on extension
        const ext = file.name.split('.').pop().toLowerCase();
        const isAllowedExt = ['pdf', 'doc', 'docx'].includes(ext);

        if (!allowedTypes.includes(file.type) && !isAllowedExt) {
            showApplyFeedback('Invalid file type. Please upload a PDF, DOC, or DOCX document.', 'error');
            clearFile();
            return;
        }

        if (file.size > maxSizeBytes) {
            showApplyFeedback('File size exceeds the 5MB limit.', 'error');
            clearFile();
            return;
        }

        // Show file details
        fileNameSpan.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        fileInfo.classList.remove('hidden');
        cvDropzone.classList.add('has-file');
        
        // Clear error class if any
        if (applyFeedback.classList.contains('error')) {
            applyFeedback.className = 'form-feedback hidden';
        }
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering dropzone click
            clearFile();
        });
    }

    function clearFile() {
        cvInput.value = '';
        fileInfo.classList.add('hidden');
        fileNameSpan.textContent = '';
        if (cvDropzone) {
            cvDropzone.classList.remove('has-file');
        }
    }

    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('apply_name').value.trim();
            const email = document.getElementById('apply_email').value;
            const phone = document.getElementById('apply_phone').value;
            const position = document.getElementById('apply_job_type').value;
            const message = document.getElementById('apply_message').value.trim();
            const fileSelected = cvInput.files.length > 0;

            if (!name || !email || !phone || !position || !message) {
                showApplyFeedback('Please fill out all required fields.', 'error');
                return;
            }

            if (!fileSelected) {
                showApplyFeedback('Please upload your CV / Resume to proceed.', 'error');
                return;
            }

            // Simulate submission
            const submitBtn = applyForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Submitting application...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                const jobNames = {
                    'planing_operator': 'Planing Machine Operator',
                    'quality_inspector': 'Quality & Defect Inspector',
                    'logistics_coordinator': 'Logistics & Inventory Coordinator',
                    'maintenance_mechanic': 'Maintenance Mechanic / Millwright'
                };
                const formattedJobName = jobNames[position] || position;
                const fileName = cvInput.files[0].name;

                showApplyFeedback(
                    `Thank you, ${name}! Your application for the "${formattedJobName}" position and your resume (${fileName}) have been successfully received by Anca Mihuț. We will review it and contact you at ${email} or ${phone} within 2 days.`, 
                    'success'
                );

                applyForm.reset();
                clearFile();
            }, 1800);
        });
    }

    function showApplyFeedback(msg, type) {
        applyFeedback.textContent = msg;
        applyFeedback.className = `form-feedback ${type}`;
        applyFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        if (type === 'success') {
            setTimeout(() => {
                applyFeedback.className = 'form-feedback hidden';
            }, 15000);
        }
    }

    checkCookieConsent();
});
