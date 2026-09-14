(function () {
    var hero = document.querySelector('.bella-hero');
    if (!hero) return;

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.bella-hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.bella-hero-dots button'));
    var activeIndex = 0;
    var timer;

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            var isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);
            if (isActive) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
    }

    function startAutoplay() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 7000);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
            startAutoplay();
        });
    });

    hero.addEventListener('mouseenter', function () { window.clearInterval(timer); });
    hero.addEventListener('mouseleave', startAutoplay);
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) window.clearInterval(timer);
        else startAutoplay();
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startAutoplay();
}());
