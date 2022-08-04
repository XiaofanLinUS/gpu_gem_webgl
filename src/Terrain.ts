import * as twgl from 'twgl.js'
import { init_grid  } from './Grid';

import vs from './shader/terrain.vert';
import fs from './shader/terrain.frag';

class Terrain {
    vao: twgl.VertexArrayInfo;
    vbo: twgl.BufferInfo;
    prog: twgl.ProgramInfo;
    constructor(gl: WebGL2RenderingContext) {
        let grid_info = init_grid(10);

        const vertex_arrays : twgl.Arrays  = {
            position: {
                numComponents: 3,
                data: grid_info.positions
            },
            texcoord: {
                numComponents: 2,
                data: grid_info.texcoords
            },
            indices: {
                data: grid_info.indices
            }
        }

        this.vbo = twgl.createBufferInfoFromArrays(gl, vertex_arrays);
        this.prog = twgl.createProgramInfo(gl, [vs, fs]);
        this.vao = twgl.createVertexArrayInfo(gl, this.prog, this.vbo);
    }


    draw(gl: WebGL2RenderingContext, uniforms: any) {
        gl.useProgram(this.prog.program);
        twgl.setUniforms(this.prog, {model: twgl.m4.scale(twgl.m4.identity(), [5, 1, 5])});
        twgl.setUniforms(this.prog, uniforms);
        twgl.setBuffersAndAttributes(gl, this.prog, this.vao);
        twgl.drawBufferInfo(gl, this.vao, gl.LINES);
        gl.bindVertexArray(null);
    }
}

export default Terrain;