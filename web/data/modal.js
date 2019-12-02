$(document).ready(function () {
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    $("#Imgoutput").onclick = function () {
        $("#myModal").css("display", "block");
        $("#img01").prop("src", this.src);
        $("#caption").html(this.alt);
    }

    // When the user clicks on <span> (x), close the modal
    $(".close").click(function () {
        $("#myModal").css("display", "none");
    });
});
