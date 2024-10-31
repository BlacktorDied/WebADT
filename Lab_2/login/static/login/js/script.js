document.addEventListener("DOMContentLoaded", function() {
    const images = [
        "/static/login/images/bg1.jpg",
        "/static/login/images/bg2.jpg",
        "/static/login/images/bg3.jpg"
    ];

    let currentIndex = 0;
    const switchInterval = 5000;

    function changeBackground() {
        document.body.style.backgroundImage = `url('${images[currentIndex]}')`;
        currentIndex = (currentIndex + 1) % images.length;
    }

    changeBackground();
    setInterval(changeBackground, switchInterval);
});

function showPopup(name, surname) {
    alert("Hello, " + name + " " + surname + "!");
}
