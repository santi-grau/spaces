import { Group, Mesh, AnimationMixer, MeshBasicMaterial, TextureLoader, ShaderMaterial, DoubleSide, Clock, Vector4 } from 'three'
import tex from './../assets/lights.jpg'
import FlickerShader from './flicker.*'
import CylinderShader from './cylinder.*'
import ScreenShader from './screen.*'

class FlickerMaterial extends ShaderMaterial{
    constructor( ref ){
        super( { vertexShader : FlickerShader.vert, fragmentShader : FlickerShader.frag } )

        var tLoader = new TextureLoader()
        var t = tLoader.load( tex )
        t.flipY = false
        this.uniforms.lightTex = { value : t }
        
        this.side = DoubleSide
        this.skinning = true
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}

class CylinderMaterial extends ShaderMaterial{
    constructor(){
        super( { vertexShader : CylinderShader.vert, fragmentShader : CylinderShader.frag } )
        this.side = DoubleSide
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}

class ScreenMaterial extends ShaderMaterial{
    constructor( coords ){
        super( { vertexShader : ScreenShader.vert, fragmentShader : ScreenShader.frag } )
        this.uniforms.coords = { value : new Vector4( coords.x1, coords.x2, coords.y1, coords.y2 ) }
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}

class Room extends Group{
    constructor( gltf ){
        super()

        this.add( gltf.scene )
        this.clock = new Clock()

        this.mixer = new AnimationMixer( gltf.scene )
        var action = this.mixer.clipAction( gltf.animations[ 0 ] )
        action.loop = true
        action.play()

        this.scale.set( 10, 10, 10 )
        var tLoader = new TextureLoader()
        var t = tLoader.load( tex )
        t.flipY = false

        this.mods = []

        this.traverse( child => {
            
            if ( child instanceof Mesh ) {
                if( child.name == 'Cylinder' ) {
                    child.material = new CylinderMaterial( )
                    this.mods.push( child )
                } else if( child.name == 'screen_l' ) {
                    child.material = new ScreenMaterial( { x1 : 0.169856, x2 : 0.22645, y1 : 0.998413, y2 : 0.898428 } )
                    this.mods.push( child )
                } else if( child.name == 'screen_r' ) {
                    child.material = new ScreenMaterial( { x1 : 0.248639, x2 : 0.305233, y1 : 0.998033, y2 : 0.898048 } )
                    this.mods.push( child )
                } else {
                    child.material = new FlickerMaterial( child.material )
                    this.mods.push( child )
                }

            }
        } )
    }

    step( time ){
        var delta = this.clock.getDelta();
        if ( this.mixer ) this.mixer.update( delta );
        this.mods.forEach( m => m.material.step( time ) )
    }
}

export { Room as default }