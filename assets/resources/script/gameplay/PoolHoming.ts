import { _decorator, Collider2D, Component, instantiate, IPhysics2DContact, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { HomingBullet } from './HomingBullet';
@ccclass('PoolHoming')
export class PoolHoming extends Component {
   @property({type:Prefab}) private bullet:Prefab;
    
    private bosPos:Vec3;
    private playerPos:Vec3;
    private bulletPool: Node[] = [];
    private amountOfBullets:number;
    private yDistToPlayer:number;

    start(){
        this.bosPos = this.node.getParent().getChildByName("Boss").getPosition();
        this.playerPos = this.node.getParent().getChildByName("Player").getPosition();

        //Instansiasi bullet
        this.amountOfBullets = 5;
        for(let i =0 ; i < this.amountOfBullets;i++){
            let bulletPref = instantiate(this.bullet);
            this.bulletPool.push(bulletPref);
            
            bulletPref.active = false;           
            bulletPref.getComponent(HomingBullet).setSpawnAndDirection(this.bosPos,0);
            bulletPref.setParent(this.node.getParent());
        }

    }

    update(deltaTime:number){
        this.bosPos = this.node.getParent().getChildByName("Boss").getPosition();
        this.playerPos = this.node.getParent().getChildByName("Player").getPosition();
    }
    setYDistance(yPos:number){
        this.yDistToPlayer = yPos - this.node.getPosition().y;
    }

    //Method pengambilan bullet
    getPooledObject():Node{
        for (let i = 0 ; i < this.bulletPool.length;i++){
            
            if(!this.bulletPool[i].activeInHierarchy){

                return this.bulletPool[i];
            }
        }
        return null;
    }

    //Mendapatkan bullet yang ada dan mengaktifkannya
    shoot(directionVal: number){
        let bullet = this.getPooledObject();
        if(bullet!=null){
            bullet.active = true;
            bullet.getComponent(HomingBullet).setSpawnAndDirection(this.bosPos,directionVal);
            bullet.getComponent(HomingBullet).setYDistance(this.playerPos.y);
            bullet.getComponent(HomingBullet).animation.play("fly");
          

        }
    }

}


