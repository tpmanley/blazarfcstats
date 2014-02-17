$(document).ready(function() {
    $.getJSON("/api/player", function(data){
        var items = [];
        $.each(data.objects, function(i, v) {
            console.log(v);
            items.push("<div class=\"row\"> <div class=\"small-12 columns\">" +
                "<div class=\"pname\">" + v["name"] + "</div>" +
                "<div class=\"goals\">" + v["goals"] + "</div>" +
                "</div></div>");
        })
        $("#stats").html(items.join(""));
    })
})