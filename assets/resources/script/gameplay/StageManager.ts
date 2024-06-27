import { _decorator, BoxCollider2D, Button, Component, director, Label, Node, Scene, Vec3 } from 'cc';
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
        
      
        this.pScreen.active = false;
        this.playerPos = this.player.getPosition();

        this.playerComp = this.player.getComponent(Player);
        this.movementInfo.active = true;

        this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));
    }

    start() {
        staticData.currentStage++;
        
        if(staticData.currentStage==1){
            staticData.numberOfFireworms=2;
            director.preloadScene("stageB", ()=>{
                console.log("scene stageB has been preloaded ")
            });


        } else if (staticData.currentStage==2){
            staticData.numberOfFireworms=2;
            director.preloadScene("gameplay",()=>{
                console.log("scene Boss has been preloaded ")

            })
            
        } else if (staticData.currentStage=3){
            staticData.numberOfFireworms=2;
        }
        this.stopWatchLabel.string = staticData.score+" ";
    }
    
    update(deltaTime: number) {
        this.playerPos = this.player.getPosition();
        // console.log(director.getScene())
        
        //Camera mengikuti pergerakan player dalam batas yang ditentukan
        if( this.playerPos.x>=-2000 && this.playerPos.x<=640){
            this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));
            // this.movementInfo.setPosition(new Vec3(this.playerPos.x, this.movementInfo.getPosition().y,0))
            
        }
        
        //Memposisikan lokasi UI pada screen
        this.pButton.node.setPosition(new Vec3(this.camera.getPosition().x,this.pButton.node.getPosition().y,0));
        this.pScreen.setPosition(new Vec3(this.camera.getPosition().x,0,0));
        this.stopWatchLabel.node.setPosition(new Vec3(this.camera.getPosition().x,this.stopWatchLabel.node.getPosition().y,0));
       
        if(!this.sManager.getStartStatus()&& this.playerPos.x>-635 ){
            this.stageStart();
        }

        if(this.playerComp.isDead()){
            this.stageEndPlayer();
        }

        if(this.playerPos.x>1280){
            this.nextStage();
        }
        // console.log(staticData.currentStage)
    }

    //Mulai stage
    stageStart(){
        this.movementInfo.active = false;
        this.sManager.activateTime();

        this.audio.onAudioQueue(4);
    }

    nextStage(){

        if(staticData.currentStage==1){
            
            director.loadScene("stageB")
            
        }else {
            
            director.loadScene("gameplay")
        }
    }

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
        this.reset();
        this.audio.onAudioQueue(1);
        this.sManager.reset();
        director.resume();
        director.loadScene("startScreen");
    }

    reset(){
        staticData.score=0;
        staticData.diff_Level;
        staticData.bestScore=0;
        staticData.isGameBeaten=false;
        staticData.numberOfFireworms = 0;
        staticData.currentStage=0 ;

        staticData.numOfRatDefeated =0;
        staticData.numOfWolfDefeated =0;
        staticData.numOfWormDefeated =0;
        staticData.numOfCultistDefeated =0;
    }
}


