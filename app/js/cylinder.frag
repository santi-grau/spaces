uniform float time;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
    float uvx = abs( vUv.x - 0.5 ) / ( 0.5 - 0.345327 );
    float uvy = ( vUv.y - ( 1.0 - 0.998506 ) ) / ( 0.998506 - 0.920523 );
    float n = snoise3( vec3( uvx, uvy, time / 100.0 ) * 100.0 );
    gl_FragColor = vec4( vec3( n ), 1.0 );
}