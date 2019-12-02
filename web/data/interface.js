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

$("#createComic").submit(function(n){
  n.preventDefault();
  $.ajax({
    type: "POST",
    datatype: 'json',
    url: "/srv/comic/create",
    contentType: 'application/json',
    data: JSON.stringify($("#createComic").serializeArray()),
    success: function (n) {
        $(location).attr("href", "/comic/editor/");
    }
  })
});

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