import { _decorator, Component, Node, Prefab, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    
    private rb: RigidBody2D;    
    private speed: number;
    private directionVal:number;
    start(){
        this.rb = this.node.getComponent(RigidBody2D);
        this.directionVal=1;
    }

    spawnDir(directionVal:number){
        this.directionVal = directionVal;
    }

    update(deltaTime: number) {
        this.rb.linearVelocity = new Vec2(this.speed*this.directionVal, 0);
    }

    

}


