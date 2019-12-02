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



$(document).ready(function () {
  $(".menu").click(function () {
    $(".sidenav").width(250);
  })
  $(".closebtn").click(function () {
    $(".sidenav").width(0);
  })

  $("#createComic").submit(function (n) {
    n.preventDefault();

    //var file = $("#createComic")[0].files[0];
    //var formData = new FormData().append('file', file);

    var comic = {
      cover: "",//formData,
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
      success: function (n) { if (n == 'failure') {return; } $(location).attr("href", "/comic/editor/?id="+n); }
    });
  });
})

function updateCover(event) {
  $("#Imgoutput").prop("src", URL.createObjectURL(event.target.files[0]));
}