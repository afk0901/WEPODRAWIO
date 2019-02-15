/**
    Define shapes
 */

 function Shape(position) {
     this.position = position;
 }

 Shape.prototype.render = function() {};

 Shape.prototype.move = function(position) {
    this.position = position;
 };

 Shape.prototype.resize = function() {};

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

 //Assign the prototype
 Rectangle.prototype = Object.create(Shape.prototype);
 Rectangle.prototype.constructor = Rectangle;
 
 Circle.prototype = Object.create(Shape.prototype);
 Circle.prototype.constructor = Circle;

 Rectangle.prototype.render = function () {
     drawio.ctx.fillStyle = $('.change-color').val()
     drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
 };

 Circle.prototype.render = function() {
     drawio.ctx.beginPath();
     drawio.ctx.arc(this.position.x, this.position.y, Math.abs(this.radius), 0, 2 * Math.PI);
     drawio.ctx.stroke();
 }

 Rectangle.prototype.resize = function (x, y) {
     this.width = x - this.position.x;
     this.height = y - this.position.y; 
 }

 Circle.prototype.resize = function (x, y) {
     this.radius = x - this.position.x;
     this.radius = y - this.position.y;
 }