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

function Rectangle(position, width, height, color) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
};

function Circle(position, radius) {
    Shape.call(this, position);
    this.radius = radius;
    this.position = position;
}

function Line(position) {
    Shape.call(this, position);
    this.position = position;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function () {
    drawio.ctx.fillStyle = $('.change-color').val()
    drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
};

Rectangle.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
    drawio.ctx.beginPath();
    drawio.ctx.arc(this.position.x, this.position.y, Math.abs(this.radius), 0, 2 * Math.PI);
    drawio.ctx.stroke();
}

Circle.prototype.resize = function (x, y) {
    this.radius = x - this.position.x;
    this.radius = y - this.position.y;
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function () {
    drawio.ctx.beginPath();
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(300, 150);
    drawio.ctx.stroke();
}