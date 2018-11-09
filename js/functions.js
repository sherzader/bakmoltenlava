(function($, window, document, undefined) {
    var $win = $(window);
    var $doc = $(document);
    var winO = $win.scrollTop();

    $doc.ready(function() {
        //Expand Spots
        $(".spot-details-head").on("click", function() {
            var $this = $(this);
            var $spot = $this.closest(".spot");

            $spot
                .toggleClass("expanded")
                .siblings()
                .removeClass("expanded");
        });

        //Fixed Intro Logo
        var $logo = $(".intro-logo");
        var logoOffset = $logo.offset().top;
        var startingTop = parseInt($logo.css("top"));

        var tabletOffset = $(".tablet-image").offset().top;

        var $leftPalm = $(".palm-left");
        var $rightPalm = $(".palm-right");

        $win.on("scroll", function() {
            var leftPalmWidth = $leftPalm.width();
            var rightPalmWidth = $rightPalm.width();

            winO = $win.scrollTop();

            $logo.css("top", startingTop + winO);

            //Move Palms
            var winHeight = $(this).height();
            var winWidth = $(this).width();
            var step;

            if (winO > tabletOffset - winHeight) {
                step = parseInt(
                    (((tabletOffset - winO) / winHeight) * winWidth) / 3,
                    10
                );

                if (step - leftPalmWidth > 0) {
                    $rightPalm.css(
                        "transform",
                        "translateX(" + (-1 * step + rightPalmWidth) + "px)"
                    );
                    $leftPalm.css(
                        "transform",
                        "translateX(" + (step - leftPalmWidth) + "px)"
                    );
                }
            }
        });

        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            $(".intro").css("background-attachment", "scroll");
        }

        //Event Scroll to Section
        var waypoint;
        var $links = $(".intro-nav a");
        var headerHeight = $(".header").innerHeight();

        $links.on("click", function(e) {
            e.preventDefault();
            waypoint = $(this).attr("href");

            $("html, body").animate(
                {
                    scrollTop: $(waypoint).offset().top - headerHeight,
                },
                1000
            );
        });

        //Scroll Bar Slider
        var months = [];

        $(".slider-options li").each(function() {
            var left = $(this).position().left;

            months.push({
                start: left,
                end: left + $(this).width(),
                $element: $(this),
            });
        });

        var $cities = $(".map-links a");

        refreshSwatch();
        function refreshSwatch() {
            var sliderRange = $(this)
                .find(".ui-slider-range")
                .width();

            for (var i = 0; i < months.length; i++) {
                if (
                    months[i].start <= sliderRange &&
                    months[i].end >= sliderRange
                ) {
                    $(".slider-options li").each(function() {
                        var $currentMonth = $(this);
                        var currentMonthLeft = $currentMonth.position().left;
                        var currentTime = $currentMonth.data("time");

                        if (
                            months[i].start > currentMonthLeft - 5 &&
                            months[i].start < currentMonthLeft + 5
                        ) {
                            $cities.each(function() {
                                $(this).removeClass("active");
                                if ($(this).hasClass(currentTime)) {
                                    $(this).addClass("active");
                                }
                            });
                        }
                    });
                }
            }
        }

        // $(".slider").slider({
        //     orientation: "horizontal",
        //     range: "min",
        //     slide: refreshSwatch,
        //     change: refreshSwatch,
        // });
    });
})(jQuery, window, document);
