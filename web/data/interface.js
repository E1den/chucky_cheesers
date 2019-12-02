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

    var file = $("#file-upload")[0].files[0];
    var formData = new FormData();
    formData.append("upload_file", true);
    formData.append("title",$("#createComic input[name=comicname]").val());
    formData.append("tags",$("#createComic input[name=comictags]").val());
    formData.append("description",$("#comicdescription").val());
    formData.append('file', file);

    $.ajax({
      type: "POST",
      url: "/srv/comic/create",
      processData: false,
      contentType: false,
      data: formData,
      success: function (n) { if (n == 'failure') {return;} $(location).attr("href", "/comic/editor/?id="+n); }
    });
  });
});

function updateCover(event) {
  $("#Imgoutput").prop("src", URL.createObjectURL(event.target.files[0]));
}