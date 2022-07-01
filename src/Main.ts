import * as twgl from 'twgl.js'
import WebGLDebugUtils from './util/webgl-debug';
import init_grid from './Grid'



let grid_info = init_grid(50);

let throwOnGLError = (err: number, funcName: string, _: any) => {
  throw WebGLDebugUtils.glEnumToString(err)
  + " was caused by call to "
  + funcName;
};
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('view');
let gl = canvas.getContext('webgl2');
gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);

let vs = `
#version 300 es

in vec4 position;

uniform mat4 perspective;
uniform mat4 camera;
uniform mat4 scale;
uniform float A;
uniform vec2 D;

uniform float w;
uniform float S;
uniform float t;

void main() {
  vec4 world =  scale * position;
  float height = 2.0 * A * pow((sin(dot(D, world.xz) * w + t * S)+1.0)/2.0, 100.0);
  world.y = height;
  gl_Position = perspective * camera * world;
}`;
let fs = `
#version 300 es
precision mediump float;

out vec4 fragColor;

void main() {
  fragColor = vec4(0, 1, 1, 1);
}`;

const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

gl.enable(gl.DEPTH_TEST);

let positions = grid_info.positions;
let indices = grid_info.inidices;

const arrays = {
  position: {
    numComponents: 3,
    data: positions,
    /* [
      -1, -1, 1, // bottom left
      1, -1, 1, // bottom right

      -1, 1, 1, // top left
      -1, 1, 1, // top left
      //
      1, -1, 1, // bottom right
      1, 1, 1, // top right 
      -1, -1, -1, // bottom left
      1, -1, -1, // bottom right
      -1, 1, -1, // top left
      -1, 1, -1, // top left
      1, -1, -1, // bottom right
      1, 1, -1,  // top right

      -1, -1, -1,
      -1, -1, 1,
      -1, 1, -1,
      -1, 1, -1,
      -1, -1, 1,
      -1, 1, 1,

      1, -1, 1,
      1, -1, -1,
      1, 1, -1,
      1, 1, -1,
      1, 1, 1,
      1, -1, 1

    ] */
  },
  indices: {
    numComponents: 2,
    data: indices
  }
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
//const bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
//console.log(bufferInfo);

function render(time: number) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

  let perspective = twgl.m4.perspective(45 / 180 * Math.PI, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
  let camera = twgl.m4.inverse(twgl.m4.lookAt([0, 40, 40], twgl.v3.create(0, 0, 0), twgl.v3.create(0, 1, 0)));
  let scale = twgl.m4.scale(twgl.m4.identity(), [10, 10, 10]);

  
  const uniforms = {
    t: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height],
    perspective: perspective,
    camera: camera,
    scale: scale,
    D: [1, 0],
    A: 2,
    w: 2 / 2,
    S: 3
  };

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.LINES);


  requestAnimationFrame(render);
}
requestAnimationFrame(render);

