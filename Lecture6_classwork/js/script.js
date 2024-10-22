// Initialize celestial objects
const celestialObjects = [
    {
        name: "Sun",
        img: "./img/sun.png",
        text: [
            "Title: Sun",
            "Type: G-type main-sequence star",
            "Diameter: 1 392 684 kilometers",
            "Weight: 1.989e30 kilograms",
            "Population: NA",
        ],
        class: "star",
        id: "sun",
        color: "#fd880c",
        fontSize: "24px",
    },
    {
        name: "Earth",
        img: "./img/earth.png",
        text: [
            "Title: Earth",
            "Type: Terrestrial planet",
            "Diameter: 12 742 kilometers",
            "Weight: 5.972e24 kilograms",
            "Population: 7.594e9",
        ],
        class: "planet",
        id: "earth",
        color: "#636e45",
        fontSize: "12px",
        orbitSpeed: 365,
        position: 20,
        zIndex: 3,
        isMovingLeft: true,
    },
    {
        name: "Mars",
        img: "./img/mars.png",
        text: [
            "Title: Mars",
            "Type: Terrestrial planet",
            "Diameter: 6 779 kilometers",
            "Weight: 6.39e23 kilograms",
            "Population: 0",
        ],
        class: "planet",
        id: "mars",
        color: "#a16746",
        fontSize: "12px",
        orbitSpeed: 687,
        position: 10,
        zIndex: 4,
        isMovingLeft: true,
    },
];

// Create celestial objects in the DOM
celestialObjects.forEach((object) => {
    // Main container
    const main = document.querySelector(".main");

    // Celestial object container
    const celestialObject = document.createElement("div");
    celestialObject.classList.add("celestialObject");
    celestialObject.classList.add(object.class);
    celestialObject.id = object.id;

    // Celestial object img
    const img = document.createElement("img");
    img.classList.add("img");
    img.src = object.img;
    img.alt = object.name;

    // Celestial object description
    const desc = document.createElement("p");
    desc.classList.add("desc");
    desc.style.borderColor = object.color;
    desc.style.fontSize = object.fontSize;

    object.text.forEach((line) => {
        const textNode = document.createTextNode(line);
        desc.appendChild(textNode);
        desc.appendChild(document.createElement("br"));
    });

    celestialObject.appendChild(img);
    celestialObject.appendChild(desc);
    main.appendChild(celestialObject);
});

// Planets animations
let isHover = false;

function planetAnimation(object) {
    const left = (visualViewport.width * object.position) / 100;
    const right = (visualViewport.width * (100 - object.position)) / 100;
    const distance = Math.abs(left - right);
    const currentPos =
        $(`#${object.id}`).position().left + $(`#${object.id}`).width() / 2;

    const realSpeed = object.orbitSpeed * 24 * 60 * 60 * 1000; //Real time speed
    const playbackSpeed = 5000000;
    const speed = realSpeed / playbackSpeed;

    if (object.isMovingLeft) {
        $(`#${object.id}`).animate(
            {
                left: `${100 - object.position}%`,
                zIndex: `${8 - object.zIndex}`,
            },
            speed / (distance / (right - currentPos)),
            function () {
                object.isMovingLeft = false;
                planetAnimation(object);
            }
        );
    } else {
        $(`#${object.id}`).animate(
            {
                left: `${object.position}%`,
                zIndex: `${8 + object.zIndex}`,
            },
            speed / (distance / Math.abs(left - currentPos)),
            function () {
                object.isMovingLeft = true;
                planetAnimation(object);
            }
        );
    }
}

// Description animation and hover event
$(".celestialObject").hover(
    function () {
        $(this).find(".desc").stop().slideDown();
        isHover = true;
        $(".celestialObject").stop(true, false);
    },
    function () {
        $(this)
            .find(".desc")
            .stop()
            .slideUp(function () {
                $(this).css("display", "none");
            });
        isHover = false;
        celestialObjects.forEach((object) => {
            if (object.class === "planet") {
                planetAnimation(object);
            }
        });
    }
);

// Initialize celestial object animation (JQuery)
$(document).ready(function () {
    celestialObjects.forEach((object) => {
        if (object.class === "planet" && isHover === false) {
            planetAnimation(object);
        }
    });
});
