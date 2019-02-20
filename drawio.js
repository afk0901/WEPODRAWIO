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
    shapes: [],
    lines: [],
    selectedShape: 'freehand',
    selectedElement: null,
    selectedElementText: null,

    //All available shapes goes here
    availableShapes: {
        RECTANGLE: 'square',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text',
        FREEHAND: 'freehand'
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
    function drawCanvas(event) {

        if (drawio.selectedElement) {
            console.log(event)
            drawio.selectedElement.render(event);

        }

        for (var i = 0; i < drawio.shapes.length; i++) {
            // if (drawio.shapes[i] != null) {
            //     if(Array.isArray(drawio.shapes[i])) { 
            //         // var obj = new Freehand();
            //         // console.log("Object is", obj);
            //         var elem = drawio.shapes[i];
            //         Freehand.prototype.render(elem);
            //     }
            //     else {
                    drawio.shapes[i].render(event);
                
            
            
        }
    }

    //Clears the canvas and draws the elements and performs other functionality such resize and such a stuff.
    function clearAndDraw(element, mouseEvent) {
        if (element) {
            drawio.hCtx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            element.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            
            drawCanvas(mouseEvent);//Draws everything as the shapes were pushed into the shape array.
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

    function undo(shapesarray){
        var undoedShape = shapesarray.pop();
        drawio.undoStorage.push(undoedShape);
        console.log(drawio.undoStorage);
        drawio.hCtx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
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
                    drawio.dragging = true;
                }
            }
        }else {
            drawio.hitKey = getRandomColor();
            switch (drawio.selectedShape) {

                case drawio.availableShapes.RECTANGLE:
                    drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color, drawio.hitKey);
                    drawio.hitKey = getRandomColor();
                    break;
                case drawio.availableShapes.CIRCLE:
                    drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, drawio.colorSettings.color, drawio.hitKey);
                    drawio.hitKey = getRandomColor();
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
        if(mouseEvent.ctrlKey) {
            console.log("MouseMove while holding ctrl")
            if(drawio.dragging) {
                
            }
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
            drawio.draggin = false;

        }
        else if (drawio.selectedElementText) {
            drawio.ctx.closePath();
            drawio.shapes.push(drawio.selectedElementText);
            drawio.draggin = false;
            console.log("2")


        }else {
            drawio.shapes.push(drawio.selectedElement);//mousemove clears everything
            console.log(drawio.shapes);
            drawio.selectedElement = null;
            drawio.lines = [];
            drawio.draggin = false;
            console.log("2")

        }
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

    $('#undo').on('click', function(){
        console.log(drawio.shapes);
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
});

