// document.querySelector(".user-logout").addEventListener("click", () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = `${location.origin}/Admin panel/src/pages/login/index.html`;
// });

// document.addEventListener("DOMContentLoaded", () => {
//     let user = JSON.parse(localStorage.getItem("user"));

//     if (user.perfil.permition > 1) {
//       let container = document.querySelector(".container-card-section");
//       if (container) {
//         let card = document.createElement("div");
//         card.className = "q-card options-card";
//         card.innerHTML = `
//           <div class="q-card-section">
//             <div>
//               <span class="material-icons options-icon" onclick="goTo('../register/professional-register.html')" style="font-size: 60px">
//                 admin_panel_settings
//               </span>
//             </div>
//             <div class="options-icon" style="color: black" onclick="goTo('../register/professional-register.html')">
//               Painel
//             </div>
//           </div>
//         `;
//         container.appendChild(card);
//       }
//     }    

//     // se achar <div class="side-menu-content">
//     let sideMenuContent = document.querySelector(".side-menu-content");
//     if (sideMenuContent) {
//       let urlParams = new URLSearchParams(window.location.search);
//       let idAMateria = urlParams.get("idM");
//       let idTurma = urlParams.get("idT");
//       sideMenuContent.innerHTML = `
//         <a class="side-menu-link" id="toggle-menu">
//         <i class="material-icons">menu</i>
//         </a>
//         <a href="../content-page/content-page.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
//         <i class="material-icons">home</i> <span>Inicio</span>
//         </a>
//         <a href="materias.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
//         <i class="material-icons">menu_book</i> <span>Materias</span>
//         </a>
//         <a href="participantes.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
//         <i class="material-icons">group</i> <span>Turma</span>
//         </a>
//         <a href="notas-materia.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
//         <i class="material-icons">grading</i> <span>Notas</span>
//         </a>
//       `;
//     }
// });