function addGoal(id, goals) {
    $.ajax({
        url: "/api/player/" + id,
        type: "PUT",
        data: JSON.stringify({"goals": goals + 1}),
        contentType: "application/json",
        'success': updateStats
    });
}

function resetGoals() {
    $.getJSON("/api/player", function(data){
        var items = [];
        $.each(data.objects, function(i, v) {
            $.ajax({
                url: "/api/player/" + v["id"],
                type: "PUT",
                data: JSON.stringify({"goals": 0}),
                contentType: "application/json",
                'success': updateStats
            });
        });
    });
}

function updateStats() {
    order_by = [{"field":"name", "direction":"asc"}];
    $.getJSON("/api/player", {"q":JSON.stringify({"order_by":order_by})}, function(data){
        $("#stats").empty();
        $.each(data.objects, function(i, v) {
            console.log(v);
            $("#stats").append(
                "<div class=\"row text-center\">" +
                    "<div class=\"pic small-3 columns\">" +
                        "<img height=50 width=50 src=\"" + v["picture"] + "\"</img>" +
                    "</div>" +
                    '<div class="goals small-9 columns">' +
                        '<ul class="button-group round">' +
                          '<li><a href="#" class="button"><i class="foundicon-minus"></i></a></li>' +
                          '<li>' + v["name"] + " - " + v["goals"] + '</li>' +
                          '<li><a href="#" onclick="addGoal(' + v["id"] + "," + v["goals"] + ')" class="button"><i class="foundicon-plus"></i></a></li>' +
                        '</ul>' +
                    '</div>' +
                "</div>");
        });
    });
}

$(document).ready(updateStats);