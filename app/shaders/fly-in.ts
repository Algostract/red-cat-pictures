// Vertex shader
export const flyInVert = `
precision mediump float;
attribute vec2 position, uv;
attribute float pieceIndex;
uniform float time, cols, rows;
varying vec2 vUV;
// simple hash if you still need randomness elsewhere
float hash(float x) {
  return fract(sin(x * 12.9898) * 43758.5453);
}
void main() {
  float c = mod(pieceIndex, cols);
  float r = floor(pieceIndex / cols);

  // compute each tile's center in clip‐space
  vec2 center = vec2(
    -1.0 + (2.0 * (c + 0.5)) / cols,
    -1.0 + (2.0 * (r + 0.5)) / rows
  );


  // radial distance [0..1] from screen center to tile center
  float maxR = length(vec2(1.0, 1.0));
  float radial = length(center) / maxR;
  // delay so center pieces start first, outer ones up to 1.2s later
  // new: start up to 0.8s later
  float delay    = radial * 1.2;
  // same duration mapping
  float duration = mix(1.2, 0.6, radial);
  // linear progress in [0,1]
  float raw      = clamp((time - delay) / duration, 0.0, 1.0);
  // ease-out cubic
  float t        = 1.0 - pow(1.0 - raw, 3.0);


  // direction from off‐canvas toward the center point
  vec2 dirToCenter = normalize(center);
  float offDist    = mix(3.0, 0.0, t);
  float scale      = mix(2.5, 1.0, t);

  vec2 zoomed    = center + (position - center) * scale;
  vec2 displaced = zoomed + dirToCenter * offDist;

  vUV = uv;
  vUV.y = 1.0 - vUV.y;
  gl_Position = vec4(displaced, 0.0, 1.0);
}
`

// Fragment shader
export const flyInFrag = `
precision mediump float;
uniform sampler2D tex;
varying vec2 vUV;
void main() {
  gl_FragColor = texture2D(tex, vUV);
}`
