/**
    Structure for assignment 2 project
 */

 // 1. Define a function namespace drawio

 // 2. Create an array to hold on to the shapes currently drawn
 window.drawio = {
     shapes: [],
     selectedShape: 'rectangle',
     canvas: document.getElementById('my-canvas'),
     ctx: document.getElementById('my-canvas').getContext('2d'),//This is a canvas object, tell it that we are going to draw in 2d.
     selectedElement: null,
     availableShapes: {
         RECTANGLE: 'rectangle'
         //All available shapes goes here
     }
 };

 $(function(){
    //Document is loaded and parsed

    //Renders the proper object
    function drawCanvas() {
        if(drawio.selectedElement) {
           drawio.selectedElement.render();
        }
        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
    }

    $('.icon').on('click', function(){
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    //mousedown
    $('#my-canvas').on('mousedown', function(mouseEvent){
        switch (drawio.selectedShape){
            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle( {x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0 );
                break;
        }
    });

    //mousemove
    $('#my-canvas').on('mousemove', function(mouseEvent){
        if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();//Draws everything as the shapes were pushed into the shape array.
        }
    });

    //mouseup
    $('#my-canvas').on('mouseup', function(){
        drawio.shapes.push(drawio.selectedElement);//mousemove clears everything
        console.log(drawio.shapes);
        drawio.selectedElement = null;
    });
 });