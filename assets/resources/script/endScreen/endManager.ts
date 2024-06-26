import { _decorator, Component, director, Label, math, Node, UIRenderer, Vec3 } from 'cc';

const { ccclass, property } = _decorator;
import { staticData } from '../other/staticData';
import { AudioManager } from '../other/AudioManager';
@ccclass('endManager')
export class endManager extends Component {
    @property({type:Label}) private bestScore:Label;
    @property({type:Label}) private currScore:Label;
    @property({type:Label}) private level:Label;

    @property({type:Node}) private groupButton;
    @property({type:Node}) private succScreen;
    @property({type:Node}) private failedScreen;
    @property({type:AudioManager}) private audio:AudioManager;
     // @property({type:scoreManager}) private scoreManager;

    onLoad(){
        director.preloadScene("gameplay");
    }

    //Multiply sesuai difficulty level
    multiplyScore(){
    
        this.scoreCalc(staticData.diff_Level);
        // if(staticData.diff_Level == 1){
        //     this.level.string = "Easy";
        //     this.level.color.set(87,241,0,255);
        // }
        if(staticData.diff_Level == 2){     
            staticData.score *=1.5;
            this.level.string = "Easy";
            this.level.color.set(87,241,0,255);
        }
        else if ( staticData.diff_Level ==3){
            staticData.score *=2;
            this.level.string = "HARD";
            this.level.color.set(138,0,0,255);
        } 
        if (staticData.score > staticData.bestScore){
            staticData.bestScore = staticData.score;
        }
        this.setScore();
    }

    //Method menghitung total score
    scoreCalc(diff_Level: number){
        let baseNumber = 100;
        staticData.score = Math.round(Math.abs(staticData.score-baseNumber)*((staticData.numOfCultistDefeated*1.5)+(staticData.numOfRatDefeated*1.2)
        +(staticData.numOfWormDefeated*1.75)+(staticData.numOfWolfDefeated*1.45))/2)
        + Math.floor((staticData.score*(Math.PI*diff_Level)));
    }

    start(){
        this.succScreen.active = false;
        this.failedScreen.active = false;
        
        if(staticData.isGameBeaten){    //Jika menang
            this.audio.onAudioQueue(2);
            this.succScreen.active = true;
            this.multiplyScore();
            this.groupButton.setPosition(new Vec3(0,-20,0));
        }else {                         //Jika kalah
            this.audio.onAudioQueue(1);
            this.failedScreen.active = true;
            this.groupButton.setPosition(new Vec3(0,60,0));
        }
    }

    //Method untuk mengulangi langsung stage dengan difficulty level yang sama
    replay(){
        this.audio.onAudioQueue(0);
        director.loadScene("stageA");
    }
    
    //Method untuk button kembalik ke start screen
    backToStart(){
        this.audio.onAudioQueue(0);
        director.loadScene("startScreen");
    }

    //Method untuk label score
    setScore(){
        this.bestScore.string = staticData.bestScore+"";
        this.currScore.string = staticData.score+"";
    }
}


