import { Scene, WebGLRenderer, PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import scene from './../assets/room_a.glb'
import Room from './Room'

class Main{
    constructor(){

        // setup three.js
        this.node = document.getElementById( 'main' )
        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )
        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()

        // orbit controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        
        // load gltf, pass render reference for GPUcompute
        new GLTFLoader( ).load( scene, ( gltf ) => this.scene.add( new Room( gltf, this.renderer ) ) )
        
        this.step( 0 )
        this.resize()
    }

    resize( ){ // just camera setup
        let [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
        this.renderer.setPixelRatio( 1 )
        var camView = { fov : 35, aspect : width / height, near : 0.001, far : 10000 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.set( 0, 3, -30 )
        
        this.camera.updateProjectionMatrix()
        // this.camera.lookAt( new Vector3( 0, 0, -300 ) )
    }

    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        if( this.scene.children.length ) this.scene.children[ 0 ].step( time )
        this.renderer.render( this.scene, this.camera ) 
    }
}

var main = new Main()
window.addEventListener('resize', () => main.resize() ) // keep fullscreen