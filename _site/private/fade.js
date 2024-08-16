
document.addEventListener("DOMContentLoaded", function() {

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.top + rect.height >= 0
    );
}

function showDivsOnScroll() {
    document.querySelectorAll('.willfade').forEach(function(div) {
        if (isElementInViewport(div)) {
            div.classList.add('fadeIn');
            console.log("added class");
        }
    });
}

// Initial check
showDivsOnScroll();

// Check when scrolling
window.addEventListener('scroll', showDivsOnScroll);
});


