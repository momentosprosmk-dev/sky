/* ==========================================================================
   Sky — Boseto de Login y Gestión de Colecciones (Admin)
   ========================================================================== */

(() => {
  const SESSION_KEY = "sky_admin_session";
  const DEMO_USER = "sky";
  const DEMO_PASS = "sky2026";
  const CATEGORY_LABELS = {
    peluches: "Peluches & Animales",
    personajes: "Personajes",
    llaveros: "Llaveros & Mini",
    personalizados: "Personalizados",
  };

  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const itemForm = document.getElementById("itemForm");
  const formTitle = document.getElementById("formTitle");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const resetDemoBtn = document.getElementById("resetDemoBtn");
  const adminTableBody = document.getElementById("adminTableBody");
  const itemsCount = document.getElementById("itemsCount");
  const toastEl = document.getElementById("toast");

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function updateView() {
    const authed = isLoggedIn();
    loginView.style.display = authed ? "none" : "grid";
    dashboardView.style.display = authed ? "block" : "none";
    logoutBtn.style.display = authed ? "inline-flex" : "none";
    if (authed) renderTable();
  }

  function renderTable() {
    const items = window.SkyColecciones.obtenerTodas();
    itemsCount.textContent = items.length;

    adminTableBody.innerHTML = items
      .map(
        (item) => `
      <tr>
        <td>
          <img class="admin-thumb" src="${window.SkyColecciones.resolverImagen(item.imagen, "../media/")}" alt="${item.nombre}">
        </td>
        <td>
          <strong>${item.nombre}</strong><br>
          <span style="font-size:0.8rem;color:var(--muted);">${item.tamano || "A medida"} &middot; ${item.etiqueta || "Sin etiqueta"}</span>
        </td>
        <td>${item.categoriaLabel || CATEGORY_LABELS[item.categoria] || item.categoria}</td>
        <td>
          <span class="status-pill ${item.visible !== false ? "status-pill--active" : "status-pill--hidden"}">
            ${item.visible !== false ? "Visible" : "Oculto"}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
            <button type="button" class="btn btn-outline btn-sm" data-edit="${item.id}">Editar</button>
            <button type="button" class="btn btn-outline btn-sm" data-toggle="${item.id}">
              ${item.visible !== false ? "Ocultar" : "Mostrar"}
            </button>
            <button type="button" class="btn btn-outline btn-sm" data-delete="${item.id}" style="color:#9E2A3B;">Eliminar</button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  function resetForm() {
    itemForm.reset();
    document.getElementById("itemId").value = "";
    document.getElementById("itemVisible").checked = true;
    formTitle.textContent = "Agregar nuevo trabajo";
    cancelEditBtn.style.display = "none";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value;
    if (user === DEMO_USER && pass === DEMO_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      showToast("Bienvenida al panel de Sky");
      updateView();
    } else {
      showToast("Usuario o contraseña incorrectos (prueba: sky / sky2026)");
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    updateView();
  });

  itemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const items = window.SkyColecciones.obtenerTodas();
    const editId = document.getElementById("itemId").value;
    const categoria = document.getElementById("itemCategoria").value;
    const nombre = document.getElementById("itemNombre").value.trim();

    const record = {
      id:
        editId ||
        `${nombre
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`,
      nombre,
      categoria,
      categoriaLabel: CATEGORY_LABELS[categoria] || categoria,
      etiqueta: document.getElementById("itemEtiqueta").value.trim(),
      tamano: document.getElementById("itemTamano").value.trim(),
      tiempo: document.getElementById("itemTiempo").value.trim(),
      material: document.getElementById("itemMaterial").value.trim(),
      imagen: document.getElementById("itemImagen").value.trim(),
      descripcion: document.getElementById("itemDescripcion").value.trim(),
      visible: document.getElementById("itemVisible").checked,
    };

    if (editId) {
      const idx = items.findIndex((x) => x.id === editId);
      if (idx !== -1) items[idx] = record;
      showToast(`"${nombre}" actualizado`);
    } else {
      items.unshift(record);
      showToast(`"${nombre}" agregado a colecciones`);
    }

    window.SkyColecciones.guardarTodas(items);
    resetForm();
    renderTable();
  });

  cancelEditBtn.addEventListener("click", resetForm);

  resetDemoBtn.addEventListener("click", () => {
    window.SkyColecciones.restaurarEjemplo();
    resetForm();
    renderTable();
    showToast("Colecciones restauradas al ejemplo original");
  });

  adminTableBody.addEventListener("click", (e) => {
    const editId = e.target.closest("[data-edit]")?.dataset.edit;
    const toggleId = e.target.closest("[data-toggle]")?.dataset.toggle;
    const deleteId = e.target.closest("[data-delete]")?.dataset.delete;
    const items = window.SkyColecciones.obtenerTodas();

    if (editId) {
      const item = items.find((x) => x.id === editId);
      if (!item) return;
      document.getElementById("itemId").value = item.id;
      document.getElementById("itemNombre").value = item.nombre;
      document.getElementById("itemCategoria").value = item.categoria;
      document.getElementById("itemEtiqueta").value = item.etiqueta || "";
      document.getElementById("itemTamano").value = item.tamano || "";
      document.getElementById("itemTiempo").value = item.tiempo || "";
      document.getElementById("itemMaterial").value = item.material || "";
      document.getElementById("itemImagen").value = item.imagen || "";
      document.getElementById("itemDescripcion").value = item.descripcion || "";
      document.getElementById("itemVisible").checked = item.visible !== false;
      formTitle.textContent = `Editando: ${item.nombre}`;
      cancelEditBtn.style.display = "inline-flex";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (toggleId) {
      const item = items.find((x) => x.id === toggleId);
      if (!item) return;
      item.visible = item.visible === false;
      window.SkyColecciones.guardarTodas(items);
      renderTable();
      showToast(item.visible ? "Trabajo visible en la web" : "Trabajo oculto");
    } else if (deleteId) {
      const filtered = items.filter((x) => x.id !== deleteId);
      window.SkyColecciones.guardarTodas(filtered);
      renderTable();
      showToast("Trabajo eliminado del boseto");
    }
  });

  updateView();
})();
