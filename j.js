// GLOBALS
// =======

var 

rot = 0,

// Rotate camera
move_scene = () => {
  scene.style.transform = "translateX(-"+(snakex[head]*sidesize)+"vh)translateY(-"+(snakey[head]*sidesize)+"vh)translateZ(45vh)rotateX(40deg)rotateZ(" + rot + "rad)";
},


// Music
musicint = position = index = 0,

SR=48e3,
PI2 = Math.PI*2,

Phase = function () {
	var phase = 0;
	this.sample = function (hz) {
		phase += (hz / SR) * PI2;
		phase %= PI2;
		return phase;
	};
},

Note = function (value, x) {
	var phase = new Phase();
	var vibrato_phase = new Phase();
	var gain = 0.1;

	this.sample = function () {
		if (!value) return 0;
		var v = value + 0.4 * Math.sin(vibrato_phase.sample(3));
		var hz = 440*Math.pow(2, (v-57)/12);
		gain *= 0.9998;
		var phi = phase.sample(hz);
		return Math.pow(Math.sin(phi), x) * gain;
	};
},

Song = function (song) {
	position = -1;

	var mk_audio = function (data) {
		var l = data.length;
		var l2=l*2;

		var b32 = function (v) {
			var s = 0;
			var b = "";
			for (var i=0; i<4; i++,s+=8) b+=String.fromCharCode((v>>s)&255);
			return b;
		};
		var b16 = function (v) {
			var b = b32(v);
			return b[0]+b[1];
		};

		var b = "RIFF"+b32(l2+36)+"WAVEfmt "+b32(16)+b16(1)+b16(2)+b32(SR)+b32(SR*4)+b16(4)+b16(16)+"data"+b32(l2);
		for (var i in data) {
			var value = Math.min(1.0, Math.max(-1.0, data[i]));
			b+=b16(data[i]*32767);
		}
		return new Audio("data:audio/wav;base64,"+btoa(b));
	};

	var play = function () {
		var n = song.length/2;
		index = position;
		while (index < 0) index += n;
		index %= n;

		var get_note = function (channel) {
			return song[index*2+channel].charCodeAt(0) - 48;
		};

		var note1 = new Note(get_note(0), 1);
		var note2 = new Note(get_note(1), 1);

		var samples = [];
		for (var i = 0; i < SR; i++) {
			var s1 = note1.sample();
			var s2 = note2.sample();
			var left = s1 + s2 * 0.5;
			var right = s1 * 0.5 + s2;
			samples.push(left);
			samples.push(right);
		}
		mk_audio(samples).play();
	};

	this.forward = function () {
		position++;
		play();
	};

	this.back = function () {
		position--;
		play();
	};
},


// Old song1:
//[[62,63,66,67,69,70,69,67,66,67,69,,,,,,62,63,66,67,69,70,73,70,69,70,69,,,,,,67,69,70,72,74,72,70,69,67,,,,,,,,66,67,69,70,69,67,69,67,66,67,69,,,,,,],[50,,57,57,50,,57,57,50,,57,57,50,51,54,55,57,58,60,58,57,58,61,58,50,,57,57,58,61,62,61,55,,62,62,55,,62,62,55,62,63,62,55,67,63,62,57,58,60,61,60,58,54,51,50,,57,57,50,50,57,57,],];

mkaudio = function(fn){
	var data = [];
	for (var i = 0;;i++) {
		var smp = fn(i);
		if (smp===null) break;
		data.push(smp);
	}
	var l = data.length;
	var l2=l*2;

	var b32 = function (v) {
		var s = 0;
		var b = "";
		for (var i=0; i<4; i++,s+=8) b+=String.fromCharCode((v>>s)&255);
		return b;
	};
	var b16 = function (v) {
		var b = b32(v);
		return b[0]+b[1];
	};
  
	var b = "RIFF"+b32(l2+36)+"WAVEfmt "+b32(16)+b16(1)+b16(1)+b32(SR)+b32(SR*2)+b16(2)+b16(16)+"data"+b32(l2);
	for (var i in data) b+=b16(data[i]*10e3);
	return new Audio("data:audio/wav;base64,"+btoa(b));
},

Pow=Math.pow,
S=Math.sin,

t = function(i,n) {
	return (n-i)/n;
},

SNDeat = function(i) {
	var n = 1e4;
	if (i>n) return null;
	return ((Pow(i,1.055)&128)?1:-1)*Pow(t(i,n),2);
},

SNDappear = function(i) {
	var n=25000;
	if (i > n) return null;
	return ((((i^(i>>3))^(i*i*7.3)^(i<<4))&65535)/65536)*t(i,n);
},

SNDstuck = function(i) {
	var n=5e3;
	if (i > n) return null;
	return ((Pow(i+S(i*0.01)*1000,0.8)&200)?0.5:-0.5)*Pow(t(i,n),1);
},

SNDwin = function(i) {
	var n=1.6e4;
	var c=n/7;
	if (i > n) return null;
	var q=Pow(t(i,n),2.1);
	return (i<c ? ((i+S(-i/900)*10)&16) : i&13) ?q:-q;
},

SNDopendoor = function(i) {
	var n=9e4;
	if (i > n) return null;
	return ((Pow(i+S(i*0.01)*1000,0.8)&200)?0.5:-0.5)*Pow(t(i,n),1);
},



song1 = new Song("nbo0risiubv0uisirbs0uiniojrlsjuivjymvjubv0uisgu0vnxnzgx0vnunsgrisjulvmulsjufscrbs0ui")

//song1 = new Song("nbo0risiubv0uisirbs0ui0i0b0c0f0gniojrlsjuivjymvjubv0ui0i0j0m0n0rsgu0vnxnzgx0vnunsg0n0o0n0g0s0o0nrisjulvgufsjufscrbo0ni0j0b0i0j0il`n0ogqgs`u0vgxgz`0gxl0nsouqvsxuuev0u`0`0eq0slulqcs0qcs0qbs0q`s0njo0reseujv0xeveuj0v0e0q0j0i0g0e0cu0scq00bv0ufr0sgn0vbr0xiz0zjr0sgu0vbx0zgx0vbubsg{0zb{`z^{0zi{fzgv0xiu0vjs0ulr0sbn0oll0nbl0jfi0g00bxc0`zb0^{`0]z^0[z]0Zz[0]z^0`zb0]uf0bxi0f{l0izr0ozn0ixr0nrulrnbo0risiufs0r`o0nb0czf0gzi0gzf0cub0i0j0mvn0m0j0irbscrbs`rbs`sbrbo`q0sgugv`x0zg{gz`s0x`s0v`x0vcx0ues0q`l00eu00`x00ev00`u00eq00`o`"),

song2 = new Song("p0r0sdk0rco0pdk0p0r0sdw0rcs0pdk0p0r0sdk0rck0pdk0p0r0sdw0rcs0pd0f0g0iwg0bwgx0wgurrnspur0bufwgubs0pkrcsdk0rco0pkk0p0r0sdk0rco0pk0l0k0iwg0b0k0g0n0kzs0nxi0f|l0izr0p0n0lwk0dwg0k0p0k|s0pur0kuo0k0i0l0k0isd0krj0kpd0k0p0rsd0krl0opd0f0g0iskw0riw0pgw0nfw0u`s0rbs0pd0k"),


// Meta
//=======
L = localStorage,
P = "lossst_",
easteregg = 0,
son = +L[P+"son"] || 0,
currentsong = son ? song2 : song1,
mobile = +L[P+"mobile"] || 0,
ocd_time = +L[P+"time"] || 0,
ocd_moves = +L[P+"moves"] || 0,
int_time = 0,
touchintervals = [],
fx = 0,

// Snake
//=======

// unit length in vh (grids, cubes, coordinates, etc)
sidesize = 5,

// Number of moves recorded
head = 0,

// snakex/y/z contains the current X, Y, Z coordinates of the head (and all its previous positions)
// One value is pushed every time the snake moves
// Ex: head_X = snakex[head]; tail_X = snakex[xhead - snakelength]
snakex = [],
snakey = [],
snakez = [],

// Z-axis rotation of each cube in radians
snakeangle = [],

// Snake length in cubes (default: 5)
// Synchronized with localStorage
snakelength = L[P+"snakelength"] = +L[P+"snakelength"] || 5,

// Game
//=======

// Are we in the editor
iseditor = 0,

// Playing a puzzle
puzzling = 0,

// Keyboard input (control snake's cubes): up, right, down, left, shift, ctrl, backspace
u = r = d = l = s = c = B = 0,

// Keyboard lock
lock = 0,

// Emoji
trees = [],
apples = [],

// doors
doors = [],

// Cubes
cubes = [],

// Hints
hints = [],

// Emoji
//emoji = [],

// Puzzles
puzzles = [],
currentpuzzle = null,
cellprefix = '0',
dg = [],
dw = [],
hasground = 0,
haswall = 0,
haswrap = 0,
issolved = 0,
leftoffset = 0,
topoffset = 0,
size = 0,
totalsolved = +L[P+"totalsolved"] || 0,
exithead = 0,
inbounds = 0,

// Stuck
stuck = 0,

// Page
pagename = "",

// Page size
w = h = 0,

// Game
//=======

// Enter a room
enterroom = () => {
  
  // Enable Mac css hacks
  if(navigator.userAgent.match(/Mac/)){
    perspective.className = "mac";
  }
  
  // Enable Fx/Edge css hacks (also longer intro for these browsers to avoid CSS3D glitches while the camera moves
  if(navigator.userAgent.match(/Fire|Edg/)){
    perspective.className += " fx";
    fx = 4000;
  }
  
  // Mobile hacks
  if(mobile){
    perspective.className += " mobile";
  }
  
  // Set room name to the body
  b.className = pagename;
  
  
  // Empty father's container when the son returns to the hub (room 2-5)
  if(son && !iseditor){
    snake.innerHTML = "";
  }
  
  // Rooms contents
  
  cubes = [];
  doors = [];
  trees = [];
  apples = [];
  hints = [];
  emoji = [];
  
  // Editor
  if(pagename == "pz"){
    w = 40;
    h = 20;
    
    // Puzzles (size, snakesize, wrap, wall, ground, x, y)
    puzzles = [
      [5,,1,,"0000000000000000000000000",16,9]
    ];
    snakelength = 5;
    son = 0;
  }
  
  // Load a puzzle
  else if(pagename == "py"){
    w = 20;
    h = 20;
    puzzles = [eval("["+(location.hash.slice(1).replace(/[01]{2,}/g,'"$&"'))+"]")];
    snakelength = puzzles[0][1];
    puzzles[0][5] = puzzles[0][6] = 8; 
    son = !!puzzles[0][3];
    hints = [
      ["Move: arrow keys<br>"+(son?"Up/Down: "+(mobile?"⬆︎/⬇︎":"Shift/Ctrl") + "<br>":"")+"backtrack: "+(mobile?"↩":"Alt") + "<br>Reset: R", 1, 5, 1, 0, son, 0],
    ];
    delete L[P+"puzzlepy0"];
  }
  
  // Hub (start, tuto, access to 2D, wrap and 3D puzzles)
  // ----
  else if(pagename == "px"){
  
    w = 40;
    h = 20;
    
    // Trees (x, y, z)
    trees = [
      [13,9,0],
      [7,13,0],
      [35,8,0],
    ];

    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [11,11,0,0,0],
      [2,12,0,6,0],
      [38,10,0,7,0],
    ];
    
    // Doors
    // 0: x (path center)
    // 1: y (path center)
    // 2: angle
    // 3: min snake length
    // 4: min solved puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z (path center)
    // 10: color (0: orange / 1: black)
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "pA", 1, 0, 10, 0, 0],
      [20, -2, 0, 14, 0, "pD", 1, 10, 19, 0, 0],
      [-2, 11, -Math.PI / 2, 6, 0, "pJ", 1, 14, 5, 1, 1],
      [20, 21, Math.PI, 14, 0, "pC", 1, 22, 1, 0, 0],
      [5, 21, Math.PI, 5, 0, "pI", 1, 36, 1, 0, 1],
    ];
    
    puzzles = [];
    
    cubes = [];
    for(i = 9; i < 15; i++){
      for(j = 0; j < 5; j++){
        if((j == 2 && i == 14) || (j == 2 && i == 13) || (j == 3 && i == 13) || (j == 3 && i == 12) || (j == 2 && i == 12)){
        }
        else {
          cubes.push([j,i]);          
        }
      }
    }
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length (if any)
    // 4: max snake length (if any)
    // 5: son?
    // 6: z
    hints = [
      ["Move with<br>arrow keys" + (mobile ? "" : " or WASD/ZQSD"), 19, 5, 0, 13, 0],
      ["Use the " + (mobile ? "↩" : "Alt") + " key to backtrack", 1, 9, 0, 13, 0, 1],
      ["Approach red doors with the right length to open them", 35, 14, 0, 13, 0],
      ["Puzzle editor<br>↓", 19, 8, 14, 0, 0],
      ["↑<br>New puzzles !", 16, 6, 14, 0, 0],
      ["New ! Puzzle editor with wraps<br>↓", 19, 8, 6, 7, 1],
      ["←<br>New puzzles !", 1, 9, 6, 7, 1, 1],
    ];
    
    emoji = [
      ["🐿️", 30, 7],
      ["🌰️", 29, 7],
    ];
    
  }
  
  // 1-1 (puzzles 2D length 8)
  // Puzzles solved before: 0
  // Puzzles solved after: 6
  // ----
  
  else if(pagename == "pA"){
      
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [35,15,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [33,16,0,0,6],
      [34,17,0,0,6],
      [37,15,0,0,6],
    ];
    
    cubes = [
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [-2, 10, -Math.PI / 2, 8, 0, "px", 0, 39, 11, 0, 0],
      [35, 21, Math.PI, 11, 0, "pB", 1, 35, 1, 0, 0]
    ];
    
    // Puzzles (size, snakesize, wrap, wall, ground, x, y)
    puzzles = [
      [6,,0,,"000000001000001110001110001000000000",2,3],
      [6,,0,,"000000011000011100010000011000000000",14,3],
      [6,,0,,"000000000100001100011000011100000000",26,3],
      [5,,0,,"0000001110011100110000000",2,13],
      [6,,0,,"000000011000011000001100001100000000",14,13],
      [6,,0,,"000000000100001100001110001100000000",26,13],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Cover the black shapes to solve puzzles", 9, 9, 1, 0],
      ["Solve all the puzzles in the room to get new apples and unlock a new door", 21, 9, 1, 0],
      ["Your progress is saved automatically", 34, 9, 1, 0],
    ];
    
    emoji = [
      ["🐌", 11, 10],
    ]
    
  }
  
  // 1-3 (puzzles 2D length 11)
  // Puzzles solved before: 6
  // Puzzles solved after: 12
  // ----
  
  else if(pagename == "pB"){
    
    // Show mobile button Reset
    if(mobile){
      kx.className = "";
      L[P+"reset"] = 1;
    }
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [4,7,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [1,8,0,0,12],
      [2,9,0,0,12],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [35, -2, 0, 8, 0, "pA", 0, 35, 19, 0, 0],
      [-2, 10, -Math.PI / 2, 13, 0, "pC", 1, 39, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,,0,,"000000011110011010011110000000000000",8,2],
      [7,,0,,"0000000001110000111000001100000110000010000000000",18,2],
      [6,,0,,"000000011000011110001010001110000000",28,2],
      [6,,0,,"000000011100001110001110001100000000",8,12],
      [6,,0,,"000000001110001110001110001010000000",18,12],
      [6,,0,,"000000011110011110001100001000000000",28,12],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["If you get stuck, " + (mobile ? "click ×" : "press R") + " to exit a puzzle", 35, 11, 1, 0],
      ["If a puzzle looks impossible, try another entry !", 14, 10, 1, 0],
    ];
    
    cubes = [
      [11,4],
      [21,16],
    ];
    
    emoji = [
      ["🐈", 4, 14],
    ]
  }
  
  // 1-4 (2D puzzles length 13)
  // Puzzles solved before: 12
  // Puzzles solved after: 18
  else if(pagename == "pC"){
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [35,8,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [34,11,0,0,18],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "pB", 0, 1, 10, 0, 0],
      [22, -2, 0, 14, 0, "px", 1, 20, 19, 0, 0]
    ];
    
    // Puzzles
    puzzles = [
      [7,,0,,"0000000000000001111000111100001111000100000000000",2,3],
      [7,,0,,"0000000001110000101000011100001110000110000000000",26,3],
      [6,,0,,"000000001110011110011010001110000000",14,3],
      [7,,0,,"0000000001100000111000011100001110000110000000000",2,12],
      [7,,0,,"0000000000000001111100101010011111000000000000000",14,12],
      [6,,0,,"000000011000011100011110011110000000",26,12],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["↑<br>After this room, you can try a puzzle editor and a new kind of puzzles !", 22, 11, 13, 0, 0],
    ];
    
    cubes = [
      [29,5],
      [30,8],

      [17,6],
      [15,4],
      [15,7],

      [29,13],
      [30,13],
      [30,14],
      [18,15],
      [16,15],
      [6,13],
      [6,17],
      [7,8],
      [6,8],
      [5,8],
      [3,7],
      [3,8],
      [7,6],
      [7,5],
    ];
    
    emoji = [
      ["🦋<br><br>", 29, 13],
    ]
  }
  
  // 2-1 (2D puzzle with wrap, length 14)
  // Puzzles solved before: 18
  // Puzzles solved after: 19
  else if(pagename == "pD"){
    
    w = 20;
    h = 20;
    
    // Trees
    trees = [
      [10, 2, 0],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, 21, Math.PI, 14, 0, "px", 0, 20, 0, 0, 0],
      [-2, 5, -Math.PI / 2, 14, 0, "pE", 0, 24, 12, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [7,,1,,"0100010011111000000000000000000000001111100100010",7,7],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Now you're thinking with wraps !", 2, 2, 0, 14, 0], 
    ];
    
    for(i = 0; i < 20; i++){
      cubes.push([i, 10]);
    }
    
    emoji = [
      ["🐐", 12, 2],
    ]
  }
  
  // 2-15 (2D, wrap, length 14)
  // Puzzles solved before: 19
  // Puzzles solved after: 23
  else if(pagename == "pE"){
    
    w = 25;
    h = 25;
    
    // Trees
    trees = [
      [5, 12, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [4, 14, 0, 0, 23],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [26, 12, Math.PI / 2, 14, 0, "pD", 0, 0, 5, 0, 0],
      [-2, 12, -Math.PI / 2, 15, 0, "pF", 1, 79, 5, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [7,,1,,"1000001000000000000000010100011011011000111000001", 3, 3],
      [6,,1,,"110011100001000000100001100001110011", 15, 17],
      [5,,1,,"1100111001100011001110011", 16, 4],
      [6,,1,,"000011000011110001110001000011000011", 3, 17],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Reminder:<br>use " + (mobile ? "↩" : "Alt") + " to backtrack,<br>" + (mobile ? "×" : "R") + " to exit a puzzle.", 11, 14, 1, 0, 0], 
    ];
    
    emoji = [
      ["🐒", 12, 20],
    ]
   
  }
  
  // 2-2 (2D puzzle with wrap, length 15, easter egg)
  // Puzzles solved before: 23
  // Puzzles solved after: 35
  else if(pagename == "pF"){
    
    w = 80;
    h = 20;
    
    // Trees
    trees = [
      [35, 10, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [38, 11, 0, 0, 35],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [81, 5, Math.PI / 2, 15, 0, "pE", 0, 0, 12, 0, 0],
      [-2, 15, -Math.PI / 2, 16, 0, "pG", 1, 19, 5, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [5,,1,,"0111101001010110100011111", 59, 13], // J
      [5,,1,,"1111011000111100001011110", 48, 13],
      [5,,1,,"1111101000011110111001100", 37, 13],
      [5,,1,,"1111110000111001000011111", 26, 13],
      [5,,1,,"1100101101001110011101101", 15, 13],

      [5,,1,,"1111100001110010000111111", 59, 2], // G
      [5,,1,,"1000110111100011000111111", 48, 2],
      [5,,1,,"1000110101101011111110001", 37, 2],
      [5,,1,,"1111110001000110000111111", 26, 2],
      [5,,1,,"0111101100011100011011110", 15, 2],

      [5,,1,,"1111101111001110001100001", 4, 8], // Triangle
      [5,,1,,"1010100101111010000111111", 71, 8], // Zigouigoui
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["This room hides a surprise !", 72, 2, 0, 15, 0],
      ["←<br>Exit", 38, 9, 16, 0, 0],
    ];
    
    cubes = [];
    
    emoji = [];
    
  }
  
  // 2-3 (2D puzzle with wrap, length 16)
  // Puzzles solved before: 35
  // Puzzles solved after: 37
  else if(pagename == "pG"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [5, 25, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [4, 24, 0, 0, 37],
      [7, 25, 0, 0, 37],
      [2, 26, 0, 0, 37],
      [3, 28, 0, 0, 37],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [21, 5, Math.PI/2, 16, 0, "pF", 0, 1, 15, 0, 0],
      [10, 31, Math.PI, 20, 0, "pH", 1, 10, 1, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,,1,,"001000001110111111011100011000001000", 7, 6],
      [6,,1,,"110001100001000111000111100001110001", 7, 18],
    ];
    
    emoji = [
      ["🐁", 9, 14],
    ];
  }
  
  // 2-4 (2D puzzle with wrap, length 20)
  // Puzzles solved before: 37
  // Puzzles solved after: 39
  else if(pagename == "pH"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [16, 22],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [18, 22, 0, 0, 39],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, -2, 0, 18, 0, "pG", 0, 10, 29, 0, 0],
      [21, 25, Math.PI/2, 21, 0, "pI", 1, 1, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,,1,,"001000011110111111011110011110001000", 7, 6],
      [6,,1,,"110001100001000011000111001111111111", 7, 18],
    ];
    
    emoji = [
      ["🦆", 9, 14],
    ];
  }
  
  // 2-5 (change snake)
  // Puzzles solved before: 39
  // Puzzles solved after: 39
  else if(pagename == "pI"){
    
    w = 40;
    h = 20;
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [38, 2, 0, 5, 0],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [-2, 10, -Math.PI/2, 1, 0, "pH", 0, 19, 25, 0, 0],
      [36, -2, 0, 6, 0, "px", 1, 5, 19, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Guess what, you finished the first half of the game !", 5, 9, 1, 0],
      ["Little snake can move up and down with " + (mobile ? "⬆︎ and ⬇︎" : "Shift and Ctrl keys") + ", and open black doors", 26, 9, 1, 0],
    ];
    
    for(i=0;i<9;i++) cubes.push([30, i]);
    for(i=30;i<40;i++) cubes.push([i, 8]);
    
    emoji = [
      ["🐢", 13, 14],
    ]
  }
  
  // 3-1 (3D puzzles, length 6, wall and wall+gtound)
  // Puzzles solved before: 39
  // Puzzles solved after: 47
  else if(pagename == "pJ"){
    
    w = 15;
    h = 70;
    
    // Trees
    trees = [
      [2, 62],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [2, 65, 0, 0, 47],
      [1, 66, 0, 0, 47],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 5, Math.PI / 2, 6, 0, "px", 0, 1, 11, 0, 1],
      [-2, 65, -Math.PI / 2, 8, 0, "pK", 1, 19, 65, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      // Wall
      [5,,0,"0000000000000000000001110",, 2, 2],
      [4,,0,"0000000001000110",, 4, 11],
      [5,,0,"0000000000000000101001110",, 6, 20],
      [5,,0,"0000000000000000111000100",, 8, 29],
      
      // Wall + ground
      [4,,0,"0000000001100110","0000011001100000", 2, 38],
      [4,,0,"0000010001100100","0000011001100000", 4, 47],
      [4,,0,"0000011001000100","0000010001100000", 6, 56],
      [4,,0,"0000000001100110","0100011000100000", 8, 65],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["You now have to match the patterns on the walls...", 10, 2, 1, 0, 1],
      ["... and on the floor too !", 10, 40, 1, 0, 1],
      ["Beware the gravity: you can't fly !", 2, 68, 1, 0, 1],
    ];
    
    emoji = [
      ["🦉", 10, 14],
    ]
  }
  
  // 3-3 (3D puzzles, length 8, wall and full and wrap)
  // Puzzles solved before: 47
  // Puzzles solved after: 59
  else if(pagename == "pK"){
    
    // Show mobile button Reset
    if(mobile){
      ky.className = kz.className = "";
      L[P+"camera"] = 1;
    }

    w = 20;
    h = 75;
    
    // Trees
    trees = [
      [2, 2],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [1, 4, 0, 0, 59],
      [2, 5, 0, 0, 59],
      [3, 6, 0, 0, 59],
      [4, 2, 0, 0, 59],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [21, 65, Math.PI / 2, 7, 0, "pJ", 0, 1, 65, 0, 1],
      [-2, 5, -Math.PI / 2, 12, 0, "pL", 1, 14, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
    
      // Wall
      [5,,0,"0000000000010000110001110",, 8, 69],
      [6,,0,"000000000000000000000100001110011000",, 12, 58],
      [5,,0,"0000000000010000111001000",, 2, 58],
      
      // Wall + ground
      [4,,0,"0000001001100110","0000001001100000", 2, 45],
      [5,,0,"0000000000000000010001110","0000000100001100110000000", 12, 45],
      [5,,0,"0000000000000000101001110","0000001110010100000000000", 2, 34],
      [5,,0,"0000000000000000011001100","0000001110011000010000000", 12, 34],
      
      // Wrap      
      [4,,1,"0000011001100110","0110000000000110", 2, 22],
      [4,,1,"1001000000001001","1001000000001001", 12, 22],
      [4,,1,"0000010011110010","0000111101100000", 2, 12],
      [4,,1,"0110010000000011","0000011100110000", 12, 12],
      [4,,1,"1101000000000001","1101000000010001", 12, 2],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    // 5: son
    hints = [
      ["You can rotate the camera with " + (mobile ? "<br>↻ and ↺" : "the keys 1, 2 and 3"), 15, 68, 1, 0, 1],
      ["Can you guess what's coming next?", 7, 54, 1, 0, 1],
      ["Yep... 3D puzzles with wrap ! Use " + (mobile ? "⬆︎ and ⬇︎" : "Shift and Ctrl") + " to wrap between top and bottom", 7, 24, 1, 0, 1],
    ];
    
    emoji = [
      ["🐞", 3, 70],
    ]
  }


  // 3-6 (3D puzzles, length 12, all kinds)
  // Puzzles solved before: 59
  // Puzzles solved after: 68
  else if(pagename == "pL"){
    
    w = 15;
    h = 80;
    
    // Trees
    trees = [
      [2, 70]
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [1, 73, 0, 0, 68],
      [3, 75, 0, 0, 68],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 5, Math.PI / 2, 12, 0, "pK", 0, 1, 5, 0, 1],
      [-2, 75, -Math.PI / 2, 14, 0, "pM", 1, 14, 25, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      
      // Wall
      [5,,0,"0000000000001001111100100",, 2, 2],
      [4,,0,"0000010001100000",, 5, 11],
      [5,,0,"0000000110000110111000010",, 8, 20],
      
      // Wall + ground
      [5,,0,"0000000000001000111011111","0000000000111001111100000", 2, 29],
      [4,,0,"1000110011101111","0000001111110000", 5, 38],
      [4,,0,"0000100011001110","1110110010000000", 8, 45],
      
      // Wrap
      [4,,1,"1000100110010001","0000100110010000", 2, 54],
      [4,,1,"0000001011110100","0000110011110011", 5, 63],
      [5,,1,"0100011000010000111001000","0000001110110000100000000", 8, 72],
    ];
    
    cubes = [
      [6, 12],
    ];
    
    emoji = [
      ["🐝", 3, 20],
    ];
  }
  
  // 3-7 (3D puzzles, length 14, all kinds)
  // Puzzles solved before: 68
  // Puzzles solved after: 71
  else if(pagename == "pM"){
    
    w = 15;
    h = 30;
    
    // Trees
    trees = [
      [10,12]
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [8, 11, 0, 0, 71],
      [9, 10, 0, 0, 71],
      [10, 9, 0, 0, 71],
      [11, 10, 0, 0, 71],
      [12, 11, 0, 0, 71],
      [7, 12, 0, 0, 71],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 25, Math.PI / 2, 14, 0, "pL", 0, 1, 75, 0, 1],
      [-2, 5, -Math.PI / 2, 20, 0, "pN", 1, 14, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      [5,,1,"0001100110011001100010000","0001100110011001100010000", 2, 24],
      [5,,1,"1100010001000011000111000","0000011000110010000000000", 4, 13],
      [5,,1,"1101110001000001000011000","1100010000000001000111011", 6, 2],
    ];
    
    emoji = [
      ["🐓", 1, 14],
    ];
  }
  
  // 3-8 (3D puzzles, length 20, wrap)
  // Puzzles solved before: 71
  // Puzzles solved after: 75
  else if(pagename == "pN"){
    
    w = 15;
    h = 48;
    
    // Trees
    trees = [
      [10, 44],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [7, 45, 0, 0, 75],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [16, 5, Math.PI / 2, 20, 0, "pM", 0, 1, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      [4,,1,"0000111101101111","1000111111111000", 5, 38],
      [4,,1,"1111001001001111","1111101010101111", 5, 28],
      [4,,1,"1111010101011101","0001101101101111", 5, 18],
      [4,,1,"1111000100011110","1111110110011111", 5, 8],
    ];
    
    emoji = [
      ["🐉", 13, 46],
    ];
  }
  
  scene.style.width = w * sidesize + "vh";
  scene.style.height = h * sidesize + "vh";
  
  // Draw objects: doors, trees, apples, puzzles, cubes...
  //=====================
  
  // Reset objects & puzzles containers
  if(!iseditor){
    objects.innerHTML = "";
  }

  puzzle.innerHTML = "";
  
  // Trees
  for(var i in trees){
    objects.innerHTML += 
    `<div id=tree${i} class="emoji tree"style=left:${trees[i][0]*sidesize}vh;transform:translateX(-7vh)translateY(${trees[i][1]*sidesize+4}vh)rotateX(-70deg)>🌳</div><div id=treeshadow${i} class="emojishadow treeshadow"style=left:${trees[i][0]*sidesize}vh;transform:translateX(-7.5vh)translateY(${trees[i][1]*sidesize+3.5}vh)rotateZ(144deg)scaleY(1.5)>🌳`;
  }
  
  // Apples
  for(i in apples){

    // Remove apples already eaten
    if(L[P+"appleeaten" + pagename + i]){      
      delete apples[i];
    }
   
    // Draw apples to eat
    else {
      objects.innerHTML += 
      `<div id=apple${i} class="emoji apple ${L[P+"appleappeared"+pagename+i]?"":"hidden"}"style=left:${apples[i][0]*sidesize}vh;transform:translateY(${apples[i][1]*sidesize+4}vh)rotateX(-65deg)>${pagename=="pN"?"<div>⚽</div>":"<div class=emojimove>🍎</div>"}</div><div id=appleshadow${i} class="emojishadow appleshadow ${L[P+"appleappeared"+pagename+i]?"":"hidden"}"style=left:${apples[i][0]*sidesize}vh;transform:scaleX(-1)translateY(${apples[i][1]*sidesize+3}vh)rotateZ(212deg)>${pagename=="pN"?"⚽":"🍎"}`;
    }
  }
  
  // Emoji
  for(i in emoji){
    objects.innerHTML += 
    `<div class="emoji animal"style=left:${emoji[i][1]*sidesize-1}vh;transform:translateY(${emoji[i][2]*sidesize+4}vh)rotateX(-65deg)><div class=emojimove>${emoji[i][0]}`;
  }
  
  // Doors
  for (i in doors){
  objects.innerHTML+=`<div id=door${""+pagename+i} class="door${L[P+"door"+pagename+i]?" open":""}"style=left:${(doors[i][0]+.5)*sidesize}vh;top:${(doors[i][1]+.5)*sidesize}vh;transform:rotateZ(${doors[i][2]}rad)translateZ(${doors[i][9]*sidesize}vh)><div class="realdoor door${doors[i][10]}"${doors[i][6]?"":"hidden"}>${doors[i][3]}</div><div class=path>`;
  }
  
  // Cubes

  for(var p in puzzles){
    for(var j in cubes){
      if(
        L[P+"puzzle" + pagename + p]
        && cubes[j][0] >= puzzles[p][5]
        && cubes[j][0] < puzzles[p][5] + puzzles[p][0]
        && cubes[j][1] >= puzzles[p][6]
        && cubes[j][1] < puzzles[p][6] + puzzles[p][0]
      ){
        delete cubes[j];
      }
    }
  }
  
  for (i in cubes){
    objects.innerHTML+=`<div id=cube${i} class="cube rock"style=left:${cubes[i][0]*sidesize}vh;top:${cubes[i][1]*sidesize}vh;width:5vh;height:5vh><div class=front></div><div class=up style="background-position:${-300-cubes[i][0]*sidesize}vh ${-140-cubes[i][1]*sidesize}vh"></div><div class=right></div><div class=left></div><div class=back>`;
  }
  
  // Hints
  for (i in hints){
    
    if(!(son ^ hints[i][5])){
    // => if((son && hints[i][5]) || (!son && !hints[i][5])){
      
      if(
        // Min size
        (hints[i][3] && hints[i][3] <= snakelength)
        ||
        // Max size
        (hints[i][4] && hints[i][4] >= snakelength)
      ){
        //hints[i][4] = 1;
        objects.innerHTML+=`<div id=hint${""+pagename+i} class=hint style=left:${hints[i][1]*sidesize}vh;transform:translateY(${hints[i][2]*sidesize+5}vh)translateZ(${(hints[i][6]*sidesize||0)}vh)rotateX(-70deg)translateY(-4vh)>${hints[i][0]}`;
      }
    }
  }
  
  // puzzles
  for(var p in puzzles){
    
    size = puzzles[p][0];
    
    var whtml = '';
    var ghtml = '';
    var html =
    `<div id=puzzle${p} class="cube wrap visible ${(puzzles[p][2]&&!L[P+"puzzle"+pagename+p])?"wrapvisible":""}"style=left:${puzzles[p][5]*sidesize}vh;top:${puzzles[p][6]*sidesize}vh;width:${puzzles[p][0]*sidesize}vh;height:${size*sidesize}vh>${puzzles[p][2]?"<div class=left></div><div class=right></div>":""}<div id=down${p} class=down></div><div id=back${p} class=back></div>${puzzles[p][2]?"<div class=front>":""}`;
    puzzle.innerHTML += html;

    // Not solved (black/white)
    // Solved (blue/gold)
    var color1 = "000", color2 = "fff";
    if(L[P+"puzzle" + pagename + p]){
      color1 = "44c";
      color2 = "fd0";
      puzzles[p][2]=0;
    }
      
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        if(puzzles[p][3]){
          whtml += `<div class=cell id=w${p}-${i}-${j} style=width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][3][i*size+j]=="1")?color1:color2}></div>`;
        }
        if(puzzles[p][4]){
          ghtml += `<div class=cell id=g${p}-${i}-${j} style=width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][4][i*size+j]=="1")?color1:color2}></div>`;
        }
      }
    }
    
    if(top["down" + p]){
      top["down" + p].innerHTML += ghtml;
    }
    if(top["back" + p]){
      top["back" + p].innerHTML += whtml;
    }
  }
  
  // The end
  if(pagename == "pN"){
    objects.innerHTML += "<div style='position:fixed;transform:rotateZ(-90deg)translateX(-73vh)translateY(21vh)translateZ(338vh);font:30vh/30vh a'>THE<br><br>END";
  }
  
  
  
  // EDITOR
  
  if(iseditor){
    
    // Hide ground checkbox & label if they're alone
    if(!L[P+"editorfull"] && !((L[P+"son"] && L[P+"snakelength"] > 6))){
      ground.style.opacity = groundlabel.style.opacity = 0;
      ground.style.position = groundlabel.style.position = "fixed";
      ground.style.top = groundlabel.style.top = "-9vh";
    }
    
    // Init
    currentpuzzle = 0;
    movesnake(1);
    hasground = 1;
    haswall = 0;
    haswrap = 0;
    issolved = 0;
    puzzles[0][2] = 0;
    
    // Resize the grid
    // Called when the grid size input is changed
    setTimeout(()=>{

    (gridsize.onchange =
    gridsize.oninput = 
    resetgrid = e => {

      //issolved = 0;
      resetsnake();
      movesnake();
      share.disabled = 1;
      
      // Update range indicator (z = value)
      gridval.innerHTML = size = +gridsize.value;
      puzzle0.style.width = puzzle0.style.height = size * sidesize + "vh";
      puzzles[0][0] = size;
      
      // Reset grids (html and data)
      down0.innerHTML = '';
      back0.innerHTML = '';
      whtml = '';
      ghtml = '';
      dw = [];
      dg = [];
      for(i = 0; i < size; i++){
        dw[i] = [];
        dg[i] = [];
        for(j = 0; j < size; j++){
          dw[i][j] = 0;
          dg[i][j] = 0;
        }
      }
      
      // Fill grids HTML
      for(i = 0; i < size; i++){
        for(j = 0; j < size; j++){
          whtml += `<div class=cell id=w${cellprefix}-${i}-${j} style=width:${sidesize}vh;padding-top:${sidesize}vh></div>`;
          ghtml += `<div class=cell id=g${cellprefix}-${i}-${j} style=width:${sidesize}vh;padding-top:${sidesize}vh></div>`;
        }
      }
      if(hasground) down0.innerHTML += ghtml;
      if(haswall) back0.innerHTML += whtml;
    })();
    
    
    // Reset and resize the snake (when the snake size range changes)
    snakesize.onchange =
    snakesize.oninput = e => {
      
      // Update range indicator and snake
      snakeval.innerHTML = snakelength = +snakesize.value;
      resetsnake();
      movesnake();
    }
    
    // Ground/wall checkboxes
    // (can't be both disabled)
    ground.onclick = e => {
      if(ground.checked){
        hasground = 1;
      }
      else if(top.wall){
        hasground = 0;
        haswall = 1;
        son = 1;
        wall.checked = true;
      }
      scene.className = haswall ? "haswall" : "";
      resetgrid();
    }
   
    if(top.wall){
      wall.onclick = e => {
        if(top.wall && wall.checked){
          haswall = 1;
          puzzles[0][3] = 1;
          son = 1;
        }
        else {
          son = 0;
          haswall = 0;
          hasground = 1;
          ground.checked = true;
          puzzles[0][3] = 0;
        }
        scene.className = haswall ? "haswall" : "";
        resetgrid();
      }
    }

    
    // Wrap checkbox
    if(top.wrap){
      wrap.onclick = e => {
        haswrap = puzzles[0][2] = wrap.checked || 0;
        puzzle0.className = "cube wrap visible " + (haswrap ? "wrapvisible" : "");
        resetgrid();
      }
    }
    
    // Share a puzzle
    // Generates an url with the hash "#gridsize,snakesize,wrap,wall,ground".
    print = a => {
      var r = "";
      for(i=0;i<size;i++){
        for(j=0;j<size;j++){
          if(top[a+"0-"+i+"-"+j].style.background && top[a+"0-"+i+"-"+j].style.background.match(/255/)){
            r+=0;
          }
          else{
            r+=1;
          }
        }
      }
      return r;
    }

    share.onclick = () => {
      var r = [];
      r.push(size)
      r.push(snakelength);
      r.push(haswrap ? 1 : 0);
      r.push(haswall ? print("w") : '')
      r.push(ground.checked ? print("g") : '')
      
      window.open("//twitter.com/intent/tweet?text=I%20made%20a%20level%20for%20@MaximeEuziere's%20%23js13k%20game%20LOSSST!%0APlay%20here:%20http%3A%2F%2Fjs13kgames.com%2Fentries%2Flossst%0AMy%20level:%20http%3A%2F%2Fjs13kgames.com%2Fgames%2Flossst%2Findex.html%23"+r+"%0A%23LOSSSTlevels");
    }

    },100);


  }
  
  
  // Init snake
  
  // Hub's opening cinematic
  if(pagename == "px" && !L[P+"snakex"]){
      
    // Lock controls
    lock = 1;

    // Resize and place snake at the right place, slow it down
    setTimeout(()=>{
      resetsnake();
      movesnake();
      snakecubemove0.style.transition='transform .5s'
    },2000);
    
    
    // Head goes out of the ground 
    setTimeout(()=>{
      snakex.push(snakex[head]);
      snakey.push(snakey[head]);
      snakez.push(0);
      snakeangle.push(snakeangle[head]);
      head++;
      movesnake()
    },5500+fx);
    
    // Shake head
    setTimeout(()=>{
      snakecubemove0.style.transition='';
      snakecuberotate0.style.transition='transform .2s';
      snakecuberotate0.style.transform='rotateZ('+(-Math.PI/4)+'rad)';
    },6500+fx);
    
    setTimeout(()=>{
      snakecuberotate0.style.transform='rotateZ('+(Math.PI/4)+'rad)';
    },7000+fx);
    
    setTimeout(()=>{
      snakecuberotate0.style.transform='';
    },7500+fx);
    
    setTimeout(()=>{
      snakeshadow0.style.transition=snakecuberotate0.style.transition='';
    },8000+fx);
    
    // Stop music, unlock keys
    setTimeout(()=>{
      clearInterval(musicint);
      lock=0
      hintpx0.style.opacity=1;
    },8400);
    
    // Reset custom transitions, unlock keyboard, show mobile controls
    setTimeout(()=>{
      scene.style.transition='transform 1s,transform-origin 1s';
      L[P+"snakex"]=20;
      L[P+"snakey"]=10;
      b.innerHTML+="<div style='position:fixed;font:8vh a;top:3vh;right:3vh'onclick=location='index.html'>×";
      if(mobile){
        kU.className=kD.className=kL.className=kR.className='';
        L[P+"wasd"]=1
      }
    },9000);
  }
  
  // Return to hub, or enter other rooms
  else{
    scene.style.transition = 'transform 1s,transform-origin 1s';
    resetsnake();
  }
 
  // Move snake at the right place
  movesnake();
  
},

// Reset the snake's positions and angles and draw it
// if son == 1, draw the son.
resetsnake = noresethistory => {
  
  // Choose container
  var container = (son && !iseditor) ? snake2 : snake;
  
  // Delete the snake
  container.innerHTML = "";
      
  if(!noresethistory){
    
    // Reset positions & angles
    snakex = [];
    snakey = [];
    snakez = [];
    snakeangle = [];
  }
  
  // Compute cubes sizes in vh (editor only)
  head = snakelength - 1;
  
  if(!noresethistory){
    
    // Load
    if(pagename == "py"){
      for(i = 0; i < snakelength; i++){
        snakex[head-i] = 1 - i;
        snakey[head-i] = 10;
        snakez[head-i] = 0;
        snakeangle[head-i] = -Math.PI/2;
      }
    }
    
    // Editor
    else if(iseditor){
      for(i = 0; i < snakelength; i++){
        snakex[head-i] = 13-i;
        snakey[head-i] = 12;
        snakez[head-i] = 0;
        snakeangle[head-i] = -Math.PI/2;
      } 
    }
    
    // Game
    else if(L[P+"snakex"]){
      var x = +L[P+"snakex"];
      var y = +L[P+"snakey"];
      var z = +L[P+"snakez"];
      
      // Return to hub from 3-1: z = 1
      if(pagename == "px" && snakex[head] < 2){
        z = L[P+"snakez"] = 1;
      }
      
      // Son start
      if(pagename == "pI" && easteregg && son == 1){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i - 1;
          snakeangle[head-i] = 0;
        }
      }
        
      // Arrive from left
      else if(x < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x - i;
          snakey[head-i] = y;
          snakez[head-i] = z;
          snakeangle[head-i] = -Math.PI / 2;
        }
      }
      
      // Arrive from right
      else if(x > w - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x + i;
          snakey[head-i] = y;
          snakez[head-i] = z;
          snakeangle[head-i] = Math.PI / 2;
        }
      }
      
      // Arrive from top
      else if(y < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x;
          snakey[head-i] = y - i;
          snakez[head-i] = z;
          snakeangle[head-i] = 0;
        }
      }
      
      // Arrive from bottom
      else if(y > h - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x;
          snakey[head-i] = y + i;
          snakez[head-i] = z;
          snakeangle[head-i] = 0;
        }
      }
      
      // Other
      else {
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i;
          snakeangle[head-i] = 0;
        }
      }
    }
      
    // Game start
    else {
      if(pagename == "px"){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i - 1;
          snakeangle[head-i] = 0;
        }
      }
    }   
  }
  
  // Draw 16 snake cubes (or more if snalelength is > 16) and hide them below the ground
  // The first one (the head) has a tongue (Y), mouth (‿) and eyes (👀)
  // DOM for each cube: #snakecubemove${i} > #snakecuberotate${i} > #snakecube${i} > 5 * div (the bottom div is useless)
  for(i = 0; i < Math.max(snakelength + 4, 16); i++){
    container.innerHTML += `<div id=snakecubemove${i} class=snakecubemove style=transform:translateX(50vh)translateY(50vh)translateZ(-30vh);width:${sidesize-.7}vh;height:${sidesize-.7}vh><div class=snakeshadow id=snakeshadow${i}></div><div id=snakecuberotate${i} class=snakecuberotate><div class="cube snake"id=snakecube${i}>${i<1?"<div class=tongue>Y</div>":""}<div class=up style="font:${sidesize*.5}vh/${sidesize*.8}vh a">${i<1?"👀":""}</div><div class=front>${i<1?"‿":""}</div><div class=right></div><div class=left></div><div class=back>`;
  }
},


// Onload
indexx = (n, cross) => {
  
  if(n===0 || n=="pz"){
    clearInterval(musicint);
    index=position=0;
  }
  
  // Editor
  if(n == "pz"){
    iseditor = 1;
    delete L[P+"puzzlepez"];
    currentpuzzle = 0;
  }
  
  // Go to the last saved room (or hub by default)
  pagename = n || L[P+"page"] || "px";
  
  // Draw html structure
  document.body.outerHTML =
`<body id=b class=${pagename}>
<div id=perspective>
<div id=scene style=transform:translateX(-97vh)translateY(-50vh)rotateZ(90deg)translateZ(119vh);transform-origin:100vh+50vh>
<div id=objects>`

+ (iseditor?
`<div class=hint style=width:60vh;transform:translateX(70vh)translateY(1vh)translateZ(2vh)rotateX(-42deg)>
<label style=width:100%;text-align:center>Create a pattern with the snake and share it !</label>
<br style=line-height:6vh>
<div style=text-align:left;padding-left:5vh>
<label>Grid</label> <input id=gridsize type=range value=5 min=3 max=8 step=1>
<span id=gridval>5</span>
<br>
<label>Snake</label> <input id=snakesize type=range value=5 min=5 max=40 step=1>
<span id=snakeval>5</span>
</div>
<input type=checkbox id=ground checked> <label for=ground id=groundlabel>ground</label>
${(L[P+"editorfull"]||(L[P+"son"]&&L[P+"snakelength"]>6))?"<input type=checkbox id=wall> <label for=wall>wall</label>":""}
${(L[P+"editorfull"]||L[P+"son"])?"<input type=checkbox id=wrap> <label for=wrap>wrap</label>":""}
<br>
<center>
<button id=share disabled>Share</button>
</center>
</div>`
: "")+

`
</div>
<div id=puzzle></div>
<div id=snake></div>
<div id=snake2></div>
</div>
</div>
<center id=mobilecontrols style='font:5vh arial,sans-serif;color:#fff;position:fixed;bottom:9vh;left:0;width:100vw'>
<button id=kU class=hidden ontouchstart=touchstart(38) ontouchend=touchend(38)>↑</button>
<button id=kD class=hidden ontouchstart=touchstart(40) ontouchend=touchend(40)>↓</button>
<button id=kL class=hidden ontouchstart=touchstart(37) ontouchend=touchend(37)>←</button>
<button id=kR class=hidden ontouchstart=touchstart(39) ontouchend=touchend(39)>→</button>
<button id=kT class=hidden ontouchstart=touchstart(16) ontouchend=touchend(16)>⬆︎</button>
<button id=kB class=hidden ontouchstart=touchstart(17) ontouchend=touchend(17)>⬇︎</button>
<button id=kw class=hidden ontouchstart=touchstart(18) ontouchend=touchend(18)>↩</button>
<button id=kx class=hidden ontouchstart=touchstart(82) ontouchend=touchend(82)>×</button>
<button id=ky class=hidden ontouchstart=touchstart(49) ontouchend=touchend(49)>↻</button>
<button id=kz class=hidden ontouchstart=touchstart(51) ontouchend=touchend(51)>↺</button>
</center>
<center id=text style='font:5vh arial,sans-serif;color:#fff;position:fixed;bottom:9vh;left:0;width:100vw'>`;
  
  // Make the first apple appear (when the game starts only)
  L[P+"appleappearedpx0"] = 1;
  
  // Enter room
  enterroom();
  
  // Show buttons that already appeared before
  if((mobile && pagename == "py") || L[P+"wasd"]){
    kU.className = kD.className = kL.className = kR.className = '';
  }
  if((mobile && pagename == "py") || L[P+"backtrack"]){
    kw.className = "";
  }
  if((mobile && pagename == "py") || L[P+"reset"]){
    kr.className = "";
  }
  if((mobile && pagename == "py") || L[P+"topbottom"]){
    kT.className = "";
    kB.className = "";
  }
  if((mobile && pagename == "py") || L[P+"camera"]){
    ky.className = "";
    kz.className = "";
  }
  
  if(!iseditor){
    int_time = setInterval(()=>{
      L[P+"time"]=++ocd_time;
      document.title='LOSSST: '+ocd_moves+'m, '+ocd_time+'s'
    },1000);
  }
    
  if(cross){
    b.innerHTML+=`<div style='position:fixed;font:8vh a;top:3vh;right:3vh'onclick=location='index.html'>×`;
  }
},

touchstart = (n) => {
  if(touchintervals[n]){
    clearInterval(touchintervals[n]);
  }
  
  onkeydown({which:"+n+"});
  touchintervals[n] = setInterval(()=>{
    onkeydown({which:n})
  },150);
},

touchend = (n) => {
  setTimeout(()=>{
    clearInterval(touchintervals[n]);
    top.onkeyup();
  },150);
}

onload = () => {
  
  if(location.hash.length > 1){
    indexx("py",1);
    return;
  }
  
  setTimeout(()=>{
    musicint = setInterval(()=>{
      currentsong.forward();
    },500)
  },200);
  
  // Menu 1
  b.innerHTML = `<center id=e>👀</center>
<center id=itext></center>
<div id=perspective style=perspective:30vh>
<center id=menu>
<h1>LOSSST</h1>
<span onclick=a()>New game</span><br>
` + ((L[P+"start"] && !L[P+"ended"]) ? '<span onclick=indexx(0,1)>Continue</span><br>' : '') + `
<span onclick=indexx("pz",1)>Puzzle editor</span><br>
<span onclick=window.open('//xem.github.io/JS13k17/bonus')>Bonus`;

  // New game
  a = () => {
    for(i in localStorage){
      if(i.indexOf("lossst") == 0 && i.indexOf("editorfull") == -1){
        delete localStorage[i];
      }
    }
    L[P+"start"] = 1;
    menu.innerHTML = '<br><br><span onclick=intro(0)>Desssktop</span><br><br><span onclick=intro(1)>Mobile';
  }

  // Intro
  intro = function(m) {
  
    clearInterval(musicint);
    index=position=0;
    musicint = setInterval(currentsong.forward, 250);
    
    L[P+"mobile"] = mobile = m;
    L[P+"snakelength"] = snakelength = 5;
    ocd_time = L[P+"time"] = 0,
    ocd_moves = L[P+"moves"] = 0,
    
    L[P+"moves"] = 0;
    L[P+"time"] = 0;
    menu.innerHTML = "";
    
    // Eyes
    setTimeout(()=>{
      e.style.margin=0
    }, 500);
    dir = 1;
    inter = setInterval(()=>{
      e.style.opacity=0;
      setTimeout(()=>{
        e.style.opacity=1;
        dir=-dir;
        e.style.transform="scaleX("+dir+")";
      },150);
    }, 3000);
    
    // text
    setTimeout(()=>{
      itext.innerHTML="I lossst my kid !"
    }, 2000);
    setTimeout(()=>{
      itext.innerHTML=""
    }, 5000);
    setTimeout(()=>{
      clearInterval(inter);
      e.style.margin='-80vh 0 0'
    }, 7000);
    setTimeout(indexx, 7500);
  } 
}

// GAMEPLAY

// Snake

// Move the snake
// when snakex/y/z and snakeangle have been updated (or reset)
// Also, eat apples
// Also, open doors
// Also, enter puzzles
movesnake = (cameraonly) => {

  for(let i = 0; i < snakelength; i++){
    
    if(!cameraonly){
        
      // oldx/y/z and newx/y/z are the positions where the cube disappear and reappear during the wrap animation  
      let wrapping = oldx = oldy = oldz = newx = newy = newz = 0;
      
      // Wrap transition
      if(haswrap && size){
        
        // Left
        if(snakex[(head-i) - 1] == leftoffset && snakex[(head-i)] == leftoffset + size - 1){
          wrapping = 1;
          oldx = leftoffset - 1;
          newx = leftoffset + size;
          oldy = newy = snakey[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Right
        else if(snakex[(head-i) - 1] == leftoffset + size - 1 && snakex[(head-i)] == leftoffset){
          wrapping = 1;
          oldx = leftoffset + size;
          newx = leftoffset - 1;
          oldy = newy = snakey[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Forwards
        else if(snakey[(head-i) - 1] == topoffset && snakey[(head-i)] == topoffset + size - 1){
          wrapping = 1;
          oldy = topoffset - 1;
          newy = topoffset + size;
          oldx = newx = snakex[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Backwards
        else if(snakey[(head-i) - 1] == topoffset + size - 1 && snakey[(head-i)] == topoffset){
          wrapping = 1;
          oldy = topoffset + size;
          newy = topoffset - 1;
          oldx = newx = snakex[(head-i)];
          oldz = newz = snakez[(head-i)];
        }
        
        // Upwards
        else if(snakez[(head-i) - 1] == 0 && snakez[(head-i)] == size - 1){
          wrapping = 1;
          oldz = -1;
          newz = size;
          oldx = newx = snakex[(head-i)];
          oldy = newy = snakey[(head-i)];
        }
        
        // Downwards
        else if(snakez[(head-i) - 1] == size - 1 && snakez[(head-i)] == 0){
          wrapping = 1;
          oldz = size;
          newz = -1;
          oldx = newx = snakex[(head-i)];
          oldy = newy = snakey[(head-i)];
        }
      }
      
      // Wrapping transition
      if(wrapping){
        
        // Rotate
        top["snakecuberotate"+i].style.transform = "rotateZ("+(snakeangle[(head-i)])+"rad)";
        
        // Disappear after the wrap start
        top["snakecubemove"+i].style.transform = "translateX("+(oldx*sidesize+.5)+"vh)translateY("+(oldy*sidesize+.5)+"vh)translateZ("+(oldz*sidesize+.5)+"vh)scale(.01)scaleZ(.01)";
        
        // Disable transitions
        setTimeout(()=>{
          top["snakecubemove"+i].style.transition='none';
        }, 90);
        
        // Move cube at the position before the end of the wrap
        let nx = newx;
        let ny = newy;
        let nz = newz;
        setTimeout(()=>{
          top["snakecubemove"+i].style.transform="translateX("+(nx*sidesize+.5)+"vh)translateY("+(ny*sidesize+.5)+"vh)translateZ("+(nz*sidesize+.5)+"vh)scale(.01)";
        }, 100);
        
        // Reenable transitions and finish the wrap
        setTimeout(()=>{
          top["snakecubemove"+i].style.transition='';
          top["snakecubemove"+i].style.transform="translateX("+(snakex[(head-i)]*sidesize+.25)+"vh)translateY("+(snakey[(head-i)]*sidesize)+"vh)translateZ("+(snakez[(head-i)]*sidesize+.5)+"vh)"
        }, 150);
      }
      
      // Normal transition (just update snakecubemove and snakecuberotate)
      else{
        try{
          top["snakecubemove"+i].style.transform = `translateX(${snakex[(head-i)]*sidesize+.25}vh)translateY(${snakey[(head-i)]*sidesize}vh)translateZ(${snakez[(head-i)]*sidesize+.5}vh)`;
          top["snakecuberotate"+i].style.transform = `rotateZ(${snakeangle[(head-i)]}rad)`;
        }
        catch(e){};
      }
      
      // Shadow
      try{
        top["snakeshadow"+i].style.display = snakez[(head-i)] == 0 ? "" : "none";
      }
      catch(e){};
    }
  }
    
  if(iseditor){
    scene.style.transform = "translateX(-100vh)translateY(-37vh)translateZ(-5vh)rotateX(33deg)";
  }
  
  // no puzzle or puzzle already solved: camera follows the snake
  else if(currentpuzzle === null || L[P+"puzzle"+pagename+currentpuzzle]){
    scene.style.transform="translateX("+(-snakex[head]*sidesize)+"vh)translateY("+(-snakey[head]*sidesize) + "vh)translateZ(45vh)rotateX(40deg)rotateZ("+rot+"rad)";
    scene.style.transformOrigin = "" + (snakex[head]*sidesize) + "vh " + (snakey[head]*sidesize) + "vh";
  }
  
  // Unsolved puzzle: fixed camera
  else {
    scene.style.transform = "translateX(" + (-(leftoffset + puzzles[currentpuzzle][0] / 2) * sidesize + 5) + "vh)translateY(" + (-(topoffset + puzzles[currentpuzzle][0] / 2) * sidesize + 8) + "vh)translateZ(" + (90 - (puzzles[currentpuzzle][0] * (sidesize + 3))) + "vh)rotateX(30deg)rotateZ("+rot+"rad)";
    
    scene.style.transformOrigin = ""+((leftoffset + puzzles[currentpuzzle][0] / 2) * sidesize + 5) + "vh " +((topoffset + puzzles[currentpuzzle][0] / 2 - 1) * sidesize + 8) + "vh";
  }
  
  // Fall if all the cubes are in the air
  var flying = son ? 1 : 0;
  for(i = 0; i < snakelength; i++){
    if(snakez[head-i] <= 0){
      flying = 0;
      break;
    }
    for(j in cubes){
      if(cubes[j][0] == snakex[head-i] && cubes[j][1] == snakey[head-i] && snakez[head-i] == 1){
        flying = 0;
      }
    }
  }
  
  if(flying){
    
    // Fall
    for(i = 0; i < snakelength; i++){
      snakez[head-i]--;
    }
    
    // in wrap puzzles, the snake can get stuck in an infinite loop. If it happens, backtrack snakelength times
    try{
      movesnake();
    }
    
    catch(e){
      for(var j = snakelength * 2; j--;){
        snakex.pop();
        snakey.pop();
        snakez.pop();
        snakeangle.pop();
        head--;
      }
      exithead = 0;
      movesnake();
    }
  }
  
  // Doors
  var x = snakex[head],
  y = snakey[head],
  z = snakez[head];
  
  for(var i in doors){
    
    // Open a door if the snake's length is big enough
    if(((doors[i][10] && son) || (!doors[i][10] && !son)) && top["door" + pagename + i] && doors[i][3] > 0 && snakelength >= doors[i][3] && Math.hypot(x - doors[i][0], y - doors[i][1]) < 4 && !L[P+"door" + pagename + i]){
      top["door" + pagename + i].className = "door open";
      
      if(doors[i][6] && !(pagename == "px" && i > 2)){
        mkaudio(SNDopendoor).play();
      }
      
      // Save that in L for next visit
      L[P+"door" + pagename + i] = 1;
    }
    
    // Walk on a door path if the door is open
    if(top["door" + pagename + i] && top["door" + pagename + i].className == "door open" && Math.hypot(x - doors[i][0], y - doors[i][1]) < 2){
      L[P+"page"] = pagename = doors[i][5];
      setTimeout(enterroom, 600);
      
      // Save snake future position in L
      L[P+"snakex"] = doors[i][7];
      L[P+"snakey"] = doors[i][8];
      L[P+"snakez"] = 0;
      L[P+"snakeangle"] = snakeangle[head];
    }
  }
  
  // Puzzles
  if(currentpuzzle !== null) checkgrid();
  
  puzzling = 0;
  if(!iseditor) currentpuzzle = null;
  
  if(!iseditor){
    dg = [];
    dw = [];
  }

  for(p in puzzles){
    if(
      x >= puzzles[p][5]
      && x < puzzles[p][5] + puzzles[p][0]
      && y >= puzzles[p][6]
      && y < puzzles[p][6] + puzzles[p][0]
    ){
      
      currentpuzzle = +p;
      issolved = 0;
      if(L[P+"puzzle" + pagename + p]){
        issolved = 1; 
      }
      else {
        puzzling = 1;
      }
      cellprefix = p;
      hasground = !!puzzles[p][4];
      haswall = !!puzzles[p][3];
      haswrap = !!puzzles[p][2];
      leftoffset = puzzles[p][5];
      topoffset = puzzles[p][6];
      size = puzzles[p][0];
      for(i = 0; i < size; i++){
        dg[i] = [];
        dw[i] = [];
        for(j = 0; j < size; j++){
          if(puzzles[p][3]){
            dw[i][j] = +puzzles[p][3][i * puzzles[p][0] + j];
          }
          if(puzzles[p][4]){
            dg[i][j] = +puzzles[p][4][i * puzzles[p][0] + j];
          }
        }
      }
      checkgrid();
    }
  }
};

// Check if a position is free and in bounds
checkmove = (x, y, z) => {
  
  stuck = 0;
  
  // Editor map boundaries
  /*if(iseditor && playing){
    if(x < -5 || x > size + 3 || y < -2 || y > size){
      stuck = 1;
    }
  }*/
  
  // Room boundaries
  //else {
    if(x < 0 || x >= w || y < 0 || y >= h){
      stuck = 1;
    }
  //}
  
  // Trees hitbox (trees are smaller in mobile)
  for(var i in trees){
    if(x >= trees[i][0] - 1 && x <= trees[i][0] && y == trees[i][1]){
      stuck = 1;
    }
  }
  
  // Hints hitbox
  for(var i in hints){
      if(x >= hints[i][1] && x <= hints[i][1] + 3 && y == hints[i][2] && snakelength >= hints[i][3] && (!hints[i][4] || snakelength <= hints[i][4]) && ((son && hints[i][5]) || (!son && !hints[i][5]))){
        stuck = 1;
      }
  }
  
  // Eat apples
  for(var i in apples){
  
    if(L[P+"appleappeared" + pagename + i] && x == apples[i][0] && y == apples[i][1] && snakez[head] == 0){
    
      mkaudio(SNDeat).play();
      
      // Ending easter egg
      if(pagename == "pN"){
        lock = 1;
        musicint = setInterval(currentsong.forward,150);
        L[P+"ended"] = 1;

        setTimeout(()=>{
          appleshadow0.remove();
          apple0.style.transform='translateY(319vh)translateZ(2vh)rotateX(-65deg)rotateY(90deg)';
          apple0.style.transition=scene.style.transition='10s';
          apple0.style.transform='translateY(15vh)translateZ(2vh)rotateX(-65deg)';
          scene.style.transform=(mobile?'translateX(-133vh)translateY(-249vh)translateZ(-373vh)rotateZ(90deg)':'translateX(-144vh)translateY(-249vh)translateZ(-340vh)rotateZ(90deg)')
        }, 200);
        
        for(let i in puzzles){
          setTimeout(()=>{
            top["back"+i].style.transition='.5s';
            top["back"+i].style.transform='translateY(-125%)'
          }, [1450, 2500, 3900, 5500][i]);
        }
        
        setTimeout(()=>{
          clearInterval(int_time);
          L[P+"editorfull"]=1;
          b.style.background='#000';
          L[P+"son"] = 0;
          b.innerHTML='<div id=perspective style=perspective:90vh><center id=menu style=width:75vh;transform:translateX(-38vh)translateY(-35vh)rotateX(-28deg)><span style=font-size:4vh;line-height:5vh><h1>Congrats!</h1><br>You completed the game in<br>'+ocd_time+' seconds and '+ocd_moves+' moves!<br><br><a href=https://twitter.com/intent/tweet?text=I%20played%20LOSSST,%20a%20%23js13k%20game%20by%20by%20@MaximeEuziere%0Amy%20score:%20'+ocd_time+'%20seconds%20and%20'+ocd_moves+'%20moves!%0Ahttp%3A%2F%2Fjs13kgames.com%2Fentries%2Flossst target=_blank style=color:#def;font-size:4vh>TWEET YOUR SCORE</a><br><br>Dev record:<br>1265 seconds, 3071 moves<br><br>3D puzzle editor unlocked !<br><br><a href=index.html style=font-size:4vh>TITLE SCREEN'
        },15000);
        
        var z = document.querySelectorAll(".cell");
        for(let i in z){
          try{
            if(z[i].style.backgroundColor.match(/68/g).length == 2){
              setTimeout(()=>{
                top[z[i].id].style.background='#a00'
              }, 8000 + i * 10);
            }
          }
          catch(e){}
        }
        
      }
      
      // Eat an apple
      else {
        delete apples[i];
        top["apple" + i].remove();
        top["appleshadow" + i].remove();
        snakelength++;
        L[P+"snakelength"] = snakelength;
        L[P+"appleeaten" + pagename + i] = 1;
        
        // Room 2-2: easter-egg
        if(pagename == "pF" && snakelength == 16){
          lock = 1;
          musicint = setInterval(currentsong.forward,150);
          easteregg = 1;
          scene.style.transition = "5s";
          scene.style.transform = `translateX(-180vh)translateY(-53vh)translateZ(${mobile?-422:-180}vh)rotateZ(180deg)`;
          setTimeout(()=>{
            scene.style.transition='1s';
            lock=easteregg=0;
            movesnake();
            objects.innerHTML+='<div class=hint style=left:190vh;transform:translateY(50vh)rotateX(-55deg)translateY(-4vh)>←<br>Exit';
            clearInterval(musicint)
          },10000);
          var z = document.querySelectorAll(".cell");
          for(let i in z){
            try{
              if(z[i].id.match(/g\d-/) && z[i].style.backgroundColor.match(/68/g).length == 2){
                setTimeout(()=>{
                  top[z[i].id].style.background='#a00'
                }, 5500 + i * 10);
              }
            }
            catch(e){}
          }
        }
      }
    }
  }
  
  // Rock
  for(var i in cubes){
    if(x == cubes[i][0] && y == cubes[i][1] && z == 0){
      stuck = 1;
    }
  }
  
  // Emoji
  for(var i in emoji){
    if(pagename != "pC" && x == emoji[i][1] && y == emoji[i][2] && z == 0){
      stuck = 1;
    }
  }
  
  // Doors
  for(var i in doors){
    
    // Walk on a door path if the door is open
    if(top["door" + pagename + i] && top["door" + pagename + i].className == "door open" && Math.hypot(x - doors[i][0], y - doors[i][1]) <= 2){
      stuck = 0;
    }
  }
  
  // Other snake cubes hitbox
  // NB: no need to check if the last cube (the tail) is there because when the snake will move, that cube won't be here anymore so we can take its place. Hence the "snakelength - 2"
  for(i = snakelength - 2; i > 0; i--){
    if(snakex[head-i] == x && snakey[head-i] == y && snakez[head-i] == z){
      stuck = 1;
    }
  }
  
  // Puzzle with wall and no wrap: wall hitbox
  for(p in puzzles){

    if(
      puzzles[p][3] // wall
      && x >= puzzles[p][5] // x betwee left and right
      && x < puzzles[p][5] + puzzles[p][0]
      && (
        (
          // no wrap && head trying to pass from top line to after the wall
          y == puzzles[p][6] - 1  && snakey[head] == puzzles[p][6] && !puzzles[p][2]
         ) 
        ||
        (
        
          // Head trying to pass from after the wall to first line
          y == puzzles[p][6] && snakey[head] == puzzles[p][6] - 1
        )
      )
    ){
      stuck = 1;
    }
  }
  
  // Room 2-5: find son
  if(pagename == "pI" && x == 18 && !son){
    stuck = 1;
    lock = 1;
    easteregg = son = 1;
    clearInterval(musicint);
    currentsong = song2;
    index = position = 0;
    musicint=setInterval(song2.forward, 250);
    L[P+"son"] = 1;
    L[P+"snakelength"] = snakelength = 5;
    for(let i = 0; i < 21; i ++){
      cubes.push([snakex[head-i], snakey[head-i]]);
      top["snakecubemove" + i].id = "";
      top["snakecuberotate" + i].id = "";
      top["snakeshadow" + i].id = "";
      top["snakecube" + i].id = "";
    }
    scene.style.transition = "2s";
    resetsnake();
    movesnake();
    scene.style.transform = "translateX(-105vh)translateY(-51vh)translateZ(80vh)rotateX(45deg)";
    scene.style.transformOrigin = "140vh 70vh";
    setTimeout(()=>{
      snakex.push(snakex[head]);
      snakey.push(snakey[head]);
      snakez.push(0);
      snakeangle.push(snakeangle[head]);
      head++;
      movesnake()
    }, 3000);
    setTimeout(()=>{
      text.innerHTML='Daddy!'
    }, 4000);
    setTimeout(()=>{
      text.innerHTML=''
    }, 6000);
    setTimeout(()=>{
      text.innerHTML='I lossst my soccer ball!'
    }, 7000);
    setTimeout(()=>{
      text.innerHTML=''
    }, 9000);
    setTimeout(()=>{
      text.innerHTML='But I found new moves!'
    }, 10000);
    setTimeout(()=>{
      text.innerHTML='';
      easteregg=lock=0;
      clearInterval(musicint);
      scene.style.transition='1s';
      movesnake();
      checkapple();
      if(mobile){
        kT.className=kB.className='';
        L[P+"topbottom"]=1;
      }
    }, 13000);
  }
}

// Check if the grid is solved
checkgrid = e => {
  
  if(issolved){
    return;
  }
  
  if(currentpuzzle === null) return;
  
 
  solved = 1;
  if(iseditor){
    share.disabled = 0;
  }
  
  // Repaint everything in black and white
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      try{
        if(top[`g${cellprefix}-${i}-${j}`]){
          top[`g${cellprefix}-${i}-${j}`].style.background = dg[i][j] ? "#000" : "#fff";
        }
        if(top[`w${cellprefix}-${i}-${j}`]){
          top[`w${cellprefix}-${i}-${j}`].style.background = dw[i][j] ? "#000" : "#fff";
        }
      }
      catch(e){}
    }
  }
  
  // If head is not in the puzzle, return
  if(snakex[head] < leftoffset || snakex[head] > leftoffset + size - 1 || snakey[head] < topoffset || snakey[head] > topoffset + size - 1 || snakez[head] < 0 || snakez[head] > size - 1){
    if(iseditor)share.disabled = 1;
    return;
  }
  
  // For each snake cube
  for(i = 0; i < snakelength; i++){
 
    // Paint the good cells in green and the bad ones in red (if they exist, and if the snake part is in the puzzle)
    if(top[`g${cellprefix}-${snakey[head-i] - topoffset}-${snakex[head-i] - leftoffset}`]){
      top[`g${cellprefix}-${snakey[head-i] - topoffset}-${snakex[head-i] - leftoffset}`].style.background = dg[snakey[head-i] - topoffset][snakex[head-i] - leftoffset] ? "#080" : (iseditor ? "#44c" : "#f00");
    }
    
    if(snakey[head-i] >= topoffset && snakey[head-i] < topoffset + size && top[`w${cellprefix}-${size - 1 - snakez[head-i]}-${snakex[head-i] - leftoffset}`]){
      top[`w${cellprefix}-${size - 1 - snakez[head-i]}-${snakex[head-i] - leftoffset}`].style.background = dw[size - 1 - snakez[head-i]][snakex[head-i] - leftoffset] ? "#080" : (iseditor ? "#44c" : "#f00");
    }
    
    // If a snake part is out of the grid, not solved
    if(snakex[head-i] < leftoffset || snakex[head-i] > leftoffset + size - 1 || snakey[head-i] < topoffset || snakey[head-i] > topoffset + size - 1 || snakez[head-i] > size - 1){
      if(iseditor)share.disabled = 1;
      solved = 0;
    }
  
    // If a snake part is at a place where it shouldn't be (red cell), not solved
    if(hasground && dg[snakey[head-i] - topoffset] && !dg[snakey[head-i] - topoffset][snakex[head-i] - leftoffset]){
      solved = 0;
    }
    
    
    if(haswall && dw[size - 1 - snakez[head-i]] && !dw[size - 1 - snakez[head-i]][snakex[head-i] - leftoffset]){
      solved = 0;
    }
  }
  
  // If a snake part is not at a place where it should be, not solved
  // (test if backgroundColor is "#000" or "rgb(0, 0, 0)" depending on browsers 
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      try{
        if(hasground && top[`g${cellprefix}-${i}-${j}`].style.backgroundColor.match(/0/g).length == 3){
          solved = 0;
        }
      }
      catch(e){}
      try{
        if(haswall  && top[`w${cellprefix}-${i}-${j}`].style.backgroundColor.match(/0/g).length == 3){
          solved = 0;
        }
      }
      catch(e){}
    }
  }
  
  // Solved
  if(solved){
    if(iseditor){
      issolved = 0;
    }
    else{
      issolved = 1;
    }

    puzzles[currentpuzzle][2]=0;
    
    top["puzzle" + currentpuzzle].classList.remove("wrapvisible");
    
    if(!iseditor){
      L[P+"puzzle" + pagename + currentpuzzle] = 1;
    }
    
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        try{
        //if(top[`g${cellprefix}-${i}-${j}`]){
          top[`g${cellprefix}-${i}-${j}`].style.background = dg[i][j] ? "#44c" : "#fd0";
        //}
        }
        catch(e){}
        try{
        //if(top[`w${cellprefix}-${i}-${j}`]){
          top[`w${cellprefix}-${i}-${j}`].style.background = dw[i][j] ? "#44c" : "#fd0";
        //}
        }
        catch(e){}
      }
    }
    
    
    if(!iseditor){
      mkaudio(SNDwin).play();
      totalsolved++;
      L[P+"totalsolved"] = totalsolved;
    }

    // Remove rock cubes that are on the puzzle
    var cubetoremove = 1;
    for(let j in cubes){
      if(
        cubes[j][0] >= puzzles[currentpuzzle][5]
        && cubes[j][0] < puzzles[currentpuzzle][5] + puzzles[currentpuzzle][0]
        && cubes[j][1] >= puzzles[currentpuzzle][6]
        && cubes[j][1] < puzzles[currentpuzzle][6] + puzzles[currentpuzzle][0]
      ){
        delete cubes[j];
        cubetoremove++;
        setTimeout(()=>{
          top["cube" + j].remove();
        }, cubetoremove * 200);
      }
    }       
  }
}

// Check if a new apple can appear after a certain snake length or number of puzzles solved, and make it appear
checkapple = e => {
  for(var i in apples){

    if(!L[P+"appleappeared" + pagename + i] &&((apples[i][3] > 0 && apples[i][3] == snakelength) || (apples[i][4] > 0 && apples[i][4] == totalsolved))){
      
      lock = 1;
      

      // backtrack button
      if(mobile && pagename == "px" && i == 1){
        kw.className = '';
        L[P+"backtrack"] = 1;
      }
      
      // Focus on new apple 
      setTimeout((()=>{
        scene.style.transform="translateX("+(-apples[i][0]*sidesize)+"vh)translateY("+(-apples[i][1]*sidesize)+"vh)translateZ(50vh)rotateX(35deg)";
        L[P+"appleappeared"+pagename+i]=1;
        scene.style.transformOrigin=""+(apples[i][0]*sidesize)+"vh "+(apples[i][1]*sidesize)+"vh"
      })(i), 250);
      
      setTimeout((()=>{
        top["apple"+i].className="emoji apple";
        top["appleshadow"+i].className="emojishadow appleshadow"
      })(i),800);
      
      setTimeout(()=>{
        mkaudio(SNDappear).play()
      },850);
      
      // Focus back on snake
      setTimeout(()=>{
        movesnake();
        lock=0
      }, 2000);

    }
  }
}

testinbounds = () => {
  
  // Test if we're inside a puzzle, and save when we entered, to return there when we press R
  inbounds = 0;
  if(!iseditor){
    currentpuzzle = null;
  }
  
  for(p in puzzles){
    if(snakex[head] >= puzzles[p][5] && snakex[head] < puzzles[p][5] + puzzles[p][0] && snakey[head] >= puzzles[p][6] && snakey[head] < puzzles[p][6] + puzzles[p][0] && snakez[head] >= 0 && snakez[head] < puzzles[p][0]){
      currentpuzzle = +p;
      inbounds = 1;
    }
  }
}


// On key down
onkeydown = function(e) {
  
  // Update u/d/l/r flags
  top['lurd************************l**r************l*d***u**u'[e.which - 37]] = 1;
  
  // Alt = 18
  if(e.which == 18){
    B = 1;
  }
  
  // Shift = 16
  if(e.which == 16){
    s = 1;
  }
  
  // Ctrl = 17
  if(e.which == 17){
    c = 1;
  }
  
  if(!lock){
    
    // 1 = 49 / 97
    if(e.which == 49 || e.which == 97){
      if(rot > -1) rot--;
      move_scene();
    }
    
    // 2 = 50 / 98
    if(e.which == 50 || e.which == 98){
      rot = 0;
      move_scene();
    }
    
    // 3 = 51 / 99
    if(e.which == 51 || e.which == 99){
      if(rot < 1) rot++;
      move_scene();
    }
  }
  
  testinbounds();
  if(inbounds){
    checkgrid();
  }
  else {
    exithead = 0;
  }
  
  // R = 82
  if(e.which == 82 && inbounds){
    if(exithead <= head){
      for(var i = exithead; i <= head; i++){
        snakex.pop();
        snakey.pop();
        snakez.pop();
        snakeangle.pop();
        setTimeout(()=>{
          currentsong.back()
        },(head - i) * 70);
      }
    }
    head = exithead - 1;
    exithead = 0;
    movesnake();
    checkgrid();
    L[P+"moves"]= ++ocd_moves;
    document.title='LOSSST: ' + ocd_moves + 'm, ' + ocd_time + 's';
    return;
  }

  // Allow F5 = 116 / Ctrl = 17 / R = 82, F12 = 123, disable the other keys that can ruin the gameplay (space, backspace, scroll, etc...)
  if(e.which != 116 && e.which != 82 && e.which != 17 && e.which != 123 && e.preventDefault){
    e.preventDefault();
  }
  
  if(!lock){
    
    stuck = 0;
    
    // Left
    if(l){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakex[head] == leftoffset){

        checkmove(leftoffset + size - 1, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(leftoffset + size - 1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI/2);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head] - 1, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head] - 1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI/2);
          head++;
        }
      }
    }
  
    // Right
    else if(r){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakex[head] == leftoffset + size - 1){
        
        checkmove(leftoffset, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(leftoffset);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(-Math.PI/2);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head] + 1, snakey[head], snakez[head]);

        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]+1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(-Math.PI/2);
          head++;
        }
      }
    }
  
    // Forwards (Up)
    else if(u){
        
      // Wrap
      if(!issolved && haswrap && inbounds && snakey[head] == topoffset){
        checkmove(snakex[head], topoffset + size - 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(topoffset + size - 1);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head] - 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head] - 1);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI);
          head++;
        }
      }
    }
  
    // Backwards (Down)
    else if(d){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakey[head] == topoffset + size - 1){
        checkmove(snakex[head], topoffset, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(topoffset);
          snakez.push(snakez[head]);
          snakeangle.push(0);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head] + 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head] + 1);
          snakez.push(snakez[head]);
          snakeangle.push(0);
          head++;
        }
      }
    }
    
    // Upwards (shift)
    else if((son || haswall) && s){
      
      // Can't go upper than snake's height (or snake's height + 1 if standing on a cube) if not in a puzzle
      if(!inbounds){
         var maxheight = snakelength - 1;
         for(var i in cubes){
           if(cubes[i][0] == snakex[head] && cubes[i][1] == snakey[head]){
             maxheight++;
           }
         }
         if(snakez[head] == maxheight) return;
      }
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakez[head] == size - 1){
        checkmove(snakex[head], snakey[head], 0);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(0);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head], snakez[head] + 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(snakez[head] + 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
    }
    
    // Downwards (ctrl)
    else if((son || haswall) && c){
      
      // Wrap
      if(!issolved && haswrap && inbounds && snakez[head] == 0){
        checkmove(snakex[head], snakey[head], size - 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(size - 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
      
      // No wrap, can't go below the ground
      else if(snakez[head] == 0){
        stuck = 1;
      }
      
      // No wrap, can go down
      else {
        checkmove(snakex[head], snakey[head], snakez[head] - 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(snakez[head] - 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
    }
    
    // Get back (backspace or alt)
    else if(B){
      
      // Remove the record of the last move and place the snake there
      // NB: the snake can always get back, even if the head is there, because the head will also move when the tail will get back.
      if(head > snakelength){
        snakeangle.pop();
        snakex.pop();
        snakey.pop();
        snakez.pop();
        head--;
      }
    }
  
    // stuck
    if(stuck){
      
      lock = 1;
      setTimeout(()=>{
        lock = 0;
      },150);
      
      if(snakex[head]> -1 && snakex[head] < w && snakey[head]> -1 && snakey[head] < h && !(pagename == "pI" && !son && snakex[head] > 16)){
        mkaudio(SNDstuck).play();
      }
    }
    
    // If a move key was pressed and snake is not stuck and easteregg/son sinematic is not playing
    if(!stuck && !easteregg && (u || r || d || l || s || c || B)){

      L[P+"moves"] = ++ocd_moves;
      if(!iseditor){
        document.title = 'LOSSST: ' + ocd_moves + 'm, ' + ocd_time + 's';
      }

      checkgrid();
      
      // Update snake & camera position
      movesnake();
      
      if(B){
        if(head > snakelength){
          currentsong.back();
        }
      }
      else if(son || (!s && !c && !son)){
        currentsong.forward();
      }
      
      // Check grid in editor
      
      // Update camera position again if needed
      movesnake(1); // 1 = camera update only
      
      // Check is a new apple can appear
      checkapple();
      
      // Lock the keys for .15s unless there's an apple animation already locking them
      if(!lock){
        lock = 1;
        setTimeout(()=>{
          lock=0;
        }, 150);
      }

      // Editor
      if(pagename == "px" && (son || snakelength >= 14) && snakex[head] == 20 && snakey[head] == 10){
        lock = 1;
        var z = 0;
        
        for(let i = 0; i < snakelength; i++){
          setTimeout(()=>{
            snakex.push(snakex[head]);
            snakey.push(snakey[head]);
            snakez.push(--z);
            snakeangle.push(snakeangle[head]);
            head++;
            movesnake()
          }, i * 150);
        }
        setTimeout(()=>{
          indexx("pz",1)
        }, snakelength * 160);
        L[P+"snakex"] = 20;
        L[P+"snakey"] = 10;
      }
      
      
      // Save reset head if entering in bounds
      testinbounds();
      
      if(inbounds && !exithead){
        /*if(iseditor){
          exithead = snakelength;
        }
        else {*/
          exithead = head;
        //}
      }
    }
  }
}

onkeyup = e => {
  u = r = d = l = s = c = B = 0;
}