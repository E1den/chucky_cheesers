$.ajax({
    type: "GET",
    url: "/srv/acct/getSess.js",
    success: function(n) {  $("#acctSess").html(n)  }
}).fail(function() {    $("#acctSess").html("<a href='/login' class='nav-link'>Login/Signup</a>")   })
function signOut() {
    $.ajax({
        type: "POST",
        url: "/srv/acct/logout.js",
        success: function(n) { $(location).attr("href","/"); }
    })
}