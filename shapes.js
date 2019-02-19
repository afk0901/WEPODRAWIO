/**
    Define shapes
 */

function Shape(position) {
    this.position = position;
}

Shape.prototype.render = function () { };

Shape.prototype.move = function (position) {
    this.position = position;
};

Shape.prototype.resize = function () { };

function Rectangle(position, color) {
    Shape.call(this, position);
    this.width = 0;
    this.height = 0;
    this.color = color;
};

function Circle(position, color) {
    Shape.call(this, position);
    this.radius = 0;
    this.position = position;
    this.color = color;
}

function Line(position, linestartx, linestarty, color, LineWidth) {
    Shape.call(this, position);
    this.position = position;
    this.linestartx = linestartx;
    this.linestarty = linestarty;
    this.color = color;
    this.lineWidth = LineWidth;
}

function Text(position, textposx, textposy, font, fontsize, color) {
    Shape.call(this, position);
    this.position = position;
    this.textposx = textposx;
    this.textposy = textposy;
    this.font = font;
    this.fontsize = fontsize;
    this.text = '';
    this.color = color;
}

function Freehand(position, color, lineWidth, lineCap) {
    Shape.call(this,position);
    this.color = color;
    this.lineWidth = lineWidth;
    this.lineCap = lineCap;
    this.lineList = [];
   
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function () {
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
};

Rectangle.prototype.resize = function (x, y) {
    //Start wheere the mouse was in the begining end where the mouse is at the end draw a rectangle between that.
    this.width = x - this.position.x;
    this.height = y - this.position.y;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.beginPath();
    drawio.ctx.arc(this.position.x, this.position.y, Math.abs(this.radius), 0, 2 * Math.PI);
    drawio.ctx.stroke();
    drawio.ctx.closePath();
}

Circle.prototype.resize = function (x, y) {
    this.radius = x - this.position.x;
    this.radius = y - this.position.y;
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWidth;
    console.log(this.lineWidth);
    drawio.ctx.beginPath();
    drawio.ctx.moveTo(this.linestartx, this.linestarty);
    drawio.ctx.lineTo(this.position.x, this.position.y);
    drawio.ctx.stroke();
    drawio.ctx.closePath();
}

Line.prototype.resize = function (x, y) {
    this.linestartx = x;
    this.linestarty = y;
}

Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.font = this.fontsize.toString() + "px " + this.font;
    console.log(drawio.ctx.font);
    drawio.ctx.fillText(this.text, this.position.x, this.position.y);
}

Text.prototype.resize = function () {

}

/// Freehand Drawing

Freehand.prototype = Object.create(Shape.prototype);
Freehand.prototype.constructor = Freehand;

Freehand.prototype.render = function () {
    var i = 1;
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWidth;
    // drawio.ctx.lineCap = this.lineCap;
    drawio.ctx.beginPath();
    drawio.ctx.moveTo(this.lineList[0].x, this.lineList[0].y)
    // this.lineList.push({x: mouseEvent.offsetX, y:mouseEvent.offsetY});
    while(i < this.lineList.length) {
        drawio.ctx.lineTo(this.lineList[i].x, this.lineList[i].y)
        drawio.ctx.stroke();
        i++;
    }
    console.log("Inside Freehand Render function, array length is:");
}
Freehand.prototype.resize = function () {
    
}
Freehand.prototype.renderOnMouseMove = function (mouseEvent) {
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWidth;
    drawio.ctx.lineTo(mouseEvent.offsetX,mouseEvent.offsetY);
    drawio.ctx.stroke();
}

