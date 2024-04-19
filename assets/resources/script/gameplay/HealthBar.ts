import { _decorator, Component, instantiate, Label, Node, Prefab,resources,screen, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HealthBar')
export class HealthBar extends Component {
    @property({type:Prefab}) private heroHB:Prefab;
    @property({type:Prefab}) private enemyHB:Prefab;
    
    private hbHero:Node;
    private hbBoss:Node;

    private camNode: Node;
    private url: String;

    private basePlayerHeatlh :number;
    private baseEnemyHeatlh :number;

    onLoad() {
        this.camNode = this.node.getParent().getChildByName("Camera");

        this.instatiateHeroIcon();
        this.instatiateBossIcon();
        this.restartHB();
        
    }

    update(deltaTime: number) {
        let canvSize = this.node.getParent().getComponent(UITransform).contentSize.x
        let hbHeroSize = this.hbHero.getComponent(UITransform).contentSize.x;
  
        //Lokasi health bar player
        this.node.getParent().getComponent(UITransform).contentSize.x;
        this.hbHero.setPosition(this.camNode.getPosition().x-(canvSize/2.5), 
                        this.camNode.getPosition().y+ (canvSize/2.5-hbHeroSize/1.25)-5);
                        
        //Lokasi health bar boss
        if(this.hbBoss.active) {
            this.hbBoss.setPosition(this.camNode.getPosition().x+(canvSize/2.5), 
                                    this.camNode.getPosition().y+(canvSize/2.5-hbHeroSize/1.25)-5)
        }

    }

    //Set up hero health bar dengan iconnya
    instatiateHeroIcon(){
        this.hbHero = instantiate(this.heroHB);
        resources.load("sprite/other/avatar/PNG/Background/con1/spriteFrame", SpriteFrame, null, (err:any, spriteFrame)=> {
            let sprite:Sprite = this.hbHero.getChildByName("Icon").getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
        });
        this.node.addChild(this.hbHero);
        
        
    }
    
    //Set up boss health bar dengan iconnya
    instatiateBossIcon(){
        this.hbBoss = instantiate(this.enemyHB);
        this.hbBoss.name = "EnemyHealthBar";

        resources.load("sprite/other/avatar/PNG/Background/con23/spriteFrame", SpriteFrame, null, (err:any, spriteFrame)=> {
            let sprite:Sprite = this.hbBoss.getChildByName("Icon").getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
        });
        

        let enScale = this.hbBoss.getScale();
        this.hbBoss.setScale(new Vec3(enScale.x*-1,1,1));
        this.hbBoss.getChildByName("Icon").setScale(new Vec3(this.hbBoss.getChildByName("Icon").getScale().x,1,1));
        this.hbBoss.getChildByName("Bar").setScale(new Vec3(this.hbBoss.getChildByName("Bar").getScale().x*-1,1,1));
        this.node.addChild(this.hbBoss);

        

    }

    //Reset Health bar
    restartHB(){
        this.hbHero.active = true;
        this.hideEnemyHB();
    }

    //Aktifkan health bar boss
    showEnemyHB(){
        this.hbBoss.active = true;
    }
    

    //Sembunyikan health bar boss
    hideEnemyHB(){
        this.hbBoss.active = false;

    }

    //Ubah player health dan hb nya
    setPlayerBaseHealth(baseHealth: number){
        this.basePlayerHeatlh = baseHealth;
        this.updateHeroHB(this.basePlayerHeatlh,this.basePlayerHeatlh);
    }
    
    //Ubah boss health dan hb nya
    setEnemyBaseHealth(baseHealth: number){
        this.baseEnemyHeatlh = baseHealth;
        this.updateBossHB(this.baseEnemyHeatlh,this.baseEnemyHeatlh);
    }

    //Update health bar sesuai kebutuhan
    updateHealth(name:String, currHealth:number){
        let percHealth;
        if(name=="Player"){
            percHealth = currHealth/this.basePlayerHeatlh;
            if(percHealth*100 > 0){
                this.updateHeroHB(percHealth,currHealth);
            } else{
                this.hbHero.active =false
            }
        } else if(name == "Boss"){
            percHealth = currHealth/this.baseEnemyHeatlh;
            // console.log(percHealth);
            if(percHealth*100 > 0){
                this.updateBossHB(percHealth,currHealth);
            } else{
                this.hbBoss.active =false
            }
        }
        
    }

    //Update untuk boss
    updateBossHB(percHealth:number, realHealth:number){
        let bossBar = this.hbBoss.getChildByName("Bar"); 
        bossBar.getComponent(Sprite).fillRange = percHealth;
        bossBar.getChildByName("Label").getComponent(Label).string = realHealth+"/"+this.baseEnemyHeatlh;
    }

    //Update untuk player
    updateHeroHB(percHealth:number,realHealth:number){
        let heroBar = this.hbHero.getChildByName("Bar"); 
        heroBar.getComponent(Sprite).fillRange = percHealth;
        heroBar.getChildByName("Label").getComponent(Label).string =  realHealth+"/"+this.basePlayerHeatlh;
    }


    
}


