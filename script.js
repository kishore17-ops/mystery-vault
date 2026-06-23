/* ===========================================================
   MYSTERY VAULT — SCRIPT
   Handles: article data + rendering, live search, nav toggle,
   scroll progress, scroll-reveal animations, newsletter +
   contact form validation, back-to-top button.
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. ARTICLE DATA
     In a real deployment this could be fetched from a CMS/API.
     Kept inline here for a fast, dependency-free static site.
     Each article has a "slug" which maps 1:1 to its own
     dedicated page (e.g. slug "article1" -> article1.html).
  ----------------------------------------------------------- */
  const articles = [
    {
      slug: "article1",
      title: "D.B. Cooper: The Hijacker Who Vanished Into the Sky",
      category: "Unsolved Mysteries",
      excerpt: "In 1971 a man parachuted from a Boeing 727 with $200,000 in cash and was never seen again.",
      img: "article1-cover.svg",
      date: "Oct 8"
    },
    {
      slug: "article2",
      title: "The Voynich Manuscript: A Book No One Can Read",
      category: "Historical Mysteries",
      excerpt: "An illustrated medieval text written in a language that has defeated every cryptographer for a century.",
      img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=700&q=80",
      date: "Oct 5"
    },
    {
      slug: "article3",
      title: "SS Ourang Medan: Death Ship of the Pacific",
      category: "Ghost Ships",
      excerpt: "A distress call described an entire crew dead at their posts, frozen in terror, before the ship exploded.",
      img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=700&q=80",
      date: "Oct 2"
    },
    {
      slug: "article4",
      title: "The Sodder Children: Six Kids Who Disappeared in a Fire",
      category: "Disappearances",
      excerpt: "A house fire in 1945 left no remains — and decades of evidence suggesting the children may have lived.",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=80",
      date: "Sep 29"
    },
    {
      slug: "article5",
      title: "Cicada 3301: The Internet's Deepest Puzzle",
      category: "Internet Mysteries",
      excerpt: "A cryptographic scavenger hunt spanning the globe, with a purpose that remains entirely unknown.",
      img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&q=80",
      date: "Sep 24"
    },
    {
      slug: "article6",
      title: "The Dancing Plague of 1518",
      category: "Dark History",
      excerpt: "Hundreds of people danced uncontrollably for days in the streets of Strasbourg — some until they died.",
      img: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=700&q=80",
      date: "Sep 20"
    },
    {
      slug: "article7",
      title: "The Bermuda Triangle: Patterns in the Disappearances",
      category: "Unsolved Mysteries",
      excerpt: "Dozens of ships and planes lost over a single stretch of ocean. Coincidence, weather, or something more?",
      img: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=80",
      date: "Sep 16"
    },
    {
      slug: "article8",
      title: "The Antikythera Mechanism: Ancient Greek Computer",
      category: "Historical Mysteries",
      excerpt: "A 2,000-year-old bronze device that calculated astronomical positions with shocking precision.",
      img: "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=700&q=80",
      date: "Sep 11"
    },
    {
      slug: "article9",
      title: "The Lost Colony of Roanoke",
      category: "Disappearances",
      excerpt: "An entire English settlement vanished, leaving behind a single carved word: CROATOAN.",
      img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80",
      date: "Sep 6"
    }
  ];

  /* -----------------------------------------------------------
     2. RENDER ARTICLE CARDS
  ----------------------------------------------------------- */
  const grid = document.getElementById('articleGrid');
  const noResults = document.getElementById('noResults');

  function renderArticles(list) {
    grid.innerHTML = '';

    if (list.length === 0) {
      noResults.hidden = false;
      return;
    }
    noResults.hidden = true;

    list.forEach((item, i) => {
      const card = document.createElement('article');
      card.className = 'article-card';
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <div class="article-media">
          <img src="${item.img}" alt="${item.title}" loading="lazy" />
          <span class="article-category">${item.category}</span>
        </div>
        <div class="article-content">
          <p class="card-meta">${item.date} &middot; 7 min read</p>
          <h3>${item.title}</h3>
          <p class="article-excerpt">${item.excerpt}</p>
          <a href="${item.slug}.html" class="btn btn-outline">Read More</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderArticles(articles);

  /* -----------------------------------------------------------
     3. LIVE SEARCH
  ----------------------------------------------------------- */
  const searchInput = document.getElementById('searchInput');
  const searchStatus = document.getElementById('searchStatus');

  function filterArticles(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchStatus.textContent = '';
      return articles;
    }
    const filtered = articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q)
    );
    searchStatus.textContent = `${filtered.length} case file${filtered.length === 1 ? '' : 's'} found`;
    return filtered;
  }

  searchInput.addEventListener('input', (e) => {
    renderArticles(filterArticles(e.target.value));
  });

  /* Category cards filter the search + scroll to articles */
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      searchInput.value = category;
      renderArticles(filterArticles(category));
      document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* -----------------------------------------------------------
     4. NAV: sticky background + mobile toggle
  ----------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateScrollProgress();
    toggleBackToTop();
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  /* -----------------------------------------------------------
     5. SCROLL PROGRESS BAR
  ----------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }

  /* -----------------------------------------------------------
     6. SCROLL-REVEAL ANIMATIONS (Intersection Observer)
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  /* -----------------------------------------------------------
     7. BACK TO TOP BUTTON
  ----------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -----------------------------------------------------------
     8. NEWSLETTER FORM
  ----------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMsg = document.getElementById('newsletterMsg');

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();

    if (!isValidEmail(email)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      newsletterMsg.className = 'form-msg error';
      return;
    }

    newsletterMsg.textContent = `You're in. Watch your inbox, ${email.split('@')[0]}.`;
    newsletterMsg.className = 'form-msg success';
    newsletterForm.reset();
  });

  /* -----------------------------------------------------------
     9. CONTACT FORM VALIDATION
  ----------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const contactMsg = document.getElementById('contactMsg');

  const fields = {
    name: document.getElementById('contactName'),
    email: document.getElementById('contactEmail'),
    subject: document.getElementById('contactSubject'),
    message: document.getElementById('contactMessage')
  };
  const errors = {
    name: document.getElementById('errName'),
    email: document.getElementById('errEmail'),
    subject: document.getElementById('errSubject'),
    message: document.getElementById('errMessage')
  };

  function setError(field, message) {
    errors[field].textContent = message;
    fields[field].classList.toggle('invalid', Boolean(message));
  }

  function validateContactForm() {
    let valid = true;

    if (fields.name.value.trim().length < 2) {
      setError('name', 'Please enter your name.');
      valid = false;
    } else setError('name', '');

    if (!isValidEmail(fields.email.value.trim())) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    } else setError('email', '');

    if (fields.subject.value.trim().length < 3) {
      setError('subject', 'Subject must be at least 3 characters.');
      valid = false;
    } else setError('subject', '');

    if (fields.message.value.trim().length < 10) {
      setError('message', 'Message should be at least 10 characters.');
      valid = false;
    } else setError('message', '');

    return valid;
  }

  /* Clear errors as the user types */
  Object.keys(fields).forEach(key => {
    fields[key].addEventListener('input', () => setError(key, ''));
  });

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateContactForm()) {
    contactMsg.textContent = 'Please fix the highlighted fields.';
    contactMsg.className = 'form-msg error';
    return;
  }

  const formData = new FormData(contactForm);

  try {
    const response = await fetch('https://formspree.io/f/mysteryvalult@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if (response.ok) {
      contactMsg.textContent = 'Your message has been received. The vault will respond soon.';
      contactMsg.className = 'form-msg success';
      contactForm.reset();
    } else {
      contactMsg.textContent = 'Something went wrong. Please try again.';
      contactMsg.className = 'form-msg error';
    }
  } catch (err) {
    contactMsg.textContent = 'Network error — please try again later.';
    contactMsg.className = 'form-msg error';
  }
});

  /* -----------------------------------------------------------
     10. FOOTER YEAR
  ----------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Initial calls in case the page loads already scrolled */
  updateScrollProgress();
  toggleBackToTop();
});
