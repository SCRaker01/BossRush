import { _decorator, CCFloat, Component, EventKeyboard, Input, input, Node, RigidBody2D, SystemEvent, Vec2, Vec3 } from 'cc';
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

    private rb:RigidBody2D;
    private isMovingRight:boolean = false;
    private isMovingLeft:boolean = false;
    private isMovingY:boolean = false;
    private doubleJump:boolean = false;

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.inputMovement,this);
        input.on(Input.EventType.KEY_UP, this.cancelMovement,this);
        this.rb = this.getComponent(RigidBody2D);
        this.curPos = this.node.getPosition();
    }

    update(deltaTime: number) {

        
        if (this.vy>-800){
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
        // console.log(screen.width);
        // if(this.curPos.x>=-640 && this.curPos.x<=640-44){


        if(this.isMovingRight ||this.isMovingLeft){
            this.node.setPosition(newPosx,newPosy,0);
        }

        if(this.isMovingY||this.isGrounded()){
            // if(this.doubleJump){
                this.node.setPosition(newPosx,newPosy,0);
            //     // console.log(this.doubleJump)
            // }   
            // this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, this.rb.linearVelocity.y*0.5);
            // console.log(this.rb.linearVelocity);
        }
        
    }

    isGrounded():boolean{
        return (this.curPos.y-this.phy.baseY)<1;
    }
    
    cancelMovement(event:EventKeyboard){
        switch(event.keyCode){
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                this.xMovement = 0;
                this.isMovingLeft = false;
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                this.xMovement = 0;
                this.isMovingRight = false;
                break;
                
        }

    }

    inputMovement(event: EventKeyboard){    
        switch(event.keyCode){
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_A:
                this.xMovement = -1;
                this.isMovingLeft = true;
      
                break;
            case KeyCode.ARROW_RIGHT:
            case KeyCode.KEY_D:
                this.xMovement = 1;
                this.isMovingRight = true;
                break;
            case KeyCode.SPACE:
            case KeyCode.KEY_W:
                
                // this.yMovement = 3;
                this.isMovingY = true;
              
                break;
        }
    }

    jump(){

    }
}


