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

$(document).ready(function() {
  $(".menu").click(function() {
    $("#mySidenav").width(250);
  })
  $(".closebtn").click(function() {
    $("#mySidenav").width(0);
  })
})

