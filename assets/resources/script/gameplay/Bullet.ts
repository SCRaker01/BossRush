import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, 
    IPhysics2DContact, Node, Prefab, RigidBody2D, Vec2, Vec3,Animation, 
    CCFloat} from 'cc';
import { Boss } from './Boss';
import { Player } from './Player';
import { staticData } from '../other/staticData';
const { ccclass, property } = _decorator;


@ccclass('Bullet')
export class Bullet extends Component { private boss:Boss;
    
    @property({type: CCFloat})private damage:number;
    @property({type: CCFloat})private speed: number;
    private rb: RigidBody2D;    
    private collider :CircleCollider2D;
    
    directionVal:number;
    private statusCrashing:boolean;
    
    animation :Animation;
    private yDistToPlayer:number;


    onLoad(){
        this.animation = this.node.getComponent(Animation);
        this.rb = this.node.getComponent(RigidBody2D);
        this.collider =  this.node.getComponent(CircleCollider2D);
        
    }

    start(){
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.onTouch,this);
        
        this.speed = 10;
        this.statusCrashing = false;

        if(staticData.diff_Level==2){
            this.damage *=2;
        }
        else if(staticData.diff_Level==3){
            this.damage *=2.5;
        }
        
    }
    
    setSpawnAndDirection(pos:Vec3,direction:number){
        this.node.setPosition(pos.x+(-this.directionVal*(66)), pos.y);
        this.directionVal = direction;
        this.statusCrashing = false;
    }

    setYDistance(yPos:number){
        this.yDistToPlayer = yPos - this.node.getPosition().y;
    }
    
    onValidate(){
        let targetSpeed = this.speed -this.rb.linearVelocity.y;
        let accelRate = (Math.abs(this.yDistToPlayer)>0) ? targetSpeed : this.speed ;
        this.rb.linearVelocity.y = accelRate;
    }

    update(deltaTime: number) {
        this.onValidate();

        let hero = this.node.getParent().getChildByName("Player").getComponent(Player);

        let dir:Vec2 = (new Vec2(hero.node.getPosition().x-this.node.getPosition().x,
                    hero.node.getPosition().y-this.node.getPosition().y))

        dir.normalize();

        let out:Vec3 = new Vec3(1,1,1);
        let rotateAmount = Vec3.cross(out,new Vec3 (dir.x,dir.y,0), new Vec3(0,1,0)).z;

        
        // console.log(rotateAmount);
        console.log(this.rb.linearVelocity.y);
        this.rb.angularVelocity = -rotateAmount * 200;




        // console.log(this.rb.angularVelocity);
        this.node.setRotationFromEuler(new Vec3(0,45,0));

        
        if(!this.statusCrashing){
            if(staticData.diff_Level== 3) {
                this.rb.linearVelocity = new Vec2(this.speed*dir.x, this.speed*dir.y);
            } 
            else {
                this.rb.linearVelocity = new Vec2(this.speed*this.directionVal, this.rb.linearVelocity.y); 
            }

        } 
        
    }

    onTouch(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
        this.animation.play("crash");

        // if(otherCollider.tag ==0){
        //     let boss = this.node.getParent().getChildByName("Boss").getComponent(Boss);
        //     boss.receiveAttackFromPlayer(this.damage);
        // }
        // console.log(otherCollider.tag);
        if(otherCollider.tag ==1){
            let hero = this.node.getParent().getChildByName("Player").getComponent(Player);
            hero.receiveAttackFromBoss(this.damage);
        }

        this.statusCrashing = true;
        this.scheduleOnce(()=>{
            this.node.active = false;

        },0.1)
        
    } 

}


