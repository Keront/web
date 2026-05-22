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