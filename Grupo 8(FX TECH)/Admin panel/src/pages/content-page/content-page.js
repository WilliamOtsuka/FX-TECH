const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

console.log("Token:", token);
console.log("User:", user);
// <div class="list-content">
//             <i data-lucide="user"></i> Gustavo Althmann
//</div>
document.querySelector(".user-name").innerHTML = user.perfil.nome;
document.querySelector(".user-ra").innerHTML = user.RA;

document.addEventListener("DOMContentLoaded", () => {
    const optionsContainer = document.querySelector(".flex.gap-xl");
  
    if (user.permition > 1) {
      const adminCard = document.createElement("div");
      adminCard.classList.add("q-card", "options-card");
      adminCard.innerHTML = `
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
      optionsContainer.appendChild(adminCard);
    }
  });