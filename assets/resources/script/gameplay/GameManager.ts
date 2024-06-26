import { _decorator, BoxCollider2D, Button, Component,director,Label,Node,  UITransform,  Vec3,Animation } from 'cc';
import { Boss } from './Boss';
import { HealthBar } from './HealthBar';
import { scoreManager } from '../endScreen/scoreManager';
import { Player } from './Player';
import { staticData } from '../other/staticData';
import { AudioManager } from '../other/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type:Node}) camera:Node;
    @property({type:Node}) canvas:Node;
    @property({type:Node}) player:Node;
    @property({type:Node}) boss:Node;
    @property({type:Node}) door:Node;
    @property({type:Node}) movementInfo:Node;
    @property({type:Node}) Monster:Node;

    @property({type:HealthBar}) hb:HealthBar;
    @property({type:Node}) pScreen:Node;
    @property({type:Button}) pButton:Button;
    @property({type:Label}) private stopWatchLabel:Label;
    @property({type:scoreManager}) private sManager:scoreManager;
    @property({type:AudioManager}) private audio :AudioManager;
    // @property({type:Node}) private rollTimer:Node;

    private playerPos:Vec3;
    private bossComp: Boss;
    private playerComp: Player;
  

    onLoad(){
        
        // director.preloadScene("startScreen");
        this.pScreen.active = false;
        this.playerPos = this.player.getPosition();
        this.bossComp = this.boss.getComponent(Boss);
        this.playerComp = this.player.getComponent(Player);
        

        if(staticData.diff_Level == 2){
            this.bossComp.setMultiplier(1.5);
        }
        else if (staticData.diff_Level ==3){
            this.bossComp.setMultiplier(2);
        }
      
        this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));

        this.scheduleOnce(()=>{
            this.door.getComponent(BoxCollider2D).enabled = false ;
            this.door.getComponent(Animation).play("doorOpen");
            this.audio.onAudioQueue(3);
        },1)
        this.Monster.active = false;
    }

    start(){
        this.stopWatchLabel.string = staticData.score+" ";
        // this.rollTimer.active = true;
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

        if(this.bossComp.isDead()){
            this.stageEndBoss();
        }
        
        if(this.playerComp.isDead()){
            this.stageEndPlayer();
        }

        if(this.bossComp.getHealth()<this.bossComp.getMaxHealth()/3){
            this.Monster.active=true;
        }
    }

    //Mulai stage
    stageStart(){
        this.movementInfo.active = false;
        this.sManager.activateTime();
        this.bossComp.activateBoss();
        this.door.getComponent(BoxCollider2D).enabled = true;
        this.door.getComponent(Animation).play("doorClose");
        this.audio.onAudioQueue(4);
    }

    //Akhiri stage saat boss mati
    stageEndBoss(){
        this.sManager.deactivateGame();
        staticData.score = this.sManager.getScore();
        staticData.isGameBeaten = true;
        this.pButton.node.active = false;
        this.scheduleOnce(()=>{
            director.loadScene("endScreen");
        },2.5);
            
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

    activateRollTimer(){
        // this.rollTimer.active=true;
    }

    deactivateRollTimer(){
        // this.rollTimer.active = false;
    }

}


