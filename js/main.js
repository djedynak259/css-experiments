(function(){
	// const createCube = () => {
	//   const template = document.getElementById("cube-template");
	//   const fragment = document.importNode(template.content, true);
	//   return fragment;
	// };


	const getDistance = (state, rotate) =>
	  ["x", "y"].reduce((object, axis) => {
	    object[axis] = Math.abs(state[axis] + rotate[axis]);
	    return object;
	  }, {});

	const getRotation = (state, size, rotate) => {
	  const axis = rotate.x ? "Z" : "Y";
	  const direction = rotate.x > 0 ? -1 : 1;

	  return `
	    rotateX(${state.x + rotate.x}deg)
	    rotate${axis}(${direction * (state.y + rotate.y)}deg)
	    translateZ(${size / 2}px)
	  `;
	};



	const interpolate = (a, b, i) => a * (1 - i) + b * i;

	const getShading = (tint, rotate, distance) => {
	  const darken = ["x", "y"].reduce((object, axis) => {
	    const delta = distance[axis];
	    const ratio = delta / 180;
	    object[axis] = delta > 180 ? Math.abs(2 - ratio) : ratio;
	    return object;
	  }, {});

	  if (rotate.x)
	    darken.y = 0;
	  else {
	    const {x} = distance;
	    if (x > 90 && x < 270)
	      directions.forEach(axis => darken[axis] = 1 - darken[axis]);
	  }

	  const alpha = (darken.x + darken.y) / 2;
	  const blend = (value, index) =>
	    Math.round(interpolate(value, tint.shading[index], alpha));

	  const [r, g, b] = tint.color.map(blend);
	  return `rgb(${r}, ${g}, ${b})`;
	};

}());

// Slider Javascript

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


(function() {

	// Get the buttons.
	var startBtn = document.getElementById('startBtn');
	var stopBtn = document.getElementById('stopBtn');
	var resetBtn = document.getElementById('resetBtn');

	// A variable to store the requestID.
	var requestID;

	// Canvas
	var canvas = document.getElementById('stage');

	// 2d Drawing Context.
	var ctx = canvas.getContext('2d');

	// Set the fill style for the drawing context.
	ctx.fillStyle = '#21221';

	// Variables to for the drawing position and object.
	var posX = 0;
	var boxWidth = 50;
	var pixelsPerFrame = 5; // How many pixels the box should move per frame.

	// Draw the initial box on the canvas.
	ctx.fillRect(posX, 0, boxWidth, canvas.height);


	// Animate.
	function animate() {
		requestID = requestAnimationFrame(animate);

		// If the box has not reached the end draw on the canvas.
		// Otherwise stop the animation.
		if (posX <= (canvas.width - boxWidth)) {
			ctx.clearRect((posX - pixelsPerFrame), 0, boxWidth, canvas.height);
			ctx.fillRect(posX, 0, boxWidth, canvas.height);
			posX += pixelsPerFrame;
		} else {
			cancelAnimationFrame(requestID);
		}
	}


	// Event listener for the start button.
	startBtn.addEventListener('click', function(e) {
		e.preventDefault();

		// Start the animation.
		requestID = requestAnimationFrame(animate);
	});


	// Event listener for the stop button.
	stopBtn.addEventListener('click', function(e) {
		e.preventDefault();

		// Stop the animation;
		cancelAnimationFrame(requestID);
	});


	// Event listener for the reset button.
	resetBtn.addEventListener('click', function(e) {
		e.preventDefault();

		// Reset the X position to 0.
		posX = 0;

		// Clear the canvas.
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the initial box on the canvas.
		ctx.fillRect(posX, 0, boxWidth, canvas.height);
	});

}());