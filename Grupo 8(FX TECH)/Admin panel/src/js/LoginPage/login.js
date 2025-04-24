document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const isValidRa = (ra) => /^\d{5,10}$/.test(ra);
    const isValidPassword = (pass) => /^\d{6}$/.test(pass);
    const isValidPersonType = (type) => ["aluno", "funcionario"].includes(type);

    const addValidation = (selector, validate, message) => {
        const input = document.querySelector(selector);
        const errorDiv = document.createElement("div");
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
        const ra = document.querySelector("#ra").value;
        const tipo = document.querySelector("#personType").value;
        const senha = document.querySelector("#password").value;

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
    const passwordInput = document.querySelector("#password");
    const eyeBtn = document.querySelector("#eye-btn");

    if (!passwordInput || !eyeBtn) {
        console.error("Elementos não encontrados.");
        return;
    }

    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    // Altera o atributo data-lucide no botão (recria o conteúdo)
    const newIcon = isHidden ? "eye" : "eye-off";

    // Atualiza o conteúdo do botão (remove o anterior e insere novo ícone)
    eyeBtn.innerHTML = `<i data-lucide="${newIcon}" style="color: #0000008a;"></i>`;

    // Recria os ícones
    lucide.createIcons();

    eyeBtn.classList.toggle("unvisible");
    eyeBtn.classList.toggle("visible");
}
