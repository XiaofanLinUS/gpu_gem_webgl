import * as twgl from 'twgl.js/dist/4.x/twgl-full.js'
import WebGLDebugUtils from './util/webgl-debug';
import GL_UI from './util/webgl-lessons-ui'
import vs from './shader/wave.vert'
import fs from './shader/wave.frag'
import WaterPlane from './WaterPlane';
import Skybox from './Skybox';


//------------------------------------------------------------------------------------------------------------------------
let cam_dist = 2;
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
GL_UI.setupSlider("#cam_dist", {value: cam_dist, slide: update_cam_dist, max: 300, min: 1, step: 0.1, precision: 2 });

let throwOnGLError = (err: number, funcName: string, _: any) => {
  throw WebGLDebugUtils.glEnumToString(err)
  + " was caused by call to "
  + funcName;
};
let gl: WebGL2RenderingContext;
let canvas: HTMLCanvasElement;
let init = () => {
  canvas = <HTMLCanvasElement>document.getElementById('view');
  gl = canvas.getContext('webgl2');
  gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);  
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  
}

init();


//------------------------------------------------------------------------------------------------------------------------

const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
const sea = new WaterPlane(20, 10, 1, gl, programInfo);
const sky = new Skybox(gl);



function render(time: number) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  let cam_pos = [cam_dist * Math.sin(cam_rotation_h) * Math.cos(cam_rotation_v), cam_dist * Math.sin(cam_rotation_v), cam_dist * Math.cos(cam_rotation_h) * Math.cos(cam_rotation_v)];
  let perspective = twgl.m4.perspective(45 / 180 * Math.PI, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
  let camera = twgl.m4.inverse(twgl.m4.lookAt(cam_pos, twgl.v3.create(0, 0, 0), twgl.v3.create(0, 1, 0)));

  let angles = [60, 80, 90, 75, 85, 100];
  let D = [];
  
  let S = [0.5, 0.25, 0.75, 0.2, 0.5, 0.4];
  let Q_ = [0.9, 0.7, 0.5, 0.6, 0.2, 0.5];
  let L = [3, 6, 2.5, 2, 4, 3];
  let A = [0.06, 0.05, 0.04, 0.04, 0.06, 0.05];
  let w = L.map((v)=>Math.sqrt(2 * Math.PI * 9.18 / v));
  let Q = Q_.map((v,i)=>v/w[i]/A[i]/6);
  let phi = w.map((v, i)=> v * S[i]);

  for (let idx in angles) {
      let ang = angles[idx];
      D.push(Math.cos(ang/180*Math.PI), Math.sin(ang/180*Math.PI));
  }

  
  let uniforms = {
    cubemap: sky.cubemap,
    t: time * 0.001,
    perspective: perspective,
    camera: camera,
    cam_pos,
    D: D,
    Q: Q,
    w: w,
    A: A,
    phi: phi
  };

  sky.draw(gl, {
    perspective,
    camera
  });  

  sea.draw(gl, uniforms);

  
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

