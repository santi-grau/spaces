uniform sampler2D lightTex;
uniform float time;
// varying vec3 vPos;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
    vec4 l = texture2D( lightTex, vUv );
    float n = snoise2( vec2( time, 1.0 ) );
    float n2 = snoise2( vec2( time, 200.0 ) );
    float n3 = snoise3( vec3( vUv.x, vUv.y, time / 1000.0 ) * 1000.0 );
    vec3 cout = vec3( l.r * n * ( 0.3 + n3 * 0.7 ) + l.g + l.b ) * 2.0;
    gl_FragColor = vec4( cout, 1.0 );
}