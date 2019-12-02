function deleteComic(confirm) {
  if ($(".delete-confirm").hasClass("delete-confirm-on")) {
    $(".delete-confirm").removeClass("delete-confirm-on")
  }
  else {
    $(".delete-confirm").addClass("delete-confirm-on")
  }

  if (confirm == "yes") {
    var data = {
      user_id: $("#AccName").html(),
      comic_id: ""
    };

    $.ajax({
      type: "POST",
      datatype: 'json',
      url: "/srv/comic/search",
      contentType: 'application/json',
      data: JSON.stringify(data)
    });
  }
  else if (confirm == "no") {
    $(".delete-confirm").removeClass("delete-confirm-on")
  }
}

function editFrame() {
  if ($(".edit-frame").hasClass("edit-frame-on")) {
    $(".edit-frame").removeClass("edit-frame-on")
  }
  else {
    $(".edit-frame").addClass("edit-frame-on")
  }
}

function chooseTemplate() {
  if ($(".choose-template").hasClass(".choose-template-on")) {
    $(".choose-template").removeClass(".choose-template-on")
  }
  else {
    $(".choose-template").addClass(".choose-template-on")
  }
}

function editProperties() {
  if ($(".edit-preferences").hasClass("edit-preferences-on")) {
    $(".edit-preferences").removeClass("edit-preferences-on")
  }
  else {
    $(".edit-preferences").addClass("edit-preferences-on")
  }
}

function popUp(givenClass) {
  var popupClass = givenClass;
  if ($(popupClass).hasClass("popup-on")) {
    $(popupClass).removeClass("popup-on")
  }
  else {
    $(popupClass).addClass("popup-on")
  }
}

$(document).ready(function () {
  $(".comic-page").click(function () {
    $(".page-open").addClass("page-open-on")
  });

  $(".close").click(function () {
    $(".page-open").removeClass("page-open-on")
  });
});

var slides
$(document).ready(function () {
  slides = $(".choice-slide");
});

$(".createComic").submit(function (n) {
  n.preventDefault();
  $.ajax({
    type: "POST",
    datatype: 'json',
    url: "/srv/comic/create",
    contentType: 'application/json',
    data: JSON.stringify($(".createComic").serializeArray()),
    success: function (n) {
        $(location).attr("href", "/comic/editor/");
    }
  })
}),


$(document).on('click', '.previous-slide', function () { animateSlides(0) })
$(document).on('click', '.next-slide', function () { animateSlides(1) })

var current = 0;
function animateSlides(np) {
  if (np == 1) {//do next
    $(slides[((current - 1) + slides.length) % slides.length]).removeClass("previous-slide");
    $(slides[current]).removeClass("current-slide");
    $(slides[current]).addClass("previous-slide");
    $(slides[((current + 1) + slides.length) % slides.length]).removeClass("next-slide");
    $(slides[((current + 1) + slides.length) % slides.length]).addClass("current-slide");
    $(slides[((current + 2) + slides.length) % slides.length]).addClass("next-slide");
    current = ((current + 1) + slides.length) % slides.length;
  }
  else {//do prev
    $(slides[((current - 1) + slides.length) % slides.length]).removeClass("previous-slide");
    $(slides[((current - 2) + slides.length) % slides.length]).addClass("previous-slide");
    $(slides[current]).removeClass("current-slide");
    $(slides[((current - 1) + slides.length) % slides.length]).addClass("current-slide");
    $(slides[((current + 1) + slides.length) % slides.length]).removeClass("next-slide");
    $(slides[current]).addClass("next-slide");
    current = ((current - 1) + slides.length) % slides.length;
  }
}
