import { _decorator, CCFloat, Component, RigidBody2D, Vec2, CircleCollider2D,input, Contact2DType, 
    Collider2D, IPhysics2DContact, Input, EventKeyboard,Animation, 
    PhysicsSystem2D,
    v2,
    PHYSICS_2D_PTM_RATIO} from 'cc';
import { KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    
    @property({type: CCFloat}) private jumpForce:number;
    
    private vy :number=0;

    private rb:RigidBody2D;
    private playerAnim:Animation;
    private collider:Collider2D;
    
    private curClipName:string;
    private horizontal:number;
    private speed:number;
    private isJumping:boolean;
    private isOnGround:boolean;
    private isFacingRight:boolean;
    
    private isRolling:boolean;
    private canRolling:boolean;
    private rollCD:number;
    private tempSpeed:number;
    private tempGrav:number;
    private isWallSliding:boolean;
   
    onLoad() {
        input.on(Input.EventType.KEY_DOWN,this.keyDown,this);
        input.on(Input.EventType.KEY_UP,this.keyUp,this);
        // input.on(Input.EventType.KEY_PRESSING,this.keyPress,this);
        this.playerAnim = this.node.getComponent(Animation);
        this.collider = this.node.getComponent(Collider2D); 
        
        this.rb = this.node.getComponent(RigidBody2D);
        this.horizontal = 0;
        this.speed = 8;
        this.rollCD = 2;

        this.canRolling = true;
        this.isWallSliding= false;
        
    }

    start(){
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.onTouch,this);
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.attackHit,this);
        this.curClipName = this.playerAnim.defaultClip.toString();
        
        PhysicsSystem2D.instance.gravity = v2(0, -25 * PHYSICS_2D_PTM_RATIO);
    }

    

    update(deltaTime: number) {
        
        //KONDISI TIDAK/ROLLING
        // if(this.isWallSliding){
        //     this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y*0.7);
        //     // this.scheduleOnce(()=>{return;},0.5);
        //     return;
            
        // } 
        if(!this.isRolling){
            this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);

            //BERLARI
            if(this.isOnGround&&Math.abs(this.rb.linearVelocity.x)>0 ){
  
                this.playAnimation("heroRun");
            //DIAM
            } else if(this.isOnGround&& this.rb.linearVelocity.x==0) {
    
                this.playAnimation("heroIdle");
                
            }

        } else {
            //ROLLING
            if(this.canRolling&&this.isOnGround&&Math.abs(this.rb.linearVelocity.x)>0){
                this.canRolling = false;
                this.playAnimation("heroRoll");
                
                this.rb.linearVelocity = new Vec2(this.tempSpeed*2, this.rb.linearVelocity.y);
                this.scheduleOnce(()=>{
                 
                    this.isRolling=false;
                    this.tempSpeed = 0;
                },0.68);

            }

            if(!this.isOnGround) this.isRolling=false;

            //TIMER UNTUK BISA ROLL LAGI
            this.scheduleOnce(()=>{this.canRolling = true;},this.rollCD);
        }
        
        //Lompat
        if((this.isJumping && this.rb.linearVelocity.y>0)||(this.isJumping && this.isOnGround)){

            this.playAnimation("heroJump");
            this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.jumpForce*1.5);
            this.isJumping=false;
            this.isOnGround=false;
            this.isRolling=false;
        }
        //Terjun setelah lompat
        else if (!this.isOnGround && this.rb.linearVelocity.y<0){
            
            this.playAnimation("heroFall");
        }
        console.log(this.rb.linearVelocity);
    }

    //METHOD untuk mengubah arah player
    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        this.isFacingRight = !this.isFacingRight;
    }

    //Method interaksi dengan entity lainnya
    onTouch(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
      
        if(otherCollider.tag==2){               //Ground
            this.isOnGround = true;
            this.isWallSliding=false;
        }
        if(otherCollider.tag==0){               //Boss
            // this.knockback();
            this.playAnimation("heroHurt");
            this.rb.linearVelocity = new Vec2(this.speed*this.horizontal*-2, this.rb.linearVelocity.y);

            // this.scheduleOnce(()=>{return;},0.25);
        }
        if(otherCollider.tag==3){
            // this.playAnimation("heroWallSlide");
            // this.isWallSliding=true;
        }

    }

    //METHOD untuk hit box serangan
    attackHit(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
        
     
    }
    //Method untuk memainkan animasi jika dan hanya jika animasi yang sama belum dimainkan
    playAnimation(clipName:string){
        if(this.curClipName != clipName){
            this.playerAnim.play(clipName);
            this.curClipName = clipName;
        }
    }

    //Method untuk ketika mem-push keycaps 
    keyDown(event:EventKeyboard){
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                if(this.isFacingRight && !this.isWallSliding){
                    this.flip();
                }
                this.horizontal=1;
                // if(this.isWallSliding){
                //     this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
                //     this.isWallSliding=false;
                // }
                this.wallJump(1);

                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                if(!this.isFacingRight && !this.isWallSliding){
                    this.flip();
                }
                this.horizontal=-1;
                // if(this.isWallSliding){
                //     this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
                //     this.isWallSliding=false;
                // }
                this.wallJump(1);
                break;
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                console.log("up");
                this.isJumping = true;
                this.wallJump(1.5);
                break;
            case KeyCode.SHIFT_LEFT:
                    // alert("shift");
                    if(this.canRolling){

                        this.isRolling = true;
                        this.tempSpeed = this.rb.linearVelocity.x;
                    }

                break;

        }
    }
    wallJump(wallJumpPower:number){
        if(this.isWallSliding){
            this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.jumpForce*wallJumpPower);
            this.isWallSliding=false;
        }
    }

    //Method untuk ketika melepas keycaps 
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

    keyPress(event:EventKeyboard){
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
    dead(){

    }
    
}


