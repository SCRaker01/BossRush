import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('staticData')
export class staticData extends Component {
    static score: number;
    static diff_Level: number;
    static bestScore: number=0;
    static isGameBeaten: boolean;
}


