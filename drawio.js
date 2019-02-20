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
        fontSize: 40, //Default font size
        maxFontSize: 490,
        minFontSize: 10,
        fontSizeRange: 10,
        fontSizeSelectionInput: '#select-font-size',
        font: 'cursive',
        fontFamilyArray: ['Arial', 'Helvetica', 'cursive'],//List of available fonts
        fontSelectioninput: '#select-font'
    },

    lineSettings: {
        lineWidthSelectionInput: '#select-line-width',
        minLineWidht: 1,
        lineWidth: 5, //Default line width
        maxlineWidth: 50,
        lineWidhtRange: 1
    },
    event: null,  //To transfer event between functions
    undoStorage: [] //Keeps undoed shapes
};

$(function () {
    //Document is loaded and parsed
   
    try {
        //Implemented in loadselect.js
        loadNumbersSelect(drawio.fontSettings.maxFontSize, drawio.fontSettings.fontSizeRange, drawio.fontSettings.fontSizeSelectionInput, drawio.fontSettings.minFontSize);
        loadNumbersSelect(drawio.lineSettings.maxlineWidth, drawio.lineSettings.lineWidhtRange, drawio.lineSettings.lineWidthSelectionInput, drawio.lineSettings.minLineWidht);
        loadStringsSelect(drawio.fontSettings.fontSelectioninput, drawio.fontSettings.fontFamilyArray);

        //Set default values in the select boxes
        $(drawio.fontSettings.fontSizeSelectionInput).val(drawio.fontSettings.fontSize);
        $(drawio.fontSettings.fontSelectioninput).val(drawio.fontSettings.font);

        $(drawio.lineSettings.lineWidthSelectionInput).val(drawio.lineSettings.lineWidth);
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

    function undo(shapesarray) {
        if (shapesarray.length !== 0) {
            var undoedShape = shapesarray.pop();

            drawio.undoStorage.push(undoedShape);//So it's possible to do a a redo.
        }
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        drawCanvas();
    }

    function redo(shapesarray) {
        if (drawio.undoStorage.length !== 0) {
            shapesarray.push(drawio.undoStorage[drawio.undoStorage.length - 1]);
        }
        drawio.undoStorage.pop();
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        drawCanvas();
    }

    //Find the settings to save and returns the value and the key.
    function findSettings(settings) {
        //Produces a key value pair of the object
        var drawioEntries = Object.entries(drawio);
        for (var i = 0; i < drawioEntries.length; i++) {
            if (drawioEntries[i][0] == settings) {
                return drawioEntries[i][1]; //Gets the setting object
            }
        }
    }
    //Finds all the settings and pushes them into an array.
    function AllSettings() {
        var allSettings = [];
        var drawioEntries = Object.entries(drawio); //objects properties with key value pairs
        for (var i = 0; i < drawioEntries.length; i++) {
            //Gets the key and value of setting[i]
            allSettings.push([drawioEntries[i][0], findSettings(drawioEntries[i][0])]);
        }
        return allSettings;
    }

     //Saves the settings
     function save() {
        var settings = AllSettings();

        for (var i = 0; i < settings.length; i++) {
            window.localStorage.setItem(settings[i][0], JSON.stringify(settings[i][1]));
            console.log(localStorage.getItem(settings[i][0]));
        }
    }
   
    //Loads the settings again
    function load() {
        var settings = AllSettings();
        for (var i = 0; i < settings.length; i++) {
            console.log(localStorage.getItem(settings[i][0]));
        }
        drawCanvas();
    }

    //mousedown
    $('#my-canvas').on('mousedown', function (mouseEvent) {
        //console.log(drawio.selectedShape);
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
        //console.log(drawio.shapes);
        drawio.selectedElement = null;
    });

    $('.change-color').on('change', function () {
        var color = $(this).val();
        drawio.colorSettings.color = color;
    });

    $(drawio.fontSettings.fontSizeSelectionInput).on('change', function () {
        drawio.fontSettings.fontSize = $(this).val();
    });

    $(drawio.fontSettings.fontSelectioninput).on('change', function () {
        drawio.fontSettings.font = $(this).val();
    });

    $(drawio.lineSettings.lineWidthSelectionInput).on('change', function () {
        drawio.lineSettings.lineWidth = $(this).val();
    });

    $('#undo').on('click', function () {
        //console.log(drawio.shapes);
        undo(drawio.shapes);
    });


    $('#redo').on('click', function () {
        console.log(drawio.shapes);
        redo(drawio.shapes);
    });

    $('.save').on('click', function() {
        console.log("save");
        save();
    });

    $(document).on('keydown', function (e) {
        if (e.which === 90 && e.ctrlKey) {
            undo(drawio.shapes);
        }
    });

    $(document).on('keydown', function (e) {
        if (e.which === 89 && e.ctrlKey) {
            redo(drawio.shapes);
        }
    });

    console.log('load');
    load();
});