var stylishHTML = function (conf) {

    $("*").css("background", conf.background);
    $("*").css("color", conf.foreground);
    $("#logo").html(conf.greeting_text);

    $("#cheat li span:first-child").css("color", conf.foreground);

    if (tinycolor(conf.foreground).isLight()) {
        $("#cheat li span:first-child").css("background", "rgba(200,200,200, 0.8)");
        $("#cheat li span:last-child").css("background", "rgba(0,0,0, 0.4)");
    } else {
        $("#cheat li span:first-child").css("background", "rgba(0,0,0, 0.4)");
        $("#cheat li span:last-child").css("background", "rgba(200,200,200, 0.8)");
    }

    $("#cheat li a").each(function() {
        var key = $(this).find("span:first-child").text();
        var fav = conf.favourites.find(f => f.key === key);
        if (fav) {
            $(this).find("span:first-child").css("background-color", `rgb(${fav.color})`);
        }
    });
};

$(function () {
    var conf = {};
    var input = $("#box").val();

    $.getJSON("web.json", function (object) {
        $.each(object.favourites, function (key, val,) {
            $("#cheat ul").append("<li><a href='" + val.url + "' target='_blank'><span class='key'>" + val.key + "</span><span>" + val.title + "</span></a></li>");
            stylishHTML(object);
        });

        $("ul li").sort(function (a, b) {
            return ($(a).width() < $(b).width()) ? -1 : ($(a).width() > $(b).width()) ? 1 : 0;
        }).appendTo("ul");

        conf = object;
    });

    $(document).keydown(function (e) {
        if (e.shiftKey && e.keyCode === 59) {
            $("#box").focus();
        }

        if (e.keyCode === 27) {
            $("#box").blur();
            $("#box").val("");
            $("#cheatp").slideUp();
            $("#holder").html("type  :&lt;key&gt;  and  hit enter");
            $("#cheat ul li").each(function () {
                $(this).removeClass("dis");
            });
        }
    });

    $("#box").keyup(function (event) {
        input = $(this).val();

        if (input.length == 0) {
            $("#cheatp").slideUp();
        } else {
            $("#cheatp").slideDown();
        }

        $("#cheat ul li").each(function () {
            $(this).addClass("dis");
            if ($(this).html().indexOf(input) > 0) {
                $(this).removeClass("dis");
            }

        });
    });
    $("form").on("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (conf.favourites.find(f => f.key === input)) {
            link = conf.favourites.find(f => f.key === input).url;
        } else if (input.startsWith("http")) {
            link = input;
        } else {
            link = conf.search_engine + encodeURIComponent(input);
        }

        window.open(link, "_blank");
        $("#box").blur();
        $("#box").val("");
        $("#cheatp").slideUp();
    });
});