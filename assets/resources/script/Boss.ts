import { _decorator, CircleCollider2D, Component, Node, RigidBody2D, UITransform, Vec2, Vec3, Animation } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Component {

    @property({type:Node}) private player:Node;

    private rb:RigidBody2D;
    private circleC:CircleCollider2D;
    private horizontal:number;
    private speed:number;
    private isJumping:boolean;
    private collider;
    private isFacingRight;
    private bossAnim:Animation;
    private curClipName:string;

    onLoad(){
        this.rb = this.node.getComponent(RigidBody2D);
        this.circleC = this.node.getComponent(CircleCollider2D);
        this.bossAnim = this.node.getComponent(Animation);
        this.curClipName = this.bossAnim.defaultClip.toString();

    }

    start() {
        this.horizontal = 0;
        this.speed = 4;
    }

    update(deltaTime: number) {
        let playerPosX = this.player.getPosition().x;
        let bossPosX = this.node.getPosition().x;
        console.log(this.circleC.tag)
        if (Math.abs(bossPosX - playerPosX)
                > (this.node.getComponent(UITransform).contentSize.x/2)-1){
            
            if(playerPosX < bossPosX) {
                this.horizontal = -0.5;
                if(!this.isFacingRight) this.flip();
                // this.flip();
            }
            else if (playerPosX > bossPosX) {
                this.horizontal = 0.5;
                if(this.isFacingRight) this.flip();
                // this.flip();
            }
            this.playAnimation("skellWalk");

            this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
            // console.log(Math.abs(bossPosX - playerPosX));
        }else {
            this.playAnimation("skellIdle");
        }
        

    }
    playAnimation(clipName:string){
        if(this.curClipName != clipName){
            this.bossAnim.play(clipName);
            this.curClipName = clipName;
        }
    }

    receiveAttackFromPlayer(){

    }

    knockback(){
        // this.rb.linearVelocity = new Vec2(this.speed*this.horizontal*0.5, this.rb.linearVelocity.y*0.5);
    }

    flip(){
        let scale = this.node.getScale();
        this.node.setScale(scale.x*-1, scale.y,scale.z);
        this.isFacingRight = !this.isFacingRight;
    }
}


