import { _decorator, CCInteger, Component, ERaycast2DType, Node, PhysicsSystem2D,Animation, RigidBody2D, UITransform, Vec2 } from 'cc';
import { HealthBar } from '../gameplay/HealthBar';
import { Player } from '../gameplay/Player';
import { AudioManager } from '../other/AudioManager';
import { Pool } from '../gameplay/Pool';
import { staticData } from '../other/staticData';
const { ccclass, property } = _decorator;

@ccclass('Fireworm')
export class Fireworm extends Component {
    /*@property({type:Node})*/ private player:Node;
    @property({type:CCInteger}) private MomonHealth:number;
    @property({type:CCInteger}) private MomonDamage:number;
    @property({type:Pool}) private pool:Pool;
    @property({type:AudioManager}) private audio:AudioManager;
  

    private rb:RigidBody2D;
    // private circleC:CircleCollider2D;
    private monAnim:Animation;
    private curClipName:string;
    private heatlthBar:HealthBar;
    
    // private isHit:boolean;
    private isFacingRight:boolean;
    private horizontal:number;
    private speed:number;
    
    private canAttack:boolean;
    private stunDur:number;
    private attackCD:number;

    private directionVal:number;
    private deadStat:boolean;
    private isAttacking:boolean;



    onLoad(){
        this.rb = this.node.getComponent(RigidBody2D);
        this.monAnim = this.node.getComponent(Animation);
        let parentNode = this.node.getParent().getParent();

        this.player = parentNode.getChildByName("Player");
        this.stunDur = 2;                                   //Sementar waktu untuk skellHit
  

        this.directionVal = 1;
        this.canAttack= true;
        this.attackCD = 3;
        this.deadStat = false;
        this.isAttacking = false;

    }

    
    start() {
        this.horizontal = 0;
        this.speed = 5;
    }
    
    update(deltaTime: number) {
        let playerPosX = this.player.getPosition().x;
        let monPosX = this.node.getPosition().x;
        // console.log(this.)
        //Boss tidak sedang menyerang atau mati
        if(!this.deadStat && !this.isAttacking){
            if(playerPosX < monPosX) {         //Player disebelah kiri boss
                this.horizontal = -0.5;
                if(!this.isFacingRight) this.flip();
                
            }
            else if (playerPosX > monPosX) {       //Player disebelah kanan boss 
                this.horizontal = 0.5;                  
                if(this.isFacingRight) this.flip();
               
            }

            //Jarak antara player dan boss lebih dari ukuran sprite boss
            let distToPlayer = Vec2.distance(this.node.getPosition(), this.player.getPosition())
            // console.log(distToPlayer)

            if(distToPlayer<600){

                if ((Math.abs(monPosX - playerPosX) > (this.node.getComponent(UITransform).contentSize.x)+500) ){
           
                     this.playAnimation("wormMove");
                    
                     this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
                    
                }else {                 //Jarak antara boss dan player cukup untuk melakukan serangan
                    // console.log("idle")
                    this.playAnimation("wormIdle");
                    
                    // Jika ketinggian player dibawah ukuran dari sprite boss

                    if (this.player.getPosition().y < 
                    this.node.getPosition().y+this.node.getComponent(UITransform).contentSize.y &&
                    this.player.getPosition().y >= this.node.getPosition().y-10){
                        
                        if(this.canAttack){     //Jika ya, Serang dengan melee
                            // this.attack();
                            this.spawnBullet();
                        }
                    }
                }

            }else {
                 this.playAnimation("wormIdle");

            }
            
            
         }

     }

   
    //Multiplier darah dan damage sesuai difficulty level, digunakan di GameManager
    setMultiplier(mult:number){
        this.MomonDamage*=mult;
        this.MomonHealth*=mult;
    }

    spawnBullet(){
        // this.isAttacking = true;
        this.canAttack=false;
        this.monAnim.play("wormAttack");

        // this.isAttacking = false;
        this.scheduleOnce(()=>{     //Set awal lokasi bullet, dan nyalakan node + suara    
            this.pool.node.setPosition(this.node.getPosition());
            this.audio.onAudioQueue(4);
            this.pool.shoot(this.directionVal);
            
        },1);
    
        this.scheduleOnce(()=>{ //Timer
            this.canAttack = true;
        },1.5);
    }

    //Method untuk memainkan animasi
    playAnimation(clipName:string){
        if(this.curClipName != clipName){
            this.monAnim.play(clipName);
            this.curClipName = clipName;
        }
    }

    //Method untuk menerima serangan dari player
    receiveAttackFromPlayer(damage:number){

        this.audio.onAudioQueue(3);
   
        this.MomonHealth-=damage;
        
        if(!this.isAttacking){
            this.monAnim.play("wormHurt");
        }

        if (this.isDead()) {    
            this.dead();
        }
      
    }

   
    //Method untuk mengecek apakah boss mati atau tidak
    isDead():boolean{
        // console.log(this.MomonHealth);
        if(this.MomonHealth<=0) {
            this.deadStat=true;
            return true;
        }
        else return false;
    }

    //Method yang dimainkan ketika boss mati
    dead(){
        this.audio.onAudioQueue(6);
        this.playAnimation("wormDie");
        staticData.numberOfFireworms--;
        this.scheduleOnce(()=>{
            // this.node.active=false;
            if(this.node.isValid){
                this.node.destroy();
            }
        },this.stunDur/3);
    }

    //Method serangan dari boss dengan menggunakan raycast


    //Membalikkan sprite boss dan semua yang diperlukan
    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        this.isFacingRight = !this.isFacingRight;
        this.directionVal*= -1;
    }
}


