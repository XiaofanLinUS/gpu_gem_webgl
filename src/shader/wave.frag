#version 300 es
#define M_PI 3.1415926535897932384626433832795
precision highp float;


uniform sampler2D normal_map;
uniform samplerCube cubemap;
uniform vec3 cam_pos;

in vec2 tex_coord;
in vec3 tangent;
in vec3 binormal;
in vec3 normal;
in vec3 world;

out vec4 fragColor;

vec3 get_reflect_color(vec3 ref_dir) {
  return texture(cubemap, normalize(ref_dir)).xyz;
}


void main() {
  mat3 BTN = mat3(binormal, tangent, normal);
  vec3 sample_normal = texture(normal_map, tex_coord).xyz * 2.0 - 1.0;
  sample_normal = normalize(BTN * sample_normal);

  vec3 t_normal = normalize((3.0 * normal + 1.0 * sample_normal) / 4.0);
  vec3 light_pos= vec3(10.0, 10.0, 10.0);
  vec3 light_dir = normalize(light_pos - vec3(0.0));
  vec3 view_dir = normalize(cam_pos - world);
  vec3 light_ref_dir = reflect(-light_dir, t_normal);
  vec3 eye_ref_dir = reflect(-view_dir, t_normal);

  float diff = 0.5 * dot(t_normal, light_dir);
  float spec = 0.5 * pow(max(dot(view_dir, light_ref_dir), 0.0), 10.0);

  float light = diff + spec;
  vec3 reflect_color = get_reflect_color(eye_ref_dir);

  fragColor = vec4((0.7 * vec3(0, 0.6, 0.8) + 0.2 * reflect_color) * light, 0.9);

  
}