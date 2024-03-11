import { _decorator, CCFloat, Component, EventKeyboard, Input, input, Node, SystemEvent, Vec3 } from 'cc';
import { Physics } from './Physics';
import { KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    
    @property({type:Physics}) private phy: Physics;
    private vy :number=0;
    private curPos:Vec3;
    private xMovement:number=0;
    private yMovement:number=0;
    private timer=0;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.inputMovement,this);
        this.curPos = this.node.getPosition();
    }
    timerIncre(){
        this.timer++;
    }
    update(deltaTime: number) {
        if (this.vy>-200){
            this.vy -= this.phy.gravity*deltaTime*0.5;
        }
        this.node.translate(new Vec3(0,this.vy*deltaTime,0));

        // console.log(this.phy.baseY);
        this.curPos = this.node.getPosition();
        // console.log(this.curPos.y );
    
        if(this.curPos.y <= this.phy.baseY+18) {
            this.curPos.y = this.phy.baseY+18;
        }        
        this.node.setPosition(this.curPos);
        let newPosx= this.curPos.x+(this.xMovement*10.0);
        let newPosy = this.curPos.y+(this.yMovement*10.0);
        console.log(screen.width);
        // if(this.curPos.x>=-640 && this.curPos.x<=640-44){

        this.timerIncre();
        console.log(this.curPos.x)
        // if(this.timer%60){
        if (this.yMovement>0){
            this.yMovement-=0.5;
        }
        if(this.xMovement>0){
            this.xMovement-=0.2;
        } else if(this.xMovement<0){
            this.xMovement+=0.2
        }
        
        this.node.setPosition(newPosx,newPosy,0);
            
        // }
        // }
    }

    inputMovement(event: EventKeyboard){
        
        switch(event.keyCode){
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                if(this.xMovement>-2){
                    this.xMovement--;
                }
                // this.node.setPosition(new Vec3(this.curPos.x-1,this.curPos.y,0));
                // console.log(this.curPos.x);
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                if(this.xMovement<2){
                    this.xMovement++;
                }
                // this.node.setPosition(new Vec3(this.curPos.x-1,this.curPos.y,0));
                // console.log(this.curPos.x);
                break;
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                if(this.yMovement==0){
                    this.yMovement =5 ;
                }
        }
    }
}


