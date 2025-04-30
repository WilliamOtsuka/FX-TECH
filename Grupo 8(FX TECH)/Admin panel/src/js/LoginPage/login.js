document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    let isValidRa = (ra) => /^\d{5,10}$/.test(ra);
    let isValidPassword = (pass) => /^\d{6}$/.test(pass);
    let isValidPersonType = (type) => ["aluno", "colaborador"].includes(type);

    let addValidation = (selector, validate, message) => {
        let input = document.querySelector(selector);
        let errorDiv = document.createElement("div");
        errorDiv.style.color = "red";
        errorDiv.style.fontSize = "12px";
        errorDiv.style.marginTop = "4px";
        input.insertAdjacentElement("afterend", errorDiv);

        input.addEventListener("input", (e) => {
            if (!validate(e.target.value)) {
                errorDiv.textContent = message;
                input.style.borderColor = "red";
            } else {
                errorDiv.textContent = "";
                input.style.borderColor = "green";
            }
        });
    };

    addValidation("#ra", isValidRa, "O RA deve conter entre 5 e 10 números.");


    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        let ra = document.querySelector("#ra").value;
        let tipo = document.querySelector("#personType").value;
        let senha = document.querySelector("#password").value;

        if (isValidRa(ra) && isValidPassword(senha) && isValidPersonType(tipo)) {
            // window.location.href = "../content-page/content-page.html";
            try {
                console.log("ra, tipo, senha:", ra, tipo, senha); // Para depuração

                fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ra, tipo, senha }),
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Erro ao fazer login.");
                        }
                    })
                    .then((data) => {
                        if (data.token) {
                            localStorage.setItem("token", data.token);
                            localStorage.setItem("user", JSON.stringify(data.user));
                            window.location.href = "../content-page/content-page.html";
                        } else {
                            alert("Erro ao logar");
                        }
                    })
                    .catch((error) => {
                        console.error("Erro:", error);
                        alert("Erro ao fazer login. Verifique suas credenciais.");
                    });
            }
            catch (error) {
                console.error("Erro ao fazer login:", error);
                alert("Erro ao fazer login. Tente novamente mais tarde.");
            }
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });
});

function showPass() {
    let passwordInput = document.querySelector("#password");
    let eyeBtn = document.querySelector("#eye-btn");

    if (!passwordInput || !eyeBtn) {
        console.error("Elementos não encontrados.");
        return;
    }

    let isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    // Altera o atributo data-lucide no botão (recria o conteúdo)
    let newIcon = isHidden ? "eye" : "eye-off";

    // Atualiza o conteúdo do botão (remove o anterior e insere novo ícone)
    eyeBtn.innerHTML = `<i data-lucide="${newIcon}" style="color: #0000008a;"></i>`;

    // Recria os ícones
    lucide.createIcons();

    eyeBtn.classList.toggle("unvisible");
    eyeBtn.classList.toggle("visible");
}
