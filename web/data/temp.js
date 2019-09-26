function myFunction() {
  var x = document.querySelector(".login-poster");
  var y = document.querySelector(".signup-poster");
  if (x.style.display == "none") {
    x.classList.remove("swing-out-top-bck");
    y.className += " swing-out-top-bck";
    setTimeout(function() {
  y.style.display = "none";
  x.style.display = "flex";
}, 451);
  } else {
    y.classList.remove("swing-out-top-bck");
    x.className += " swing-out-top-bck";
    //x.style.display = "none"
    setTimeout(function() {
  x.style.display = "none";
  y.style.display = "flex";
}, 451);
  }
}

function MenuFunction(x) {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
