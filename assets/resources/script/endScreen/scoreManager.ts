import { _decorator, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('scoreManager')
export class scoreManager extends Component {
    private totalScore: number;
    private timer:number;
    private multiplier:number;
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


