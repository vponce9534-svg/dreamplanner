// ===== LOGIN SIMPLE (PROYECTO ACADÉMICO) =====

// credenciales válidas
const USER_EMAIL = "admin@admin.com";
const USER_PASS  = "123456";

// detectar página
document.addEventListener("DOMContentLoaded", () => {

  // ----- LOGIN -----
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const pass  = document.getElementById("password").value.trim();
      const error = document.getElementById("loginError");

      if (email === USER_EMAIL && pass === USER_PASS) {
        // guardar sesión
        localStorage.setItem("loggedIn", "true");

        // ir al dashboard
        window.location.href = "dashboard.html";
      } else {
        error.textContent = "Usuario o contraseña incorrectos";
      }
    });
  }

  // ----- LOGOUT -----
  const logoutBtn = document.querySelector("[data-logout]");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    });
  }

});
