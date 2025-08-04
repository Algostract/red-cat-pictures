// Vertex shader
export const burnVert = `
precision mediump float;
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  uv.y = 1.0 - uv.y;
  gl_Position = vec4(position, 0, 1);
}
`

// Fragment shader
export const burnFrag = `
precision mediump float;
uniform sampler2D src, mask;
varying vec2 uv;
void main() {
  vec4 s = texture2D(src, uv);
  vec4 m = texture2D(mask, uv);
  float a = (m.r + m.g + m.b) / 3.0;
  gl_FragColor = vec4(mix(m.rgb, s.rgb, a), a);
}
`
