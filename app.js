(function () {
  const root = document.documentElement;

  // ----------------- Tema -----------------
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) root.setAttribute("data-theme", savedTheme);
  } catch (_) {}

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (_) {}
      btn.setAttribute("aria-pressed", String(next === "dark"));
    });
  });

  // ----------------- Auth (prototipo) -----------------
  const DEMO_USER = "admin@admin.com";
  const DEMO_PASS = "123456";
  const AUTH_KEY = "dp_isLoggedIn";

  // sessionStorage suele funcionar aunque localStorage esté restringido
  const sGet = () => { try { return sessionStorage.getItem(AUTH_KEY); } catch (_) { return null; } };
  const sSet = (v) => { try { sessionStorage.setItem(AUTH_KEY, v); } catch (_) {} };

  const lGet = () => { try { return localStorage.getItem(AUTH_KEY); } catch (_) { return null; } };
  const lSet = (v) => { try { localStorage.setItem(AUTH_KEY, v); } catch (_) {} };

  const isLoggedIn = () => sGet() === "true" || lGet() === "true";
  const setLoggedIn = (val) => {
    const v = val ? "true" : "false";
    sSet(v);
    lSet(v);
  };

  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason");

  // Bloquear enlaces protegidos antes de login
  const protectSelectors = ["[data-protected-link]", "[data-protected-button]"];
  if (!isLoggedIn()) {
    document.querySelectorAll(protectSelectors.join(",")).forEach((el) => {
      el.classList.add("is-disabled");
      el.setAttribute("aria-disabled", "true");
      el.setAttribute("tabindex", "-1");
      el.addEventListener("click", (e) => e.preventDefault());
    });
  }

  // Guard de páginas protegidas
  const page = document.body?.getAttribute("data-page");
  const isProtectedPage = ["dashboard", "goals", "new-goal", "progress", "settings"].includes(page);
  if (isProtectedPage && !isLoggedIn()) {
    window.location.assign("login.html?reason=auth");
    return;
  }

  // ----------------- Login -----------------
  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    const email = document.querySelector("#email");
    const pass = document.querySelector("#password");
    const status = document.querySelector("#formStatus");
    const emailErr = document.querySelector("#emailError");
    const passErr = document.querySelector("#passError");

    const setErr = (el, box, msg) => { el.setAttribute("aria-invalid", "true"); box.textContent = msg; };
    const clearErr = (el, box) => { el.removeAttribute("aria-invalid"); box.textContent = ""; };

    if (status && reason === "auth") status.textContent = "Debes iniciar sesión para acceder al menú.";

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (status) status.textContent = "";
      let ok = true;

      const ev = (email.value || "").trim();
      if (!ev) { setErr(email, emailErr, "Ingresa tu correo."); ok = false; }
      else if (!/^\S+@\S+\.\S+$/.test(ev)) { setErr(email, emailErr, "Correo inválido (ej: nombre@dominio.com)."); ok = false; }
      else clearErr(email, emailErr);

      const pv = (pass.value || "");
      if (!pv) { setErr(pass, passErr, "Ingresa tu contraseña."); ok = false; }
      else if (pv.length < 6) { setErr(pass, passErr, "Mínimo 6 caracteres."); ok = false; }
      else clearErr(pass, passErr);

      if (!ok) {
        if (status) status.textContent = "Revisa los campos marcados. Hay errores.";
        (loginForm.querySelector('[aria-invalid="true"]') || email).focus();
        return;
      }

      const evNorm = ev.toLowerCase();
      const pvNorm = pv.trim();

      if (evNorm !== DEMO_USER || pvNorm !== DEMO_PASS) {
        if (status) status.textContent = "Credenciales incorrectas. Usa admin@admin.com / 123456.";
        setErr(email, emailErr, "Usuario incorrecto.");
        setErr(pass, passErr, "Contraseña incorrecta.");
        email.focus();
        return;
      }

      setLoggedIn(true);
      if (status) status.textContent = "Inicio de sesión correcto. Redirigiendo…";

      setTimeout(() => window.location.assign("dashboard.html"), 250);
    });
  }

  // ----------------- Logout -----------------
  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLoggedIn(false);
      window.location.assign("index.html");
    });
  });

  // ----------------- Formulario Nueva Meta -----------------
  const goalForm = document.querySelector("#goalForm");
  if (goalForm) {
    const title = document.querySelector("#goalTitle");
    const desc = document.querySelector("#goalDesc");
    const st = document.querySelector("#goalStatus");
    const gtErr = document.querySelector("#gtErr");
    const gdErr = document.querySelector("#gdErr");

    const setErr = (el, box, msg) => { el.setAttribute("aria-invalid", "true"); box.textContent = msg; };
    const clearErr = (el, box) => { el.removeAttribute("aria-invalid"); box.textContent = ""; };

    goalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      st.textContent = "";
      let ok = true;

      const tv = (title.value || "").trim();
      const dv = (desc.value || "").trim();

      if (!tv) { setErr(title, gtErr, "Escribe un título para la meta."); ok = false; }
      else if (tv.length < 3) { setErr(title, gtErr, "El título debe tener al menos 3 caracteres."); ok = false; }
      else clearErr(title, gtErr);

      if (!dv) { setErr(desc, gdErr, "Escribe una descripción clara."); ok = false; }
      else if (dv.length < 10) { setErr(desc, gdErr, "La descripción debe tener al menos 10 caracteres."); ok = false; }
      else clearErr(desc, gdErr);

      if (!ok) {
        st.textContent = "Hay errores en el formulario. Revisa los campos marcados.";
        (goalForm.querySelector('[aria-invalid="true"]') || title).focus();
        return;
      }

      st.textContent = "Meta guardada (simulado). Volviendo a Mis metas…";
      setTimeout(() => window.location.assign("goals.html"), 400);
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const file = (window.location.pathname.split("/").pop() || "").toLowerCase();

  // SOLO en index.html
  if (file === "" || file === "index.html") {
    const disabledLinks = document.querySelectorAll(".disabled-link");

    disabledLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
      });

      // efecto visual de deshabilitado
      link.style.pointerEvents = "none";
      link.style.opacity = "0.5";
      link.style.cursor = "not-allowed";
    });
  }
});
