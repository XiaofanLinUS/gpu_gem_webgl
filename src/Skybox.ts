import * as twgl from 'twgl.js/dist/4.x/twgl-full'

import vs from './shader/skybox.vert'
import fs from './shader/skybox.frag'

import right from './res/skybox/right.jpg'
import left from './res/skybox/left.jpg'
import top from './res/skybox/top.jpg'
import bottom from './res/skybox/bottom.jpg'
import front from './res/skybox/front.jpg'
import back from './res/skybox/back.jpg'


class Skybox {
    shader: twgl.ProgramInfo;
    vao: twgl.VertexArrayInfo;
    vbo: twgl.BufferInfo;
    cubemap: WebGLTexture;

    constructor(gl: WebGL2RenderingContext) {
        this.shader = twgl.createProgramInfo(gl, [vs, fs]);
        this.vbo = twgl.primitives.createCubeBufferInfo(gl);
        this.vao = twgl.createVertexArrayInfo(gl, this.shader, this.vbo);
        this.cubemap = twgl.createTexture(gl, {
            target: gl.TEXTURE_CUBE_MAP,
            src: [
                right, left, top, bottom, front, back
            ]
        });        
    }


    draw(gl: WebGL2RenderingContext, uniforms: any) {
        gl.depthFunc(gl.LEQUAL);
        gl.useProgram(this.shader.program);
        twgl.setUniforms(this.shader, {skybox: this.cubemap});
        twgl.setUniforms(this.shader, uniforms);
        twgl.setBuffersAndAttributes(gl, this.shader, this.vao);
        twgl.drawBufferInfo(gl, this.vao, gl.TRIANGLES);
        gl.bindVertexArray(null);
        gl.depthFunc(gl.LESS);
    }

}

export default Skybox;