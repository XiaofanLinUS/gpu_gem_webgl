#version 300 es
#define M_PI 3.1415926535897932384626433832795
precision highp float;


uniform samplerCube cubemap;
uniform vec3 cam_pos;
in vec3 normal;
in vec3 world;

out vec4 fragColor;

vec3 get_reflect_color(vec3 ref_dir) {
  return texture(cubemap, ref_dir).xyz;
}


void main() {
  vec3 light_pos= vec3(10.0, 10.0, 10.0);


  vec3 light_dir = normalize(light_pos - world);
  vec3 view_dir = normalize(cam_pos - world);
  vec3 ref_dir = reflect(-light_dir, normal);

  float diff = 0.5 * dot(normal, light_dir);
  float spec = 0.5 * pow(max(dot(view_dir, ref_dir), 0.0), 10.0);

  float light = diff + spec;
  vec3 reflect_color = get_reflect_color(ref_dir);

  fragColor = vec4( (0.0 * vec3(0, 0.6, 0.8) + 1.0 * reflect_color), 1.0);
}