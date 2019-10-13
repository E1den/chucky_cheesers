function forgotPass() {
  if ($(".login-poster")[0].style.display == "none") {
    $(".login-poster")[0].classList.remove("swing-out-top-bck");
    $(".forgotpass-poster")[0].className += " swing-out-top-bck";
    setTimeout(function () {
      $(".forgotpass-poster")[0].style.display = "none";
      $(".login-poster")[0].style.display = "flex";
    }, 250);
  } else {
    $(".forgotpass-poster")[0].classList.remove("swing-out-top-bck");
    $(".login-poster")[0].className += " swing-out-top-bck";
    setTimeout(function () {
      $(".login-poster")[0].style.display = "none";
      $(".forgotpass-poster")[0].style.display = "flex";
    }, 250);
  }
}

$(document).ready(function() {
    $("#signin").submit(function(n){
        n.preventDefault();
        $.ajax({
            type: "POST",
            datatype: 'json',
            url: "/srv/acct/login.js",
            contentType: 'application/json',
            data: JSON.stringify($("#signin").serializeArray()),
            success: function(n) {
                if(n.startsWith("success"))
                {
                    //good info
                    $(location).attr("href","/");
                }
                else if(n.startsWith("failure"))
                {
                    //bad info
                    $(".login-poster h2").html("No such account");
                }
                else
                {
                    //error
                    $(".login-poster h2").html("Error during login");
                }
            }
        })
    }),
    $("#signup").submit(function(n){
        n.preventDefault();
        $.ajax({
          type: "POST",
          datatype: 'json',
          url: "/srv/acct/signup.js",
          contentType: 'application/json',
          data: JSON.stringify($("#signup").serializeArray()),
          success: function(n) {
              if(n.startsWith("success"))
              {
                  //good info
                  $(location).attr("href","/");
              }
              else if(n.startsWith("failure"))
              {
                  //bad info
                  $(".login-poster h2").html("Invalid or Existing");
              }
              else
              {
                  //error
                  $(".login-poster h2").html("Error during signup");
              }
          }
      })
    });
});