#version 300 es
#define M_PI 3.1415926535897932384626433832795
precision highp float;


uniform vec3 cam_pos;
in vec3 normal;
in vec3 world;

out vec4 fragColor;

void main() {
  vec3 light_pos= vec3(10.0, 10.0, 10.0);


  vec3 light_dir = normalize(light_pos - world);
  vec3 view_dir = normalize(cam_pos - world);
  vec3 ref_dir = reflect(-light_dir, normal);

  float diff = dot(normal, light_dir);
  float spec = pow(max(dot(view_dir, ref_dir), 0.0), 10.0);

  fragColor = vec4(vec3(0, 1, 1) * (diff), 0.9);
}