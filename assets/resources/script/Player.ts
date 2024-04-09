import { _decorator, CCFloat, Component, RigidBody2D, Vec2, CircleCollider2D,input, Contact2DType, 
    Collider2D, IPhysics2DContact, Input, EventKeyboard,Animation, 
    PhysicsSystem2D, v2, PHYSICS_2D_PTM_RATIO, BoxCollider2D, randomRangeInt,
    Prefab, ERaycast2DType,
    } from 'cc';
import { KeyCode } from 'cc';
import { Boss } from './Boss';
import { HealthBar } from './HealthBar';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    
    @property({type: CCFloat}) private jumpForce:number;
    @property({type: CCFloat}) private playerDamage:number;
    @property({type: CCFloat}) private playerHealth:number;
    @property({type:Prefab}) private hurtBox:Prefab;
    
    private vy :number=0;
    
    private heatlthBar:HealthBar;
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
    private isWallSliding:boolean;
    
    private canDoubleJump:boolean;
    private directionVal:number;

    private deadStat:boolean;
    private isHit:boolean;

   
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
        this.deadStat = false;
        this.isHit = false;

    }

    start(){
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.onTouch,this);
        
        this.curClipName = this.playerAnim.defaultClip.toString();
        
        PhysicsSystem2D.instance.gravity = v2(0, -25 * PHYSICS_2D_PTM_RATIO);

        this.heatlthBar = this.node.getParent().getChildByName("HealthContainer").getComponent(HealthBar);
        this.heatlthBar.setPlayerBaseHealth(this.playerHealth);
        
    }

    update(deltaTime: number) {
        // console.log(this.horizontal);
        if(!this.deadStat){
            if(this.isHit){
                return;
            }

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
    }

    //Method Jump
    jump(){
        this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.jumpForce*1.5);
        this.isJumping=false;
        this.isOnGround=false;
        this.isRolling=false;
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

                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                if(!this.isFacingRight && !this.isWallSliding){
                    this.flip();
                }
                this.horizontal=-1;


                break;
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:

                if((this.isJumping && this.isOnGround) || this.canDoubleJump){

                    this.playAnimation("heroJump");
                    this.jump();
                    this.canDoubleJump = !this.canDoubleJump;
                    
                }
                this.isJumping = true;
         
                
                break;
            case KeyCode.SHIFT_LEFT:
            
                    if(this.canRolling && !this.isHit){

                        this.isRolling = true;
                        this.tempSpeed = this.rb.linearVelocity.x;
                    }

                break;
            case KeyCode.KEY_J:
                if(this.canAttack){
                    this.attack();
                  
                }
                break;
            case KeyCode.SHIFT_RIGHT:
                if(Math.abs(this.horizontal)==1)this.horizontal*=2;
                break;
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
            case KeyCode.SHIFT_RIGHT:
                if(Math.abs(this.horizontal)>1)this.horizontal/=2;
        }
    }

    // keyPress(event:EventKeyboard){
    //     switch(event.keyCode){
            
    //     }
    // }


    private attackAnimNum:number=-1;
    //Method attack pakai raycast
    attack(){
        //Cari posisi awal dan akhir serangan   
        let pos = this.node.getPosition();
        let p1 = new Vec2(this.node.worldPosition.x, this.node.worldPosition.y);
        let p2 = new Vec2(this.node.worldPosition.x+(150*this.directionVal), this.node.worldPosition.y+33);     //Dibuat jadi diagonal serangannya

        // console.log(p1.x+" "+(p1.y-33));

        let mask = 0xffffffff;
        let results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.All,mask);
     
        if(results){
            
            if(results[0] != null && results[0].collider.tag ==0) {
                results[0].collider.getComponent(Boss).receiveAttackFromPlayer(this.playerDamage);
            }

        }
    
        
        //Boolean untuk memastikan hanya 1 serangan
        this.canAttack = false;

        //Mainkan random animation
        // let rnd :number = randomRangeInt(0,2);
        this.attackAnimNum++;
        if(this.attackAnimNum%3==0){
            this.playerAnim.play("heroAttack1");
        } else if(this.attackAnimNum%3==1){
            this.playerAnim.play("heroAttack2");
        }else {
            this.playerAnim.play("heroAttack3");
        }
        
        //Scheduler untuk menyalakan boolean serangan
        this.scheduleOnce(()=>{
            if(Math.abs(this.rb.linearVelocity.x)==0)this.playerAnim.play("heroIdle");
            else this.playerAnim.play("heroRun");
            this.canAttack = true;
            
        },this.attackCD);
        
    }

    //Method menerima serangan dari musuh/boss
    receiveAttackFromBoss(damage:number){
        this.isHit=true;
        this.playerHealth-=damage;
        console.log("boss damage :"+damage);
        console.log("player health : "+this.playerHealth);

        this.playAnimation("heroHurt");
        this.heatlthBar.updateHealth("Player",this.playerHealth);
        if (this.isDead()) {    
            this.dead();
        }
        
        this.scheduleOnce(()=>{
            this.isHit=false;
        },0.25);
       
    }

    //Method untuk mengecek apakah mati atau tidak
    isDead():boolean {
        if(this.playerHealth<=0) {
            this.deadStat=true;
            return true;
        }
        else return false;
    }

    //----------------------------------------------------------------
    //Method ketika player mati
    dead(){
        this.deadStat = true
        this.playAnimation("heroDeath");
    }
    
}


