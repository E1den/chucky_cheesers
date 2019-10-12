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
        //TODO
    });
});