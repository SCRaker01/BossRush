import { _decorator, Component,Node,  UITransform,  Vec3 } from 'cc';
import { HealthBar } from './HealthBar';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type:Node}) camera:Node;
    @property({type:Node}) canvas:Node;
    @property({type:Node}) player:Node;
    @property({type:Node}) boss:Node;

    @property({type:HealthBar}) hb:HealthBar;

    private leftEdge:number;
    private rightEdge:number;
    private size:number;
    private tempSize:number;
    private playerPos:Vec3;
    private bossPos:Vec3;
    private bossSize:number;

    start() {
        this.bossSize = this.boss.getComponent(UITransform).contentSize.x/2;
        // this.size = this.camera.getComponent(UITransform).contentSize.x/2;
        this.size = this.canvas.getComponent(UITransform).contentSize.x;
        // console.log(this.size);
    }

    update(deltaTime: number) {
        this.playerPos = this.player.getPosition();
        this.bossPos = this.boss.getPosition();
        
        // this.tempSize = Math.abs()
        // this.leftEdge = this.playerPos.x- (this.size+this.bossSize);
        // this.rightEdge = this.playerPos.x+ (this.size+this.bossSize);
        // console.log(this.playerPos.x)

        if(this.playerPos.x>=-1280 && this.playerPos.x<=640){
            this.camera.setPosition(new Vec3(this.playerPos.x, 0,0));

        }
        // console.log(this.bossPos.x+" "+this.playerPos.x+" "+this.leftEdge+" "+this.rightEdge);

        // if(this.bossPos.x>this.leftEdge && this.bossPos.x<this.rightEdge){
        //     this.hb.showEnemyHB();
        //     // console.log("show")
        // }else {
        //     this.hb.hideEnemyHB();
        //     // console.log("hide")
        // }

        
    
    }
}


