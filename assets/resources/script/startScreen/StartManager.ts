import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;
import { staticData } from '../other/staticData';
import { AudioManager } from '../other/AudioManager';
@ccclass('StartManager')
export class NewComponent extends Component {
    @property({type:Node}) private infoScreen:Node;
    @property({type:Node}) private levelSelect:Node;
    @property({type:AudioManager}) private audio : AudioManager;

    onLoad(){
        // director.preloadScene("gameplay");
        this.audio.onAudioQueue(1);
        this.closeInfo();
        this.closeLevelSel();
    }

    startGame(){
        this.audio.onAudioQueue(0);
        
        staticData.score =0;
        director.loadScene("gameplay");
    }

    openInfo(){
        this.infoScreen.active = true;
        this.audio.onAudioQueue(0);
    }
    
    closeInfo(){
        this.infoScreen.active = false;
        this.audio.onAudioQueue(0);
    }
    
    openLevelSel(){
        this.levelSelect.active = true;
        this.audio.onAudioQueue(0);
    }

    closeLevelSel(){
        this.levelSelect.active = false;
        this.audio.onAudioQueue(0);
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


