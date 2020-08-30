uniform float time;
uniform vec4 coords;
uniform vec2 letterPosition;
uniform sampler2D letterTex;

varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {

    float uvx = 1.0 - ( vUv.x - coords.x ) / ( coords.y - coords.x );
    float uvy = 1.0 - ( vUv.y - ( 1.0 - coords.z ) ) / ( coords.z - coords.w );
    
    float n2 = ( snoise2( vec2( 10.0, time * 0.01 ) ) + 1.0 ) * 0.5;

    vec2 offset = vec2( 0.1320800781, 0.2333984375 );

    float n = ( snoise3( vec3( uvx * offset.x * 1000.0, uvy * offset.y * 1000.0, time ) ) + 1.0 ) * 0.5;

    float c = texture2D( letterTex, vec2( uvx * offset.x + offset.x * letterPosition.x , uvy * offset.y + offset.y * letterPosition.y ) ).r;
    
    if( n2 > 0.8 ) c = 1.0 - c;
    c += n * 0.2;
    c *= 0.85;

    gl_FragColor = vec4( vec3( c ), 1.0 );
}