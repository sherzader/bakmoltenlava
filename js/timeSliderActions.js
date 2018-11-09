const list = dataArray.map((data, i) => {
    return $("<li />")
        .data("i", i)
        .text(data.month);
});
$("ul.slider-options").append(list);
handleTimeSlider(0); // initialize map pins for January

$(".slider").slider({
    orientation: "horizontal",
    range: "min",
    min: 0,
    max: 11,
    step: 1,
    slide: function(event, ui) {
        handleTimeSlider(ui.value);
    },
});

function handleTimeSlider(monthIdx) {
    $("img.pin").remove();
    const cities = dataArray[monthIdx].cityMarkers;
    const mapPins = cities.map(({ coords, city, price }) => {
        const [left, top] = coords;
        const title = `${city} $${price}`;
        const mapPin = $(`<img src='./pin.svg' class='pin' title='${title}'>`);
        return mapPin.attr(
            "style",
            `position:absolute;top:${top - 22}px;left:${left - 13}px`
        );
    });
    $(".map").append(mapPins);
    mousemove(monthIdx);
}
// map pins on click
function getPosition(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    console.log(x, y);
    return {
        x,
        y,
    };
}
$("img").on("click", e => {
    const { x, y } = getPosition(e);
    const circle = $(
        `<svg width=20 height=20 style='position:absolute;top:${y};left:${x};'><circle cx=${10} cy=${10} r=${10} fill='purple'/></svg>`
    );
    $(".map").append(circle);
});
