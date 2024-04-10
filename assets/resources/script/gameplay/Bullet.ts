import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, 
    IPhysics2DContact, Node, Prefab, RigidBody2D, Vec2, Vec3,Animation, 
    CCFloat} from 'cc';
import { Boss } from './Boss';
import { Player } from './Player';
const { ccclass, property } = _decorator;


@ccclass('Bullet')
export class Bullet extends Component { private boss:Boss;
    
    @property({type: CCFloat})private damage:number;
    @property({type: CCFloat})private speed: number;;
    private rb: RigidBody2D;    
    private collider :CircleCollider2D;
    
    directionVal:number;
    private statusCrashing:boolean;
    
    animation :Animation;


    onLoad(){
        this.animation = this.node.getComponent(Animation);
        this.rb = this.node.getComponent(RigidBody2D);
        this.collider =  this.node.getComponent(CircleCollider2D);

    }

    start(){
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.onTouch,this);
        
        this.speed = 10;
        this.statusCrashing = false;
        
    }
    
    setSpawnAndDirection(pos:Vec3,direction:number){
        this.node.setPosition(pos.x+(this.directionVal+66), pos.y);
        this.directionVal = direction;
        this.statusCrashing = false;
    }

    update(deltaTime: number) {
        if(!this.statusCrashing){
            this.rb.linearVelocity = new Vec2(this.speed*this.directionVal, this.rb.linearVelocity.y);

        }
        
    }

    onTouch(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
        this.animation.play("crash");

        // if(otherCollider.tag ==0){
        //     let boss = this.node.getParent().getChildByName("Boss").getComponent(Boss);
        //     boss.receiveAttackFromPlayer(this.damage);
        // }
        console.log(otherCollider.tag);
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


