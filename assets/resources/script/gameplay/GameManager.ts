import { _decorator, BoxCollider2D, Button, Component,director,Label,Node,  UITransform,  Vec3,Animation } from 'cc';
import { Boss } from './Boss';
import { HealthBar } from './HealthBar';
import { scoreManager } from '../endScreen/scoreManager';
import { Player } from './Player';
import { staticData } from '../other/staticData';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type:Node}) camera:Node;
    @property({type:Node}) canvas:Node;
    @property({type:Node}) player:Node;
    @property({type:Node}) boss:Node;
    @property({type:Node}) door:Node;

    @property({type:HealthBar}) hb:HealthBar;
    @property({type:Node}) pScreen:Node;
    @property({type:Button}) pButton:Button;
    @property({type:Label}) private stopWatchLabel:Label;
    @property({type:scoreManager}) private sManager:scoreManager;

    private playerPos:Vec3;
    private bossComp: Boss;
    private playerComp: Player;

    onLoad(){
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
        // director.preloadScene("endScreen");
        this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));
    }
    
    update(deltaTime: number) {
        this.playerPos = this.player.getPosition();

        
        if(this.playerPos.x>=-1280 && this.playerPos.x<=640){
            this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));
            
        }
        
        this.pButton.node.setPosition(new Vec3(this.camera.getPosition().x,this.pButton.node.getPosition().y,0));
        this.pScreen.setPosition(new Vec3(this.camera.getPosition().x,0,0));
        this.stopWatchLabel.node.setPosition(new Vec3(this.camera.getPosition().x,this.stopWatchLabel.node.getPosition().y,0));
       
        // console.log(this.playerPos.x)

        if(!this.sManager.getTimer() && this.playerPos.x>-635){
            this.sManager.activateTime();
            this.bossComp.activateBoss();
            this.door.getComponent(BoxCollider2D).enabled = true;
            this.door.getComponent(Animation).play("doorOpen");
        }

        if(this.bossComp.isDead()){
            this.sManager.deactivateGame();
            staticData.score = this.sManager.getScore();
            staticData.isGameBeaten = true;
            this.pButton.node.active = false;
            director.loadScene("endScreen");
        }
        
        if(this.playerComp.isDead()){
            this.sManager.deactivateGame();
            staticData.isGameBeaten = false;
            director.loadScene("endScreen");
        }
    }

    pause(){
        director.pause();
        this.pScreen.active = true;
    }

    continue(){
        director.resume();
        this.pScreen.active = false;
    }

    exitToStart(){
        director.loadScene("startScreen");
    }
}


