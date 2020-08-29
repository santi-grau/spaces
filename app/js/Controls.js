import { Vector3, Raycaster } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

class Controls extends PointerLockControls{
    constructor( camera, domElement ){
        super( camera, domElement )

        this.forward = false
        this.backward = false
        this.left = false
        this.right = false
        this.canJump = false

        this.prevTime = performance.now()
        this.velocity = new Vector3()
        this.direction = new Vector3()
        this.vertex = new Vector3()

        document.addEventListener( 'keydown', ( e ) => this.onKeyDown( e ), false )
        document.addEventListener( 'keyup', ( e ) => this.onKeyUp( e ), false )
        document.addEventListener( 'click', ( e ) => this.lock(), false )

        this.raycaster = new Raycaster( new Vector3(), new Vector3( 0, - 1, 0 ), 0, 10 )
    }

    onKeyDown( e ){
        switch ( e.keyCode ) {
            case 87: this.forward = true; break;
            case 65: this.left = true; break;
            case 83: this.backward = true; break;
            case 68: this.right = true; break;
            case 32:
                if ( this.canJump === true ) this.velocity.y += 350;
                this.canJump = false;
                break;
        }
    }

    onKeyUp( e ){
        switch ( e.keyCode ) {
            case 87: this.forward = false; break;
            case 65: this.left = false; break;
            case 83: this.backward = false; break;
            case 68: this.right = false; break;
        }
    }

    step( time, objects ){
        if ( !this.isLocked ) return
            
        this.raycaster.ray.origin.copy( this.getObject().position )
        this.raycaster.ray.origin.y -= 10
        var intersections = this.raycaster.intersectObjects( objects )
        var onObject = intersections.length > 0

        var time = performance.now()
        var delta = ( time - this.prevTime ) / 1000

        this.velocity.x -= this.velocity.x * 10.0 * delta
        this.velocity.z -= this.velocity.z * 10.0 * delta

        this.velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

        this.direction.z = Number( this.forward ) - Number( this.backward )
        this.direction.x = Number( this.right ) - Number( this.left )
        this.direction.normalize()

        if ( this.forward || this.backward ) this.velocity.z -= this.direction.z * 400.0 * delta
        if ( this.left || this.right ) this.velocity.x -= this.direction.x * 400.0 * delta

        if ( onObject === true ) {
            this.velocity.y = Math.max( 0, this.velocity.y )
            this.canJump = true
        }

        this.moveRight( - this.velocity.x * delta )
        this.moveForward( - this.velocity.z * delta )

        this.getObject().position.y += ( this.velocity.y * delta )

        if ( this.getObject().position.y < 10 ) {
            this.velocity.y = 0
            this.getObject().position.y = 10
            this.canJump = true
        }

        this.prevTime = time
    }
}

export { Controls as default }