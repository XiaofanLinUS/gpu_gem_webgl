import {init_grid_} from './Grid'
import * as twgl from 'twgl.js/dist/4.x/twgl-full'
import water_normal from './res/water_plane/normal.jpeg'

class WaterPlane {
    vaos: twgl.VertexArrayInfo[];
    vbos: twgl.BufferInfo[];
    shader: twgl.ProgramInfo;
    normal_map: WebGLTexture;

    constructor(num_pads: number, num_segs: number, pad_size: number, gl: WebGL2RenderingContext, shader: twgl.ProgramInfo) {
        let grid_infos = init_water_plane(num_pads, num_segs, pad_size);        
        this.vaos = new Array();
        this.vbos = new Array();
        this.shader = shader;
        for(let k in grid_infos.pads) {
          let grid = grid_infos.pads[k];
          const arrays = {
            position: {
              numComponents: 3,
              data: grid.positions
            },
            texcoord: {
              numComponents: 2,
              data: grid.texcoords
            },
            indices: {
              data: grid.tri_indices
            }
          };

          let vbo_ = twgl.createBufferInfoFromArrays(gl, arrays);
          let vao_ = twgl.createVertexArrayInfo(gl, this.shader, vbo_);
          this.vbos.push(vbo_);
          this.vaos.push(vao_);
          this.normal_map = twgl.createTexture(gl, {target: gl.TEXTURE_2D, src: water_normal});

          console.log(water_normal);
        }
        
      }


    draw(gl: WebGL2RenderingContext, uniforms: any) {
      gl.useProgram(this.shader.program);
      twgl.setUniforms(this.shader, {normal_map: this.normal_map});
      twgl.setUniforms(this.shader, uniforms);
      for(let idx = 0; idx < this.vaos.length; idx++) {
        twgl.setBuffersAndAttributes(gl, this.shader, this.vaos[idx]);
        twgl.drawBufferInfo(gl, this.vaos[idx], gl.TRIANGLES);
      }
      gl.bindVertexArray(null);
      
    }
}

let init_water_plane = (num_pads: number, num_segs: number, pad_size: number) => {
    let pads = [];    
    let begX = - num_pads / 2 * pad_size;

    for (let i = 0; i <= num_pads - 1; i++) {
        for (let j = 0; j <= num_pads - 1; j++) {
            let x = begX + j * pad_size;
            let z = begX + i * pad_size;


            pads.push(init_grid_(num_segs, x, z, pad_size, pad_size));
        }
    }
    return { pads };
}

export default WaterPlane;