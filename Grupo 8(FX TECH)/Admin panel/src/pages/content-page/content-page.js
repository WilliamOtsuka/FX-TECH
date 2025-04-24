const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

    console.log("Token:", token);
    console.log("User:", user);
    // <div class="list-content">
    //             <i data-lucide="user"></i> Gustavo Althmann
    //</div>
    document.querySelector(".user-name").innerHTML = user.perfil.nome;
    document.querySelector(".user-ra").innerHTML = user.RA;

    localStorage.setItem("teste", "teste");
    