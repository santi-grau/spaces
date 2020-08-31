import { TextureLoader, ShaderMaterial, Vector2, DoubleSide, Vector4, NearestFilter, MeshBasicMaterial } from 'three'
import tex from './../assets/lights_a.png'
import letter from './../assets/letters.png'
import Shaders from './shaders/*.*'
import BaseColor from './../assets/gallery_diffuse.png'

class FlickerMaterial extends ShaderMaterial{
    constructor( ){
        super( { vertexShader : Shaders.passThrough.vert, fragmentShader : Shaders.flicker.frag } )

        var tLoader = new TextureLoader()
        var t = tLoader.load( tex )
        t.flipY = false
        this.uniforms.lightTex = { value : t }
        
        this.side = DoubleSide
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}

class CylinderMaterial extends ShaderMaterial{
    constructor( res ){
        super( { vertexShader : Shaders.passThrough.vert, fragmentShader : Shaders.cylinder.frag } )
        this.side = DoubleSide
        this.uniforms.tex = { value : null }
        this.uniforms.res = { value : res }
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}

class ScreenLeftMaterial extends ShaderMaterial{
    constructor( coords ){
        super( { vertexShader : Shaders.passThrough.vert, fragmentShader : Shaders.screenLeft.frag } )
        this.uniforms.coords = { value : new Vector4( coords.x1, coords.x2, coords.y1, coords.y2 ) }

        var tLoader = new TextureLoader()
        var t = tLoader.load( letter )
        t.flipY = false

        t.minFilter = NearestFilter
        t.magFilter = NearestFilter
        
        this.uniforms.letterTex = { value : t }
        this.uniforms.letterPosition = { value : new Vector2() }
        this.currentLetter = 0

        setTimeout( () => this.switchLetter(), 500 )
    }

    switchLetter(){
        if( this.currentLetter < 19 ) this.currentLetter++
        else this.currentLetter = 0
        this.uniforms.letterPosition = { value : new Vector2( this.currentLetter % 7, Math.floor( this.currentLetter / 7 ) ) }
        setTimeout( () => this.switchLetter(), 200 + Math.random() * 400 )
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}

class ScreenRightMaterial extends ShaderMaterial{
    constructor( coords ){
        super( { vertexShader : Shaders.passThrough.vert, fragmentShader : Shaders.screenRight.frag } )
        this.uniforms.coords = { value : new Vector4( coords.x1, coords.x2, coords.y1, coords.y2 ) }

        var tLoader = new TextureLoader()
        var t = tLoader.load( letter )
        t.flipY = false

        t.minFilter = NearestFilter
        t.magFilter = NearestFilter
        
        this.uniforms.tex = { value : t }
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}

class GalleryMaterial extends MeshBasicMaterial{
    constructor(  ){
        super( )

        this.side = DoubleSide

        var tLoader = new TextureLoader()
        var t = tLoader.load( BaseColor )
        t.flipY = false

        this.map = t
    }

    step( time ){
       
    }
}


class SpinnerMaterial extends ShaderMaterial{
    constructor( coords ){
        super( { vertexShader : Shaders.passThrough.vert, fragmentShader : Shaders.spinner.frag } )

        var tLoader = new TextureLoader()
        var t = tLoader.load( tex )
        t.flipY = false
        this.uniforms.lightTex = { value : t }
        this.uniforms.coords = { value : new Vector4( coords.x1, coords.x2, coords.y1, coords.y2 ) }
        
        this.side = DoubleSide
    }

    step( time ){
        this.uniforms.time = { value : time }
    }
}


export { FlickerMaterial, CylinderMaterial, ScreenLeftMaterial, ScreenRightMaterial, GalleryMaterial, SpinnerMaterial }