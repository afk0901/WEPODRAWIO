/**
    Structure for assignment 2 project
 */

// 1. Define a function namespace drawio

// 2. Create an array to hold on to the shapes currently drawn
window.drawio = {

    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),//This is a canvas object, tell it that we are going to draw in 2d.

    shapes: [],
    selectedShape: 'square',
    selectedElement: null,
    selectedElementText: null,

    //All available shapes goes here
    availableShapes: {
        RECTANGLE: 'square',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text'
    },

    colorSettings: {
        color: 'black'
    },

    fontSettings: {
        fontSize: 10, //Default font size
        maxFontSize: 490,
        fontSizeRange: 10,
        fontSizeSelectionInput: '#select-font-size',
        font: 'Arial',
        fontFamilyArray: ['Arial', 'Times', 'bla'],
        fontSelectioninput: '#select-font'
    },

    lineSettings: {
        lineWidthSelectionInput: '#select-line-width',
        lineWidth: 10,
        maxlineWidth: 490,
        lineWidhtRange: 10
    },
    event: null,  //To transfer event between functions
};

$(function () {
    //Document is loaded and parsed
    try {
        //Implemented in loadselect.js
        loadNumbersSelect(drawio.fontSettings.maxFontSize, drawio.fontSettings.fontSizeRange, drawio.fontSettings.fontSizeSelectionInput);
        loadNumbersSelect(drawio.lineSettings.maxlineWidth, drawio.lineSettings.lineWidhtRange, drawio.lineSettings.lineWidthSelectionInput);
        loadStringsSelect(drawio.fontSettings.fontSelectioninput, drawio.fontSettings.fontFamilyArray);
    }
    catch (error) {
        //Do nothing, if those is not defined, because they are maybe not always needed.
    }
    //Renders the objects from the array
    function drawCanvas() {

        if (drawio.selectedElement) {
            drawio.selectedElement.render();

        }

        for (var i = 0; i < drawio.shapes.length; i++) {
            if (drawio.shapes[i] != null) {
                drawio.shapes[i].render();
            }
        }
    }
    $('.change-color').on('change', function () {
        var color = $(this).val();
        drawio.colorSettings.color = color;
    });
    //Changes settings like fonts, linewidth and so on some event
    function changeSettingsOptionOnEvent(elementToSelect) {
        $(document).on('change', elementToSelect, function () {
            drawio.fontSettings.fontSize = $(this).val();//How to change this?
            console.log(settingsOption);
        });
    }

    //Clears the canvas and drawsthe elements and performs other functionality such resize and such a stuff.
    function clearAndDraw(element, mouseEvent) {
        if (element) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            element.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();//Draws everything as the shapes were pushed into the shape array.
        }
    }
    //Helper to make a text input.
    function makeTextInput(mouseEvent) {
        drawio.oldTextInInput = $('.text').val();
        $("input").remove('.text');
        var elementString = "<input class='text' type='text' >";
        $(".container").append(elementString);
        $('.text').css('position', 'absolute').css('top', mouseEvent.clientY).css('left', mouseEvent.clientX)
            .css('background-color', 'transparent').css('border', '1px dashed black')
            .css('border-radius', '5px');
    }

    $('.icon').on('click', function () {
        $("input").remove('.text'); //If there is a input field for text, remove it as we are switching.
        drawio.selectedElementText = null; //so the textbox stops diplaying when another shape is selected
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    //mousedown
    $('#my-canvas').on('mousedown', function (mouseEvent) {
        console.log(drawio.selectedShape);
        switch (drawio.selectedShape) {

            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color);
                break;
            case drawio.availableShapes.CIRCLE:
                drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color);
                break;
            case drawio.availableShapes.LINE:
                drawio.selectedElement = new Line({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.colorSettings.color, drawio.lineSettings.lineWidth);
                break;
            case drawio.availableShapes.TEXT:
                drawio.selectedElementText = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0,
                    drawio.fontSettings.font, drawio.fontSettings.fontSize, drawio.colorSettings.color);
                break;
        }
    });
    //If the user presses on enter when text input is displayed to type in some text then draw the text.
    $(document).on('keypress', '.text', function (e) {
        var text = $(this).val();
        if (e.which == 13) {
            if (text != null) {
                drawio.selectedElementText.text = text;
                drawio.selectedElementText.color = drawio.color;
                clearAndDraw(drawio.selectedElementText, drawio.event); //drawio.event should be the mouseEvent right now
                drawio.event = null; //As clearAndDraw got the event, so there will be no confusion, like the wrong event or something.
                $("input").remove('.text');//no need for input now
            }
        }
    });

    //Click - canvas that happens on click
    $('#my-canvas').on('click', function (mouseEvent) {
        if (drawio.selectedElementText) {
            makeTextInput(mouseEvent);
            drawio.event = mouseEvent; //As keypress needs this event, it's needed to be accessable elsewhere.
        }
    });
    //mousemove
    $('#my-canvas').on('mousemove', function (mouseEvent) {
        clearAndDraw(drawio.selectedElement, mouseEvent);
    });

    //mouseup
    $('#my-canvas').on('mouseup', function () {
        drawio.shapes.push(drawio.selectedElement);//mousemove clears everything
        if (drawio.selectedElementText) {
            drawio.shapes.push(drawio.selectedElementText);
        }
        console.log(drawio.shapes);
        drawio.selectedElement = null;
    });
    changeSettingsOptionOnEvent(drawio.fontSettings.fontSizeSelectionInput);
});