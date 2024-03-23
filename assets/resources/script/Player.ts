import { _decorator, CCFloat, Component, RigidBody2D, Vec2, CircleCollider2D,input, Contact2DType, Collider2D, IPhysics2DContact, Input, EventKeyboard, Vec3 } from 'cc';
import { KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    
    @property({type: CCFloat}) private jumpForce:number;
    
    private vy :number=0;

    private rb:RigidBody2D;
    private circleC:CircleCollider2D;
    private horizontal:number;
    private speed:number;
    private isJumping:boolean;
    private isOnGround:boolean;
    private collider;
    private isFacingRight;

   
    onLoad() {
        input.on(Input.EventType.KEY_DOWN,this.keyDown,this);
        input.on(Input.EventType.KEY_UP,this.keyUp,this);

        this.collider = this.node.getComponent(Collider2D); 
        
        this.rb = this.node.getComponent(RigidBody2D);
        this.circleC = this.node.getComponent(CircleCollider2D);
        this.horizontal = 0;
        this.speed = 8;
        
    }

    start(){
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.gotHit,this);
        
    }

    update(deltaTime: number) {
        
        this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
        // console.log(this.rb.linearVelocity.y);

        if((this.isJumping && this.rb.linearVelocity.y>0)||(this.isJumping && this.isOnGround)){
            this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.jumpForce*1.5);
            this.isJumping=false;
            this.isOnGround=false;

        }        
    }

    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        this.isFacingRight = !this.isFacingRight;
    }

    gotHit(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
      
        if(otherCollider.tag==2){               //Ground
            this.isOnGround = true;
        }
        if(otherCollider.tag==0){               //Boss
            // this.knockback();
        }
        if(otherCollider.tag==3){               //WALL
            // this.knockback();
        }
        console.log(otherCollider.tag);

    }

    keyDown(event:EventKeyboard){
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                if(this.isFacingRight){
                    this.flip();
                }
                this.horizontal=1;
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                if(!this.isFacingRight){
                    this.flip();
                }
                this.horizontal=-1;
                break;
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                console.log("up");
                this.isJumping = true;
                break;
        }
    }

    keyUp(event:EventKeyboard){
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                this.horizontal=0;
                break;
        }
    }

    knockback(){
        // this.rb.linearVelocity = new Vec2(this.speed*this.horizontal*1.5, this.jumpForce*1.5);
    }

    hit(){

    }
    
}


