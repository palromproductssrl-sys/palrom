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

            if (!name || !email || !phone) {
                alert('Please fill out all required contact fields.');
                return;
            }

            // Simulate submission
            const submitBtn = cartSubmitForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Submitting...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Format item list for success message
                const itemsList = cart.map(item => {
                    const gradeNames = {
                        'grade_a': 'Class A (Clear)',
                        'grade_b': 'Class B (Cabinet)',
                        'grade_ab': 'Class A/B Mixed'
                    };
                    const gradeName = gradeNames[item.grade] || item.grade;
                    const dimDesc = item.dims ? ` [Size: ${item.dims}]` : '';
                    return `- ${item.name} (${item.qty}x, ${gradeName}${dimDesc})`;
                }).join('\n');

                alert(
                    `Thank you, ${name}! Your inquiry for the following product(s) has been successfully received by our Brad headquarters:\n\n${itemsList}\n\nWe will prepare detailed sizing sheets and pricing estimates and email you at ${email} within 24 hours.`
                );

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
    // 10. B2B Product Configurator Wizard Logic
    // ==========================================
    const b2bConfigForm = document.getElementById('palromB2bConfiguratorForm');
    if (b2bConfigForm) {
        const groupCards = document.querySelectorAll('.configurator-group-card');
        const btnPrev = document.getElementById('btnWizardPrev');
        const btnNext = document.getElementById('btnWizardNext');
        const btnSubmit = document.getElementById('btnWizardSubmit');
        
        const step1Content = document.getElementById('configuratorStep1Content');
        const step2Content = document.getElementById('configuratorStep2Content');
        const step3Content = document.getElementById('configuratorStep3Content');
        
        const progStep1 = document.getElementById('progressStep1');
        const progStep2 = document.getElementById('progressStep2');
        const progStep3 = document.getElementById('progressStep3');
        
        const fieldsDowels = document.getElementById('fieldsDowels');
        const fieldsPlaned = document.getElementById('fieldsPlaned');
        const fieldsProfiles = document.getElementById('fieldsProfiles');
        const fieldsSpecials = document.getElementById('fieldsSpecials');
        
        const successOverlay = document.getElementById('configuratorSuccessOverlay');
        const successTicket = document.getElementById('successTicketNum');
        const successGroup = document.getElementById('successProductGroup');
        const successSpecs = document.getElementById('successProductSpecs');
        const successQty = document.getElementById('successProductQty');
        const successCompany = document.getElementById('successCompanyName');
        
        const restartBtn = document.getElementById('successRestartBtn');
        const downloadPdfBtn = document.getElementById('successDownloadPdf');
        
        let currentStep = 1;
        let selectedGroup = ''; // 'dowels', 'planed', 'profiles', 'specials'

        // Step 1: Select Product Group
        groupCards.forEach(card => {
            card.addEventListener('click', () => {
                groupCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedGroup = card.getAttribute('data-group');
            });

            // Double click to select and immediately proceed to Step 2
            card.addEventListener('dblclick', () => {
                groupCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedGroup = card.getAttribute('data-group');
                
                if (currentStep === 1 && validateStep(1)) {
                    currentStep = 2;
                    updateWizardUI();
                    window.scrollTo({ top: b2bConfigForm.offsetTop - 120, behavior: 'smooth' });
                }
            });
        });

        // Step Transitions & Logic
        function updateWizardUI() {
            // Hide all steps first
            step1Content.classList.remove('active');
            step2Content.classList.remove('active');
            step3Content.classList.remove('active');
            
            progStep1.classList.remove('active', 'completed');
            progStep2.classList.remove('active', 'completed');
            progStep3.classList.remove('active', 'completed');
            
            if (currentStep === 1) {
                step1Content.classList.add('active');
                progStep1.classList.add('active');
                btnPrev.classList.add('hidden');
                btnNext.classList.remove('hidden');
                btnSubmit.classList.add('hidden');
            } else if (currentStep === 2) {
                step2Content.classList.add('active');
                progStep1.classList.add('completed');
                progStep2.classList.add('active');
                btnPrev.classList.remove('hidden');
                btnNext.classList.remove('hidden');
                btnSubmit.classList.add('hidden');
                
                // Show only active fields
                fieldsDowels.classList.add('hidden');
                fieldsPlaned.classList.add('hidden');
                fieldsProfiles.classList.add('hidden');
                fieldsSpecials.classList.add('hidden');
                
                if (selectedGroup === 'dowels') {
                    fieldsDowels.classList.remove('hidden');
                } else if (selectedGroup === 'planed') {
                    fieldsPlaned.classList.remove('hidden');
                } else if (selectedGroup === 'profiles') {
                    fieldsProfiles.classList.remove('hidden');
                } else if (selectedGroup === 'specials') {
                    fieldsSpecials.classList.remove('hidden');
                }
            } else if (currentStep === 3) {
                step3Content.classList.add('active');
                progStep1.classList.add('completed');
                progStep2.classList.add('completed');
                progStep3.classList.add('active');
                btnPrev.classList.remove('hidden');
                btnNext.classList.add('hidden');
                btnSubmit.classList.remove('hidden');
            }
        }

        // Validate current step inputs
        function validateStep(step) {
            if (step === 1) {
                if (!selectedGroup) {
                    alert('Selecteer a.u.b. eerst een productgroep om verder te gaan.');
                    return false;
                }
                return true;
            }
            
            if (step === 2) {
                if (selectedGroup === 'dowels') {
                    const diameter = document.getElementById('dowelDiameter').value;
                    const length = document.getElementById('dowelLength').value;
                    if (!diameter || !length) {
                        alert('Voer a.u.b. de diameter en lengte in.');
                        return false;
                    }
                    if (diameter < 3 || diameter > 60) {
                        alert('De diameter moet tussen 3 mm en 60 mm liggen.');
                        return false;
                    }
                    if (length < 30 || length > 3000) {
                        alert('De lengte moet tussen 30 mm en 3000 mm liggen.');
                        return false;
                    }
                } else if (selectedGroup === 'planed') {
                    const thickness = document.getElementById('planedThickness').value;
                    const width = document.getElementById('planedWidth').value;
                    const length = document.getElementById('planedLength').value;
                    if (!thickness || !width || !length) {
                        alert('Voer a.u.b. alle afmetingen in (dikte, breedte en lengte).');
                        return false;
                    }
                    if (thickness < 10 || thickness > 100) {
                        alert('De dikte moet tussen 10 mm en 100 mm liggen.');
                        return false;
                    }
                    if (width < 15 || width > 300) {
                        alert('De breedte moet tussen 15 mm en 300 mm liggen.');
                        return false;
                    }
                    if (length < 100 || length > 4000) {
                        alert('De lengte moet tussen 100 mm en 4000 mm liggen.');
                        return false;
                    }
                } else if (selectedGroup === 'profiles') {
                    const sizing = document.getElementById('profileSizing').value;
                    const length = document.getElementById('profileLength').value;
                    if (!sizing || !length) {
                        alert('Voer a.u.b. de afmeting en lengte in.');
                        return false;
                    }
                    if (sizing < 10 || sizing > 120) {
                        alert('De afmeting moet tussen 10 mm en 120 mm liggen.');
                        return false;
                    }
                    if (length < 500 || length > 3000) {
                        alert('De lengte moet tussen 500 mm en 3000 mm liggen.');
                        return false;
                    }
                } else if (selectedGroup === 'specials') {
                    const desc = document.getElementById('specialDescription').value.trim();
                    if (!desc) {
                        alert('Voer a.u.b. een omschrijving in voor uw gewenste houtcomponent.');
                        return false;
                    }
                }
                return true;
            }
            return true;
        }

        // Navigation Button Listeners
        btnNext.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateWizardUI();
                window.scrollTo({ top: b2bConfigForm.offsetTop - 120, behavior: 'smooth' });
            }
        });

        btnPrev.addEventListener('click', () => {
            currentStep--;
            updateWizardUI();
            window.scrollTo({ top: b2bConfigForm.offsetTop - 120, behavior: 'smooth' });
        });

        // Form Submission
        b2bConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate Contact Fields
            const name = document.getElementById('b2bName').value.trim();
            const company = document.getElementById('b2bCompany').value.trim();
            const email = document.getElementById('b2bEmail').value.trim();
            const phone = document.getElementById('b2bPhone').value.trim();
            const qty = document.getElementById('b2bVolumeInput').value;
            const fscRequired = document.getElementById('b2bFscRequired').checked;

            if (!name || !company || !email || !phone || !qty) {
                alert('Vul a.u.b. alle verplichte contactvelden in.');
                return;
            }

            // Simulate loader spinner
            const originalBtnHtml = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Verwerken...';

            setTimeout(() => {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnHtml;

                // Build Specification Details summary
                let groupLabel = '';
                let specDetails = '';

                if (selectedGroup === 'dowels') {
                    groupLabel = 'Beukenhouten Dowels & Staven';
                    const diameter = document.getElementById('dowelDiameter').value;
                    const length = document.getElementById('dowelLength').value;
                    const finish = document.getElementById('dowelFinish').options[document.getElementById('dowelFinish').selectedIndex].text;
                    const condition = document.getElementById('dowelCondition').options[document.getElementById('dowelCondition').selectedIndex].text;
                    specDetails = `Diameter: ${diameter}mm | Lengte: ${length}mm | Afwerking: ${finish} | Behandeling: ${condition}`;
                } else if (selectedGroup === 'planed') {
                    groupLabel = '4-Zijdig Geschaafd Beukenhout';
                    const thickness = document.getElementById('planedThickness').value;
                    const width = document.getElementById('planedWidth').value;
                    const length = document.getElementById('planedLength').value;
                    const edge = document.getElementById('planedEdge').options[document.getElementById('planedEdge').selectedIndex].text;
                    const grade = document.getElementById('planedGrade').options[document.getElementById('planedGrade').selectedIndex].text;
                    const cond = document.getElementById('planedCondition').options[document.getElementById('planedCondition').selectedIndex].text;
                    specDetails = `Afmetingen: ${thickness}x${width}x${length}mm | Hoeken: ${edge} | Kwaliteit: ${grade} | Droging: ${cond}`;
                } else if (selectedGroup === 'profiles') {
                    groupLabel = 'Houten Profielen & Lijsten';
                    const shape = document.getElementById('profileType').options[document.getElementById('profileType').selectedIndex].text;
                    const sizing = document.getElementById('profileSizing').value;
                    const length = document.getElementById('profileLength').value;
                    specDetails = `Profielvorm: ${shape} | Afmeting: ${sizing}mm | Lengte: ${length}mm`;
                } else if (selectedGroup === 'specials') {
                    groupLabel = 'Speciale Houtcomponenten';
                    const desc = document.getElementById('specialDescription').value.substring(0, 50) + '...';
                    const dims = document.getElementById('specialDimensions').value || 'N.v.t.';
                    const finish = document.getElementById('specialFinish').value || 'N.v.t.';
                    specDetails = `Type: ${desc} | Afmetingen: ${dims} | Bewerking: ${finish}`;
                }

                if (fscRequired) {
                    specDetails += ' [FSC® Vereist]';
                }

                // Generate random B2B reference
                const randomTicket = 'PLR-2026-' + Math.floor(10000 + Math.random() * 90000);

                // Update Success UI Elements
                successTicket.textContent = randomTicket;
                successGroup.textContent = groupLabel;
                successSpecs.textContent = specDetails;
                successQty.textContent = `${Number(qty).toLocaleString('nl-NL')} stuks/volume`;
                successCompany.textContent = company;

                // Show Success view
                successOverlay.classList.remove('hidden');
                window.scrollTo({ top: b2bConfigForm.offsetTop - 120, behavior: 'smooth' });
            }, 1500);
        });

        // Restart Wizard
        restartBtn.addEventListener('click', () => {
            b2bConfigForm.reset();
            groupCards.forEach(c => c.classList.remove('active'));
            selectedGroup = '';
            currentStep = 1;
            updateWizardUI();
            successOverlay.classList.add('hidden');
        });

        // Simulated PDF Download
        downloadPdfBtn.addEventListener('click', () => {
            alert('Uw specificatiesheet (PDF) is klaargemaakt voor download en naar uw e-mailadres verzonden!');
        });
    }

    // Initialize cart state
    loadCart();

    checkCookieConsent();
});
