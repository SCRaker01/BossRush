import { _decorator, Camera, Component, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type:Node}) camera:Node;
    @property({type:Node}) player:Node;
    @property({type:Prefab}) ground:Prefab;
    @property({type:Node}) mainGround:Node;

    private leftEdge:number;
    private rightEdge:number;
    private size:number;
    private playerPos:Vec3;

    start() {

        this.leftEdge = -this.mainGround.getPosition().x/2;
        this.rightEdge = this.mainGround.getComponent(UITransform).contentSize.x/2;
        this.size = this.mainGround.getComponent(UITransform).contentSize.x/2;
        PhysicsSystem2D.instance.gravity = v2(0, -20 * PHYSICS_2D_PTM_RATIO);
        
    }
    
    instantiateGround():Node{
        return instantiate(this.ground);
    }
    
    setNewGround(posX:number){
        let ground = this.instantiateGround();
        ground.setParent(this.mainGround);
        ground.setPosition(new Vec3(posX,-340,0));
        // console.log(ground.getPosition().x);
    }
    
    update(deltaTime: number) {
        this.playerPos = this.player.getPosition();
        // console.log(this.playerPos.x)
        if(this.playerPos.x>=-1280 && this.playerPos.x<=640){
            this.camera.setPosition(new Vec3(this.player.getPosition().x, 0,0));

        }
        

        // if(this.playerPos.x>=this.rightEdge){
        //     console.log(this.rightEdge);
        //     this.setNewGround(this.rightEdge);
        //     this.rightEdge=+this.size;
        // }
        
        // if(this.playerPos.x<=this.leftEdge){
        //     console.log(this.leftEdge);
        //     this.setNewGround(this.leftEdge);
        //     this.leftEdge-=this.size;
        //     // console.log(this.leftEdge);
        // }
    
    }
}


