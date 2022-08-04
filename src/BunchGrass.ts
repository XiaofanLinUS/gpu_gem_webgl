import * as twgl from 'twgl.js'

import vs from './shader/grass.vert';
import fs from './shader/grass.frag';
import Grass from './Grass';

class BunchGrass {
    prefab: Grass
    positions: number[][]
    constructor(gl: WebGL2RenderingContext, num_seg: number, size: number) {
        
        let x_beg = - size / 2 , z_beg = - size / 2;
        let delta = size / num_seg;

        let num_seg_ = num_seg / 3 * 2;
        let num_seg__ = num_seg_ * 2;

        let delta_ = size / num_seg__;
        this.positions = [];
        this.prefab = new Grass(gl);

        for(let i = 0; i <= num_seg; i++) {
            for(let j = 0; j <= num_seg_; j++) {
                let x : number;
                if(i % 2 == 0) {
                    x = x_beg + j * 2 * delta_;
                }else {
                    x = x_beg + j * 2 * delta_ + delta_;
                }
                
                let z = z_beg + i * delta;
                this.positions.push([x, 0, z]);
            }   
        }

        console.log(this.positions);
    }


    draw(gl: WebGL2RenderingContext, uniforms: any) {
        gl.useProgram(this.prefab.prog.program);
        twgl.setUniforms(this.prefab.prog, uniforms);                
        twgl.setBuffersAndAttributes(gl, this.prefab.prog, this.prefab.vao);
        for(let i = 0; i < this.positions.length; i++) {
            twgl.setUniforms(this.prefab.prog, {model: twgl.m4.translate(twgl.m4.scale(twgl.m4.identity(), [1, 1.3, 1]), this.positions[i])});
            twgl.drawBufferInfo(gl, this.prefab.vao, gl.TRIANGLES);
        }
        
        gl.bindVertexArray(null);
    }
}

export default BunchGrass;