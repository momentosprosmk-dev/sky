/* ==========================================================================
   Sky — Lógica Interactiva del Taller Amigurumi
   ========================================================================== */

(() => {
  const mediaBase = document.body.dataset.mediaBase || "recursos/media/";
  const coleccionesStore = window.SkyColecciones;
  let activeCategory = "todas";

  // Selectores principales
  const collectionsGrid = document.getElementById("coleccionesGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const categoryCards = document.querySelectorAll("[data-filter-jump]");

  // Modal de detalle
  const productModal = document.getElementById("productModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalImg = document.getElementById("modalImg");
  const modalCat = document.getElementById("modalCat");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalSize = document.getElementById("modalSize");
  const modalMaterial = document.getElementById("modalMaterial");
  const modalTime = document.getElementById("modalTime");
  const modalWhatsappBtn = document.getElementById("modalWhatsappBtn");

  const toastEl = document.getElementById("toast");
  const siteHeader = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const customOrderForm = document.getElementById("customOrderForm");

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2800);
  }

  function buildWhatsappUrl(message) {
    if (window.enlaces && typeof window.enlaces.obtenerUrlWhatsapp === "function") {
      return window.enlaces.obtenerUrlWhatsapp(message);
    }
    const fallbackNum = window.enlaces?.whatsapp || "3000000000";
    return `https://wa.me/57${fallbackNum}?text=${encodeURIComponent(message)}`;
  }

  function getCollections() {
    if (!coleccionesStore) return [];
    return coleccionesStore.obtenerVisibles();
  }

  function resolveImg(path) {
    if (coleccionesStore) {
      return coleccionesStore.resolverImagen(path, mediaBase);
    }
    return `${mediaBase}${path}`;
  }

  function renderCollections() {
    if (!collectionsGrid) return;
    const items = getCollections();
    const filtered =
      activeCategory === "todas"
        ? items
        : items.filter((item) => item.categoria === activeCategory);

    if (filtered.length === 0) {
      collectionsGrid.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:2rem 0;">
          Pronto agregaremos más trabajos realizados en esta categoría.
        </p>
      `;
      return;
    }

    collectionsGrid.innerHTML = filtered
      .map(
        (item) => `
      <article class="product-card">
        <div class="collection-thumb">
          <img src="${resolveImg(item.imagen)}" alt="${item.nombre} tejido en crochet por Sky" loading="lazy">
          ${item.etiqueta ? `<span class="product-badge">${item.etiqueta}</span>` : ""}
        </div>
        <div class="product-info">
          <span class="product-cat">${item.categoriaLabel || item.categoria}</span>
          <h3>${item.nombre}</h3>
          <p class="product-desc">${item.descripcion}</p>
          <div class="product-meta">
            <span style="font-size:0.82rem;color:var(--muted);">${item.tamano || "Bajo pedido"}</span>
            <div class="product-actions">
              <button type="button" class="icon-btn" title="Ver detalles" aria-label="Ver detalles de ${item.nombre}" data-modal-id="${item.id}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-quote-id="${item.id}">
                Cotizar similar
              </button>
            </div>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  function openDetailModal(itemId) {
    const item = getCollections().find((entry) => entry.id === itemId);
    if (!item || !productModal || !modalBackdrop) return;

    modalImg.src = resolveImg(item.imagen);
    modalImg.alt = item.nombre;
    modalCat.textContent = item.categoriaLabel || item.categoria;
    modalTitle.textContent = item.nombre;
    modalDesc.textContent = item.descripcion;
    modalSize.textContent = item.tamano || "A medida";
    modalMaterial.textContent = item.material || "Algodón hipoalergénico";
    modalTime.textContent = item.tiempo || "Según diseño";
    modalWhatsappBtn.dataset.quoteId = item.id;

    productModal.classList.add("open");
    modalBackdrop.classList.add("open");
  }

  function closeDetailModal() {
    if (!productModal || !modalBackdrop) return;
    productModal.classList.remove("open");
    modalBackdrop.classList.remove("open");
  }

  function quoteSimilarById(itemId) {
    const item = getCollections().find((entry) => entry.id === itemId);
    if (!item) return;
    const message = `¡Hola Sky! Vi "${item.nombre}" en tus colecciones y me gustaría cotizar un diseño similar bajo pedido.`;
    window.open(buildWhatsappUrl(message), "_blank", "noopener");
  }

  // Eventos de filtrado
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCollections();
    });
  });

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const cat = card.dataset.filterJump;
      activeCategory = cat;
      filterButtons.forEach((b) => {
        b.classList.toggle("active", b.dataset.category === cat);
      });
      renderCollections();
      const target = document.getElementById("trabajos");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Delegación de eventos en tarjetas y modal
  document.addEventListener("click", (e) => {
    const modalBtn = e.target.closest("[data-modal-id]");
    if (modalBtn) {
      openDetailModal(modalBtn.dataset.modalId);
      return;
    }

    const quoteBtn = e.target.closest("[data-quote-id]");
    if (quoteBtn) {
      quoteSimilarById(quoteBtn.dataset.quoteId);
      if (quoteBtn.id === "modalWhatsappBtn") closeDetailModal();
    }
  });

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeDetailModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeDetailModal);

  // Formulario de pedido personalizado
  if (customOrderForm) {
    customOrderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = customOrderForm.nombre.value.trim();
      const tipo = customOrderForm.tipo.value;
      const personaje = customOrderForm.personaje.value.trim();
      const detalles = customOrderForm.detalles.value.trim();

      if (!nombre || !personaje) {
        showToast("Por favor completa tu nombre y el personaje o idea");
        return;
      }

      const message = `¡Hola Sky! Soy ${nombre} y quiero solicitar un diseño personalizado:\n• Tipo: ${tipo}\n• Personaje / Animal / Idea: ${personaje}${detalles ? `\n• Criterios y detalles: ${detalles}` : ""}`;
      window.open(buildWhatsappUrl(message), "_blank", "noopener");
      showToast(`Abriendo WhatsApp para enviar tu solicitud de "${personaje}".`);
      customOrderForm.reset();
    });
  }

  // Vincular enlaces dinámicos desde window.enlaces
  if (window.enlaces) {
    document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
      el.href = buildWhatsappUrl("¡Hola Sky! Me gustaría cotizar un tejido o amigurumi personalizado.");
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
    if (window.enlaces.email) {
      document.querySelectorAll("[data-email-link]").forEach((el) => {
        el.href = `mailto:${window.enlaces.email}`;
        el.textContent = window.enlaces.email;
      });
    }
  }

  // Menú móvil y header sticky
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  window.addEventListener("scroll", () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle("scrolled", window.scrollY > 18);
  });

  // Animación Reveal al hacer scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  renderCollections();
})();
