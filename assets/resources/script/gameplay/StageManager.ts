import { _decorator, BoxCollider2D, Button, Component, director, Label, Node, Vec3 } from 'cc';
import { scoreManager } from '../endScreen/scoreManager';
import { AudioManager } from '../other/AudioManager';
import { staticData } from '../other/staticData';
import { Boss } from './Boss';
import { HealthBar } from './HealthBar';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('StageManager')
export class StageManager extends Component {
    @property({type:Node}) camera:Node;
    @property({type:Node}) canvas:Node;
    @property({type:Node}) player:Node;

    @property({type:Node}) movementInfo:Node;

    @property({type:HealthBar}) hb:HealthBar;
    @property({type:Node}) pScreen:Node;
    @property({type:Button}) pButton:Button;
    @property({type:Label}) private stopWatchLabel:Label;
    @property({type:scoreManager}) private sManager:scoreManager;
    @property({type:AudioManager}) private audio :AudioManager;

    private playerPos:Vec3;
    private bossComp: Boss;
    private playerComp: Player;
  

    onLoad(){
        
        director.preloadScene("startScreen");
        this.pScreen.active = false;
        this.playerPos = this.player.getPosition();

        this.playerComp = this.player.getComponent(Player);
        this.movementInfo.active = true;

        if(staticData.diff_Level == 2){
            this.bossComp.setMultiplier(1.5);
        }
        else if (staticData.diff_Level ==3){
            this.bossComp.setMultiplier(2);
        }
        // director.preloadScene("endScreen");
        this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));

      
    }
    
    update(deltaTime: number) {
        this.playerPos = this.player.getPosition();

        
        //Camera mengikuti pergerakan player dalam batas yang ditentukan
        if( this.playerPos.x>=-2000 && this.playerPos.x<=640){
            this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));
            this.movementInfo.setPosition(new Vec3(this.playerPos.x, this.movementInfo.getPosition().y,0))
            
        }
        
        //Memposisikan lokasi UI pada screen
        this.pButton.node.setPosition(new Vec3(this.camera.getPosition().x,this.pButton.node.getPosition().y,0));
        this.pScreen.setPosition(new Vec3(this.camera.getPosition().x,0,0));
        this.stopWatchLabel.node.setPosition(new Vec3(this.camera.getPosition().x,this.stopWatchLabel.node.getPosition().y,0));
       
        if(!this.sManager.getStartStatus() && this.playerPos.x>-635){
            this.stageStart();
        }

        if(this.playerComp.isDead()){
            this.stageEndPlayer();
        }
    }

    //Mulai stage
    stageStart(){
        this.movementInfo.active = false;
        this.sManager.activateTime();
        this.bossComp.activateBoss();

        this.audio.onAudioQueue(4);
    }

    //Akhiri stage saat boss mati

    //Akhiri stage saat player mati
    stageEndPlayer(){
        this.sManager.deactivateGame();
        staticData.isGameBeaten = false;
        this.scheduleOnce(()=>{
            director.loadScene("endScreen");
        },1);
    }

    //Pause
    pause(){
        this.audio.onAudioQueue(1);
        director.pause();
        this.pScreen.active = true;
        this.movementInfo.active = false;
    }
    
    //Lanjutkan game / unpause
    continue(){
        this.audio.onAudioQueue(1);
        director.resume();
        this.pScreen.active = false;
    }
    
    //Kembali ke start screen
    exitToStart(){
        this.audio.onAudioQueue(1);
        director.resume();
        director.loadScene("startScreen");
    }
}


