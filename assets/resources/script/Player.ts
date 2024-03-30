import { _decorator, CCFloat, Component, RigidBody2D, Vec2, CircleCollider2D,input, Contact2DType, 
    Collider2D, IPhysics2DContact, Input, EventKeyboard,Animation, 
    PhysicsSystem2D, v2, PHYSICS_2D_PTM_RATIO, BoxCollider2D, randomRangeInt,
    Prefab,geometry,physics, PhysicsSystem,
    ERaycast2DType,
    Graphics} from 'cc';
import { KeyCode } from 'cc';
import { Boss } from './Boss';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    
    @property({type: CCFloat}) private jumpForce:number;
    @property({type: CCFloat}) private playerDamage:number;
    @property({type:Prefab}) private hurtBox:Prefab;
    
    private vy :number=0;

    private rb:RigidBody2D;
    private playerAnim:Animation;
    private collider:CircleCollider2D;
    private attackHitBox:BoxCollider2D;
    
    private curClipName:string;
    private horizontal:number;
    private speed:number;
    private isJumping:boolean;
    private isOnGround:boolean;
    private isFacingRight:boolean;
    private isRolling:boolean;
    private canRolling:boolean;
    private rollCD:number;
    
    private canAttack:boolean;
    private attackCD:number;
    
    private tempSpeed:number;
    private tempGrav:number;
    private isWallSliding:boolean;

    private canDoubleJump:boolean;
    private phySys:PhysicsSystem;
    private directionVal:number;

    

   
    onLoad() {
        input.on(Input.EventType.KEY_DOWN,this.keyDown,this);
        input.on(Input.EventType.KEY_UP,this.keyUp,this);
        // input.on(Input.EventType.KEY_PRESSING,this.keyPress,this);
        this.playerAnim = this.node.getComponent(Animation);
        this.collider = this.node.getComponent(CircleCollider2D); 
        this.attackHitBox= this.node.getComponent(BoxCollider2D);
        
        this.rb = this.node.getComponent(RigidBody2D);
        this.horizontal = 0;
        this.speed = 8;
        this.rollCD = 2;
        this.attackCD = 0.5;        //Berdasarkan lama animasi attack
        this.directionVal = 1;       //Kanan = 1 , Kiri = -1, jadi val buat simpenan arah 

        this.canRolling = true;
        this.canAttack = true;
        this.canDoubleJump= false;
        this.isWallSliding= false;
        // PhysicsSystem.instance.enable = true;
        // this.phySys = PhysicsSystem.instance;

    }

    start(){
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.onTouch,this);
        
        this.curClipName = this.playerAnim.defaultClip.toString();
        
        PhysicsSystem2D.instance.gravity = v2(0, -25 * PHYSICS_2D_PTM_RATIO);
    }

    update(deltaTime: number) {
        // console.log(this.rb.group);
        // console.log(this.attackHitBox.
        //KONDISI TIDAK/ROLLING
        // if(this.isWallSliding){
        //     this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y*0.7);
        //     // this.scheduleOnce(()=>{return;},0.5);
        //     return;
            
        // } 
       
        // console.log(this.phySys);
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
        //Disatukan dengan input "lompat" ,tidak ditaruh di dalam update(); sebagai solusi untuk isu double jump

        //Terjun setelah lompat
        if (!this.isOnGround && this.rb.linearVelocity.y<0){
            
            this.playAnimation("heroFall");
        }
        // console.log(this.rb.linearVelocity);
    }

    jump(){
        this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.jumpForce*1.5);
        this.isJumping=false;
        this.isOnGround=false;
        this.isRolling=false;
        // this.canDoubleJump=true;
    }

    

    //METHOD untuk mengubah arah player
    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        
        this.isFacingRight = !this.isFacingRight;
        this.directionVal*=-1;
    }

    //Method interaksi dengan entity lainnya
    onTouch(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
      
        if(otherCollider.tag==2){               //Ground
            this.isOnGround = true;
            this.canDoubleJump=false;
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
    attackHit(selfCollider: BoxCollider2D, otherCollider: CircleCollider2D, contact : IPhysics2DContact|null){
        if (otherCollider.tag==0){
            
            // contact.disabledOnce = true;
            // console.log(otherCollider.name);
            // alert("hit");
            console.log(contact.colliderA.node);
            console.log(contact.colliderB.node);
            // let bossNode:Boss = find("Boss").getComponent(Boss);
            // console.log(bossNode);
        }
        
     
    }
    //Harus di set untuk posisi hurtBox
  

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
                // this.wallJump(1);
               

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
                // this.wallJump(1);
                

                break;
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:

                if((this.isJumping && this.isOnGround) || this.canDoubleJump){

                    this.playAnimation("heroJump");
                    this.jump();
                    this.canDoubleJump = !this.canDoubleJump;
                    
                }
                this.isJumping = true;
                // this.wallJump(1.5);
                
                break;
            case KeyCode.SHIFT_LEFT:
                    // alert("shift");
                    if(this.canRolling){

                        this.isRolling = true;
                        this.tempSpeed = this.rb.linearVelocity.x;
                    }

                break;
            case KeyCode.KEY_J:
                if(this.canAttack){
                    this.attack();
                  
                }

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

    attack(){
        // this.attackHitBox.on(Contact2DType.BEGIN_CONTACT,this.attackHit,this);
        // this.attackHitBox.node.active = true;
        let ctx:Graphics = null;
        // this.createHurtBox();
        let pos = this.node.getPosition();
        let p1 = new Vec2(this.node.worldPosition.x, this.node.worldPosition.y);
        let p2 = new Vec2(this.node.worldPosition.x+(500*this.directionVal), this.node.worldPosition.y);
        // let worldRay = new geometry.Ray(pos.x,pos.y,0, 10,0,0);
        let mask = 0xffffffff;
        // let maxDistance = 10000000;
        // let queryTrigger = true;

        // console.log(worldRay);

        // let bRes = PhysicsSystem.instance.raycastClosest(worldRay,mask,maxDistance,queryTrigger);
        let results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.All,mask);
        // console.log(results);
        // console.log(this.node.worldPosition.x+" "+this.node.worldPosition.y);
        // console.log(pos.x+" "+pos.y);
        let enemy = results[0];
        console.log(enemy.collider.tag);
        
        if(enemy.collider.tag ==0) {
            enemy.collider.getComponent(Boss).receiveAttackFromPlayer(this.playerDamage);
        }
    
        
        this.attackHitBox.sensor = true;
        this.canAttack = false;

        let rnd :number = randomRangeInt(0,3);
       
        if(rnd==0){
            this.playerAnim.play("heroAttack1");
        } else if(rnd==1){
            this.playerAnim.play("heroAttack2");
        }else {
            this.playerAnim.play("heroAttack3");
            
        }
        
        
        this.scheduleOnce(()=>{
            if(Math.abs(this.rb.linearVelocity.x)==0)this.playerAnim.play("heroIdle");
            else this.playerAnim.play("heroRun");


            this.canAttack = true;
            
        },this.attackCD);
        
    }

    receiveAttackFromBoss(damage:number){
        // this.isHit=true;
        // this.bossHealth-=damage;
        // // console.log(this.bossHealth);

        // this.playAnimation("skellHurt");

        // if (this.isDead()) {    
        //     this.dead();
        // }
        
        // if(isFacingRight) this.rb.linearVelocity = new Vec2(this.speed*2.5, this.rb.linearVelocity.y*0.5);
        // else this.rb.linearVelocity = new Vec2(this.speed*-2.5, this.rb.linearVelocity.y*0.5);
    }
    dead(){

    }
    
}


