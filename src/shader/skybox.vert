#version 300 es

in vec3 position;



uniform mat4 perspective;
uniform mat4 camera;

out vec3 tex_coord;

void main(){
    tex_coord = position;
    gl_Position = (perspective * mat4(mat3(camera)) * vec4(position, 1.0)).xyww;
}