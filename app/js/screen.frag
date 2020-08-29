uniform float time;
uniform vec4 coords;


varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main() {

    float uvx = ( vUv.x - coords.x ) / ( coords.y - coords.x );
    float uvy = ( vUv.y - ( 1.0 - coords.z ) ) / ( coords.z - coords.w );
    float n = snoise2( vec2( time, uvy * 100.0 ) );
    gl_FragColor = vec4( vec3( n ), 1.0 );
}