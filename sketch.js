let canvasSize;
let UNIT;
const GRID_COLS = 36;
const GRID_ROWS = 36;

const BG     = "#ffffffff";
const YELLOW = "#f4d31f";
const RED    = "#d1372a";
const BLUE   = "#2956a4";
const GREY   = "#d5cfc5";

// oil and  crayon
let oilPaintGraphics;
let crayonGraphics;

function setupTextures() {
  createOilPaintTexture();
  createCrayonTexture();
}

function createOilPaintTexture() {
  // oil blue and red rect
  oilPaintGraphics = createGraphics(100, 100);
  oilPaintGraphics.noStroke();
  
  // oil color
  for (let i = 0; i < 120; i++) { 
    const x = random(100);
    const y = random(100);
    const size = random(2, 6); 
    const alpha = random(15, 35); 
    
    oilPaintGraphics.fill(255, 255, 255, alpha);
    oilPaintGraphics.ellipse(x, y, size, size * 0.7);
  }
}

function createCrayonTexture() {
  // yellow rect
  crayonGraphics = createGraphics(150, 150);
  crayonGraphics.noStroke();
  
  // crayon
  for (let i = 0; i < 600; i++) {
    const x = random(150);
    const y = random(150);
    const size = random(2, 5);
    const alpha = random(15, 35);
    const brightness = random(220, 255);
    
    crayonGraphics.fill(brightness, brightness, 180, alpha);
    crayonGraphics.rect(x, y, size, size);
  }
}

// lines and blocks

// YELLOW_VERTICAL_LINES [x, y, w, h]
const YELLOW_VERTICAL_LINES = [
  [1,0,1,14], [3,0,1,36], [6,0,1,36], [10,0,1,36],
  [12,16,3,5], [17,13,3,8], [21,0,1,36], [23,0,1,13], [23,16,1,20], 
  [28,0,1,36], [32,0,1,36], [34,0,1,36]
];

// YELLOW_HORIZONTAL_LINES [x, y, w, h]
const YELLOW_HORIZONTAL_LINES = [
  [0,1,36,1], [0,6,36,1], [0,13,36,1],
  [0,16,36,1], [0,20,36,1], [0,22,36,1],
  [3,25,20,1], [0,27,3,1], [0,30,36,1], [0,32,3,1], [0,34,36,1]
];

// segement [ dx, dy, color ]
const SEGMENTS = [
  // Top_horizontal
  [0, 1, [
    [2,0,RED],[4,0,BLUE],[6,0,RED],[9,0,BLUE],
    [12,0,RED],[15,0,BLUE],[18,0,RED]
  ]],
  // Middle_horizontal
  [0, 13, [
    [1,0,RED],[3,0,BLUE],[5,0,RED],[9,0,BLUE],
    [12,0,YELLOW],[15,0,RED],[18,0,BLUE]
  ]],
  // Bottom_horizontal
  [0, 20, [
    [1,0,BLUE],[3,0,RED],[5,0,BLUE],[7,0,RED],
    [9,0,BLUE],[11,0,RED],[13,0,BLUE]
  ]],
  // Left vertical line
  [1, 0, [
    [0,2,RED],[0,4,BLUE],[0,6,RED],[0,20,BLUE],[0,16,RED], [0,27,BLUE], [0,32,RED]
  ]],
  // Middle vertical line
  [23, 0, [
    [0,2,RED],[0,4,BLUE],[0,6,RED],[0,9,BLUE],
    [0,13,YELLOW],[0,16,RED]
  ]],
  // right vertical line
  [32, 0, [
    [0,3,BLUE],[0,5,RED],[0,8,BLUE],[0,11,RED],[0,15,BLUE]
  ]],
  // Middle
  [0, 22, [
    [3,0,BLUE],[5,0,RED],[8,0,BLUE],[11,0,RED],[15,0,BLUE], 
    [17,0,BLUE],[19,0,RED],[21,0,BLUE],[24,0,RED],[26,0,BLUE], 
    [28,0,RED],[30,0,BLUE],[32,0,RED],[34,0,BLUE]
  ]],
  // Short middle line
  [0, 25, [
    [3,0,BLUE],[5,0,RED],[8,0,BLUE],[11,0,RED],[15,0,BLUE], 
    [17,0,BLUE],[19,0,RED],[21,0,BLUE],[23,0,RED]
  ]],
  // The bottom line above
  [0, 30, [
    [3,0,BLUE],[5,0,RED],[8,0,BLUE],[11,0,RED],[15,0,BLUE], 
    [17,0,BLUE],[19,0,RED],[21,0,BLUE],[24,0,RED],[26,0,BLUE], 
    [28,0,RED],[30,0,BLUE],[32,0,RED],[34,0,BLUE]
  ]],
  // Bottom
  [0, 34, [
    [3,0,BLUE],[5,0,RED],[8,0,BLUE],[11,0,RED],[15,0,BLUE], 
    [17,0,BLUE],[19,0,RED],[21,0,BLUE],[24,0,RED],[26,0,BLUE], 
    [28,0,RED],[30,0,BLUE],[32,0,RED],[34,0,BLUE]
  ]]
];

// big red and blue blocks [x, y, w, h]
const RED_BLOCKS = [
  [7,2,2,4],
  [11,2,3,4],
  [7,17,3,2],
  [30,28,3,3],
  [17,34,3,2],
  [25,17,3,5]
];

const BLUE_BLOCKS = [
  [4,8,3,3],
  [4,26,3,3],
  [12,17,3,3],
  [24,7,3,6]
];

// red block with white block and yellow segments inside it
const NESTED_A = {
  base: [26,4],
  outer: [0,0,4,6,RED],
  inner: [1,1,2,2,BG],
  yellowOffsets: [ [-1,-1],[2,-1],[-1,1],[2,1],[0,0] ],
  yellowBaseOffset: [1,3]
 
};

const NESTED_B = {
  base: [18,16],
  outer: [0,0,4,7,RED],
  inner: [1,1,2,3,BG],
  yellowOffsets: [ [-1,0],[2,0],[-1,2],[2,2],[0,1] ],
  yellowBaseOffset: [1,4]

};

// grey dots [x, y]
const GREY_DOTS = [
  [3,2],[10,2],[10,6],[24,6],[17,13],[15,13],[6,17]
];

// class
class Mondrian {
  constructor() {
    this.rects = [];
    this.build();
  }

  addRect(gx, gy, gw, gh, color) {
    this.rects.push({ gx, gy, gw, gh, color });
  }

  addBatch(list, color) {
    list.forEach(([x,y,w,h]) => this.addRect(x, y, w, h, color));
  }

  addOffsetPoints(baseX, baseY, points) {
    points.forEach(([dx,dy,color]) => {
      this.addRect(baseX + dx, baseY + dy, 1, 1, color);
    });
  }

  build() {
    this.buildYellow();
    this.buildSegments();
    this.buildBlocks();
    this.buildNested();
    this.buildGreys();
  }

  draw() {
    // Draw rect
    for (const r of this.rects) {
      fill(r.color);
      rect(r.gx * UNIT, r.gy * UNIT, r.gw * UNIT, r.gh * UNIT);
    }
    
    // color
    for (const r of this.rects) {
      if (r.color === RED || r.color === BLUE) {
        this.drawOilPaintEffect(r);
      } else if (r.color === YELLOW) {
        this.drawCrayonEffect(r);
      }
    }
  }

  // oil red and blue rect
  drawOilPaintEffect(rect) {
    const x = rect.gx * UNIT;
    const y = rect.gy * UNIT;
    const w = rect.gw * UNIT;
    const h = rect.gh * UNIT;
    
    push();
    
    // Soft_light
    blendMode(SOFT_LIGHT);
    
    // const 
    const scaleX = w / oilPaintGraphics.width;
    const scaleY = h / oilPaintGraphics.height;
    
    // Single-layer texture
    push();
    translate(x, y);
    scale(scaleX, scaleY);
    image(oilPaintGraphics, 0, 0);
    pop();
    
    pop();
    
    
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = color(red(rect.color), green(rect.color), blue(rect.color), 60);
    
   
    this.drawOilBrushStrokes(x, y, w, h, rect.color);
    
    drawingContext.shadowBlur = 0;
  }

  // Draw oil color
  drawOilBrushStrokes(x, y, w, h, color) {
    const strokeCount = max(2, (w * h) / 200); 
    
    for (let i = 0; i < strokeCount; i++) {
      const strokeX = x + random(w);
      const strokeY = y + random(h);
      const strokeW = random(3, 8); 
      const strokeH = random(2, 4);
      const angle = random(PI);
      const alpha = random(20, 40); 
      
      push();
      translate(strokeX, strokeY);
      rotate(angle);
      
      const r = red(color);
      const g = green(color);
      const b = blue(color);
      const variation = random(-10, 10); 
      
      fill(
        constrain(r + variation, 0, 255),
        constrain(g + variation, 0, 255),
        constrain(b + variation, 0, 255),
        alpha
      );
      
      noStroke();
      ellipse(0, 0, strokeW, strokeH);
      pop();
    }
  }

  // Yellow rect 
  drawCrayonEffect(rect) {
    const x = rect.gx * UNIT;
    const y = rect.gy * UNIT;
    const w = rect.gw * UNIT;
    const h = rect.gh * UNIT;
    
    push();
    
    // HARD_LIGHT
    blendMode(HARD_LIGHT);
    
    // Single-layer texture
    const scaleX = w / crayonGraphics.width;
    const scaleY = h / crayonGraphics.height;
    
    // Single-layer texture
    push();
    translate(x, y);
    scale(scaleX, scaleY);
    image(crayonGraphics, 0, 0);
    pop();
    
    pop();
    
    // DrawCrayonStreaks
    this.drawCrayonStreaks(x, y, w, h);
  }

  // DrawCrayonStreaks
  drawCrayonStreaks(x, y, w, h) {
    
    if (w < 8 || h < 8) return;
    
    const streakCount = max(3, w / 8);
    
    push();
    noStroke();
    blendMode(HARD_LIGHT);
    
    for (let i = 0; i < streakCount; i++) {
      const streakX = x + random(w);
      const streakWidth = random(3, 6);
      const alpha = random(15, 30);
      
      fill(255, 245, 160, alpha);
      rect(streakX, y, streakWidth, h);
    }
    
    pop();
  }

  // yellow lines
  buildYellow() {
    this.addBatch(YELLOW_VERTICAL_LINES,   YELLOW);
    this.addBatch(YELLOW_HORIZONTAL_LINES, YELLOW);
  }

  // red blue segment
  buildSegments() {
    SEGMENTS.forEach(([baseX, baseY, points]) => {
      this.addOffsetPoints(baseX, baseY, points);
    });
  }

  // big red blue blocks
  buildBlocks() {
    this.addBatch(RED_BLOCKS,  RED);
    this.addBatch(BLUE_BLOCKS, BLUE);
  }

  // red block with white block and yellow segments inside it
  buildNestedBlock(config) {
    const [bx, by] = config.base;
    const [ox, oy, ow, oh, outerColor] = config.outer;
    const [ix, iy, iw, ih, innerColor] = config.inner;
    const [ybx, yby] = config.yellowBaseOffset;

    this.addRect(bx + ox, by + oy, ow, oh, outerColor);
    
    this.addRect(bx + ix, by + iy, iw, ih, innerColor);
    
    config.yellowOffsets.forEach(([dx,dy]) => {
      this.addRect(bx + ybx + dx, by + yby + dy, 1, 1, YELLOW);
    });
  }

  buildNested() {
    this.buildNestedBlock(NESTED_A);
    this.buildNestedBlock(NESTED_B);
  }

  // grey dots
  buildGreys() {
    GREY_DOTS.forEach(([x,y]) => this.addRect(x, y, 1, 1, GREY));
  }
}


class GlitchController {
  // Trigger time
  constructor() {
    this.lastGlitchTime = 0;
  }


  apply(rotationAngle) {
    let now = millis();
    let intensity = (sin(rotationAngle * 4.0) + 1) / 2;
    let interval = lerp(450, 60, intensity);

    if (now - this.lastGlitchTime > interval) {
      this.lastGlitchTime = now;
      this.doGlitch(intensity);
    }
  }

  // Lateral misalignment
  doGlitch(intensity) {
    let sliceCount = int(lerp(4, 24, intensity));

    for (let i = 0; i < sliceCount; i++) {
      let y = random(height);
      let h = random(8, 60);
      let offset = random(
        -lerp(40, 150, intensity),
         lerp(40, 150, intensity)
      );

      copy(0, y, width, h, offset, y, width, h);
    }
  }
}

// Rotation
class RotationController {
  constructor() {
    this.angle = 0;
    this.speed = 0.02;
  }

  update() {
    this.angle += this.speed;
  }
}

//main
let mondrian;
let glitch;
let rotation;

function setup() {
  createCanvas(800, 800);
  resizeCanvasCalc();
  rectMode(CORNER);
  noStroke();
  
  // CreatTextures
  setupTextures();
  
  mondrian = new Mondrian();

  // create glitch instance
  glitch = new GlitchController();

  rotation = new RotationController();
}

function draw() {
  rotation.update();

  background(BG);
  push();
  translate(width / 2, height / 2);
  rotate(rotation.angle);
  translate(-width / 2, -height / 2);
  mondrian.draw();
  pop()

  glitch.apply(rotation.angle);
}

// Adapt to the window size
function windowResized() {
  resizeCanvasCalc();
  redraw();
}

function resizeCanvasCalc() {
  canvasSize = min(windowWidth, windowHeight);
  UNIT = canvasSize / GRID_COLS;
  resizeCanvas(canvasSize, canvasSize);
}