import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Physics')
export class Physics extends Component {
    @property({type: CCFloat}) gravity:number;
    @property({type: Node}) ground:Node;
    

    public baseY :number;
   
}


