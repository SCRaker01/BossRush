import { _decorator, Component, director, Label, math, Node, UIRenderer } from 'cc';

const { ccclass, property } = _decorator;
import { staticData } from '../other/staticData';
@ccclass('endManager')
export class endManager extends Component {
    @property({type:Label}) private bestScore:Label;
    @property({type:Label}) private currScore:Label;
    @property({type:Label}) private level:Label;
     // @property({type:scoreManager}) private scoreManager;

    onLoad(){
        director.preloadScene("gameplay");
    }

    multiplyScore(){
        this.scoreCalc(staticData.diff_Level);
        if(staticData.diff_Level == 1){
            this.level.string = "easy";
            this.level.color.set(87,241,0,255);
        }
        else if(staticData.diff_Level == 2){     
            staticData.score *=1.5;
            this.level.string = "Medium";
            this.level.color.set(255,208,19,255);
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

    scoreCalc(diff_Level: number){
        let baseNumber = 100;
        staticData.score = (baseNumber-staticData.score) + Math.floor((staticData.score*(Math.PI*diff_Level)));
    }

    start(){
        this.multiplyScore();
    }
    replay(){
        director.loadScene("gameplay");
    }

    backToStart(){
        director.loadScene("startScreen");
    }

    setScore(){
        // this.score.string = this.scoreManager.getScore()+"";
        this.bestScore.string = staticData.bestScore+"";
        this.currScore.string = staticData.score+"";
    }
}


