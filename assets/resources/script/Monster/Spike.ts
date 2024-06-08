import { _decorator, BoxCollider2D, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { Player } from '../gameplay/Player';
const { ccclass, property } = _decorator;

@ccclass('Spike')
export class Spike extends Component {

    @property({type:CCInteger}) private damage:number;
    private boxCollider:BoxCollider2D;

    start() {
        this.boxCollider = this.node.getComponent(BoxCollider2D);
        this.boxCollider.on(Contact2DType.BEGIN_CONTACT,this.onBoxCollider,this);
    }

    onBoxCollider(selfCollider: Collider2D, otherCollider: Collider2D, contact : IPhysics2DContact|null){
        console.log(otherCollider.tag)
        if(otherCollider.tag==90){               
            otherCollider.getComponent(Player).receiveAttackFromBoss(this.damage);
        }
    }
    
}


