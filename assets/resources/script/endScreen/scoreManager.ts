import { _decorator, Component, Enum, Label, Node, Scene } from 'cc';
import { staticData } from '../other/staticData';
const { ccclass, property } = _decorator;

@ccclass('scoreManager')
export class scoreManager extends Component {
    @property({type:Label}) private stopWatchLabel:Label; 

    private score: number;
    private timer:number;
    private startStatus:boolean;
    private gameEnd:boolean;
    
    
    start() {
        this.score = staticData.score;
        this.startStatus=false;
        this.gameEnd = false;
        this.timer =0;
        // this.reset();
    }
        
    update(deltaTime: number) {
        
        if(this.startStatus&& !this.gameEnd &&this.timer++%60==0){
            this.increment();
        }
    }

    //Reset semuanya
    reset(){
        this.timer=0;
        
        if(this.stopWatchLabel.node.name == "Timer"){
            this.score=0;
        }
        this.stopWatchLabel.string = "0";
        this.startStatus = false;
        this.gameEnd = false;
    }

    //Ketika game sudah selesai, matikan timer scoremanager
    deactivateGame(){
        this.gameEnd = true;
    }

    //Nyalakan score manager
    activateTime(){
        this.startStatus = true;
    }

    //Mengembalikan start status dari timer
    getStartStatus():boolean{
        return this.startStatus;
    }

    //Naikkan score dan update label
    increment(){
        this.score++;
        staticData.score= this.score;
        this.stopWatchLabel.string = this.score+"";
    }

    //Kembalikan nilai score
    getScore(){
        return this.score;
    }
}


