const width = 2560;
const height = 1440

$(window).resize(function () {
  window.setupPages();
});

window.getLeftPage = function () {
  return window.ctx.getImageData(0, 0, width / 2, height);
}
window.getRightPage = function () {
  return window.ctx.getImageData(width / 2, 0, width, height);
}

window.error = function () {
  window.ctx.clearRect(0, 0, width, height);
  window.ctx.font = "70px Georgia";
  window.ctx.fillText("There has been an internal server error. Please refresh.", 400, 650);
  window.ctx.fillText("If the problem persists, please contact support.", 400, 735);
}

//frame = data, xOffset = offset for which page to display onto
window.handleFrame = function (frame, xOffset) {
  // Frame =>
  //      (x) imageURL
  //      (a) x
  //      (a) y
  //      (n) offsetX
  //      (n) offsetY
  //      (a) width
  //      (a) height
  //
  //  x => original
  //  a => added by layout
  //  n => i dont think this will even be non-zero

  window.ctx.beginPath();
  window.ctx.lineWidth = 2;
  window.ctx.rect(frame.x + xOffset, frame.y, frame.width, frame.height);
  window.ctx.stroke();
  var img = new Image();

  if (frame.offsetX == undefined)
    frame.offsetX = 0;
  if (frame.offsetY == undefined)
    frame.offsetY = 0;


  img.onload = function (e) {
    window.ctx.beginPath();
    window.ctx.drawImage(img, frame.offsetX, frame.offsetY, frame.width, frame.height, frame.x + xOffset, frame.y, frame.width, frame.height);
    window.ctx.stroke();
  }

  if (frame.imageURL == undefined) {
    window.frameError(frame.x + (frame.width / 2) + xOffset, frame.y + (frame.height / 2));
    return;
  }

  img.src = "/imgs/" + frame.imageURL;
}

//returns the positioning for a page
window.getLayoutPos = function (num) {
  switch (num) {
    case 0:
      // 4 frames => 4 500x500 frames evenly spaced
      return [
        //1
        {
          x: 93,
          y: 146,
          width: 500,
          height: 500
        },
        //2
        {
          x: 686,
          y: 146,
          width: 500,
          height: 500
        },
        //3
        {
          x: 93,
          y: 793,
          width: 500,
          height: 500
        },
        //4
        {
          x: 686,
          y: 793,
          width: 500,
          height: 500
        }
      ];
      break;
    case 1:
      // 3 frames =? 3 300x1000 frames
      return [
        {
          x: 93,
          y: 146,
          width: 1000,
          height: 300
        },
        {
          x: 93,
          y: 451,
          width: 1000,
          height: 300
        },
        {
          x: 93,
          y: 756,
          width: 1000,
          height: 300
        }
      ];
      break;
    case 2:
      // 3 frames => 3 1000x300 frames
      return [
        {
          x: 93,
          y: 146,
          width: 300,
          height: 1000
        },
        {
          x: 398,
          y: 146,
          width: 300,
          height: 1000
        },
        {
          x: 703,
          y: 146,
          width: 300,
          height: 1000
        }
      ];
      break;
    case 3:
      // 4 frames => 2 300x1000 frames 2 500x500
      return [
        {
          x: 93,
          y: 146,
          width: 1050,
          height: 300
        },
        {
          x: 93,
          y: 451,
          width: 1050,
          height: 300
        },
        {
          x: 93,
          y: 756,
          width: 500,
          height: 500
        },
        {
          x: 686,
          y: 756,
          width: 500,
          height: 500
        }
      ];
      break;
  }
}

//assesses the data and adds in the layout data
window.handleLayout = function () {
  try {
    var left = window.comicData.page[window.leftPageNum];
    window.getLayoutPos(left.layout).forEach(function (frame, index) {
      //pass layout to the frame rach frame object on the left page
      left.frames[index].x = frame.x;
      left.frames[index].y = frame.y;
      left.frames[index].width = frame.width;
      left.frames[index].height = frame.height;
      //draw the frame
      window.handleFrame(left.frames[index], 0);
    });
  }
  catch (e) {
    window.pageError(0);
    return;
  }

  try {
    if (window.comicData.page.length == 0 || window.leftPageNum + 1 > window.comicData.page.length)
      return;
    var right = window.comicData.page[window.leftPageNum + 1];
    window.getLayoutPos(right.layout).forEach(function (frame, index) {
      //pass layout to the frame rach frame object on the right page
      right.frames[index].x = frame.x;
      right.frames[index].y = frame.y;
      right.frames[index].width = frame.width;
      right.frames[index].height = frame.height;
      //draw the frame
      window.handleFrame(right.frames[index], width / 2);
    });
  }
  catch (e) { window.pageError(width / 2); }
}

//pulls down data from the server
function grabData() {
  $.ajax({
    type: "POST",
    url: "/srv/comic/pages",
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ "id": window.COMIC_ID }),
    success: function (n) {
      if (n == 'failure') {
        window.error();
        return;
      }
      window.comicData = n;
      window.dataLoaded();
      window.handleLayout();
      setupUtility();
    }
  }).fail(window.error)
}

//create page selection buttons
function setupUtility() {
  try {
    if (window.leftPageNum - 2 >= 0) {
      var left = new Image();
      left.onload = function () {
        ctx.drawImage(left, width * 0.02, height * 0.92);
      }
      //left arrow base64
      left.src = "data:image/png;base64,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";
    }
    if (window.leftPageNum + 2 <= window.comicData.page.length) {
      var right = new Image();
      right.onload = function () {
        ctx.drawImage(right, width * 0.95, height * 0.92);
      }
      //right arrow base64
      right.src = "data:image/png;base64,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";
    }
  }
  catch (e) { }
}

//calls everything, called everytime the pages are updated(page turns/ on load)
window.setupPages = function () {
  window.ctx.clearRect(0, 0, width, height);
  window.ctx.lineWidth = 2;
  window.ctx.beginPath();
  window.ctx.moveTo(width / 2, height);
  window.ctx.lineTo(width / 2, 0);
  window.ctx.stroke();
  grabData();
}

window.redrawPages = function () {
  window.ctx.clearRect(0, 0, width, height);
  window.ctx.lineWidth = 2;
  window.ctx.beginPath();
  window.ctx.moveTo(width / 2, height);
  window.ctx.lineTo(width / 2, 0);
  window.ctx.stroke();
  window.handleLayout();
  setupUtility();
}


$(document).ready(function () {
  $.urlParam = function (httpParam) {
    var results = new RegExp('[\?&]' + httpParam + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null; //non existent
    }
    //faster typing
    return decodeURI(results[1]) || 0;
  }
  window.COMIC_ID = $.urlParam('id');
  window.ctx = $("#comic-viewer")[0].getContext('2d');
  window.leftPageNum = 0;
  window.comicData = {};

  window.setupPages();

});

function deleteComic(confirm) {
  if ($(".delete-confirm").hasClass("delete-confirm-on")) {
    $(".delete-confirm").removeClass("delete-confirm-on")
  }
  else {
    $(".delete-confirm").addClass("delete-confirm-on")
  }

  if (confirm == "yes") {
    $.ajax({
      type: "POST",
      url: "/srv/comic/delete",
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ "id": window.COMIC_ID })
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

function toEditor() {
  if (!$(".nav-link").html().includes("/"))
    $(location).attr("href", "/comic/editor/?id=" + window.COMIC_ID);
  else
    alert("You must be logged in to edit a comic.");
}
