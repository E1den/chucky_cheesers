$.ajax({
    type: "GET",
    url: "/srv/acct/getSess",
    success: function (n) { $("#acctSess").html(n) }
}).fail(function () { $("#acctSess").html("<a href='/login' class='nav-link'>Login/Signup</a>") })

$(document).ready(function () {
    $("#defaultOpen").click();
});

function signOut() {
    $.ajax({
        type: "POST",
        url: "/srv/acct/logout",
        success: function (n) { $(location).attr("href", "/"); }
    })
}

function openPage(pageName, elmnt, btnName) {
    // Hide all elements with class="tabcontent" by default */

    $(".tabcontent").hide();
    $(".AcPageBtn").css("background", "inherit").css("color", "white");

    // Show the specific tab content
    $(pageName).css("display", "block");
    $(btnName).css("background", "white").css("color", "black");

    $(".accsidebar").height($(".acc-content-pane").height());
}

function accMenuFunction(x) {
    $(".accsidebar").addClass("accsidebar-on")
    $(".accsidebar").css("position","fixed");
}

function acccloseNav() {
    $(".accsidebar").removeClass("accsidebar-on");
    $(".acc-content-pane").width("100%");
}

function filter(filterType){
  if(filterType == "filter")
  {
    if(window.screen.availWidth > 768)
    {
      if($("#filter-accounts").hasClass("filter-type"))
      {
        $("#filter-relevant").removeClass("filter-type")
        $("#filter-recent").removeClass("filter-type")
        $("#filter-accounts").removeClass("filter-type")
      }
      else {
        $("#filter-relevant").addClass("filter-type")
        $("#filter-recent").addClass("filter-type")
        $("#filter-accounts").addClass("filter-type")
      }
    }
    else
    {
      $("#filter-dropdown").addClass("show-dropdown");
      $("#filter-dropdown-btn").addClass("filter-type")
    }
  }
  else if(filterType == "relevant" || filterType == "recent" || filterType ==  "accounts")
  {
    if(window.screen.availWidth > 768)
    {
      $("#filter-relevant").removeClass("filter-type")
      $("#filter-recent").removeClass("filter-type")
      $("#filter-accounts").removeClass("filter-type")
    }
    else
    {
      $("#filter-dropdown").removeClass("show-dropdown");
      $("#filter-dropdown-btn").removeClass("filter-type")
    }
  }

};

function createComic()
{
  if($("#acctSess").html().includes("Login/Signup"))
    window.location.replace("/login");
  if($(".createComic").hasClass("createComic-on"))
  {
    $(".createComic").removeClass("createComic-on")
  }
  else{
    $(".createComic").addClass("createComic-on")
  }
}
