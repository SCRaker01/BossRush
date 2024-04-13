import { _decorator, Component, Enum, Label, Node, Scene } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('scoreManager')
export class scoreManager extends Component {
    @property({type:Label}) private stopWatchLabel:Label; 

    private score: number;
    private timer:number;
    private startStatus:boolean;
    private gameEnd:boolean;
    
    
    start() {
        this.reset();
    }
        
    update(deltaTime: number) {
        
        if(this.startStatus&& !this.gameEnd &&this.timer++%60==0){
            this.increment();
        }
    }

    reset(){
        this.timer=0;
        // console.log(this.stopWatchLabel.node.name);
        
        if(this.stopWatchLabel.node.name == "Timer"){
            this.score=0;
        }
        this.stopWatchLabel.string = "0";
        this.startStatus = false;
        this.gameEnd = false;
    }

    deactivateGame(){
        this.gameEnd = true;
    }

    activateTime(){
        this.startStatus = true;
    }

    getTimer():boolean{
        return this.startStatus;
    }

    increment(){
        this.score++;
        this.stopWatchLabel.string = this.score+"";
    }

    getScore(){
        return this.score;
    }
}


