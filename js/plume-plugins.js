$(document).ready(function () {
    $('#tree').jstree({
        "core": {
            "check_callback": true, // so that operations work
            "multiple": false, // single select
            "themes": { "dots": false }
        },
        "plugins": ["dnd", "wholerow"]
    });

    Split(['#sidebar', '#right'], { // vertical split
        sizes: [20, 80],
        minSize: [200, 300],
        expandToMin: true,
        gutterSize: 15,
        elementStyle: function (dimension, size, gutterSize) {
            return {
                'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
            }
        },
        gutterStyle: function (dimension, gutterSize) {
            return {
                'flex-basis': gutterSize + 'px',
            }
        }
    });


    $('#slashMenu').iziModal({
        background: 'rgb(55, 60, 63)',
        overlayColor: 'rgba(0, 0, 0, 0)',
        onOpening: function() {
            $('.iziModal').css({
                "top" : getCaretCoords().y + 30,
                "left" : getCaretCoords().x + 10
            });
            slashMenuIsOpen = true;
        },
        onClosing: function() {
            slashMenuIsOpen = false;
        }
    });

})