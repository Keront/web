document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    const emailInput = document.getElementById("email");

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
    | Отправка формы
    |--------------------------------------------------------------------------
    */

    form?.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = emailInput.value.trim();

        const password =
            window.currentMode === "login"
                ? document
                    .getElementById("loginPassword")
                    .value
                    .trim()
                : document
                    .getElementById("registerPassword")
                    .value
                    .trim();
        
        if (window.currentMode === "register") {

    try {

        const checkResponse = await fetch(
            "./api/server.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    action: "checkEmail",
                    email
                })
            }
        );

        const checkResult =
            await checkResponse.json();

        if (checkResult.exists) {

            const emailError =
                document.querySelector(
                    ".modal__form-error-email"
                );

            emailError.classList.remove(
                "hidden"
            );

            emailError.classList.remove(
                "success"
            );

            emailError.classList.add(
                "error"
            );

            emailError.textContent =
                "Пользователь уже существует";

            return;
        }

    } catch (error) {

        console.error(error);

        return;
    }
}            

        /*
        |--------------------------------------------------------------------------
        | Проверка подтверждения пароля
        |--------------------------------------------------------------------------
        */

        if (window.currentMode === "register") {

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value
                    .trim();

            const confirmError = document.querySelector(
                ".modal__form-error-confirm"
            );

            confirmError.classList.add("hidden");
            confirmError.classList.remove("error");

            if (password !== confirmPassword) {

                confirmError.classList.remove("hidden");
                confirmError.classList.add("error");

                confirmError.textContent =
                    "Пароли не совпадают";

                return;
            }
        }

        try {

            const response = await fetch(
                "./api/server.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        action: window.currentMode,
                        email,
                        password
                    })
                }
            );

            const result = await response.json();

            if (!result.success) {

                const passwordError = document.querySelector(
                    ".modal__form-error-password"
                );

                if (passwordError) {

                    passwordError.classList.remove("hidden");
                    passwordError.classList.remove("success");
                    passwordError.classList.add("error");

                    passwordError.textContent =
                        result.message;
                }

                return;
            }

            localStorage.setItem(
                "currentUser",
                email
            );

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

    const block = document.querySelector(
        ".modal__formBlock"
    );

    if (!block) return;

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