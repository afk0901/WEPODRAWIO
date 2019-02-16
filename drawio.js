/**
    Structure for assignment 2 project
 */

// 1. Define a function namespace drawio

// 2. Create an array to hold on to the shapes currently drawn
window.drawio = {
    shapes: [],
    selectedShape: 'square',
    canvas: document.getElementById('my-canvas'),
    ctx: document.getElementById('my-canvas').getContext('2d'),//This is a canvas object, tell it that we are going to draw in 2d.
    selectedElement: null,
    selectedElementText: null,
    //All available shapes goes here
    availableShapes: {
        RECTANGLE: 'square',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text'
    }
};

$(function () {
    //Document is loaded and parsed

    //Renders the objects from the array
    function drawCanvas() {

        if (drawio.selectedElement) {
            //drawio.ctx.fillStyle = $('.change-color').val()
            drawio.selectedElement.render();
        }

        for (var i = 0; i < drawio.shapes.length; i++) {
            if (drawio.shapes[i] != null) {
                drawio.shapes[i].render();
            }
        }
    }

    $('.icon').on('click', function () {
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    //mousedown
    $('#my-canvas').on('mousedown', function (mouseEvent) {
        console.log(drawio.selectedShape);
        switch (drawio.selectedShape) {

            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
                break;
            case drawio.availableShapes.CIRCLE:
                drawio.selectedElement = new Circle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
                break;
            case drawio.availableShapes.LINE:
                drawio.selectedElement = new Line({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0);
                break;
            case drawio.availableShapes.TEXT:
                drawio.selectedElementText = new Text({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, 30, 'Arial');
                break;
        }
    });

    function clearAndDraw(element, mouseEvent) {
        if (element) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            element.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();//Draws everything as the shapes were pushed into the shape array.
        }
    }

    function makeTextInput() {
        var elementString = "<input type='text'>";
        $(".container").append(elementString);
        //Find the element and position it.
        //return text.toString();
    }
    
    //Click
    $('#my-canvas').on('click', function (mouseEvent) {
        //drawio.selectedElementText.text = makeTextInput();
       // console.log(drawio.selectedElementText);
        makeTextInput();
        clearAndDraw(drawio.selectedElementText, mouseEvent);
    });

    //mousemove
    $('#my-canvas').on('mousemove', function (mouseEvent) {
        clearAndDraw(drawio.selectedElement, mouseEvent);
    });

    //mouseup
    $('#my-canvas').on('mouseup', function () {
        drawio.shapes.push(drawio.selectedElement);//mousemove clears everything
        drawio.shapes.push(drawio.selectedElementText);
        console.log(drawio.shapes);
        drawio.selectedElement = null;
    });
});