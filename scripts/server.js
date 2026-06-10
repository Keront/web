document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch("./api/server.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const result = await response.json();

            if (result.success) {

                document.querySelector(".modal__form").innerHTML = `
                    <h2>Регистрация завершена</h2>

                    <button
                        class="modal__btn buttonMainGreen"
                        onclick="modalClose()">
                        Продолжить
                    </button>
                `;

            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    });

});