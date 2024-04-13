import { _decorator, Acceleration, Component,  EventKeyboard,  input,  Input,  KeyCode,  PhysicsSystem2D,  RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testMovement')
export class testMovement extends Component {
    private rb: RigidBody2D;

    private directionVal:number
    private runMaxSpeed:number;
    private isFacingRight: boolean;
    private horizontal;
    
    private runAccelAmount;
    private runDeccelAmount;
    onLoad(){
        input.on(Input.EventType.KEY_DOWN,this.keyDown,this);
        input.on(Input.EventType.KEY_UP,this.keyUp,this);
    }
    start() {
        this.rb = this.node.getComponent(RigidBody2D);
        this.runMaxSpeed =50;

        this.directionVal=1;
        this.isFacingRight=true;
        this.horizontal =0;

        
        
        
    }
    
    onValidate(){
        let runAccel = 1.5;
        let runDeccel = 1.5;
    
        this.runAccelAmount = ((1/PhysicsSystem2D.instance.fixedTimeStep )* runAccel)/this.runMaxSpeed;
        this.runDeccelAmount = ((1/PhysicsSystem2D.instance.fixedTimeStep)* runDeccel)/this.runMaxSpeed;
    
        if (this.runAccelAmount>this.runMaxSpeed) runAccel = this.runMaxSpeed;
        else if (this.runAccelAmount<0.01) runAccel =0.01;
        if (this.runDeccelAmount>this.runMaxSpeed) runDeccel = this.runMaxSpeed;
        else if (this.runDeccelAmount<0.01) runDeccel =0.01;
    }

    update(deltaTime: number) {
        this.onValidate();
        let targetSpeed = this.horizontal*this.runMaxSpeed;

        let accelRate = (Math.abs(targetSpeed) > 0.01) ? this.runAccelAmount : this.runDeccelAmount;

        let speedDif = targetSpeed - this.rb.linearVelocity.x;
        // console.log(PhysicsSystem2D.instance.fixedTimeStep);
        let movement = speedDif * accelRate;
        
        // console.log(targetSpeed+" "+accelRate+" "+speedDif+" " +movement);
        this.rb.linearVelocity = new Vec2(movement* (this.rb.linearVelocity.x+
            (PhysicsSystem2D.instance.fixedTimeStep*speedDif*accelRate))/this.rb.getMass(),
                    this.rb.linearVelocity.y);
        // console.log(this.rb.getMass() );
        console.log(this.rb.linearVelocity.x);

    }

    keyDown(event : EventKeyboard){
        switch(event.keyCode){
            case KeyCode.KEY_D:
                if(!this.isFacingRight)this.flip();
                this.horizontal = 1;
                break;
            case KeyCode.KEY_A:
                if(this.isFacingRight)this.flip();
                this.horizontal =-1;
                break;
        }

    }
    keyUp(event : EventKeyboard){
        switch(event.keyCode){
            case KeyCode.KEY_D:
            case KeyCode.KEY_A:
                this.horizontal =0;
                break;
        }

    }

    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        
        this.isFacingRight = !this.isFacingRight;
        this.directionVal*=-1;
    }
}


