import * as twgl from 'twgl.js/dist/4.x/twgl-full.js'
import WebGLDebugUtils from './util/webgl-debug';
import GL_UI from './util/webgl-lessons-ui'
import Skybox from './Skybox';
import Terrain from './Terrain'
import BunchGrass from './BunchGrass'

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


const sky = new Skybox(gl);
const terrain = new Terrain(gl);
const grass = new BunchGrass(gl, 10, 10);

function render(_: number) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let cam_pos = [cam_dist * Math.sin(cam_rotation_h) * Math.cos(cam_rotation_v), cam_dist * Math.sin(cam_rotation_v), cam_dist * Math.cos(cam_rotation_h) * Math.cos(cam_rotation_v)];
  let perspective = twgl.m4.perspective(45 / 180 * Math.PI, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
  let camera = twgl.m4.inverse(twgl.m4.lookAt(cam_pos, twgl.v3.create(0, 0, 0), twgl.v3.create(0, 1, 0)));
 
  sky.draw(gl, {
    perspective,
    camera
  });
   

  terrain.draw(gl, {
    perspective,
    camera
  });

  
  grass.draw(gl, {
    perspective,
    camera
  });
  
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

