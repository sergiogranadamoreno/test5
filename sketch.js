
// An interactive particle sonification.

// Sergio Granada-Moreno
// sergiogranadamoreno@gmail.com

// Most of the code here is been adapted from:

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Example NOC_4_01

// This is the main sketch.

// VARIABLES DECLARATION

var p; // a variable that represents a particle.
var particleX = 40;
var particleY = 40;
var accX = 0;
var accY = 0;
var velX = 0;
var velY = 0;
var initlifespan = 255.0;
// this is a useful flag for prototyping
var isSketchLoaded = true;
// canvas
var cHeight = 400;
var cWidth = 400;
// gui
var visible = true;
var gui2;
// mouse click variables
var isOverCanvas;
var isClicked = 0;
// we need to send data into test5lib only when a particle 
// does exist - to avoid 'sendFloatToReceiver' of null.
var morethan1timeClicked = false;
// gui coordinates
var guiX;
var guiY;
// a variable to set scale modes 
var scalemode;
var scaleMode = ['chromatic', 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian', 'wholetone', 'minor7', 'dim7', 'octatonic 2-1', 'octatonic 1-2', 'major pentatonic', 'minor pentatonic', 'invert', 'random', 'permute', 'neighbour'];
// OSC array variables
var a1;
var b1;


// SETUP

function setup() {
  
  // put the canvas in an html div container
  // https://github.com/processing/p5.js/wiki/Beyond-the-canvas
  // https://github.com/processing/p5.js/wiki/Positioning-your-canvas
  var myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent('myCanvasContainer');

  // Create GUI
  var guiX = cWidth*1.05;
  var guiY = 0;
  gui2 = createGui('particle properties', guiX, guiY);
  colorMode(RGB);
  gui2.addGlobals('scaleMode');
  sliderRange(-0.02, 0.02, 0.001);
  gui2.addGlobals('accX', 'accY');
  sliderRange(-1, 1, 0.01);
  gui2.addGlobals('velX', 'velY');
  sliderRange(1, 300, 1);
  gui2.addGlobals('initlifespan');
  
  // Initialize the first particle
  p = new Particle(createVector(particleX, particleY));
  
}


// DRAW

function draw() {
   background(0);
  // mouseOverRect check the mouse coordinates against the sides of the rectangle.
  if (this.mouseOverRect()) {
    isOverCanvas = true;
  } else {
    isOverCanvas = false;
  }
  // execute the class fuctions (runs the particle once).
  this.p.run(); 
  
  // if isClicked then create a new particle.
  // we are not using isDead function to create a new particle here (as in Shiffman's).
  // mousePressed function (below) updates 'isClicked' variable to be used instead.
  if (isClicked == 1 && isOverCanvas === true && isSketchLoaded === true) {
    // updates x/y particle coordinates.
    particleX = mouseX;
    particleY = mouseY;
    // creates a new particle.
    this.p = new Particle(createVector(particleX, particleY));
    isClicked = 0; // each time we draw a particle we re-set 'isClicked' to 0 again so that particles do not loop.
    // an envelope trigger reacts accordingly.
    parent.sendEvent_trigger(true); // "sound particle trigger"
    }
  
  // pass data into test5lib only after a new particle has been created and only
  // whilst a particle exists. 
  if (morethan1timeClicked === true && this.p.isDead() === false) {
    //print(p.lifespan);
    // pass the data to test5Lib.min.js
    parent.updateSlider_inlet1(p.position.x);
    parent.updateSlider_inlet2(p.position.y);
    parent.updateSlider_inlet3(p.velocity.x);
    parent.updateSlider_inlet4(p.velocity.y);
    parent.updateSlider_inlet5(p.acceleration.x);
    parent.updateSlider_inlet6(p.acceleration.y);
    parent.updateSlider_inlet7(p.lifespan);
    parent.updateSlider_inlet8(initlifespan);
    parent.updateSlider_scalemode(scalemode);
  }
  
  // we call this function to update scalemode according to user interaction.
  this.pickMode();
 
  // pass data via OSC for prototyping Pd patches.
  //if(isSketchLoaded){
  //var a1 = [p.position.x, p.position.y, p.velocity.x, p.velocity.y, p.acceleration.x, p.acceleration.y, p.lifespan, initlifespan];
  //var b1 = [scalemode];
  //print (a1, b1);}
  // Send this data via OSC
}
// END OF DRAW FUNCTION

// OTHER FUNCTIONS

// switch between modes

function pickMode(){
  
  // pick scalemode
		switch(scaleMode) {

		  case 'chromatic':
		    scalemode = 0;
		    break;
		  case 'ionian':
		    scalemode = 1;
		    break;
		  case 'dorian':
		    scalemode = 2;
		    break;
		  case 'phrygian':
		    scalemode = 3;
		    break;
		  case 'lydian':
		    scalemode = 4;
		    break;
		  case 'mixolydian':
		    scalemode = 5;
		    break;  
      case 'aeolian':
		    scalemode = 6;
		    break;
		  case 'locrian':
		    scalemode = 7;
		    break;
		  case 'wholetone':
		    scalemode = 8;
		    break;
		  case 'minor7':
		    scalemode = 9;
		    break;
		  case 'dim7':
		    scalemode = 10;
		    break;
		  case 'octatonic 2-1':
		    scalemode = 11;
		    break;
		  case 'octatonic 1-2':
		    scalemode = 12;
		    break;
		  case 'major pentatonic':
		    scalemode = 13;
		    break;
		  case 'minor pentatonic':
		    scalemode = 14;
		    break;
		  case 'invert':
		    scalemode = 15;
		    break;
		  case 'random':
		    scalemode = 16;
		    break;
		  case 'permute':
		    scalemode = 17;
		    break;
		  case 'neighbour':
		    scalemode = 18;
		    break;

		}
  
}

// mousePressed updates 'isClicked' global variable.
// John Kuiphoff example http://coursescript.com/notes/interactivecomputing/interactivity/
function mousePressed()
{
  if (isClicked === 0) {
    isClicked = 1;
    morethan1timeClicked = true;
  } else {
    isClicked = 0;
    morethan1timeClicked = true;
  }
  //print('new particle');
}

// To check if the mouse is over a circle one can use 
// the dist() function. To check if the mouse is over a 
// rectangle one can check the mouse coordinates against 
// the sides of the rectangle.
// https://amnonp5.wordpress.com/2012/01/28/25-life-saving-tips-for-processing/
function mouseOverRect() {
    if (mouseX >= 0 && mouseX <= cWidth && mouseY >= 0 && mouseY <= cHeight) {
        return true;
    } else {
      return false;
    }
  }

// check for keyboard events and hide GUI
// 'h' keyCode is 72
function keyPressed() {

  if(isOverCanvas === true){
      //console.log("p5 keyCode: " + keyCode);
      if(keyCode == 72){
        visible = !visible;
        if(visible) gui2.show(); else gui2.hide();
      }
    }

}
