function adjustPosterStyles() {
  if ($(".login-poster")[0].style.display == "none") {
    $(".login-poster")[0].classList.remove("swing-out-top-bck");
    $(".signup-poster")[0].className += " swing-out-top-bck";
    setTimeout(function () {
      $(".signup-poster")[0].style.display = "none";
      $(".login-poster")[0].style.display = "flex";
    }, 250);
  } else {
    $(".signup-poster")[0].classList.remove("swing-out-top-bck");
    $(".login-poster")[0].className += " swing-out-top-bck";
    setTimeout(function () {
      $(".login-poster")[0].style.display = "none";
      $(".signup-poster")[0].style.display = "flex";
    }, 250);
  }
}

function createComic(n){
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
}

$(document).ready(function () {
  $(".menu").click(function () {
    $(".sidenav").width(250);
  })
  $(".closebtn").click(function () {
    $(".sidenav").width(0);
  })
})

function updateCover(event) {
  $("#Imgoutput").prop("src", URL.createObjectURL(event.target.files[0]));
}

$("#createComic").submit(function () {
  var comic = {
    cover: $("#createComic input[name=coverart]").val(),
    title: $("#createComic input[name=comicname]").val(),
    tags: $("#createComic input[name=comictags]").val(),
    description: $("#createComic input[name=comicdescription]").val()
  };
  $.ajax({
    type: "POST",
    datatype: 'json',
    url: "/srv/comic/create",
    contentType: 'application/json',
    data: JSON.stringify(comic),
    success: function (n) { if (n == 'failure') {/*error*/return; } var back = JSON.parse(data); $(location).attr("href", "/comic/edit?id=" + back.id); }
  });
});