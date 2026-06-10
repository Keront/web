document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    let currentMode = "register";

    /*
    |--------------------------------------------------------------------------
    | Проверяем авторизацию после F5
    |--------------------------------------------------------------------------
    */

    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
        showProfile(savedUser);
    }

    /*
    |--------------------------------------------------------------------------
    | Проверка email
    |--------------------------------------------------------------------------
    */

    emailInput.addEventListener("input", async () => {

        const email = emailInput.value.trim();

        if (!email.includes("@")) return;

        try {

            const response = await fetch("./api/server.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "checkEmail",
                    email
                })
            });

            const result = await response.json();

            const slider = document.querySelector(".auth-switch");

            if (result.exists) {
                currentMode = "login";
                slider.classList.add("login");
            } else {
                currentMode = "register";
                slider.classList.remove("login");
            }

        } catch (error) {
            console.error(error);
        }

    });

    /*
    |--------------------------------------------------------------------------
    | Отправка формы
    |--------------------------------------------------------------------------
    */

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {

            const response = await fetch("./api/server.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: currentMode,
                    email,
                    password
                })
            });

            const result = await response.json();

            if (!result.success) {

                const passwordError = document.querySelector(
                    ".modal__form-error-password"
                );

                passwordError.classList.remove("hidden");
                passwordError.classList.remove("success");
                passwordError.classList.add("error");

                passwordError.textContent = result.message;

                return;
            }

            localStorage.setItem("currentUser", email);

            showProfile(email);

        } catch (error) {
            console.error(error);
        }

    });

});

/*
|--------------------------------------------------------------------------
| Показ профиля
|--------------------------------------------------------------------------
*/

function showProfile(email) {

    const block = document.querySelector(".modal__formBlock");

    block.innerHTML = `
        <h1 class="modal__form-registration">
            Вы успешно авторизовались
        </h1>

        <p class="profile-email">
            ${email}
        </p>

        <button
            class="modal__btn buttonMainGreen"
            onclick="logout()">
            Выйти
        </button>

        <a
            class="modal__btn-close"
            onclick="modalClose()">
            Закрыть
        </a>
    `;
}

/*
|--------------------------------------------------------------------------
| Выход
|--------------------------------------------------------------------------
*/

function logout() {

    localStorage.removeItem("currentUser");

    location.reload();

}
