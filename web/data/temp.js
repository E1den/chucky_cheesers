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

function ForgotPass() {
  var x = document.querySelector(".login-poster");
  var y = document.querySelector(".forgotpass-poster");
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

function openPage(pageName, elmnt, btnName) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  btnOpen = document.getElementsByClassName("AcPageBtn");
  for (i = 0; i < btnOpen.length; i++) {
    btnOpen[i].style.background = "inherit";
    btnOpen[i].style.color = "white";

  }


  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";
  document.getElementById(btnName).style.background = "white";
  document.getElementById(btnName).style.color = "black";

  var x = document.querySelector(".accsidebar");
  var y = document.querySelector(".acc-content-pane");
  x.style.height = y.style.height

}

// Get the element with id="defaultOpen" and click on it
window.onload = function() {
  document.getElementById("defaultOpen").click();

};

function AccMenuFunction(x) {
  document.getElementById("accsidebar").style.width = "100%";
  document.getElementById("accsidebar").style.position = "fixed";
}

function acccloseNav() {
  document.getElementById("accsidebar").style.width = "0";
  var y = document.querySelector(".acc-content-pane");
  y.style.width("auto")
}
