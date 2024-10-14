// Fade Effects
$("#band-team p").hide();

$("#band-team .w3-third").mouseenter(function () {
  $(this).find("p").stop().fadeIn(200);
});

$("#band-team .w3-third").mouseleave(function () {
  $(this).find("p").stop().fadeOut(200);
});

// Slide Effects
$("#tour-options p, button").hide();

$("#tour-options .w3-third").click(function () {
    $(this).find("p, button").stop().slideToggle(400);
});


// Animation
$("#tour-options button").mouseenter(function () {
  $(this).stop().animate({ width: "100%" }, 400);
});

$("#tour-options button").mouseleave(function () {
  $(this).stop().animate({ width: "107.7px" }, 400);
});
