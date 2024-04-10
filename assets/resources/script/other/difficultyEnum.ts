import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

enum DIFFICULTY_LEVEL{
    EASY,
    MEDIUM,
    HARD
}

@ccclass('difficultyEnum')
export class difficultyEnum extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


