const resize = document.getElementById('resize');
var handle = document.getElementById('handle');
alert(handle);
let xStart;
let width;

handle.addEventListener('mousedown', function($event) {
    xStart = $event.pageX;
    width = resize.offsetWidth;
    handle.addEventListener('mousemove', mousemove);
});

handle.addEventListener('mouseup', function() {
    handle.removeEventListener('mousemove', mousemove);
});

function mousemove($event) {
    resize.style.width = width + ($event.pageX - xStart) + 'px';
}