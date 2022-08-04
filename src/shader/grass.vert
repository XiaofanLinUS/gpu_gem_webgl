#version 300 es
precision highp float;


uniform mat4 perspective;
uniform mat4 camera;
uniform mat4 model;

in vec3 position;
in vec2 texcoord;

void main(){
    gl_Position = perspective * camera * model * vec4(position, 1.0);
}