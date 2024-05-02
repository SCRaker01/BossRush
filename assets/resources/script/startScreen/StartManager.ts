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
        this.audio.onAudioQueue(1);
        this.resetStatic();
        this.closeInfo();
        this.closeLevelSel();
    }

    resetStatic(){
        staticData.diff_Level=null;
        staticData.isGameBeaten=null;
    }

    startGame(){
        this.audio.onAudioQueue(0);
        
        staticData.score =0;
        director.loadScene("gameplay");
    }

    //Method untuk button buka info
    openInfo(){
        this.infoScreen.active = true;
        this.audio.onAudioQueue(0);
    }
    
    //Method untuk button tutup info
    closeInfo(){
        this.infoScreen.active = false;
        this.audio.onAudioQueue(0);
    }
    
    //Method untuk buka level selection lewat start
    openLevelSel(){
        this.levelSelect.active = true;
        this.audio.onAudioQueue(0);
    }
    
    //Method untuk tutup level selection (belum diimplementasikan sebab belum diperlukan)
    closeLevelSel(){
        this.levelSelect.active = false;
        this.audio.onAudioQueue(0);
    }
    
    //Method untuk diff level mudah
    easy(){
        staticData.diff_Level = 1;
        this.startGame();
    }

    //Method untuk diff level menengah
    medium(){
        staticData.diff_Level = 2;
        this.startGame();
    }

    //Method untuk diff level sulit
    hard(){
        staticData.diff_Level = 3;
        this.startGame();
    }
}


