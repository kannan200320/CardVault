// CardVault - Sports Trading Card & Collectibles Shop Main JS

// Global Toast Notification Helper
(function() {
  window.showToast = function(msg, icon = '✓') {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed top-6 right-6 rtl:right-auto rtl:left-6 z-[9999] flex flex-col gap-3 pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "min-w-[280px] max-w-[380px] bg-white dark:bg-vault-card border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#CC313D] shadow-2xl p-4 rounded-xl flex items-center justify-between gap-3 text-xs text-gray-800 dark:text-gray-100 animate-toast-in pointer-events-auto transition duration-300 border border-gray-100 dark:border-gray-800";
    toast.style.boxShadow = "0 20px 25px -5px rgba(204,49,61,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)";

    toast.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="w-6 h-6 rounded-full bg-[#CC313D]/15 text-[#CC313D] flex items-center justify-center font-bold text-xs shrink-0">
          ${icon}
        </span>
        <span class="font-bold leading-snug">${msg}</span>
      </div>
      <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition shrink-0 p-1" onclick="this.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = "translateY(-15px)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  };

  // Safe window alert override
  window.alert = function(msg) {
    window.showToast(msg);
  };
})();

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRtl();
  initMobileMenu();
  initDropdowns();
  highlightActiveNav();
  initAccordions();
  initCountdown();
  initShopFilter();
  initGradingCalculator();
  initCardModal();
  initNewsletter();
  initCardDetailsPage();
  initBlogDetailsPage();
  initWishlistAndCart();
  initFormValidation();
  initScrollAnimations();
});

// ==========================================
// 1. Theme Configuration (Dark / Light Mode)
// ==========================================
function toggleTheme() {
  // Prevent transition stutter/glitch across the page during switch
  document.documentElement.classList.add('disable-transitions');
  
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
    updateThemeToggleIcons(false);
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
    updateThemeToggleIcons(true);
  }

  // Force synchronous CSS layout / reflow
  void window.getComputedStyle(document.documentElement).opacity;

  // Restore normal interaction transitions on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('disable-transitions');
    });
  });
}
window.toggleTheme = toggleTheme;

function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  
  // Set initial state
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    updateThemeToggleIcons(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeToggleIcons(false);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleTheme();
    });
  });
}

function updateThemeToggleIcons(isDark) {
  const sunIcons = document.querySelectorAll('.theme-toggle-sun');
  const moonIcons = document.querySelectorAll('.theme-toggle-moon');
  
  sunIcons.forEach(icon => {
    if (isDark) icon.classList.remove('hidden');
    else icon.classList.add('hidden');
  });
  
  moonIcons.forEach(icon => {
    if (isDark) icon.classList.add('hidden');
    else icon.classList.remove('hidden');
  });
}

// ==========================================
// 2. Direction Configuration (RTL / LTR)
// ==========================================
function initRtl() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle');
  
  const savedDir = localStorage.getItem('site-dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  updateRtlButtonText(savedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('site-dir', newDir);
      updateRtlButtonText(newDir);
    });
  });
}

function updateRtlButtonText(dir) {
  const rtlTexts = document.querySelectorAll('.rtl-text');
  rtlTexts.forEach(txt => {
    txt.textContent = dir === 'rtl' ? 'LTR →' : '← RTL';
  });
}

// ==========================================
// Global Body & Viewport Scroll Lock Helper
// ==========================================
let scrollLockCount = 0;
let savedPageScrollY = 0;

function lockBodyScroll() {
  scrollLockCount++;
  if (scrollLockCount === 1) {
    savedPageScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
    if (savedPageScrollY > 0) {
      window.scrollTo(0, savedPageScrollY);
    }
  }
}
window.lockBodyScroll = lockBodyScroll;
window.unlockBodyScroll = unlockBodyScroll;

// ==========================================
// 3. Mobile Navigation Drawer & Hamburger
// ==========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!mobileMenu) return;
  
  const backdrop = mobileMenu.querySelector('.mobile-menu-backdrop');
  const drawerPanel = mobileMenu.querySelector('div.overflow-y-auto') || mobileMenu.children[1];
  
  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    mobileMenu.classList.remove('hidden');
    lockBodyScroll();
    if (menuBtn) menuBtn.classList.add('open');
  };
  
  const closeMenu = () => {
    if (!isOpen && mobileMenu.classList.contains('hidden')) return;
    isOpen = false;
    mobileMenu.classList.add('hidden');
    unlockBodyScroll();
    if (menuBtn) menuBtn.classList.remove('open');
  };
  
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenu.classList.contains('hidden')) {
        openMenu();
      } else {
        closeMenu();
      }
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }
  
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Prevent background touch dragging and mouse wheel scrolling when interacting with mobile menu backdrop
  mobileMenu.addEventListener('touchmove', (e) => {
    if (!drawerPanel || !drawerPanel.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  mobileMenu.addEventListener('wheel', (e) => {
    if (!drawerPanel || !drawerPanel.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  // Close menu and unlock background scroll when tapping navigation links inside drawer
  const navLinks = mobileMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Automatically close and unlock body scroll if viewport is resized to desktop width (>= 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  });

  // Escape key closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  });
}

// ==========================================
// 4. Dropdowns (Hover on Desktop, Click for Touch)
// ==========================================
function initDropdowns() {
  const dropdownContainers = document.querySelectorAll('.nav-dropdown');
  
  dropdownContainers.forEach(container => {
    const toggle = container.querySelector('.dropdown-toggle');
    const menu = container.querySelector('.dropdown-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth < 1280) {
          e.preventDefault();
          menu.classList.toggle('hidden');
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.dropdown-menu.touch-open').forEach(menu => {
        menu.classList.add('hidden');
        menu.classList.remove('touch-open');
      });
    }
  });
}

// ==========================================
// 5. Navigation Highlighting
// ==========================================
function highlightActiveNav() {
  let path = window.location.pathname;
  let page = path.split("/").pop();
  if (page === "" || page === "/") {
    page = "index.html";
  }

  const highlight = (el) => {
    if (!el) return;
    el.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:text-[#CC313D]');
    el.classList.add('text-[#CC313D]', 'dark:text-[#F7C5CC]', 'font-bold');
  };

  const navLinks = document.querySelectorAll('header nav a, #mobile-menu nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      highlight(link);
    }
  });
}

// ==========================================
// 6. Accordions (FAQs)
// ==========================================
function initAccordions() {
  const accordionButtons = document.querySelectorAll('.faq-toggle');
  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      
      const isOpen = !content.classList.contains('hidden');
      
      // Close all siblings if wanted, or toggle current
      content.classList.toggle('hidden');
      if (icon) {
        icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });
}

// ==========================================
// 7. Live Auction / Break Countdown
// ==========================================
function initCountdown() {
  const countdownEls = document.querySelectorAll('.countdown-timer');
  if (countdownEls.length === 0) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  targetDate.setHours(targetDate.getHours() + 14);

  function update() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEls.forEach(el => {
      const dEl = el.querySelector('.cd-days');
      const hEl = el.querySelector('.cd-hours');
      const mEl = el.querySelector('.cd-minutes');
      const sEl = el.querySelector('.cd-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    });
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// 8. Shop Category Filtering & URL Query (?type=)
// ==========================================
function initShopFilter() {
  const cards = document.querySelectorAll('.shop-card-item');
  const searchInput = document.getElementById('shop-search');
  const sortSelect = document.getElementById('shop-sort');
  const countBadge = document.getElementById('shop-item-count');
  const pageTitle = document.getElementById('page-category-title');
  const pageBadge = document.getElementById('page-category-badge');
  const pageDesc = document.getElementById('page-category-desc');
  const breadcrumb = document.getElementById('breadcrumb-category-name');

  if (cards.length === 0) return;

  const sportMeta = {
    'baseball': {
      title: 'Baseball ⚾ Trading Cards & Graded Slabs',
      breadcrumb: 'Baseball ⚾ Slabs',
      badge: 'Baseball ⚾ Vault',
      desc: 'Official Topps Chrome, Bowman 1st, and vintage high-grade baseball slabs with forensic tamper-evident certs.',
      toast: 'Viewing: Baseball ⚾ (6 Certified Slabs)'
    },
    'basketball': {
      title: 'Basketball 🏀 Trading Cards & Graded Slabs',
      breadcrumb: 'Basketball 🏀 Slabs',
      badge: 'Basketball 🏀 Vault',
      desc: 'Modern NBA RPAs, 1/1 Logoman grails, and Topps Chrome rookie slabs with verified on-card autographs.',
      toast: 'Viewing: Basketball 🏀 (6 Certified Slabs)'
    },
    'cricket': {
      title: 'Cricket 🏏 Trading Cards & Graded Slabs',
      breadcrumb: 'Cricket 🏏 Slabs',
      badge: 'Cricket 🏏 Vault',
      desc: 'Exclusive Topps Cricket Chrome & Attax certified slabs from London, Mumbai, and Dubai vaults.',
      toast: 'Viewing: Cricket 🏏 (6 Certified Slabs)'
    },
    'football': {
      title: 'Football 🏈 Trading Cards & Graded Slabs',
      breadcrumb: 'Football 🏈 Slabs',
      badge: 'Football 🏈 Vault',
      desc: 'Franchise quarterback rookie slabs, 130pt thick jersey patch RPAs, and 1/1 NFL Shield grails.',
      toast: 'Viewing: Football 🏈 (6 Certified Slabs)'
    }
  };

  // Specific panel references (Strictly 4 separate sport filter panels)
  const panelMap = {
    'baseball': document.getElementById('filter-panel-baseball'),
    'basketball': document.getElementById('filter-panel-basketball'),
    'cricket': document.getElementById('filter-panel-cricket'),
    'football': document.getElementById('filter-panel-football')
  };

  // Specific sport content suites (4 completely distinct sections)
  const sportContentMap = {
    'baseball': document.getElementById('sport-content-baseball'),
    'basketball': document.getElementById('sport-content-basketball'),
    'cricket': document.getElementById('sport-content-cricket'),
    'football': document.getElementById('sport-content-football')
  };

  // State for sub-filters per sport
  const activeSubPos = {
    'baseball': 'all',
    'basketball': 'all',
    'cricket': 'all',
    'football': 'all'
  };

  // Parse URL query parameter: ?type=baseball etc. If missing, update URL without reloading
  function getActiveType() {
    const urlParams = new URLSearchParams(window.location.search);
    let t = (urlParams.get('type') || '').toLowerCase();
    if (!t || !sportMeta[t]) {
      try {
        const newUrl = `${window.location.pathname}?type=baseball`;
        window.history.replaceState({ type: 'baseball' }, '', newUrl);
      } catch (e) {}
      return 'baseball';
    }
    return t;
  }

  let activeType = getActiveType();

  function applyFilters(notify = false) {
    let visibleCount = 0;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // 1. TOGGLE EXCLUSIVE SIDEBAR FILTER PANELS
    // Only the chosen sport's filter panel is visible; all others are hidden
    Object.keys(panelMap).forEach(key => {
      const panel = panelMap[key];
      if (panel) {
        if (key === activeType) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    });

    // 2. READ CHECKED PLAYERS FOR CURRENT SPORT
    let allowedPlayers = null;
    if (activeType !== 'all') {
      const checkedBoxes = document.querySelectorAll(`.${activeType}-sub-check:checked`);
      if (checkedBoxes.length > 0) {
        const playersSet = new Set();
        checkedBoxes.forEach(cb => {
          const pVal = cb.dataset.player || '';
          pVal.split(',').forEach(p => {
            const clean = p.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (clean) playersSet.add(clean);
          });
        });
        allowedPlayers = Array.from(playersSet);
      } else {
        allowedPlayers = null;
      }
    }

    // 3. READ GLOBAL GRADE CHECKBOXES
    const gradePsa = document.querySelector('.global-grade-filter[data-grade="psa"]')?.checked ?? true;
    const gradeBgs = document.querySelector('.global-grade-filter[data-grade="bgs"]')?.checked ?? true;

    // 4. FILTER CARDS IN SHOP GRID
    cards.forEach(card => {
      const cardSport = (card.dataset.sport || '').toLowerCase();
      const cardTitle = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const cardSet = (card.querySelector('.card-set')?.textContent || '').toLowerCase();
      const cardPos = (card.dataset.pos || '').toLowerCase();
      const cardPlayerRaw = (card.dataset.player || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const cardCert = (card.dataset.cert || '').toUpperCase();

      // Sport Match (Strictly Active Sport)
      const matchesSport = (cardSport === activeType);

      // Search Query Match
      const matchesSearch = query === '' || 
        cardTitle.includes(query) || 
        cardSet.includes(query) || 
        (card.dataset.player && card.dataset.player.toLowerCase().includes(query)) ||
        (card.dataset.team && card.dataset.team.toLowerCase().includes(query));

      // Position Sub-filter Match
      let matchesPos = true;
      if (activeType !== 'all') {
        const curPos = activeSubPos[activeType] || 'all';
        if (curPos !== 'all') {
          if (curPos === 'qb') matchesPos = cardPos.includes('qb');
          else if (curPos === 'wr') matchesPos = cardPos.includes('wr');
          else if (curPos === 'pitcher') matchesPos = cardPos.includes('pitcher');
          else if (curPos === 'dh') matchesPos = cardPos.includes('dh') || cardPos.includes('two-way');
          else if (curPos === 'ss') matchesPos = cardPos.includes('shortstop') || cardPos.includes('ss');
          else if (curPos === 'of') matchesPos = cardPos.includes('outfield') || cardPos.includes('of');
          else if (curPos === 'pg') matchesPos = cardPos.includes('point guard') || cardPos.includes('pg');
          else if (curPos === 'sg') matchesPos = cardPos.includes('shooting guard') || cardPos.includes('sg');
          else if (curPos === 'forward') matchesPos = cardPos.includes('forward') || cardPos.includes('center');
          else if (curPos === 'batsman') matchesPos = cardPos.includes('top-order') || cardPos.includes('batsman') || cardPos.includes('legend');
          else if (curPos === 'bowler') matchesPos = cardPos.includes('bowler') || cardPos.includes('pace');
          else if (curPos === 'finisher') matchesPos = cardPos.includes('finisher');
          else if (curPos === 'legend') matchesPos = cardPos.includes('legend');
        }
      }

      // Player Checkbox Match
      let matchesPlayer = true;
      if (allowedPlayers && allowedPlayers.length > 0) {
        matchesPlayer = allowedPlayers.some(p => cardPlayerRaw.includes(p) || p.includes(cardPlayerRaw));
      }

      // Grade Company Match
      let matchesGrade = true;
      if (!gradePsa && cardCert.startsWith('PSA')) matchesGrade = false;
      if (!gradeBgs && cardCert.startsWith('BGS')) matchesGrade = false;

      if (matchesSport && matchesSearch && matchesPos && matchesPlayer && matchesGrade) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (countBadge) {
      countBadge.textContent = `${visibleCount} Cards Available`;
    }

    // Update Page Title, Breadcrumb, Badge, and Description
    if (pageTitle && sportMeta[activeType]) {
      pageTitle.textContent = sportMeta[activeType].title;
    }
    if (breadcrumb && sportMeta[activeType]) {
      breadcrumb.textContent = sportMeta[activeType].breadcrumb;
    }
    if (pageBadge && sportMeta[activeType]) {
      pageBadge.textContent = sportMeta[activeType].badge;
    }
    if (pageDesc && sportMeta[activeType]) {
      pageDesc.textContent = sportMeta[activeType].desc;
    }

    // Toggle Exclusive Sport Content Suites (Baseball, Basketball, Cricket, Football)
    Object.keys(sportContentMap).forEach(key => {
      const container = sportContentMap[key];
      if (container) {
        if (key === activeType) {
          container.classList.remove('hidden');
        } else {
          container.classList.add('hidden');
        }
      }
    });

    // 5. UPDATE IN-PAGE SPORT SWITCHER TABS UI
    document.querySelectorAll('.category-sport-tab').forEach(tab => {
      const sport = tab.dataset.sportTab;
      const badge = tab.querySelector('.tab-badge');
      if (sport === activeType) {
        tab.className = "category-sport-tab group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 bg-cherry-500 text-white shadow-md shadow-cherry-500/25";
        if (badge) {
          badge.className = "tab-badge px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white whitespace-nowrap";
        }
      } else {
        tab.className = "category-sport-tab group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-gray-100 dark:bg-vault-card hover:bg-gray-200 dark:hover:bg-vault-light text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-vault-border";
        if (badge) {
          badge.className = "tab-badge px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-200 dark:bg-vault text-gray-700 dark:text-gray-300 whitespace-nowrap";
        }
      }
    });

    if (notify && sportMeta[activeType]) {
      showToast(sportMeta[activeType].toast, activeType === 'football' ? '🏈' : (activeType === 'baseball' ? '⚾' : (activeType === 'basketball' ? '🏀' : (activeType === 'cricket' ? '🏏' : '💎'))));
    }

    if (window.syncCardWishlistButtons) {
      window.syncCardWishlistButtons();
    }
  }

  // Set category sport programmatically (via URL or button)
  window.setCategorySport = function(type, scroll = false) {
    activeType = (type || 'baseball').toLowerCase();
    if (!sportMeta[activeType]) activeType = 'baseball';

    try {
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.get('type') !== activeType) {
        currentUrl.searchParams.set('type', activeType);
        window.history.pushState({ type: activeType }, '', currentUrl.toString());
      }
    } catch (e) {}

    applyFilters(true);

    if (scroll) {
      const target = document.getElementById('category-sport-tabs-section') || document.getElementById('shop-cards-container');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Sub-filter button click handler
  document.querySelectorAll('.sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sport = btn.dataset.sportFilter;
      const val = btn.dataset.val;
      if (sport && val) {
        activeSubPos[sport] = val;

        // Visual toggle within button group
        const siblingBtns = btn.parentElement.querySelectorAll('.sub-filter-btn');
        siblingBtns.forEach(b => {
          b.classList.remove('bg-cherry-500', 'text-white', 'shadow-sm');
          b.classList.add('bg-gray-100', 'dark:bg-vault', 'text-gray-700', 'dark:text-gray-300');
        });
        btn.classList.add('bg-cherry-500', 'text-white', 'shadow-sm');
        btn.classList.remove('bg-gray-100', 'dark:bg-vault', 'text-gray-700', 'dark:text-gray-300');

        applyFilters(false);
      }
    });
  });

  // Global helper functions
  window.filterSubCard = function(sport) {
    applyFilters(false);
  };

  window.filterByGrade = function(company) {
    applyFilters(false);
  };

  window.resetCurrentFilter = function(sport) {
    if (sport && activeSubPos[sport] !== undefined) {
      activeSubPos[sport] = 'all';
      const panel = panelMap[sport];
      if (panel) {
        panel.querySelectorAll(`.${sport}-sub-check`).forEach(cb => cb.checked = false);
        panel.querySelectorAll('.sub-filter-btn').forEach((b, idx) => {
          if (idx === 0) {
            b.classList.add('bg-cherry-500', 'text-white', 'shadow-sm');
            b.classList.remove('bg-gray-100', 'dark:bg-vault', 'text-gray-700', 'dark:text-gray-300');
          } else {
            b.classList.remove('bg-cherry-500', 'text-white', 'shadow-sm');
            b.classList.add('bg-gray-100', 'dark:bg-vault', 'text-gray-700', 'dark:text-gray-300');
          }
        });
      }
    } else {
      document.querySelectorAll('.global-grade-filter').forEach(cb => cb.checked = true);
    }
    applyFilters(true);
  };

  // Handle browser back / forward
  window.addEventListener('popstate', () => {
    activeType = getActiveType();
    applyFilters(false);
  });

  // Seamless in-page category sport switching for any category.html links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="category.html?type="]');
    if (!link) return;

    const isCategoryPage = window.location.pathname.endsWith('category.html') || window.location.pathname.includes('category');
    if (isCategoryPage) {
      try {
        const url = new URL(link.href, window.location.origin);
        const type = (url.searchParams.get('type') || '').toLowerCase();
        if (type && sportMeta[type]) {
          e.preventDefault();
          window.setCategorySport(type, false);
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (typeof unlockBodyScroll === 'function') {
              unlockBodyScroll();
            } else {
              document.body.style.overflow = '';
            }
          }
        }
      } catch (err) {}
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => applyFilters(false));
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const parent = document.getElementById('shop-cards-container');
      if (!parent) return;

      const cardArr = Array.from(cards);
      cardArr.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price || 0);
        const priceB = parseFloat(b.dataset.price || 0);
        if (val === 'price-low') return priceA - priceB;
        if (val === 'price-high') return priceB - priceA;
        return 0; // default featured
      });

      cardArr.forEach(c => parent.appendChild(c));
      showToast(`Sorted by: ${sortSelect.options[sortSelect.selectedIndex].text}`, "⇅");
    });
  }

  // Initial execution
  applyFilters(false);
}

// ==========================================
// 9. Grading Price & Turnaround Calculator
// ==========================================
function initGradingCalculator() {
  const cardCountInput = document.getElementById('calc-card-count');
  const serviceTierSelect = document.getElementById('calc-service-tier');
  const preScreenCheck = document.getElementById('calc-prescreen');
  const insuranceCheck = document.getElementById('calc-insurance');
  const totalDisplay = document.getElementById('calc-total-display');
  const daysDisplay = document.getElementById('calc-days-display');

  if (!cardCountInput || !serviceTierSelect || !totalDisplay) return;

  function calculate() {
    const count = Math.max(1, parseInt(cardCountInput.value) || 1);
    let tierFee = 25; // default bulk
    let days = "30-45 Business Days";
    let tierName = "Regular Express";

    const tier = serviceTierSelect.value;
    if (tier === 'bulk') { tierFee = 19; days = "30-45 Days"; tierName = "Bulk Value"; }
    else if (tier === 'regular') { tierFee = 35; days = "15-20 Days"; tierName = "Regular Express"; }
    else if (tier === 'express') { tierFee = 75; days = "7-10 Days"; tierName = "Super Express"; }
    else if (tier === 'super-express') { tierFee = 150; days = "3-5 Days"; tierName = "Walkthrough 5-Day"; }
    else if (tier === 'walkthrough') { tierFee = 300; days = "24-48 Hours"; tierName = "VIP 48-Hour Vault"; }

    let perCardExtra = 0;
    if (preScreenCheck && preScreenCheck.checked) perCardExtra += 5; // $5 pre-screen & microfiber clean
    if (insuranceCheck && insuranceCheck.checked) perCardExtra += 10; // $10 armored return insurance

    const total = (tierFee + perCardExtra) * count;
    totalDisplay.textContent = `$${total.toLocaleString()}`;
    if (daysDisplay) daysDisplay.textContent = days;

    const activeBadge = document.getElementById('calc-active-tier-badge');
    if (activeBadge) {
      activeBadge.textContent = `Active Calculation: ${tierName} ($${tierFee}/card • ${days})`;
    }
  }

  window.setGradingTier = function(tierKey) {
    if (serviceTierSelect) {
      serviceTierSelect.value = tierKey;
      calculate();
    }
    const target = document.getElementById('calculator');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const tierLabels = {
      'bulk': 'Bulk Value ($19/card)',
      'regular': 'Regular Express ($35/card)',
      'express': 'Super Express ($75/card)',
      'super-express': 'Walkthrough 5-Day ($150/card)',
      'walkthrough': 'VIP 48-Hour Vault ($300/card)'
    };
    if (window.showToast) {
      window.showToast(`Switched calculation to ${tierLabels[tierKey] || tierKey}`, '🧮');
    }
  };

  cardCountInput.addEventListener('input', calculate);
  serviceTierSelect.addEventListener('change', calculate);
  if (preScreenCheck) preScreenCheck.addEventListener('change', calculate);
  if (insuranceCheck) insuranceCheck.addEventListener('change', calculate);

  calculate();
}

// ==========================================
// 10. Card Slab Quick View Modal (Forensic Inspection)
// ==========================================
function initCardModal() {
  const modal = document.getElementById('card-quick-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('card-modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  const openCardModal = (data) => {
    window.currentInspectedCard = data;
    modal.classList.remove('hidden');
    lockBodyScroll();

    const mImg = document.getElementById('modal-card-img');
    const mTitle = document.getElementById('modal-card-title');
    const mSet = document.getElementById('modal-card-set');
    const mGrade = document.getElementById('modal-card-grade');
    const mPrice = document.getElementById('modal-card-price');
    const mCert = document.getElementById('modal-card-cert');
    const mPop = document.getElementById('modal-card-pop');
    const mSport = document.getElementById('modal-card-sport');
    const mTeam = document.getElementById('modal-card-team');
    const mSerial = document.getElementById('modal-card-serial');
    const mNote = document.getElementById('modal-card-note');
    const mDetailsLink = document.getElementById('modal-card-details-link');

    if (mImg && data.img) mImg.src = data.img;
    if (mTitle && data.title) mTitle.textContent = data.title;
    if (mSet && data.set) mSet.textContent = data.set;
    if (mGrade && data.grade) mGrade.textContent = data.grade;
    if (mPrice && data.price) mPrice.textContent = `$${parseFloat(data.price).toLocaleString()}`;
    if (mCert && data.cert) mCert.textContent = data.cert;
    if (mPop && data.pop) mPop.textContent = data.pop;
    if (mSport && data.sport) mSport.textContent = data.sport.toUpperCase();
    if (mTeam && data.team) mTeam.textContent = data.team;
    if (mSerial && data.serial) mSerial.textContent = data.serial;
    if (mNote && data.note) mNote.textContent = data.note;
    if (mDetailsLink) mDetailsLink.href = `card-details.html?id=${data.id || 1}`;
  };

  const closeCardModal = () => {
    modal.classList.add('hidden');
    unlockBodyScroll();
  };

  const modalBox = modal.querySelector('.max-w-2xl') || modal.children[1];
  modal.addEventListener('touchmove', (e) => {
    if (!modalBox || !modalBox.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  modal.addEventListener('wheel', (e) => {
    if (!modalBox || !modalBox.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = btn.closest('.shop-card-item') || btn.closest('.trading-card-item');
      if (!parentCard) return;

      let cardId = 1;
      const detailLink = parentCard.querySelector('a[href*="card-details.html?id="]');
      if (detailLink) {
        const u = new URL(detailLink.getAttribute('href'), window.location.origin);
        cardId = parseInt(u.searchParams.get('id'), 10) || 1;
      } else {
        const match = (typeof CARD_VAULT_DB !== 'undefined') ? CARD_VAULT_DB.find(c => c.cert === parentCard.dataset.cert) : null;
        if (match) cardId = match.id;
      }

      const data = {
        id: cardId,
        title: parentCard.querySelector('.card-title')?.textContent?.trim() || 'Collectible Trading Card',
        set: parentCard.querySelector('.card-set')?.textContent?.trim() || 'Official Licensed Edition',
        grade: parentCard.querySelector('.card-grade')?.textContent?.trim() || 'PSA 10 Gem Mint',
        price: parentCard.dataset.price || '450',
        cert: parentCard.dataset.cert || 'PSA-84920194',
        pop: parentCard.dataset.pop || 'Pop Report Verified',
        sport: parentCard.dataset.sport || 'Baseball',
        team: parentCard.dataset.team || 'Exclusive Vault Franchise',
        serial: parentCard.dataset.serial || 'Verified Serial Edition',
        note: parentCard.dataset.note || 'Encased in tamper-proof sonic weld acrylic with certified holographic authenticity.',
        img: parentCard.querySelector('img')?.src || ''
      };

      openCardModal(data);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCardModal);
  if (backdrop) backdrop.addEventListener('click', closeCardModal);

  // Modal Add to Cart / Secure Slab Function
  window.addCurrentModalToCart = function() {
    if (window.currentInspectedCard && window.addToCart) {
      window.addToCart({
        id: String(window.currentInspectedCard.id || 1),
        name: window.currentInspectedCard.title || 'Graded Slab',
        sport: window.currentInspectedCard.sport || 'Sports',
        emoji: '🏆',
        grade: window.currentInspectedCard.grade || 'PSA 10 Gem Mint',
        serial: window.currentInspectedCard.serial || window.currentInspectedCard.cert || 'Certified Slab',
        price: parseFloat(window.currentInspectedCard.price) || 450,
        image: window.currentInspectedCard.img || 'assets/images/shohei-ohtani-17.jpg',
        img: window.currentInspectedCard.img || 'assets/images/shohei-ohtani-17.jpg',
        link: `card-details.html?id=${window.currentInspectedCard.id || 1}`
      });
      closeCardModal();
    }
  };

  const modalAddBtn = modal.querySelector('button[onclick*="Added to Cart"], button[onclick*="Added slab"], button[onclick*="showToast(\'Added"]');
  if (modalAddBtn) {
    modalAddBtn.removeAttribute('onclick');
    modalAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.addCurrentModalToCart();
    });
  }
}

// ==========================================
// 11. Newsletter Form Submissions
// ==========================================
function initNewsletter() {
  document.querySelectorAll('form.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const val = input ? input.value : '';
      if (val) {
        showToast("Success! Welcome to CardVault VIP Club. Check your inbox for 10% off code.", "💎");
        form.reset();
      }
    });
  });
}

// Global Escape Key Handler
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.keyCode === 27) {
    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
      else document.body.classList.remove('overflow-hidden');
      const menuBtn = document.getElementById('mobile-menu-btn');
      if (menuBtn) menuBtn.classList.remove('open');
    }

    // Close quick view modal
    const quickModal = document.getElementById('card-quick-modal');
    if (quickModal && !quickModal.classList.contains('hidden')) {
      quickModal.classList.add('hidden');
      if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
      else document.body.classList.remove('overflow-hidden');
    }
  }
});

// ==========================================
// 12. Master CardVault 24-Card Database
// ==========================================
const CARD_VAULT_DB = [
  // --- BASEBALL SLABS (IDs 1 - 6) ---
  {
    id: 1,
    sport: "baseball",
    sportLabel: "Baseball",
    sportCategory: "Baseball ⚾ • Topps Chrome",
    player: "Shohei Ohtani",
    team: "Los Angeles Dodgers",
    pos: "DH / Two-Way",
    year: "2024",
    cardNumber: "#17",
    title: "2024 Topps Chrome Shohei Ohtani #17",
    set: "Orange Refractor Autograph 50/50 Club Edition",
    price: "$4,850.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-84920194",
    pop: "Pop 4 (0 Higher)",
    serial: "#04/25 Orange",
    rfid: "RFID: CV-8492-0194",
    trend: "+18.4% 90-Day Trend ↗",
    estComp: "$4,600 - $5,200",
    badges: ["50/50 Historic Season", "On-Card Blue Auto", "PSA 10 Gem Mint", "Sonic Weld Tamper Evident"],
    curatorNote: "This piece represents a premier grail artifact commemorating Shohei Ohtani's historic 50/50 season. Encased immediately upon unboxing into an archival inert holder to safeguard the vibrant refractors and pristine foil signatures. No signs of clouding, UV discoloration, or edge flaking observed under UV spectroscopy.",
    subgrades: {
      centering: "10.0",
      centeringNote: "Front 50/50 • Reverse 52/48",
      corners: "10.0",
      cornersNote: "Razor sharp point retention",
      edges: "9.5",
      edgesNote: "Flawless laser chromium trim",
      surface: "10.0",
      surfaceNote: "Zero roller scratches or wax"
    },
    comps: [
      { date: "Sep 28, 2026", platform: "Goldin Elite Auction", grade: "PSA 10", note: "True Color Match", price: "$4,750.00" },
      { date: "Aug 14, 2026", platform: "PWCC Premier Vault", grade: "PSA 10", note: "Refractor Auto", price: "$4,600.00" },
      { date: "Jul 02, 2026", platform: "Heritage Signature", grade: "BGS 9.5", note: "Bookend Serial", price: "$3,950.00" }
    ],
    images: {
      front: "assets/images/shohei-ohtani-17.jpg",
      back: "https://images.unsplash.com/photo-1562077772-3ab12182c3fa?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 2,
    sport: "baseball",
    sportLabel: "Baseball",
    sportCategory: "Baseball ⚾ • Bowman Chrome",
    player: "Paul Skenes",
    team: "Pittsburgh Pirates",
    pos: "Pitcher (RHP)",
    year: "2023",
    cardNumber: "#CPA-PS",
    title: "2023 Bowman Chrome Paul Skenes #CPA-PS",
    set: "1st Bowman Gold Refractor On-Card Auto /50",
    price: "$2,100.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-89210842",
    pop: "Pop 11 (0 Higher)",
    serial: "#18/50 Gold",
    rfid: "RFID: CV-8921-0842",
    trend: "+24.2% 90-Day Trend ↗",
    estComp: "$2,000 - $2,350",
    badges: ["1st Bowman Card", "On-Card Auto", "NL Rookie of Year", "Sonic Sealed"],
    curatorNote: "NL Rookie of the Year 102 MPH ace. The premier modern pitcher prospect 1st Bowman on-card autograph with pristine gold foil refractor sheen and needle-sharp corners.",
    subgrades: {
      centering: "10.0",
      centeringNote: "Centering 50/50 dead center",
      corners: "10.0",
      cornersNote: "Zero tip whitening",
      edges: "10.0",
      edgesNote: "Clean precision foil cut",
      surface: "9.5",
      surfaceNote: "Pristine mirror gloss"
    },
    comps: [
      { date: "Oct 01, 2026", platform: "Goldin Elite Auction", grade: "PSA 10", note: "Gold Refractor", price: "$2,050.00" },
      { date: "Sep 12, 2026", platform: "PWCC Premier Vault", grade: "PSA 10", note: "1st Bowman Auto", price: "$2,120.00" },
      { date: "Aug 20, 2026", platform: "eBay Authenticated", grade: "BGS 9.5", note: "True Gem Mint", price: "$1,820.00" }
    ],
    images: {
      front: "assets/images/paul-skenes-cpaps.jpg",
      back: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 3,
    sport: "baseball",
    sportLabel: "Baseball",
    sportCategory: "Baseball ⚾ • Topps Series 1",
    player: "Elly De La Cruz",
    team: "Cincinnati Reds",
    pos: "Shortstop (SS)",
    year: "2024",
    cardNumber: "#141",
    title: "2024 Topps Series 1 Elly De La Cruz #141",
    set: "Golden Mirror Image Variation Rookie SP",
    price: "$1,650.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-90219482",
    pop: "Pop 14 (0 Higher)",
    serial: "Golden Mirror SSP",
    rfid: "RFID: CV-9021-9482",
    trend: "+12.8% 90-Day Trend ↗",
    estComp: "$1,550 - $1,750",
    badges: ["Golden Mirror SSP", "Rookie Card (RC)", "Bat Flip Variation", "Vault Verified"],
    curatorNote: "Extremely tough 1:1,240 pack pull featuring Elly's celebrated 450-foot bat flip pose in PSA 10 Gem Mint. Back card has official gold embossed serial emblem.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 border ratio",
      corners: "9.5",
      cornersNote: "Crisp micro edges",
      edges: "10.0",
      edgesNote: "Clean die-cut edges",
      surface: "10.0",
      surfaceNote: "Flawless golden chrome"
    },
    comps: [
      { date: "Sep 18, 2026", platform: "Heritage Signature", grade: "PSA 10", note: "Golden Mirror", price: "$1,620.00" },
      { date: "Aug 29, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "SSP Variation", price: "$1,680.00" },
      { date: "Jul 15, 2026", platform: "PWCC Vault", grade: "PSA 9", note: "Near Mint-Mint", price: "$1,100.00" }
    ],
    images: {
      front: "assets/images/elly-de-la-cruz-141.jpg",
      back: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1562077772-3ab12182c3fa?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 4,
    sport: "baseball",
    sportLabel: "Baseball",
    sportCategory: "Baseball ⚾ • 1952 Topps",
    player: "Mickey Mantle",
    team: "New York Yankees",
    pos: "Center Field (CF)",
    year: "1952",
    cardNumber: "#311",
    title: "1952 Topps Mickey Mantle #311",
    set: "Vintage Series High Number Icon Card",
    price: "$125,000.00",
    grade: "PSA 8 NM-MT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-19523110",
    pop: "Pop 3 (1 Higher)",
    serial: "Vintage Series #311",
    rfid: "RFID: CV-1952-3110",
    trend: "+8.5% Historic Annual ↗",
    estComp: "$118,000 - $132,000",
    badges: ["Grail Holy Grail", "Type 1 Vintage", "PSA 8 NM-MT", "Archival Escrow"],
    curatorNote: "The undisputed centerpiece of sports collecting history. Verified authentic 1952 Type 1 card stock with bold turquoise background and vibrant bat tint. Preserved inside dual-chamber tamper-proof slab.",
    subgrades: {
      centering: "9.0",
      centeringNote: "Vintage 54/46 horizontal",
      corners: "8.5",
      cornersNote: "Exceptional corner structure",
      edges: "8.5",
      edgesNote: "Intact cardboard grain",
      surface: "9.0",
      surfaceNote: "Vibrant original inks"
    },
    comps: [
      { date: "Jun 11, 2026", platform: "Heritage Platinum", grade: "PSA 8", note: "High Number 311", price: "$122,500.00" },
      { date: "Mar 04, 2026", platform: "Goldin 100", grade: "PSA 8", note: "Vintage Icon", price: "$128,000.00" },
      { date: "Nov 19, 2025", platform: "Christie's Sports", grade: "SGC 8", note: "Type 1", price: "$119,000.00" }
    ],
    images: {
      front: "assets/images/mickey-mantle-311.jpg",
      back: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 5,
    sport: "baseball",
    sportLabel: "Baseball",
    sportCategory: "Baseball ⚾ • Topps Chrome",
    player: "Aaron Judge",
    team: "New York Yankees",
    pos: "Outfield (OF)",
    year: "2024",
    cardNumber: "#200",
    title: "2024 Topps Chrome Aaron Judge #200",
    set: "Superfractor 1-of-1 True Case Hit",
    price: "$14,200.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-99482014",
    pop: "Pop 1 (None Higher)",
    serial: "#1/1 Superfractor",
    rfid: "RFID: CV-9948-2014",
    trend: "+21.5% 90-Day Trend ↗",
    estComp: "$13,500 - $15,000",
    badges: ["1-of-1 Superfractor", "Case Hit", "AL MVP Season", "PSA 10 Gem Mint"],
    curatorNote: "The holy grail golden spiral refractor honoring Aaron Judge's 58-home-run MVP campaign in PSA 10 Gem Mint. Absolute flawless optical condition with zero refractor lines.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 optical centering",
      corners: "10.0",
      cornersNote: "Four razor sharp points",
      edges: "10.0",
      edgesNote: "Precision laser trim",
      surface: "10.0",
      surfaceNote: "Gold spiral holographic"
    },
    comps: [
      { date: "Aug 02, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "True 1/1 Case Hit", price: "$13,900.00" },
      { date: "May 19, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "Superfractor Auto", price: "$14,500.00" },
      { date: "Feb 10, 2026", platform: "Heritage Auction", grade: "BGS 9.5", note: "1/1 Superfractor", price: "$12,400.00" }
    ],
    images: {
      front: "assets/images/aaron-judge-200.jpg",
      back: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1562077772-3ab12182c3fa?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 6,
    sport: "baseball",
    sportLabel: "Baseball",
    sportCategory: "Baseball ⚾ • Bowman Chrome",
    player: "Jackson Holliday",
    team: "Baltimore Orioles",
    pos: "Shortstop (SS)",
    year: "2024",
    cardNumber: "#BCP-1",
    title: "2024 Bowman Chrome Jackson Holliday #BCP-1",
    set: "Red Refractor On-Card Rookie Auto /5",
    price: "$3,600.00",
    grade: "BGS 9.5 MINT+",
    grader: "BGS (Beckett Grading Services)",
    cert: "BGS-10294819",
    pop: "Pop 2 (0 Higher)",
    serial: "#03/05 Red",
    rfid: "RFID: CV-1029-4819",
    trend: "+15.6% 90-Day Trend ↗",
    estComp: "$3,400 - $3,800",
    badges: ["#1 MLB Prospect", "Red Refractor /5", "Quad 9.5 Subgrades", "On-Card Blue Auto"],
    curatorNote: "#1 MLB overall prospect's ultra-rare Red Refractor rookie auto with quad 9.5 subgrades. Features bold on-card signature in non-fading archival blue ink.",
    subgrades: {
      centering: "9.5",
      centeringNote: "Centering 51/49",
      corners: "9.5",
      cornersNote: "Quad 9.5 points",
      edges: "9.5",
      edgesNote: "Crisp red chromium border",
      surface: "10.0",
      surfaceNote: "Flawless red chrome gloss"
    },
    comps: [
      { date: "Sep 09, 2026", platform: "Goldin Elite", grade: "BGS 9.5", note: "Red Refractor /5", price: "$3,550.00" },
      { date: "Jul 28, 2026", platform: "PWCC Vault", grade: "BGS 9.5", note: "True Gem Auto", price: "$3,700.00" },
      { date: "May 14, 2026", platform: "eBay Authenticated", grade: "PSA 9", note: "Red Auto /5", price: "$2,800.00" }
    ],
    images: {
      front: "assets/images/jackson-holliday-bcp1.jpg",
      back: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=800&q=80"
    }
  },

  // --- BASKETBALL SLABS (IDs 7 - 12) ---
  {
    id: 7,
    sport: "basketball",
    sportLabel: "Basketball",
    sportCategory: "Basketball 🏀 • Topps Chrome",
    player: "Victor Wembanyama",
    team: "San Antonio Spurs",
    pos: "Forward / Center (C/F)",
    year: "2023-24",
    cardNumber: "#1",
    title: "2023-24 Topps Chrome Victor Wembanyama #1",
    set: "Rookie Autograph Black Shimmer /10",
    price: "$12,500.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-92019481",
    pop: "Pop 2 (None Higher)",
    serial: "#07/10 Shimmer",
    rfid: "RFID: CV-9201-9481",
    trend: "+28.4% 90-Day Trend ↗",
    estComp: "$11,800 - $13,200",
    badges: ["Generational RC", "Black Shimmer /10", "PSA 10 Gem Mint", "On-Card Blue Auto"],
    curatorNote: "Generational French sensation's official Topps Chrome rookie signature with pristine 10 corners and centering. The shimmering black refractor surface exhibits zero micro-pitting.",
    subgrades: {
      centering: "10.0",
      centeringNote: "Laser measured 50/50",
      corners: "10.0",
      cornersNote: "Pinpoint geometric corners",
      edges: "10.0",
      edgesNote: "Flawless black refraction edge",
      surface: "10.0",
      surfaceNote: "Specular mirror gloss"
    },
    comps: [
      { date: "Oct 02, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Black Shimmer /10", price: "$12,200.00" },
      { date: "Aug 19, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "Rookie Auto", price: "$12,900.00" },
      { date: "Jun 04, 2026", platform: "Heritage Sports", grade: "BGS 9.5", note: "True Gem", price: "$10,100.00" }
    ],
    images: {
      front: "assets/images/victor-wembanyama-1.jpg",
      back: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 8,
    sport: "basketball",
    sportLabel: "Basketball",
    sportCategory: "Basketball 🏀 • Topps Chrome",
    player: "LeBron James",
    team: "Los Angeles Lakers",
    pos: "Forward (SF/PF)",
    year: "2023-24",
    cardNumber: "#23",
    title: "2023-24 Topps Chrome LeBron James #23",
    set: "Pink Refractor Short Print /15",
    price: "$4,200.00",
    grade: "BGS 9.5 MINT+",
    grader: "BGS (Beckett Grading Services)",
    cert: "BGS-88491024",
    pop: "Pop 3 (0 Higher)",
    serial: "#06/15 Pink",
    rfid: "RFID: CV-8849-1024",
    trend: "+9.2% 90-Day Trend ↗",
    estComp: "$4,000 - $4,500",
    badges: ["40K Points Club", "Pink Refractor /15", "BGS 9.5 Mint+", "Sonic Sealed"],
    curatorNote: "Commemorates LeBron surpassing 40,000 career points in striking pink chromatic refractor finish. Quad subgrades recorded at 9.5 Centering, 9.5 Corners, 9.5 Edges, 10 Surface.",
    subgrades: {
      centering: "9.5",
      centeringNote: "51/49 balanced perimeter",
      corners: "9.5",
      cornersNote: "Pristine point integrity",
      edges: "9.5",
      edgesNote: "Smooth chromatic cut",
      surface: "10.0",
      surfaceNote: "Pink refractor luster"
    },
    comps: [
      { date: "Sep 14, 2026", platform: "Heritage Auction", grade: "BGS 9.5", note: "Pink Refractor /15", price: "$4,150.00" },
      { date: "Jul 21, 2026", platform: "PWCC Vault", grade: "BGS 9.5", note: "Subgrades 9.5+", price: "$4,300.00" },
      { date: "May 08, 2026", platform: "Goldin Elite", grade: "PSA 9", note: "Short Print", price: "$3,200.00" }
    ],
    images: {
      front: "assets/images/lebron-james-23.jpg",
      back: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 9,
    sport: "basketball",
    sportLabel: "Basketball",
    sportCategory: "Basketball 🏀 • Topps Tribute",
    player: "Stephen Curry",
    team: "Golden State Warriors",
    pos: "Point Guard (PG)",
    year: "2023-24",
    cardNumber: "#30",
    title: "2023-24 Topps Tribute Stephen Curry #30",
    set: "Gold Foil On-Card Signature /10",
    price: "$5,100.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-94810239",
    pop: "Pop 1 (None Higher)",
    serial: "#04/10 Gold",
    rfid: "RFID: CV-9481-0239",
    trend: "+14.1% 90-Day Trend ↗",
    estComp: "$4,800 - $5,400",
    badges: ["4x Champion", "On-Card Auto", "Gold Foil /10", "PSA 10 Gem Mint"],
    curatorNote: "4-time NBA Champion and greatest shooter in basketball history with brilliant on-card blue ink signature. Gold foil filigree shows zero flaking or oxidation.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 exact framing",
      corners: "10.0",
      cornersNote: "Unblemished razor tips",
      edges: "10.0",
      edgesNote: "Mirror gold foil trim",
      surface: "10.0",
      surfaceNote: "Clean on-card ink flow"
    },
    comps: [
      { date: "Aug 26, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Gold Foil /10", price: "$5,050.00" },
      { date: "Jun 12, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "On-Card Auto", price: "$5,250.00" },
      { date: "Mar 30, 2026", platform: "Heritage Sports", grade: "BGS 9.5", note: "True Gem", price: "$4,400.00" }
    ],
    images: {
      front: "assets/images/stephen-curry-30.jpg",
      back: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 10,
    sport: "basketball",
    sportLabel: "Basketball",
    sportCategory: "Basketball 🏀 • Topps Chrome",
    player: "Luka Dončić",
    team: "Dallas Mavericks",
    pos: "Point Guard (PG)",
    year: "2023-24",
    cardNumber: "#77",
    title: "2023-24 Topps Chrome Luka Dončić #77",
    set: "1972 Retro Chrome Refractor /50",
    price: "$2,400.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-89201492",
    pop: "Pop 8 (0 Higher)",
    serial: "#23/50 Retro",
    rfid: "RFID: CV-8920-1492",
    trend: "+16.8% 90-Day Trend ↗",
    estComp: "$2,250 - $2,600",
    badges: ["1972 Retro Tribute", "Retro Chrome /50", "Finals Scoring Leader", "PSA 10 Gem Mint"],
    curatorNote: "NBA Finals scoring champion homage to the legendary 1972 Topps basketball hardwood design in Gem Mint. Retains brilliant retro metallic silver finish.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 centered border",
      corners: "10.0",
      cornersNote: "Crisp right angles",
      edges: "9.5",
      edgesNote: "Smooth chromium perimeter",
      surface: "10.0",
      surfaceNote: "Retro gloss brilliance"
    },
    comps: [
      { date: "Sep 22, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "1972 Retro /50", price: "$2,380.00" },
      { date: "Aug 05, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "Refractor /50", price: "$2,450.00" },
      { date: "Jun 19, 2026", platform: "Heritage Auction", grade: "BGS 9.5", note: "Retro Parallel", price: "$2,050.00" }
    ],
    images: {
      front: "assets/images/luka-doncic-77.jpg",
      back: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 11,
    sport: "basketball",
    sportLabel: "Basketball",
    sportCategory: "Basketball 🏀 • Topps Chrome",
    player: "Anthony Edwards",
    team: "Minnesota Timberwolves",
    pos: "Shooting Guard (SG)",
    year: "2023-24",
    cardNumber: "#5",
    title: "2023-24 Topps Chrome Anthony Edwards #5",
    set: "Black Diamond Refractor /25",
    price: "$2,950.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-90184920",
    pop: "Pop 6 (0 Higher)",
    serial: "#11/25 Black",
    rfid: "RFID: CV-9018-4920",
    trend: "+22.9% 90-Day Trend ↗",
    estComp: "$2,800 - $3,200",
    badges: ["Ant-Man Superstar", "Black Diamond /25", "PSA 10 Gem Mint", "High Value Pick"],
    curatorNote: "Explosive highlight reel scoring guard in ultra-limited Obsidian black diamond chrome. Encased in hermetically welded UV shielding crystal slab.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 black diamond trim",
      corners: "10.0",
      cornersNote: "Zero micro-corner wear",
      edges: "10.0",
      edgesNote: "Precision obsidian bevel",
      surface: "9.5",
      surfaceNote: "Deep black mirror polish"
    },
    comps: [
      { date: "Sep 29, 2026", platform: "PWCC Premier", grade: "PSA 10", note: "Black Diamond /25", price: "$2,900.00" },
      { date: "Aug 15, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Color Match", price: "$3,100.00" },
      { date: "Jun 28, 2026", platform: "eBay Authenticated", grade: "PSA 9", note: "Black /25", price: "$2,200.00" }
    ],
    images: {
      front: "assets/images/anthony-edwards-5.jpg",
      back: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 12,
    sport: "basketball",
    sportLabel: "Basketball",
    sportCategory: "Basketball 🏀 • Topps Chrome",
    player: "Shai Gilgeous-Alexander",
    team: "Oklahoma City Thunder",
    pos: "Point Guard (PG)",
    year: "2023-24",
    cardNumber: "#2",
    title: "2023-24 Topps Chrome Shai Gilgeous-Alexander #2",
    set: "Ultraviolet Die-Cut Refractor Auto /10",
    price: "$1,850.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-88291048",
    pop: "Pop 4 (0 Higher)",
    serial: "#02/10 Die-Cut",
    rfid: "RFID: CV-8829-1048",
    trend: "+19.5% 90-Day Trend ↗",
    estComp: "$1,750 - $2,000",
    badges: ["1st Team All-NBA", "Ultraviolet Die-Cut /10", "On-Card Auto", "PSA 10 Gem Mint"],
    curatorNote: "MVP finalist superstar point guard with custom geometric die-cut chromium laser edging. Perfect on-card ink signature inside the designated signing window.",
    subgrades: {
      centering: "10.0",
      centeringNote: "Die-cut symmetric balance",
      corners: "10.0",
      cornersNote: "All 8 die-cut points razor intact",
      edges: "10.0",
      edgesNote: "Laser cut beveling",
      surface: "9.5",
      surfaceNote: "Ultraviolet luster"
    },
    comps: [
      { date: "Oct 05, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Die-Cut Auto /10", price: "$1,800.00" },
      { date: "Aug 11, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "Ultraviolet Refractor", price: "$1,920.00" },
      { date: "Jun 02, 2026", platform: "Heritage Auction", grade: "BGS 9.5", note: "Die-Cut /10", price: "$1,550.00" }
    ],
    images: {
      front: "assets/images/shai-gilgeous-alexander-2.jpg",
      back: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80"
    }
  },

  // --- CRICKET SLABS (IDs 13 - 18) ---
  {
    id: 13,
    sport: "cricket",
    sportLabel: "Cricket",
    sportCategory: "Cricket 🏏 • Topps Chrome",
    player: "Virat Kohli",
    team: "RCB / Team India",
    pos: "Top-Order Batsman",
    year: "2024",
    cardNumber: "#18",
    title: "2024 Topps Cricket Chrome Virat Kohli #18",
    set: "Century Club Red Shimmer Refractor Auto /5",
    price: "$3,200.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-99381023",
    pop: "Pop 1 (None Higher)",
    serial: "#05/05 Red Shimmer",
    rfid: "RFID: CV-9938-1023",
    trend: "+25.6% 90-Day Trend ↗",
    estComp: "$3,000 - $3,500",
    badges: ["King Kohli #18", "Bookend #05/05", "Century Club Auto", "PSA 10 Gem Mint"],
    curatorNote: "Century Club Red Shimmer Refractor with immaculate on-card blue ink autograph. Celebrates Kohli's 50th ODI century with special embossed gold commemorative seal.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 cricket pitch border",
      corners: "10.0",
      cornersNote: "Razor retention",
      edges: "10.0",
      edgesNote: "Deep red shimmer border",
      surface: "10.0",
      surfaceNote: "Pristine autograph clarity"
    },
    comps: [
      { date: "Oct 04, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Red Shimmer /5", price: "$3,150.00" },
      { date: "Aug 18, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "Century Club Auto", price: "$3,300.00" },
      { date: "Jun 10, 2026", platform: "Heritage Sports", grade: "BGS 9.5", note: "True Gem", price: "$2,700.00" }
    ],
    images: {
      front: "assets/images/virat-kohli-18.jpg",
      back: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 14,
    sport: "cricket",
    sportLabel: "Cricket",
    sportCategory: "Cricket 🏏 • Topps Attax",
    player: "Rohit Sharma",
    team: "MI / Team India",
    pos: "Top-Order Batsman / Captain",
    year: "2024",
    cardNumber: "#45",
    title: "2024 Topps Cricket Attax Rohit Sharma #45",
    set: "Century Club On-Card Foil Signature Edition /25",
    price: "$1,850.00",
    grade: "BGS 9.5 MINT+",
    grader: "BGS (Beckett Grading Services)",
    cert: "BGS-99120481",
    pop: "Pop 3 (0 Higher)",
    serial: "#12/25 Foil Auto",
    rfid: "RFID: CV-9912-0481",
    trend: "+17.3% 90-Day Trend ↗",
    estComp: "$1,750 - $2,000",
    badges: ["World Cup Skipper", "264 Record Auto", "BGS 9.5 Mint+", "Foil Stamped"],
    curatorNote: "World Cup winning skipper signature slab with 264 world record commemorative foil stamp. Quad subgrades awarded 9.5 across all inspection vectors.",
    subgrades: {
      centering: "9.5",
      centeringNote: "51/49 Attax frame",
      corners: "9.5",
      cornersNote: "Square corner integrity",
      edges: "9.5",
      edgesNote: "Crisp blue foil rim",
      surface: "10.0",
      surfaceNote: "Foil signature mirror sheen"
    },
    comps: [
      { date: "Sep 15, 2026", platform: "PWCC Vault", grade: "BGS 9.5", note: "Foil Auto /25", price: "$1,800.00" },
      { date: "Jul 30, 2026", platform: "Goldin Elite", grade: "BGS 9.5", note: "Skipper Edition", price: "$1,920.00" },
      { date: "May 22, 2026", platform: "eBay Authenticated", grade: "PSA 9", note: "Auto /25", price: "$1,400.00" }
    ],
    images: {
      front: "assets/images/rohit-sharma-45.jpg",
      back: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 15,
    sport: "cricket",
    sportLabel: "Cricket",
    sportCategory: "Cricket 🏏 • Topps Chrome",
    player: "Sachin Tendulkar",
    team: "Mumbai / Team India Legend",
    pos: "Legend / Master Blaster",
    year: "2024",
    cardNumber: "#10",
    title: "2024 Topps Cricket Chrome Sachin Tendulkar #10",
    set: "Master Blaster Heritage Gold Refractor /50",
    price: "$4,500.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-92019483",
    pop: "Pop 5 (0 Higher)",
    serial: "#10/50 Heritage Gold",
    rfid: "RFID: CV-9201-9483",
    trend: "+11.4% Historic Annual ↗",
    estComp: "$4,300 - $4,800",
    badges: ["100 International Tons", "Jersey Match #10/50", "Hall of Fame", "PSA 10 Gem Mint"],
    curatorNote: "Immortal 100-century milestone tribute card encased in archival PSA 10 casing. Features jersey match serial #10/50 in radiant gold refractor background.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 gold frame",
      corners: "10.0",
      cornersNote: "Flawless corner points",
      edges: "10.0",
      edgesNote: "Precision laser edging",
      surface: "10.0",
      surfaceNote: "Gold refractor brilliance"
    },
    comps: [
      { date: "Oct 01, 2026", platform: "Heritage Sports", grade: "PSA 10", note: "Jersey Match #10/50", price: "$4,650.00" },
      { date: "Aug 10, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Gold Refractor", price: "$4,400.00" },
      { date: "Jun 15, 2026", platform: "PWCC Vault", grade: "BGS 9.5", note: "Heritage Gold", price: "$3,850.00" }
    ],
    images: {
      front: "assets/images/sachin-tendulkar-10.jpg",
      back: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 16,
    sport: "cricket",
    sportLabel: "Cricket",
    sportCategory: "Cricket 🏏 • Topps Chrome",
    player: "Jasprit Bumrah",
    team: "MI / Team India",
    pos: "Pace Bowler",
    year: "2024",
    cardNumber: "#93",
    title: "2024 Topps Cricket Chrome Jasprit Bumrah #93",
    set: "Yorker King Holographic Shimmer Auto /25",
    price: "$1,450.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-87391024",
    pop: "Pop 7 (0 Higher)",
    serial: "#08/25 Yorker",
    rfid: "RFID: CV-8739-1024",
    trend: "+21.0% 90-Day Trend ↗",
    estComp: "$1,350 - $1,600",
    badges: ["T20 WC MVP", "Yorker King Auto", "Shimmer Chrome /25", "PSA 10 Gem Mint"],
    curatorNote: "T20 World Cup Player of the Tournament autograph card with holographic laser refractors. Uncut foil registration lines validated via infrared spectroscopy.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 symmetric layout",
      corners: "10.0",
      cornersNote: "Four needle corners",
      edges: "9.5",
      edgesNote: "Holographic edge trim",
      surface: "10.0",
      surfaceNote: "Laser shimmer refractor"
    },
    comps: [
      { date: "Sep 25, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Yorker Auto /25", price: "$1,420.00" },
      { date: "Aug 08, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "WC MVP Shimmer", price: "$1,500.00" },
      { date: "Jul 11, 2026", platform: "eBay Authenticated", grade: "PSA 9", note: "Shimmer /25", price: "$1,050.00" }
    ],
    images: {
      front: "assets/images/jasprit-bumrah-93.jpg",
      back: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 17,
    sport: "cricket",
    sportLabel: "Cricket",
    sportCategory: "Cricket 🏏 • Topps Attax",
    player: "MS Dhoni",
    team: "CSK / Chennai",
    pos: "Wicket-Keeper / Finisher",
    year: "2024",
    cardNumber: "#7",
    title: "2024 Topps Cricket Attax MS Dhoni #7",
    set: "World Cup Winning Captain Gold Signature /10",
    price: "$5,200.00",
    grade: "BGS 10 PRISTINE",
    grader: "BGS (Beckett Grading Services)",
    cert: "BGS-10029384",
    pop: "Pop 2 (None Higher)",
    serial: "#07/10 Jersey",
    rfid: "RFID: CV-1002-9384",
    trend: "+19.8% 90-Day Trend ↗",
    estComp: "$5,000 - $5,600",
    badges: ["Thala #7 Match", "BGS 10 Pristine", "Captain Gold /10", "Grail Slab"],
    curatorNote: "Rare BGS 10 Pristine black label candidate with iconic jersey match serial #07/10. Encapsulates Captain Cool's legendary finishing career in pure gold foil.",
    subgrades: {
      centering: "10.0",
      centeringNote: "Perfect 50/50 Quad 10",
      corners: "10.0",
      cornersNote: "Pristine microscopic points",
      edges: "10.0",
      edgesNote: "Flawless laser cut",
      surface: "10.0",
      surfaceNote: "Gold foil mirror perfection"
    },
    comps: [
      { date: "Oct 06, 2026", platform: "Goldin Elite", grade: "BGS 10", note: "Jersey Match #07/10", price: "$5,350.00" },
      { date: "Aug 22, 2026", platform: "PWCC Vault", grade: "BGS 10", note: "Pristine Label", price: "$5,100.00" },
      { date: "Jun 18, 2026", platform: "Heritage Sports", grade: "PSA 10", note: "Gold Signature", price: "$4,400.00" }
    ],
    images: {
      front: "assets/images/ms-dhoni-topps-chrome-vault.jpg",
      back: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 18,
    sport: "cricket",
    sportLabel: "Cricket",
    sportCategory: "Cricket 🏏 • Topps Chrome",
    player: "Shubman Gill",
    team: "Gujarat Titans / Team India",
    pos: "Top-Order Batsman",
    year: "2024",
    cardNumber: "#77",
    title: "2024 Topps Cricket Chrome Shubman Gill #77",
    set: "Next Gen Diamond Refractor Rookie Auto /99",
    price: "$950.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-91048291",
    pop: "Pop 12 (0 Higher)",
    serial: "#44/99 Diamond",
    rfid: "RFID: CV-9104-8291",
    trend: "+14.5% 90-Day Trend ↗",
    estComp: "$900 - $1,050",
    badges: ["Next Gen Prince", "Diamond Auto /99", "On-Card Blue Ink", "PSA 10 Gem Mint"],
    curatorNote: "Franchise captain and future batting crown heir with high-grade on-card blue autograph. The diamond cracked-ice refractive grid reflects full rainbow dispersion.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 geometric spacing",
      corners: "9.5",
      cornersNote: "Crisp micro tips",
      edges: "10.0",
      edgesNote: "Precision diamond edging",
      surface: "10.0",
      surfaceNote: "Cracked ice luster"
    },
    comps: [
      { date: "Sep 20, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Diamond Auto /99", price: "$940.00" },
      { date: "Aug 02, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "Next Gen RC", price: "$980.00" },
      { date: "Jun 24, 2026", platform: "eBay Authenticated", grade: "PSA 9", note: "Diamond /99", price: "$720.00" }
    ],
    images: {
      front: "assets/images/shubman-gill-77.jpg",
      back: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=800&q=80"
    }
  },

  // --- FOOTBALL SLABS (IDs 19 - 24) ---
  {
    id: 19,
    sport: "football",
    sportLabel: "Football",
    sportCategory: "Football 🏈 • Topps Composite",
    player: "C.J. Stroud",
    team: "Houston Texans",
    pos: "Quarterback (QB)",
    year: "2024",
    cardNumber: "#100",
    title: "2024 Topps Composite CJ Stroud #100",
    set: "Cosmic Refractor Rookie Autograph /50",
    price: "$2,750.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-77192849",
    pop: "Pop 7 (0 Higher)",
    serial: "#18/50 Cosmic",
    rfid: "RFID: CV-7719-2849",
    trend: "+23.1% 90-Day Trend ↗",
    estComp: "$2,600 - $3,000",
    badges: ["OROY Winner", "Cosmic Chrome /50", "Official Rookie (RC)", "PSA 10 Gem Mint"],
    curatorNote: "Offensive Rookie of the Year interstellar cosmic refractor on-card autograph. Starlight pattern shows exceptional planetary depth and zero print lines under magnification.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 cosmic alignment",
      corners: "10.0",
      cornersNote: "Razor precision corners",
      edges: "9.5",
      edgesNote: "Chrome composite edge",
      surface: "10.0",
      surfaceNote: "Cosmic stellar gloss"
    },
    comps: [
      { date: "Oct 03, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Cosmic Auto /50", price: "$2,720.00" },
      { date: "Aug 25, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "OROY Rookie", price: "$2,850.00" },
      { date: "Jun 30, 2026", platform: "Heritage Sports", grade: "BGS 9.5", note: "True Gem", price: "$2,350.00" }
    ],
    images: {
      front: "assets/images/cj-stroud-100.jpg",
      back: "https://images.unsplash.com/photo-1587385789097-0197a7fbd179?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 20,
    sport: "football",
    sportLabel: "Football",
    sportCategory: "Football 🏈 • Topps Composite",
    player: "Caleb Williams",
    team: "Chicago Bears",
    pos: "Quarterback (QB)",
    year: "2024",
    cardNumber: "#1",
    title: "2024 Topps Composite Caleb Williams #1",
    set: "Red Refractor 1st Overall Pick Rookie Auto /10",
    price: "$3,100.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-10082914",
    pop: "Pop 3 (None Higher)",
    serial: "#01/10 Bookend",
    rfid: "RFID: CV-1008-2914",
    trend: "+26.8% 90-Day Trend ↗",
    estComp: "$2,950 - $3,300",
    badges: ["#1 Overall Pick", "Bookend #01/10", "Red Refractor Auto", "PSA 10 Gem Mint"],
    curatorNote: "#1 Overall Draft Pick true red rookie refractor with bookend serial #01/10. Stamped with certified Topps holographic authentic tamper seal.",
    subgrades: {
      centering: "10.0",
      centeringNote: "Dead-center 50/50",
      corners: "10.0",
      cornersNote: "Unflawed corner retention",
      edges: "10.0",
      edgesNote: "Red chromium perimeter",
      surface: "9.5",
      surfaceNote: "High-specular red refractor"
    },
    comps: [
      { date: "Oct 05, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Bookend #01/10", price: "$3,180.00" },
      { date: "Aug 29, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "1st Pick Auto", price: "$3,050.00" },
      { date: "Jul 08, 2026", platform: "Heritage Auction", grade: "BGS 9.5", note: "Red Auto /10", price: "$2,600.00" }
    ],
    images: {
      front: "assets/images/caleb-williams-1.jpg",
      back: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 21,
    sport: "football",
    sportLabel: "Football",
    sportCategory: "Football 🏈 • Topps Composite",
    player: "Patrick Mahomes",
    team: "Kansas City Chiefs",
    pos: "Quarterback (QB)",
    year: "2024",
    cardNumber: "#15",
    title: "2024 Topps Composite Patrick Mahomes #15",
    set: "Helix Chromatic Case Hit Superfractor 1/1",
    price: "$18,900.00",
    grade: "BGS 10 PRISTINE",
    grader: "BGS (Beckett Grading Services)",
    cert: "BGS-10082938",
    pop: "Pop 1 (None Higher)",
    serial: "1/1 Superfractor",
    rfid: "RFID: CV-1008-2938",
    trend: "+20.4% 90-Day Trend ↗",
    estComp: "$17,500 - $20,000",
    badges: ["1-of-1 Superfractor", "Case Hit Helix", "3x SB MVP", "BGS 10 Pristine"],
    curatorNote: "The Holy Grail of modern football cards. Authentic 1-of-1 Superfractor case hit slabbed Pristine 10 by Beckett. Dual-swirl circular diffraction pattern with zero hairline flaws.",
    subgrades: {
      centering: "10.0",
      centeringNote: "Flawless Quad 10 Candidate",
      corners: "10.0",
      cornersNote: "Laser-tested corner geometry",
      edges: "10.0",
      edgesNote: "Golden spiral rim",
      surface: "10.0",
      surfaceNote: "Superfractor 1/1 luster"
    },
    comps: [
      { date: "Sep 27, 2026", platform: "Goldin Elite 100", grade: "BGS 10", note: "1/1 Superfractor", price: "$18,500.00" },
      { date: "Jul 14, 2026", platform: "PWCC Vault", grade: "BGS 10", note: "Case Hit Grail", price: "$19,200.00" },
      { date: "Apr 09, 2026", platform: "Heritage Platinum", grade: "PSA 10", note: "1/1 Auto", price: "$17,000.00" }
    ],
    images: {
      front: "assets/images/patrick-mahomes-15.jpg",
      back: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1587385789097-0197a7fbd179?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 22,
    sport: "football",
    sportLabel: "Football",
    sportCategory: "Football 🏈 • Topps Composite",
    player: "Jayden Daniels",
    team: "Washington Commanders",
    pos: "Quarterback (QB)",
    year: "2024",
    cardNumber: "#5",
    title: "2024 Topps Composite Jayden Daniels #5",
    set: "True Color Match Refractor Rookie Patch Auto /25",
    price: "$2,250.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-98210394",
    pop: "Pop 6 (0 Higher)",
    serial: "#05/25 Match",
    rfid: "RFID: CV-9821-0394",
    trend: "+28.7% 90-Day Trend ↗",
    estComp: "$2,100 - $2,450",
    badges: ["Color Match", "3-Color Patch Auto", "Jersey Match #05/25", "PSA 10 Gem Mint"],
    curatorNote: "Dual-threat sensation burgundy color match slab with 3-color game-used relic patch and signature. Centered with pristine foil stamping and zero window fraying.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 frame balance",
      corners: "10.0",
      cornersNote: "Sharp intact tips",
      edges: "9.5",
      edgesNote: "Clean composite trim",
      surface: "10.0",
      surfaceNote: "Burgundy color match gloss"
    },
    comps: [
      { date: "Oct 02, 2026", platform: "PWCC Premier", grade: "PSA 10", note: "Patch Auto /25", price: "$2,200.00" },
      { date: "Sep 11, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Jersey Match #5", price: "$2,350.00" },
      { date: "Jul 19, 2026", platform: "eBay Authenticated", grade: "BGS 9.5", note: "Patch Auto", price: "$1,850.00" }
    ],
    images: {
      front: "assets/images/jayden-daniels-5.jpg",
      back: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 23,
    sport: "football",
    sportLabel: "Football",
    sportCategory: "Football 🏈 • Topps Composite",
    player: "Marvin Harrison Jr",
    team: "Arizona Cardinals",
    pos: "Wide Receiver (WR)",
    year: "2024",
    cardNumber: "#18",
    title: "2024 Topps Composite Marvin Harrison Jr #18",
    set: "Gold Wave On-Card Rookie Autograph /50",
    price: "$1,350.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-94820194",
    pop: "Pop 9 (0 Higher)",
    serial: "#18/50 Jersey",
    rfid: "RFID: CV-9482-0194",
    trend: "+16.2% 90-Day Trend ↗",
    estComp: "$1,250 - $1,450",
    badges: ["WR1 Prospect", "Gold Wave /50", "Jersey Match #18/50", "PSA 10 Gem Mint"],
    curatorNote: "Elite wide receiver prospect gold wave rookie card with bold blue ink signature. Features jersey match serial #18/50 in radiant gold refractor background.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 wave alignment",
      corners: "9.5",
      cornersNote: "Microscopic corner structure",
      edges: "10.0",
      edgesNote: "Gold wave laser edge",
      surface: "10.0",
      surfaceNote: "Fluid wave refraction"
    },
    comps: [
      { date: "Sep 28, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Jersey Match #18", price: "$1,340.00" },
      { date: "Aug 16, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "Gold Wave Auto", price: "$1,400.00" },
      { date: "Jun 29, 2026", platform: "Heritage Sports", grade: "PSA 9", note: "Gold Wave /50", price: "$1,020.00" }
    ],
    images: {
      front: "assets/images/marvin-harrison-18.jpg",
      back: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 24,
    sport: "football",
    sportLabel: "Football",
    sportCategory: "Football 🏈 • Topps Composite",
    player: "Brock Purdy",
    team: "San Francisco 49ers",
    pos: "Quarterback (QB)",
    year: "2024",
    cardNumber: "#13",
    title: "2024 Topps Composite Brock Purdy #13",
    set: "NFC Championship Red Ice Refractor /10",
    price: "$1,950.00",
    grade: "PSA 10 GEM MINT",
    grader: "PSA (Professional Sports Authenticator)",
    cert: "PSA-93810294",
    pop: "Pop 5 (0 Higher)",
    serial: "#09/10 Red Ice",
    rfid: "RFID: CV-9381-0294",
    trend: "+18.9% 90-Day Trend ↗",
    estComp: "$1,800 - $2,100",
    badges: ["NFC Champion QB", "Red Ice Refractor /10", "Low Pop Grail", "PSA 10 Gem Mint"],
    curatorNote: "NFC Champion QB low-pop red ice cracked ice refractor with sparkling surface condition. Enclosed inside airtight ultrasonically bonded archival acrylic.",
    subgrades: {
      centering: "10.0",
      centeringNote: "50/50 red ice frame",
      corners: "10.0",
      cornersNote: "Needle tip preservation",
      edges: "9.5",
      edgesNote: "Cracked ice laser cut",
      surface: "10.0",
      surfaceNote: "Red ice crystalline sheen"
    },
    comps: [
      { date: "Oct 04, 2026", platform: "Goldin Elite", grade: "PSA 10", note: "Red Ice /10", price: "$1,920.00" },
      { date: "Aug 12, 2026", platform: "PWCC Vault", grade: "PSA 10", note: "NFC Champ Refractor", price: "$2,010.00" },
      { date: "Jul 01, 2026", platform: "eBay Authenticated", grade: "BGS 9.5", note: "Cracked Ice", price: "$1,600.00" }
    ],
    images: {
      front: "assets/images/brock-purdy-13.jpg",
      back: "https://images.unsplash.com/photo-1587385789097-0197a7fbd179?auto=format&fit=crop&w=800&q=80",
      micro: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80"
    }
  }
];

// Active Card in Details Page Context
window.currentCardData = null;

// ==========================================
// 13. Dedicated Card Details Page Engine
// ==========================================
function initCardDetailsPage() {
  const titleEl = document.getElementById('d-card-title');
  if (!titleEl) return; // Not on card-details.html

  // Read card ID from URL ?id=X
  const urlParams = new URLSearchParams(window.location.search);
  const cardIdParam = parseInt(urlParams.get('id'), 10);
  const card = CARD_VAULT_DB.find(c => c.id === cardIdParam) || CARD_VAULT_DB[0];
  window.currentCardData = card;

  // Dynamic Browser Tab Title
  document.title = `${card.title} (${card.grade}) | CardVault`;

  // 1. Breadcrumbs
  const bSport = document.getElementById('d-breadcrumb-sport');
  const bSportLink = document.getElementById('d-breadcrumb-sport-link');
  const bTitle = document.getElementById('d-breadcrumb-title');
  if (bSport) bSport.textContent = card.sportLabel;
  if (bSportLink) bSportLink.href = `category.html?type=${card.sport}`;
  if (bTitle) bTitle.textContent = card.title;

  // 2. Hero Visuals & Badges
  const cardImg = document.getElementById('d-card-img');
  const gradeBadge = document.getElementById('d-card-grade-badge');
  const serialPill = document.getElementById('d-card-serial-pill');
  const rfidEl = document.getElementById('d-card-rfid');
  if (cardImg) {
    if (!cardImg.src || !cardImg.src.includes(card.images.front)) {
      cardImg.src = card.images.front;
    }
    cardImg.alt = card.title;
    cardImg.style.filter = '';
    cardImg.style.transform = '';
    cardImg.onerror = function() {
      this.src = card.images.front;
    };
  }
  if (gradeBadge) gradeBadge.textContent = card.grade;
  if (serialPill) serialPill.textContent = card.serial;
  if (rfidEl) rfidEl.textContent = card.rfid;

  // 3. Hero Titles, Set & Overview Pills
  const sportPill = document.getElementById('d-card-sport-pill');
  const posPill = document.getElementById('d-card-pos-pill');
  const setEl = document.getElementById('d-card-set');
  const certEl = document.getElementById('d-card-cert');
  const popEl = document.getElementById('d-card-pop');
  const serialCodeEl = document.getElementById('d-card-serial-code');
  const priceEl = document.getElementById('d-card-price');

  if (sportPill) sportPill.textContent = card.sportCategory;
  if (posPill) posPill.textContent = card.pos;
  if (titleEl) titleEl.textContent = card.title;
  if (setEl) setEl.textContent = card.set;
  if (certEl) certEl.textContent = card.cert;
  if (popEl) popEl.textContent = card.pop;
  if (serialCodeEl) serialCodeEl.textContent = card.serial;
  if (priceEl) priceEl.textContent = card.price;

  const trendEl = document.getElementById('d-card-trend');
  const estCompEl = document.getElementById('d-card-est-comp');
  if (trendEl && card.trend) trendEl.textContent = card.trend;
  if (estCompEl && card.estComp) estCompEl.textContent = `Estimated Comp: ${card.estComp}`;

  // 4. Badges Container
  const badgesContainer = document.getElementById('d-card-badges-container');
  if (badgesContainer && card.badges) {
    badgesContainer.innerHTML = card.badges.map(b => `
      <span class="px-3 py-1 rounded-xl bg-cherry-500/10 text-cherry-500 font-bold text-xs border border-cherry-500/20">${b}</span>
    `).join('');
  }

  // 5. Structured Technical Specifications
  const sSport = document.getElementById('d-spec-sport');
  const sPlayer = document.getElementById('d-spec-player');
  const sTeam = document.getElementById('d-spec-team');
  const sPos = document.getElementById('d-spec-pos');
  const sYear = document.getElementById('d-spec-year');
  const sNum = document.getElementById('d-spec-num');
  const sSet = document.getElementById('d-spec-set');
  const sParallel = document.getElementById('d-spec-parallel');
  const sSerial = document.getElementById('d-spec-serial');
  const sGrader = document.getElementById('d-spec-grader');
  const sCert = document.getElementById('d-spec-cert');
  const sPop = document.getElementById('d-spec-pop');

  if (sSport) sSport.textContent = card.sportCategory;
  if (sPlayer) sPlayer.textContent = card.player;
  if (sTeam) sTeam.textContent = card.team;
  if (sPos) sPos.textContent = card.pos;
  if (sYear && card.year) sYear.textContent = card.year;
  if (sNum && card.cardNumber) sNum.textContent = card.cardNumber;
  if (sSet) sSet.textContent = card.set;
  if (sParallel) sParallel.textContent = card.serial;
  if (sSerial) sSerial.textContent = card.serial;
  if (sGrader) sGrader.textContent = card.grader;
  if (sCert) sCert.textContent = card.cert;
  if (sPop) sPop.textContent = card.pop;

  // 6. Subgrades
  if (card.subgrades) {
    const cVal = document.getElementById('d-sub-centering-val');
    const cNote = document.getElementById('d-sub-centering-note');
    const cBar = document.getElementById('d-sub-centering-bar');
    if (cVal) cVal.textContent = card.subgrades.centering;
    if (cNote) cNote.textContent = card.subgrades.centeringNote;
    if (cBar) cBar.style.width = `${parseFloat(card.subgrades.centering) * 10}%`;

    const kVal = document.getElementById('d-sub-corners-val');
    const kNote = document.getElementById('d-sub-corners-note');
    const kBar = document.getElementById('d-sub-corners-bar');
    if (kVal) kVal.textContent = card.subgrades.corners;
    if (kNote) kNote.textContent = card.subgrades.cornersNote;
    if (kBar) kBar.style.width = `${parseFloat(card.subgrades.corners) * 10}%`;

    const eVal = document.getElementById('d-sub-edges-val');
    const eNote = document.getElementById('d-sub-edges-note');
    const eBar = document.getElementById('d-sub-edges-bar');
    if (eVal) eVal.textContent = card.subgrades.edges;
    if (eNote) eNote.textContent = card.subgrades.edgesNote;
    if (eBar) eBar.style.width = `${parseFloat(card.subgrades.edges) * 10}%`;

    const sfVal = document.getElementById('d-sub-surface-val');
    const sfNote = document.getElementById('d-sub-surface-note');
    const sfBar = document.getElementById('d-sub-surface-bar');
    if (sfVal) sfVal.textContent = card.subgrades.surface;
    if (sfNote) sfNote.textContent = card.subgrades.surfaceNote;
    if (sfBar) sfBar.style.width = `${parseFloat(card.subgrades.surface) * 10}%`;
  }

  // 7. Curator Note
  const curatorNoteEl = document.getElementById('d-card-curator-note');
  if (curatorNoteEl) curatorNoteEl.textContent = card.curatorNote;

  // 8. Market Comps Table
  const compsTbody = document.getElementById('d-comps-tbody');
  if (compsTbody && card.comps) {
    compsTbody.innerHTML = card.comps.map(comp => `
      <tr class="hover:bg-gray-50/50 dark:hover:bg-vault-card/50 transition">
        <td class="p-3 text-gray-400">${comp.date}</td>
        <td class="p-3 font-bold text-gray-900 dark:text-white">${comp.platform}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded bg-cherry-500/10 text-cherry-500 font-bold">${comp.grade}</span></td>
        <td class="p-3 text-gray-500">${comp.note}</td>
        <td class="p-3 text-right font-black text-gray-900 dark:text-white">${comp.price}</td>
      </tr>
    `).join('');
  }

  // 9. Related Slabs in Same Sport Category
  const relSportLabel = document.getElementById('d-related-sport-label');
  const relCatLink = document.getElementById('d-view-all-category-link');
  if (relSportLabel) relSportLabel.textContent = card.sportLabel;
  if (relCatLink) relCatLink.href = `category.html?type=${card.sport}`;

  const relContainer = document.getElementById('d-related-cards-grid');
  if (relContainer) {
    const relatedCards = CARD_VAULT_DB.filter(c => c.sport === card.sport && c.id !== card.id).slice(0, 3);
    relContainer.innerHTML = relatedCards.map(rc => `
      <div class="rounded-2xl bg-white dark:bg-vault-card border border-gray-200 dark:border-vault-border p-4 hover:shadow-xl transition flex flex-col justify-between group h-full">
        <div>
          <a href="card-details.html?id=${rc.id}" class="block relative rounded-xl overflow-hidden bg-vault-deep aspect-[3/4] mb-3 holo-shimmer border border-gray-100 dark:border-vault-border">
            <img src="${rc.images.front}" alt="${rc.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="card-grade absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-cherry-500 text-white font-black text-[10px] tracking-wider shadow">
              ${rc.grade}
            </div>
            <div class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 backdrop-blur text-bubblegum font-bold text-[10px]">
              ${rc.serial}
            </div>
          </a>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase text-cherry-500 tracking-wider">${rc.sportCategory}</span>
            <span class="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-vault px-1.5 py-0.5 rounded">${rc.pos}</span>
          </div>
          <h3 class="card-title font-bold text-sm text-gray-900 dark:text-white mt-1 group-hover:text-cherry-500 transition line-clamp-1 min-h-[1.5rem] flex items-center">
            <a href="card-details.html?id=${rc.id}">${rc.title}</a>
          </h3>
          <p class="card-set text-xs text-gray-500 mt-0.5 line-clamp-1 min-h-[1.25rem] flex items-center">${rc.set}</p>
        </div>
        <div class="mt-auto pt-3.5 border-t border-gray-100 dark:border-vault-border flex items-center justify-between">
          <div>
            <span class="text-[9px] text-gray-400 uppercase font-black tracking-wider block">Buy Now</span>
            <div class="text-base font-black text-gray-900 dark:text-white font-heading">${rc.price}</div>
          </div>
          <div class="flex items-center gap-1.5">
            <a href="card-details.html?id=${rc.id}" class="p-2 rounded-xl bg-gray-100 dark:bg-vault hover:bg-gray-200 dark:hover:bg-vault-light text-gray-700 dark:text-gray-300 text-xs font-bold transition flex items-center gap-1" title="Inspect Full Card Details">
              <svg class="w-3.5 h-3.5 text-cherry-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
            </a>
            <a href="card-details.html?id=${rc.id}" class="bg-cherry-500 hover:bg-cherry-600 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-cherry-500/25">
              View
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Interactive Slab Inspection Angle Switcher
window.switchSlabView = function(view) {
  const cardImg = document.getElementById('d-card-img');
  if (!cardImg || !window.currentCardData) return;

  const btnFront = document.getElementById('btn-slab-front');
  const btnBack = document.getElementById('btn-slab-back');
  const btnMicro = document.getElementById('btn-slab-micro');

  const buttons = [
    { el: btnFront, key: 'front' },
    { el: btnBack, key: 'back' },
    { el: btnMicro, key: 'micro' }
  ];

  buttons.forEach(b => {
    if (!b.el) return;
    if (b.key === view) {
      b.el.classList.add('border-2', 'border-cherry-500');
      b.el.classList.remove('border', 'border-gray-200', 'dark:border-vault-border');
      const spanTitle = b.el.querySelector('span:first-child');
      if (spanTitle) {
        spanTitle.classList.add('text-cherry-500');
        spanTitle.classList.remove('text-gray-400');
      }
    } else {
      b.el.classList.remove('border-2', 'border-cherry-500');
      b.el.classList.add('border', 'border-gray-200', 'dark:border-vault-border');
      const spanTitle = b.el.querySelector('span:first-child');
      if (spanTitle) {
        spanTitle.classList.remove('text-cherry-500');
        spanTitle.classList.add('text-gray-400');
      }
    }
  });

  if (view === 'front') {
    cardImg.src = window.currentCardData.images.front;
    cardImg.style.filter = '';
    cardImg.style.transform = '';
    showToast("Front high-def slab scan displayed", "🔍");
  } else if (view === 'back') {
    cardImg.src = window.currentCardData.images.front;
    cardImg.style.filter = 'drop-shadow(0 0 16px rgba(247, 197, 204, 0.45)) hue-rotate(25deg)';
    cardImg.style.transform = 'scaleX(-1)';
    showToast("Reverse hologram & certification bar displayed", "🔄");
  } else if (view === 'micro') {
    cardImg.src = window.currentCardData.images.front;
    cardImg.style.filter = 'contrast(1.22) saturate(1.3) brightness(1.04)';
    cardImg.style.transform = 'scale(1.25)';
    showToast("10x Microscopic subgrade inspection active", "🔬");
  }
};

// ==========================================
// 15. Dynamic Blog Details System
// ==========================================
window.BLOG_POSTS_DB = [
  {
    id: 1,
    title: "The $5M Modern Topps Chrome Phenomenon: Shohei Ohtani & Paul Skenes",
    shortTitle: "Modern Topps Chrome Phenomenon",
    categoryBadge: "MARKET INTEL REPORT",
    sport: "Baseball ⚾",
    author: "David Sterling",
    authorInitials: "DS",
    date: "October 16, 2026",
    readTime: "8 Min Read",
    shares: "1,824 Shares",
    image: "assets/images/blog-hero-topps-chrome-phenomenon.jpg",
    takeaways: [
      "<strong>The /25 Orange Ceiling:</strong> Historically, Topps Chrome Orange Refractors (/25) appreciate 40% faster than Gold /50 due to psychological collector scarcity tiers.",
      "<strong>Paul Skenes Velocity:</strong> 1st Bowman Chrome autos from 2023 have surpassed all rookie pitching benchmarks since Stephen Strasburg in 2010.",
      "<strong>Gem Mint Ratios:</strong> Chrome chromium stock suffers from roller line print flaws, creating low PSA 10 gem rates (under 28% on base refractors)."
    ],
    bodyHtml1: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        The Historical Shift to Chromium Card Stock
      </h2>
      <p>
        When Topps introduced the Chrome line in 1996, purists were initially skeptical of the metallic mirror finish. Fast forward three decades: Topps Chrome and Bowman Chrome have established an uncontested monopoly as the definitive rookie card stock for professional baseball.
      </p>
      <p>
        With Shohei Ohtani capturing universal acclaim following his historic 50/50 season, his 2018 Topps Chrome #150 Orange Refractor auto (/25) has reached astronomical private sales volume. Bidders in CardVault's Beverly Hills private treaty sales routinely battle past seven-figure reserves for clean PSA 10 specimens.
      </p>
    `,
    tableHtml: `
      <h3 class="text-lg font-black text-gray-900 dark:text-white font-heading mb-3">Forensic Subgrade Metric Checklist</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-200 dark:border-vault-border rounded-xl overflow-hidden">
          <thead class="bg-gray-100 dark:bg-vault-card font-bold text-gray-900 dark:text-white">
            <tr>
              <th class="p-3 text-left">Subgrade</th>
              <th class="p-3 text-left">Common Chromium Flaw</th>
              <th class="p-3 text-left">PSA 10 Tolerance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-vault-border bg-white dark:bg-vault">
            <tr>
              <td class="p-3 font-bold text-cherry-500">Centering</td>
              <td class="p-3">Horizontal shift toward right border</td>
              <td class="p-3">Strict 55/45 Front, 75/25 Back</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">Surface</td>
              <td class="p-3">Factory roller marks and micro-dimples</td>
              <td class="p-3">Zero surface indentation under 10x light</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">Corners</td>
              <td class="p-3">Chrome foil peeling at sharp 90° tips</td>
              <td class="p-3">Sharp razor edges without whitening</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    quote: "A raw card in a binder represents potential; a PSA 10 slab in a Class 3 vault represents institutional collateral.",
    quoteAuthor: "— Dr. Sarah Lin, Chief Conservator at CardVault",
    bodyHtml2: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        Paul Skenes: Redefining Pitcher Card Valuations
      </h2>
      <p>
        Historically, position players dominate the hobby while pitchers face durability discounts. Paul Skenes shattered this historical paradigm. His 2023 Bowman Chrome Draft 1st Bowman Gold Refractor auto (/50) has defied every traditional downward trend, maintaining a 94% price premium over position player peers.
      </p>
      <p>
        With 100+ MPH four-seam fastballs and devastating splinker movement, Skenes commands auction floor excitement rivaled only by Ohtani and Aaron Judge. Collectors looking to diversify their portfolio are shifting capital into serial-numbered Bowman Chrome 1sts with verified 10/10 subgrade designations.
      </p>
    `,
    authorBox: {
      name: "David Sterling",
      bio: "Co-Founder & Head of Acquisitions at CardVault. Leading broker of pre-war baseball and modern Topps Chrome grails with 22 years in alternative asset advisory.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    comments: [
      { author: "Marcus Vance", time: "2 hours ago", text: "Spot on analysis regarding the /25 Orange Refractors. The color match on Baltimore or Giants cards is also commanding a 20% visual premium." },
      { author: "Kenji Takahashi", time: "5 hours ago", text: "The Ohtani market in Tokyo is completely sold out of true PSA 10 chrome rookies. If you hold one in the vault, hold tightly." }
    ],
    featuredSlab: {
      title: "2018 Topps Chrome Ohtani /25",
      price: "$4,850.00",
      link: "category.html?type=baseball"
    }
  },
  {
    id: 2,
    title: "Victor Wembanyama's Rookie Market Cap Reaches Historic Heights",
    shortTitle: "Wembanyama Rookie Market Cap",
    categoryBadge: "BASKETBALL INTEL • MODERN",
    sport: "Basketball 🏀",
    author: "Elena Rostova",
    authorInitials: "ER",
    date: "October 14, 2026",
    readTime: "6 Min Read",
    shares: "2,410 Shares",
    image: "assets/images/blog-wembanyama-superfractor-topps.jpg",
    takeaways: [
      "<strong>Generational Deficit:</strong> Wembanyama rookie cards represent the highest single-player aggregate dollar volume since LeBron James in 2003-04.",
      "<strong>Chrome vs. Prizm Battle:</strong> Fanatics/Topps regaining NBA licensing has positioned 2023-24 Topps Chrome #1 as the primary on-card autograph target over competing unlicensed parallels.",
      "<strong>Condition Scarcity:</strong> The high-gloss dark borders on 2023-24 Chrome basketball make edge chipping prevalent, keeping PSA 10 gem rates under 22%."
    ],
    bodyHtml1: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        The French Phenom's Commercial Tidal Wave
      </h2>
      <p>
        Standing 7-foot-4 with a guard's perimeter package and an eight-foot wingspan, Victor Wembanyama entered the NBA with unprecedented anticipation. What hobby analysts did not anticipate was the velocity with which his secondary market pricing would mature from speculative prospect pricing into established blue-chip stability.
      </p>
      <p>
        Secondary market sales across leading auction houses and CardVault's private exchange show his 2023-24 Topps Chrome #1 Gold Refractor (/50) PSA 10 commanding bids exceeding $35,000, with 1/1 Superfractors breaking half-million-dollar marks before his second full NBA season.
      </p>
    `,
    tableHtml: `
      <h3 class="text-lg font-black text-gray-900 dark:text-white font-heading mb-3">Wembanyama Rookie Parallel Comps (PSA 10)</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-200 dark:border-vault-border rounded-xl overflow-hidden">
          <thead class="bg-gray-100 dark:bg-vault-card font-bold text-gray-900 dark:text-white">
            <tr>
              <th class="p-3 text-left">Parallel Tier</th>
              <th class="p-3 text-left">Serial Number</th>
              <th class="p-3 text-left">PSA 10 Pop</th>
              <th class="p-3 text-left">Current Comp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-vault-border bg-white dark:bg-vault">
            <tr>
              <td class="p-3 font-bold text-cherry-500">Base Refractor</td>
              <td class="p-3">Unnumbered</td>
              <td class="p-3">1,420</td>
              <td class="p-3 font-mono font-bold">$1,250</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">Green Refractor</td>
              <td class="p-3">#/99</td>
              <td class="p-3">18</td>
              <td class="p-3 font-mono font-bold">$8,400</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">Gold Refractor Auto</td>
              <td class="p-3">#/50</td>
              <td class="p-3">7</td>
              <td class="p-3 font-mono font-bold">$36,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    quote: "Wembanyama has decoupled modern basketball card values from team success. Investors are pricing his cards as global athletic monuments.",
    quoteAuthor: "— Marcus Thorne, Senior Market Analyst at CardVault",
    bodyHtml2: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        Evaluating Topps Chrome On-Card Signatures
      </h2>
      <p>
        For collectors allocating capital into high-grade modern basketball, on-card autographs represent the gold standard. Sticker autographs suffer a 35% market penalty across modern high-end transactions. The 2023-24 Topps Chrome Victor Wembanyama autographed cards feature pristine blue ink directly onto the chrome finish, making them generational showpieces.
      </p>
      <p>
        As international demand expands across Europe and Asia, institutional hobby funds continue accumulating gem mint copies as anchor assets for sports-backed alternative portfolios.
      </p>
    `,
    authorBox: {
      name: "Elena Rostova",
      bio: "Senior Basketball Market Analyst at CardVault. Former equities researcher specializing in sports IP, player contract valuations, and modern rookie card market dynamics.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    comments: [
      { author: "Jean-Paul Laurent", time: "3 hours ago", text: "Demand here in Paris for Victor's Topps Chrome refractors is feverish. Local card shows can't keep raw copies in stock." },
      { author: "Derrick Cole", time: "7 hours ago", text: "Holding a PSA 10 Silver Refractor. His defensive stats alone make this card feel like a 10-year hedge against inflation." }
    ],
    featuredSlab: {
      title: "2023-24 Topps Chrome Wembanyama #1",
      price: "$2,200.00",
      link: "category.html?type=basketball"
    }
  },
  {
    id: 3,
    title: "The Global Surge of Topps Cricket Cards: From India to the UK",
    shortTitle: "Topps Cricket Global Surge",
    categoryBadge: "GLOBAL HOBBY REPORT • CRICKET",
    sport: "Cricket 🏏",
    author: "Rajesh Patel",
    authorInitials: "RP",
    date: "October 11, 2026",
    readTime: "7 Min Read",
    shares: "3,150 Shares",
    image: "assets/images/blog-topps-cricket-surge.jpg",
    takeaways: [
      "<strong>2.5 Billion Global Audience:</strong> Cricket is the world's second most popular sport, yet sports trading card penetration in South Asia has historically been under 0.1%, unlocking massive upside.",
      "<strong>The King Kohli Multiplier:</strong> Virat Kohli #18 on-card autographs and Century Club inserts are establishing the pricing benchmark for modern international sports memorabilia.",
      "<strong>London & Mumbai Liquidity Corridor:</strong> High-net-worth NRI collectors and UK wealth management offices are creating rapid liquidity pools for PSA 10 and BGS 9.5 cricket slabs."
    ],
    bodyHtml1: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        Cricket Cards: The Hobby's Greatest Untapped Frontier
      </h2>
      <p>
        While baseball, basketball, and football have spent decades maturing through grading, population registries, and institutional auctions, cricket cards are experiencing exponential growth compressed into just a few seasons. The launch of official Topps Cricket Chrome and Cricket Attax licensed sets has ignited an international collecting frenzy from Mumbai and Bengaluru to London, Melbourne, and Dubai.
      </p>
      <p>
        With cricket's global fandom exceeding 2.5 billion supporters, high-grade certified slabs of legendary figures like Sachin Tendulkar, Virat Kohli, and Jasprit Bumrah are commanding private treaty acquisitions previously seen only in top-tier American sports.
      </p>
    `,
    tableHtml: `
      <h3 class="text-lg font-black text-gray-900 dark:text-white font-heading mb-3">Top Cricket Certified Slabs Benchmark</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-200 dark:border-vault-border rounded-xl overflow-hidden">
          <thead class="bg-gray-100 dark:bg-vault-card font-bold text-gray-900 dark:text-white">
            <tr>
              <th class="p-3 text-left">Player & Issue</th>
              <th class="p-3 text-left">Grade</th>
              <th class="p-3 text-left">Census Pop</th>
              <th class="p-3 text-left">Recent Benchmark Comp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-vault-border bg-white dark:bg-vault">
            <tr>
              <td class="p-3 font-bold text-cherry-500">2024 Topps Chrome Virat Kohli #18 Gold Refractor</td>
              <td class="p-3">PSA 10 Gem Mint</td>
              <td class="p-3">3</td>
              <td class="p-3 font-mono font-bold">$12,400</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">2024 Topps Cricket Sachin Tendulkar #10 Auto /25</td>
              <td class="p-3">BGS 9.5 True Gem</td>
              <td class="p-3">2</td>
              <td class="p-3 font-mono font-bold">$18,500</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">2024 Topps Cricket Jasprit Bumrah #93 Refractor</td>
              <td class="p-3">PSA 10 Gem Mint</td>
              <td class="p-3">12</td>
              <td class="p-3 font-mono font-bold">$2,850</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    quote: "The demographic momentum behind cricket cards is unprecedented in hobby history. We are watching a billion-person market wake up to certified graded slabs.",
    quoteAuthor: "— Rajesh Patel, Head of International Expansion at CardVault",
    bodyHtml2: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        Forensic Preservation in Subtropical Climates
      </h2>
      <p>
        One of the key drivers of certified slab value in cricket is condition scarcity. Cards originally opened in India or the UAE frequently battle intense humidity and monsoon climate exposure, causing foil warping and corner soft-creasing. Consequently, pristine PSA 10 copies submitted from climate-controlled vault storage carry a 400% premium over ungraded raw cards.
      </p>
      <p>
        CardVault's Class 3 depository in Beverly Hills guarantees museum-grade 68°F and 45% relative humidity, ensuring these historic cricket grails preserve their gem mint status for generations.
      </p>
    `,
    authorBox: {
      name: "Rajesh Patel",
      bio: "Head of International Expansion & Cricket Memorabilia at CardVault. Leading authority on vintage and modern South Asian sports collectibles and international auction syndicates.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    comments: [
      { author: "Arjun Sharma", time: "1 hour ago", text: "Finally someone explaining the grading disparity. Sourcing a true PSA 10 Kohli in Delhi is virtually impossible without vault preservation." },
      { author: "Oliver Sterling", time: "4 hours ago", text: "The Sachin Tendulkar 2024 Chrome refractor is the grail of the entire set. Stored mine in CardVault last month." }
    ],
    featuredSlab: {
      title: "2024 Topps Cricket Virat Kohli #18",
      price: "$1,850.00",
      link: "category.html?type=cricket"
    }
  },
  {
    id: 4,
    title: "2024 Topps Composite Football: The Ultimate Checklist Breakdown",
    shortTitle: "Topps Composite Football Checklist",
    categoryBadge: "PRODUCT RELEASE BREAKDOWN",
    sport: "Football 🏈",
    author: "Devon Miller",
    authorInitials: "DM",
    date: "October 08, 2026",
    readTime: "9 Min Read",
    shares: "1,420 Shares",
    image: "assets/images/blog-topps-composite-gold-box.jpg",
    takeaways: [
      "<strong>Multi-Brand Fusion:</strong> Topps Composite integrates legendary designs including Finest, Chrome, Gallery, and Stadium Club across one unified NFL checklist.",
      "<strong>Quarterback Royalty:</strong> Features rookie cards and autographs for Caleb Williams, Jayden Daniels, CJ Stroud, Patrick Mahomes, and Brock Purdy.",
      "<strong>Cosmic & Superfractor Hits:</strong> Case hit distribution averages 1:288 hobby packs for Galactic parallels and true 1/1 Superfractors."
    ],
    bodyHtml1: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        A Unified Vision for Gridiron Cards
      </h2>
      <p>
        The release of 2024 Topps Composite Football marks a landmark moment in football card collecting. By synthesizing classic legacy Topps brands into a high-octane chromium release, collectors can pull iconic Heritage woodgrains, Chromium refractors, and futuristic Resurgence die-cuts from a single hobby box.
      </p>
      <p>
        Rookie quarterbacks are spearheading secondary market demand. The 2024 class featuring Caleb Williams and Jayden Daniels alongside sophomore MVP candidate CJ Stroud has driven hobby box prices to 180% of wholesale presale reserves within weeks of launch.
      </p>
    `,
    tableHtml: `
      <h3 class="text-lg font-black text-gray-900 dark:text-white font-heading mb-3">Topps Composite Case Hit Distribution Odds</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-200 dark:border-vault-border rounded-xl overflow-hidden">
          <thead class="bg-gray-100 dark:bg-vault-card font-bold text-gray-900 dark:text-white">
            <tr>
              <th class="p-3 text-left">Insert & Parallel Tier</th>
              <th class="p-3 text-left">Pack Odds</th>
              <th class="p-3 text-left">Case Frequency</th>
              <th class="p-3 text-left">Estimated Print Run</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-vault-border bg-white dark:bg-vault">
            <tr>
              <td class="p-3 font-bold text-cherry-500">Resurgence Cosmic Refractor</td>
              <td class="p-3">1:288 Packs</td>
              <td class="p-3">1 Per 2 Cases</td>
              <td class="p-3 font-mono font-bold">~15 Copies Each</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">Finest Rookie Auto Gold</td>
              <td class="p-3">1:144 Packs</td>
              <td class="p-3">1 Per Case</td>
              <td class="p-3 font-mono font-bold">Serial #/50</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">1/1 Superfractor Parallel</td>
              <td class="p-3">1:4,600 Packs</td>
              <td class="p-3">1 Per 32 Cases</td>
              <td class="p-3 font-mono font-bold">True 1 of 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    quote: "Composite Football does what no football product has done in a decade: it unites four generations of iconic card design under one roof.",
    quoteAuthor: "— Devon Miller, Director of Wax & Sealed Allocations",
    bodyHtml2: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        Breakdown of Top Autograph Tier Parallels
      </h2>
      <p>
        The centerpiece of Topps Composite is the on-card rookie autograph checklist. Featuring vibrant color matches including Kelly Green refractors for Philadelphia stars and Deep Navy shimmer for Houston's CJ Stroud, collectors have prioritized serial-numbered cards numbered to 50 or less.
      </p>
      <p>
        For break syndicates and wax investors, sealed 12-box cases of 2024 Topps Composite represent premier long-term hold candidates with strong annualized returns as rookie signal-callers enter playoff contention.
      </p>
    `,
    authorBox: {
      name: "Devon Miller",
      bio: "Director of Wax & Sealed Allocations at CardVault. Expert in sealed box break economics, print runs, and product checklist forensics across NFL and MLB products.",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    },
    comments: [
      { author: "Brett Henderson", time: "3 hours ago", text: "Just pulled the Jayden Daniels Galactic case hit from a CardVault break! Sending directly into the PSA submission tier." },
      { author: "Kyle O'Connor", time: "8 hours ago", text: "The Stadium Club design cards on chrome stock look infinitely better than standard paper cards. Massive win for Topps." }
    ],
    featuredSlab: {
      title: "2024 Topps Composite CJ Stroud #100",
      price: "$980.00",
      link: "category.html?type=football"
    }
  },
  {
    id: 5,
    title: "Why 55/45 Centering Will Make or Break Your PSA 10 Submission",
    shortTitle: "55/45 Centering & PSA 10",
    categoryBadge: "GRADING FORENSICS • TECHNICAL",
    sport: "Grading Lab 🔬",
    author: "Dr. Sarah Lin",
    authorInitials: "SL",
    date: "October 05, 2026",
    readTime: "6 Min Read",
    shares: "2,890 Shares",
    image: "assets/images/blog-55-45-centering.png",
    takeaways: [
      "<strong>The 55/45 Standard:</strong> PSA 10 Gem Mint tolerances allow 55/45 centering on the front and 75/25 on the reverse, but human grader subjectivity penalizes border tilt over 1.2 degrees.",
      "<strong>Optical Laser Digital Calipers:</strong> CardVault's lab utilizes 50x telecentric lenses to quantify edge ratios before submissions, preventing $50+ wasted grading fees on borderline PSA 9s.",
      "<strong>Foil Edge Bleed:</strong> Modern chromium cards with borderless full-bleed photography require edge alignment verification at 4 discrete corner quadrants."
    ],
    bodyHtml1: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        The Razor-Thin Line Between PSA 9 and PSA 10
      </h2>
      <p>
        In the modern sports card marketplace, the difference between a PSA 9 Mint and a PSA 10 Gem Mint is not a matter of degree—it is a financial chasm. For premier cards like Shohei Ohtani or Victor Wembanyama refractors, a PSA 10 frequently commands 400% to 600% of the price of an otherwise beautiful PSA 9.
      </p>
      <p>
        Yet, over 70% of PSA 9 grades awarded to pack-fresh modern submissions fail on a single, completely preventable flaw: miscalculated front-to-back border centering.
      </p>
    `,
    tableHtml: `
      <h3 class="text-lg font-black text-gray-900 dark:text-white font-heading mb-3">Centering Measurement Tolerance Matrix</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-200 dark:border-vault-border rounded-xl overflow-hidden">
          <thead class="bg-gray-100 dark:bg-vault-card font-bold text-gray-900 dark:text-white">
            <tr>
              <th class="p-3 text-left">Grade Designation</th>
              <th class="p-3 text-left">Front Centering Limit</th>
              <th class="p-3 text-left">Back Centering Limit</th>
              <th class="p-3 text-left">Maximum Permitted Tilt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-vault-border bg-white dark:bg-vault">
            <tr>
              <td class="p-3 font-bold text-emerald-500">PSA 10 (Gem Mint)</td>
              <td class="p-3 font-bold">55/45 to 50/50</td>
              <td class="p-3">75/25 or better</td>
              <td class="p-3">1.2 degrees</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-blue-500">PSA 9 (Mint)</td>
              <td class="p-3">60/40 or better</td>
              <td class="p-3">90/10 or better</td>
              <td class="p-3">2.4 degrees</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-amber-500">PSA 8 (NM-MT)</td>
              <td class="p-3">65/35 or better</td>
              <td class="p-3">90/10 or better</td>
              <td class="p-3">3.5 degrees</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    quote: "Centering is mathematical truth. You cannot talk a grader into a 10 if your telecentric laser reading registers 58/42.",
    quoteAuthor: "— Dr. Sarah Lin, Chief Conservator & Forensic Metrologist",
    bodyHtml2: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        How CardVault Pre-Screens Submissions
      </h2>
      <p>
        At CardVault's Beverly Hills laboratory, every card enrolled in our PSA Submission Pipeline undergoes a non-destructive 12-point optical scan. Utilizing high-resolution telecentric optics, our equipment calculates pixel-level border ratios across both vertical and horizontal axes.
      </p>
      <p>
        If a card measures outside the 55/45 threshold, our collectors receive instant advisory warnings, allowing them to redirect raw specimens toward authenticated binders or alternate grading strategies without taking the devastating PSA 9 financial hit.
      </p>
    `,
    authorBox: {
      name: "Dr. Sarah Lin",
      bio: "Chief Conservator and Metrology Director at CardVault. Ph.D. in Materials Science from Caltech with a focus on non-destructive optical spectroscopy and archival polymer preservation.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    comments: [
      { author: "Nathaniel Brooks", time: "4 hours ago", text: "Saved me $800 on a batch of 20 Bowman Chrome refractors. Three of them were 60/40 right border when measured properly." },
      { author: "Samantha Wright", time: "11 hours ago", text: "The back centering tolerance of 75/25 is so misunderstood. Great reminder that front symmetry is what drives the eye appeal." }
    ],
    featuredSlab: {
      title: "PSA Submission Express Tier",
      price: "$45 / Slab",
      link: "grading.html"
    }
  },
  {
    id: 6,
    title: "The Untold Story of the 1952 Topps Ocean Dump",
    shortTitle: "1952 Topps Ocean Dump",
    categoryBadge: "VINTAGE LORE • HISTORY",
    sport: "Vintage Lore ⚓",
    author: "David Sterling",
    authorInitials: "DS",
    date: "September 29, 2026",
    readTime: "11 Min Read",
    shares: "4,510 Shares",
    image: "assets/images/blog-1952-topps-ocean-dump.jpg",
    takeaways: [
      "<strong>The 1960 Barges:</strong> In late 1960, Topps executive Sy Berger oversaw the disposal of hundreds of unsold cases of 1952 high-series cards into the Atlantic Ocean off the New Jersey coast.",
      "<strong>Mickey Mantle High Series #311:</strong> The dumped cards contained thousands of untouched, mint Mickey Mantle #311 and Jackie Robinson #312 cards deemed unsellable at 1 cent each.",
      "<strong>Artificial Scarcity:</strong> This single historic event created the extreme scarcity that propelled the 1952 Topps Mantle into a $12.6 million record-breaking sports asset."
    ],
    bodyHtml1: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        When Golden Age Cardboard Was Treated as Trash
      </h2>
      <p>
        Today, a high-grade 1952 Topps Mickey Mantle #311 is the undisputed crown jewel of sports card collecting, with a PSA 9.5 selling for an unprecedented $12.6 million at auction. Yet in the autumn of 1952, Topps' revolutionary large-format set was considered a commercial headache.
      </p>
      <p>
        Because the high-series cards (#311 through #407) were released late in the summer after the baseball season had wound down, candy stores and newsstands refused to stock them. Topps warehouses in Brooklyn were overflowing with wooden crates of unsold wax packs that sat undisturbed for nearly eight years.
      </p>
    `,
    tableHtml: `
      <h3 class="text-lg font-black text-gray-900 dark:text-white font-heading mb-3">1952 Topps High-Series PSA Population Census</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-200 dark:border-vault-border rounded-xl overflow-hidden">
          <thead class="bg-gray-100 dark:bg-vault-card font-bold text-gray-900 dark:text-white">
            <tr>
              <th class="p-3 text-left">Card & Subject</th>
              <th class="p-3 text-left">Estimated Dumped</th>
              <th class="p-3 text-left">Surviving PSA 9+</th>
              <th class="p-3 text-left">All-Time Record Comp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-vault-border bg-white dark:bg-vault">
            <tr>
              <td class="p-3 font-bold text-cherry-500">#311 Mickey Mantle</td>
              <td class="p-3">~25,000+</td>
              <td class="p-3 font-bold text-emerald-500">Only 9 Copies</td>
              <td class="p-3 font-mono font-bold">$12,600,000</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">#312 Jackie Robinson</td>
              <td class="p-3">~25,000+</td>
              <td class="p-3 font-bold text-emerald-500">Only 14 Copies</td>
              <td class="p-3 font-mono font-bold">$984,000</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">#407 Eddie Mathews</td>
              <td class="p-3">~30,000+</td>
              <td class="p-3 font-bold text-emerald-500">Only 3 Copies</td>
              <td class="p-3 font-mono font-bold">$510,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    quote: "We couldn't give them away for a penny a pack. I had a garbage scow tow them five miles past the Ambrose Light and dump them into the Atlantic.",
    quoteAuthor: "— Sy Berger, Founding Father of Modern Trading Cards",
    bodyHtml2: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        The Depths of the Ambrose Light Graveyard
      </h2>
      <p>
        Historians calculate that between 300 and 500 cases—representing hundreds of thousands of high-series cards—now rest at the bottom of the Atlantic shelf. The sea salt and maritime tides permanently destroyed what would today be billions of dollars in museum-grade sports treasure.
      </p>
      <p>
        For vintage collectors holding certified slabs of 1952 Topps icons like Jackie Robinson and Mickey Mantle, every surviving specimen is a miraculous survivor of mid-century industrial disposal, making their provenance unmatched in human collectible history.
      </p>
    `,
    authorBox: {
      name: "David Sterling",
      bio: "Co-Founder & Head of Acquisitions at CardVault. Leading broker of pre-war baseball and modern Topps Chrome grails with 22 years in alternative asset advisory.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    comments: [
      { author: "Harold Goldberg", time: "6 hours ago", text: "My grandfather told me about buying 1952 high numbers for 1 cent each at a Brooklyn corner deli. Unreal to think of what went into the ocean." },
      { author: "Evelyn Reed", time: "9 hours ago", text: "The ultimate lesson in collectibles: true scarcity cannot be planned, it is born from accidents of history." }
    ],
    featuredSlab: {
      title: "1952 Topps Jackie Robinson #312",
      price: "$48,000.00",
      link: "category.html?type=baseball"
    }
  },
  {
    id: 7,
    title: "Blue Chip Sports Cards as Inflation Hedges: 10-Year Retrospective",
    shortTitle: "Blue Chip Cards Inflation Hedge",
    categoryBadge: "MARKET ANALYSIS • ASSET CLASS",
    sport: "Wealth & Macro 📈",
    author: "Elena Rostova",
    authorInitials: "ER",
    date: "September 22, 2026",
    readTime: "8 Min Read",
    shares: "3,740 Shares",
    image: "assets/images/blog-blue-chip-inflation-hedge.jpg",
    takeaways: [
      "<strong>21.4% Annualized CAGR:</strong> A basket of Top-50 blue-chip vintage and modern grail cards outperformed the S&P 500 and Gold between 2016 and 2026.",
      "<strong>Fixed Supply Elasticity:</strong> Unlike currency or equities with share dilution, a 1986 Fleer Michael Jordan #57 PSA 10 has a strictly immutable population of under 320 copies worldwide.",
      "<strong>Institutional Custody:</strong> High-net-worth family offices now leverage Class 3 vaults and fractional securitization to hold sports cardboard alongside real estate."
    ],
    bodyHtml1: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        Beyond Hobbyism: The Institutionalization of Cardboard
      </h2>
      <p>
        Over the past decade, alternative assets have transformed from fringe investor curiosities into recognized asset allocation categories for sophisticated wealth managers. Among fine art, vintage timepieces, and rare wine, graded sports cards have exhibited some of the sharpest uncorrelated returns relative to global macroeconomic cycles.
      </p>
      <p>
        Examining ten years of audited auction comps reveals that pristine blue-chip cards—such as the 1986 Fleer Michael Jordan, the 2000 Playoff Contenders Tom Brady, and the 1952 Mickey Mantle—provide exceptional liquidity and capital preservation during periods of elevated consumer price inflation.
      </p>
    `,
    tableHtml: `
      <h3 class="text-lg font-black text-gray-900 dark:text-white font-heading mb-3">10-Year Asset Class Performance Retrospective (2016–2026)</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-200 dark:border-vault-border rounded-xl overflow-hidden">
          <thead class="bg-gray-100 dark:bg-vault-card font-bold text-gray-900 dark:text-white">
            <tr>
              <th class="p-3 text-left">Asset Class</th>
              <th class="p-3 text-left">10-Yr Total Return</th>
              <th class="p-3 text-left">Annualized CAGR</th>
              <th class="p-3 text-left">Max Drawdown</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-vault-border bg-white dark:bg-vault">
            <tr>
              <td class="p-3 font-bold text-emerald-500">CardVault Blue-Chip 50 Index</td>
              <td class="p-3 font-bold text-emerald-500">+592%</td>
              <td class="p-3 font-bold text-emerald-500">21.4%</td>
              <td class="p-3">-18.2%</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-cherry-500">S&P 500 Index (SPY)</td>
              <td class="p-3">+224%</td>
              <td class="p-3">12.5%</td>
              <td class="p-3">-24.1%</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-amber-500">Gold Bullion (XAU/USD)</td>
              <td class="p-3">+118%</td>
              <td class="p-3">8.1%</td>
              <td class="p-3">-14.6%</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    quote: "The world can print another trillion dollars; it cannot print another 1986 Fleer Michael Jordan PSA 10.",
    quoteAuthor: "— Elena Rostova, Senior Market Analyst at CardVault",
    bodyHtml2: `
      <h2 class="text-2xl font-black text-gray-900 dark:text-white font-heading mt-6">
        Risk Management in Tangible Assets
      </h2>
      <p>
        While the long-term historical trajectory of blue-chip cards is overwhelmingly bullish, institutional investors must navigate four distinct risks: provenance authenticity, physical degradation, fraudulent alterations, and market counterparty risk.
      </p>
      <p>
        This is why institutional capital mandates depository storage. CardVault's subterranean facility provides Lloyd's of London full-specie underwriting, biometric multi-signatory release protocols, and annual laser optical audits, giving card investors the institutional peace of mind enjoyed by gold bullion holders.
      </p>
    `,
    authorBox: {
      name: "Elena Rostova",
      bio: "Senior Basketball Market Analyst at CardVault. Former equities researcher specializing in sports IP, player contract valuations, and modern rookie card market dynamics.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    comments: [
      { author: "Gerald Kingsley", time: "5 hours ago", text: "Allocated 4% of our family office portfolio to PSA 10 vintage grails in 2021. It has been our most consistent defensive position." },
      { author: "Liam Vance", time: "12 hours ago", text: "The Jordan 1986 Fleer comparison to Gold bullion is completely accurate. Physical supply is mathematically constrained." }
    ],
    featuredSlab: {
      title: "1986 Fleer Michael Jordan #57 PSA 9",
      price: "$18,500.00",
      link: "category.html?type=basketball"
    }
  }
];

function initBlogDetailsPage() {
  // Support search on blog.html
  const blogSearchInput = document.querySelector('section input[placeholder*="Search articles"]');
  if (blogSearchInput) {
    blogSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = blogSearchInput.value.trim().toLowerCase();
        if (!q) return;
        const match = window.BLOG_POSTS_DB && window.BLOG_POSTS_DB.find(p => p.title.toLowerCase().includes(q) || p.shortTitle.toLowerCase().includes(q) || p.sport.toLowerCase().includes(q));
        if (match) {
          window.location.href = `blog-details.html?id=${match.id}`;
        } else {
          showToast(`No articles found matching "${q}"`, '🔍');
        }
      }
    });
  }

  const blogTitleEl = document.getElementById('blog-title');
  if (!blogTitleEl) return; // Not on blog-details.html

  const params = new URLSearchParams(window.location.search);
  const rawId = parseInt(params.get('id'), 10);
  const postId = (!isNaN(rawId) && rawId >= 1 && rawId <= 7) ? rawId : 1;

  const post = (window.BLOG_POSTS_DB && window.BLOG_POSTS_DB.find(p => p.id === postId)) || (window.BLOG_POSTS_DB && window.BLOG_POSTS_DB[0]);
  if (!post) return;

  // Set page title
  document.title = `${post.title} | CardVault Intel`;

  // Update Breadcrumb
  const breadcrumb = document.getElementById('blog-breadcrumb-title');
  if (breadcrumb) breadcrumb.textContent = post.shortTitle || post.title;

  // Update Category Badge
  const catBadge = document.getElementById('blog-category-badge');
  if (catBadge) catBadge.textContent = post.categoryBadge;

  // Update Title
  blogTitleEl.textContent = post.title;

  // Update Author & Meta
  const authorAvatar = document.getElementById('blog-author-avatar');
  if (authorAvatar) authorAvatar.textContent = post.authorInitials || post.author.substring(0, 2).toUpperCase();

  const authorName = document.getElementById('blog-author-name');
  if (authorName) authorName.textContent = post.author;

  const dateEl = document.getElementById('blog-date');
  if (dateEl) dateEl.textContent = post.date;

  const readTimeEl = document.getElementById('blog-read-time');
  if (readTimeEl) readTimeEl.textContent = post.readTime;

  const sharesEl = document.getElementById('blog-shares');
  if (sharesEl) sharesEl.textContent = post.shares;

  // Update Hero Image
  const heroImg = document.getElementById('blog-hero-image');
  if (heroImg) {
    heroImg.src = post.image;
    heroImg.alt = post.title;
  }

  // Update Key Takeaways
  const takeawaysEl = document.getElementById('blog-takeaways');
  if (takeawaysEl && Array.isArray(post.takeaways)) {
    takeawaysEl.innerHTML = `
      <strong class="text-sm font-black text-cherry-500 block uppercase tracking-wider font-heading">Key Takeaways for Slabs Investors:</strong>
      ${post.takeaways.map((t, idx) => `<p>${idx + 1}. ${t}</p>`).join('')}
    `;
  }

  // Update Body 1
  const body1El = document.getElementById('blog-body-1');
  if (body1El) body1El.innerHTML = post.bodyHtml1;

  // Update Table
  const tableEl = document.getElementById('blog-table-container');
  if (tableEl) tableEl.innerHTML = post.tableHtml;

  // Update Quote
  const quoteText = document.getElementById('blog-quote-text');
  if (quoteText) quoteText.innerHTML = `"${post.quote}"`;

  const quoteAuthor = document.getElementById('blog-quote-author');
  if (quoteAuthor) quoteAuthor.textContent = post.quoteAuthor;

  // Update Body 2
  const body2El = document.getElementById('blog-body-2');
  if (body2El) body2El.innerHTML = post.bodyHtml2;

  // Update Author Box
  if (post.authorBox) {
    const boxImg = document.getElementById('blog-author-box-img');
    if (boxImg) boxImg.src = post.authorBox.img;

    const boxName = document.getElementById('blog-author-box-name');
    if (boxName) boxName.textContent = post.authorBox.name;

    const boxBio = document.getElementById('blog-author-bio');
    if (boxBio) boxBio.textContent = post.authorBox.bio;
  }

  // Update Comments
  if (Array.isArray(post.comments)) {
    const countEl = document.getElementById('blog-comments-count');
    if (countEl) countEl.textContent = post.comments.length;

    const listEl = document.getElementById('blog-comments-list');
    if (listEl) {
      listEl.innerHTML = post.comments.map(c => `
        <div class="p-4 rounded-xl bg-white dark:bg-vault-card border border-gray-200 dark:border-vault-border space-y-1">
          <div class="flex justify-between text-xs">
            <strong class="text-gray-900 dark:text-white">${c.author}</strong>
            <span class="text-gray-400">${c.time}</span>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-300">${c.text}</p>
        </div>
      `).join('');
    }
  }

  // Update Sidebar Trending Stories (exclude current post)
  const sidebarTrending = document.getElementById('blog-sidebar-trending');
  if (sidebarTrending && Array.isArray(window.BLOG_POSTS_DB)) {
    const otherPosts = window.BLOG_POSTS_DB.filter(p => p.id !== post.id).slice(0, 3);
    sidebarTrending.innerHTML = otherPosts.map(op => `
      <a href="blog-details.html?id=${op.id}" class="flex items-center gap-3 group">
        <div class="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-vault border border-gray-200 dark:border-vault-border">
          <img src="${op.image}" alt="${op.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
        </div>
        <div class="flex-1 min-w-0">
          <span class="text-[10px] text-cherry-500 font-bold block">${op.sport}</span>
          <h5 class="font-bold text-gray-900 dark:text-white group-hover:text-cherry-500 transition line-clamp-2 text-xs leading-snug">${op.title}</h5>
          <span class="text-[10px] text-gray-400">${op.date}</span>
        </div>
      </a>
    `).join('');
  }

  // Update Featured Slab Widget in Sidebar
  if (post.featuredSlab) {
    const slabTitle = document.getElementById('blog-sidebar-slab-title');
    if (slabTitle) slabTitle.textContent = post.featuredSlab.title;

    const slabPrice = document.getElementById('blog-sidebar-slab-price');
    if (slabPrice) slabPrice.textContent = post.featuredSlab.price;

    const slabLink = document.getElementById('blog-sidebar-slab-link');
    if (slabLink) slabLink.href = post.featuredSlab.link;
  }

  // Sidebar Search
  const sidebarSearchInput = document.querySelector('aside input[type="text"]');
  if (sidebarSearchInput) {
    sidebarSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = sidebarSearchInput.value.trim().toLowerCase();
        if (!q) return;
        const match = window.BLOG_POSTS_DB.find(p => p.title.toLowerCase().includes(q) || p.shortTitle.toLowerCase().includes(q) || p.sport.toLowerCase().includes(q));
        if (match) {
          window.location.href = `blog-details.html?id=${match.id}`;
        } else {
          showToast(`No articles found matching "${q}"`, '🔍');
        }
      }
    });
  }
}

// ==========================================
// 19. Consignment Tier Selection & Active Benefits (Home 2)
// ==========================================
window.selectConsignmentTier = function(tierKey) {
  const tierConfigs = {
    'standard': {
      name: 'Standard Tier (8% Fee)',
      payout: '92.0% Consignor Payout',
      badge: 'STANDARD TIER ACTIVATED',
      estValue: '$1,800',
      benefits: [
        'Dual-polarization 50MP macro photography series included',
        'Placement in weekly marketplace drops & search indexing',
        '100% fraud, non-paying bidder, and chargeback protection',
        'Fedwire or ACH bank settlement within 5 business days'
      ],
      toastMsg: 'Standard Tier Activated: 92% Payout & Weekly Marketplace Drops'
    },
    'premier': {
      name: 'Premier Consignment (5% Fee)',
      payout: '95.0% Consignor Payout',
      badge: 'PREMIER CONSIGNMENT ACTIVATED',
      estValue: '$7,500',
      benefits: [
        'Dedicated email drop feature to 18,500+ verified VIP buyers',
        'Targeted social spotlight campaign across Instagram & X',
        'Beverly Hills showroom showcase display for private appointments',
        'Expedited 48-hour wire payout upon close of escrow'
      ],
      toastMsg: 'Premier Consignment Activated: 95% Payout & Showroom Showcase'
    },
    'grail': {
      name: 'Grails & Collections (0%–3% Fee)',
      payout: 'Up to 100.0% Consignor Payout',
      badge: 'GRAILS & COLLECTIONS ACTIVATED',
      estValue: '$45,000',
      benefits: [
        'Private treaty matching with pre-qualified sovereign & institutional funds',
        'In-person Beverly Hills viewing suite reservations for bidders',
        'Custom tailored zero-commission options for 6-figure+ collections',
        'White-glove armored transit & direct wire settlement in 24 hours'
      ],
      toastMsg: 'Grails Package Activated: Up to 100% Payout & Armored Transit'
    }
  };

  const config = tierConfigs[tierKey] || tierConfigs['premier'];

  // 1. Update Tier Cards Visual State in Section 6
  ['standard', 'premier', 'grail'].forEach(k => {
    const cardEl = document.getElementById(`tier-card-${k}`);
    if (cardEl) {
      if (k === tierKey) {
        cardEl.classList.remove('border-gray-200', 'dark:border-vault-border', 'opacity-70');
        cardEl.classList.add('border-2', 'border-cherry-500', 'shadow-2xl', 'ring-2', 'ring-cherry-500/20');
        const activeIndicator = cardEl.querySelector('.tier-active-indicator');
        if (activeIndicator) activeIndicator.classList.remove('hidden');
      } else {
        cardEl.classList.remove('ring-2', 'ring-cherry-500/20');
        const activeIndicator = cardEl.querySelector('.tier-active-indicator');
        if (activeIndicator) activeIndicator.classList.add('hidden');
      }
    }
  });

  // 2. Update Appraisal Form Selector and Benefits Box in Section 7
  const tierSelect = document.getElementById('consign-tier-select');
  if (tierSelect) {
    tierSelect.value = tierKey;
  }

  const estValInput = document.getElementById('consign-est-value');
  if (estValInput && (!estValInput.value || estValInput.value.startsWith('$'))) {
    estValInput.value = config.estValue;
  }

  const benefitsBox = document.getElementById('consign-active-benefits-box');
  if (benefitsBox) {
    benefitsBox.classList.remove('hidden');
    benefitsBox.innerHTML = `
      <div class="p-4 rounded-2xl bg-cherry-500/10 border-l-4 border-cherry-500 text-xs space-y-2 animate-toast-in">
        <div class="flex items-center justify-between">
          <strong class="font-black text-cherry-500 uppercase tracking-wider text-[11px] font-heading">
            ✓ ${config.badge}
          </strong>
          <span class="px-2 py-0.5 rounded-full bg-cherry-500 text-white font-mono font-bold text-[10px]">
            ${config.payout}
          </span>
        </div>
        <p class="text-[11px] text-gray-700 dark:text-gray-300 font-medium">Your appraisal submission will automatically receive these benefits:</p>
        <ul class="space-y-1.5 text-[11px] text-gray-600 dark:text-gray-400">
          ${config.benefits.map(b => `<li class="flex items-center gap-1.5"><span class="text-cherry-500 font-bold">✓</span> ${b}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // 3. Smooth Scroll to Form
  const formEl = document.getElementById('consign-form');
  if (formEl) {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 4. Show Notification Toast
  if (window.showToast) {
    window.showToast(config.toastMsg, '💎');
  }
};

// ==========================================
// 15. Global Wishlist & Cart System
// ==========================================
(function() {
  const DEFAULT_WISHLIST = [
    {
      id: "1",
      name: "2024 Topps Chrome Shohei Ohtani #17",
      sport: "Baseball",
      emoji: "⚾",
      grade: "PSA 10 GEM MINT",
      serial: "#04/25 Orange Refractor Auto",
      price: 4850,
      image: "assets/images/shohei-ohtani-17.jpg"
    },
    {
      id: "7",
      name: "2023-24 Topps Chrome Victor Wembanyama #1",
      sport: "Basketball",
      emoji: "🏀",
      grade: "PSA 10 GEM MINT",
      serial: "#07/10 Shimmer Auto",
      price: 12500,
      image: "assets/images/victor-wembanyama-1.jpg"
    }
  ];

  const DEFAULT_CART = [
    {
      id: "13",
      name: "2024 Topps Cricket Chrome Virat Kohli #18",
      sport: "Cricket",
      emoji: "🏏",
      grade: "PSA 10 GEM MINT",
      serial: "#05/05 Red Shimmer Refractor",
      price: 3200,
      qty: 1,
      image: "assets/images/virat-kohli-18.jpg"
    }
  ];

  function getStoredWishlist() {
    try {
      const stored = localStorage.getItem('cardvault_wishlist');
      if (!stored) {
        localStorage.setItem('cardvault_wishlist', JSON.stringify(DEFAULT_WISHLIST));
        return DEFAULT_WISHLIST;
      }
      return JSON.parse(stored);
    } catch(e) {
      return DEFAULT_WISHLIST;
    }
  }

  function getStoredCart() {
    try {
      const stored = localStorage.getItem('cardvault_cart');
      if (!stored) {
        localStorage.setItem('cardvault_cart', JSON.stringify(DEFAULT_CART));
        return DEFAULT_CART;
      }
      return JSON.parse(stored);
    } catch(e) {
      return DEFAULT_CART;
    }
  }

  window.getWishlist = getStoredWishlist;
  window.getCart = getStoredCart;

  window.updateHeaderBadges = function() {
    const wishlist = getStoredWishlist();
    const cart = getStoredCart();

    const wishlistCount = wishlist.length;
    const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    document.querySelectorAll('.header-wishlist-count').forEach(el => {
      el.textContent = wishlistCount;
    });

    document.querySelectorAll('.header-cart-count').forEach(el => {
      el.textContent = cartCount;
    });
  };

  window.addToWishlist = function(card) {
    let wishlist = getStoredWishlist();
    if (!wishlist.some(item => String(item.id) === String(card.id))) {
      wishlist.push(card);
      localStorage.setItem('cardvault_wishlist', JSON.stringify(wishlist));
      window.updateHeaderBadges();
      if (window.showToast) window.showToast(`Saved ${card.name} to Wishlist`, '❤️');
    } else {
      if (window.showToast) window.showToast(`${card.name} is already in your Wishlist`, 'ℹ️');
    }
    if (typeof window.renderWishlistPage === 'function') {
      window.renderWishlistPage();
    }
  };

  window.removeFromWishlist = function(id, silent = false) {
    let wishlist = getStoredWishlist();
    const item = wishlist.find(c => String(c.id) === String(id));
    wishlist = wishlist.filter(c => String(c.id) !== String(id));
    localStorage.setItem('cardvault_wishlist', JSON.stringify(wishlist));
    window.updateHeaderBadges();
    if (window.showToast && item && !silent) {
      window.showToast(`Removed from Wishlist`, '🗑️');
    }
    if (typeof window.renderWishlistPage === 'function') {
      window.renderWishlistPage();
    }
  };

  window.clearWishlist = function() {
    localStorage.setItem('cardvault_wishlist', JSON.stringify([]));
    window.updateHeaderBadges();
    if (window.showToast) window.showToast(`Wishlist cleared`, '🗑️');
    if (typeof window.renderWishlistPage === 'function') {
      window.renderWishlistPage();
    }
  };

  window.addToCart = function(card) {
    if (!card) return;
    let cart = getStoredCart();
    const existing = cart.find(item => String(item.id) === String(card.id));
    const imagePath = card.image || card.img || 'assets/images/virat-kohli-18.jpg';
    const priceNum = typeof card.price === 'number' ? card.price : parseFloat(String(card.price).replace(/[^0-9.]/g, '')) || 0;
    const itemQty = card.qty ? parseInt(card.qty, 10) : 1;

    if (existing) {
      existing.qty = (existing.qty || 1) + itemQty;
      if (!existing.image && imagePath) existing.image = imagePath;
      if (!existing.img && imagePath) existing.img = imagePath;
    } else {
      cart.push({
        id: String(card.id),
        name: card.name,
        sport: card.sport || 'Sports',
        emoji: card.emoji || '📦',
        grade: card.grade || 'Factory Sealed Box',
        serial: card.serial || card.desc || 'Archival Depository Allocation',
        price: priceNum,
        qty: itemQty,
        image: imagePath,
        img: imagePath,
        link: card.link || (isNaN(Number(card.id)) ? 'category.html' : 'card-details.html?id=' + card.id)
      });
    }
    localStorage.setItem('cardvault_cart', JSON.stringify(cart));
    window.updateHeaderBadges();
    if (window.showToast) {
      const toastIcon = card.emoji || '📦';
      window.showToast(`${card.name} added to cart!`, toastIcon);
    }
    if (typeof window.renderCartPage === 'function') {
      window.renderCartPage();
    }
  };

  window.addBoxToCart = function(boxOrEl) {
    if (!boxOrEl) return;
    
    // If a DOM element was passed (e.g. from onclick="window.addBoxToCart(this)")
    if (boxOrEl instanceof Element || (typeof boxOrEl === 'object' && boxOrEl.nodeType === 1)) {
      const container = boxOrEl.closest('.p-4') || boxOrEl.parentElement?.closest('.p-4') || boxOrEl.parentElement;
      const title = container?.querySelector('h4')?.textContent?.trim() || 'Factory Sealed Hobby Box';
      const img = container?.querySelector('img')?.getAttribute('src') || 'assets/images/box-topps-chrome-baseball-hobby.png';
      const priceText = container?.querySelector('.font-black')?.textContent?.trim() || '$325.00';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 325;
      const desc = container?.querySelector('p')?.textContent?.trim() || 'Factory Sealed Wax Allocation';
      const sportTag = container?.querySelector('.uppercase')?.textContent?.trim() || '';
      
      let sport = 'Sports';
      let emoji = '📦';
      if (/MLB|Baseball/i.test(sportTag) || /Baseball/i.test(title)) { sport = 'Baseball'; emoji = '⚾'; }
      else if (/NBA|Basketball/i.test(sportTag) || /Basketball/i.test(title)) { sport = 'Basketball'; emoji = '🏀'; }
      else if (/ICC|T20|Cricket/i.test(sportTag) || /Cricket/i.test(title)) { sport = 'Cricket'; emoji = '🏏'; }
      else if (/NFL|NCAA|Football/i.test(sportTag) || /Football/i.test(title)) { sport = 'Football'; emoji = '🏈'; }

      window.addToCart({
        id: 'box-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: title,
        price: price,
        image: img,
        img: img,
        sport: sport,
        emoji: emoji,
        grade: 'Factory Sealed Box',
        serial: desc,
        link: 'category.html?type=' + sport.toLowerCase()
      });
      return;
    }

    // Direct object passed
    window.addToCart({
      id: boxOrEl.id || ('box-' + (boxOrEl.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-')),
      name: boxOrEl.name,
      price: typeof boxOrEl.price === 'number' ? boxOrEl.price : parseFloat(String(boxOrEl.price).replace(/[^0-9.]/g, '')) || 0,
      image: boxOrEl.image || boxOrEl.img || 'assets/images/box-topps-chrome-baseball-hobby.png',
      img: boxOrEl.image || boxOrEl.img || 'assets/images/box-topps-chrome-baseball-hobby.png',
      sport: boxOrEl.sport || 'Sports',
      emoji: boxOrEl.emoji || '📦',
      grade: boxOrEl.grade || 'Factory Sealed Box',
      serial: boxOrEl.desc || boxOrEl.serial || 'Factory Sealed Wax Allocation',
      link: boxOrEl.link || ('category.html?type=' + (boxOrEl.sport ? boxOrEl.sport.toLowerCase() : 'baseball'))
    });
  };

  window.removeFromCart = function(id) {
    let cart = getStoredCart();
    cart = cart.filter(item => String(item.id) !== String(id));
    localStorage.setItem('cardvault_cart', JSON.stringify(cart));
    window.updateHeaderBadges();
    if (window.showToast) window.showToast(`Removed item from Cart`, '🗑️');
    if (typeof window.renderCartPage === 'function') {
      window.renderCartPage();
    }
  };

  window.updateCartQty = function(id, delta) {
    let cart = getStoredCart();
    const item = cart.find(c => String(c.id) === String(id));
    if (item) {
      item.qty = (item.qty || 1) + delta;
      if (item.qty <= 0) {
        cart = cart.filter(c => String(c.id) !== String(id));
      }
      localStorage.setItem('cardvault_cart', JSON.stringify(cart));
      window.updateHeaderBadges();
      if (typeof window.renderCartPage === 'function') {
        window.renderCartPage();
      }
    }
  };

  window.moveWishlistToCart = function(id) {
    const wishlist = getStoredWishlist();
    const card = wishlist.find(c => String(c.id) === String(id));
    if (card) {
      window.addToCart(card);
      window.removeFromWishlist(id, true);
    }
  };

  const ALL_CARDS_CATALOG = {
    1: { id: "1", name: "2024 Topps Chrome Shohei Ohtani #17", sport: "Baseball", emoji: "⚾", grade: "PSA 10 GEM MINT", serial: "#04/25 Orange Refractor", price: 4850, image: "assets/images/shohei-ohtani-17.jpg" },
    2: { id: "2", name: "2023 Bowman Chrome Paul Skenes #CPA-PS", sport: "Baseball", emoji: "⚾", grade: "PSA 10 GEM MINT", serial: "#18/50 Gold Refractor", price: 2100, image: "assets/images/paul-skenes-cpaps.jpg" },
    3: { id: "3", name: "2024 Topps Series 1 Elly De La Cruz #141", sport: "Baseball", emoji: "⚾", grade: "PSA 10 GEM MINT", serial: "#15/50 Red Foil", price: 1450, image: "assets/images/elly-de-la-cruz-141.jpg" },
    4: { id: "4", name: "1952 Topps Mickey Mantle #311", sport: "Baseball", emoji: "⚾", grade: "SGC 9.5 MINT+", serial: "Vintage Icon", price: 1250000, image: "assets/images/mickey-mantle-311.jpg" },
    5: { id: "5", name: "2024 Topps Chrome Aaron Judge #200", sport: "Baseball", emoji: "⚾", grade: "PSA 10 GEM MINT", serial: "#99/99 Gold Wave", price: 2800, image: "assets/images/aaron-judge-200.jpg" },
    6: { id: "6", name: "2024 Bowman Chrome Jackson Holliday #BCP-1", sport: "Baseball", emoji: "⚾", grade: "PSA 10 GEM MINT", serial: "#07/10 True Red", price: 3400, image: "assets/images/jackson-holliday-bcp1.jpg" },
    7: { id: "7", name: "2023-24 Topps Chrome Victor Wembanyama #1", sport: "Basketball", emoji: "🏀", grade: "PSA 10 GEM MINT", serial: "#01/10 Red Refractor", price: 12500, image: "assets/images/victor-wembanyama-1.jpg" },
    8: { id: "8", name: "2023-24 Topps Chrome LeBron James #23", sport: "Basketball", emoji: "🏀", grade: "BGS 10 PRISTINE", serial: "#23/25 Jersey Match", price: 4200, image: "assets/images/lebron-james-23.jpg" },
    9: { id: "9", name: "2023-24 Topps Tribute Stephen Curry #30", sport: "Basketball", emoji: "🏀", grade: "PSA 10 GEM MINT", serial: "#30/50 Splash Match", price: 3800, image: "assets/images/stephen-curry-30.jpg" },
    10: { id: "10", name: "2023-24 Topps Chrome Luka Dončić #77", sport: "Basketball", emoji: "🏀", grade: "PSA 10 GEM MINT", serial: "#19/50 Retro", price: 2600, image: "assets/images/luka-doncic-77.jpg" },
    11: { id: "11", name: "2023-24 Topps Chrome Anthony Edwards #5", sport: "Basketball", emoji: "🏀", grade: "PSA 10 GEM MINT", serial: "#11/25 Black", price: 3100, image: "assets/images/anthony-edwards-5.jpg" },
    12: { id: "12", name: "2023-24 Topps Chrome Shai Gilgeous-Alexander #2", sport: "Basketball", emoji: "🏀", grade: "PSA 10 GEM MINT", serial: "#02/10 Die-Cut", price: 2900, image: "assets/images/shai-gilgeous-alexander-2.jpg" },
    13: { id: "13", name: "2024 Topps Cricket Chrome Virat Kohli #18", sport: "Cricket", emoji: "🏏", grade: "PSA 10 GEM MINT", serial: "#05/05 Red Shimmer", price: 3200, image: "assets/images/virat-kohli-18.jpg" },
    14: { id: "14", name: "2024 Topps Cricket Attax Rohit Sharma #45", sport: "Cricket", emoji: "🏏", grade: "BGS 9.5 MINT+", serial: "#12/25 Foil Auto", price: 1650, image: "assets/images/rohit-sharma-45.jpg" },
    15: { id: "15", name: "2024 Topps Cricket Chrome Sachin Tendulkar #10", sport: "Cricket", emoji: "🏏", grade: "PSA 10 GEM MINT", serial: "#10/50 Heritage Gold", price: 4100, image: "assets/images/sachin-tendulkar-10.jpg" },
    16: { id: "16", name: "2024 Topps Cricket Chrome Jasprit Bumrah #93", sport: "Cricket", emoji: "🏏", grade: "PSA 10 GEM MINT", serial: "#08/25 Yorker", price: 1850, image: "assets/images/jasprit-bumrah-93.jpg" },
    17: { id: "17", name: "2024 Topps Cricket Attax MS Dhoni #7", sport: "Cricket", emoji: "🏏", grade: "BGS 10 PRISTINE", serial: "#07/10 Jersey", price: 5400, image: "assets/images/ms-dhoni-7.jpg" },
    18: { id: "18", name: "2024 Topps Cricket Chrome Shubman Gill #77", sport: "Cricket", emoji: "🏏", grade: "PSA 10 GEM MINT", serial: "#44/99 Diamond", price: 950, image: "assets/images/shubman-gill-77.jpg" },
    19: { id: "19", name: "2024 Topps Composite CJ Stroud #100", sport: "Football", emoji: "🏈", grade: "PSA 10 GEM MINT", serial: "#18/50 Cosmic", price: 2950, image: "assets/images/cj-stroud-100.jpg" },
    20: { id: "20", name: "2024 Topps Composite Caleb Williams #1", sport: "Football", emoji: "🏈", grade: "PSA 10 GEM MINT", serial: "#01/10 Bookend", price: 3800, image: "assets/images/caleb-williams-1.jpg" },
    21: { id: "21", name: "2024 Topps Composite Patrick Mahomes #15", sport: "Football", emoji: "🏈", grade: "BGS 10 PRISTINE", serial: "1/1 Superfractor", price: 8900, image: "assets/images/patrick-mahomes-15.jpg" },
    22: { id: "22", name: "2024 Topps Composite Jayden Daniels #5", sport: "Football", emoji: "🏈", grade: "PSA 10 GEM MINT", serial: "#05/25 Match", price: 2400, image: "assets/images/jayden-daniels-5.jpg" },
    23: { id: "23", name: "2024 Topps Composite Marvin Harrison Jr #18", sport: "Football", emoji: "🏈", grade: "PSA 10 GEM MINT", serial: "#18/50 Jersey", price: 1750, image: "assets/images/marvin-harrison-18.jpg" },
    24: { id: "24", name: "2024 Topps Composite Brock Purdy #13", sport: "Football", emoji: "🏈", grade: "PSA 10 GEM MINT", serial: "#09/10 Red Ice", price: 2200, image: "assets/images/brock-purdy-13.jpg" }
  };

  window.toggleWishlistCard = function(cardId, triggerEl) {
    const card = ALL_CARDS_CATALOG[cardId];
    if (!card) return;
    let wishlist = getStoredWishlist();
    const isSaved = wishlist.some(item => String(item.id) === String(cardId));
    if (isSaved) {
      wishlist = wishlist.filter(item => String(item.id) !== String(cardId));
      localStorage.setItem('cardvault_wishlist', JSON.stringify(wishlist));
      if (window.showToast) window.showToast(`Removed from Wishlist`, '💔');
    } else {
      wishlist.push(card);
      localStorage.setItem('cardvault_wishlist', JSON.stringify(wishlist));
      if (window.showToast) window.showToast(`Saved ${card.name} to Wishlist`, '❤️');
    }
    window.updateHeaderBadges();
    window.syncCardWishlistButtons();
  };

  window.syncCardWishlistButtons = function() {
    const wishlist = getStoredWishlist();
    const savedIds = new Set(wishlist.map(c => String(c.id)));
    document.querySelectorAll('[data-card-id]').forEach(btn => {
      const id = btn.getAttribute('data-card-id');
      const isSaved = savedIds.has(String(id));
      if (isSaved) {
        btn.classList.add('text-cherry-500', 'fill-cherry-500');
        btn.classList.remove('text-gray-400');
        if (btn.classList.contains('card-wishlist-action')) {
          btn.classList.add('border-cherry-500/40', 'bg-rose-50', 'dark:bg-rose-950/40');
        }
      } else {
        btn.classList.remove('text-cherry-500', 'fill-cherry-500', 'border-cherry-500/40', 'bg-rose-50', 'dark:bg-rose-950/40');
        btn.classList.add('text-gray-400');
      }
    });
  };

  window.initWishlistAndCart = function() {
    window.updateHeaderBadges();
    window.syncCardWishlistButtons();

    // Auto-bind any buttons with "Add Box", "Add Case", "Add Tin", "Add Pack"
    document.querySelectorAll('button').forEach(btn => {
      const txt = btn.textContent.trim();
      if (/^Add (Box|Case|Tin|Pack)$/i.test(txt)) {
        if (!btn.dataset.cartBound) {
          btn.dataset.cartBound = 'true';
          btn.addEventListener('click', function(e) {
            const oc = btn.getAttribute('onclick') || '';
            if (!oc.includes('addBoxToCart')) {
              e.preventDefault();
              e.stopImmediatePropagation();
              window.addBoxToCart(btn);
            }
          }, true);
        }
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initWishlistAndCart);
  } else {
    window.initWishlistAndCart();
  }
})();

// ==========================================
// 20. Form Validation for Authentication & Intake Pages
// ==========================================
function initFormValidation() {
  function setupNameInput(input) {
    if (!input || input.dataset.cvValidatedName) return;
    input.dataset.cvValidatedName = 'true';

    // Disallow typing numbers
    input.addEventListener('keydown', function(e) {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        if (window.showToast) window.showToast('Name field should not accept numbers', '⚠️');
      }
    });

    // Strip numbers if pasted
    input.addEventListener('input', function() {
      if (/[0-9]/.test(this.value)) {
        this.value = this.value.replace(/[0-9]/g, '');
        if (window.showToast) window.showToast('Name field does not accept numbers', '⚠️');
      }
      if (this.value.trim().length >= 2) {
        this.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
      }
    });
  }

  function setupEmailInput(input) {
    if (!input || input.dataset.cvValidatedEmail) return;
    input.dataset.cvValidatedEmail = 'true';

    input.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      if (val === '' || (val.endsWith('@gmail.com') && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(val))) {
        this.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
      }
    });

    input.addEventListener('blur', function() {
      const val = this.value.trim().toLowerCase();
      if (val && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(val)) {
        this.classList.add('border-red-500', 'ring-1', 'ring-red-500');
        if (window.showToast) window.showToast('Email address should be name@gmail.com', '⚠️');
      }
    });
  }

  function setupEstimatedValueInput(input) {
    if (!input || input.dataset.cvValidatedEstValue) return;
    input.dataset.cvValidatedEstValue = 'true';

    // Disallow typing alphabet letters
    input.addEventListener('keydown', function(e) {
      // Allow navigation and editing control keys
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Home', 'End'];
      if (allowedKeys.includes(e.key)) return;

      // Allow shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
      if (e.ctrlKey || e.metaKey) return;

      // Check if typed key is an alphabet letter
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        if (window.showToast) window.showToast('Estimated Value field should not accept alphabet letters', '⚠️');
      }
    });

    // Strip alphabet letters if pasted or autofilled
    input.addEventListener('input', function() {
      if (/[a-zA-Z]/.test(this.value)) {
        this.value = this.value.replace(/[a-zA-Z]/g, '');
        if (window.showToast) window.showToast('Estimated Value field does not accept alphabet letters', '⚠️');
      }
    });
  }

  function attachAllInputs() {
    const nameInputs = document.querySelectorAll('input[type="text"][placeholder*="Name" i], input[type="text"][name*="name" i], input[type="text"][id*="name" i], input[autocomplete="name"]');
    nameInputs.forEach(setupNameInput);

    const emailInputs = document.querySelectorAll('input[type="email"], input[placeholder*="email" i], input[name*="email" i], input[id*="email" i]');
    emailInputs.forEach(setupEmailInput);

    const estValueInputs = document.querySelectorAll('#consign-est-value, input[name*="estimated" i], input[id*="est-value" i], input[placeholder*="$15,000" i]');
    estValueInputs.forEach(setupEstimatedValueInput);

    // Also link any input having an associated "Estimated Value" label
    document.querySelectorAll('label').forEach(lbl => {
      if (/estimated\s*value/i.test(lbl.textContent)) {
        const forId = lbl.getAttribute('for');
        let target = forId ? document.getElementById(forId) : null;
        if (!target && lbl.parentElement) {
          target = lbl.parentElement.querySelector('input');
        }
        if (target) setupEstimatedValueInput(target);
      }
    });
  }

  attachAllInputs();

  // Re-run attachment for dynamic modals/forms if any
  const observer = new MutationObserver(attachAllInputs);
  observer.observe(document.body, { childList: true, subtree: true });

  // Form submission interceptor
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (!form || form.tagName !== 'FORM') return;

    const nameInput = form.querySelector('input[type="text"][placeholder*="Name" i], input[type="text"][name*="name" i], input[type="text"][id*="name" i], input[autocomplete="name"]');
    if (nameInput) {
      const nameVal = nameInput.value.trim();
      if (/[0-9]/.test(nameVal)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        nameInput.classList.add('border-red-500', 'ring-1', 'ring-red-500');
        nameInput.focus();
        if (window.showToast) window.showToast('Name field should not accept numbers', '⚠️');
        return false;
      }
      if (nameVal.length < 2) {
        e.preventDefault();
        e.stopImmediatePropagation();
        nameInput.classList.add('border-red-500', 'ring-1', 'ring-red-500');
        nameInput.focus();
        if (window.showToast) window.showToast('Name must be 2 characters or more', '⚠️');
        return false;
      }
      nameInput.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    }

    const emailInput = form.querySelector('input[type="email"], input[placeholder*="email" i], input[name*="email" i], input[id*="email" i]');
    if (emailInput) {
      const emailVal = emailInput.value.trim().toLowerCase();
      const isContactPage = window.location.pathname.includes('contact.html') || form.closest('#contact-form');
      const emailRegex = isContactPage 
        ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        : /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(emailVal)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        emailInput.classList.add('border-red-500', 'ring-1', 'ring-red-500');
        emailInput.focus();
        if (window.showToast) {
          window.showToast(isContactPage ? 'Please enter a valid email address' : 'Email address should be name@gmail.com', '⚠️');
        }
        return false;
      }
      emailInput.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    }

    const estInput = form.querySelector('#consign-est-value, input[name*="estimated" i], input[id*="est-value" i]');
    if (estInput) {
      if (/[a-zA-Z]/.test(estInput.value)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        estInput.classList.add('border-red-500', 'ring-1', 'ring-red-500');
        estInput.focus();
        if (window.showToast) window.showToast('Estimated Value field should not accept alphabet letters', '⚠️');
        return false;
      }
      estInput.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    }
  }, true);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFormValidation);
} else {
  initFormValidation();
}

// ==========================================
// 17. Scroll Reveal Engine for Content Sections
// ==========================================
function initScrollAnimations() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  // Target below-the-fold content sections (exclude header, mobile drawer, hero, and interactive shopping grids)
  const sections = document.querySelectorAll('body > section:not(header):not(#mobile-menu), main > section:not(header):not(#mobile-menu)');
  
  sections.forEach((sec, idx) => {
    if (sec.id === 'mobile-menu' || sec.closest('header') || sec.classList.contains('no-reveal')) return;
    
    // Check if section is above the fold or in initial viewport (don't animate initial view to avoid page-load flash)
    const rect = sec.getBoundingClientRect();
    if (idx === 0 || rect.top < window.innerHeight * 0.85) {
      sec.classList.add('is-revealed');
      return;
    }

    if (!sec.classList.contains('reveal-on-scroll')) {
      sec.classList.add('reveal-on-scroll');
    }
  });

  const revealElements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed), .reveal-scale:not(.is-revealed), .reveal-left:not(.is-revealed), .reveal-right:not(.is-revealed)');
  if (revealElements.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -20px 0px',
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      el.classList.add('is-revealed');
    } else {
      revealObserver.observe(el);
    }
  });
}


