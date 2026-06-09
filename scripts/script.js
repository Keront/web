document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.mainWithSlider__slider', {
        loop: true,
        // speed:500,
        // Добавляем этот блок:
        autoplay: {
            delay: 5000, // Пауза между слайдами в миллисекундах (3 секунды)
            disableOnInteraction: false, // Автоплей НЕ остановится, если вы кликните по слайдеру
        },

        observer: true,
        observeParents: true,
        watchOverflow: true,
        pagination: {
            el: '.mainWithSlider__sliderZone .swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            },
        },
    });
});

function modalOpen() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = "flex";
    }
}
function modalClose() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = "none";
    }
}
setTimeout(() => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.innerHTML = '';
        preloader.style.display = "none";
    }
}, 500);

document.addEventListener('DOMContentLoaded', () => {

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const emailError = document.querySelector('.modal__form-error-email');
    const passwordError = document.querySelector('.modal__form-error-password');

    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // =====================
        // EMAIL
        // =====================

        const emailParts = email.split('@');

        if (email.length === 0) {
            emailError.classList.add('hidden');
        } 
        else if (
            emailParts.length !== 2 ||
            emailParts[0].length === 0 ||
            emailParts[1].length === 0
        ) {
            emailError.classList.remove('hidden');
            emailError.classList.remove('success');
            emailError.classList.add('error');
            emailError.textContent = "Введите корректный email (user@mail.com)";
        } 
        else {
            const domain = emailParts[1];
            const dotIndex = domain.indexOf('.');

            if (dotIndex === -1) {
                emailError.classList.remove('hidden');
                emailError.classList.remove('success');
                emailError.classList.add('error');
                emailError.textContent = "В домене должна быть точка (mail.com)";
            } 
            else {
                const name = domain.slice(0, dotIndex);
                const tld = domain.slice(dotIndex + 1);

                if (!name || !tld) {
                    emailError.classList.remove('hidden');
                    emailError.classList.remove('success');
                    emailError.classList.add('error');
                    emailError.textContent = "Неверный формат домена";
                } 
                else {
                    emailError.classList.remove('hidden');
                    emailError.classList.remove('error');
                    emailError.classList.add('success');
                    emailError.textContent = "Email соответствует требованиям";
                }
            }
        }

        // =====================
        // PASSWORD
        // =====================

        const hasMinLength = password.length >= 8;
        const hasMaxLength = password.length <= 16;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);

        if (password.length === 0) {
            passwordError.classList.add('hidden');
        } 
        else if (!hasMinLength || !hasMaxLength || !hasNumber || !hasLetter) {
            passwordError.classList.remove('hidden');
            passwordError.classList.remove('success');
            passwordError.classList.add('error');
            passwordError.textContent = "Пароль не соответствует требованиям";
        } 
        else {
            passwordError.classList.remove('hidden');
            passwordError.classList.remove('error');
            passwordError.classList.add('success');
            passwordError.textContent = "Пароль соответствует требованиям";
        }
    }

});

function toggleRequirements() {
    const list = document.querySelector('.password-requirements__list');
    list.style.display = list.style.display === "block" ? "none" : "block";
}