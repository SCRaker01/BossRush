import { _decorator, Collider2D, Component, instantiate, IPhysics2DContact, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { Bullet } from './Bullet';
import { staticData } from '../other/staticData';
@ccclass('Pool')
export class Pool extends Component {
   @property({type:Prefab}) private bullet:Prefab;
    
    private FireWorm:Vec3;
    private playerPos:Vec3;
    private bulletPool: Node[] = [];
    private amountOfBullets:number;


    start(){
        this.FireWorm = this.node.getParent().getChildByName("Monster").getChildByName("FireWorm").getPosition();
        this.playerPos = this.node.getParent().getChildByName("Player").getPosition();

        //Instansiasi bullet
        this.amountOfBullets = 5;
        for(let i =0 ; i < this.amountOfBullets;i++){
            let bulletPref = instantiate(this.bullet);
            this.bulletPool.push(bulletPref);
            
            bulletPref.active = false;           
            bulletPref.getComponent(Bullet).setSpawnAndDirection(this.FireWorm,0);
            bulletPref.setParent(this.node.getParent());
        }

    }

    update(deltaTime:number){
        console.log(staticData.numberOfFireworms);
        if(staticData.numberOfFireworms>0){
            this.FireWorm = this.node.getParent().getChildByName("Monster").getChildByName("FireWorm").getPosition();

            this.playerPos = this.node.getParent().getChildByName("Player").getPosition();

        }
        
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
            bullet.getComponent(Bullet).setSpawnAndDirection(this.FireWorm,directionVal);
            bullet.getComponent(Bullet).animation.play("fireMove");
            // console.log(bullet.getComponent(Bullet).directionVal);

        }
    }

}


