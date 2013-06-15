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

var Vec2 = require('vec2').inject(function (e) {return e})

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

var Vec2 = require('vec2').inject(function(e) {return e})

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
      this.y = x.y || 0;
      this.x = x.x || 0;
      return
    }

    this.x = Vec2.clean(x || 0);
    this.y = Vec2.clean(y || 0);
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
      if('number' != typeof x) {
        silent = y;
        y = x.y;
        x = x.x;
      }
      if(this.x === x && this.y === y)
        return this;

      this.x = Vec2.clean(x);
      this.y = Vec2.clean(y);

      this.dirty()
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
    length : function() {
      var x = this.x, y = this.y;
      return Math.sqrt(x * x + y * y);
    },

    // Get the length squared. For performance, use this instead of `Vec2#length` (if possible).
    lengthSquared : function() {
      var x = this.x, y = this.y;
      return x*x+y*y;
    },

    // Return the distance betwen this `Vec2` and the incoming vec2 vector
    // and return a scalar
    distance : function(vec2) {
      var x = this.x - vec2.x;
      var y = this.y - vec2.y;
      return Math.sqrt(x*x + y*y)
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

  if(!clean) {
    Vec2.fast = inject(function (k) { return k })

    // Expose, but also allow creating a fresh Vec2 subclass.
    if (typeof module !== 'undefined' && typeof module.exports == 'object') {
      module.exports = Vec2;
    } else {
      window.Vec2 = window.Vec2 || Vec2;
    }
  }
  return Vec2
})();



},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL2Rpc3QuanMiLCIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL3ZlYzIuanMiLCIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL29iamVjdHMuanMiLCIvVXNlcnMvZG9taW5pY3RhcnIvYy92ZXJsZXQtanMvbGliL3ZlcmxldC5qcyIsIi9Vc2Vycy9kb21pbmljdGFyci9jL3ZlcmxldC1qcy9saWIvY29uc3RyYWludC5qcyIsIi9Vc2Vycy9kb21pbmljdGFyci9jL3ZlcmxldC1qcy9ub2RlX21vZHVsZXMvdmVjMi9saWIvdmVjMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxuLy90aGlzIGV4cG9ydHMgYWxsIHRoZSB2ZXJsZXQgbWV0aG9kcyBnbG9iYWxseSwgc28gdGhhdCB0aGUgZGVtb3Mgd29yay5cblxudmFyIFZlcmxldEpTID0gcmVxdWlyZSgnLi92ZXJsZXQnKVxudmFyIGNvbnN0cmFpbnQgPSByZXF1aXJlKCcuL2NvbnN0cmFpbnQnKVxuXHRcdFx0XHRcdFx0XHRcdCByZXF1aXJlKCcuL29iamVjdHMnKSAvL3BhdGNoZXMgVmVybGV0SlMucHJvdG90eXBlIChiYWQpXG53aW5kb3cuVmVjMiA9IHJlcXVpcmUoJy4vdmVjMicpXG53aW5kb3cuVmVybGV0SlMgPSBWZXJsZXRKU1xuXG53aW5kb3cuUGFydGljbGUgPSBWZXJsZXRKUy5QYXJ0aWNsZVxuXG53aW5kb3cuRGlzdGFuY2VDb25zdHJhaW50ID0gY29uc3RyYWludC5EaXN0YW5jZUNvbnN0cmFpbnRcbndpbmRvdy5QaW5Db25zdHJhaW50ICAgICAgPSBjb25zdHJhaW50LlBpbkNvbnN0cmFpbnRcbndpbmRvdy5BbmdsZUNvbnN0cmFpbnQgICAgPSBjb25zdHJhaW50LkFuZ2xlQ29uc3RyYWludFxuXG5cbiIsIlxuLypcbkNvcHlyaWdodCAyMDEzIFN1YiBQcm90b2NvbCBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG5odHRwOi8vc3VicHJvdG9jb2wuY29tL1xuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbmEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG53aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5kaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbnBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xudGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5FWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbk1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5OT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG5MSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5PRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbldJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuKi9cblxuLy8gQSBzaW1wbGUgMi1kaW1lbnNpb25hbCB2ZWN0b3IgaW1wbGVtZW50YXRpb25cblxubW9kdWxlLmV4cG9ydHMgPSBWZWMyXG5cbmZ1bmN0aW9uIFZlYzIoeCwgeSkge1xuXHR0aGlzLnggPSB4IHx8IDA7XG5cdHRoaXMueSA9IHkgfHwgMDtcbn1cblxuVmVjMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gbmV3IFZlYzIodGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnkpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiBuZXcgVmVjMih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSk7XG59XG5cblZlYzIucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIHYueCwgdGhpcy55ICogdi55KTtcbn1cblxuVmVjMi5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gbmV3IFZlYzIodGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnkpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uKGNvZWYpIHtcblx0cmV0dXJuIG5ldyBWZWMyKHRoaXMueCpjb2VmLCB0aGlzLnkqY29lZik7XG59XG5cblZlYzIucHJvdG90eXBlLm11dGFibGVTZXQgPSBmdW5jdGlvbih2KSB7XG5cdHRoaXMueCA9IHYueDtcblx0dGhpcy55ID0gdi55O1xuXHRyZXR1cm4gdGhpcztcbn1cblxuVmVjMi5wcm90b3R5cGUubXV0YWJsZUFkZCA9IGZ1bmN0aW9uKHYpIHtcblx0dGhpcy54ICs9IHYueDtcblx0dGhpcy55ICs9IHYueTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblZlYzIucHJvdG90eXBlLm11dGFibGVTdWIgPSBmdW5jdGlvbih2KSB7XG5cdHRoaXMueCAtPSB2Lng7XG5cdHRoaXMueSAtPSB2Lnk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5WZWMyLnByb3RvdHlwZS5tdXRhYmxlTXVsID0gZnVuY3Rpb24odikge1xuXHR0aGlzLnggKj0gdi54O1xuXHR0aGlzLnkgKj0gdi55O1xuXHRyZXR1cm4gdGhpcztcbn1cblxuVmVjMi5wcm90b3R5cGUubXV0YWJsZURpdiA9IGZ1bmN0aW9uKHYpIHtcblx0dGhpcy54IC89IHYueDtcblx0dGhpcy55IC89IHYueTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblZlYzIucHJvdG90eXBlLm11dGFibGVTY2FsZSA9IGZ1bmN0aW9uKGNvZWYpIHtcblx0dGhpcy54ICo9IGNvZWY7XG5cdHRoaXMueSAqPSBjb2VmO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuVmVjMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gdGhpcy54ID09IHYueCAmJiB0aGlzLnkgPT0gdi55O1xufVxuXG5WZWMyLnByb3RvdHlwZS5lcHNpbG9uRXF1YWxzID0gZnVuY3Rpb24odiwgZXBzaWxvbikge1xuXHRyZXR1cm4gTWF0aC5hYnModGhpcy54IC0gdi54KSA8PSBlcHNpbG9uICYmIE1hdGguYWJzKHRoaXMueSAtIHYueSkgPD0gZXBzaWxvbjtcbn1cblxuVmVjMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCp0aGlzLnggKyB0aGlzLnkqdGhpcy55KTtcbn1cblxuVmVjMi5wcm90b3R5cGUubGVuZ3RoMiA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIHRoaXMueCp0aGlzLnggKyB0aGlzLnkqdGhpcy55O1xufVxuXG5WZWMyLnByb3RvdHlwZS5kaXN0ID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGlzdDIodikpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5kaXN0MiA9IGZ1bmN0aW9uKHYpIHtcblx0dmFyIHggPSB2LnggLSB0aGlzLng7XG5cdHZhciB5ID0gdi55IC0gdGhpcy55O1xuXHRyZXR1cm4geCp4ICsgeSp5O1xufVxuXG5WZWMyLnByb3RvdHlwZS5ub3JtYWwgPSBmdW5jdGlvbigpIHtcblx0dmFyIG0gPSBNYXRoLnNxcnQodGhpcy54KnRoaXMueCArIHRoaXMueSp0aGlzLnkpO1xuXHRyZXR1cm4gbmV3IFZlYzIodGhpcy54L20sIHRoaXMueS9tKTtcbn1cblxuVmVjMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gdGhpcy54KnYueCArIHRoaXMueSp2Lnk7XG59XG5cblZlYzIucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gTWF0aC5hdGFuMih0aGlzLngqdi55LXRoaXMueSp2LngsdGhpcy54KnYueCt0aGlzLnkqdi55KTtcbn1cblxuVmVjMi5wcm90b3R5cGUuYW5nbGUyID0gZnVuY3Rpb24odkxlZnQsIHZSaWdodCkge1xuXHRyZXR1cm4gdkxlZnQuc3ViKHRoaXMpLmFuZ2xlKHZSaWdodC5zdWIodGhpcykpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbihvcmlnaW4sIHRoZXRhKSB7XG5cdHZhciB4ID0gdGhpcy54IC0gb3JpZ2luLng7XG5cdHZhciB5ID0gdGhpcy55IC0gb3JpZ2luLnk7XG5cdHJldHVybiBuZXcgVmVjMih4Kk1hdGguY29zKHRoZXRhKSAtIHkqTWF0aC5zaW4odGhldGEpICsgb3JpZ2luLngsIHgqTWF0aC5zaW4odGhldGEpICsgeSpNYXRoLmNvcyh0aGV0YSkgKyBvcmlnaW4ueSk7XG59XG5cblZlYzIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBcIihcIiArIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiKVwiO1xufVxuXG5mdW5jdGlvbiB0ZXN0X1ZlYzIoKSB7XG5cdHZhciBhc3NlcnQgPSBmdW5jdGlvbihsYWJlbCwgZXhwcmVzc2lvbikge1xuXHRcdGNvbnNvbGUubG9nKFwiVmVjMihcIiArIGxhYmVsICsgXCIpOiBcIiArIChleHByZXNzaW9uID09IHRydWUgPyBcIlBBU1NcIiA6IFwiRkFJTFwiKSk7XG5cdFx0aWYgKGV4cHJlc3Npb24gIT0gdHJ1ZSlcblx0XHRcdHRocm93IFwiYXNzZXJ0aW9uIGZhaWxlZFwiO1xuXHR9O1xuXHRcblx0YXNzZXJ0KFwiZXF1YWxpdHlcIiwgKG5ldyBWZWMyKDUsMykuZXF1YWxzKG5ldyBWZWMyKDUsMykpKSk7XG5cdGFzc2VydChcImVwc2lsb24gZXF1YWxpdHlcIiwgKG5ldyBWZWMyKDEsMikuZXBzaWxvbkVxdWFscyhuZXcgVmVjMigxLjAxLDIuMDIpLCAwLjAzKSkpO1xuXHRhc3NlcnQoXCJlcHNpbG9uIG5vbi1lcXVhbGl0eVwiLCAhKG5ldyBWZWMyKDEsMikuZXBzaWxvbkVxdWFscyhuZXcgVmVjMigxLjAxLDIuMDIpLCAwLjAxKSkpO1xuXHRhc3NlcnQoXCJhZGRpdGlvblwiLCAobmV3IFZlYzIoMSwxKSkuYWRkKG5ldyBWZWMyKDIsIDMpKS5lcXVhbHMobmV3IFZlYzIoMywgNCkpKTtcblx0YXNzZXJ0KFwic3VidHJhY3Rpb25cIiwgKG5ldyBWZWMyKDQsMykpLnN1YihuZXcgVmVjMigyLCAxKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDIpKSk7XG5cdGFzc2VydChcIm11bHRpcGx5XCIsIChuZXcgVmVjMigyLDQpKS5tdWwobmV3IFZlYzIoMiwgMSkpLmVxdWFscyhuZXcgVmVjMig0LCA0KSkpO1xuXHRhc3NlcnQoXCJkaXZpZGVcIiwgKG5ldyBWZWMyKDQsMikpLmRpdihuZXcgVmVjMigyLCAyKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDEpKSk7XG5cdGFzc2VydChcInNjYWxlXCIsIChuZXcgVmVjMig0LDMpKS5zY2FsZSgyKS5lcXVhbHMobmV3IFZlYzIoOCwgNikpKTtcblx0YXNzZXJ0KFwibXV0YWJsZSBzZXRcIiwgKG5ldyBWZWMyKDEsMSkpLm11dGFibGVTZXQobmV3IFZlYzIoMiwgMykpLmVxdWFscyhuZXcgVmVjMigyLCAzKSkpO1xuXHRhc3NlcnQoXCJtdXRhYmxlIGFkZGl0aW9uXCIsIChuZXcgVmVjMigxLDEpKS5tdXRhYmxlQWRkKG5ldyBWZWMyKDIsIDMpKS5lcXVhbHMobmV3IFZlYzIoMywgNCkpKTtcblx0YXNzZXJ0KFwibXV0YWJsZSBzdWJ0cmFjdGlvblwiLCAobmV3IFZlYzIoNCwzKSkubXV0YWJsZVN1YihuZXcgVmVjMigyLCAxKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDIpKSk7XG5cdGFzc2VydChcIm11dGFibGUgbXVsdGlwbHlcIiwgKG5ldyBWZWMyKDIsNCkpLm11dGFibGVNdWwobmV3IFZlYzIoMiwgMSkpLmVxdWFscyhuZXcgVmVjMig0LCA0KSkpO1xuXHRhc3NlcnQoXCJtdXRhYmxlIGRpdmlkZVwiLCAobmV3IFZlYzIoNCwyKSkubXV0YWJsZURpdihuZXcgVmVjMigyLCAyKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDEpKSk7XG5cdGFzc2VydChcIm11dGFibGUgc2NhbGVcIiwgKG5ldyBWZWMyKDQsMykpLm11dGFibGVTY2FsZSgyKS5lcXVhbHMobmV3IFZlYzIoOCwgNikpKTtcblx0YXNzZXJ0KFwibGVuZ3RoXCIsIE1hdGguYWJzKChuZXcgVmVjMig0LDQpKS5sZW5ndGgoKSAtIDUuNjU2ODUpIDw9IDAuMDAwMDEpO1xuXHRhc3NlcnQoXCJsZW5ndGgyXCIsIChuZXcgVmVjMigyLDQpKS5sZW5ndGgyKCkgPT0gMjApO1xuXHRhc3NlcnQoXCJkaXN0XCIsIE1hdGguYWJzKChuZXcgVmVjMigyLDQpKS5kaXN0KG5ldyBWZWMyKDMsNSkpIC0gMS40MTQyMTM1KSA8PSAwLjAwMDAwMSk7XG5cdGFzc2VydChcImRpc3QyXCIsIChuZXcgVmVjMigyLDQpKS5kaXN0MihuZXcgVmVjMigzLDUpKSA9PSAyKTtcblxuXHR2YXIgbm9ybWFsID0gKG5ldyBWZWMyKDIsNCkpLm5vcm1hbCgpXG5cdGFzc2VydChcIm5vcm1hbFwiLCBNYXRoLmFicyhub3JtYWwubGVuZ3RoKCkgLSAxLjApIDw9IDAuMDAwMDEgJiYgbm9ybWFsLmVwc2lsb25FcXVhbHMobmV3IFZlYzIoMC40NDcyLCAwLjg5NDQzKSwgMC4wMDAxKSk7XG5cdGFzc2VydChcImRvdFwiLCAobmV3IFZlYzIoMiwzKSkuZG90KG5ldyBWZWMyKDQsMSkpID09IDExKTtcblx0YXNzZXJ0KFwiYW5nbGVcIiwgKG5ldyBWZWMyKDAsLTEpKS5hbmdsZShuZXcgVmVjMigxLDApKSooMTgwL01hdGguUEkpID09IDkwKTtcblx0YXNzZXJ0KFwiYW5nbGUyXCIsIChuZXcgVmVjMigxLDEpKS5hbmdsZTIobmV3IFZlYzIoMSwwKSwgbmV3IFZlYzIoMiwxKSkqKDE4MC9NYXRoLlBJKSA9PSA5MCk7XG5cdGFzc2VydChcInJvdGF0ZVwiLCAobmV3IFZlYzIoMiwwKSkucm90YXRlKG5ldyBWZWMyKDEsMCksIE1hdGguUEkvMikuZXF1YWxzKG5ldyBWZWMyKDEsMSkpKTtcblx0YXNzZXJ0KFwidG9TdHJpbmdcIiwgKG5ldyBWZWMyKDIsNCkpID09IFwiKDIsIDQpXCIpO1xufVxuXG4iLCJcbi8qXG5Db3B5cmlnaHQgMjAxMyBTdWIgUHJvdG9jb2wgYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuaHR0cDovL3N1YnByb3RvY29sLmNvbS9cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xud2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5wZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbnRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbmluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5NRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5XSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiovXG5cbi8vIGdlbmVyaWMgdmVybGV0IGVudGl0aWVzXG5cbnZhciBWZXJsZXRKUyA9IHJlcXVpcmUoJy4vdmVybGV0JylcbnZhciBQYXJ0aWNsZSA9IFZlcmxldEpTLlBhcnRpY2xlXG52YXIgY29uc3RyYWludHMgPSByZXF1aXJlKCcuL2NvbnN0cmFpbnQnKVxudmFyIERpc3RhbmNlQ29uc3RyYWludCA9IGNvbnN0cmFpbnRzLkRpc3RhbmNlQ29uc3RyYWludFxuXG5WZXJsZXRKUy5wcm90b3R5cGUucG9pbnQgPSBmdW5jdGlvbihwb3MpIHtcblx0dmFyIGNvbXBvc2l0ZSA9IG5ldyB0aGlzLkNvbXBvc2l0ZSgpO1xuXHRjb21wb3NpdGUucGFydGljbGVzLnB1c2gobmV3IFBhcnRpY2xlKHBvcykpO1xuXHR0aGlzLmNvbXBvc2l0ZXMucHVzaChjb21wb3NpdGUpO1xuXHRyZXR1cm4gY29tcG9zaXRlO1xufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUubGluZVNlZ21lbnRzID0gZnVuY3Rpb24odmVydGljZXMsIHN0aWZmbmVzcykge1xuXHR2YXIgaTtcblx0XG5cdHZhciBjb21wb3NpdGUgPSBuZXcgdGhpcy5Db21wb3NpdGUoKTtcblx0XG5cdGZvciAoaSBpbiB2ZXJ0aWNlcykge1xuXHRcdGNvbXBvc2l0ZS5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUodmVydGljZXNbaV0pKTtcblx0XHRpZiAoaSA+IDApXG5cdFx0XHRjb21wb3NpdGUuY29uc3RyYWludHMucHVzaChuZXcgRGlzdGFuY2VDb25zdHJhaW50KGNvbXBvc2l0ZS5wYXJ0aWNsZXNbaV0sIGNvbXBvc2l0ZS5wYXJ0aWNsZXNbaS0xXSwgc3RpZmZuZXNzKSk7XG5cdH1cblx0XG5cdHRoaXMuY29tcG9zaXRlcy5wdXNoKGNvbXBvc2l0ZSk7XG5cdHJldHVybiBjb21wb3NpdGU7XG59XG5cblZlcmxldEpTLnByb3RvdHlwZS5jbG90aCA9IGZ1bmN0aW9uKG9yaWdpbiwgd2lkdGgsIGhlaWdodCwgc2VnbWVudHMsIHBpbk1vZCwgc3RpZmZuZXNzKSB7XG5cdFxuXHR2YXIgY29tcG9zaXRlID0gbmV3IHRoaXMuQ29tcG9zaXRlKCk7XG5cdFxuXHR2YXIgeFN0cmlkZSA9IHdpZHRoL3NlZ21lbnRzO1xuXHR2YXIgeVN0cmlkZSA9IGhlaWdodC9zZWdtZW50cztcblx0XG5cdHZhciB4LHk7XG5cdGZvciAoeT0wO3k8c2VnbWVudHM7Kyt5KSB7XG5cdFx0Zm9yICh4PTA7eDxzZWdtZW50czsrK3gpIHtcblx0XHRcdHZhciBweCA9IG9yaWdpbi54ICsgeCp4U3RyaWRlIC0gd2lkdGgvMiArIHhTdHJpZGUvMjtcblx0XHRcdHZhciBweSA9IG9yaWdpbi55ICsgeSp5U3RyaWRlIC0gaGVpZ2h0LzIgKyB5U3RyaWRlLzI7XG5cdFx0XHRjb21wb3NpdGUucGFydGljbGVzLnB1c2gobmV3IFBhcnRpY2xlKG5ldyBWZWMyKHB4LCBweSkpKTtcblx0XHRcdFxuXHRcdFx0aWYgKHggPiAwKVxuXHRcdFx0XHRjb21wb3NpdGUuY29uc3RyYWludHMucHVzaChuZXcgRGlzdGFuY2VDb25zdHJhaW50KGNvbXBvc2l0ZS5wYXJ0aWNsZXNbeSpzZWdtZW50cyt4XSwgY29tcG9zaXRlLnBhcnRpY2xlc1t5KnNlZ21lbnRzK3gtMV0sIHN0aWZmbmVzcykpO1xuXHRcdFx0XG5cdFx0XHRpZiAoeSA+IDApXG5cdFx0XHRcdGNvbXBvc2l0ZS5jb25zdHJhaW50cy5wdXNoKG5ldyBEaXN0YW5jZUNvbnN0cmFpbnQoY29tcG9zaXRlLnBhcnRpY2xlc1t5KnNlZ21lbnRzK3hdLCBjb21wb3NpdGUucGFydGljbGVzWyh5LTEpKnNlZ21lbnRzK3hdLCBzdGlmZm5lc3MpKTtcblx0XHR9XG5cdH1cblx0XG5cdGZvciAoeD0wO3g8c2VnbWVudHM7Kyt4KSB7XG5cdFx0aWYgKHglcGluTW9kID09IDApXG5cdFx0Y29tcG9zaXRlLnBpbih4KTtcblx0fVxuXHRcblx0dGhpcy5jb21wb3NpdGVzLnB1c2goY29tcG9zaXRlKTtcblx0cmV0dXJuIGNvbXBvc2l0ZTtcbn1cblxuVmVybGV0SlMucHJvdG90eXBlLnRpcmUgPSBmdW5jdGlvbihvcmlnaW4sIHJhZGl1cywgc2VnbWVudHMsIHNwb2tlU3RpZmZuZXNzLCB0cmVhZFN0aWZmbmVzcykge1xuXHR2YXIgc3RyaWRlID0gKDIqTWF0aC5QSSkvc2VnbWVudHM7XG5cdHZhciBpO1xuXHRcblx0dmFyIGNvbXBvc2l0ZSA9IG5ldyB0aGlzLkNvbXBvc2l0ZSgpO1xuXHRcblx0Ly8gcGFydGljbGVzXG5cdGZvciAoaT0wO2k8c2VnbWVudHM7KytpKSB7XG5cdFx0dmFyIHRoZXRhID0gaSpzdHJpZGU7XG5cdFx0Y29tcG9zaXRlLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZShuZXcgVmVjMihvcmlnaW4ueCArIE1hdGguY29zKHRoZXRhKSpyYWRpdXMsIG9yaWdpbi55ICsgTWF0aC5zaW4odGhldGEpKnJhZGl1cykpKTtcblx0fVxuXHRcblx0dmFyIGNlbnRlciA9IG5ldyBQYXJ0aWNsZShvcmlnaW4pO1xuXHRjb21wb3NpdGUucGFydGljbGVzLnB1c2goY2VudGVyKTtcblx0XG5cdC8vIGNvbnN0cmFpbnRzXG5cdGZvciAoaT0wO2k8c2VnbWVudHM7KytpKSB7XG5cdFx0Y29tcG9zaXRlLmNvbnN0cmFpbnRzLnB1c2gobmV3IERpc3RhbmNlQ29uc3RyYWludChjb21wb3NpdGUucGFydGljbGVzW2ldLCBjb21wb3NpdGUucGFydGljbGVzWyhpKzEpJXNlZ21lbnRzXSwgdHJlYWRTdGlmZm5lc3MpKTtcblx0XHRjb21wb3NpdGUuY29uc3RyYWludHMucHVzaChuZXcgRGlzdGFuY2VDb25zdHJhaW50KGNvbXBvc2l0ZS5wYXJ0aWNsZXNbaV0sIGNlbnRlciwgc3Bva2VTdGlmZm5lc3MpKVxuXHRcdGNvbXBvc2l0ZS5jb25zdHJhaW50cy5wdXNoKG5ldyBEaXN0YW5jZUNvbnN0cmFpbnQoY29tcG9zaXRlLnBhcnRpY2xlc1tpXSwgY29tcG9zaXRlLnBhcnRpY2xlc1soaSs1KSVzZWdtZW50c10sIHRyZWFkU3RpZmZuZXNzKSk7XG5cdH1cblx0XHRcblx0dGhpcy5jb21wb3NpdGVzLnB1c2goY29tcG9zaXRlKTtcblx0cmV0dXJuIGNvbXBvc2l0ZTtcbn1cblxuIiwiXG4vKlxuQ29weXJpZ2h0IDIwMTMgU3ViIFByb3RvY29sIGFuZCBvdGhlciBjb250cmlidXRvcnNcbmh0dHA6Ly9zdWJwcm90b2NvbC5jb20vXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbk5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbkxJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbk9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG58fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xufTtcblxudmFyIFZlYzIgPSByZXF1aXJlKCd2ZWMyJykuaW5qZWN0KGZ1bmN0aW9uIChlKSB7cmV0dXJuIGV9KVxuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBWZXJsZXRKU1xuZXhwb3J0cy5QYXJ0aWNsZSA9IFBhcnRpY2xlXG5leHBvcnRzLkNvbXBvc2l0ZSA9IENvbXBvc2l0ZVxuXG5mdW5jdGlvbiBQYXJ0aWNsZShwb3MpIHtcblx0dGhpcy5wb3MgPSBuZXcgVmVjMihwb3MpO1xuXHR0aGlzLmxhc3RQb3MgPSBuZXcgVmVjMihwb3MpO1xufVxuXG5QYXJ0aWNsZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuXHRjdHguYmVnaW5QYXRoKCk7XG5cdGN0eC5hcmModGhpcy5wb3MueCwgdGhpcy5wb3MueSwgMiwgMCwgMipNYXRoLlBJKTtcblx0Y3R4LmZpbGxTdHlsZSA9IFwiIzJkYWQ4ZlwiO1xuXHRjdHguZmlsbCgpO1xufVxuXG5mdW5jdGlvbiBWZXJsZXRKUyh3aWR0aCwgaGVpZ2h0LCBjYW52YXMpIHtcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0dGhpcy5jYW52YXMgPSBjYW52YXM7XG5cdHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0dGhpcy5tb3VzZSA9IG5ldyBWZWMyKDAsMCk7XG5cdHRoaXMubW91c2VEb3duID0gZmFsc2U7XG5cdHRoaXMuZHJhZ2dlZEVudGl0eSA9IG51bGw7XG5cdHRoaXMuc2VsZWN0aW9uUmFkaXVzID0gMjA7XG5cdHRoaXMuaGlnaGxpZ2h0Q29sb3IgPSBcIiM0ZjU0NWNcIjtcblx0XG5cdHRoaXMuYm91bmRzID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG5cdFx0aWYgKHBhcnRpY2xlLnBvcy55ID4gdGhpcy5oZWlnaHQtMSlcblx0XHRcdHBhcnRpY2xlLnBvcy55ID0gdGhpcy5oZWlnaHQtMTtcblx0XHRcblx0XHRpZiAocGFydGljbGUucG9zLnggPCAwKVxuXHRcdFx0cGFydGljbGUucG9zLnggPSAwO1xuXG5cdFx0aWYgKHBhcnRpY2xlLnBvcy54ID4gdGhpcy53aWR0aC0xKVxuXHRcdFx0cGFydGljbGUucG9zLnggPSB0aGlzLndpZHRoLTE7XG5cdH1cblx0XG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQvLyBwcmV2ZW50IGNvbnRleHQgbWVudVxuXHR0aGlzLmNhbnZhcy5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0fTtcblx0XG5cdHRoaXMuY2FudmFzLm9ubW91c2Vkb3duID0gZnVuY3Rpb24oZSkge1xuXHRcdF90aGlzLm1vdXNlRG93biA9IHRydWU7XG5cdFx0dmFyIG5lYXJlc3QgPSBfdGhpcy5uZWFyZXN0RW50aXR5KCk7XG5cdFx0aWYgKG5lYXJlc3QpIHtcblx0XHRcdF90aGlzLmRyYWdnZWRFbnRpdHkgPSBuZWFyZXN0O1xuXHRcdH1cblx0fTtcblx0XG5cdHRoaXMuY2FudmFzLm9ubW91c2V1cCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRfdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcblx0XHRfdGhpcy5kcmFnZ2VkRW50aXR5ID0gbnVsbDtcblx0fTtcblx0XG5cdHRoaXMuY2FudmFzLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24oZSkge1xuXHRcdHZhciByZWN0ID0gX3RoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdF90aGlzLm1vdXNlLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG5cdFx0X3RoaXMubW91c2UueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXHR9OyAgXG5cdFxuXHQvLyBzaW11bGF0aW9uIHBhcmFtc1xuXHR0aGlzLmdyYXZpdHkgPSBuZXcgVmVjMigwLDAuMik7XG5cdHRoaXMuZnJpY3Rpb24gPSAwLjk5O1xuXHR0aGlzLmdyb3VuZEZyaWN0aW9uID0gMC44O1xuXHRcblx0Ly8gaG9sZHMgY29tcG9zaXRlIGVudGl0aWVzXG5cdHRoaXMuY29tcG9zaXRlcyA9IFtdO1xufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUuQ29tcG9zaXRlID0gQ29tcG9zaXRlXG5cbmZ1bmN0aW9uIENvbXBvc2l0ZSgpIHtcblx0dGhpcy5wYXJ0aWNsZXMgPSBbXTtcblx0dGhpcy5jb25zdHJhaW50cyA9IFtdO1xuXHRcblx0dGhpcy5kcmF3UGFydGljbGVzID0gbnVsbDtcblx0dGhpcy5kcmF3Q29uc3RyYWludHMgPSBudWxsO1xufVxuXG5Db21wb3NpdGUucHJvdG90eXBlLnBpbiA9IGZ1bmN0aW9uKGluZGV4LCBwb3MpIHtcblx0cG9zID0gcG9zIHx8IHRoaXMucGFydGljbGVzW2luZGV4XS5wb3M7XG5cdHZhciBwYyA9IG5ldyBQaW5Db25zdHJhaW50KHRoaXMucGFydGljbGVzW2luZGV4XSwgcG9zKTtcblx0dGhpcy5jb25zdHJhaW50cy5wdXNoKHBjKTtcblx0cmV0dXJuIHBjO1xufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUuZnJhbWUgPSBmdW5jdGlvbihzdGVwKSB7XG5cdHZhciBpLCBqLCBjO1xuXG5cdGZvciAoYyBpbiB0aGlzLmNvbXBvc2l0ZXMpIHtcblx0XHRmb3IgKGkgaW4gdGhpcy5jb21wb3NpdGVzW2NdLnBhcnRpY2xlcykge1xuXHRcdFx0dmFyIHBhcnRpY2xlcyA9IHRoaXMuY29tcG9zaXRlc1tjXS5wYXJ0aWNsZXM7XG5cdFx0XHRcblx0XHRcdC8vIGNhbGN1bGF0ZSB2ZWxvY2l0eVxuXHRcdFx0dmFyIHZlbG9jaXR5ID0gcGFydGljbGVzW2ldLnBvc1xuXHRcdFx0XHRcdC5zdWJ0cmFjdChwYXJ0aWNsZXNbaV0ubGFzdFBvcywgdHJ1ZSlcblx0XHRcdFx0XHQubXVsdGlwbHkodGhpcy5mcmljdGlvbik7XG5cdFxuXHRcdFx0Ly8gZ3JvdW5kIGZyaWN0aW9uXG5cdFx0XHRpZiAocGFydGljbGVzW2ldLnBvcy55ID49IHRoaXMuaGVpZ2h0LTEgJiYgdmVsb2NpdHkubGVuZ3RoU3F1YXJlZCgpID4gMC4wMDAwMDEpIHtcblx0XHRcdFx0dmFyIG0gPSB2ZWxvY2l0eS5sZW5ndGgoKTtcblx0XHRcdFx0dmVsb2NpdHkueCAvPSBtO1xuXHRcdFx0XHR2ZWxvY2l0eS55IC89IG07XG5cdFx0XHRcdHZlbG9jaXR5Lm11bHRpcGx5KG0qdGhpcy5ncm91bmRGcmljdGlvbik7XG5cdFx0XHR9XG5cdFx0XG5cdFx0XHQvLyBzYXZlIGxhc3QgZ29vZCBzdGF0ZVxuXHRcdFx0cGFydGljbGVzW2ldLmxhc3RQb3Muc2V0KHBhcnRpY2xlc1tpXS5wb3MpO1xuXHRcdFxuXHRcdFx0Ly8gZ3Jhdml0eVxuXHRcdFx0cGFydGljbGVzW2ldLnBvcy5hZGQodGhpcy5ncmF2aXR5KTtcblx0XHRcblx0XHRcdC8vIGluZXJ0aWEgIFxuXHRcdFx0cGFydGljbGVzW2ldLnBvcy5hZGQodmVsb2NpdHkpO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gaGFuZGxlIGRyYWdnaW5nIG9mIGVudGl0aWVzXG5cdGlmICh0aGlzLmRyYWdnZWRFbnRpdHkpXG5cdFx0dGhpcy5kcmFnZ2VkRW50aXR5LnBvcy5zZXQodGhpcy5tb3VzZSk7XG5cdFx0XG5cdC8vIHJlbGF4XG5cdHZhciBzdGVwQ29lZiA9IDEvc3RlcDtcblx0Zm9yIChjIGluIHRoaXMuY29tcG9zaXRlcykge1xuXHRcdHZhciBjb25zdHJhaW50cyA9IHRoaXMuY29tcG9zaXRlc1tjXS5jb25zdHJhaW50cztcblx0XHRmb3IgKGk9MDtpPHN0ZXA7KytpKVxuXHRcdFx0Zm9yIChqIGluIGNvbnN0cmFpbnRzKVxuXHRcdFx0XHRjb25zdHJhaW50c1tqXS5yZWxheChzdGVwQ29lZik7XG5cdH1cblx0XG5cdC8vIGJvdW5kcyBjaGVja2luZ1xuXHRmb3IgKGMgaW4gdGhpcy5jb21wb3NpdGVzKSB7XG5cdFx0dmFyIHBhcnRpY2xlcyA9IHRoaXMuY29tcG9zaXRlc1tjXS5wYXJ0aWNsZXM7XG5cdFx0Zm9yIChpIGluIHBhcnRpY2xlcylcblx0XHRcdHRoaXMuYm91bmRzKHBhcnRpY2xlc1tpXSk7XG5cdH1cbn1cblxuVmVybGV0SlMucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcblx0dmFyIGksIGM7XG5cdFxuXHR0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7ICBcblx0XG5cdGZvciAoYyBpbiB0aGlzLmNvbXBvc2l0ZXMpIHtcblx0XHQvLyBkcmF3IGNvbnN0cmFpbnRzXG5cdFx0aWYgKHRoaXMuY29tcG9zaXRlc1tjXS5kcmF3Q29uc3RyYWludHMpIHtcblx0XHRcdHRoaXMuY29tcG9zaXRlc1tjXS5kcmF3Q29uc3RyYWludHModGhpcy5jdHgsIHRoaXMuY29tcG9zaXRlc1tjXSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBjb25zdHJhaW50cyA9IHRoaXMuY29tcG9zaXRlc1tjXS5jb25zdHJhaW50cztcblx0XHRcdGZvciAoaSBpbiBjb25zdHJhaW50cylcblx0XHRcdFx0Y29uc3RyYWludHNbaV0uZHJhdyh0aGlzLmN0eCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIGRyYXcgcGFydGljbGVzXG5cdFx0aWYgKHRoaXMuY29tcG9zaXRlc1tjXS5kcmF3UGFydGljbGVzKSB7XG5cdFx0XHR0aGlzLmNvbXBvc2l0ZXNbY10uZHJhd1BhcnRpY2xlcyh0aGlzLmN0eCwgdGhpcy5jb21wb3NpdGVzW2NdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRpY2xlcyA9IHRoaXMuY29tcG9zaXRlc1tjXS5wYXJ0aWNsZXM7XG5cdFx0XHRmb3IgKGkgaW4gcGFydGljbGVzKVxuXHRcdFx0XHRwYXJ0aWNsZXNbaV0uZHJhdyh0aGlzLmN0eCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gaGlnaGxpZ2h0IG5lYXJlc3QgLyBkcmFnZ2VkIGVudGl0eVxuXHR2YXIgbmVhcmVzdCA9IHRoaXMuZHJhZ2dlZEVudGl0eSB8fCB0aGlzLm5lYXJlc3RFbnRpdHkoKTtcblx0aWYgKG5lYXJlc3QpIHtcblx0XHR0aGlzLmN0eC5iZWdpblBhdGgoKTtcblx0XHR0aGlzLmN0eC5hcmMobmVhcmVzdC5wb3MueCwgbmVhcmVzdC5wb3MueSwgOCwgMCwgMipNYXRoLlBJKTtcblx0XHR0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMuaGlnaGxpZ2h0Q29sb3I7XG5cdFx0dGhpcy5jdHguc3Ryb2tlKCk7XG5cdH1cbn1cblxuVmVybGV0SlMucHJvdG90eXBlLm5lYXJlc3RFbnRpdHkgPSBmdW5jdGlvbigpIHtcblx0dmFyIGMsIGk7XG5cdHZhciBkMk5lYXJlc3QgPSAwO1xuXHR2YXIgZW50aXR5ID0gbnVsbDtcblx0dmFyIGNvbnN0cmFpbnRzTmVhcmVzdCA9IG51bGw7XG5cdFxuXHQvLyBmaW5kIG5lYXJlc3QgcG9pbnRcblx0Zm9yIChjIGluIHRoaXMuY29tcG9zaXRlcykge1xuXHRcdHZhciBwYXJ0aWNsZXMgPSB0aGlzLmNvbXBvc2l0ZXNbY10ucGFydGljbGVzO1xuXHRcdGZvciAoaSBpbiBwYXJ0aWNsZXMpIHtcblx0XHRcdHZhciBkMiA9IHBhcnRpY2xlc1tpXS5wb3MuZGlzdGFuY2UodGhpcy5tb3VzZSk7XG5cdFx0XHRpZiAoZDIgPD0gdGhpcy5zZWxlY3Rpb25SYWRpdXMqdGhpcy5zZWxlY3Rpb25SYWRpdXMgJiYgKGVudGl0eSA9PSBudWxsIHx8IGQyIDwgZDJOZWFyZXN0KSkge1xuXHRcdFx0XHRlbnRpdHkgPSBwYXJ0aWNsZXNbaV07XG5cdFx0XHRcdGNvbnN0cmFpbnRzTmVhcmVzdCA9IHRoaXMuY29tcG9zaXRlc1tjXS5jb25zdHJhaW50cztcblx0XHRcdFx0ZDJOZWFyZXN0ID0gZDI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBzZWFyY2ggZm9yIHBpbm5lZCBjb25zdHJhaW50cyBmb3IgdGhpcyBlbnRpdHlcblx0Zm9yIChpIGluIGNvbnN0cmFpbnRzTmVhcmVzdClcblx0XHRpZiAoY29uc3RyYWludHNOZWFyZXN0W2ldIGluc3RhbmNlb2YgUGluQ29uc3RyYWludCAmJiBjb25zdHJhaW50c05lYXJlc3RbaV0uYSA9PSBlbnRpdHkpXG5cdFx0XHRlbnRpdHkgPSBjb25zdHJhaW50c05lYXJlc3RbaV07XG5cdFxuXHRyZXR1cm4gZW50aXR5O1xufVxuXG4iLCJcbi8qXG5Db3B5cmlnaHQgMjAxMyBTdWIgUHJvdG9jb2wgYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuaHR0cDovL3N1YnByb3RvY29sLmNvbS9cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xud2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5wZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbnRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbmluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5NRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5XSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiovXG5cbi8vIERpc3RhbmNlQ29uc3RyYWludCAtLSBjb25zdHJhaW5zIHRvIGluaXRpYWwgZGlzdGFuY2Vcbi8vIFBpbkNvbnN0cmFpbnQgLS0gY29uc3RyYWlucyB0byBzdGF0aWMvZml4ZWQgcG9pbnRcbi8vIEFuZ2xlQ29uc3RyYWludCAtLSBjb25zdHJhaW5zIDMgcGFydGljbGVzIHRvIGFuIGFuZ2xlXG5cbnZhciBWZWMyID0gcmVxdWlyZSgndmVjMicpLmluamVjdChmdW5jdGlvbihlKSB7cmV0dXJuIGV9KVxuXG5leHBvcnRzLkRpc3RhbmNlQ29uc3RyYWludCA9IERpc3RhbmNlQ29uc3RyYWludFxuZXhwb3J0cy5QaW5Db25zdHJhaW50ID0gUGluQ29uc3RyYWludFxuZXhwb3J0cy5BbmdsZUNvbnN0cmFpbnQgPSBBbmdsZUNvbnN0cmFpbnRcblxuZnVuY3Rpb24gRGlzdGFuY2VDb25zdHJhaW50KGEsIGIsIHN0aWZmbmVzcywgZGlzdGFuY2UgLypvcHRpb25hbCovKSB7XG5cdHRoaXMuYSA9IGE7XG5cdHRoaXMuYiA9IGI7XG5cdHRoaXMuZGlzdGFuY2UgPSB0eXBlb2YgZGlzdGFuY2UgIT0gXCJ1bmRlZmluZWRcIiA/IGRpc3RhbmNlIDogYS5wb3MuZGlzdGFuY2UoYi5wb3MpO1xuXHR0aGlzLnN0aWZmbmVzcyA9IHN0aWZmbmVzcztcblx0dGhpcy5ub3JtYWwgPSB0aGlzLmEucG9zLnN1YnRyYWN0KHRoaXMuYi5wb3MsIHRydWUpXG59XG5cbkRpc3RhbmNlQ29uc3RyYWludC5wcm90b3R5cGUucmVsYXggPSBmdW5jdGlvbihzdGVwQ29lZikge1xuXHR2YXIgYSA9IHRoaXMuYS5wb3Ncblx0dmFyIGIgPSB0aGlzLmIucG9zXG5cdHZhciBub3JtYWwgPSB0aGlzLm5vcm1hbC5zZXQoYS54IC0gYi54LCBhLnkgLSBiLnkpXG5cdC8vLnN1YnRyYWN0KHRoaXMuYi5wb3MpO1xuXHR2YXIgbSA9IG5vcm1hbC5sZW5ndGhTcXVhcmVkKCk7XG5cdG5vcm1hbC5tdWx0aXBseSgoKHRoaXMuZGlzdGFuY2UqdGhpcy5kaXN0YW5jZSAtIG0pL20pKnRoaXMuc3RpZmZuZXNzKnN0ZXBDb2VmKTtcblx0dGhpcy5hLnBvcy5hZGQobm9ybWFsKTtcblx0dGhpcy5iLnBvcy5zdWJ0cmFjdChub3JtYWwpO1xufVxuXG5EaXN0YW5jZUNvbnN0cmFpbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcblx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRjdHgubW92ZVRvKHRoaXMuYS5wb3MueCwgdGhpcy5hLnBvcy55KTtcblx0Y3R4LmxpbmVUbyh0aGlzLmIucG9zLngsIHRoaXMuYi5wb3MueSk7XG5cdGN0eC5zdHJva2VTdHlsZSA9IFwiI2Q4ZGRlMlwiO1xuXHRjdHguc3Ryb2tlKCk7XG59XG5cblxuZnVuY3Rpb24gUGluQ29uc3RyYWludChhLCBwb3MpIHtcblx0dGhpcy5hID0gYTtcblx0dGhpcy5wb3MgPSAobmV3IFZlYzIoKSkuc2V0KHBvcyk7XG59XG5cblBpbkNvbnN0cmFpbnQucHJvdG90eXBlLnJlbGF4ID0gZnVuY3Rpb24oc3RlcENvZWYpIHtcblx0dGhpcy5hLnBvcy5zZXQodGhpcy5wb3MpO1xufVxuXG5QaW5Db25zdHJhaW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG5cdGN0eC5iZWdpblBhdGgoKTtcblx0Y3R4LmFyYyh0aGlzLnBvcy54LCB0aGlzLnBvcy55LCA2LCAwLCAyKk1hdGguUEkpO1xuXHRjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsMTUzLDI1NSwwLjEpXCI7XG5cdGN0eC5maWxsKCk7XG59XG5cblxuZnVuY3Rpb24gQW5nbGVDb25zdHJhaW50KGEsIGIsIGMsIHN0aWZmbmVzcykge1xuXHR0aGlzLmEgPSBhO1xuXHR0aGlzLmIgPSBiO1xuXHR0aGlzLmMgPSBjO1xuXHR0aGlzLmFuZ2xlID0gdGhpcy5iLnBvcy5hbmdsZVRvKHRoaXMuYS5wb3MsIHRoaXMuYy5wb3MpO1xuXHR0aGlzLnN0aWZmbmVzcyA9IHN0aWZmbmVzcztcbn1cblxuZnVuY3Rpb24gYW5nbGUyKGEsIGIsIGMpIHtcblx0Yi5zdWIoYSwgdHJ1ZSkuYW5nbGVUbyhjKVxufVxuXG5mdW5jdGlvbiByb3RhdGUoc2VsZiwgb3JpZ2luLCB0aGV0YSkge1xuXHR2YXIgeCA9IHNlbGYueCAtIG9yaWdpbi54O1xuXHR2YXIgeSA9IHNlbGYueSAtIG9yaWdpbi55O1xuXHRyZXR1cm4gbmV3IFZlYzIoeCpNYXRoLmNvcyh0aGV0YSkgLSB5Kk1hdGguc2luKHRoZXRhKSArIG9yaWdpbi54LCB4Kk1hdGguc2luKHRoZXRhKSArIHkqTWF0aC5jb3ModGhldGEpICsgb3JpZ2luLnkpO1xufVxuXG5BbmdsZUNvbnN0cmFpbnQucHJvdG90eXBlLnJlbGF4ID0gZnVuY3Rpb24oc3RlcENvZWYpIHtcblx0dmFyIGFuZ2xlID0gYW5nbGUyKHRoaXMuYi5wb3MsIHRoaXMuYS5wb3MsIHRoaXMuYy5wb3MpXG5cdC8vdGhpcy5iLnBvcy5hbmdsZTIodGhpcy5hLnBvcywgdGhpcy5jLnBvcyk7XG5cdHZhciBkaWZmID0gYW5nbGUgLSB0aGlzLmFuZ2xlO1xuXHRcblx0aWYgKGRpZmYgPD0gLU1hdGguUEkpXG5cdFx0ZGlmZiArPSAyKk1hdGguUEk7XG5cdGVsc2UgaWYgKGRpZmYgPj0gTWF0aC5QSSlcblx0XHRkaWZmIC09IDIqTWF0aC5QSTtcblxuXHRkaWZmICo9IHN0ZXBDb2VmKnRoaXMuc3RpZmZuZXNzO1xuXHRcblx0dGhpcy5hLnBvcyA9IHJvdGF0ZSh0aGlzLmEucG9zLCB0aGlzLmIucG9zLCBkaWZmKTtcblx0dGhpcy5jLnBvcyA9IHJvdGF0ZSh0aGlzLmMucG9zLCB0aGlzLmIucG9zLCAtZGlmZik7XG5cdHRoaXMuYi5wb3MgPSByb3RhdGUodGhpcy5iLnBvcywgdGhpcy5hLnBvcywgZGlmZik7XG5cdHRoaXMuYi5wb3MgPSByb3RhdGUodGhpcy5iLnBvcywgdGhpcy5jLnBvcywgLWRpZmYpO1xufVxuXG5BbmdsZUNvbnN0cmFpbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcblx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRjdHgubW92ZVRvKHRoaXMuYS5wb3MueCwgdGhpcy5hLnBvcy55KTtcblx0Y3R4LmxpbmVUbyh0aGlzLmIucG9zLngsIHRoaXMuYi5wb3MueSk7XG5cdGN0eC5saW5lVG8odGhpcy5jLnBvcy54LCB0aGlzLmMucG9zLnkpO1xuXHR2YXIgdG1wID0gY3R4LmxpbmVXaWR0aDtcblx0Y3R4LmxpbmVXaWR0aCA9IDU7XG5cdGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsMjU1LDAsMC4yKVwiO1xuXHRjdHguc3Ryb2tlKCk7XG5cdGN0eC5saW5lV2lkdGggPSB0bXA7XG59XG4iLCI7KGZ1bmN0aW9uIGluamVjdChjbGVhbiwgcHJlY2lzaW9uLCB1bmRlZikge1xuXG4gIGZ1bmN0aW9uIFZlYzIoeCwgeSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBWZWMyKSkge1xuICAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHkpO1xuICAgIH1cblxuICAgIGlmKCdvYmplY3QnID09PSB0eXBlb2YgeCAmJiB4KSB7XG4gICAgICB0aGlzLnkgPSB4LnkgfHwgMDtcbiAgICAgIHRoaXMueCA9IHgueCB8fCAwO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy54ID0gVmVjMi5jbGVhbih4IHx8IDApO1xuICAgIHRoaXMueSA9IFZlYzIuY2xlYW4oeSB8fCAwKTtcbiAgfTtcblxuICBWZWMyLnByb3RvdHlwZSA9IHtcbiAgICBjaGFuZ2UgOiBmdW5jdGlvbihmbikge1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVycykge1xuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goZm4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW2ZuXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9ic2VydmVycykge1xuICAgICAgICBmb3IgKHZhciBpPXRoaXMub2JzZXJ2ZXJzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLm9ic2VydmVyc1tpXSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgaWdub3JlIDogZnVuY3Rpb24oZm4pIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnMuZmlsdGVyKGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIHJldHVybiBjYiAhPT0gZm47XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGRpcnR5IDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9kaXJ0eSA9IHRydWVcbiAgICAgIHRoaXMuX19jYWNoZWRMZW5ndGggPSBudWxsXG4gICAgICB0aGlzLl9fY2FjaGVkTGVuZ3RoU3F1YXJlZCA9IG51bGxcbiAgICB9LFxuXG4gICAgLy8gc2V0IHggYW5kIHlcbiAgICBzZXQ6IGZ1bmN0aW9uKHgsIHksIHNpbGVudCkge1xuICAgICAgaWYoJ251bWJlcicgIT0gdHlwZW9mIHgpIHtcbiAgICAgICAgc2lsZW50ID0geTtcbiAgICAgICAgeSA9IHgueTtcbiAgICAgICAgeCA9IHgueDtcbiAgICAgIH1cbiAgICAgIGlmKHRoaXMueCA9PT0geCAmJiB0aGlzLnkgPT09IHkpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICB0aGlzLnggPSBWZWMyLmNsZWFuKHgpO1xuICAgICAgdGhpcy55ID0gVmVjMi5jbGVhbih5KTtcblxuICAgICAgdGhpcy5kaXJ0eSgpXG4gICAgICBpZihzaWxlbnQgIT09IGZhbHNlKVxuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2UoKTtcbiAgICB9LFxuXG4gICAgLy8gcmVzZXQgeCBhbmQgeSB0byB6ZXJvXG4gICAgemVybyA6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KDAsIDApO1xuICAgIH0sXG5cbiAgICAvLyByZXR1cm4gYSBuZXcgdmVjdG9yIHdpdGggdGhlIHNhbWUgY29tcG9uZW50IHZhbHVlc1xuICAgIC8vIGFzIHRoaXMgb25lXG4gICAgY2xvbmUgOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLngsIHRoaXMueSk7XG4gICAgfSxcblxuICAgIC8vIG5lZ2F0ZSB0aGUgdmFsdWVzIG9mIHRoaXMgdmVjdG9yXG4gICAgbmVnYXRlIDogZnVuY3Rpb24ocmV0dXJuTmV3KSB7XG4gICAgICBpZiAocmV0dXJuTmV3KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMigtdGhpcy54LCAtdGhpcy55KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldCgtdGhpcy54LCAtdGhpcy55KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQWRkIHRoZSBpbmNvbWluZyBgdmVjMmAgdmVjdG9yIHRvIHRoaXMgdmVjdG9yXG4gICAgYWRkIDogZnVuY3Rpb24odmVjMiwgcmV0dXJuTmV3KSB7XG4gICAgICBpZiAoIXJldHVybk5ldykge1xuICAgICAgICB0aGlzLnggKz0gdmVjMi54OyB0aGlzLnkgKz0gdmVjMi55O1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2UoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmV0dXJuIGEgbmV3IHZlY3RvciBpZiBgcmV0dXJuTmV3YCBpcyB0cnV0aHlcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKFxuICAgICAgICAgIHRoaXMueCArIHZlYzIueCxcbiAgICAgICAgICB0aGlzLnkgKyB2ZWMyLnlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gU3VidHJhY3QgdGhlIGluY29taW5nIGB2ZWMyYCBmcm9tIHRoaXMgdmVjdG9yXG4gICAgc3VidHJhY3QgOiBmdW5jdGlvbih2ZWMyLCByZXR1cm5OZXcpIHtcbiAgICAgIGlmICghcmV0dXJuTmV3KSB7XG4gICAgICAgIHRoaXMueCAtPSB2ZWMyLng7IHRoaXMueSAtPSB2ZWMyLnk7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZXR1cm4gYSBuZXcgdmVjdG9yIGlmIGByZXR1cm5OZXdgIGlzIHRydXRoeVxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoXG4gICAgICAgICAgdGhpcy54IC0gdmVjMi54LFxuICAgICAgICAgIHRoaXMueSAtIHZlYzIueVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBNdWx0aXBseSB0aGlzIHZlY3RvciBieSB0aGUgaW5jb21pbmcgYHZlYzJgXG4gICAgbXVsdGlwbHkgOiBmdW5jdGlvbih2ZWMyLCByZXR1cm5OZXcpIHtcbiAgICAgIHZhciB4LHk7XG4gICAgICBpZiAoJ251bWJlcicgIT09IHR5cGVvZiB2ZWMyKSB7IC8vLnggIT09IHVuZGVmKSB7XG4gICAgICAgIHggPSB2ZWMyLng7XG4gICAgICAgIHkgPSB2ZWMyLnk7XG5cbiAgICAgIC8vIEhhbmRsZSBpbmNvbWluZyBzY2FsYXJzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ID0geSA9IHZlYzI7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmV0dXJuTmV3KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldCh0aGlzLnggKiB4LCB0aGlzLnkgKiB5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihcbiAgICAgICAgICB0aGlzLnggKiB4LFxuICAgICAgICAgIHRoaXMueSAqIHlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUm90YXRlIHRoaXMgdmVjdG9yLiBBY2NlcHRzIGEgYFJvdGF0aW9uYCBvciBhbmdsZSBpbiByYWRpYW5zLlxuICAgIC8vXG4gICAgLy8gUGFzc2luZyBhIHRydXRoeSBgaW52ZXJzZWAgd2lsbCBjYXVzZSB0aGUgcm90YXRpb24gdG9cbiAgICAvLyBiZSByZXZlcnNlZC5cbiAgICAvL1xuICAgIC8vIElmIGByZXR1cm5OZXdgIGlzIHRydXRoeSwgYSBuZXdcbiAgICAvLyBgVmVjMmAgd2lsbCBiZSBjcmVhdGVkIHdpdGggdGhlIHZhbHVlcyByZXN1bHRpbmcgZnJvbVxuICAgIC8vIHRoZSByb3RhdGlvbi4gT3RoZXJ3aXNlIHRoZSByb3RhdGlvbiB3aWxsIGJlIGFwcGxpZWRcbiAgICAvLyB0byB0aGlzIHZlY3RvciBkaXJlY3RseSwgYW5kIHRoaXMgdmVjdG9yIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgcm90YXRlIDogZnVuY3Rpb24ociwgaW52ZXJzZSwgcmV0dXJuTmV3KSB7XG4gICAgICB2YXJcbiAgICAgIHggPSB0aGlzLngsXG4gICAgICB5ID0gdGhpcy55LFxuICAgICAgY29zID0gTWF0aC5jb3MociksXG4gICAgICBzaW4gPSBNYXRoLnNpbihyKSxcbiAgICAgIHJ4LCByeTtcblxuICAgICAgaW52ZXJzZSA9IChpbnZlcnNlKSA/IC0xIDogMTtcblxuICAgICAgcnggPSBjb3MgKiB4IC0gKGludmVyc2UgKiBzaW4pICogeTtcbiAgICAgIHJ5ID0gKGludmVyc2UgKiBzaW4pICogeCArIGNvcyAqIHk7XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHJ4LCByeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXQocngsIHJ5KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3JcbiAgICBsZW5ndGggOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xuICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICB9LFxuXG4gICAgLy8gR2V0IHRoZSBsZW5ndGggc3F1YXJlZC4gRm9yIHBlcmZvcm1hbmNlLCB1c2UgdGhpcyBpbnN0ZWFkIG9mIGBWZWMyI2xlbmd0aGAgKGlmIHBvc3NpYmxlKS5cbiAgICBsZW5ndGhTcXVhcmVkIDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IHRoaXMueCwgeSA9IHRoaXMueTtcbiAgICAgIHJldHVybiB4KngreSp5O1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm4gdGhlIGRpc3RhbmNlIGJldHdlbiB0aGlzIGBWZWMyYCBhbmQgdGhlIGluY29taW5nIHZlYzIgdmVjdG9yXG4gICAgLy8gYW5kIHJldHVybiBhIHNjYWxhclxuICAgIGRpc3RhbmNlIDogZnVuY3Rpb24odmVjMikge1xuICAgICAgdmFyIHggPSB0aGlzLnggLSB2ZWMyLng7XG4gICAgICB2YXIgeSA9IHRoaXMueSAtIHZlYzIueTtcbiAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4ICsgeSp5KVxuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IHRoaXMgdmVjdG9yIGludG8gYSB1bml0IHZlY3Rvci5cbiAgICAvLyBSZXR1cm5zIHRoZSBsZW5ndGguXG4gICAgbm9ybWFsaXplIDogZnVuY3Rpb24ocmV0dXJuTmV3KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcblxuICAgICAgLy8gQ29sbGVjdCBhIHJhdGlvIHRvIHNocmluayB0aGUgeCBhbmQgeSBjb29yZHNcbiAgICAgIHZhciBpbnZlcnRlZExlbmd0aCA9IChsZW5ndGggPCBOdW1iZXIuTUlOX1ZBTFVFKSA/IDAgOiAxL2xlbmd0aDtcblxuICAgICAgaWYgKCFyZXR1cm5OZXcpIHtcbiAgICAgICAgLy8gQ29udmVydCB0aGUgY29vcmRzIHRvIGJlIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgICAgIC8vIGJ1dCBzbWFsbGVyIHRoYW4gb3IgZXF1YWwgdG8gMS4wXG4gICAgICAgIHJldHVybiB0aGlzLnNldCh0aGlzLnggKiBpbnZlcnRlZExlbmd0aCwgdGhpcy55ICogaW52ZXJ0ZWRMZW5ndGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIGludmVydGVkTGVuZ3RoLCB0aGlzLnkgKiBpbnZlcnRlZExlbmd0aClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRGV0ZXJtaW5lIGlmIGFub3RoZXIgYFZlYzJgJ3MgY29tcG9uZW50cyBtYXRjaCB0aGlzIG9uZSdzXG4gICAgLy8gYWxzbyBhY2NlcHRzIDIgc2NhbGFyc1xuICAgIGVxdWFsIDogZnVuY3Rpb24odiwgdykge1xuICAgICAgaWYgKHcgPT09IHVuZGVmKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy54ID09PSB2LnggJiZcbiAgICAgICAgICB0aGlzLnkgPT0gdi55XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoaXMueCA9PT0gdiAmJlxuICAgICAgICAgIHRoaXMueSA9PT0gd1xuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFJldHVybiBhIG5ldyBgVmVjMmAgdGhhdCBjb250YWlucyB0aGUgYWJzb2x1dGUgdmFsdWUgb2ZcbiAgICAvLyBlYWNoIG9mIHRoaXMgdmVjdG9yJ3MgcGFydHNcbiAgICBhYnMgOiBmdW5jdGlvbihyZXR1cm5OZXcpIHtcbiAgICAgIHZhciB4ID0gTWF0aC5hYnModGhpcy54KSwgeSA9IE1hdGguYWJzKHRoaXMueSk7XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KHgsIHkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBSZXR1cm4gYSBuZXcgYFZlYzJgIGNvbnNpc3Rpbmcgb2YgdGhlIHNtYWxsZXN0IHZhbHVlc1xuICAgIC8vIGZyb20gdGhpcyB2ZWN0b3IgYW5kIHRoZSBpbmNvbWluZ1xuICAgIC8vXG4gICAgLy8gV2hlbiByZXR1cm5OZXcgaXMgdHJ1dGh5LCBhIG5ldyBgVmVjMmAgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIG90aGVyd2lzZSB0aGUgbWluaW11bSB2YWx1ZXMgaW4gZWl0aGVyIHRoaXMgb3IgYHZgIHdpbGxcbiAgICAvLyBiZSBhcHBsaWVkIHRvIHRoaXMgdmVjdG9yLlxuICAgIG1pbiA6IGZ1bmN0aW9uKHYsIHJldHVybk5ldykge1xuICAgICAgdmFyXG4gICAgICB0eCA9IHRoaXMueCxcbiAgICAgIHR5ID0gdGhpcy55LFxuICAgICAgdnggPSB2LngsXG4gICAgICB2eSA9IHYueSxcbiAgICAgIHggPSB0eCA8IHZ4ID8gdHggOiB2eCxcbiAgICAgIHkgPSB0eSA8IHZ5ID8gdHkgOiB2eTtcblxuICAgICAgaWYgKHJldHVybk5ldykge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCwgeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXQoeCwgeSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFJldHVybiBhIG5ldyBgVmVjMmAgY29uc2lzdGluZyBvZiB0aGUgbGFyZ2VzdCB2YWx1ZXNcbiAgICAvLyBmcm9tIHRoaXMgdmVjdG9yIGFuZCB0aGUgaW5jb21pbmdcbiAgICAvL1xuICAgIC8vIFdoZW4gcmV0dXJuTmV3IGlzIHRydXRoeSwgYSBuZXcgYFZlYzJgIHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBvdGhlcndpc2UgdGhlIG1pbmltdW0gdmFsdWVzIGluIGVpdGhlciB0aGlzIG9yIGB2YCB3aWxsXG4gICAgLy8gYmUgYXBwbGllZCB0byB0aGlzIHZlY3Rvci5cbiAgICBtYXggOiBmdW5jdGlvbih2LCByZXR1cm5OZXcpIHtcbiAgICAgIHZhclxuICAgICAgdHggPSB0aGlzLngsXG4gICAgICB0eSA9IHRoaXMueSxcbiAgICAgIHZ4ID0gdi54LFxuICAgICAgdnkgPSB2LnksXG4gICAgICB4ID0gdHggPiB2eCA/IHR4IDogdngsXG4gICAgICB5ID0gdHkgPiB2eSA/IHR5IDogdnk7XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KHgsIHkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBDbGFtcCB2YWx1ZXMgaW50byBhIHJhbmdlLlxuICAgIC8vIElmIHRoaXMgdmVjdG9yJ3MgdmFsdWVzIGFyZSBsb3dlciB0aGFuIHRoZSBgbG93YCdzXG4gICAgLy8gdmFsdWVzLCB0aGVuIHJhaXNlIHRoZW0uICBJZiB0aGV5IGFyZSBoaWdoZXIgdGhhblxuICAgIC8vIGBoaWdoYCdzIHRoZW4gbG93ZXIgdGhlbS5cbiAgICAvL1xuICAgIC8vIFBhc3NpbmcgcmV0dXJuTmV3IGFzIHRydWUgd2lsbCBjYXVzZSBhIG5ldyBWZWMyIHRvIGJlXG4gICAgLy8gcmV0dXJuZWQuICBPdGhlcndpc2UsIHRoaXMgdmVjdG9yJ3MgdmFsdWVzIHdpbGwgYmUgY2xhbXBlZFxuICAgIGNsYW1wIDogZnVuY3Rpb24obG93LCBoaWdoLCByZXR1cm5OZXcpIHtcbiAgICAgIHZhciByZXQgPSB0aGlzLm1pbihoaWdoLCB0cnVlKS5tYXgobG93KVxuICAgICAgaWYgKHJldHVybk5ldykge1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KHJldC54LCByZXQueSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFBlcmZvcm0gbGluZWFyIGludGVycG9sYXRpb24gYmV0d2VlbiB0d28gdmVjdG9yc1xuICAgIC8vIGFtb3VudCBpcyBhIGRlY2ltYWwgYmV0d2VlbiAwIGFuZCAxXG4gICAgbGVycCA6IGZ1bmN0aW9uKHZlYywgYW1vdW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGQodmVjLnN1YnRyYWN0KHRoaXMsIHRydWUpLm11bHRpcGx5KGFtb3VudCksIHRydWUpO1xuICAgIH0sXG5cbiAgICAvLyBHZXQgdGhlIHNrZXcgdmVjdG9yIHN1Y2ggdGhhdCBkb3Qoc2tld192ZWMsIG90aGVyKSA9PSBjcm9zcyh2ZWMsIG90aGVyKVxuICAgIHNrZXcgOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFJldHVybnMgYSBuZXcgdmVjdG9yLlxuICAgICAgcmV0dXJuIG5ldyBWZWMyKC10aGlzLnksIHRoaXMueClcbiAgICB9LFxuXG4gICAgLy8gY2FsY3VsYXRlIHRoZSBkb3QgcHJvZHVjdCBiZXR3ZWVuXG4gICAgLy8gdGhpcyB2ZWN0b3IgYW5kIHRoZSBpbmNvbWluZ1xuICAgIGRvdCA6IGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiBWZWMyLmNsZWFuKHRoaXMueCAqIGIueCArIGIueSAqIHRoaXMueSk7XG4gICAgfSxcblxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgcGVycGVuZGljdWxhciBkb3QgcHJvZHVjdCBiZXR3ZWVuXG4gICAgLy8gdGhpcyB2ZWN0b3IgYW5kIHRoZSBpbmNvbWluZ1xuICAgIHBlcnBEb3QgOiBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gVmVjMi5jbGVhbih0aGlzLnggKiBiLnkgLSB0aGlzLnkgKiBiLngpXG4gICAgfSxcblxuICAgIC8vIERldGVybWluZSB0aGUgYW5nbGUgYmV0d2VlbiB0d28gdmVjMnNcbiAgICBhbmdsZVRvIDogZnVuY3Rpb24odmVjKSB7XG4gICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnBlcnBEb3QodmVjKSwgdGhpcy5kb3QodmVjKSk7XG4gICAgfSxcblxuICAgIC8vIERpdmlkZSB0aGlzIHZlY3RvcidzIGNvbXBvbmVudHMgYnkgYSBzY2FsYXJcbiAgICBkaXZpZGUgOiBmdW5jdGlvbihzY2FsYXIsIHJldHVybk5ldykge1xuICAgICAgaWYgKHNjYWxhciA9PT0gMCB8fCBpc05hTihzY2FsYXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZGl2aXNpb24gYnkgemVybycpXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXR1cm5OZXcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueC9zY2FsYXIsIHRoaXMueS9zY2FsYXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zZXQodGhpcy54IC8gc2NhbGFyLCB0aGlzLnkgLyBzY2FsYXIpO1xuICAgIH0sXG5cbiAgICB0b0FycmF5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xuICAgIH0sXG5cbiAgICBmcm9tQXJyYXk6IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoYXJyYXlbMF0sIGFycmF5WzFdKTtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHt4OiB0aGlzLngsIHk6IHRoaXMueX1cbiAgICB9XG4gIH07XG5cbiAgVmVjMi5mcm9tQXJyYXkgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBuZXcgVmVjMihhcnJheVswXSwgYXJyYXlbMV0pO1xuICB9O1xuXG4gIC8vIEZsb2F0aW5nIHBvaW50IHN0YWJpbGl0eVxuICBWZWMyLnByZWNpc2lvbiA9IHByZWNpc2lvbiB8fCA4O1xuICB2YXIgcCA9IE1hdGgucG93KDEwLCBWZWMyLnByZWNpc2lvbilcblxuICBWZWMyLmNsZWFuID0gY2xlYW4gfHwgZnVuY3Rpb24odmFsKSB7XG4gICAgaWYgKGlzTmFOKHZhbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTmFOIGRldGVjdGVkJylcbiAgICB9XG5cbiAgICBpZiAoIWlzRmluaXRlKHZhbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW5maW5pdHkgZGV0ZWN0ZWQnKTtcbiAgICB9XG5cbiAgICBpZihNYXRoLnJvdW5kKHZhbCkgPT09IHZhbCkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWwgKiBwKS9wO1xuICB9O1xuXG4gIFZlYzIuaW5qZWN0ID0gaW5qZWN0O1xuXG4gIGlmKCFjbGVhbikge1xuICAgIFZlYzIuZmFzdCA9IGluamVjdChmdW5jdGlvbiAoaykgeyByZXR1cm4gayB9KVxuXG4gICAgLy8gRXhwb3NlLCBidXQgYWxzbyBhbGxvdyBjcmVhdGluZyBhIGZyZXNoIFZlYzIgc3ViY2xhc3MuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PSAnb2JqZWN0Jykge1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBWZWMyO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuVmVjMiA9IHdpbmRvdy5WZWMyIHx8IFZlYzI7XG4gICAgfVxuICB9XG4gIHJldHVybiBWZWMyXG59KSgpO1xuXG5cbiJdfQ==
;