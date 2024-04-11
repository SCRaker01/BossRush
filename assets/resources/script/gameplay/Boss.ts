import { _decorator, CircleCollider2D, Component, Node, RigidBody2D, UITransform, Vec2, Vec3, 
        Animation, ERaycast2DType, Graphics, PhysicsSystem2D, randomRangeInt, CCInteger } from 'cc';
import { Player } from './Player';
import { HealthBar } from './HealthBar';
import { Pool } from './Pool';

const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Component {

    /*@property({type:Node})*/ private player:Node;
    @property({type:CCInteger}) private bossHealth:number;
    @property({type:CCInteger}) private bossDamage:number;
    @property({type:Pool}) private pool:Pool;
  

    private rb:RigidBody2D;
    // private circleC:CircleCollider2D;
    private bossAnim:Animation;
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

    private attackAnimNum;
    private startStat:boolean;  //ambil dari gameManager -> scoreManager (mulai masuk area + mulai gamenya)

    private multiplier:number;


    onLoad(){
        this.rb = this.node.getComponent(RigidBody2D);
        // this.circleC = this.node.getComponent(CircleCollider2D);
        this.bossAnim = this.node.getComponent(Animation);
        // this.curClipName = this.bossAnim.defaultClip.toString();
        let parentNode = this.node.getParent();
        this.player = parentNode.getChildByName("Player");
        this.stunDur = 1;                                   //Sementar waktu untuk skellHit
        // this.isHit=false;

        this.directionVal = 1;
        this.canAttack= true;
        this.attackCD = 3;
        this.deadStat = false;
        this.isAttacking = false;
        this.startStat = false;

    }

    
    start() {
        this.horizontal = 0;
        this.attackAnimNum=-1;
        this.speed = 6;

        this.heatlthBar = this.node.getParent().getChildByName("HealthContainer").getComponent(HealthBar);
        this.heatlthBar.setEnemyBaseHealth(this.bossHealth);
    }
    
    update(deltaTime: number) {
        let playerPosX = this.player.getPosition().x;
        let bossPosX = this.node.getPosition().x;
        
        //Boss tidak sedang menyerang atau mati
        if(this.startStat&&!this.deadStat && !this.isAttacking){
            if(playerPosX < bossPosX) {         //Player disebelah kiri boss
                this.horizontal = -0.5;
                if(!this.isFacingRight) this.flip();
                
            }
            else if (playerPosX > bossPosX) {       //Player disebelah kanan boss 
                this.horizontal = 0.5;                  
                if(this.isFacingRight) this.flip();
               
            }

            //Jarak antara player dan boss lebih dari ukuran sprite boss + 66
            if (Math.abs(bossPosX - playerPosX)
                    > (this.node.getComponent(UITransform).contentSize.x)+66){
        
                if(this.canAttack){
                    this.spawnBullet();
                } else {

                    this.playAnimation("skellWalk");
                }
                
                this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
            
            }else {                 //Jarak antara boss dan player cukup untuk melakukan serangan
                
                this.playAnimation("skellIdle");
                
                if(this.canAttack){
                    this.attack();
                }
            }
            
            
        }
        // console.log(this.curClipName);

    }

    setMultiplier(mult:number){
        this.bossDamage*=mult;
        this.bossHealth*=mult;
    }

    activateBoss(){
        this.startStat = true;
    }

    //Method untuk memainkan animasi
    playAnimation(clipName:string){
        if(this.curClipName != clipName){
            this.bossAnim.play(clipName);
            this.curClipName = clipName;
        }
    }

    //Method untuk menerima serangan dari player
    receiveAttackFromPlayer(damage:number){
        // this.isHit=true;
        this.heatlthBar.showEnemyHB();
        this.bossHealth-=damage;

        // console.log(this.bossHealth);
        console.log("boss damage :"+damage);
        console.log("player health : "+this.bossHealth);

        this.heatlthBar.updateHealth("Boss",this.bossHealth);

        this.bossAnim.play("skellHurt");

        if (this.isDead()) {    
            this.dead();
        }
      
    }

    spawnBullet(){
        this.pool.node.setPosition(this.node.getPosition());
        this.pool.shoot(this.directionVal);
        this.canAttack=false;
        // this.isAttacking = true;
        // this.playAnimation("skellIdle");

        this.scheduleOnce(()=>{
            this.canAttack = true;
            
        },2);
    }

    //Method untuk mengecek apakah boss mati atau tidak
    isDead():boolean{
        // console.log(this.bossHealth);
        if(this.bossHealth<=0) {
            this.deadStat=true;
            return true;
        }
        else return false;
    }

    //Method yang dimainkan ketika boss mati
    dead(){
        this.playAnimation("skellDie");
        this.scheduleOnce(()=>{
            this.node.active=false;
        },this.stunDur);
    }

    //Method serangan dari boss dengan menggunakan raycast
    attack(){
        this.isAttacking =true;
        
       
        this.attackAnimNum++;
        if(this.attackAnimNum%2 == 0){
            this.playAnimation("skellAttack1");
        } else if (this.attackAnimNum%2 == 1) {
            this.playAnimation("skellAttack2");

        }
  
        this.canAttack = false;

                                            // Serangan dilakukan setelah animasi selesai
        let animTimer:number = 1.1;
        this.scheduleOnce(()=>{
            for(let i =0 ;i< 3;i++){
                let p1 = new Vec2(this.node.worldPosition.x-(75*this.directionVal), 77+(i*15));
                let p2 = new Vec2(this.node.worldPosition.x+(150*this.directionVal), 77+(i*45));
                let mask = 0xffffffff;
         
                let results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.All,mask);
                
          
        
                if(results){
    
                    if(results[0]!=null && results[0].collider.tag ==1) {
                        results[0].collider.getComponent(Player).receiveAttackFromBoss(this.bossDamage);
                    }
                }

            }
            this.isAttacking = false;
        },animTimer);
        
        
        this.scheduleOnce(()=>{
     
            this.canAttack = true;
            
        },this.attackCD-animTimer);
        
    }

    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        this.isFacingRight = !this.isFacingRight;
        this.directionVal*= -1;
    }
}


