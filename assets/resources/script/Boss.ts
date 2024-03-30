import { _decorator, CircleCollider2D, Component, Node, RigidBody2D, UITransform, Vec2, Vec3, Animation, ERaycast2DType, Graphics, PhysicsSystem2D, randomRangeInt, CCInteger } from 'cc';
import { Player } from './Player';

const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Component {

    /*@property({type:Node})*/ private player:Node;
    @property({type:CCInteger}) private bossHealth:number;
    @property({type:CCInteger}) private bossDamage:number;

    private rb:RigidBody2D;
    private circleC:CircleCollider2D;
    private bossAnim:Animation;
    private curClipName:string;
    
    private isHit:boolean;
    private isFacingRight:boolean;
    private horizontal:number;
    private speed:number;
    
    private canAttack:boolean;
    private stunDur:number;
    private attackCD:number;

    private directionVal:number;


    onLoad(){
        this.rb = this.node.getComponent(RigidBody2D);
        this.circleC = this.node.getComponent(CircleCollider2D);
        this.bossAnim = this.node.getComponent(Animation);
        // this.curClipName = this.bossAnim.defaultClip.toString();
        let parentNode = this.node.getParent();
        this.player = parentNode.getChildByName("Player");
        this.stunDur = 1;                                   //Sementar waktu untuk skellHit
        this.isHit=false;

        this.directionVal = -1;
        this.canAttack= true;
        this.attackCD = 2;
    }

    start() {
        this.horizontal = 0;
        this.speed = 4;
    }

    update(deltaTime: number) {
        let playerPosX = this.player.getPosition().x;
        let bossPosX = this.node.getPosition().x;
        // console.log(this.circleC.tag)
        
        // if(this.isHit) this.scheduleOnce(()=>{
        //     this.isHit=false;
        //     return;
        // },this.stunDur);
        
        if (Math.abs(bossPosX - playerPosX)
                > (this.node.getComponent(UITransform).contentSize.x/2)-1){
    
            this.playAnimation("skellWalk");
            if(playerPosX < bossPosX) {
                this.horizontal = -0.5;
                if(!this.isFacingRight) this.flip();
                
            }
            else if (playerPosX > bossPosX) {
                this.horizontal = 0.5;
                if(this.isFacingRight) this.flip();
               
            }

            
            this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
            // console.log(Math.abs(bossPosX - playerPosX));
        }else { 
            this.playAnimation("skellIdle");
            // if(this.canAttack)this.attack();
        }
        

    }
    playAnimation(clipName:string){
        if(this.curClipName != clipName){
            this.bossAnim.play(clipName);
            this.curClipName = clipName;
        }
    }

    receiveAttackFromPlayer(damage:number){
        this.isHit=true;
        this.bossHealth-=damage;
        // console.log(this.bossHealth);

        this.playAnimation("skellHurt");

        if (this.isDead()) {    
            this.dead();
        }
        
        // if(isFacingRight) this.rb.linearVelocity = new Vec2(this.speed*2.5, this.rb.linearVelocity.y*0.5);
        // else this.rb.linearVelocity = new Vec2(this.speed*-2.5, this.rb.linearVelocity.y*0.5);
    }

    isDead():boolean{
        if(this.bossHealth<=0) return true;
        else return false;
    }

    dead(){
        this.playAnimation("skellDie");
        this.scheduleOnce(()=>{this.node.active=false;},this.stunDur);
    }

    knockback(){
        // this.rb.linearVelocity = new Vec2(this.speed*this.horizontal*0.5, this.rb.linearVelocity.y*0.5);
    }

    attack(){
   
        let p1 = new Vec2(this.node.worldPosition.x, this.node.worldPosition.y);
        let p2 = new Vec2(this.node.worldPosition.x+(250*this.directionVal), this.node.worldPosition.y);
        let mask = 0xffffffff;
 
        let results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.All,mask);
      
        console.log(results);
        // let enemy = results[0].collider;
        // console.log(enemy.tag);
        // console.log(results[0].collider.name+" "+results[0].collider.tag);

        // if(results[0].collider.tag ==1) {
        //     results[0].collider.getComponent(Player).receiveAttackFromBoss(this.bossDamage);
        // }
    
  
        this.canAttack = false;

      
        this.playAnimation("skellAttack");
        
        
        this.scheduleOnce(()=>{
            // if(Math.abs(this.rb.linearVelocity.x)==0)this.bossAnim.play("skellIdle");
            // else this.bossAnim.play("skellWalk");

            this.canAttack = true;
            
        },this.attackCD);
        
    }

    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        this.isFacingRight = !this.isFacingRight;
        this.directionVal*= -1;
    }
}


