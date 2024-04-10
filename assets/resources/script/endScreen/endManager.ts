import { _decorator, Component, director, Label, Node } from 'cc';
import { scoreManager } from './scoreManager';
const { ccclass, property } = _decorator;

@ccclass('endManager')
export class endManager extends Component {
    @property({type:Label}) private score;
    @property({type:scoreManager}) private scoreManager;
    onLoad(){
        director.preloadScene("gameplay");
    }
    
    replay(){
        director.loadScene("gameplay");
    }

    backToStart(){
        director.loadScene("startScreen");
    }
}


