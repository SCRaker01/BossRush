import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Button')
export class NewComponent extends Component {
    @property({type:Node}) private infoScreen:Node;

    onLoad(){
        director.preloadScene("gameplay");
        this.closeInfo();
    }
    startGame(){
        director.loadScene("gameplay");
    }

    openInfo(){
        this.infoScreen.active = true;
    }

    closeInfo(){
        this.infoScreen.active = false;
    }
}


