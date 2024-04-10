import { _decorator, Collider2D, Component, instantiate, IPhysics2DContact, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { Bullet } from './Bullet';
@ccclass('Pool')
export class Pool extends Component {
   @property({type:Prefab}) private bullet:Prefab;
    
    private bosPos:Vec3;
    private bulletPool: Node[] = [];
    private amountOfBullets:number;


    start(){
        this.bosPos = this.node.getParent().getChildByName("Boss").getPosition();
        this.amountOfBullets = 5;
        for(let i =0 ; i < this.amountOfBullets;i++){
            let bulletPref = instantiate(this.bullet);
            this.bulletPool.push(bulletPref);
            
            bulletPref.active = false;           
            bulletPref.getComponent(Bullet).setSpawnAndDirection(this.bosPos,0);
            bulletPref.setParent(this.node.getParent());
        }

    }

    update(deltaTime:number){
        this.bosPos = this.node.getParent().getChildByName("Boss").getPosition();
    }

    
  
    getPooledObject():Node{
        for (let i = 0 ; i < this.bulletPool.length;i++){
            
            if(!this.bulletPool[i].activeInHierarchy){
                // console.log(this.bulletPool.length);
                // this.bulletPool[i].active = true;
                
                return this.bulletPool[i];
            }
        }
        return null;
    }

    shoot(directionVal: number){
        let bullet = this.getPooledObject();
        if(bullet!=null){
            bullet.active = true;
            bullet.getComponent(Bullet).setSpawnAndDirection(this.bosPos,directionVal);
            bullet.getComponent(Bullet).animation.play("fly");
            console.log(bullet.getComponent(Bullet).directionVal);

        }
    }

}


