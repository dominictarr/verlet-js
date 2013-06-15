;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){

//this exports all the verlet methods globally, so that the demos work.

var VerletJS = require('./verlet')
var constraint = require('./constraint')
								 require('./objects') //patches VerletJS.prototype (bad)
window.Vec2 = require('./vec2')
window.VerletJS = VerletJS

window.Particle = VerletJS.Particle

window.DistanceConstraint = constraint.DistanceConstraint
window.PinConstraint      = constraint.PinConstraint
window.AngleConstraint    = constraint.AngleConstraint



},{"./verlet":2,"./constraint":3,"./objects":4,"./vec2":5}],5:[function(require,module,exports){

/*
Copyright 2013 Sub Protocol and other contributors
http://subprotocol.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// A simple 2-dimensional vector implementation

module.exports = Vec2

function Vec2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vec2.prototype.add = function(v) {
	return new Vec2(this.x + v.x, this.y + v.y);
}

Vec2.prototype.sub = function(v) {
	return new Vec2(this.x - v.x, this.y - v.y);
}

Vec2.prototype.mul = function(v) {
	return new Vec2(this.x * v.x, this.y * v.y);
}

Vec2.prototype.div = function(v) {
	return new Vec2(this.x / v.x, this.y / v.y);
}

Vec2.prototype.scale = function(coef) {
	return new Vec2(this.x*coef, this.y*coef);
}

Vec2.prototype.mutableSet = function(v) {
	this.x = v.x;
	this.y = v.y;
	return this;
}

Vec2.prototype.mutableAdd = function(v) {
	this.x += v.x;
	this.y += v.y;
	return this;
}

Vec2.prototype.mutableSub = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	return this;
}

Vec2.prototype.mutableMul = function(v) {
	this.x *= v.x;
	this.y *= v.y;
	return this;
}

Vec2.prototype.mutableDiv = function(v) {
	this.x /= v.x;
	this.y /= v.y;
	return this;
}

Vec2.prototype.mutableScale = function(coef) {
	this.x *= coef;
	this.y *= coef;
	return this;
}

Vec2.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y;
}

Vec2.prototype.epsilonEquals = function(v, epsilon) {
	return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
}

Vec2.prototype.length = function(v) {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vec2.prototype.length2 = function(v) {
	return this.x*this.x + this.y*this.y;
}

Vec2.prototype.dist = function(v) {
	return Math.sqrt(this.dist2(v));
}

Vec2.prototype.dist2 = function(v) {
	var x = v.x - this.x;
	var y = v.y - this.y;
	return x*x + y*y;
}

Vec2.prototype.normal = function() {
	var m = Math.sqrt(this.x*this.x + this.y*this.y);
	return new Vec2(this.x/m, this.y/m);
}

Vec2.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y;
}

Vec2.prototype.angle = function(v) {
	return Math.atan2(this.x*v.y-this.y*v.x,this.x*v.x+this.y*v.y);
}

Vec2.prototype.angle2 = function(vLeft, vRight) {
	return vLeft.sub(this).angle(vRight.sub(this));
}

Vec2.prototype.rotate = function(origin, theta) {
	var x = this.x - origin.x;
	var y = this.y - origin.y;
	return new Vec2(x*Math.cos(theta) - y*Math.sin(theta) + origin.x, x*Math.sin(theta) + y*Math.cos(theta) + origin.y);
}

Vec2.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
}

function test_Vec2() {
	var assert = function(label, expression) {
		console.log("Vec2(" + label + "): " + (expression == true ? "PASS" : "FAIL"));
		if (expression != true)
			throw "assertion failed";
	};
	
	assert("equality", (new Vec2(5,3).equals(new Vec2(5,3))));
	assert("epsilon equality", (new Vec2(1,2).epsilonEquals(new Vec2(1.01,2.02), 0.03)));
	assert("epsilon non-equality", !(new Vec2(1,2).epsilonEquals(new Vec2(1.01,2.02), 0.01)));
	assert("addition", (new Vec2(1,1)).add(new Vec2(2, 3)).equals(new Vec2(3, 4)));
	assert("subtraction", (new Vec2(4,3)).sub(new Vec2(2, 1)).equals(new Vec2(2, 2)));
	assert("multiply", (new Vec2(2,4)).mul(new Vec2(2, 1)).equals(new Vec2(4, 4)));
	assert("divide", (new Vec2(4,2)).div(new Vec2(2, 2)).equals(new Vec2(2, 1)));
	assert("scale", (new Vec2(4,3)).scale(2).equals(new Vec2(8, 6)));
	assert("mutable set", (new Vec2(1,1)).mutableSet(new Vec2(2, 3)).equals(new Vec2(2, 3)));
	assert("mutable addition", (new Vec2(1,1)).mutableAdd(new Vec2(2, 3)).equals(new Vec2(3, 4)));
	assert("mutable subtraction", (new Vec2(4,3)).mutableSub(new Vec2(2, 1)).equals(new Vec2(2, 2)));
	assert("mutable multiply", (new Vec2(2,4)).mutableMul(new Vec2(2, 1)).equals(new Vec2(4, 4)));
	assert("mutable divide", (new Vec2(4,2)).mutableDiv(new Vec2(2, 2)).equals(new Vec2(2, 1)));
	assert("mutable scale", (new Vec2(4,3)).mutableScale(2).equals(new Vec2(8, 6)));
	assert("length", Math.abs((new Vec2(4,4)).length() - 5.65685) <= 0.00001);
	assert("length2", (new Vec2(2,4)).length2() == 20);
	assert("dist", Math.abs((new Vec2(2,4)).dist(new Vec2(3,5)) - 1.4142135) <= 0.000001);
	assert("dist2", (new Vec2(2,4)).dist2(new Vec2(3,5)) == 2);

	var normal = (new Vec2(2,4)).normal()
	assert("normal", Math.abs(normal.length() - 1.0) <= 0.00001 && normal.epsilonEquals(new Vec2(0.4472, 0.89443), 0.0001));
	assert("dot", (new Vec2(2,3)).dot(new Vec2(4,1)) == 11);
	assert("angle", (new Vec2(0,-1)).angle(new Vec2(1,0))*(180/Math.PI) == 90);
	assert("angle2", (new Vec2(1,1)).angle2(new Vec2(1,0), new Vec2(2,1))*(180/Math.PI) == 90);
	assert("rotate", (new Vec2(2,0)).rotate(new Vec2(1,0), Math.PI/2).equals(new Vec2(1,1)));
	assert("toString", (new Vec2(2,4)) == "(2, 4)");
}


},{}],4:[function(require,module,exports){

/*
Copyright 2013 Sub Protocol and other contributors
http://subprotocol.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// generic verlet entities

var VerletJS = require('./verlet')
var Particle = VerletJS.Particle
var constraints = require('./constraint')
var DistanceConstraint = constraints.DistanceConstraint

VerletJS.prototype.point = function(pos) {
  var composite = new this.Composite();
  composite.particles.push(new Particle(pos));
  this.composites.push(composite);
  return composite;
}

VerletJS.prototype.lineSegments = function(vertices, stiffness) {
  var i;
  
  var composite = new this.Composite();
  
  for (i in vertices) {
    composite.particles.push(new Particle(vertices[i]));
    if (i > 0)
      composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[i-1], stiffness));
  }
  
  this.composites.push(composite);
  return composite;
}

VerletJS.prototype.cloth = function(origin, width, height, segments, pinMod, stiffness) {
  
  var composite = new this.Composite();
  
  var xStride = width/segments;
  var yStride = height/segments;
  
  var x,y;
  for (y=0;y<segments;++y) {
    for (x=0;x<segments;++x) {
      var px = origin.x + x*xStride - width/2 + xStride/2;
      var py = origin.y + y*yStride - height/2 + yStride/2;
      composite.particles.push(new Particle(new Vec2(px, py)));
      
      if (x > 0)
        composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[y*segments+x-1], stiffness));
      
      if (y > 0)
        composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[(y-1)*segments+x], stiffness));
    }
  }
  
  for (x=0;x<segments;++x) {
    if (x%pinMod == 0)
    composite.pin(x);
  }
  
  this.composites.push(composite);
  return composite;
}

VerletJS.prototype.tire = function(origin, radius, segments, spokeStiffness, treadStiffness) {
  var stride = (2*Math.PI)/segments;
  var i;
  
  var composite = new this.Composite();
  
  // particles
  for (i=0;i<segments;++i) {
    var theta = i*stride;
    composite.particles.push(new Particle(new Vec2(origin.x + Math.cos(theta)*radius, origin.y + Math.sin(theta)*radius)));
  }
  
  var center = new Particle(origin);
  composite.particles.push(center);
  
  // constraints
  for (i=0;i<segments;++i) {
    composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i+1)%segments], treadStiffness));
    composite.constraints.push(new DistanceConstraint(composite.particles[i], center, spokeStiffness))
    composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i+5)%segments], treadStiffness));
  }
    
  this.composites.push(composite);
  return composite;
}


},{"./verlet":2,"./constraint":3}],2:[function(require,module,exports){

/*
Copyright 2013 Sub Protocol and other contributors
http://subprotocol.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

window.requestAnimFrame = window.requestAnimationFrame
|| window.webkitRequestAnimationFrame
|| window.mozRequestAnimationFrame
|| window.oRequestAnimationFrame
|| window.msRequestAnimationFrame
|| function(callback) {
  window.setTimeout(callback, 1000 / 60);
};

var Vec2 = require('vec2')

exports = module.exports = VerletJS
exports.Particle = Particle
exports.Composite = Composite

function Particle(pos) {
  this.pos = new Vec2(pos);
  this.lastPos = new Vec2(pos);
}

Particle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 2, 0, 2*Math.PI);
  ctx.fillStyle = "#2dad8f";
  ctx.fill();
}

function VerletJS(width, height, canvas) {
  this.width = width;
  this.height = height;
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.mouse = new Vec2(0,0);
  this.mouseDown = false;
  this.draggedEntity = null;
  this.selectionRadius = 20;
  this.highlightColor = "#4f545c";
  
  this.bounds = function (particle) {
    if (particle.pos.y > this.height-1)
      particle.pos.y = this.height-1;
    
    if (particle.pos.x < 0)
      particle.pos.x = 0;

    if (particle.pos.x > this.width-1)
      particle.pos.x = this.width-1;
  }
  
  var _this = this;
  
  // prevent context menu
  this.canvas.oncontextmenu = function(e) {
    e.preventDefault();
  };
  
  this.canvas.onmousedown = function(e) {
    _this.mouseDown = true;
    var nearest = _this.nearestEntity();
    if (nearest) {
      _this.draggedEntity = nearest;
    }
  };
  
  this.canvas.onmouseup = function(e) {
    _this.mouseDown = false;
    _this.draggedEntity = null;
  };
  
  this.canvas.onmousemove = function(e) {
    var rect = _this.canvas.getBoundingClientRect();
    _this.mouse.x = e.clientX - rect.left;
    _this.mouse.y = e.clientY - rect.top;
  };  
  
  // simulation params
  this.gravity = new Vec2(0,0.2);
  this.friction = 0.99;
  this.groundFriction = 0.8;
  
  // holds composite entities
  this.composites = [];
}

VerletJS.prototype.Composite = Composite

function Composite() {
  this.particles = [];
  this.constraints = [];
  
  this.drawParticles = null;
  this.drawConstraints = null;
}

Composite.prototype.pin = function(index, pos) {
  pos = pos || this.particles[index].pos;
  var pc = new PinConstraint(this.particles[index], pos);
  this.constraints.push(pc);
  return pc;
}

VerletJS.prototype.frame = function(step) {
  var i, j, c;

  for (c in this.composites) {
    for (i in this.composites[c].particles) {
      var particles = this.composites[c].particles;
      
      // calculate velocity
      var velocity = particles[i].pos
          .subtract(particles[i].lastPos, true)
          .multiply(this.friction);
  
      // ground friction
      if (particles[i].pos.y >= this.height-1 && velocity.lengthSquared() > 0.000001) {
        var m = velocity.length();
        velocity.x /= m;
        velocity.y /= m;
        velocity.multiply(m*this.groundFriction);
      }
    
      // save last good state
      particles[i].lastPos.set(particles[i].pos);
    
      // gravity
      particles[i].pos.add(this.gravity);
    
      // inertia  
      particles[i].pos.add(velocity);
    }
  }
  
  // handle dragging of entities
  if (this.draggedEntity)
    this.draggedEntity.pos.set(this.mouse);
    
  // relax
  var stepCoef = 1/step;
  for (c in this.composites) {
    var constraints = this.composites[c].constraints;
    for (i=0;i<step;++i)
      for (j in constraints)
        constraints[j].relax(stepCoef);
  }
  
  // bounds checking
  for (c in this.composites) {
    var particles = this.composites[c].particles;
    for (i in particles)
      this.bounds(particles[i]);
  }
}

VerletJS.prototype.draw = function() {
  var i, c;
  
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
  
  for (c in this.composites) {
    // draw constraints
    if (this.composites[c].drawConstraints) {
      this.composites[c].drawConstraints(this.ctx, this.composites[c]);
    } else {
      var constraints = this.composites[c].constraints;
      for (i in constraints)
        constraints[i].draw(this.ctx);
    }
    
    // draw particles
    if (this.composites[c].drawParticles) {
      this.composites[c].drawParticles(this.ctx, this.composites[c]);
    } else {
      var particles = this.composites[c].particles;
      for (i in particles)
        particles[i].draw(this.ctx);
    }
  }

  // highlight nearest / dragged entity
  var nearest = this.draggedEntity || this.nearestEntity();
  if (nearest) {
    this.ctx.beginPath();
    this.ctx.arc(nearest.pos.x, nearest.pos.y, 8, 0, 2*Math.PI);
    this.ctx.strokeStyle = this.highlightColor;
    this.ctx.stroke();
  }
}

VerletJS.prototype.nearestEntity = function() {
  var c, i;
  var d2Nearest = 0;
  var entity = null;
  var constraintsNearest = null;
  
  // find nearest point
  for (c in this.composites) {
    var particles = this.composites[c].particles;
    for (i in particles) {
      var d2 = particles[i].pos.distance(this.mouse);
      if (d2 <= this.selectionRadius*this.selectionRadius && (entity == null || d2 < d2Nearest)) {
        entity = particles[i];
        constraintsNearest = this.composites[c].constraints;
        d2Nearest = d2;
      }
    }
  }
  
  // search for pinned constraints for this entity
  for (i in constraintsNearest)
    if (constraintsNearest[i] instanceof PinConstraint && constraintsNearest[i].a == entity)
      entity = constraintsNearest[i];
  
  return entity;
}


},{"vec2":6}],3:[function(require,module,exports){

/*
Copyright 2013 Sub Protocol and other contributors
http://subprotocol.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// DistanceConstraint -- constrains to initial distance
// PinConstraint -- constrains to static/fixed point
// AngleConstraint -- constrains 3 particles to an angle

var Vec2 = require('vec2')

exports.DistanceConstraint = DistanceConstraint
exports.PinConstraint = PinConstraint
exports.AngleConstraint = AngleConstraint

function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
  this.a = a;
  this.b = b;
  this.distance = typeof distance != "undefined" ? distance : a.pos.distance(b.pos);
  this.stiffness = stiffness;
  this.normal = this.a.pos.subtract(this.b.pos, true)
}

DistanceConstraint.prototype.relax = function(stepCoef) {
  var a = this.a.pos
  var b = this.b.pos
  var normal = this.normal.set(a.x - b.x, a.y - b.y)
  //.subtract(this.b.pos);
  var m = normal.lengthSquared();
  normal.multiply(((this.distance*this.distance - m)/m)*this.stiffness*stepCoef);
  this.a.pos.add(normal);
  this.b.pos.subtract(normal);
}

DistanceConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.a.pos.x, this.a.pos.y);
  ctx.lineTo(this.b.pos.x, this.b.pos.y);
  ctx.strokeStyle = "#d8dde2";
  ctx.stroke();
}


function PinConstraint(a, pos) {
  this.a = a;
  this.pos = (new Vec2()).set(pos);
}

PinConstraint.prototype.relax = function(stepCoef) {
  this.a.pos.set(this.pos);
}

PinConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 6, 0, 2*Math.PI);
  ctx.fillStyle = "rgba(0,153,255,0.1)";
  ctx.fill();
}


function AngleConstraint(a, b, c, stiffness) {
  this.a = a;
  this.b = b;
  this.c = c;
  this.angle = this.b.pos.angleTo(this.a.pos, this.c.pos);
  this.stiffness = stiffness;
}

function angle2(a, b, c) {
  b.sub(a, true).angleTo(c)
}

function rotate(self, origin, theta) {
  var x = self.x - origin.x;
  var y = self.y - origin.y;
  return new Vec2(x*Math.cos(theta) - y*Math.sin(theta) + origin.x, x*Math.sin(theta) + y*Math.cos(theta) + origin.y);
}

AngleConstraint.prototype.relax = function(stepCoef) {
  var angle = angle2(this.b.pos, this.a.pos, this.c.pos)
  //this.b.pos.angle2(this.a.pos, this.c.pos);
  var diff = angle - this.angle;
  
  if (diff <= -Math.PI)
    diff += 2*Math.PI;
  else if (diff >= Math.PI)
    diff -= 2*Math.PI;

  diff *= stepCoef*this.stiffness;
  
  this.a.pos = rotate(this.a.pos, this.b.pos, diff);
  this.c.pos = rotate(this.c.pos, this.b.pos, -diff);
  this.b.pos = rotate(this.b.pos, this.a.pos, diff);
  this.b.pos = rotate(this.b.pos, this.c.pos, -diff);
}

AngleConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.a.pos.x, this.a.pos.y);
  ctx.lineTo(this.b.pos.x, this.b.pos.y);
  ctx.lineTo(this.c.pos.x, this.c.pos.y);
  var tmp = ctx.lineWidth;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,0,0.2)";
  ctx.stroke();
  ctx.lineWidth = tmp;
}

},{"vec2":6}],6:[function(require,module,exports){
;(function inject(clean, precision, undef) {

  function Vec2(x, y) {
    if (!(this instanceof Vec2)) {
      return new Vec2(x, y);
    }

    if('object' === typeof x && x) {
      this.y = x.y;
      this.x = x.x;
      return
    }

    this.x = x || 0;
    this.y = y || 0;
    
    this.set(x || 0, y || 0);
  };

  Vec2.prototype = {
    change : function(fn) {
      if (fn) {
        if (this.observers) {
          this.observers.push(fn);
        } else {
          this.observers = [fn];
        }
      } else if (this.observers) {
        for (var i=this.observers.length-1; i>=0; i--) {
          this.observers[i](this);
        }
      }

      return this;
    },

    ignore : function(fn) {
      this.observers = this.observers.filter(function(cb) {
        return cb !== fn;
      });

      return this;
    },

    dirty : function() {
      this._dirty = true
      this.__cachedLength = null
      this.__cachedLengthSquared = null
    },

    // set x and y
    set: function(x, y, silent) {
      if('number' != typeof x) { //x && 'object' === typeof x) {
        silent = y;
        y = x.y;
        x = x.x;
      }
//      x = Vec2.clean(x)
//      y = Vec2.clean(y)
      if(this.x === x && this.y === y)
        return this;
      this.x = x;
      this.y = y;
//      this.dirty();
//      this.__cachedLength = null
//      this.__cachedLengthSquared = null
      if(silent !== false)
        return this.change();
    },

    // reset x and y to zero
    zero : function() {
      return this.set(0, 0);
    },

    // return a new vector with the same component values
    // as this one
    clone : function() {
      return new Vec2(this.x, this.y);
    },

    // negate the values of this vector
    negate : function(returnNew) {
      if (returnNew) {
        return new Vec2(-this.x, -this.y);
      } else {
        return this.set(-this.x, -this.y);
      }
    },

    // Add the incoming `vec2` vector to this vector
    add : function(vec2, returnNew) {
      if (!returnNew) {
        this.x += vec2.x; this.y += vec2.y;
        return this.change()
//        return this.set(this.x + vec2.x, this.y + vec2.y);
      } else {
        // Return a new vector if `returnNew` is truthy
        return new Vec2(
          this.x + vec2.x,
          this.y + vec2.y
        );
      }
    },

    // Subtract the incoming `vec2` from this vector
    subtract : function(vec2, returnNew) {
      if (!returnNew) {
        this.x -= vec2.x; this.y -= vec2.y;
        return this.change()
//        return this.set(this.x - vec2.x, this.y - vec2.y)
      } else {
        // Return a new vector if `returnNew` is truthy
        return new Vec2(
          this.x - vec2.x,
          this.y - vec2.y
        );
      }
    },

    // Multiply this vector by the incoming `vec2`
    multiply : function(vec2, returnNew) {
      var x,y;
      if ('number' !== typeof vec2) { //.x !== undef) {
        x = vec2.x;
        y = vec2.y;

      // Handle incoming scalars
      } else {
        x = y = vec2;
      }

      if (!returnNew) {
        return this.set(this.x * x, this.y * y);
      } else {
        return new Vec2(
          this.x * x,
          this.y * y
        );
      }
    },

    // Rotate this vector. Accepts a `Rotation` or angle in radians.
    //
    // Passing a truthy `inverse` will cause the rotation to
    // be reversed.
    //
    // If `returnNew` is truthy, a new
    // `Vec2` will be created with the values resulting from
    // the rotation. Otherwise the rotation will be applied
    // to this vector directly, and this vector will be returned.
    rotate : function(r, inverse, returnNew) {
      var
      x = this.x,
      y = this.y,
      cos = Math.cos(r),
      sin = Math.sin(r),
      rx, ry;

      inverse = (inverse) ? -1 : 1;

      rx = cos * x - (inverse * sin) * y;
      ry = (inverse * sin) * x + cos * y;

      if (returnNew) {
        return new Vec2(rx, ry);
      } else {
        return this.set(rx, ry);
      }
    },

    // Calculate the length of this vector
//    __cachedLength : null,
    length : function() {
//      if (this.__cachedLength === null) {
//        this._dirty = false
//        var x = this.x, y = this.y;
//        this.__cachedLength =
        return Math.sqrt(x * x + y * y);
//      }
//      return this.__cachedLength
    },

    // Get the length squared. For performance, use this instead of `Vec2#length` (if possible).
//    __cachedLengthSquared : null,
    lengthSquared : function() {
//      if (this.__cachedLengthSquared === null) {
        var x = this.x, y = this.y;
//        this.__cachedLengthSquared = 
//        Vec2.clean(x * x + y * y);
        return x*x+y*y;
//      }
//      return this.__cachedLengthSquared;
    },

    // Return the distance betwen this `Vec2` and the incoming vec2 vector
    // and return a scalar
    distance : function(vec2) {
      var x = this.x - vec2.x;
      var y = this.y - vec2.y;
      return Math.sqrt(x*x + y*y)
//      return this.subtract(vec2, true).length();
    },

    // Convert this vector into a unit vector.
    // Returns the length.
    normalize : function(returnNew) {
      var length = this.length();

      // Collect a ratio to shrink the x and y coords
      var invertedLength = (length < Number.MIN_VALUE) ? 0 : 1/length;

      if (!returnNew) {
        // Convert the coords to be greater than zero
        // but smaller than or equal to 1.0
        return this.set(this.x * invertedLength, this.y * invertedLength);
      } else {
        return new Vec2(this.x * invertedLength, this.y * invertedLength)
      }
    },

    // Determine if another `Vec2`'s components match this one's
    // also accepts 2 scalars
    equal : function(v, w) {
      if (w === undef) {
        return (
          this.x === v.x &&
          this.y == v.y
        );
      } else {
        return (
          this.x === v &&
          this.y === w
        )
      }
    },

    // Return a new `Vec2` that contains the absolute value of
    // each of this vector's parts
    abs : function(returnNew) {
      var x = Math.abs(this.x), y = Math.abs(this.y);

      if (returnNew) {
        return new Vec2(x, y);
      } else {
        return this.set(x, y);
      }
    },

    // Return a new `Vec2` consisting of the smallest values
    // from this vector and the incoming
    //
    // When returnNew is truthy, a new `Vec2` will be returned
    // otherwise the minimum values in either this or `v` will
    // be applied to this vector.
    min : function(v, returnNew) {
      var
      tx = this.x,
      ty = this.y,
      vx = v.x,
      vy = v.y,
      x = tx < vx ? tx : vx,
      y = ty < vy ? ty : vy;

      if (returnNew) {
        return new Vec2(x, y);
      } else {
        return this.set(x, y);
      }
    },

    // Return a new `Vec2` consisting of the largest values
    // from this vector and the incoming
    //
    // When returnNew is truthy, a new `Vec2` will be returned
    // otherwise the minimum values in either this or `v` will
    // be applied to this vector.
    max : function(v, returnNew) {
      var
      tx = this.x,
      ty = this.y,
      vx = v.x,
      vy = v.y,
      x = tx > vx ? tx : vx,
      y = ty > vy ? ty : vy;

      if (returnNew) {
        return new Vec2(x, y);
      } else {
        return this.set(x, y);
      }
    },

    // Clamp values into a range.
    // If this vector's values are lower than the `low`'s
    // values, then raise them.  If they are higher than
    // `high`'s then lower them.
    //
    // Passing returnNew as true will cause a new Vec2 to be
    // returned.  Otherwise, this vector's values will be clamped
    clamp : function(low, high, returnNew) {
      var ret = this.min(high, true).max(low)
      if (returnNew) {
        return ret;
      } else {
        return this.set(ret.x, ret.y);
      }
    },

    // Perform linear interpolation between two vectors
    // amount is a decimal between 0 and 1
    lerp : function(vec, amount) {
      return this.add(vec.subtract(this, true).multiply(amount), true);
    },

    // Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
    skew : function() {
      // Returns a new vector.
      return new Vec2(-this.y, this.x)
    },

    // calculate the dot product between
    // this vector and the incoming
    dot : function(b) {
      return Vec2.clean(this.x * b.x + b.y * this.y);
    },

    // calculate the perpendicular dot product between
    // this vector and the incoming
    perpDot : function(b) {
      return Vec2.clean(this.x * b.y - this.y * b.x)
    },

    // Determine the angle between two vec2s
    angleTo : function(vec) {
      return Math.atan2(this.perpDot(vec), this.dot(vec));
    },

    // Divide this vector's components by a scalar
    divide : function(scalar, returnNew) {
      if (scalar === 0 || isNaN(scalar)) {
        throw new Error('division by zero')
      }

      if (returnNew) {
        return new Vec2(this.x/scalar, this.y/scalar);
      }

      return this.set(this.x / scalar, this.y / scalar);
    },

    toArray: function() {
      return [this.x, this.y];
    },

    fromArray: function(array) {
      return this.set(array[0], array[1]);
    },
    toJSON: function () {
      return {x: this.x, y: this.y}
    }
  };

  Vec2.fromArray = function(array) {
    return new Vec2(array[0], array[1]);
  };

  // Floating point stability
  Vec2.precision = precision || 8;
  var p = Math.pow(10, Vec2.precision)

  Vec2.clean = clean || function(val) {
    if (isNaN(val)) {
      throw new Error('NaN detected')
    }

    if (!isFinite(val)) {
      throw new Error('Infinity detected');
    }

    if(Math.round(val) === val) {
      return val;
    }

    return Math.round(val * p)/p;
  };
  Vec2.inject = inject;

  // Expose, but also allow creating a fresh Vec2 subclass.
  if (typeof module !== 'undefined' && typeof module.exports == 'object') {
    module.exports = Vec2;
  } else {
    window.Vec2 = window.Vec2 || Vec2;
  }
  return Vec2
})();



},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL2Rpc3QuanMiLCIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL3ZlYzIuanMiLCIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL29iamVjdHMuanMiLCIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL3ZlcmxldC5qcyIsIi9Vc2Vycy9kb21pbmljdGFyci9jL3ZlcmxldC1qcy9saWIvY29uc3RyYWludC5qcyIsIi9Vc2Vycy9kb21pbmljdGFyci9jL3ZlcmxldC1qcy9ub2RlX21vZHVsZXMvdmVjMi9saWIvdmVjMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vdGhpcyBleHBvcnRzIGFsbCB0aGUgdmVybGV0IG1ldGhvZHMgZ2xvYmFsbHksIHNvIHRoYXQgdGhlIGRlbW9zIHdvcmsuXG5cbnZhciBWZXJsZXRKUyA9IHJlcXVpcmUoJy4vdmVybGV0JylcbnZhciBjb25zdHJhaW50ID0gcmVxdWlyZSgnLi9jb25zdHJhaW50Jylcblx0XHRcdFx0XHRcdFx0XHQgcmVxdWlyZSgnLi9vYmplY3RzJykgLy9wYXRjaGVzIFZlcmxldEpTLnByb3RvdHlwZSAoYmFkKVxud2luZG93LlZlYzIgPSByZXF1aXJlKCcuL3ZlYzInKVxud2luZG93LlZlcmxldEpTID0gVmVybGV0SlNcblxud2luZG93LlBhcnRpY2xlID0gVmVybGV0SlMuUGFydGljbGVcblxud2luZG93LkRpc3RhbmNlQ29uc3RyYWludCA9IGNvbnN0cmFpbnQuRGlzdGFuY2VDb25zdHJhaW50XG53aW5kb3cuUGluQ29uc3RyYWludCAgICAgID0gY29uc3RyYWludC5QaW5Db25zdHJhaW50XG53aW5kb3cuQW5nbGVDb25zdHJhaW50ICAgID0gY29uc3RyYWludC5BbmdsZUNvbnN0cmFpbnRcblxuXG4iLCJcbi8qXG5Db3B5cmlnaHQgMjAxMyBTdWIgUHJvdG9jb2wgYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuaHR0cDovL3N1YnByb3RvY29sLmNvbS9cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xud2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5wZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbnRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbmluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5NRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5XSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiovXG5cbi8vIEEgc2ltcGxlIDItZGltZW5zaW9uYWwgdmVjdG9yIGltcGxlbWVudGF0aW9uXG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMlxuXG5mdW5jdGlvbiBWZWMyKHgsIHkpIHtcblx0dGhpcy54ID0geCB8fCAwO1xuXHR0aGlzLnkgPSB5IHx8IDA7XG59XG5cblZlYzIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIHYueCwgdGhpcy55ICsgdi55KTtcbn1cblxuVmVjMi5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gbmV3IFZlYzIodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiBuZXcgVmVjMih0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSk7XG59XG5cblZlYzIucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIG5ldyBWZWMyKHRoaXMueCAvIHYueCwgdGhpcy55IC8gdi55KTtcbn1cblxuVmVjMi5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbihjb2VmKSB7XG5cdHJldHVybiBuZXcgVmVjMih0aGlzLngqY29lZiwgdGhpcy55KmNvZWYpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5tdXRhYmxlU2V0ID0gZnVuY3Rpb24odikge1xuXHR0aGlzLnggPSB2Lng7XG5cdHRoaXMueSA9IHYueTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblZlYzIucHJvdG90eXBlLm11dGFibGVBZGQgPSBmdW5jdGlvbih2KSB7XG5cdHRoaXMueCArPSB2Lng7XG5cdHRoaXMueSArPSB2Lnk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5WZWMyLnByb3RvdHlwZS5tdXRhYmxlU3ViID0gZnVuY3Rpb24odikge1xuXHR0aGlzLnggLT0gdi54O1xuXHR0aGlzLnkgLT0gdi55O1xuXHRyZXR1cm4gdGhpcztcbn1cblxuVmVjMi5wcm90b3R5cGUubXV0YWJsZU11bCA9IGZ1bmN0aW9uKHYpIHtcblx0dGhpcy54ICo9IHYueDtcblx0dGhpcy55ICo9IHYueTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblZlYzIucHJvdG90eXBlLm11dGFibGVEaXYgPSBmdW5jdGlvbih2KSB7XG5cdHRoaXMueCAvPSB2Lng7XG5cdHRoaXMueSAvPSB2Lnk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5WZWMyLnByb3RvdHlwZS5tdXRhYmxlU2NhbGUgPSBmdW5jdGlvbihjb2VmKSB7XG5cdHRoaXMueCAqPSBjb2VmO1xuXHR0aGlzLnkgKj0gY29lZjtcblx0cmV0dXJuIHRoaXM7XG59XG5cblZlYzIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIHRoaXMueCA9PSB2LnggJiYgdGhpcy55ID09IHYueTtcbn1cblxuVmVjMi5wcm90b3R5cGUuZXBzaWxvbkVxdWFscyA9IGZ1bmN0aW9uKHYsIGVwc2lsb24pIHtcblx0cmV0dXJuIE1hdGguYWJzKHRoaXMueCAtIHYueCkgPD0gZXBzaWxvbiAmJiBNYXRoLmFicyh0aGlzLnkgLSB2LnkpIDw9IGVwc2lsb247XG59XG5cblZlYzIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIE1hdGguc3FydCh0aGlzLngqdGhpcy54ICsgdGhpcy55KnRoaXMueSk7XG59XG5cblZlYzIucHJvdG90eXBlLmxlbmd0aDIgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiB0aGlzLngqdGhpcy54ICsgdGhpcy55KnRoaXMueTtcbn1cblxuVmVjMi5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIE1hdGguc3FydCh0aGlzLmRpc3QyKHYpKTtcbn1cblxuVmVjMi5wcm90b3R5cGUuZGlzdDIgPSBmdW5jdGlvbih2KSB7XG5cdHZhciB4ID0gdi54IC0gdGhpcy54O1xuXHR2YXIgeSA9IHYueSAtIHRoaXMueTtcblx0cmV0dXJuIHgqeCArIHkqeTtcbn1cblxuVmVjMi5wcm90b3R5cGUubm9ybWFsID0gZnVuY3Rpb24oKSB7XG5cdHZhciBtID0gTWF0aC5zcXJ0KHRoaXMueCp0aGlzLnggKyB0aGlzLnkqdGhpcy55KTtcblx0cmV0dXJuIG5ldyBWZWMyKHRoaXMueC9tLCB0aGlzLnkvbSk7XG59XG5cblZlYzIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIHRoaXMueCp2LnggKyB0aGlzLnkqdi55O1xufVxuXG5WZWMyLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIE1hdGguYXRhbjIodGhpcy54KnYueS10aGlzLnkqdi54LHRoaXMueCp2LngrdGhpcy55KnYueSk7XG59XG5cblZlYzIucHJvdG90eXBlLmFuZ2xlMiA9IGZ1bmN0aW9uKHZMZWZ0LCB2UmlnaHQpIHtcblx0cmV0dXJuIHZMZWZ0LnN1Yih0aGlzKS5hbmdsZSh2UmlnaHQuc3ViKHRoaXMpKTtcbn1cblxuVmVjMi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24ob3JpZ2luLCB0aGV0YSkge1xuXHR2YXIgeCA9IHRoaXMueCAtIG9yaWdpbi54O1xuXHR2YXIgeSA9IHRoaXMueSAtIG9yaWdpbi55O1xuXHRyZXR1cm4gbmV3IFZlYzIoeCpNYXRoLmNvcyh0aGV0YSkgLSB5Kk1hdGguc2luKHRoZXRhKSArIG9yaWdpbi54LCB4Kk1hdGguc2luKHRoZXRhKSArIHkqTWF0aC5jb3ModGhldGEpICsgb3JpZ2luLnkpO1xufVxuXG5WZWMyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gXCIoXCIgKyB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIilcIjtcbn1cblxuZnVuY3Rpb24gdGVzdF9WZWMyKCkge1xuXHR2YXIgYXNzZXJ0ID0gZnVuY3Rpb24obGFiZWwsIGV4cHJlc3Npb24pIHtcblx0XHRjb25zb2xlLmxvZyhcIlZlYzIoXCIgKyBsYWJlbCArIFwiKTogXCIgKyAoZXhwcmVzc2lvbiA9PSB0cnVlID8gXCJQQVNTXCIgOiBcIkZBSUxcIikpO1xuXHRcdGlmIChleHByZXNzaW9uICE9IHRydWUpXG5cdFx0XHR0aHJvdyBcImFzc2VydGlvbiBmYWlsZWRcIjtcblx0fTtcblx0XG5cdGFzc2VydChcImVxdWFsaXR5XCIsIChuZXcgVmVjMig1LDMpLmVxdWFscyhuZXcgVmVjMig1LDMpKSkpO1xuXHRhc3NlcnQoXCJlcHNpbG9uIGVxdWFsaXR5XCIsIChuZXcgVmVjMigxLDIpLmVwc2lsb25FcXVhbHMobmV3IFZlYzIoMS4wMSwyLjAyKSwgMC4wMykpKTtcblx0YXNzZXJ0KFwiZXBzaWxvbiBub24tZXF1YWxpdHlcIiwgIShuZXcgVmVjMigxLDIpLmVwc2lsb25FcXVhbHMobmV3IFZlYzIoMS4wMSwyLjAyKSwgMC4wMSkpKTtcblx0YXNzZXJ0KFwiYWRkaXRpb25cIiwgKG5ldyBWZWMyKDEsMSkpLmFkZChuZXcgVmVjMigyLCAzKSkuZXF1YWxzKG5ldyBWZWMyKDMsIDQpKSk7XG5cdGFzc2VydChcInN1YnRyYWN0aW9uXCIsIChuZXcgVmVjMig0LDMpKS5zdWIobmV3IFZlYzIoMiwgMSkpLmVxdWFscyhuZXcgVmVjMigyLCAyKSkpO1xuXHRhc3NlcnQoXCJtdWx0aXBseVwiLCAobmV3IFZlYzIoMiw0KSkubXVsKG5ldyBWZWMyKDIsIDEpKS5lcXVhbHMobmV3IFZlYzIoNCwgNCkpKTtcblx0YXNzZXJ0KFwiZGl2aWRlXCIsIChuZXcgVmVjMig0LDIpKS5kaXYobmV3IFZlYzIoMiwgMikpLmVxdWFscyhuZXcgVmVjMigyLCAxKSkpO1xuXHRhc3NlcnQoXCJzY2FsZVwiLCAobmV3IFZlYzIoNCwzKSkuc2NhbGUoMikuZXF1YWxzKG5ldyBWZWMyKDgsIDYpKSk7XG5cdGFzc2VydChcIm11dGFibGUgc2V0XCIsIChuZXcgVmVjMigxLDEpKS5tdXRhYmxlU2V0KG5ldyBWZWMyKDIsIDMpKS5lcXVhbHMobmV3IFZlYzIoMiwgMykpKTtcblx0YXNzZXJ0KFwibXV0YWJsZSBhZGRpdGlvblwiLCAobmV3IFZlYzIoMSwxKSkubXV0YWJsZUFkZChuZXcgVmVjMigyLCAzKSkuZXF1YWxzKG5ldyBWZWMyKDMsIDQpKSk7XG5cdGFzc2VydChcIm11dGFibGUgc3VidHJhY3Rpb25cIiwgKG5ldyBWZWMyKDQsMykpLm11dGFibGVTdWIobmV3IFZlYzIoMiwgMSkpLmVxdWFscyhuZXcgVmVjMigyLCAyKSkpO1xuXHRhc3NlcnQoXCJtdXRhYmxlIG11bHRpcGx5XCIsIChuZXcgVmVjMigyLDQpKS5tdXRhYmxlTXVsKG5ldyBWZWMyKDIsIDEpKS5lcXVhbHMobmV3IFZlYzIoNCwgNCkpKTtcblx0YXNzZXJ0KFwibXV0YWJsZSBkaXZpZGVcIiwgKG5ldyBWZWMyKDQsMikpLm11dGFibGVEaXYobmV3IFZlYzIoMiwgMikpLmVxdWFscyhuZXcgVmVjMigyLCAxKSkpO1xuXHRhc3NlcnQoXCJtdXRhYmxlIHNjYWxlXCIsIChuZXcgVmVjMig0LDMpKS5tdXRhYmxlU2NhbGUoMikuZXF1YWxzKG5ldyBWZWMyKDgsIDYpKSk7XG5cdGFzc2VydChcImxlbmd0aFwiLCBNYXRoLmFicygobmV3IFZlYzIoNCw0KSkubGVuZ3RoKCkgLSA1LjY1Njg1KSA8PSAwLjAwMDAxKTtcblx0YXNzZXJ0KFwibGVuZ3RoMlwiLCAobmV3IFZlYzIoMiw0KSkubGVuZ3RoMigpID09IDIwKTtcblx0YXNzZXJ0KFwiZGlzdFwiLCBNYXRoLmFicygobmV3IFZlYzIoMiw0KSkuZGlzdChuZXcgVmVjMigzLDUpKSAtIDEuNDE0MjEzNSkgPD0gMC4wMDAwMDEpO1xuXHRhc3NlcnQoXCJkaXN0MlwiLCAobmV3IFZlYzIoMiw0KSkuZGlzdDIobmV3IFZlYzIoMyw1KSkgPT0gMik7XG5cblx0dmFyIG5vcm1hbCA9IChuZXcgVmVjMigyLDQpKS5ub3JtYWwoKVxuXHRhc3NlcnQoXCJub3JtYWxcIiwgTWF0aC5hYnMobm9ybWFsLmxlbmd0aCgpIC0gMS4wKSA8PSAwLjAwMDAxICYmIG5vcm1hbC5lcHNpbG9uRXF1YWxzKG5ldyBWZWMyKDAuNDQ3MiwgMC44OTQ0MyksIDAuMDAwMSkpO1xuXHRhc3NlcnQoXCJkb3RcIiwgKG5ldyBWZWMyKDIsMykpLmRvdChuZXcgVmVjMig0LDEpKSA9PSAxMSk7XG5cdGFzc2VydChcImFuZ2xlXCIsIChuZXcgVmVjMigwLC0xKSkuYW5nbGUobmV3IFZlYzIoMSwwKSkqKDE4MC9NYXRoLlBJKSA9PSA5MCk7XG5cdGFzc2VydChcImFuZ2xlMlwiLCAobmV3IFZlYzIoMSwxKSkuYW5nbGUyKG5ldyBWZWMyKDEsMCksIG5ldyBWZWMyKDIsMSkpKigxODAvTWF0aC5QSSkgPT0gOTApO1xuXHRhc3NlcnQoXCJyb3RhdGVcIiwgKG5ldyBWZWMyKDIsMCkpLnJvdGF0ZShuZXcgVmVjMigxLDApLCBNYXRoLlBJLzIpLmVxdWFscyhuZXcgVmVjMigxLDEpKSk7XG5cdGFzc2VydChcInRvU3RyaW5nXCIsIChuZXcgVmVjMigyLDQpKSA9PSBcIigyLCA0KVwiKTtcbn1cblxuIiwiXG4vKlxuQ29weXJpZ2h0IDIwMTMgU3ViIFByb3RvY29sIGFuZCBvdGhlciBjb250cmlidXRvcnNcbmh0dHA6Ly9zdWJwcm90b2NvbC5jb20vXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbk5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbkxJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbk9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG4vLyBnZW5lcmljIHZlcmxldCBlbnRpdGllc1xuXG52YXIgVmVybGV0SlMgPSByZXF1aXJlKCcuL3ZlcmxldCcpXG52YXIgUGFydGljbGUgPSBWZXJsZXRKUy5QYXJ0aWNsZVxudmFyIGNvbnN0cmFpbnRzID0gcmVxdWlyZSgnLi9jb25zdHJhaW50JylcbnZhciBEaXN0YW5jZUNvbnN0cmFpbnQgPSBjb25zdHJhaW50cy5EaXN0YW5jZUNvbnN0cmFpbnRcblxuVmVybGV0SlMucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24ocG9zKSB7XG4gIHZhciBjb21wb3NpdGUgPSBuZXcgdGhpcy5Db21wb3NpdGUoKTtcbiAgY29tcG9zaXRlLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZShwb3MpKTtcbiAgdGhpcy5jb21wb3NpdGVzLnB1c2goY29tcG9zaXRlKTtcbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn1cblxuVmVybGV0SlMucHJvdG90eXBlLmxpbmVTZWdtZW50cyA9IGZ1bmN0aW9uKHZlcnRpY2VzLCBzdGlmZm5lc3MpIHtcbiAgdmFyIGk7XG4gIFxuICB2YXIgY29tcG9zaXRlID0gbmV3IHRoaXMuQ29tcG9zaXRlKCk7XG4gIFxuICBmb3IgKGkgaW4gdmVydGljZXMpIHtcbiAgICBjb21wb3NpdGUucGFydGljbGVzLnB1c2gobmV3IFBhcnRpY2xlKHZlcnRpY2VzW2ldKSk7XG4gICAgaWYgKGkgPiAwKVxuICAgICAgY29tcG9zaXRlLmNvbnN0cmFpbnRzLnB1c2gobmV3IERpc3RhbmNlQ29uc3RyYWludChjb21wb3NpdGUucGFydGljbGVzW2ldLCBjb21wb3NpdGUucGFydGljbGVzW2ktMV0sIHN0aWZmbmVzcykpO1xuICB9XG4gIFxuICB0aGlzLmNvbXBvc2l0ZXMucHVzaChjb21wb3NpdGUpO1xuICByZXR1cm4gY29tcG9zaXRlO1xufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUuY2xvdGggPSBmdW5jdGlvbihvcmlnaW4sIHdpZHRoLCBoZWlnaHQsIHNlZ21lbnRzLCBwaW5Nb2QsIHN0aWZmbmVzcykge1xuICBcbiAgdmFyIGNvbXBvc2l0ZSA9IG5ldyB0aGlzLkNvbXBvc2l0ZSgpO1xuICBcbiAgdmFyIHhTdHJpZGUgPSB3aWR0aC9zZWdtZW50cztcbiAgdmFyIHlTdHJpZGUgPSBoZWlnaHQvc2VnbWVudHM7XG4gIFxuICB2YXIgeCx5O1xuICBmb3IgKHk9MDt5PHNlZ21lbnRzOysreSkge1xuICAgIGZvciAoeD0wO3g8c2VnbWVudHM7Kyt4KSB7XG4gICAgICB2YXIgcHggPSBvcmlnaW4ueCArIHgqeFN0cmlkZSAtIHdpZHRoLzIgKyB4U3RyaWRlLzI7XG4gICAgICB2YXIgcHkgPSBvcmlnaW4ueSArIHkqeVN0cmlkZSAtIGhlaWdodC8yICsgeVN0cmlkZS8yO1xuICAgICAgY29tcG9zaXRlLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZShuZXcgVmVjMihweCwgcHkpKSk7XG4gICAgICBcbiAgICAgIGlmICh4ID4gMClcbiAgICAgICAgY29tcG9zaXRlLmNvbnN0cmFpbnRzLnB1c2gobmV3IERpc3RhbmNlQ29uc3RyYWludChjb21wb3NpdGUucGFydGljbGVzW3kqc2VnbWVudHMreF0sIGNvbXBvc2l0ZS5wYXJ0aWNsZXNbeSpzZWdtZW50cyt4LTFdLCBzdGlmZm5lc3MpKTtcbiAgICAgIFxuICAgICAgaWYgKHkgPiAwKVxuICAgICAgICBjb21wb3NpdGUuY29uc3RyYWludHMucHVzaChuZXcgRGlzdGFuY2VDb25zdHJhaW50KGNvbXBvc2l0ZS5wYXJ0aWNsZXNbeSpzZWdtZW50cyt4XSwgY29tcG9zaXRlLnBhcnRpY2xlc1soeS0xKSpzZWdtZW50cyt4XSwgc3RpZmZuZXNzKSk7XG4gICAgfVxuICB9XG4gIFxuICBmb3IgKHg9MDt4PHNlZ21lbnRzOysreCkge1xuICAgIGlmICh4JXBpbk1vZCA9PSAwKVxuICAgIGNvbXBvc2l0ZS5waW4oeCk7XG4gIH1cbiAgXG4gIHRoaXMuY29tcG9zaXRlcy5wdXNoKGNvbXBvc2l0ZSk7XG4gIHJldHVybiBjb21wb3NpdGU7XG59XG5cblZlcmxldEpTLnByb3RvdHlwZS50aXJlID0gZnVuY3Rpb24ob3JpZ2luLCByYWRpdXMsIHNlZ21lbnRzLCBzcG9rZVN0aWZmbmVzcywgdHJlYWRTdGlmZm5lc3MpIHtcbiAgdmFyIHN0cmlkZSA9ICgyKk1hdGguUEkpL3NlZ21lbnRzO1xuICB2YXIgaTtcbiAgXG4gIHZhciBjb21wb3NpdGUgPSBuZXcgdGhpcy5Db21wb3NpdGUoKTtcbiAgXG4gIC8vIHBhcnRpY2xlc1xuICBmb3IgKGk9MDtpPHNlZ21lbnRzOysraSkge1xuICAgIHZhciB0aGV0YSA9IGkqc3RyaWRlO1xuICAgIGNvbXBvc2l0ZS5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUobmV3IFZlYzIob3JpZ2luLnggKyBNYXRoLmNvcyh0aGV0YSkqcmFkaXVzLCBvcmlnaW4ueSArIE1hdGguc2luKHRoZXRhKSpyYWRpdXMpKSk7XG4gIH1cbiAgXG4gIHZhciBjZW50ZXIgPSBuZXcgUGFydGljbGUob3JpZ2luKTtcbiAgY29tcG9zaXRlLnBhcnRpY2xlcy5wdXNoKGNlbnRlcik7XG4gIFxuICAvLyBjb25zdHJhaW50c1xuICBmb3IgKGk9MDtpPHNlZ21lbnRzOysraSkge1xuICAgIGNvbXBvc2l0ZS5jb25zdHJhaW50cy5wdXNoKG5ldyBEaXN0YW5jZUNvbnN0cmFpbnQoY29tcG9zaXRlLnBhcnRpY2xlc1tpXSwgY29tcG9zaXRlLnBhcnRpY2xlc1soaSsxKSVzZWdtZW50c10sIHRyZWFkU3RpZmZuZXNzKSk7XG4gICAgY29tcG9zaXRlLmNvbnN0cmFpbnRzLnB1c2gobmV3IERpc3RhbmNlQ29uc3RyYWludChjb21wb3NpdGUucGFydGljbGVzW2ldLCBjZW50ZXIsIHNwb2tlU3RpZmZuZXNzKSlcbiAgICBjb21wb3NpdGUuY29uc3RyYWludHMucHVzaChuZXcgRGlzdGFuY2VDb25zdHJhaW50KGNvbXBvc2l0ZS5wYXJ0aWNsZXNbaV0sIGNvbXBvc2l0ZS5wYXJ0aWNsZXNbKGkrNSklc2VnbWVudHNdLCB0cmVhZFN0aWZmbmVzcykpO1xuICB9XG4gICAgXG4gIHRoaXMuY29tcG9zaXRlcy5wdXNoKGNvbXBvc2l0ZSk7XG4gIHJldHVybiBjb21wb3NpdGU7XG59XG5cbiIsIlxuLypcbkNvcHlyaWdodCAyMDEzIFN1YiBQcm90b2NvbCBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG5odHRwOi8vc3VicHJvdG9jb2wuY29tL1xuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbmEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG53aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5kaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbnBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xudGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5FWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbk1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5OT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG5MSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5PRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbldJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuKi9cblxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG58fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG58fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG58fCB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZVxufHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG58fCBmdW5jdGlvbihjYWxsYmFjaykge1xuICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbn07XG5cbnZhciBWZWMyID0gcmVxdWlyZSgndmVjMicpXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFZlcmxldEpTXG5leHBvcnRzLlBhcnRpY2xlID0gUGFydGljbGVcbmV4cG9ydHMuQ29tcG9zaXRlID0gQ29tcG9zaXRlXG5cbmZ1bmN0aW9uIFBhcnRpY2xlKHBvcykge1xuICB0aGlzLnBvcyA9IG5ldyBWZWMyKHBvcyk7XG4gIHRoaXMubGFzdFBvcyA9IG5ldyBWZWMyKHBvcyk7XG59XG5cblBhcnRpY2xlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LmFyYyh0aGlzLnBvcy54LCB0aGlzLnBvcy55LCAyLCAwLCAyKk1hdGguUEkpO1xuICBjdHguZmlsbFN0eWxlID0gXCIjMmRhZDhmXCI7XG4gIGN0eC5maWxsKCk7XG59XG5cbmZ1bmN0aW9uIFZlcmxldEpTKHdpZHRoLCBoZWlnaHQsIGNhbnZhcykge1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICB0aGlzLm1vdXNlID0gbmV3IFZlYzIoMCwwKTtcbiAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgdGhpcy5kcmFnZ2VkRW50aXR5ID0gbnVsbDtcbiAgdGhpcy5zZWxlY3Rpb25SYWRpdXMgPSAyMDtcbiAgdGhpcy5oaWdobGlnaHRDb2xvciA9IFwiIzRmNTQ1Y1wiO1xuICBcbiAgdGhpcy5ib3VuZHMgPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICBpZiAocGFydGljbGUucG9zLnkgPiB0aGlzLmhlaWdodC0xKVxuICAgICAgcGFydGljbGUucG9zLnkgPSB0aGlzLmhlaWdodC0xO1xuICAgIFxuICAgIGlmIChwYXJ0aWNsZS5wb3MueCA8IDApXG4gICAgICBwYXJ0aWNsZS5wb3MueCA9IDA7XG5cbiAgICBpZiAocGFydGljbGUucG9zLnggPiB0aGlzLndpZHRoLTEpXG4gICAgICBwYXJ0aWNsZS5wb3MueCA9IHRoaXMud2lkdGgtMTtcbiAgfVxuICBcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgXG4gIC8vIHByZXZlbnQgY29udGV4dCBtZW51XG4gIHRoaXMuY2FudmFzLm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuICBcbiAgdGhpcy5jYW52YXMub25tb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgX3RoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICB2YXIgbmVhcmVzdCA9IF90aGlzLm5lYXJlc3RFbnRpdHkoKTtcbiAgICBpZiAobmVhcmVzdCkge1xuICAgICAgX3RoaXMuZHJhZ2dlZEVudGl0eSA9IG5lYXJlc3Q7XG4gICAgfVxuICB9O1xuICBcbiAgdGhpcy5jYW52YXMub25tb3VzZXVwID0gZnVuY3Rpb24oZSkge1xuICAgIF90aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIF90aGlzLmRyYWdnZWRFbnRpdHkgPSBudWxsO1xuICB9O1xuICBcbiAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHJlY3QgPSBfdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgX3RoaXMubW91c2UueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBfdGhpcy5tb3VzZS55ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gIH07ICBcbiAgXG4gIC8vIHNpbXVsYXRpb24gcGFyYW1zXG4gIHRoaXMuZ3Jhdml0eSA9IG5ldyBWZWMyKDAsMC4yKTtcbiAgdGhpcy5mcmljdGlvbiA9IDAuOTk7XG4gIHRoaXMuZ3JvdW5kRnJpY3Rpb24gPSAwLjg7XG4gIFxuICAvLyBob2xkcyBjb21wb3NpdGUgZW50aXRpZXNcbiAgdGhpcy5jb21wb3NpdGVzID0gW107XG59XG5cblZlcmxldEpTLnByb3RvdHlwZS5Db21wb3NpdGUgPSBDb21wb3NpdGVcblxuZnVuY3Rpb24gQ29tcG9zaXRlKCkge1xuICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xuICB0aGlzLmNvbnN0cmFpbnRzID0gW107XG4gIFxuICB0aGlzLmRyYXdQYXJ0aWNsZXMgPSBudWxsO1xuICB0aGlzLmRyYXdDb25zdHJhaW50cyA9IG51bGw7XG59XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUucGluID0gZnVuY3Rpb24oaW5kZXgsIHBvcykge1xuICBwb3MgPSBwb3MgfHwgdGhpcy5wYXJ0aWNsZXNbaW5kZXhdLnBvcztcbiAgdmFyIHBjID0gbmV3IFBpbkNvbnN0cmFpbnQodGhpcy5wYXJ0aWNsZXNbaW5kZXhdLCBwb3MpO1xuICB0aGlzLmNvbnN0cmFpbnRzLnB1c2gocGMpO1xuICByZXR1cm4gcGM7XG59XG5cblZlcmxldEpTLnByb3RvdHlwZS5mcmFtZSA9IGZ1bmN0aW9uKHN0ZXApIHtcbiAgdmFyIGksIGosIGM7XG5cbiAgZm9yIChjIGluIHRoaXMuY29tcG9zaXRlcykge1xuICAgIGZvciAoaSBpbiB0aGlzLmNvbXBvc2l0ZXNbY10ucGFydGljbGVzKSB7XG4gICAgICB2YXIgcGFydGljbGVzID0gdGhpcy5jb21wb3NpdGVzW2NdLnBhcnRpY2xlcztcbiAgICAgIFxuICAgICAgLy8gY2FsY3VsYXRlIHZlbG9jaXR5XG4gICAgICB2YXIgdmVsb2NpdHkgPSBwYXJ0aWNsZXNbaV0ucG9zXG4gICAgICAgICAgLnN1YnRyYWN0KHBhcnRpY2xlc1tpXS5sYXN0UG9zLCB0cnVlKVxuICAgICAgICAgIC5tdWx0aXBseSh0aGlzLmZyaWN0aW9uKTtcbiAgXG4gICAgICAvLyBncm91bmQgZnJpY3Rpb25cbiAgICAgIGlmIChwYXJ0aWNsZXNbaV0ucG9zLnkgPj0gdGhpcy5oZWlnaHQtMSAmJiB2ZWxvY2l0eS5sZW5ndGhTcXVhcmVkKCkgPiAwLjAwMDAwMSkge1xuICAgICAgICB2YXIgbSA9IHZlbG9jaXR5Lmxlbmd0aCgpO1xuICAgICAgICB2ZWxvY2l0eS54IC89IG07XG4gICAgICAgIHZlbG9jaXR5LnkgLz0gbTtcbiAgICAgICAgdmVsb2NpdHkubXVsdGlwbHkobSp0aGlzLmdyb3VuZEZyaWN0aW9uKTtcbiAgICAgIH1cbiAgICBcbiAgICAgIC8vIHNhdmUgbGFzdCBnb29kIHN0YXRlXG4gICAgICBwYXJ0aWNsZXNbaV0ubGFzdFBvcy5zZXQocGFydGljbGVzW2ldLnBvcyk7XG4gICAgXG4gICAgICAvLyBncmF2aXR5XG4gICAgICBwYXJ0aWNsZXNbaV0ucG9zLmFkZCh0aGlzLmdyYXZpdHkpO1xuICAgIFxuICAgICAgLy8gaW5lcnRpYSAgXG4gICAgICBwYXJ0aWNsZXNbaV0ucG9zLmFkZCh2ZWxvY2l0eSk7XG4gICAgfVxuICB9XG4gIFxuICAvLyBoYW5kbGUgZHJhZ2dpbmcgb2YgZW50aXRpZXNcbiAgaWYgKHRoaXMuZHJhZ2dlZEVudGl0eSlcbiAgICB0aGlzLmRyYWdnZWRFbnRpdHkucG9zLnNldCh0aGlzLm1vdXNlKTtcbiAgICBcbiAgLy8gcmVsYXhcbiAgdmFyIHN0ZXBDb2VmID0gMS9zdGVwO1xuICBmb3IgKGMgaW4gdGhpcy5jb21wb3NpdGVzKSB7XG4gICAgdmFyIGNvbnN0cmFpbnRzID0gdGhpcy5jb21wb3NpdGVzW2NdLmNvbnN0cmFpbnRzO1xuICAgIGZvciAoaT0wO2k8c3RlcDsrK2kpXG4gICAgICBmb3IgKGogaW4gY29uc3RyYWludHMpXG4gICAgICAgIGNvbnN0cmFpbnRzW2pdLnJlbGF4KHN0ZXBDb2VmKTtcbiAgfVxuICBcbiAgLy8gYm91bmRzIGNoZWNraW5nXG4gIGZvciAoYyBpbiB0aGlzLmNvbXBvc2l0ZXMpIHtcbiAgICB2YXIgcGFydGljbGVzID0gdGhpcy5jb21wb3NpdGVzW2NdLnBhcnRpY2xlcztcbiAgICBmb3IgKGkgaW4gcGFydGljbGVzKVxuICAgICAgdGhpcy5ib3VuZHMocGFydGljbGVzW2ldKTtcbiAgfVxufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaSwgYztcbiAgXG4gIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTsgIFxuICBcbiAgZm9yIChjIGluIHRoaXMuY29tcG9zaXRlcykge1xuICAgIC8vIGRyYXcgY29uc3RyYWludHNcbiAgICBpZiAodGhpcy5jb21wb3NpdGVzW2NdLmRyYXdDb25zdHJhaW50cykge1xuICAgICAgdGhpcy5jb21wb3NpdGVzW2NdLmRyYXdDb25zdHJhaW50cyh0aGlzLmN0eCwgdGhpcy5jb21wb3NpdGVzW2NdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNvbnN0cmFpbnRzID0gdGhpcy5jb21wb3NpdGVzW2NdLmNvbnN0cmFpbnRzO1xuICAgICAgZm9yIChpIGluIGNvbnN0cmFpbnRzKVxuICAgICAgICBjb25zdHJhaW50c1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICB9XG4gICAgXG4gICAgLy8gZHJhdyBwYXJ0aWNsZXNcbiAgICBpZiAodGhpcy5jb21wb3NpdGVzW2NdLmRyYXdQYXJ0aWNsZXMpIHtcbiAgICAgIHRoaXMuY29tcG9zaXRlc1tjXS5kcmF3UGFydGljbGVzKHRoaXMuY3R4LCB0aGlzLmNvbXBvc2l0ZXNbY10pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGFydGljbGVzID0gdGhpcy5jb21wb3NpdGVzW2NdLnBhcnRpY2xlcztcbiAgICAgIGZvciAoaSBpbiBwYXJ0aWNsZXMpXG4gICAgICAgIHBhcnRpY2xlc1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICB9XG4gIH1cblxuICAvLyBoaWdobGlnaHQgbmVhcmVzdCAvIGRyYWdnZWQgZW50aXR5XG4gIHZhciBuZWFyZXN0ID0gdGhpcy5kcmFnZ2VkRW50aXR5IHx8IHRoaXMubmVhcmVzdEVudGl0eSgpO1xuICBpZiAobmVhcmVzdCkge1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmFyYyhuZWFyZXN0LnBvcy54LCBuZWFyZXN0LnBvcy55LCA4LCAwLCAyKk1hdGguUEkpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5oaWdobGlnaHRDb2xvcjtcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgfVxufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUubmVhcmVzdEVudGl0eSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYywgaTtcbiAgdmFyIGQyTmVhcmVzdCA9IDA7XG4gIHZhciBlbnRpdHkgPSBudWxsO1xuICB2YXIgY29uc3RyYWludHNOZWFyZXN0ID0gbnVsbDtcbiAgXG4gIC8vIGZpbmQgbmVhcmVzdCBwb2ludFxuICBmb3IgKGMgaW4gdGhpcy5jb21wb3NpdGVzKSB7XG4gICAgdmFyIHBhcnRpY2xlcyA9IHRoaXMuY29tcG9zaXRlc1tjXS5wYXJ0aWNsZXM7XG4gICAgZm9yIChpIGluIHBhcnRpY2xlcykge1xuICAgICAgdmFyIGQyID0gcGFydGljbGVzW2ldLnBvcy5kaXN0YW5jZSh0aGlzLm1vdXNlKTtcbiAgICAgIGlmIChkMiA8PSB0aGlzLnNlbGVjdGlvblJhZGl1cyp0aGlzLnNlbGVjdGlvblJhZGl1cyAmJiAoZW50aXR5ID09IG51bGwgfHwgZDIgPCBkMk5lYXJlc3QpKSB7XG4gICAgICAgIGVudGl0eSA9IHBhcnRpY2xlc1tpXTtcbiAgICAgICAgY29uc3RyYWludHNOZWFyZXN0ID0gdGhpcy5jb21wb3NpdGVzW2NdLmNvbnN0cmFpbnRzO1xuICAgICAgICBkMk5lYXJlc3QgPSBkMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8vIHNlYXJjaCBmb3IgcGlubmVkIGNvbnN0cmFpbnRzIGZvciB0aGlzIGVudGl0eVxuICBmb3IgKGkgaW4gY29uc3RyYWludHNOZWFyZXN0KVxuICAgIGlmIChjb25zdHJhaW50c05lYXJlc3RbaV0gaW5zdGFuY2VvZiBQaW5Db25zdHJhaW50ICYmIGNvbnN0cmFpbnRzTmVhcmVzdFtpXS5hID09IGVudGl0eSlcbiAgICAgIGVudGl0eSA9IGNvbnN0cmFpbnRzTmVhcmVzdFtpXTtcbiAgXG4gIHJldHVybiBlbnRpdHk7XG59XG5cbiIsIlxuLypcbkNvcHlyaWdodCAyMDEzIFN1YiBQcm90b2NvbCBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG5odHRwOi8vc3VicHJvdG9jb2wuY29tL1xuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbmEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG53aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5kaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbnBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xudGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5FWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbk1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5OT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG5MSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5PRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbldJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuKi9cblxuLy8gRGlzdGFuY2VDb25zdHJhaW50IC0tIGNvbnN0cmFpbnMgdG8gaW5pdGlhbCBkaXN0YW5jZVxuLy8gUGluQ29uc3RyYWludCAtLSBjb25zdHJhaW5zIHRvIHN0YXRpYy9maXhlZCBwb2ludFxuLy8gQW5nbGVDb25zdHJhaW50IC0tIGNvbnN0cmFpbnMgMyBwYXJ0aWNsZXMgdG8gYW4gYW5nbGVcblxudmFyIFZlYzIgPSByZXF1aXJlKCd2ZWMyJylcblxuZXhwb3J0cy5EaXN0YW5jZUNvbnN0cmFpbnQgPSBEaXN0YW5jZUNvbnN0cmFpbnRcbmV4cG9ydHMuUGluQ29uc3RyYWludCA9IFBpbkNvbnN0cmFpbnRcbmV4cG9ydHMuQW5nbGVDb25zdHJhaW50ID0gQW5nbGVDb25zdHJhaW50XG5cbmZ1bmN0aW9uIERpc3RhbmNlQ29uc3RyYWludChhLCBiLCBzdGlmZm5lc3MsIGRpc3RhbmNlIC8qb3B0aW9uYWwqLykge1xuICB0aGlzLmEgPSBhO1xuICB0aGlzLmIgPSBiO1xuICB0aGlzLmRpc3RhbmNlID0gdHlwZW9mIGRpc3RhbmNlICE9IFwidW5kZWZpbmVkXCIgPyBkaXN0YW5jZSA6IGEucG9zLmRpc3RhbmNlKGIucG9zKTtcbiAgdGhpcy5zdGlmZm5lc3MgPSBzdGlmZm5lc3M7XG4gIHRoaXMubm9ybWFsID0gdGhpcy5hLnBvcy5zdWJ0cmFjdCh0aGlzLmIucG9zLCB0cnVlKVxufVxuXG5EaXN0YW5jZUNvbnN0cmFpbnQucHJvdG90eXBlLnJlbGF4ID0gZnVuY3Rpb24oc3RlcENvZWYpIHtcbiAgdmFyIGEgPSB0aGlzLmEucG9zXG4gIHZhciBiID0gdGhpcy5iLnBvc1xuICB2YXIgbm9ybWFsID0gdGhpcy5ub3JtYWwuc2V0KGEueCAtIGIueCwgYS55IC0gYi55KVxuICAvLy5zdWJ0cmFjdCh0aGlzLmIucG9zKTtcbiAgdmFyIG0gPSBub3JtYWwubGVuZ3RoU3F1YXJlZCgpO1xuICBub3JtYWwubXVsdGlwbHkoKCh0aGlzLmRpc3RhbmNlKnRoaXMuZGlzdGFuY2UgLSBtKS9tKSp0aGlzLnN0aWZmbmVzcypzdGVwQ29lZik7XG4gIHRoaXMuYS5wb3MuYWRkKG5vcm1hbCk7XG4gIHRoaXMuYi5wb3Muc3VidHJhY3Qobm9ybWFsKTtcbn1cblxuRGlzdGFuY2VDb25zdHJhaW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4Lm1vdmVUbyh0aGlzLmEucG9zLngsIHRoaXMuYS5wb3MueSk7XG4gIGN0eC5saW5lVG8odGhpcy5iLnBvcy54LCB0aGlzLmIucG9zLnkpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBcIiNkOGRkZTJcIjtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5cbmZ1bmN0aW9uIFBpbkNvbnN0cmFpbnQoYSwgcG9zKSB7XG4gIHRoaXMuYSA9IGE7XG4gIHRoaXMucG9zID0gKG5ldyBWZWMyKCkpLnNldChwb3MpO1xufVxuXG5QaW5Db25zdHJhaW50LnByb3RvdHlwZS5yZWxheCA9IGZ1bmN0aW9uKHN0ZXBDb2VmKSB7XG4gIHRoaXMuYS5wb3Muc2V0KHRoaXMucG9zKTtcbn1cblxuUGluQ29uc3RyYWludC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5hcmModGhpcy5wb3MueCwgdGhpcy5wb3MueSwgNiwgMCwgMipNYXRoLlBJKTtcbiAgY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLDE1MywyNTUsMC4xKVwiO1xuICBjdHguZmlsbCgpO1xufVxuXG5cbmZ1bmN0aW9uIEFuZ2xlQ29uc3RyYWludChhLCBiLCBjLCBzdGlmZm5lc3MpIHtcbiAgdGhpcy5hID0gYTtcbiAgdGhpcy5iID0gYjtcbiAgdGhpcy5jID0gYztcbiAgdGhpcy5hbmdsZSA9IHRoaXMuYi5wb3MuYW5nbGVUbyh0aGlzLmEucG9zLCB0aGlzLmMucG9zKTtcbiAgdGhpcy5zdGlmZm5lc3MgPSBzdGlmZm5lc3M7XG59XG5cbmZ1bmN0aW9uIGFuZ2xlMihhLCBiLCBjKSB7XG4gIGIuc3ViKGEsIHRydWUpLmFuZ2xlVG8oYylcbn1cblxuZnVuY3Rpb24gcm90YXRlKHNlbGYsIG9yaWdpbiwgdGhldGEpIHtcbiAgdmFyIHggPSBzZWxmLnggLSBvcmlnaW4ueDtcbiAgdmFyIHkgPSBzZWxmLnkgLSBvcmlnaW4ueTtcbiAgcmV0dXJuIG5ldyBWZWMyKHgqTWF0aC5jb3ModGhldGEpIC0geSpNYXRoLnNpbih0aGV0YSkgKyBvcmlnaW4ueCwgeCpNYXRoLnNpbih0aGV0YSkgKyB5Kk1hdGguY29zKHRoZXRhKSArIG9yaWdpbi55KTtcbn1cblxuQW5nbGVDb25zdHJhaW50LnByb3RvdHlwZS5yZWxheCA9IGZ1bmN0aW9uKHN0ZXBDb2VmKSB7XG4gIHZhciBhbmdsZSA9IGFuZ2xlMih0aGlzLmIucG9zLCB0aGlzLmEucG9zLCB0aGlzLmMucG9zKVxuICAvL3RoaXMuYi5wb3MuYW5nbGUyKHRoaXMuYS5wb3MsIHRoaXMuYy5wb3MpO1xuICB2YXIgZGlmZiA9IGFuZ2xlIC0gdGhpcy5hbmdsZTtcbiAgXG4gIGlmIChkaWZmIDw9IC1NYXRoLlBJKVxuICAgIGRpZmYgKz0gMipNYXRoLlBJO1xuICBlbHNlIGlmIChkaWZmID49IE1hdGguUEkpXG4gICAgZGlmZiAtPSAyKk1hdGguUEk7XG5cbiAgZGlmZiAqPSBzdGVwQ29lZip0aGlzLnN0aWZmbmVzcztcbiAgXG4gIHRoaXMuYS5wb3MgPSByb3RhdGUodGhpcy5hLnBvcywgdGhpcy5iLnBvcywgZGlmZik7XG4gIHRoaXMuYy5wb3MgPSByb3RhdGUodGhpcy5jLnBvcywgdGhpcy5iLnBvcywgLWRpZmYpO1xuICB0aGlzLmIucG9zID0gcm90YXRlKHRoaXMuYi5wb3MsIHRoaXMuYS5wb3MsIGRpZmYpO1xuICB0aGlzLmIucG9zID0gcm90YXRlKHRoaXMuYi5wb3MsIHRoaXMuYy5wb3MsIC1kaWZmKTtcbn1cblxuQW5nbGVDb25zdHJhaW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4Lm1vdmVUbyh0aGlzLmEucG9zLngsIHRoaXMuYS5wb3MueSk7XG4gIGN0eC5saW5lVG8odGhpcy5iLnBvcy54LCB0aGlzLmIucG9zLnkpO1xuICBjdHgubGluZVRvKHRoaXMuYy5wb3MueCwgdGhpcy5jLnBvcy55KTtcbiAgdmFyIHRtcCA9IGN0eC5saW5lV2lkdGg7XG4gIGN0eC5saW5lV2lkdGggPSA1O1xuICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMjU1LDI1NSwwLDAuMilcIjtcbiAgY3R4LnN0cm9rZSgpO1xuICBjdHgubGluZVdpZHRoID0gdG1wO1xufVxuIiwiOyhmdW5jdGlvbiBpbmplY3QoY2xlYW4sIHByZWNpc2lvbiwgdW5kZWYpIHtcblxuICBmdW5jdGlvbiBWZWMyKHgsIHkpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVmVjMikpIHtcbiAgICAgIHJldHVybiBuZXcgVmVjMih4LCB5KTtcbiAgICB9XG5cbiAgICBpZignb2JqZWN0JyA9PT0gdHlwZW9mIHggJiYgeCkge1xuICAgICAgdGhpcy55ID0geC55O1xuICAgICAgdGhpcy54ID0geC54O1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy54ID0geCB8fCAwO1xuICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICBcbiAgICB0aGlzLnNldCh4IHx8IDAsIHkgfHwgMCk7XG4gIH07XG5cbiAgVmVjMi5wcm90b3R5cGUgPSB7XG4gICAgY2hhbmdlIDogZnVuY3Rpb24oZm4pIHtcbiAgICAgIGlmIChmbikge1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZlcnMpIHtcbiAgICAgICAgICB0aGlzLm9ic2VydmVycy5wdXNoKGZuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9ic2VydmVycyA9IFtmbl07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vYnNlcnZlcnMpIHtcbiAgICAgICAgZm9yICh2YXIgaT10aGlzLm9ic2VydmVycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5vYnNlcnZlcnNbaV0odGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGlnbm9yZSA6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB0aGlzLm9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzLmZpbHRlcihmdW5jdGlvbihjYikge1xuICAgICAgICByZXR1cm4gY2IgIT09IGZuO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBkaXJ0eSA6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fZGlydHkgPSB0cnVlXG4gICAgICB0aGlzLl9fY2FjaGVkTGVuZ3RoID0gbnVsbFxuICAgICAgdGhpcy5fX2NhY2hlZExlbmd0aFNxdWFyZWQgPSBudWxsXG4gICAgfSxcblxuICAgIC8vIHNldCB4IGFuZCB5XG4gICAgc2V0OiBmdW5jdGlvbih4LCB5LCBzaWxlbnQpIHtcbiAgICAgIGlmKCdudW1iZXInICE9IHR5cGVvZiB4KSB7IC8veCAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIHgpIHtcbiAgICAgICAgc2lsZW50ID0geTtcbiAgICAgICAgeSA9IHgueTtcbiAgICAgICAgeCA9IHgueDtcbiAgICAgIH1cbi8vICAgICAgeCA9IFZlYzIuY2xlYW4oeClcbi8vICAgICAgeSA9IFZlYzIuY2xlYW4oeSlcbiAgICAgIGlmKHRoaXMueCA9PT0geCAmJiB0aGlzLnkgPT09IHkpXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgdGhpcy54ID0geDtcbiAgICAgIHRoaXMueSA9IHk7XG4vLyAgICAgIHRoaXMuZGlydHkoKTtcbi8vICAgICAgdGhpcy5fX2NhY2hlZExlbmd0aCA9IG51bGxcbi8vICAgICAgdGhpcy5fX2NhY2hlZExlbmd0aFNxdWFyZWQgPSBudWxsXG4gICAgICBpZihzaWxlbnQgIT09IGZhbHNlKVxuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2UoKTtcbiAgICB9LFxuXG4gICAgLy8gcmVzZXQgeCBhbmQgeSB0byB6ZXJvXG4gICAgemVybyA6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KDAsIDApO1xuICAgIH0sXG5cbiAgICAvLyByZXR1cm4gYSBuZXcgdmVjdG9yIHdpdGggdGhlIHNhbWUgY29tcG9uZW50IHZhbHVlc1xuICAgIC8vIGFzIHRoaXMgb25lXG4gICAgY2xvbmUgOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLngsIHRoaXMueSk7XG4gICAgfSxcblxuICAgIC8vIG5lZ2F0ZSB0aGUgdmFsdWVzIG9mIHRoaXMgdmVjdG9yXG4gICAgbmVnYXRlIDogZnVuY3Rpb24ocmV0dXJuTmV3KSB7XG4gICAgICBpZiAocmV0dXJuTmV3KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMigtdGhpcy54LCAtdGhpcy55KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldCgtdGhpcy54LCAtdGhpcy55KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQWRkIHRoZSBpbmNvbWluZyBgdmVjMmAgdmVjdG9yIHRvIHRoaXMgdmVjdG9yXG4gICAgYWRkIDogZnVuY3Rpb24odmVjMiwgcmV0dXJuTmV3KSB7XG4gICAgICBpZiAoIXJldHVybk5ldykge1xuICAgICAgICB0aGlzLnggKz0gdmVjMi54OyB0aGlzLnkgKz0gdmVjMi55O1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2UoKVxuLy8gICAgICAgIHJldHVybiB0aGlzLnNldCh0aGlzLnggKyB2ZWMyLngsIHRoaXMueSArIHZlYzIueSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZXR1cm4gYSBuZXcgdmVjdG9yIGlmIGByZXR1cm5OZXdgIGlzIHRydXRoeVxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoXG4gICAgICAgICAgdGhpcy54ICsgdmVjMi54LFxuICAgICAgICAgIHRoaXMueSArIHZlYzIueVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBTdWJ0cmFjdCB0aGUgaW5jb21pbmcgYHZlYzJgIGZyb20gdGhpcyB2ZWN0b3JcbiAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uKHZlYzIsIHJldHVybk5ldykge1xuICAgICAgaWYgKCFyZXR1cm5OZXcpIHtcbiAgICAgICAgdGhpcy54IC09IHZlYzIueDsgdGhpcy55IC09IHZlYzIueTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlKClcbi8vICAgICAgICByZXR1cm4gdGhpcy5zZXQodGhpcy54IC0gdmVjMi54LCB0aGlzLnkgLSB2ZWMyLnkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZXR1cm4gYSBuZXcgdmVjdG9yIGlmIGByZXR1cm5OZXdgIGlzIHRydXRoeVxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoXG4gICAgICAgICAgdGhpcy54IC0gdmVjMi54LFxuICAgICAgICAgIHRoaXMueSAtIHZlYzIueVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBNdWx0aXBseSB0aGlzIHZlY3RvciBieSB0aGUgaW5jb21pbmcgYHZlYzJgXG4gICAgbXVsdGlwbHkgOiBmdW5jdGlvbih2ZWMyLCByZXR1cm5OZXcpIHtcbiAgICAgIHZhciB4LHk7XG4gICAgICBpZiAoJ251bWJlcicgIT09IHR5cGVvZiB2ZWMyKSB7IC8vLnggIT09IHVuZGVmKSB7XG4gICAgICAgIHggPSB2ZWMyLng7XG4gICAgICAgIHkgPSB2ZWMyLnk7XG5cbiAgICAgIC8vIEhhbmRsZSBpbmNvbWluZyBzY2FsYXJzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ID0geSA9IHZlYzI7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmV0dXJuTmV3KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldCh0aGlzLnggKiB4LCB0aGlzLnkgKiB5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihcbiAgICAgICAgICB0aGlzLnggKiB4LFxuICAgICAgICAgIHRoaXMueSAqIHlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUm90YXRlIHRoaXMgdmVjdG9yLiBBY2NlcHRzIGEgYFJvdGF0aW9uYCBvciBhbmdsZSBpbiByYWRpYW5zLlxuICAgIC8vXG4gICAgLy8gUGFzc2luZyBhIHRydXRoeSBgaW52ZXJzZWAgd2lsbCBjYXVzZSB0aGUgcm90YXRpb24gdG9cbiAgICAvLyBiZSByZXZlcnNlZC5cbiAgICAvL1xuICAgIC8vIElmIGByZXR1cm5OZXdgIGlzIHRydXRoeSwgYSBuZXdcbiAgICAvLyBgVmVjMmAgd2lsbCBiZSBjcmVhdGVkIHdpdGggdGhlIHZhbHVlcyByZXN1bHRpbmcgZnJvbVxuICAgIC8vIHRoZSByb3RhdGlvbi4gT3RoZXJ3aXNlIHRoZSByb3RhdGlvbiB3aWxsIGJlIGFwcGxpZWRcbiAgICAvLyB0byB0aGlzIHZlY3RvciBkaXJlY3RseSwgYW5kIHRoaXMgdmVjdG9yIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgcm90YXRlIDogZnVuY3Rpb24ociwgaW52ZXJzZSwgcmV0dXJuTmV3KSB7XG4gICAgICB2YXJcbiAgICAgIHggPSB0aGlzLngsXG4gICAgICB5ID0gdGhpcy55LFxuICAgICAgY29zID0gTWF0aC5jb3MociksXG4gICAgICBzaW4gPSBNYXRoLnNpbihyKSxcbiAgICAgIHJ4LCByeTtcblxuICAgICAgaW52ZXJzZSA9IChpbnZlcnNlKSA/IC0xIDogMTtcblxuICAgICAgcnggPSBjb3MgKiB4IC0gKGludmVyc2UgKiBzaW4pICogeTtcbiAgICAgIHJ5ID0gKGludmVyc2UgKiBzaW4pICogeCArIGNvcyAqIHk7XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHJ4LCByeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXQocngsIHJ5KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3Jcbi8vICAgIF9fY2FjaGVkTGVuZ3RoIDogbnVsbCxcbiAgICBsZW5ndGggOiBmdW5jdGlvbigpIHtcbi8vICAgICAgaWYgKHRoaXMuX19jYWNoZWRMZW5ndGggPT09IG51bGwpIHtcbi8vICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlXG4vLyAgICAgICAgdmFyIHggPSB0aGlzLngsIHkgPSB0aGlzLnk7XG4vLyAgICAgICAgdGhpcy5fX2NhY2hlZExlbmd0aCA9XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4vLyAgICAgIH1cbi8vICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZWRMZW5ndGhcbiAgICB9LFxuXG4gICAgLy8gR2V0IHRoZSBsZW5ndGggc3F1YXJlZC4gRm9yIHBlcmZvcm1hbmNlLCB1c2UgdGhpcyBpbnN0ZWFkIG9mIGBWZWMyI2xlbmd0aGAgKGlmIHBvc3NpYmxlKS5cbi8vICAgIF9fY2FjaGVkTGVuZ3RoU3F1YXJlZCA6IG51bGwsXG4gICAgbGVuZ3RoU3F1YXJlZCA6IGZ1bmN0aW9uKCkge1xuLy8gICAgICBpZiAodGhpcy5fX2NhY2hlZExlbmd0aFNxdWFyZWQgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLngsIHkgPSB0aGlzLnk7XG4vLyAgICAgICAgdGhpcy5fX2NhY2hlZExlbmd0aFNxdWFyZWQgPSBcbi8vICAgICAgICBWZWMyLmNsZWFuKHggKiB4ICsgeSAqIHkpO1xuICAgICAgICByZXR1cm4geCp4K3kqeTtcbi8vICAgICAgfVxuLy8gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlZExlbmd0aFNxdWFyZWQ7XG4gICAgfSxcblxuICAgIC8vIFJldHVybiB0aGUgZGlzdGFuY2UgYmV0d2VuIHRoaXMgYFZlYzJgIGFuZCB0aGUgaW5jb21pbmcgdmVjMiB2ZWN0b3JcbiAgICAvLyBhbmQgcmV0dXJuIGEgc2NhbGFyXG4gICAgZGlzdGFuY2UgOiBmdW5jdGlvbih2ZWMyKSB7XG4gICAgICB2YXIgeCA9IHRoaXMueCAtIHZlYzIueDtcbiAgICAgIHZhciB5ID0gdGhpcy55IC0gdmVjMi55O1xuICAgICAgcmV0dXJuIE1hdGguc3FydCh4KnggKyB5KnkpXG4vLyAgICAgIHJldHVybiB0aGlzLnN1YnRyYWN0KHZlYzIsIHRydWUpLmxlbmd0aCgpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IHRoaXMgdmVjdG9yIGludG8gYSB1bml0IHZlY3Rvci5cbiAgICAvLyBSZXR1cm5zIHRoZSBsZW5ndGguXG4gICAgbm9ybWFsaXplIDogZnVuY3Rpb24ocmV0dXJuTmV3KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcblxuICAgICAgLy8gQ29sbGVjdCBhIHJhdGlvIHRvIHNocmluayB0aGUgeCBhbmQgeSBjb29yZHNcbiAgICAgIHZhciBpbnZlcnRlZExlbmd0aCA9IChsZW5ndGggPCBOdW1iZXIuTUlOX1ZBTFVFKSA/IDAgOiAxL2xlbmd0aDtcblxuICAgICAgaWYgKCFyZXR1cm5OZXcpIHtcbiAgICAgICAgLy8gQ29udmVydCB0aGUgY29vcmRzIHRvIGJlIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgICAgIC8vIGJ1dCBzbWFsbGVyIHRoYW4gb3IgZXF1YWwgdG8gMS4wXG4gICAgICAgIHJldHVybiB0aGlzLnNldCh0aGlzLnggKiBpbnZlcnRlZExlbmd0aCwgdGhpcy55ICogaW52ZXJ0ZWRMZW5ndGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIGludmVydGVkTGVuZ3RoLCB0aGlzLnkgKiBpbnZlcnRlZExlbmd0aClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRGV0ZXJtaW5lIGlmIGFub3RoZXIgYFZlYzJgJ3MgY29tcG9uZW50cyBtYXRjaCB0aGlzIG9uZSdzXG4gICAgLy8gYWxzbyBhY2NlcHRzIDIgc2NhbGFyc1xuICAgIGVxdWFsIDogZnVuY3Rpb24odiwgdykge1xuICAgICAgaWYgKHcgPT09IHVuZGVmKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy54ID09PSB2LnggJiZcbiAgICAgICAgICB0aGlzLnkgPT0gdi55XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoaXMueCA9PT0gdiAmJlxuICAgICAgICAgIHRoaXMueSA9PT0gd1xuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFJldHVybiBhIG5ldyBgVmVjMmAgdGhhdCBjb250YWlucyB0aGUgYWJzb2x1dGUgdmFsdWUgb2ZcbiAgICAvLyBlYWNoIG9mIHRoaXMgdmVjdG9yJ3MgcGFydHNcbiAgICBhYnMgOiBmdW5jdGlvbihyZXR1cm5OZXcpIHtcbiAgICAgIHZhciB4ID0gTWF0aC5hYnModGhpcy54KSwgeSA9IE1hdGguYWJzKHRoaXMueSk7XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KHgsIHkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBSZXR1cm4gYSBuZXcgYFZlYzJgIGNvbnNpc3Rpbmcgb2YgdGhlIHNtYWxsZXN0IHZhbHVlc1xuICAgIC8vIGZyb20gdGhpcyB2ZWN0b3IgYW5kIHRoZSBpbmNvbWluZ1xuICAgIC8vXG4gICAgLy8gV2hlbiByZXR1cm5OZXcgaXMgdHJ1dGh5LCBhIG5ldyBgVmVjMmAgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIG90aGVyd2lzZSB0aGUgbWluaW11bSB2YWx1ZXMgaW4gZWl0aGVyIHRoaXMgb3IgYHZgIHdpbGxcbiAgICAvLyBiZSBhcHBsaWVkIHRvIHRoaXMgdmVjdG9yLlxuICAgIG1pbiA6IGZ1bmN0aW9uKHYsIHJldHVybk5ldykge1xuICAgICAgdmFyXG4gICAgICB0eCA9IHRoaXMueCxcbiAgICAgIHR5ID0gdGhpcy55LFxuICAgICAgdnggPSB2LngsXG4gICAgICB2eSA9IHYueSxcbiAgICAgIHggPSB0eCA8IHZ4ID8gdHggOiB2eCxcbiAgICAgIHkgPSB0eSA8IHZ5ID8gdHkgOiB2eTtcblxuICAgICAgaWYgKHJldHVybk5ldykge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCwgeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXQoeCwgeSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFJldHVybiBhIG5ldyBgVmVjMmAgY29uc2lzdGluZyBvZiB0aGUgbGFyZ2VzdCB2YWx1ZXNcbiAgICAvLyBmcm9tIHRoaXMgdmVjdG9yIGFuZCB0aGUgaW5jb21pbmdcbiAgICAvL1xuICAgIC8vIFdoZW4gcmV0dXJuTmV3IGlzIHRydXRoeSwgYSBuZXcgYFZlYzJgIHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBvdGhlcndpc2UgdGhlIG1pbmltdW0gdmFsdWVzIGluIGVpdGhlciB0aGlzIG9yIGB2YCB3aWxsXG4gICAgLy8gYmUgYXBwbGllZCB0byB0aGlzIHZlY3Rvci5cbiAgICBtYXggOiBmdW5jdGlvbih2LCByZXR1cm5OZXcpIHtcbiAgICAgIHZhclxuICAgICAgdHggPSB0aGlzLngsXG4gICAgICB0eSA9IHRoaXMueSxcbiAgICAgIHZ4ID0gdi54LFxuICAgICAgdnkgPSB2LnksXG4gICAgICB4ID0gdHggPiB2eCA/IHR4IDogdngsXG4gICAgICB5ID0gdHkgPiB2eSA/IHR5IDogdnk7XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KHgsIHkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBDbGFtcCB2YWx1ZXMgaW50byBhIHJhbmdlLlxuICAgIC8vIElmIHRoaXMgdmVjdG9yJ3MgdmFsdWVzIGFyZSBsb3dlciB0aGFuIHRoZSBgbG93YCdzXG4gICAgLy8gdmFsdWVzLCB0aGVuIHJhaXNlIHRoZW0uICBJZiB0aGV5IGFyZSBoaWdoZXIgdGhhblxuICAgIC8vIGBoaWdoYCdzIHRoZW4gbG93ZXIgdGhlbS5cbiAgICAvL1xuICAgIC8vIFBhc3NpbmcgcmV0dXJuTmV3IGFzIHRydWUgd2lsbCBjYXVzZSBhIG5ldyBWZWMyIHRvIGJlXG4gICAgLy8gcmV0dXJuZWQuICBPdGhlcndpc2UsIHRoaXMgdmVjdG9yJ3MgdmFsdWVzIHdpbGwgYmUgY2xhbXBlZFxuICAgIGNsYW1wIDogZnVuY3Rpb24obG93LCBoaWdoLCByZXR1cm5OZXcpIHtcbiAgICAgIHZhciByZXQgPSB0aGlzLm1pbihoaWdoLCB0cnVlKS5tYXgobG93KVxuICAgICAgaWYgKHJldHVybk5ldykge1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KHJldC54LCByZXQueSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFBlcmZvcm0gbGluZWFyIGludGVycG9sYXRpb24gYmV0d2VlbiB0d28gdmVjdG9yc1xuICAgIC8vIGFtb3VudCBpcyBhIGRlY2ltYWwgYmV0d2VlbiAwIGFuZCAxXG4gICAgbGVycCA6IGZ1bmN0aW9uKHZlYywgYW1vdW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGQodmVjLnN1YnRyYWN0KHRoaXMsIHRydWUpLm11bHRpcGx5KGFtb3VudCksIHRydWUpO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgdGhlIHNrZXcgdmVjdG9yIHN1Y2ggdGhhdCBkb3Qoc2tld192ZWMsIG90aGVyKSA9PSBjcm9zcyh2ZWMsIG90aGVyKVxuICAgIHNrZXcgOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFJldHVybnMgYSBuZXcgdmVjdG9yLlxuICAgICAgcmV0dXJuIG5ldyBWZWMyKC10aGlzLnksIHRoaXMueClcbiAgICB9LFxuXG4gICAgLy8gY2FsY3VsYXRlIHRoZSBkb3QgcHJvZHVjdCBiZXR3ZWVuXG4gICAgLy8gdGhpcyB2ZWN0b3IgYW5kIHRoZSBpbmNvbWluZ1xuICAgIGRvdCA6IGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiBWZWMyLmNsZWFuKHRoaXMueCAqIGIueCArIGIueSAqIHRoaXMueSk7XG4gICAgfSxcblxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgcGVycGVuZGljdWxhciBkb3QgcHJvZHVjdCBiZXR3ZWVuXG4gICAgLy8gdGhpcyB2ZWN0b3IgYW5kIHRoZSBpbmNvbWluZ1xuICAgIHBlcnBEb3QgOiBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gVmVjMi5jbGVhbih0aGlzLnggKiBiLnkgLSB0aGlzLnkgKiBiLngpXG4gICAgfSxcblxuICAgIC8vIERldGVybWluZSB0aGUgYW5nbGUgYmV0d2VlbiB0d28gdmVjMnNcbiAgICBhbmdsZVRvIDogZnVuY3Rpb24odmVjKSB7XG4gICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnBlcnBEb3QodmVjKSwgdGhpcy5kb3QodmVjKSk7XG4gICAgfSxcblxuICAgIC8vIERpdmlkZSB0aGlzIHZlY3RvcidzIGNvbXBvbmVudHMgYnkgYSBzY2FsYXJcbiAgICBkaXZpZGUgOiBmdW5jdGlvbihzY2FsYXIsIHJldHVybk5ldykge1xuICAgICAgaWYgKHNjYWxhciA9PT0gMCB8fCBpc05hTihzY2FsYXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZGl2aXNpb24gYnkgemVybycpXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueC9zY2FsYXIsIHRoaXMueS9zY2FsYXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zZXQodGhpcy54IC8gc2NhbGFyLCB0aGlzLnkgLyBzY2FsYXIpO1xuICAgIH0sXG5cbiAgICB0b0FycmF5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xuICAgIH0sXG5cbiAgICBmcm9tQXJyYXk6IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXJyYXlbMF0sIGFycmF5WzFdKTtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHt4OiB0aGlzLngsIHk6IHRoaXMueX1cbiAgICB9XG4gIH07XG5cbiAgVmVjMi5mcm9tQXJyYXkgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBuZXcgVmVjMihhcnJheVswXSwgYXJyYXlbMV0pO1xuICB9O1xuXG4gIC8vIEZsb2F0aW5nIHBvaW50IHN0YWJpbGl0eVxuICBWZWMyLnByZWNpc2lvbiA9IHByZWNpc2lvbiB8fCA4O1xuICB2YXIgcCA9IE1hdGgucG93KDEwLCBWZWMyLnByZWNpc2lvbilcblxuICBWZWMyLmNsZWFuID0gY2xlYW4gfHwgZnVuY3Rpb24odmFsKSB7XG4gICAgaWYgKGlzTmFOKHZhbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTmFOIGRldGVjdGVkJylcbiAgICB9XG5cbiAgICBpZiAoIWlzRmluaXRlKHZhbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW5maW5pdHkgZGV0ZWN0ZWQnKTtcbiAgICB9XG5cbiAgICBpZihNYXRoLnJvdW5kKHZhbCkgPT09IHZhbCkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWwgKiBwKS9wO1xuICB9O1xuICBWZWMyLmluamVjdCA9IGluamVjdDtcblxuICAvLyBFeHBvc2UsIGJ1dCBhbHNvIGFsbG93IGNyZWF0aW5nIGEgZnJlc2ggVmVjMiBzdWJjbGFzcy5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gVmVjMjtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuVmVjMiA9IHdpbmRvdy5WZWMyIHx8IFZlYzI7XG4gIH1cbiAgcmV0dXJuIFZlYzJcbn0pKCk7XG5cblxuIl19
;