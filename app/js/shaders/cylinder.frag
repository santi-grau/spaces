uniform float time;
uniform vec2 res;

uniform sampler2D tex;

varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
    float uvx = abs( vUv.x - 0.5 ) / ( 0.5 - 0.345327 );
    float uvy = ( vUv.y - ( 1.0 - 0.998506 ) ) / ( 0.998506 - 0.920523 );
    float n = snoise3( vec3( floor( uvx * res.x ), floor( uvy * res.y ), time ) * 100.0 );
    
    float lx = smoothstep( 0.9, 0.901, mod( uvx, 1.0 / res.x ) * res.x );
    float ly = smoothstep( 0.9, 0.901, mod( uvy, 1.0 / res.y ) * res.y );

    vec3 ca = texture2D( tex, vec2( uvx, uvy ) ).rrr * ( 0.7 + 0.2 * n );
    ca -= lx + ly - 0.03;

    gl_FragColor = vec4( ca, 1.0 );
}