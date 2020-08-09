var block = '<div class="plume-selectable"><div contenteditable="true" spellcheck="true" class="plume-input" placeholder="Type / for commands"></div></div>';
var currentFocus;
var slashMenuIsOpen = false;

var debug = $('#debug');

$(function () {
    /* PLUME bindings */
    $('#right').on('focusin', '.plume-input', function () {
        if ($(this).hasClass('plume-title')) return;
        $(this).attr('placeholder', 'Type / for commands');
        if (currentFocus != $(this)) currentFocus = $(this);
    });
    $('#right').on('focusout', '.plume-input', function () {
        $(this).attr('placeholder', ' ');
    });

    var prevKey = 0;

    $('#right').on('keydown', '.plume-input', function (e) {
        if (e.which === 191 && !$(this).hasClass('plume-title')) { // slash
            $('#slashMenu').iziModal('open');
        }  
        if (e.which === 13) { // enter
            if ($(this).hasClass('plume-title')) { // title is single line 
                e.preventDefault();
                $('.plume-input').not('.plume-title').first().focus();
                return;
            }
            if (slashMenuIsOpen) {
                e.preventDefault();
                return;
            }
        }
        if (e.which === 32) { // space
            if (slashMenuIsOpen) {
                $('#slashMenu').iziModal('close');
            }
        }
        if (e.which === 8) { // del/backspace
            debug.text(getCharBeforeCaret());
            if (slashMenuIsOpen && getCharBeforeCaret() === "/") {
                $('#slashMenu').iziModal('close');
            }
        }

        if (e.which === 38 || e.which === 40) { // arrows U D
            if (slashMenuIsOpen) e.preventDefault();
        }
        prevKey = e.which;
    });
});

$(document).ready(function() {
    const fs = require('fs');
    fs.readFile('test.md', 'utf8', (err, data) => {
        if (err) throw err;
        mdToPlume(data);
    });
});

function mdToPlume(md) {
    var converter = new showdown.Converter();
    var html = converter.makeHtml(md);
    //debugger;
    html = html.split('<p>').join('<div>'); // global replace 
    html = html.split('</p>').join('</div>');

    html = html.split('<h1 ').join('<div class="plume-h1" ');
    html = html.split('</h1>').join('</div>');

    html = html.split('<h2 ').join('<div class="plume-h2" ');
    html = html.split('</h2>').join('</div>');
   //html = z.replaceAll('<p>', '<div>').replaceAll('</p>', '</div>');
    $('#plume-first-input').append(html);
/*     var lines = md.split("\n");
    
    $.each(lines, function(index, val) {
        if (val == "\r") $('#plume-first-input').append('<div><br></div>');
        else $('#plume-first-input').append('<div>' + val + '</div>');
    });   */
}
        /*                     if (e.which === 13) { // ENTER
                                if ($(this).hasClass('plume-title')) { // focus first line !
                                    e.preventDefault();
                                    $('.plume-input').not('.plume-title').first().focus();
                                }
                                if (prevKeyWasEnter) {
                                    e.preventDefault();
                                    var b = newBlockBelow($(this));
                                } else prevKeyWasEnter = true;  
                            } else prevKeyWasEnter = false;
        
                            if (e.which === 8 && currentFocus.innerHtml.length === 0) { // backspace
                                var del = currentFocus;
                                if (!currentFocus.hasClass('plume-title')) {
                                    $(currentFocus).parent().prev().children('.plume-input').focus();
                                    var cnt = $('.plume-input').length; // always keep title + 
                                    if (cnt > 2) $(del).remove();
                                }
                            } */
    
    /*                 $(document).keydown(function(e) {
                        prevKeyWasCtrlZ = (e.which === 90 && e.ctrlKey);
                        console.log(prevKeyWasCtrlZ);
                    }); */


function newBlockBelow(el) { // el == .plume-input
    var parent = $(el).parent();
    $(parent).after(block);
    var newblock = $(parent).next();
    newblock.attr('id', uuidv4());
    newblock.children('.plume-input').focus();
}

// custom tools
function uuidv4() { // https://stackoverflow.com/a/2117523/109538
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

function getCharBeforeCaret() {
    var sel = window.getSelection();
    var c = sel.baseNode.data.charAt(sel.baseOffset - 1);
    return c;
}

function getCaretCoords() { // simplified from https://stackoverflow.com/a/26495188
    var sel = document.selection, range, rect;
    var x = 0, y = 0;
    sel = window.getSelection();
    if (sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange();
        //debugger;
        range.collapse(true);
        var span = document.createElement("span");
        if (span.getClientRects) {
            // Ensure span has dimensions and position by
            // adding a zero-width space character
            span.appendChild( document.createTextNode("\u200b") );
            range.insertNode(span);
            rect = span.getClientRects()[0];
            x = rect.left;
            y = rect.top;
            var spanParent = span.parentNode;
            spanParent.removeChild(span);

            // Glue any broken text nodes back together
            spanParent.normalize();
        }
    }
    return { x: x, y: y };
}