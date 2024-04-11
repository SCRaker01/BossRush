import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;
import { staticData } from '../other/staticData';
@ccclass('StartManager')
export class NewComponent extends Component {
    @property({type:Node}) private infoScreen:Node;
    @property({type:Node}) private levelSelect:Node;

    onLoad(){
        director.preloadScene("gameplay");
        this.closeInfo();
        this.closeLevelSel();
    }
    startGame(){
        staticData.score =0;
        director.loadScene("gameplay");
    }

    openInfo(){
        this.infoScreen.active = true;
    }

    closeInfo(){
        this.infoScreen.active = false;
    }

    openLevelSel(){
        this.levelSelect.active = true;

    }
    closeLevelSel(){
        this.levelSelect.active = false;
    }

    easy(){
        staticData.diff_Level = 1;
        this.startGame();
    }
    medium(){
        staticData.diff_Level = 2;
        this.startGame();
    }
    hard(){
        staticData.diff_Level = 3;
        this.startGame();
    }
}


