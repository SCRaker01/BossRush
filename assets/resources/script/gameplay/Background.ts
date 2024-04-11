import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {

    @property({type:Node}) private cam:Node;
    @property({type:Node}) private bg1:Node;
    @property({type:Node}) private bg2:Node;

    start() {
        
    }

    update(deltaTime: number) {
        // this.bg1.setPosition(new Vec3(this.cam.getPosition().x*-1, this.cam.getPosition().y,0));
        // this.bg2.setPosition(new Vec3(this.cam.getPosition().x*-1, this.cam.getPosition().y,0));
    }
}


