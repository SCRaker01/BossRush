import { _decorator, Collider2D, Component, instantiate, IPhysics2DContact, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { Boss } from './Boss';
@ccclass('Pool')
export class Pool extends Component {
   @property({type:Prefab}) private bullet:Prefab;
    private playerPos:Vec3;
    private bulletPool: Node[] = [];

    start(){
        this.playerPos = this.node.getParent().getChildByName("Player").getPosition();

    }
    update(deltaTime: number) {
        this.node.setPosition(this.playerPos.x, this.playerPos.y);

        for (let i =0; i < this.bulletPool.length; i++){
            if (this.bulletPool[i].getPosition().x< this.playerPos.x-320 || this.bulletPool[i].getPosition().x> this.playerPos.x+320){
                // let bullet = this.bulletPool[i];
                this.bulletPool.shift();
            }
        }
    }

    
    
    instatiateBullet(){
        let bulletPref = instantiate(this.bullet);
        bulletPref.setParent(this.node);

        this.bulletPool.push(bulletPref);
    }

    onTouch(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
      
       

    } 
}


