function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) return day + 'th';
    switch (day % 10) {
        case 1: return day + 'st';
        case 2: return day + 'nd';
        case 3: return day + 'rd';
        default: return day + 'th';
    }
}

function updateDateTime() {
    const now = new Date();

    const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    const optionsDay = { weekday: "long" };
    const optionsMonth = { month: "short" };
    const optionsDate = { day: "numeric" };

    const time = now.toLocaleTimeString("en-US", optionsTime);
    const day = now.toLocaleDateString("en-US", optionsDay);
    const month = now.toLocaleDateString("en-US", optionsMonth);
    const date = getOrdinalSuffix(now.getDate());

    document.getElementById("clock").innerHTML = `
        <span class="time">${time}</span> / 
        <span class="day">${day}</span> / 
        <span class="month">${month}</span> / 
        <span class="date">${date}</span>
    `;
}

updateDateTime();
setInterval(updateDateTime, 60000); 

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

    $("#search-engine").text(conf.search_engines[0].name).css("color", conf.search_engines[0].color);
};

$(function () {
    var conf = {};
    var input = $("#box").val();
    var currentSearchEngine = "Google"; 
    var currentSearchEngineUrl = "https://www.google.com/search?q="; 
    var currentSearchEngineColor = "#4285F4"; 

    $.getJSON("web.json", function (object) {

        conf = object;

        currentSearchEngine = object.search_engines[0].name;
        currentSearchEngineUrl = object.search_engines[0].url;
        currentSearchEngineColor = object.search_engines[0].color;

        $.each(object.favourites, function (key, val) {
            $("#cheat ul").append("<li><a href='" + val.url + "' target='_blank'><span class='key'>" + val.key + "</span><span>" + val.title + "</span></a></li>");
        });

        stylishHTML(object);

        $("ul li").sort(function (a, b) {
            return ($(a).width() < $(b).width()) ? -1 : ($(a).width() > $(b).width()) ? 1 : 0;
        }).appendTo("ul");

        var dropdownHtml = object.search_engines.map(function(engine) {
            return `<a href="#" data-url="${engine.url}" data-color="${engine.color}" style="color: ${engine.color}">${engine.name}</a>`;
        }).join('');
        $("#search-engine-dropdown").html(dropdownHtml);

        $("#search-engine").text(currentSearchEngine).css("color", currentSearchEngineColor);

        $("#search-engine-dropdown a").click(function(e) {
            e.preventDefault();
            currentSearchEngine = $(this).text();
            currentSearchEngineUrl = $(this).data("url");
            currentSearchEngineColor = $(this).data("color");

            $("#search-engine").text(currentSearchEngine).css("color", currentSearchEngineColor);
            $("#search-engine-dropdown").hide(); 
        });
    });

    $(".terminal").hover(
        function() { $("#search-engine-dropdown").show(); },
        function() { $("#search-engine-dropdown").hide(); }
    );

    $(document).keydown(function (e) {
        if (e.shiftKey && e.keyCode === 59) {
            $("#box").focus();
        }

        if (e.keyCode === 27) {
            $("#box").blur();
            $("#box").val("");
            $("#cheatp").slideUp();
            $("#holder").html(":&lt;key&gt; , s-query, or url");
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

        var link;
        if (conf.favourites.find(f => f.key === input)) {
            link = conf.favourites.find(f => f.key === input).url;
        } else if (input.startsWith("http")) {
            link = input;
        } else {
            link = currentSearchEngineUrl + encodeURIComponent(input);
        }

        window.open(link, "_blank");
        $("#box").blur();
        $("#box").val("");
        $("#cheatp").slideUp();
    });
});