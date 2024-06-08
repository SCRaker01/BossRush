import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, 
    IPhysics2DContact, Node, Prefab, RigidBody2D, Vec2, Vec3,Animation, 
    CCFloat} from 'cc';
import { Boss } from './Boss';

import { staticData } from '../other/staticData';
import { Player } from './Player';
const { ccclass, property } = _decorator;


@ccclass('Bullet')

export class Bullet extends Component { 
    @property({type: CCFloat})private damage:number;
    @property({type: CCFloat})private speed: number;
    private boss:Boss;
    private rb: RigidBody2D;    
    private collider :CircleCollider2D;
    
    private yDistToPlayer:number;
    private statusCrashing:boolean;
  
    directionVal:number;
    animation :Animation;
    


    onLoad(){
        this.animation = this.node.getComponent(Animation);
        this.rb = this.node.getComponent(RigidBody2D);
        this.collider =  this.node.getComponent(CircleCollider2D);
        this.directionVal=-1;
    }

    start(){
        this.collider.on(Contact2DType.BEGIN_CONTACT,this.onTouch,this);
        
        this.statusCrashing = false;

        if(staticData.diff_Level==2){
            this.damage *=2;
        }
        else if(staticData.diff_Level==3){
            this.damage *=2.5;
        }
        
    }

    //set lokasi spawn dan arah pergerakan (kanan /kiri)
    setSpawnAndDirection(pos:Vec3,direction:number){
        let scale = this.node.getScale();
        console.log(direction)

        this.directionVal = direction;
        if(direction==-1){
            this.node.setScale(-scale.x, scale.y,scale.z);
        }else{
            this.node.setScale(scale.x, scale.y,scale.z);

        }
        this.node.setPosition(pos.x+(direction*(33)), pos.y);       //72 nya penyesuaian setengah ukuran boss
        this.statusCrashing = false;
    }

    //Mengupdate kecepatan bullet agar tidak melebihi maks speed 
    update(deltaTime: number) {
       

        if(!this.statusCrashing){
            
            this.rb.linearVelocity = new Vec2(this.speed*this.directionVal, this.rb.linearVelocity.y); 
        } 
        
    }

    //Saat bertabrakan
    onTouch(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
        this.animation.play("fireExplode");

        if(otherCollider.tag ==1){  //Bullet bertabrakan dengan player
            let hero = this.node.getParent().getChildByName("Player").getComponent(Player);
            hero.receiveAttackFromBoss(this.damage);
        }

        this.statusCrashing = true;
        this.scheduleOnce(()=>{
            this.node.active = false;

        },0.1)
        
    } 

}


