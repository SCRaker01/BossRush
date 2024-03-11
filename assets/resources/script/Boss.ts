import { _decorator, Component, Node, Vec3 } from 'cc';
import { Physics } from './Physics';
const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Component {
    @property({type:Physics}) private phy: Physics;
    private vy :number=0;

    start() {
        
    }

    update(deltaTime: number) {
        if (this.vy>-200){
            this.vy -= this.phy.gravity*deltaTime*0.5;
        }
        this.node.translate(new Vec3(0,2*this.vy*deltaTime,0));

        let curPos = this.node.getPosition();
        
    
        if(curPos.y <= this.phy.baseY+18) {
            curPos.y = this.phy.baseY+18;
        }
        this.node.setPosition(curPos);
    }
}


