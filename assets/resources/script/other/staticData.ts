import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('staticData')
export class staticData extends Component {
    static score: number=0;
    static diff_Level: number;
    static bestScore: number=0;
    static isGameBeaten: boolean;
    static numberOfFireworms :number = 0;
    static currentStage : number;

    static numOfRatDefeated:number =0;
    static numOfWolfDefeated:number =0;
    static numOfWormDefeated:number =0;
    static numOfCultistDefeated:number =0;

    
}


