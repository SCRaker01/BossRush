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
    
    }
}


