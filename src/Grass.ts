import * as twgl from 'twgl.js'
import { init_polygon } from './Polygon';

import vs from './shader/grass.vert';
import fs from './shader/grass.frag';

class Grass {
    vao: twgl.VertexArrayInfo;
    vbo: twgl.BufferInfo;
    prog: twgl.ProgramInfo;
    constructor(gl: WebGL2RenderingContext) {
        let polygon = init_polygon();

        console.log(polygon.indices);
        const vertex_arrays : twgl.Arrays  = {
            position: {
                numComponents: 3,
                data: polygon.positions
            },            
            indices: {
                data: polygon.indices                
            }
        }

        this.vbo = twgl.createBufferInfoFromArrays(gl, vertex_arrays);
        this.prog = twgl.createProgramInfo(gl, [vs, fs]);
        this.vao = twgl.createVertexArrayInfo(gl, this.prog, this.vbo);
    }


    draw(gl: WebGL2RenderingContext, uniforms: any) {
        gl.useProgram(this.prog.program);
        //twgl.setUniforms(this.prog, {model: twgl.m4.scale(twgl.m4.identity(), [5, 1, 5])});
        twgl.setUniforms(this.prog, uniforms);
        twgl.setBuffersAndAttributes(gl, this.prog, this.vao);
        twgl.drawBufferInfo(gl, this.vao, gl.TRIANGLES);
        gl.bindVertexArray(null);
    }
}

export default Grass;