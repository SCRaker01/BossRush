import { _decorator, Button, Component,director,Node,  UITransform,  Vec3 } from 'cc';
import { HealthBar } from './HealthBar';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type:Node}) camera:Node;
    @property({type:Node}) canvas:Node;
    @property({type:Node}) player:Node;
    @property({type:Node}) boss:Node;

    @property({type:HealthBar}) hb:HealthBar;
    @property({type:Node}) pScreen:Node;
    @property({type:Button}) pButton:Button;

    private playerPos:Vec3;

    onLoad(){
        this.pScreen.active = false;
        this.playerPos = this.player.getPosition();
    }
    
    update(deltaTime: number) {
        this.playerPos = this.player.getPosition();
        if(this.playerPos.x>=-1280 && this.playerPos.x<=640){
            this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));

        }
        this.pButton.node.setPosition(new Vec3(this.camera.getPosition().x,this.pButton.node.getPosition().y,0));
        this.pScreen.setPosition(new Vec3(this.camera.getPosition().x,0,0));
    
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

    }
}


