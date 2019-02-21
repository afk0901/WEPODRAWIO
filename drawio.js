/**
    Structure for assignment 2 project
 */

// 1. Define a function namespace drawio

// 2. Create an array to hold on to the shapes currently drawn
window.drawio = {

    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),//This is a canvas object, tell it that we are going to draw in 2d.
    hitcanvas: document.getElementById('hit-canvas'),   ///Hit canvas, used to detect if you click a shape
    hCtx: document.getElementById('hit-canvas').getContext('2d'), ///Hit canvas context, used when a shape has been clicked.

    dragging : false,
    hitKey: 'black',
    shapeBeingDragged: 0,
    shapes: [],
    lines: [],
    selectedShape: 'freehand',
    selectedElement: null,
    selectedElementText: null,

    //All available shapes goes here
    availableShapes: {
        RECTANGLE: 'square',
        RECTANGLE_FILLED: 'square-filled',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text',
        FREEHAND: 'freehand',
        CIRCLE_FILLED: 'circle-filled' 
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
        lineWidhtRange: 1,
        lineCap: 'round'
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
    function drawCanvas(event, flag) {


        if (drawio.selectedElement) {
            console.log(event)
            drawio.selectedElement.render(event);
        }

        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render(event,flag);
        }

    }

    //Clears the canvas and draws the canvas. Only works on the selected element.
    function clearAndDraw(element, mouseEvent) {
        if (element) {
            drawio.hCtx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            element.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawio.circleRadius = element.radius;
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
        drawio.hCtx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
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

    // console.log("The ",window.onkeydown," key was pressed");

    //mousedown
    $('#my-canvas').on('mousedown', function (mouseEvent) {
        if(mouseEvent.ctrlKey) {
            ///
            var hitKey = parseHitKey(drawio.hCtx.getImageData(mouseEvent.offsetX,mouseEvent.offsetY,1,1).data);
            for(var i = 0; i < drawio.shapes.length; i++){
                if(drawio.shapes[i].hitKey == hitKey) {
                    console.log("The shape selected is",drawio.shapes[i]);
                    drawio.shapeBeingDragged = i;
                    drawio.dragging = true;
                }
            }
        }
        else {
            drawio.hitKey = getRandomColor();
            switch (drawio.selectedShape) {

                case drawio.availableShapes.RECTANGLE:
                    drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color, drawio.hitKey);
                    drawio.hitKey = getRandomColor();
                    break;
                case drawio.availableShapes.RECTANGLE_FILLED:
                    drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color, drawio.hitKey, true);
                    drawio.hitKey = getRandomColor();
                    break;
                case drawio.availableShapes.CIRCLE:
                    drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color, drawio.hitKey);
                    drawio.hitKey = getRandomColor();
                    break;
                case drawio.availableShapes.CIRCLE_FILLED:
                    drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color, drawio.hitKey, true);
                    getRandomColor();
                    break;
                case drawio.availableShapes.LINE:
                    drawio.selectedElement = new Line({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.colorSettings.color, drawio.lineSettings.lineWidth, drawio.hitKey);
                    drawio.hitKey = getRandomColor();
                    break;
                case drawio.availableShapes.TEXT:
                    drawio.selectedElementText = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0,
                        drawio.fontSettings.font, drawio.fontSettings.fontSize, drawio.colorSettings.color,drawio.hitKey);
                    drawio.hitKey = getRandomColor();
                    break;
                case drawio.availableShapes.FREEHAND:
                    drawio.selectedElement = new Freehand({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.colorSettings.color, drawio.lineSettings.lineWidth, drawio.lineSettings.lineCap, drawio.hitKey);
                    drawio.ctx.beginPath();
                    drawio.ctx.moveTo(mouseEvent.offsetX, mouseEvent.offsetY);
                    drawio.hCtx.beginPath();
                    drawio.hCtx.moveTo(mouseEvent.offsetX, mouseEvent.offsetY);
                    drawio.selectedElement.lineList.push({x: mouseEvent.offsetX, y: mouseEvent.offsetY});
                    drawio.hitKey = getRandomColor();
                    break;
            }
        }
    })
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

        var settings = AllSettings();//Getting all the settings
        var constructorsArray = [];

        for (var i = 0; i < settings.length; i++) {
            //Save shapes settings
            if (settings[i][0] == 'shapes') {
                //Save the shape with the shapename as a value

                window.localStorage.setItem(settings[i][0], JSON.stringify(settings[i][1]));//Saving the shape array.
                //Saving the constructors so we know what object is going to be drawed again on loading.

                for (var j = 0; j < settings[i][1].length; j++) {
                    //Making array of constructors to access the correct object later  on.
                    if (settings[i][1][j]) {
                        constructorsArray.push(settings[i][1][j].constructor)//pushing the shapes constructors in another array.
                    }
                }
            }

        }


        var constructorsArrayString = constructorsArray.join('///');// /// used as a seperator for this array.
        window.localStorage.setItem('constructors', constructorsArrayString); //saves the constructors as a string.
        //localStorage.clear();//Prevents the localstorage to be too slow.
    }


    //Gets the saved settings
    function load() {

        drawio.shapes = [];

        var constructors = localStorage.getItem('constructors');
        var constructorsArray = constructors.split('///');//To get array of constructors again.
        var savedShapesWithoutNull = [];
        var settings = AllSettings();//Gets all the default settings so it's possible to manipulate the settings.
        var savedShapes = [];
        //Finds the shape array and loads it from the local storage
        for (var i = 0; i < settings.length; i++) {

            if (settings[i][0] == 'shapes') {
                savedShapes = JSON.parse(localStorage.getItem(settings[i][0]));
            }
        }

        //Checks if the constructor is the constructor we are looking for, if so we know where we are lookin for in the shape array
        //as saved shapes is that array, just parsed.
        for (var i = 0; i < constructorsArray.length; i++) {
            if (constructorsArray[i] == Line) {
                var linePosx = savedShapes[i].position.x;
                var linePosy = savedShapes[i].position.y;
                var lineStartX = savedShapes[i].linestartx;
                var lineStartY = savedShapes[i].linestarty;
                var lineColor = savedShapes[i].color;
                var width = savedShapes[i].lineWidth;

                drawio.selectedElement = new Line({ x: linePosx, y: linePosy }, lineStartX, lineStartY, lineColor, width);
                drawio.shapes.push(drawio.selectedElement);
                drawio.selectedElement = null;
            }

            if (constructorsArray[i] == Circle) {
                var circlePosx = savedShapes[i].position.x;
                var circlePosy = savedShapes[i].position.y;
                var circleColor = savedShapes[i].color;
                drawio.selectedElement = new Circle({ x: circlePosx, y: circlePosy }, circleColor);
                drawio.selectedElement.radius = savedShapes[i].radius;
                drawio.shapes.push(drawio.selectedElement);
                drawio.selectedElement = null;
            }

            if (constructorsArray[i] == Rectangle) {
                var rectanglePosx = savedShapes[i].position.x;
                var rectanglePosy = savedShapes[i].position.y;
                var rectColor = savedShapes[i].color;
                drawio.selectedElement = new Rectangle({ x: rectanglePosx, y: rectanglePosy }, rectColor);

                drawio.selectedElement.width = savedShapes[i].width;
                drawio.selectedElement.height = savedShapes[i].height;
                drawio.shapes.push(drawio.selectedElement);
                drawio.selectedElement = null;
            }
            console.log("CONSTRUCTORS");
            console.log(constructorsArray[i]);
            if (constructorsArray[i] == Text) {
                //Somehow, null is in the savedShapeArray so taking the nulls out.
                for (var j = 0; j < savedShapes.length; j++) {
                    if (savedShapes[j]) {
                        savedShapesWithoutNull.push(savedShapes[j]);
                    }
                }
                console.log(savedShapesWithoutNull[i]);
                var textPosx = savedShapesWithoutNull[i].position.x;
                var textPosy = savedShapesWithoutNull[i].position.y;
                var text = savedShapesWithoutNull[i].text;
                var font = savedShapesWithoutNull[i].font;
                var fontSize = savedShapesWithoutNull[i].fontsize;
                var textColor = savedShapesWithoutNull[i].color;
                console.log("SAVEDWITHOUTNULL");
                console.log(savedShapesWithoutNull[i]);
                drawio.selectedElementText = new Text({ x: textPosx, y: textPosy }, font, fontSize, textColor);
                drawio.selectedElementText.text = text;
                drawio.shapes.push(drawio.selectedElementText);
                console.log(drawio.shapes);
                drawio.selectedElementText = null;
            }


        }
        drawCanvas();
    }

    //mousedown

    $('#my-canvas').on('mousedown', function (mouseEvent) {

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
                drawio.selectedElementText = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY },
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
        if(mouseEvent.ctrlKey && drawio.dragging) {
            console.log("MouseMove while holding ctrl")
            if(drawio.shapes[drawio.shapeBeingDragged].name == 'Freehand' || drawio.shapes[drawio.shapeBeingDragged].name == 'Line'){
                drawio.shapes[drawio.shapeBeingDragged].recalculate({x: mouseEvent.offsetX, y: mouseEvent.offsetY});
                console.log("Recalculating!!");
            }
            drawio.shapes[drawio.shapeBeingDragged].position = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
            drawio.hCtx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            console.log("From inside mouseMove");
            drawCanvas(mouseEvent,true);
        }
    
        else if(drawio.selectedElement && drawio.selectedShape == 'freehand') {
            drawio.selectedElement.lineList.push({x: mouseEvent.offsetX, y:mouseEvent.offsetY});
            drawio.selectedElement.renderOnMouseMove(mouseEvent);
            console.log("Freehand is selected");
        }else {
            clearAndDraw(drawio.selectedElement, mouseEvent);
        }
    });

    //mouseup
    $('#my-canvas').on('mouseup', function (mouseEvent) {
        
        if(mouseEvent.ctrlKey) {
            console.log("MouseUP while holding ctrl")
            drawio.dragging = false;

        }
        else if (drawio.selectedElementText) {
            drawio.ctx.closePath();
            drawio.shapes.push(drawio.selectedElementText);
        }else {
            drawio.shapes.push(drawio.selectedElement);//mousemove clears everything
            console.log(drawio.shapes);
            drawio.selectedElement = null;
            drawio.lines = [];
            // drawio.dragging = false;
            console.log("2")

        }
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
        undo(drawio.shapes);
    });

    function getRandomColor() {
        var x = Math.floor(Math.random() * 256);
        var y = Math.floor(Math.random() * 256);
        var z = Math.floor(Math.random() * 256);
        var v = 255;
        var color = "rgba(" + x + ", " + y + ", " + z + ", " + v + ")";

        
            // var letters = '0123456789ABCDEF';
            // var color = '#';
            // for (var i = 0; i < 6; i++) {
            //   color += letters[Math.floor(Math.random() * 16)];
            // }
            
        return color;
      }

      function parseHitKey(hitKey) {
        var retVal = "rgba(" + hitKey[0] + ", " + hitKey[1] + ", " + hitKey[2] + ", " + hitKey[3] + ")";
        return retVal;
      }
// });


    $('#redo').on('click', function () {
        redo(drawio.shapes);
    });

    $('.save').on('click', function () {
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

});
    $('#clear-canvas').on('click', function () {
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        drawio.shapes = [];//Empty the shapes array
    });
    load();
});
