import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property({type:[AudioClip]}) public clips:AudioClip[] = [];
    @property({type: AudioSource}) public source:AudioSource=null;

    
    onAudioQueue(index:number){
        let clip = this.clips[index];
        this.source.volume = 0.25;
        this.source.playOneShot(clip);
        
    }
    
}


