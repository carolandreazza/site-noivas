(function () {
    var hero = document.querySelector('.bella-hero');
    if (!hero) return;

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.bella-hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.bella-hero-dots button'));
    var activeIndex = 0;
    var timer;
    var dragStartX = null;
    var dragStartY = null;
    var activePointerId = null;

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

    function finishDrag(event) {
        if (dragStartX === null || (activePointerId !== null && event.pointerId !== activePointerId)) return;

        var distanceX = event.clientX - dragStartX;
        var distanceY = event.clientY - dragStartY;
        var isHorizontalGesture = Math.abs(distanceX) > Math.abs(distanceY);

        if (isHorizontalGesture && Math.abs(distanceX) >= 40) {
            showSlide(activeIndex + (distanceX < 0 ? 1 : -1));
            startAutoplay();
        }

        hero.classList.remove('is-dragging');
        dragStartX = null;
        dragStartY = null;
        activePointerId = null;
    }

    hero.addEventListener('pointerdown', function (event) {
        if (event.target.closest('.bella-hero-dots')) return;

        dragStartX = event.clientX;
        dragStartY = event.clientY;
        activePointerId = event.pointerId;
        hero.classList.add('is-dragging');
        hero.setPointerCapture(event.pointerId);
        window.clearInterval(timer);
    });

    hero.addEventListener('pointerup', finishDrag);
    hero.addEventListener('pointercancel', finishDrag);

    hero.addEventListener('mouseenter', function () { window.clearInterval(timer); });
    hero.addEventListener('mouseleave', startAutoplay);
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) window.clearInterval(timer);
        else startAutoplay();
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startAutoplay();
}());
