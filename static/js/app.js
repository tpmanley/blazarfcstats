function addGoal(id, goals) {
    $.ajax({
        url: "/api/player/" + id,
        type: "PUT",
        data: JSON.stringify({"goals": goals + 1}),
        contentType: "application/json",
        'success': updateStats
    });
}

function removeGoal(id, goals) {
    var new_total = goals - 1;
    if(new_total < 0) {
        new_total = 0;
    }
    $.ajax({
        url: "/api/player/" + id,
        type: "PUT",
        data: JSON.stringify({"goals": new_total}),
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
    var order_by = [{"field":"name", "direction":"asc"}];
    $.getJSON("/api/player", {"q":JSON.stringify({"order_by":order_by})}, function(data){
        $("#players-content").empty();
        $.each(data.objects, function(i, v) {
            console.log(v);
            $("#players-content").append(
            sprintf('<li><div class="player"><img class="pic" src="%s"</img><p>%s', v["picture"], v["name"]) +
            sprintf('<br/><span class="meta">%s Goals</span>', v["goals"]) +
            sprintf('<i class="foundicon-minus" onclick="removeGoal(%s, %s)"></i>', v["id"], v["goals"]) +
            sprintf('<i class="foundicon-plus" onclick="addGoal(%s, %s)"></i>', v["id"], v["goals"]) +
            '</div></li>');
        });
    });
}

$(document).ready(updateStats);