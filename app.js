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
            const name = document.getElementById('name').value.trim ? document.getElementById('name').value.trim() : document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const product = document.getElementById('product_type').value;
            const message = document.getElementById('message').value;
            const isNl = document.documentElement.lang === 'nl';

            // Simple check
            if (!name || !email || !product || !message) {
                const errorMsg = isNl ? 'Vul alstublieft alle verplichte velden in.' : 'Please fill out all required fields.';
                showFeedback(errorMsg, 'error');
                return;
            }

            // Simulate server request
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            const sendingText = isNl 
                ? '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Verzenden...' 
                : '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Sending inquiry...';
            submitBtn.innerHTML = sendingText;

            setTimeout(() => {
                // Success
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                let feedbackMsg = '';
                if (isNl) {
                    const productMsg = product === 'careers'
                        ? 'sollicitatie is ontvangen door onze afdeling Personeelszaken (HR)'
                        : `aanvraag voor onze "${product}" beukenhouten producten is verzonden naar ons kantoor in Brad`;
                    feedbackMsg = `Bedankt, ${name}! Uw ${productMsg}. We reageren binnen 24 uur.`;
                } else {
                    const productMsg = product === 'careers' 
                        ? 'application has been received by our Human Resources department' 
                        : `inquiry regarding our "${product}" beechwood products has been sent to our Brad office`;
                    feedbackMsg = `Thank you, ${name}! Your ${productMsg}. We will reply in 24 hours.`;
                }
                
                showFeedback(feedbackMsg, 'success');
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

    // ==========================================
    // 9. Floating Contact Widget Toggle
    // ==========================================
    const floatingContact = document.getElementById('floatingContact');
    if (floatingContact) {
        const toggleBtn = floatingContact.querySelector('.widget-toggle-btn');
        const iconOpen = floatingContact.querySelector('.toggle-icon-open');
        const iconClose = floatingContact.querySelector('.toggle-icon-close');
        const menuItems = floatingContact.querySelectorAll('.widget-item');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingContact.classList.toggle('active');
            
            if (floatingContact.classList.contains('active')) {
                iconOpen.classList.add('hidden');
                iconClose.classList.remove('hidden');
            } else {
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            }
        });

        // Close menu when clicking any item
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                floatingContact.classList.remove('active');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!floatingContact.contains(e.target)) {
                floatingContact.classList.remove('active');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // 10. Interactive Quote Request Cart
    // ==========================================
    let cart = [];

    // Load cart from localStorage
    function loadCart() {
        const storedCart = localStorage.getItem('palrom_quote_cart');
        if (storedCart) {
            try {
                cart = JSON.parse(storedCart);
            } catch (e) {
                cart = [];
            }
        }
        updateBadge();
        renderCart();
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('palrom_quote_cart', JSON.stringify(cart));
        updateBadge();
    }

    // Update cart badge count
    function updateBadge() {
        const badge = document.getElementById('cartCountBadge');
        if (badge) {
            badge.textContent = cart.length;
            if (cart.length > 0) {
                badge.classList.add('visible');
            } else {
                badge.classList.remove('visible');
            }
        }
    }

    // Render cart items in the sidebar
    function renderCart() {
        const container = document.getElementById('cartItemsContainer');
        const formSection = document.getElementById('cartFormSection');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-message">
                    <p>Your inquiry list is empty. Add products to request a quote.</p>
                    <a href="products.html" class="cart-empty-action-btn">
                        Go to Products <i class="fa-solid fa-arrow-right icon-right"></i>
                    </a>
                </div>
            `;
            if (formSection) formSection.classList.add('hidden');
            return;
        }

        if (formSection) formSection.classList.remove('hidden');

        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-header">
                    <div>
                        <span class="cart-item-category">${item.category}</span>
                        <h4 class="cart-item-name">${item.name}</h4>
                    </div>
                    <button class="cart-item-remove" data-index="${index}" aria-label="Remove Item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="cart-item-specs">
                    <div class="cart-spec-row">
                        <div class="cart-spec-group">
                            <label>Quantity</label>
                            <input type="number" class="cart-spec-qty" data-index="${index}" value="${item.qty}" min="1">
                        </div>
                        <div class="cart-spec-group">
                            <label>Wood Grade</label>
                            <select class="cart-spec-grade" data-index="${index}">
                                <option value="grade_a" ${item.grade === 'grade_a' ? 'selected' : ''}>Class A (Clear)</option>
                                <option value="grade_b" ${item.grade === 'grade_b' ? 'selected' : ''}>Class B (Cabinet)</option>
                                <option value="grade_ab" ${item.grade === 'grade_ab' ? 'selected' : ''}>Class A/B Mixed</option>
                            </select>
                        </div>
                    </div>
                    <div class="cart-spec-group">
                        <label>Dimensions / Special Instructions</label>
                        <input type="text" class="cart-spec-dims" data-index="${index}" value="${item.dims || ''}" placeholder="e.g. Ø 12mm x 1000m, custom specs...">
                    </div>
                </div>
            </div>
        `).join('');

        // Attach event listeners to cart items
        container.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                removeFromCart(idx);
            });
        });

        container.querySelectorAll('.cart-spec-qty').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                let val = parseInt(input.value);
                if (isNaN(val) || val < 1) val = 1;
                input.value = val;
                cart[idx].qty = val;
                saveCart();
            });
        });

        container.querySelectorAll('.cart-spec-grade').forEach(select => {
            select.addEventListener('change', (e) => {
                const idx = parseInt(select.getAttribute('data-index'));
                cart[idx].grade = select.value;
                saveCart();
            });
        });

        container.querySelectorAll('.cart-spec-dims').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                cart[idx].dims = input.value;
                saveCart();
            });
        });
    }

    // Add to cart
    function addToCart(id, name, category) {
        const exists = cart.find(item => item.id === id);
        if (exists) {
            exists.qty += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                category: category,
                qty: 1,
                grade: 'grade_a',
                dims: ''
            });
        }
        saveCart();
        renderCart();
        openSidebar();
        
        // Visual badge pulse effect
        const badge = document.getElementById('cartCountBadge');
        if (badge) {
            badge.classList.remove('pulse-animation');
            void badge.offsetWidth; // Trigger reflow to restart animation
            badge.classList.add('pulse-animation');
        }
    }

    // Remove from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    // Sidebar DOM Elements & Event Listeners
    const quoteSidebar = document.getElementById('quoteSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const globalCartToggle = document.getElementById('globalCartToggle');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

    function openSidebar() {
        if (quoteSidebar && sidebarOverlay) {
            quoteSidebar.classList.add('open');
            sidebarOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Disable page scrolling
        }
    }

    function closeSidebar() {
        if (quoteSidebar && sidebarOverlay) {
            quoteSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('visible');
            document.body.style.overflow = ''; // Restore page scrolling
        }
    }

    if (globalCartToggle) {
        globalCartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            openSidebar();
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Event delegation for "Add to Inquiry" buttons
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('add-to-inquiry-btn')) {
            e.preventDefault();
            const btn = e.target;
            const id = btn.getAttribute('data-product-id');
            const name = btn.getAttribute('data-product-name');
            const category = btn.getAttribute('data-product-category');
            addToCart(id, name, category);
        }
    });

    // Cart Submit Form Intercept
    const cartSubmitForm = document.getElementById('cartSubmitForm');
    if (cartSubmitForm) {
        cartSubmitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('cart_name').value.trim();
            const email = document.getElementById('cart_email').value;
            const phone = document.getElementById('cart_phone').value;
            const notes = document.getElementById('cart_message').value.trim();
            const isNl = document.documentElement.lang === 'nl';

            if (!name || !email || !phone) {
                const errorMsg = isNl 
                    ? 'Vul alstublieft alle verplichte contactvelden in.' 
                    : 'Please fill out all required contact fields.';
                alert(errorMsg);
                return;
            }

            // Simulate submission
            const submitBtn = cartSubmitForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            const submittingText = isNl 
                ? '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Verzenden...' 
                : '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Submitting...';
            submitBtn.innerHTML = submittingText;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Format item list for success message
                const itemsList = cart.map(item => {
                    const gradeNames = isNl ? {
                        'grade_a': 'Klasse A (Foutvrij)',
                        'grade_b': 'Klasse B (Meubelhout)',
                        'grade_ab': 'Klasse A/B Mix'
                    } : {
                        'grade_a': 'Class A (Clear)',
                        'grade_b': 'Class B (Cabinet)',
                        'grade_ab': 'Class A/B Mixed'
                    };
                    const gradeName = gradeNames[item.grade] || item.grade;
                    const dimDesc = item.dims ? ` [Maat: ${item.dims}]` : '';
                    return `- ${item.name} (${item.qty}x, ${gradeName}${dimDesc})`;
                }).join('\n');

                const alertMsg = isNl 
                    ? `Bedankt, ${name}! Uw offerteaanvraag voor de volgende product(en) is succesvol ontvangen door ons hoofdkantoor in Brad:\n\n${itemsList}\n\nWe zullen gedetailleerde specificaties en prijsopgaven voorbereiden en u binnen 24 uur e-mailen op ${email}.`
                    : `Thank you, ${name}! Your inquiry for the following product(s) has been successfully received by our Brad headquarters:\n\n${itemsList}\n\nWe will prepare detailed sizing sheets and pricing estimates and email you at ${email} within 24 hours.`;
                alert(alertMsg);

                // Clear cart state
                cart = [];
                saveCart();
                renderCart();
                closeSidebar();
                cartSubmitForm.reset();
            }, 2000);
        });
    }

    // ==========================================
    // 10. B2B Product Configurator Dashboard Logic
    // ==========================================
    const b2bConfigForm = document.getElementById('palromB2bConfiguratorForm');
    if (b2bConfigForm && document.getElementById('dbCategory')) {
        const dbCategory = document.getElementById('dbCategory');
        const dbOplage = document.getElementById('dbOplage');
        const dbLength = document.getElementById('dbLength');
        const dbDiameter = document.getElementById('dbDiameter');
        const dbThickness = document.getElementById('dbThickness');
        
        const dbLengthVal = document.getElementById('dbLengthVal');
        const dbDiameterVal = document.getElementById('dbDiameterVal');
        const dbThicknessVal = document.getElementById('dbThicknessVal');
        
        const lblLength = document.getElementById('lblLength');
        const lblDiameter = document.getElementById('lblDiameter');
        const lblThickness = document.getElementById('lblThickness');
        const controlGroupThickness = document.getElementById('controlGroupThickness');
        const subCategorySpecialsRadios = document.getElementsByName('subCategorySpecials');
        const controlGroupSubCategorySpecials = document.getElementById('controlGroupSubCategorySpecials');
        
        const summaryProduct = document.getElementById('summaryProduct');
        const summaryDimensions = document.getElementById('summaryDimensions');
        const summaryOplage = document.getElementById('summaryOplage');
        const summaryFinish = document.getElementById('summaryFinish');
        
        const summaryUnitPrice = document.getElementById('summaryUnitPrice');
        const summaryDiscount = document.getElementById('summaryDiscount');
        const summaryTotalPrice = document.getElementById('summaryTotalPrice');
        const configuredCumulativeTotal = document.getElementById('configuredCumulativeTotal');
        const successTotalPrice = document.getElementById('successTotalPrice');
        
        const contactModal = document.getElementById('dashboardContactModal');
        const closeContactModal = document.getElementById('closeContactModal');
        const modalForm = document.getElementById('dashboardSubmitForm');
        
        const successOverlay = document.getElementById('configuratorSuccessOverlay');
        const successTicket = document.getElementById('successTicketNum');
        const successFinalInquiryList = document.getElementById('successFinalInquiryList');
        const successCompany = document.getElementById('successCompanyName');
        
        const restartBtn = document.getElementById('successRestartBtn');
        const downloadPdfBtn = document.getElementById('successDownloadPdf');

        // New DOM variables for combine request flow
        const combineRequestModal = document.getElementById('combineRequestModal');
        const closeCombineModal = document.getElementById('closeCombineModal');
        const btnConfigureAnother = document.getElementById('btnConfigureAnother');
        const btnFinishAndSubmit = document.getElementById('btnFinishAndSubmit');
        const controlGroupAddedItems = document.getElementById('controlGroupAddedItems');
        const configuredItemsList = document.getElementById('configuredItemsList');
        
        let configuredItems = [];

        // Helper: Format numbers as Euros with thousands separators
        function formatEuro(val, decimals = 2) {
            return new Intl.NumberFormat('nl-NL', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(val);
        }

        // B2B Configurator Sizing Rules
        const categoryData = {
            pluggen: {
                name: "Beuken Pluggen",
                length: { min: 30, max: 3000, default: 500, label: "Lengte (mm)" },
                diameter: { min: 3, max: 60, default: 20, label: "Diameter (mm)" },
                finish: "Industrieel geschuurd"
            },
            dowels: {
                name: "Beukenhouten Dowels & Staven",
                length: { min: 30, max: 3000, default: 1000, label: "Lengte (mm)" },
                diameter: { min: 3, max: 60, default: 10, label: "Diameter (mm)" },
                finish: "Gladgeschaafd"
            },
            planed: {
                name: "4-Zijdig Geschaafd Beukenhout",
                length: { min: 100, max: 4000, default: 2400, label: "Lengte (mm)" },
                diameter: { min: 15, max: 300, default: 50, label: "Breedte (mm)" },
                thickness: { min: 10, max: 100, default: 20, label: "Dikte/Hoogte (mm)" },
                finish: "Vierzijdig geschaafd"
            },
            profiles: {
                name: "Houten Profielen & Lijsten",
                length: { min: 500, max: 3000, default: 2000, label: "Lengte (mm)" },
                diameter: { min: 10, max: 120, default: 18, label: "Afmeting (mm)" },
                finish: "Geprofileerd"
            },
            specials: {
                name: "Speciale Houtcomponenten",
                length: { min: 50, max: 2000, default: 500, label: "Lengte (mm)" },
                diameter: { min: 5, max: 500, default: 40, label: "Breedte (mm)" },
                finish: "Op specificatie"
            }
        };

        // Pricing logic function
        function calculatePriceDetails(cat, length, width_or_diameter, thickness, qty_num, specials_subcat) {
            let unitPrice = 0.0;
            
            if (cat === 'pluggen' || cat === 'dowels') {
                // Base price: €0.03 for a standard 40mm x 8mm dowel
                const baseLength = 40.0;
                const baseDiameter = 8.0;
                const basePrice = 0.03;
                
                const lengthFactor = length / baseLength;
                const diameterFactor = (width_or_diameter / baseDiameter) ** 2;
                
                unitPrice = basePrice * lengthFactor * diameterFactor;
                if (unitPrice < 0.01) unitPrice = 0.01;
            } else if (cat === 'planed') {
                // Volume in dm3
                const volumeDm3 = (length * width_or_diameter * thickness) / 1000000.0;
                unitPrice = 1.65 * volumeDm3;
                if (unitPrice < 0.25) unitPrice = 0.25;
            } else if (cat === 'profiles') {
                const lengthM = length / 1000.0;
                const widthFactor = width_or_diameter / 50.0;
                unitPrice = 0.95 * lengthM * widthFactor;
                if (unitPrice < 0.20) unitPrice = 0.20;
            } else if (cat === 'specials') {
                const specialsPrices = {
                    'Keeplat Spruce': 1.25,
                    'Keeplat Beech': 1.55,
                    'Distancers Color Mix': 0.85,
                    'Wooden Threshold': 3.55,
                    'Wood Threshold': 3.55,
                    'Industrial Distancer': 2.15,
                    'Wood with Iron': 4.85,
                    'Wood with Iron Component': 4.85
                };
                let cleanSub = 'Keeplat Spruce';
                for (const k in specialsPrices) {
                    if (specials_subcat.includes(k)) {
                        cleanSub = k;
                        break;
                    }
                }
                const basePrice = specialsPrices[cleanSub] || 1.25;
                const lengthFactor = length / 500.0;
                unitPrice = basePrice * lengthFactor;
                if (unitPrice < 0.35) unitPrice = 0.35;
            }
            
            let discountPercent = 0;
            if (qty_num >= 100000) {
                discountPercent = 15;
            } else if (qty_num >= 50000) {
                discountPercent = 10;
            } else if (qty_num >= 10000) {
                discountPercent = 5;
            }
            
            const discountFactor = (100 - discountPercent) / 100.0;
            const discountedUnitPrice = unitPrice * discountFactor;
            const totalPrice = discountedUnitPrice * qty_num;
            
            return {
                unitPrice: unitPrice,
                discountPercent: discountPercent,
                discountedUnitPrice: discountedUnitPrice,
                totalPrice: totalPrice
            };
        }

        // Update values in summary table
        function updateSummary() {
            const cat = dbCategory.value;
            const data = categoryData[cat];
            let specialsSubcat = "";
            
            if (cat === 'specials' && subCategorySpecialsRadios.length > 0) {
                let subCatText = "Keeplat Spruce";
                for (const radio of subCategorySpecialsRadios) {
                    if (radio.checked) {
                        const labelSpan = radio.parentElement.querySelector('.card-label');
                        if (labelSpan) {
                            subCatText = labelSpan.textContent;
                        }
                        break;
                    }
                }
                summaryProduct.textContent = `${data.name} - ${subCatText}`;
                specialsSubcat = subCatText;
            } else {
                summaryProduct.textContent = data.name;
            }
            
            // Format dimensions summary based on category data properties
            if (cat === 'planed') {
                summaryDimensions.textContent = `${dbThickness.value}mm x ${dbDiameter.value}mm x ${dbLength.value}mm`;
            } else {
                summaryDimensions.textContent = `${dbLength.value}mm x ${dbDiameter.value}mm`;
            }
            
            summaryOplage.textContent = dbOplage.options[dbOplage.selectedIndex].text;
            summaryFinish.textContent = data.finish;
            
            dbLengthVal.textContent = dbLength.value;
            dbDiameterVal.textContent = dbDiameter.value;
            dbThicknessVal.textContent = dbThickness.value;

            // Price Calculations
            const length = parseFloat(dbLength.value);
            const width_or_diameter = parseFloat(dbDiameter.value);
            const thickness = parseFloat(dbThickness.value);
            const qty_num = parseInt(dbOplage.value);

            const priceDetails = calculatePriceDetails(cat, length, width_or_diameter, thickness, qty_num, specialsSubcat);

            if (summaryUnitPrice) summaryUnitPrice.textContent = `€ ${formatEuro(priceDetails.unitPrice, 4)}`;
            if (summaryDiscount) {
                if (priceDetails.discountPercent > 0) {
                    summaryDiscount.innerHTML = `<span class="discount-badge" style="background: rgba(231,177,36,0.15); color: var(--color-primary-dark); padding: 0.15rem 0.45rem; border-radius: var(--border-radius-sm); font-weight: 600;">${priceDetails.discountPercent}% B2B Staffelkorting</span>`;
                } else {
                    summaryDiscount.textContent = `Geen (min. 10.000 voor 5%)`;
                }
            }
            if (summaryTotalPrice) summaryTotalPrice.textContent = `€ ${formatEuro(priceDetails.totalPrice)}`;
        }

        // Adjust limits when category changes
        function handleCategoryChange() {
            const cat = dbCategory.value;
            const data = categoryData[cat];
            
            // Length Slider
            dbLength.min = data.length.min;
            dbLength.max = data.length.max;
            dbLength.value = data.length.default;
            lblLength.textContent = data.length.label;
            
            // Diameter/Width Slider
            dbDiameter.min = data.diameter.min;
            dbDiameter.max = data.diameter.max;
            dbDiameter.value = data.diameter.default;
            lblDiameter.textContent = data.diameter.label;
            
            // Conditional Thickness Slider for 4-sided planed beechwood
            if (data.thickness) {
                controlGroupThickness.classList.remove('hidden');
                dbThickness.min = data.thickness.min;
                dbThickness.max = data.thickness.max;
                dbThickness.value = data.thickness.default;
                lblThickness.textContent = data.thickness.label;
            } else {
                controlGroupThickness.classList.add('hidden');
            }
            
            // Toggle Specials Subcategory Dropdown
            if (cat === 'specials' && controlGroupSubCategorySpecials) {
                controlGroupSubCategorySpecials.classList.remove('hidden');
            } else if (controlGroupSubCategorySpecials) {
                controlGroupSubCategorySpecials.classList.add('hidden');
            }
            
            updateSummary();
        }

        dbCategory.addEventListener('change', handleCategoryChange);
        if (subCategorySpecialsRadios.length > 0) {
            subCategorySpecialsRadios.forEach(radio => {
                radio.addEventListener('change', updateSummary);
            });
        }
        dbOplage.addEventListener('change', updateSummary);
        
        dbLength.addEventListener('input', updateSummary);
        dbDiameter.addEventListener('input', updateSummary);
        dbThickness.addEventListener('input', updateSummary);

        // Helper: Get current form configuration details
        function getCurrentConfiguration() {
            const cat = dbCategory.value;
            const data = categoryData[cat];
            
            let finalName = data.name;
            if (cat === 'specials' && subCategorySpecialsRadios.length > 0) {
                let subCatText = "Keeplat Spruce";
                for (const radio of subCategorySpecialsRadios) {
                    if (radio.checked) {
                        const labelSpan = radio.parentElement.querySelector('.card-label');
                        if (labelSpan) {
                            subCatText = labelSpan.textContent;
                        }
                        break;
                    }
                }
                finalName = `${data.name} - ${subCatText}`;
            }
            
            let dimensions = '';
            if (cat === 'planed') {
                dimensions = `${dbThickness.value}mm x ${dbDiameter.value}mm x ${dbLength.value}mm`;
            } else {
                dimensions = `${dbLength.value}mm x ${dbDiameter.value}mm`;
            }
            
            const qty = dbOplage.options[dbOplage.selectedIndex].text;
            const qty_num = parseInt(dbOplage.value);
            const finish = data.finish;
            
            const length = parseFloat(dbLength.value);
            const width_or_diameter = parseFloat(dbDiameter.value);
            const thickness = parseFloat(dbThickness.value);
            
            const priceDetails = calculatePriceDetails(cat, length, width_or_diameter, thickness, qty_num, finalName);
            
            return {
                productName: finalName,
                dimensions: dimensions,
                qty: qty,
                qty_num: qty_num,
                finish: finish,
                price: priceDetails.totalPrice,
                unitPrice: priceDetails.unitPrice,
                discountPercent: priceDetails.discountPercent
            };
        }

        // Helper: Render added items list in configurator
        function renderAddedItems() {
            if (configuredItems.length === 0) {
                controlGroupAddedItems.classList.add('hidden');
                configuredItemsList.innerHTML = '';
                return;
            }
            
            controlGroupAddedItems.classList.remove('hidden');
            configuredItemsList.innerHTML = configuredItems.map((item, index) => {
                const formattedPrice = formatEuro(item.price);
                return `
                <div class="configured-item-row">
                    <div>
                        <span class="item-info">${item.productName}</span>
                        <span class="item-specs">(${item.dimensions} | ${item.finish} | ${item.qty} | € ${formattedPrice})</span>
                    </div>
                    <button type="button" class="remove-item-btn" data-index="${index}" aria-label="Verwijder product">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                `;
            }).join('');
            
            // Calculate cumulative total price
            let cumulativeTotal = 0;
            configuredItems.forEach(item => {
                cumulativeTotal += item.price;
            });
            if (configuredCumulativeTotal) {
                configuredCumulativeTotal.textContent = `€ ${formatEuro(cumulativeTotal)}`;
            }
            
            // Add click handlers for delete buttons
            configuredItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.getAttribute('data-index'));
                    configuredItems.splice(idx, 1);
                    renderAddedItems();
                });
            });
        }

        // Submit form opens B2B combine request modal
        b2bConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            combineRequestModal.classList.remove('hidden');
        });

        // Close combine modal
        if (closeCombineModal) {
            closeCombineModal.addEventListener('click', () => {
                combineRequestModal.classList.add('hidden');
            });
        }
        
        combineRequestModal.addEventListener('click', (e) => {
            if (e.target === combineRequestModal) {
                combineRequestModal.classList.add('hidden');
            }
        });

        // Add configuration and reset for another
        if (btnConfigureAnother) {
            btnConfigureAnother.addEventListener('click', () => {
                const currentItem = getCurrentConfiguration();
                configuredItems.push(currentItem);
                renderAddedItems();
                
                b2bConfigForm.reset();
                handleCategoryChange();
                
                combineRequestModal.classList.add('hidden');
            });
        }

        // Add configuration and open contact details form
        if (btnFinishAndSubmit) {
            btnFinishAndSubmit.addEventListener('click', () => {
                const currentItem = getCurrentConfiguration();
                configuredItems.push(currentItem);
                renderAddedItems();
                
                combineRequestModal.classList.add('hidden');
                contactModal.classList.remove('hidden');
            });
        }

        // Close modal
        closeContactModal.addEventListener('click', () => {
            contactModal.classList.add('hidden');
        });
 
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.add('hidden');
            }
        });
 
        // Handle B2B Inquiry Submission
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('dbName').value.trim();
            const company = document.getElementById('dbCompany').value.trim();
            const email = document.getElementById('dbEmail').value.trim();
            const phone = document.getElementById('dbPhone').value.trim();
            
            if (!name || !company || !email || !phone) {
                alert('Vul a.u.b. alle verplichte contactvelden in.');
                return;
            }
 
            const submitBtn = modalForm.querySelector('.dashboard-modal-submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Verwerken...';
 
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                contactModal.classList.add('hidden');
                
                const randomTicket = 'PLR-2026-' + Math.floor(10000 + Math.random() * 90000);
                successTicket.textContent = randomTicket;
                
                // Set company details
                successCompany.textContent = company;
                
                // Render consolidated list of items
                if (successFinalInquiryList) {
                    successFinalInquiryList.innerHTML = configuredItems.map(item => {
                        const formattedPrice = formatEuro(item.price);
                        return `
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${item.productName}</strong><br>
                                <span style="font-size: 0.85rem; opacity: 0.85;">Dimensions: ${item.dimensions} | Finish: ${item.finish} | Aantal: ${item.qty}</span>
                            </div>
                            <strong style="white-space: nowrap; color: var(--color-primary);">€ ${formattedPrice}</strong>
                        </li>
                        `;
                    }).join('');
                }
                
                // Set final total price
                let finalTotal = 0;
                configuredItems.forEach(item => {
                    finalTotal += item.price;
                });
                if (successTotalPrice) {
                    successTotalPrice.textContent = `€ ${formatEuro(finalTotal)}`;
                }
                
                successOverlay.classList.remove('hidden');
                window.scrollTo({ top: b2bConfigForm.offsetTop - 120, behavior: 'smooth' });
            }, 1200);
        });
 
        // Reset Configurator
        restartBtn.addEventListener('click', () => {
            configuredItems = [];
            renderAddedItems();
            b2bConfigForm.reset();
            modalForm.reset();
            handleCategoryChange();
            successOverlay.classList.add('hidden');
        });

        // Simulated PDF Download
        downloadPdfBtn.addEventListener('click', () => {
            alert('Uw specificatiesheet (PDF) is klaargemaakt voor download en naar uw e-mailadres verzonden!');
        });

        // Initialize values
        handleCategoryChange();
    }

    // Initialize cart state
    loadCart();

    checkCookieConsent();

    // ==========================================
    // 11. News Details Modal Logic
    // ==========================================
    const newsArticles = {
        drying: {
            title: "Expansion of Kiln Drying Capacity in Brad",
            category: "Production",
            categoryClass: "",
            date: "May 24, 2026",
            author: "PALROM Operations",
            image: "images/kilns_news.jpg",
            content: `
                <p>To meet rising international demand for high-quality FSC-certified beechwood, we have commissioned two new fully-automated drying chambers at our Brad facility. This expansion increases our total kiln drying capacity by 15%.</p>
                <p>Our state-of-the-art drying kilns use advanced computerized climate control systems to slowly reduce beechwood moisture levels to a precise 8-12%. This slow, controlled process prevents structural tension, surface cracking, and discoloration, ensuring maximum stability for high-end furniture and industrial components.</p>
                <p>The two new chambers add an extra 400 cubic meters of active drying volume, allowing us to accelerate order fulfillment times for our B2B partners across Europe while maintaining our strict quality controls. This investment represents our ongoing commitment to technical excellence and capacity growth in sustainable hardwood processing.</p>
            `,
            ctaText: "Read our history",
            ctaHref: "about.html#timeline-details"
        },
        fsc: {
            title: "FSC® Chain of Custody Recertified",
            category: "Sustainability",
            categoryClass: "",
            date: "April 12, 2026",
            author: "PALROM Forestry Team",
            image: "images/hero_bg.jpg",
            content: `
                <p>Following a comprehensive audit, our 100% FSC® certification for sustainable forest management and processing has been successfully renewed. We guarantee the responsible sourcing of all our beechwood products.</p>
                <p>Sustainability is at the core of PALROM Products SRL. Our Chain of Custody (CoC) certification ensures that every log entering our sawmill can be traced back to responsibly managed, FSC®-certified forests in the Carpathian region.</p>
                <p>The comprehensive audit evaluated our raw timber purchasing logs, physical sorting lines, production tracing systems, and export documentation. By achieving a perfect compliance score, we reaffirm our commitment to protecting biodiversity, supporting local forestry communities, and providing our B2B customers with 100% certified sustainable beech components that meet the highest environmental standards.</p>
            `,
            ctaText: "Explore our products",
            ctaHref: "products.html"
        },
        configurator: {
            title: "Help Ons Testen: De Palrom Offerte Configurator is Live!",
            category: "Digitale Bèta",
            categoryClass: "highlight-tag",
            date: "15 juni 2026",
            author: "IT & Sales Team",
            image: "images/config_dowels.png",
            content: `
                <p>We introduceren met trots de eerste bèta-versie van onze nieuwe B2B-productconfigurator: de <strong>Palrom Offerte Configurator</strong>. Met deze online tool kunnen inkopers en houtspecialisten direct de exacte millimeter-afmetingen, productgroepen (zoals houten staven, geschaafd hout en profielen) en gewenste afwerkingen invoeren voor grote volumebestellingen.</p>
                <p>Met de introductie van deze digitale tool zetten we een grote stap in het optimaliseren van onze B2B-dienstverlening. In plaats van handmatige e-mailuitwisselingen over afmetingen en toleranties, kunnen onze partners nu in drie eenvoudige stappen hun gewenste productgroepen configureren. De tool berekent live volumes, toont live sliders voor dikte, breedte en lengte, en biedt een interactieve selectie van speciale houtproducten.</p>
                <p>We nodigen al onze partners en B2B-klanten uit om deze configurator te testen en hun feedback te delen. Dit helpt ons de workflows te optimaliseren en de definitieve release perfect af te stemmen op uw inkoopbehoeften.</p>
            `,
            ctaText: "Start de Palrom Offerte Configurator",
            ctaHref: "configurator.html"
        }
    };

    const newsCards = document.querySelectorAll('.news-card');
    const newsModal = document.getElementById('newsModal');
    
    if (newsModal && newsCards.length > 0) {
        const closeNewsModal = document.getElementById('closeNewsModal');
        const modalOverlay = newsModal.querySelector('.news-modal-overlay');
        
        const modalImg = document.getElementById('modalNewsImg');
        const modalTag = document.getElementById('modalNewsTag');
        const modalDate = document.getElementById('modalNewsDate');
        const modalAuthor = document.getElementById('modalNewsAuthor');
        const modalTitle = document.getElementById('modalNewsTitle');
        const modalContent = document.getElementById('modalNewsContent');
        const modalCTA = document.getElementById('modalNewsCTA');
        
        newsCards.forEach(card => {
            card.style.cursor = 'pointer';
            
            card.addEventListener('click', (e) => {
                // If user clicked directly on a link/button inside the card, let the link action proceed
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                
                const articleId = card.getAttribute('data-article');
                const article = newsArticles[articleId];
                if (!article) return;
                
                // Populate modal
                modalImg.src = article.image;
                modalImg.alt = article.title;
                modalTag.textContent = article.category;
                
                modalTag.className = 'news-tag';
                if (article.categoryClass) {
                    modalTag.classList.add(article.categoryClass);
                }
                
                modalDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${article.date}`;
                modalAuthor.innerHTML = `<i class="fa-regular fa-user"></i> ${article.author}`;
                modalTitle.textContent = article.title;
                modalContent.innerHTML = article.content;
                
                modalCTA.textContent = article.ctaText;
                modalCTA.href = article.ctaHref;
                
                // Show modal
                newsModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent background scrolling
            });
        });
        
        const hideModal = () => {
            newsModal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (closeNewsModal) closeNewsModal.addEventListener('click', hideModal);
        if (modalOverlay) modalOverlay.addEventListener('click', hideModal);
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && newsModal.classList.contains('active')) {
                hideModal();
            }
        });
    }

    // ==========================================
    // 12. Password Gate Logic for configurator.html
    // ==========================================
    const authGate = document.getElementById('configuratorAuthGate');
    if (authGate) {
        const authForm = document.getElementById('authGateForm');
        const authPass = document.getElementById('authPassword');
        const authError = document.getElementById('authErrorMessage');
        const togglePassBtn = document.getElementById('togglePasswordBtn');
        const mainHeader = document.querySelector('.main-header');
        
        // Hide configurator wrapper initially if not authenticated
        const isAuthenticated = sessionStorage.getItem('palrom_configurator_auth') === 'true';
        
        if (isAuthenticated) {
            authGate.classList.add('hidden');
        } else {
            // Hide main header and configurator content to make it a clean lock screen
            if (mainHeader) mainHeader.style.display = 'none';
            // We can hide all section elements
            document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
            document.querySelector('.main-footer').classList.add('hidden');
            if (document.getElementById('floatingContact')) {
                document.getElementById('floatingContact').classList.add('hidden');
            }
        }
        
        // Toggle Password visibility
        if (togglePassBtn) {
            togglePassBtn.addEventListener('click', () => {
                const type = authPass.getAttribute('type') === 'password' ? 'text' : 'password';
                authPass.setAttribute('type', type);
                const icon = togglePassBtn.querySelector('i');
                if (type === 'text') {
                    icon.className = 'fa-regular fa-eye-slash';
                } else {
                    icon.className = 'fa-regular fa-eye';
                }
            });
        }
        
        // Handle login submit
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = authPass.value;
            
            // Hardcoded password: palrom2026
            if (password === 'palrom2026') {
                sessionStorage.setItem('palrom_configurator_auth', 'true');
                
                // Transition effect: fade out gate and show page
                authGate.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
                authGate.style.opacity = '0';
                authGate.style.visibility = 'hidden';
                
                setTimeout(() => {
                    authGate.classList.add('hidden');
                    if (mainHeader) mainHeader.style.display = '';
                    document.querySelectorAll('section').forEach(s => s.classList.remove('hidden'));
                    document.querySelector('.main-footer').classList.remove('hidden');
                    if (document.getElementById('floatingContact')) {
                        document.getElementById('floatingContact').classList.remove('hidden');
                    }
                }, 400);
            } else {
                authError.classList.remove('hidden');
                authError.classList.add('shake');
                authPass.value = '';
                authPass.focus();
                
                setTimeout(() => {
                    authError.classList.remove('shake');
                }, 400);
        });
    }

    // ==========================================
    // 8. Team Member Detail Popups
    // ==========================================
    const teamMemberData = {
        gabriela: {
            name: "Gabriela Cioara",
            role: {
                nl: "Algemeen Directeur",
                en: "General Manager"
            },
            avatar: "images/gabriela.png",
            languages: {
                nl: "Engels, Roemeens",
                en: "English, Romanian"
            },
            bio: {
                nl: "Gabriela leidt PALROM Products met meer dan 20 jaar ervaring in de B2B-houtindustrie. Zij richt zich op strategische groei, kwaliteitsborging en het behoud van onze premium FSC®-gecertificeerde toeleveringsketen.",
                en: "Gabriela leads PALROM Products with over 20 years of experience in the B2B wood industry. She focuses on strategic growth, quality assurance, and maintaining our premium FSC®-certified supply chain."
            },
            email: "office@palromproducts.ro",
            phone: "+40254606053",
            whatsapp: "https://wa.me/40254606053?text=Hallo%20Gabriela,%20ik%20heb%20een%20vraag%20over%20uw%20B2B-meubelcomponenten."
        },
        ciprian: {
            name: "Ciprian Jude",
            role: {
                nl: "Inkoopmanager",
                en: "Purchase Manager"
            },
            avatar: "images/ciprian.png",
            languages: {
                nl: "Engels, Roemeens",
                en: "English, Romanian"
            },
            bio: {
                nl: "Ciprian beheert onze houtinkoop en logistiek. Hij zorgt ervoor dat al onze beukenhouten grondstoffen afkomstig zijn uit duurzaam beheerde lokale bossen in de regio Brad en Hunedoara.",
                en: "Ciprian manages our timber procurement and logistics. He ensures all our beechwood raw materials are sourced sustainably from managed local forests in the Brad and Hunedoara regions."
            },
            email: "ciprian.jude@palromproducts.ro",
            phone: "+40254606053",
            whatsapp: "https://wa.me/40254606053?text=Hallo%20Ciprian,%20ik%20wil%20graag%20de%20beschikbaarheid%20en%20inkoop%20van%20hout%20bespreken."
        },
        anca: {
            name: "Anca Mihuț",
            role: {
                nl: "Personeelszaken (HR)",
                en: "Human Resources"
            },
            avatar: "images/anca.png",
            languages: {
                nl: "Engels, Roemeens",
                en: "English, Romanian"
            },
            bio: {
                nl: "Anca coördineert recruitment en personeelswelzijn binnen de Palrom-zagerij en -schaverij. Zij is uw directe aanspreekpunt voor openstaande vacatures en sollicitaties in Brad.",
                en: "Anca coordinates recruitment and employee welfare within the Palrom sawmill and planing mill. She is your direct point of contact for open vacancies and job applications in Brad."
            },
            email: "anca.mihut@palromproducts.ro",
            phone: "+40254606053",
            whatsapp: "https://wa.me/40254606053?text=Hallo%20Anca,%20ik%20heb%20een%20vraag%20over%20carri%C3%A8remogelijkheden%20bij%20Palrom."
        },
        adi: {
            name: "Adi Cîra",
            role: {
                nl: "Productiemanager",
                en: "Production Manager"
            },
            avatar: "images/adi_cira.png",
            languages: {
                nl: "Engels, Roemeens",
                en: "English, Romanian"
            },
            bio: {
                nl: "Adi houdt toezicht op onze ultramoderne zagerij- en schaaflijnen. Hij vertaalt klantspecifieke millimetertekeningen naar efficiënte en foutloze massaproductie.",
                en: "Adi oversees our state-of-the-art sawmill and planing lines. He translates client-specific millimeter drawings into efficient, defect-free bulk production runs."
            },
            email: "production@palromproducts.ro",
            phone: "+40254606053",
            whatsapp: "https://wa.me/40254606053?text=Hallo%20Adi,%20ik%20heb%20een%20technische%20vraag%20over%20de%20productie%20van%20houten%20componenten."
        },
        bogdan: {
            name: "Bogdan Oprea",
            role: {
                nl: "Orderverwerking",
                en: "Order Intake"
            },
            avatar: "images/bogdan_oprea.png",
            languages: {
                nl: "Engels, Roemeens",
                en: "English, Romanian"
            },
            bio: {
                nl: "Bogdan is verantwoordelijk voor B2B-orderinname, volume-offertes en leveringsplanning. Hij zorgt voor een snelle verwerking van aanvragen en stroomlijnt de administratieve flow.",
                en: "Bogdan is responsible for B2B order intake, volume quotes, and delivery scheduling. He ensures fast processing of inquiries and streamlines the administrative flow."
            },
            email: "orders@palromproducts.ro",
            phone: "+40254606053",
            whatsapp: "https://wa.me/40254606053?text=Hallo%20Bogdan,%20ik%20wil%20graag%20de%20status%20van%20een%20order%20of%20een%20offerteaanvraag%20bespreken."
        }
    };

    const teamCards = document.querySelectorAll('.team-card');
    
    if (teamCards.length > 0) {
        teamCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore clicks on direct mailto links/buttons inside card
                if (e.target.closest('.team-email-btn')) {
                    return;
                }
                
                const memberId = card.getAttribute('data-member-id');
                if (memberId && teamMemberData[memberId]) {
                    showTeamModal(teamMemberData[memberId]);
                }
            });
        });
    }

    function showTeamModal(data) {
        const lang = document.documentElement.lang === 'nl' ? 'nl' : 'en';
        
        const existingModal = document.getElementById('teamModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const labels = {
            whatsapp: lang === 'nl' ? 'Direct WhatsApp-bericht' : 'Direct WhatsApp Chat',
            phone: lang === 'nl' ? 'Bellen naar kantoor' : 'Call Office Phone',
            email: lang === 'nl' ? 'E-mail verzenden' : 'Send Direct Email',
            close: lang === 'nl' ? 'Sluiten' : 'Close'
        };
        
        const modal = document.createElement('div');
        modal.id = 'teamModal';
        modal.className = 'team-modal';
        
        modal.innerHTML = `
            <div class="team-modal-overlay"></div>
            <div class="team-modal-container">
                <button class="team-modal-close" aria-label="${labels.close}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="team-modal-avatar">
                    <img src="${data.avatar}" alt="${data.name}">
                </div>
                <h2>${data.name}</h2>
                <div class="team-modal-role">${data.role[lang]}</div>
                <div class="team-modal-languages">${data.languages[lang]}</div>
                <div class="team-modal-bio">${data.bio[lang]}</div>
                
                <div class="team-modal-contacts">
                    <a href="${data.whatsapp}" target="_blank" rel="noopener noreferrer" class="team-contact-btn whatsapp">
                        <i class="fa-brands fa-whatsapp"></i> ${labels.whatsapp}
                    </a>
                    <a href="tel:${data.phone}" class="team-contact-btn phone">
                        <i class="fa-solid fa-phone"></i> ${labels.phone}
                    </a>
                    <a href="mailto:${data.email}" class="team-contact-btn email">
                        <i class="fa-solid fa-envelope"></i> ${labels.email}
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
        
        const closeBtn = modal.querySelector('.team-modal-close');
        const overlay = modal.querySelector('.team-modal-overlay');
        
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.remove();
            }, 300);
            document.removeEventListener('keydown', handleEsc);
        };
        
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', handleEsc);
    }
});
