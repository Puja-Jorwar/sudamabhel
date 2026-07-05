document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. SCROLL PROGRESS INDICATOR & HEADER STYLE
  // ==========================================
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll progress bar
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }

    // Sticky header shadow & size reduction
    if (windowScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let current = '';
    sections.forEach(section => {
      if (section.offsetTop) {
        const sectionTop = section.offsetTop;
        // Triggers slightly before section hits the viewport top
        if (windowScroll >= (sectionTop - 150)) {
          current = section.getAttribute('id');
        }
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. MENU CATEGORY TAB FILTERING
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuGrid = document.getElementById('menuGrid');
  
  if (tabButtons.length > 0 && menuGrid) {
    const menuCards = menuGrid.querySelectorAll('.menu-item-card');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Toggle active button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.getAttribute('data-category');

        menuCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
            // Trigger animation repaint
            card.style.animation = 'none';
            card.offsetHeight; // trigger reflow
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================
  // 4. PRESTIGIOUS GALLERY LIGHTBOX MODAL
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (galleryItems.length > 0 && lightbox && lightboxImage) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const caption = item.getAttribute('data-caption');

        lightboxImage.setAttribute('src', src);
        if (lightboxCaption) lightboxCaption.textContent = caption || '';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      });
    });

    // Close Lightbox
    const closeLightboxModal = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scrolling
      setTimeout(() => {
        lightboxImage.setAttribute('src', '');
      }, 300);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightboxModal);
    }

    // Close when clicking background outside the image content
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightboxModal();
      }
    });

    // Keyboard ESC close support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightboxModal();
      }
    });
  }

  // ==========================================
  // 5. INTERACTIVE OUTLET SWITCHER (MAP INTEGRATION)
  // ==========================================
  const outletCards = document.querySelectorAll('.outlet-card');
  const outletMap = document.getElementById('outletMap');
  const mapTitle = document.getElementById('mapTitle');
  const mapAddress = document.getElementById('mapAddress');
  const mapDirectBtn = document.getElementById('mapDirectBtn');

  if (outletCards.length > 0 && outletMap) {
    outletCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active state from all cards
        outletCards.forEach(c => c.classList.remove('active'));
        // Add active state to clicked card
        card.classList.add('active');

        // Extract data
        const mapUrl = card.getAttribute('data-map');
        const branchTitle = card.querySelector('h3').textContent;
        const branchAddress = card.querySelector('.o-address').textContent;

        // Animate iframe loading transition (fade out, change src, fade in)
        outletMap.style.opacity = '0.3';
        outletMap.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
          // Update IFrame src
          outletMap.setAttribute('src', mapUrl);
          
          // Update overlay labels
          if (mapTitle) mapTitle.textContent = branchTitle;
          if (mapAddress) mapAddress.textContent = branchAddress;
          if (mapDirectBtn) {
            mapDirectBtn.setAttribute('href', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branchTitle + " " + branchAddress)}`);
          }
          
          outletMap.style.opacity = '1';
        }, 200);

        // Smooth scroll to map on smaller screens
        if (window.innerWidth < 992) {
          const mapView = document.querySelector('.map-view');
          if (mapView) {
            mapView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });
  }
});
