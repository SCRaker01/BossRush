import { _decorator, CCInteger, Component, ERaycast2DType, Node, PhysicsSystem2D,Animation, Pool, RigidBody2D, UITransform, Vec2 } from 'cc';
import { HealthBar } from '../gameplay/HealthBar';
import { Player } from '../gameplay/Player';
import { AudioManager } from '../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Rat')
export class Rat extends Component {
       /*@property({type:Node})*/ private player:Node;
       @property({type:CCInteger}) private MomonHealth:number;
       @property({type:CCInteger}) private MomonDamage:number;

       @property({type:AudioManager}) private audio:AudioManager;
     
   
       private rb:RigidBody2D;
       // private circleC:CircleCollider2D;
       private monAnim:Animation;
       private curClipName:string;
       private heatlthBar:HealthBar;
       
       // private isHit:boolean;
       private isFacingRight:boolean;
       private horizontal:number;
       private speed:number;
       
       private canAttack:boolean;
       private stunDur:number;
       private attackCD:number;
   
       private directionVal:number;
       private deadStat:boolean;
       private isAttacking:boolean;
   
       onLoad(){
           this.rb = this.node.getComponent(RigidBody2D);
           this.monAnim = this.node.getComponent(Animation);
           let parentNode = this.node.getParent().getParent();

           this.player = parentNode.getChildByName("Player");
           this.stunDur = 2;                                   //Sementar waktu untuk skellHit
     
   
           this.directionVal = 1;
           this.canAttack= true;
           this.attackCD = 3;
           this.deadStat = false;
           this.isAttacking = false;


       }
   
       
       start() {
           this.horizontal = 0;
           this.speed = 7;
       }
       
       update(deltaTime: number) {
           let playerPosX = this.player.getPosition().x;
           let monPosX = this.node.getPosition().x;
           
           //Boss tidak sedang menyerang atau mati
           if(!this.deadStat && !this.isAttacking){
               if(playerPosX < monPosX) {         //Player disebelah kiri boss
                   this.horizontal = -0.5;
                   if(!this.isFacingRight) this.flip();
                   
               }
               else if (playerPosX > monPosX) {       //Player disebelah kanan boss 
                   this.horizontal = 0.5;                  
                   if(this.isFacingRight) this.flip();
                  
               }

               //Jarak antara player dan boss lebih dari ukuran sprite boss
               let distToPlayer = Vec2.distance(this.node.getPosition(), this.player.getPosition())
            //    console.log(distToPlayer)
               if(distToPlayer<300){
                   if ((Math.abs(monPosX - playerPosX) > (this.node.getComponent(UITransform).contentSize.x)+25) ){
              
                        this.playAnimation("ratMove");
                       
                        this.rb.linearVelocity = new Vec2(this.speed*this.horizontal, this.rb.linearVelocity.y);
                       
                   }else {                 //Jarak antara boss dan player cukup untuk melakukan serangan
                       
                       this.playAnimation("ratIdle");
                       
                       // Jika ketinggian player dibawah ukuran dari sprite boss
                       if (this.player.getPosition().y < 
                    this.node.getPosition().y+this.node.getComponent(UITransform).contentSize.y &&
                    this.player.getPosition().y >= this.node.getPosition().y){

                           if(this.canAttack){     //Jika ya, Serang dengan melee
                               this.attack();
                           }
                       }
                   }

               }else {
                    this.playAnimation("ratIdle");

               }
               
               
            }
   
        }

      
       //Multiplier darah dan damage sesuai difficulty level, digunakan di GameManager
       setMultiplier(mult:number){
           this.MomonDamage*=mult;
           this.MomonHealth*=mult;
       }
   
       //Method untuk memainkan animasi
       playAnimation(clipName:string){
           if(this.curClipName != clipName){
               this.monAnim.play(clipName);
               this.curClipName = clipName;
           }
       }
   
       //Method untuk menerima serangan dari player
       receiveAttackFromPlayer(damage:number){
   
           this.audio.onAudioQueue(3);
      
           this.MomonHealth-=damage;
           
           if(!this.isAttacking){
               this.monAnim.play("ratHurt");
           }
   
           if (this.isDead()) {    
               this.dead();
           }
         
       }
   
      
       //Method untuk mengecek apakah boss mati atau tidak
       isDead():boolean{
           // console.log(this.MomonHealth);
           if(this.MomonHealth<=0) {
               this.deadStat=true;
               return true;
           }
           else return false;
       }
   
       //Method yang dimainkan ketika boss mati
       dead(){
           this.audio.onAudioQueue(6);
           this.playAnimation("ratDie");
           this.scheduleOnce(()=>{
               this.node.active=false;
           },this.stunDur);
       }
   
       //Method serangan dari boss dengan menggunakan raycast
       attack(){
           this.isAttacking =true;
           
          
       
            this.playAnimation("ratAttack");
           
     
           this.canAttack = false;
           this.audio.onAudioQueue(5);
                                               // Serangan dilakukan setelah animasi selesai
           let animTimer:number = 1.1;
           this.scheduleOnce(()=>{         //Raycast
               for(let i =0 ;i< 3;i++){
                   let p1 = new Vec2(this.node.worldPosition.x-(5*this.directionVal),this.node.worldPosition.y);
                   let p2 = new Vec2(this.node.worldPosition.x+(50*this.directionVal), this.node.worldPosition.y);
                   let mask = 0xffffffff;
   
                   console.log(p2.y)
            
                   let results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.All,mask);
           
                   let hit =false;
                   if(results){
                       for (let j=0;j<results.length;j++){
                           if(results[j]!=null && results[j].collider.tag ==1) {
                               results[j].collider.getComponent(Player).receiveAttackFromBoss(this.MomonDamage);
                               hit=true;
                               break;
                           }
                       }
   
                   }
                   if(hit)break;
               }
               this.isAttacking = false;
           },animTimer/2);
           
           ///
           this.scheduleOnce(()=>{
        
               this.canAttack = true;
               
           },this.attackCD-animTimer);
           
       }
   
       //Membalikkan sprite boss dan semua yang diperlukan
       flip(){
           let scale = this.node.getScale();
           this.node.setScale(scale.x*-1, scale.y,scale.z);
           this.isFacingRight = !this.isFacingRight;
           this.directionVal*= -1;
       }
}


