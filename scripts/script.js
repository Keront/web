document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.mainWithSlider__slider', {
        loop: true,
        observer: true,           // Следить за изменениями
        observeParents: true,     // Следить за родителями
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
