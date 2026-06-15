document.addEventListener("DOMContentLoaded", () => {

    /*
    |--------------------------------------------------------------------------
    | Swiper
    |--------------------------------------------------------------------------
    */

    new Swiper(".mainWithSlider__slider", {
        loop: true,

        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },

        observer: true,
        observeParents: true,
        watchOverflow: true,

        pagination: {
            el: ".mainWithSlider__sliderZone .swiper-pagination",
            clickable: true,

            renderBullet(index, className) {
                return `<span class="${className}"></span>`;
            }
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Прелоадер
    |--------------------------------------------------------------------------
    */

    setTimeout(() => {

        const preloader = document.querySelector(".preloader");

        if (preloader) {
            preloader.innerHTML = "";
            preloader.style.display = "none";
        }

    }, 500);

    /*
    |--------------------------------------------------------------------------
    | Элементы формы
    |--------------------------------------------------------------------------
    */

    const authSwitch = document.getElementById("authSwitch");

    const registerTab = document.getElementById("registerTab");
    const loginTab = document.getElementById("loginTab");

    const emailInput = document.getElementById("email");

    const loginPasswordGroup =
        document.getElementById("loginPasswordGroup");

    const registerPasswordGroup =
        document.getElementById("registerPasswordGroup");

    const confirmPasswordGroup =
        document.getElementById("confirmPasswordGroup");

    const passwordRequirements =
        document.getElementById("passwordRequirements");

    const registerPasswordInput =
        document.getElementById("registerPassword");

    const confirmInput =
        document.getElementById("confirmPassword");

    const emailError = document.querySelector(
        ".modal__form-error-email"
    );

    const passwordError = document.querySelector(
        ".modal__form-error-register-password"
    );

    const confirmError = document.querySelector(
        ".modal__form-error-confirm"
    );

    window.currentMode = "register";

    /*
    |--------------------------------------------------------------------------
    | Переключение режимов
    |--------------------------------------------------------------------------
    */

    registerTab?.addEventListener("click", () => {

        window.currentMode = "register";

        authSwitch?.classList.remove("login");

        loginPasswordGroup?.classList.add("hidden");

        registerPasswordGroup?.classList.remove("hidden");

        confirmPasswordGroup?.classList.remove("hidden");

        passwordRequirements?.classList.remove("hidden");

        clearValidation();
    });

    loginTab?.addEventListener("click", () => {

        window.currentMode = "login";

        authSwitch?.classList.add("login");

        loginPasswordGroup?.classList.remove("hidden");

        registerPasswordGroup?.classList.add("hidden");

        confirmPasswordGroup?.classList.add("hidden");

        passwordRequirements?.classList.add("hidden");

        clearValidation();

        document.getElementById("loginPassword")?.focus();
    });

    /*
    |--------------------------------------------------------------------------
    | Проверка email
    |--------------------------------------------------------------------------
    */

    emailInput?.addEventListener("blur", checkEmailExists);

    async function checkEmailExists() {

        if (window.currentMode !== "register") {
            return;
        }

        const email = emailInput.value.trim();

        if (!email) {
            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return;
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
                        action: "checkEmail",
                        email
                    })
                }
            );

            const result = await response.json();

            if (result.exists) {

                showError(
                    emailError,
                    "Пользователь уже существует"
                );

            } else {

                showSuccess(
                    emailError,
                    "Email доступен"
                );
            }

        } catch (error) {

            console.error(error);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Валидация
    |--------------------------------------------------------------------------
    */

    emailInput?.addEventListener("input", validateForm);

    registerPasswordInput?.addEventListener(
        "input",
        validateForm
    );

    confirmInput?.addEventListener(
        "input",
        validateForm
    );

    function validateForm() {

        const email = emailInput?.value.trim() || "";

        const password =
            registerPasswordInput?.value.trim() || "";

        const confirm =
            confirmInput?.value.trim() || "";

        clearValidation();

        if (email.length > 0) {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showError(
                    emailError,
                    "Введите корректный email"
                );
            }
        }

        if (
            window.currentMode === "register" &&
            password.length > 0
        ) {

            const validPassword =
                password.length >= 8 &&
                password.length <= 16 &&
                /[A-Za-z]/.test(password) &&
                /\d/.test(password);

            if (!validPassword) {

                showError(
                    passwordError,
                    "Пароль не соответствует требованиям"
                );

            } else {

                showSuccess(
                    passwordError,
                    "Пароль соответствует требованиям"
                );
            }
        }

        if (
            window.currentMode === "register" &&
            confirm.length > 0
        ) {

            if (password !== confirm) {

                showError(
                    confirmError,
                    "Пароли не совпадают"
                );

            } else {

                showSuccess(
                    confirmError,
                    "Пароли совпадают"
                );
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Лайки
    |--------------------------------------------------------------------------
    */

    initLikes();
});


function clearValidation() {

    document
        .querySelectorAll(
            ".modal__form-error-email, " +
            ".modal__form-error-password, " +
            ".modal__form-error-register-password, " +
            ".modal__form-error-confirm"
        )
        .forEach(item => {

            item.textContent = "";

            item.classList.add("hidden");
            item.classList.remove("error");
            item.classList.remove("success");
        });
}

function showError(element, text) {

    if (!element) return;

    element.classList.remove("hidden");
    element.classList.remove("success");
    element.classList.add("error");

    element.textContent = text;
}

function showSuccess(element, text) {

    if (!element) return;

    element.classList.remove("hidden");
    element.classList.remove("error");
    element.classList.add("success");

    element.textContent = text;
}
/*
|--------------------------------------------------------------------------
| Модальное окно
|--------------------------------------------------------------------------
*/

function modalOpen() {

    const modal = document.querySelector(".modal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function modalClose() {

    const modal = document.querySelector(".modal");

    if (!modal) return;

    modal.style.display = "none";

    document.getElementById("registerForm")?.reset();

    document.getElementById("loginPassword").value = "";

    document.getElementById("registerPassword").value = "";

    document.getElementById("confirmPassword").value = "";

    clearValidation();

    document
        .querySelector(".password-requirements__list")
        ?.style.setProperty("display", "none");

    document
        .getElementById("authSwitch")
        ?.classList.remove("login");

    document
        .getElementById("loginPasswordGroup")
        ?.classList.add("hidden");

    document
        .getElementById("registerPasswordGroup")
        ?.classList.remove("hidden");

    document
        .getElementById("confirmPasswordGroup")
        ?.classList.remove("hidden");

    document
        .getElementById("passwordRequirements")
        ?.classList.remove("hidden");

    window.currentMode = "register";
}

function toggleRequirements() {

    const list = document.querySelector(
        ".password-requirements__list"
    );

    if (!list) return;

    list.style.display =
        list.style.display === "block"
            ? "none"
            : "block";
}

/*
|--------------------------------------------------------------------------
| Лайки
|--------------------------------------------------------------------------
*/

async function initLikes() {

    const btn = document.getElementById("lampLikeBtn");
    const count = document.getElementById("lampLikeCount");

    if (!btn || !count) return;

    try {

        const response = await fetch("./api/server.php", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                action: "getLikes"
            })
        });

        const result = await response.json();

        count.textContent = result.likes;

    } catch (error) {

        console.error(error);
    }

    if (localStorage.getItem("lampLiked")) {
        btn.classList.add("liked");
    }

    btn.addEventListener("click", async () => {

        if (localStorage.getItem("lampLiked")) {
            return;
        }

        try {

            const response = await fetch("./api/server.php", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    action: "addLike"
                })
            });

            const result = await response.json();

            count.textContent = result.likes;

            localStorage.setItem(
                "lampLiked",
                "true"
            );

            btn.classList.add("liked");

        } catch (error) {

            console.error(error);
        }
    });
}