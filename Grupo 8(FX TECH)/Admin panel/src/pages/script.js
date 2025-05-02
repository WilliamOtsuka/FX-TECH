document.querySelector(".user-logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = `${location.origin}/Admin panel/src/pages/login/index.html`;
});

document.addEventListener("DOMContentLoaded", () => {
    if (user.perfil.permition > 1) {
      let container = document.querySelector(".container-card-section");
      if (container) {
        let card = document.createElement("div");
        card.className = "q-card options-card";
        card.innerHTML = `
          <div class="q-card-section">
            <div>
              <span class="material-icons options-icon" onclick="goTo('../register/professional-register.html')" style="font-size: 60px">
                admin_panel_settings
              </span>
            </div>
            <div class="options-icon" style="color: black" onclick="goTo('../register/professional-register.html')">
              Painel
            </div>
          </div>
        `;
        container.appendChild(card);
      }
    }    
});