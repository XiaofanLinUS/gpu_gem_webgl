import * as twgl from 'twgl.js'
import WebGLDebugUtils from './util/webgl-debug';
import GL_UI from './util/webgl-lessons-ui'
import init_grid from './Grid'

/*
const cam_rotation_input_h = <HTMLInputElement> document.querySelector('#cam_rotation_h');
const cam_rotation_input_v = <HTMLInputElement> document.querySelector('#cam_rotation_v');
const cam_dist_input = <HTMLInputElement> document.querySelector('#cam_dist');

cam_dist_input.max = (100).toString();
cam_dist_input.min = (10).toString();
cam_dist_input.step = '0.5';
cam_dist_input.addEventListener('change', handle_cam_dist);
cam_dist_input.addEventListener('input', handle_cam_dist);

cam_rotation_input_h.setAttribute('max', (2 * Math.PI).toString())
cam_rotation_input_h.setAttribute('min', (0).toString());
cam_rotation_input_h.step = '0.01';
cam_rotation_input_h.addEventListener('input', handle_cam_rotation_h);
cam_rotation_input_h.addEventListener('change', handle_cam_rotation_h);

cam_rotation_input_v.setAttribute('max', (Math.PI / 2).toString())
cam_rotation_input_v.setAttribute('min', (0).toString());
cam_rotation_input_v.step = '0.01';
cam_rotation_input_v.addEventListener('input', handle_cam_rotation_v);
cam_rotation_input_v.addEventListener('change', handle_cam_rotation_v);
*/
let cam_dist = 50;
let cam_rotation_h = 0;
let cam_rotation_v = 0;

let update_cam_dist = (_:Event, ui: any) => {
  cam_dist = ui.value;
}
let update_cam_rotation_h = (_:Event, ui:any) => {
  cam_rotation_h = ui.value;
}

let update_cam_rotation_v = (_:Event, ui:any) =>{
  cam_rotation_v = ui.value;
}
GL_UI.setupSlider("#cam_rotation_h", {value: cam_rotation_h, slide: update_cam_rotation_h, max: 2 * Math.PI, min: 0, step: 0.001, precision: 3 });
GL_UI.setupSlider("#cam_rotation_v", {value: cam_rotation_v, slide: update_cam_rotation_v, max: Math.PI / 2, min: 0, step: 0.001, precision: 3 });
GL_UI.setupSlider("#cam_dist", {value: cam_dist, slide: update_cam_dist, max: 100, min: 10, step: 0.1, precision: 2 });



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
  float height = A * sin(dot(D, world.xz) * w + t * S);
  float newX = world.x + 0.2 * A * D.x * cos(w * dot(D, world.xz) + t*S) / (w * A);
  float newZ = world.z + 0.2 * A * D.y * cos(w * dot(D, world.xz) + t*S) / (w * A);
  world.x = newX;
  world.z = newZ;
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
  let camera = twgl.m4.inverse(twgl.m4.lookAt([cam_dist * Math.sin(cam_rotation_h) * Math.cos(cam_rotation_v), cam_dist * Math.sin(cam_rotation_v), cam_dist * Math.cos(cam_rotation_h) * Math.cos(cam_rotation_v)], twgl.v3.create(0, 0, 0), twgl.v3.create(0, 1, 0)));
  let scale = twgl.m4.scale(twgl.m4.identity(), [10, 10, 10]);

  
  const uniforms = {
    t: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height],
    perspective: perspective,
    camera: camera,
    scale: scale,
    D: [1, 1],
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

