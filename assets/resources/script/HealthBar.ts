import { _decorator, Component, instantiate, Node, Prefab,resources,screen, Sprite, SpriteFrame } from 'cc';
import { Player } from './Player';
import { Boss } from './Boss';
const { ccclass, property } = _decorator;

@ccclass('HealthBar')
export class HealthBar extends Component {
    @property({type:Prefab}) private heroHB:Prefab;
    @property({type:Prefab}) private enemyHB:Prefab;
    @property({type:Player}) private player:Player;
    @property({type:Boss}) private boss:Boss;

    private camNode: Node;
    private url: String;

    private hbHero:Node;
    private hbEnemy:Node;
    

    start() {
        this.camNode = this.node.getParent().getChildByName("Camera");

        this.hbHero = instantiate(this.heroHB);
        this.hbEnemy = instantiate(this.enemyHB);

        this.node.addChild(this.hbHero);
        this.node.addChild(this.hbEnemy);


        this.heroIcon();
        
    }
    
    update(deltaTime: number) {
        this.hbHero.setPosition(this.camNode.getPosition().x-screen.windowSize.x/2.75, this.camNode.getPosition().y+screen.windowSize.y/2.75);
        if(this.hbEnemy.active) {
            this.hbEnemy.setPosition(this.camNode.getPosition().x+screen.windowSize.x/2.75, this.camNode.getPosition().y+screen.windowSize.y/2.75);
            
        }

    }

    heroIcon(){
        let heroUrl = this.url+ "/con23";
        
        resources.load("sprite/other/avatar/PNG/Background/con1/spriteFrame", SpriteFrame, null, (err:any, spriteFrame)=> {
            let sprite:Sprite = this.hbHero.getChildByName("Icon").getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
        });
    }
    
    updateHeroHealth(){
        
    }
    
}


