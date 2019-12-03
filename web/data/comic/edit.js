var leftPageExists = true;
var rightPageExists = true;
var currentPageNumber = 0;

//1=left,2=right
var currentLayoutFor = 0;
var currentlyEditingFrame = 0;

window.dataLoaded = function () {
    try {
        window.leftPageNum = Math.floor(window.comicData.page.length / 2) * 2;
    }
    catch (e) { window.leftPageNum = 0; }
    window.handleLayout();
    leftPageExists = true;
    rightPageExists = true;
};

window.pageError = function (offset) {
    const width = 2560;
    const height = 1440;
    const size = 60;
    var offsetx = offset + (width / 4) - (size / 2);
    var offsety = height / 2 - (size / 2);

    ctx.beginPath();
    ctx.lineWidth = (size / 2);
    ctx.strokeStyle = "black";
    ctx.moveTo(offsetx - size, offsety);
    ctx.lineTo(offsetx + size, offsety);
    ctx.moveTo(offsetx, offsety - size);
    ctx.lineTo(offsetx, offsety + size);
    ctx.stroke();
    ctx.closePath();

    if (offset != 0) {
        rightPageExists = false;
        currentPageNumber = leftPageNum;
    }
    else {
        leftPageExists = false;
        rightPageExists = false;
        currentPageNumber = leftPageNum;
    }
}

window.frameError = function (offsetx, offsety) {
    const size = 35;
    ctx.beginPath();
    ctx.lineWidth = (size / 2);
    ctx.strokeStyle = "black";
    ctx.moveTo(offsetx - size, offsety);
    ctx.lineTo(offsetx + size, offsety);
    ctx.moveTo(offsetx, offsety - size);
    ctx.lineTo(offsetx, offsety + size);
    ctx.stroke();
    ctx.closePath();
}

function saveFrame() {

}


function saveComic() {

    tempData = window.comicData;
    tempData.page.forEach(function (page, index) {
        page.frames.forEach(function (frame, frame_index) {
            delete tempData.page[frame].x;
            delete tempData.page[frame].y;
            delete tempData.page[frame].width;
            delete tempData.page[frame].height;
        });
    });

    $.ajax({
        type: "POST",
        datatype: 'json',
        url: "/srv/comic/update",
        contentType: 'application/json',
        data: JSON.stringify(tempData)
    });

    window.location.replace(`/comic/view/?id=${window.COMIC_ID}`);
}

function cancelTemplate() {
    $(".choose-template").removeClass("popup-on");
    currentLayoutFor = 0;
}

function chooseTemplate() {
    $(".choose-template").removeClass("popup-on");
    var layout = Number($(".current-slide").attr("id"));
    pos = window.getLayoutPos(layout);
    window.comicData.page.push({ 'layout': layout, frames: pos });
    window.redrawPages();
    if (currentLayoutFor == 1)
        leftPageExists = true;
    else if (currentLayoutFor == 2)
        rightPageExists = true;
    currentLayoutFor = 0;

    var dat = {
        'comic': window.COMIC_ID, 'page': currentPageNumber, 'layout': {
            'layout': layout
        }
    };
    dat.layout.frames = pos;

    $.ajax({
        type: "POST",
        url: "/srv/comic/pushpage",
        datatype: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dat)
    });

    return;
}



$(document).ready(function () {

    currentPageNumber = leftPageNum;

    const width = 2560;
    const height = 1440;

    //  window.comicData => comic data
    //  window.ctx => canvas contex
    //  window.COMIC_ID => comic id
    //  window.leftPageNum => page num of the left page

    var current_index = 0;

    window.commitFrame = function () {
        currentlyEditingFrame = false;
        var frameData = $(".konvajs-content canvas")[0].toDataURL("img/jpeg");
        var frameIMG = $(".konvajs-content canvas")[0].getContext('2d').getImageData(0, 0, $(".konvajs-content canvas").width(), $(".konvajs-content canvas").height());

        // var currentPage = window.comicData.page[window.leftPageNum]; // left page
        var pageXOffset = 0;
        if (currentPageNumber%2!=0) {
            //     currentPage = window.comicData.page[window.leftPageNum + 1]; // right page
            pageXOffset = (width / 2);
        }


        //draw on comic
        var curFrame = window.comicData.page[currentPageNumber].frames[current_index];
        window.ctx.putImageData(frameIMG, curFrame.x + pageXOffset, curFrame.y, 0, 0, curFrame.width, curFrame.height);

        $(".edit-frame").removeClass("popup-on");

        current_index++;

        //save on server
        $.ajax({
            type: "POST",
            url: "/srv/comic/pushimg",
            datatype: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ 'img': frameData, 'comic': window.COMIC_ID, 'frame': current_index, 'page': currentPageNumber })
        });


    }

    function showFrameEditor() {
        $(".edit-frame").addClass("popup-on");
        window.fitStageIntoParentContainer();
        currentlyEditingFrame = true;
        return;
    }

    function showSelectLayout() {
        $(".choose-template").addClass("popup-on");
        return;
    }

    $("#comic-viewer").click(function (e) {
        //grab the screen based cordinates in the canvas
        var x = e.pageX - $("#comic-viewer").offset().left;
        var y = e.pageY - $("#comic-viewer").offset().top;
        //scale to the canvas coordinates
        x = (x / $("#comic-viewer").width()) * width;
        y = (y / $("#comic-viewer").height()) * height;

        if (currentLayoutFor != 0)
            return; //currently Selecting Layout
        if (currentlyEditingFrame)
            return;//currently editing frame


        if (window.comicData == undefined) {
            currentLayoutFor = 1;
            currentPageNumber = 0;
            window.comicData = { page: [] };
            showSelectLayout();
            return;
        }


        var lleft = width * 0.02;
        var rleft = width * 0.95;
        var bheight = height * 0.92;

        //handle page turns
        if ((window.leftPageNum - 2 >= 0) && (x >= lleft) && (x <= lleft + 90) && (y >= bheight) && (y <= bheight + 90)) {
            //selected this box at index
            window.leftPageNum -= 2;


            window.redrawPages();

            if (window.leftPageNum >= 0 && window.leftPageNum < window.comicData.page.length)
                leftPageExists = true;
            else
                leftPageExists = false;

            if (window.leftPageNum + 1 > 0 && window.leftPageNum + 1 < window.comicData.page.length)
                rightPageExists = true;
            else
                rightPageExists = false;

            return;
        }

        try {//right
            if ((window.leftPageNum + 2 <= window.comicData.page.length) && (x >= rleft) && (x <= rleft + 90) && (y >= bheight) && (y <= bheight + 90)) {
                //selected this box at index
                window.leftPageNum += 2;
                currentPageNumber = leftPageNum;

                if (window.leftPageNum >= 0 && window.leftPageNum < window.comicData.page.length)
                    leftPageExists = true;
                else
                    leftPageExists = false;

                if (window.leftPageNum + 1 > 0 && window.leftPageNum + 1 < window.comicData.page.length)
                    rightPageExists = true;
                else
                    rightPageExists = false;

                window.redrawPages();
                return;
            }
        } catch (e) { }


        if (x < (width / 2) && leftPageExists == false) {
            currentLayoutFor = 1;
            showSelectLayout();
            return;
        }
        if (x > (width / 2) && rightPageExists == false) {
            currentLayoutFor = 2;
            showSelectLayout();
            return;
        }

        var currentPage = window.comicData.page[window.leftPageNum]; // left page
        var pageXOffset = 0;
        if (x > (width / 2)) {
            currentPage = window.comicData.page[window.leftPageNum + 1]; // right page
            pageXOffset = (width / 2);
        }

        //each should be a plus sign until an image is added
        currentPage.frames.forEach(function (frame, index) {
            if ((x >= frame.x + pageXOffset) && (x <= frame.x + frame.width + pageXOffset) && (y >= frame.y) && (y <= frame.y + frame.height)) {
                //selected this box at index
                if (index == current_index) {
                    showFrameEditor();

                    if (window.comicData.page[currentPageNumber].length <= current_index) {
                        currentPageNumber++;
                        current_index = 0;
                        window.redrawPages();
                    }
                }
            }
        });


    });
});