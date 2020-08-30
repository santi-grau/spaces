uniform sampler2D lightTex;
uniform float time;
uniform vec4 coords;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
    vec4 l = texture2D( lightTex, vUv );
    float n = ( snoise2( vec2( time * 0.01, 1.0 ) ) + 1.0 ) * 0.5;
    
    float uvx = 1.0 - ( vUv.x - coords.x ) / ( coords.y - coords.x );
    float uvy = 1.0 - ( vUv.y - ( 1.0 - coords.z ) ) / ( coords.z - coords.w );

    // main screen
    float l1 = l.r * ( 0.9 + 0.1 * n );

    // left screen
    float l2 = 0.0;
    float n2 = ( snoise2( vec2( 10.0, time * 0.01 ) ) + 1.0 ) * 0.5;
    if( n2 > 0.8 ) l2 = l.g * 1.0;

    // right screen
    float n3 = ( snoise2( vec2( 100.0, time * 0.01) ) + 1.0 ) * 0.5;
    float l3 = l.b * ( 0.2 + 0.8 * n3 );

    // blend
    float cout = l1 + l2 + l3;
    cout *= 0.4;
    cout += 0.3 * smoothstep( 0.96, 0.9601, mod( uvx + time * 0.00035, 0.1 ) * 10.0 );

    gl_FragColor = vec4( vec3( cout ), 1.0 );
}