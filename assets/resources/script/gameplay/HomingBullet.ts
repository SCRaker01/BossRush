import { _decorator, CCFloat, CircleCollider2D, Collider2D, Component, Contact2DType,Animation, IPhysics2DContact, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { staticData } from '../other/staticData';
import { Boss } from './Boss';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('HomingBullet')
export class HomingBullet extends Component {
    
    
        @property({type: CCFloat})private damage:number;
        @property({type: CCFloat})private speed: number;
        private rb: RigidBody2D;    
        private collider :CircleCollider2D;
        private boss:Boss
        private yDistToPlayer:number;
        private statusCrashing:boolean;
        directionVal:number;
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
    
            if(staticData.diff_Level==2){
                this.damage *=1.5;
            }
            else if(staticData.diff_Level==3){
                this.damage *=2;
            }
            
        }
    
        //set lokasi spawn dan arah pergerakan (kanan /kiri)
        setSpawnAndDirection(pos:Vec3,direction:number){
            this.node.setPosition(pos.x+(-this.directionVal*(66)), pos.y+72);       //72 nya penyesuaian setengah ukuran boss
            this.directionVal = direction;
            this.statusCrashing = false;
        }
    
        //Menentukan jarak antara bullet dengan player
        setYDistance(yPos:number){
            this.yDistToPlayer = yPos - this.node.getPosition().y;
        }
        
        //Mengupdate kecepatan bullet agar tidak melebihi maks speed 
        onValidate(){
            let targetSpeed = this.speed -this.rb.linearVelocity.y;
            let accelRate = (Math.abs(this.yDistToPlayer)>0) ? targetSpeed : this.speed ;
            this.rb.linearVelocity.y = accelRate;
        }
    
        update(deltaTime: number) {
            this.onValidate();
    
            let hero = this.node.getParent().getChildByName("Player").getComponent(Player);
    
            //Hanya merotasi kan sprite bullet
            let dir:Vec2 = (new Vec2(hero.node.getPosition().x-this.node.getPosition().x,
                        hero.node.getPosition().y-this.node.getPosition().y))
    
            dir.normalize();
    
            let out:Vec3 = new Vec3(1,1,1);
            let rotateAmount = Vec3.cross(out,new Vec3 (dir.x,dir.y,0), new Vec3(0,1,0)).z;
    
            this.rb.angularVelocity = -rotateAmount * 200;
    
            this.node.setRotationFromEuler(new Vec3(0,45,0));
    
            //Menyesuaikan pergerakan dengan difficulty level
            if(!this.statusCrashing){
                
                this.rb.linearVelocity = new Vec2(this.speed*dir.x, this.speed*dir.y);
               
    
            } 
            
        }
    
        //Saat bertabrakan
        onTouch(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
            this.animation.play("crash");
    
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


