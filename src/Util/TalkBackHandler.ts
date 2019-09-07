class TalkFrame {
    public Frequency:number;
    public Volume:number;
    public StartTime:number;
    public EndTime:number;
}

class TalkBackHandler extends Laya.Script {
    private static Tag:string = "TalkBackHandler";
    public TalkFrames:List<TalkFrame> = new List<TalkFrame>();//50count
    public mTalkBackSettings: TalkBackSettings;
    // public mMicrophoneHandler:MicrophoneHandler;
    //public AudioMixerGroup:TalkBackMixerGroup;//声音混合器，引擎内置

    public  CallbackRecordingStarted:Laya.Handler = null;
    public  CallbackRecordingStopped:Laya.Handler = null;  //float
    public  CallbackTalkingStopped:Laya.Handler = null;   //bool
    public  CallbackTalk:Laya.Handler = null;   //float


    private AudioSource:Laya.WebAudioSound;  //?????

    private ProcessedSound:ProcessedSound;
    private Playing:boolean;
    private isSoundPlaying:boolean = false;
    private playTalkTime :number = 0;   //当前播放的采样点


    public Listening:boolean;
    private soundChanel:Laya.SoundChannel = null;

    public CanTalk:boolean = false;

    private recordTime:number = 0;
    private isRecording:boolean = false;

    public get Talking():boolean {
        return this.isSoundPlaying;
    }

    public get Length():number {
        //TODO
        //return this.AudioSource.clip != null ? this.AudioSource.clip.length : 0.0;
        return 0.0;
    }

    public get TalkPosition() {
        //TODO
            if (!this.Talking) {
                return 0;
            }
            return 0;
            //return this.ProcessedSound.TalkFrame(this.AudioSource.timeSamples);
    }

    public get Mute() {
        //donothing
        return false;
    }

    public set Mute(value:boolean)
    {
        //donothing
        //this.AudioSource.mute = mute;
    }

    // public OnApplicationPause(paused:boolean) {
    //     if (paused) {
    //         this.Stop();
    //     }
    // }
    constructor()
    {
        super();
        this.mTalkBackSettings = new TalkBackSettings();
        // 初始化微信录音
        WeChatRecorderManager.Instance.InitRecord();
    }

    public Init() {
        // JK.console.log("========TalkBackHandler.Init==============");
        // this.AudioSource = this.owner.AddComponent<AudioSource>();
        // AudioSource.playOnAwake = false;
        // AudioSource.outputAudioMixerGroup = TalkBackMixerGroup;


        // this.mMicrophoneHandler =  this.owner.addComponent(MicrophoneHandler) as MicrophoneHandler;
        // this.ProcessedSound = new ProcessedSound(this.mTalkBackSettings);
        // this.mMicrophoneHandler.OnRecordingStarted =  Laya.Handler.create(this,this.RecordingStarted,null,false); //this.RecordingStarted;
        // this.mMicrophoneHandler.Init();
    }

    OnDisable() {
        this.StopListening();
        this.StopRepeating(true);
    }

    _start(){

    }



    public Stop() {
        this.StopListening();
        this.StopRepeating(false);
    }


    public  GetTalkFrame(offset:number):TalkFrame {
        // 在PCM取样的播放位置。 AudioSource.timeSamples 声音样本播放的时间地方
        // 这里没有那么精准，直接update 累加dealTime
        // let time:number = this.Talking ? 0 /  this.ProcessedSound.SampleRate : 0.0;
        let time:number = this.playTalkTime;
        time += offset;
        for (let i = 0; i < this.TalkFrames.Count; ++i) {
            let talkFrame:TalkFrame = this.TalkFrames[i];
            if (time >= talkFrame.StartTime && time < talkFrame.EndTime) {
                return talkFrame;
            }
        }
    }

    //audioData:number[]
    private  CalculateZeroCrossingFrequency(sampleRate:number, audioData:Int16Array, start:number, end:number):number{
        let numSamples:number = end - start;
        let numCrossing:number = 0;
        for (let p = start; p < end - 1; p++) {
            if ((audioData[p] > 0 && audioData[p + 1] <= 0) ||
                (audioData[p] < 0 && audioData[p + 1] >= 0)) {
                numCrossing++;
            }
        }

        let numSecondsRecorded:number =  numSamples /  sampleRate;
        let numCycles:number = numCrossing / 2;
        let frequency:number = numCycles / numSecondsRecorded;
        return frequency;
    }

    private BuildTalkFrames() {
        this.TalkFrames.Clear();
        let previousFrequency :number= -1.0;
        let frameIndex:number = 0;
        let frameVolume:number = -1.0;
        for (let i = 0; i < this.ProcessedSound.TalkFramesLength - 1; ++i) {
            let volume:number = this.ProcessedSound.TalkFrames[i];
            let start:number = Utility.FloatToInt(i * (this.ProcessedSound.SampleRate / this.ProcessedSound.TalkFramesPerSecond));
            let end:number = (i + 1) * (this.ProcessedSound.SampleRate / this.ProcessedSound.TalkFramesPerSecond);
            let frequency:number = this.CalculateZeroCrossingFrequency(this.ProcessedSound.SampleRate, this.ProcessedSound.Data, start, end);
            frameVolume = Mathf.Max(volume, frameVolume);
            if (previousFrequency > 0 && frameVolume > this.mTalkBackSettings.MinTalkFrameVolume && (i - frameIndex) > 5 && (Mathf.Abs(previousFrequency - frequency) > this.mTalkBackSettings.TalkFrameFrequencyThreshold || i == this.ProcessedSound.TalkFramesLength - 2)) {
                let talkFrame:TalkFrame = new TalkFrame();
                talkFrame.Frequency = frequency;
                talkFrame.Volume = frameVolume;
                talkFrame.StartTime = frameIndex / this.ProcessedSound.TalkFramesPerSecond;
                talkFrame.EndTime =  i /  this.ProcessedSound.TalkFramesPerSecond;
                this.TalkFrames.Add(talkFrame);
                frameIndex = i;
                frameVolume = -1.0;
            }
            previousFrequency = frequency;
        }
    }


    private OnConvertingDone(processedSound:ProcessedSound) {
        console.log(processedSound);
        this.Listening = false;
        this.CanTalk = true;

        processedSound.CopyTo(this.ProcessedSound);

        // AudioClip ac = AudioClip.Create("Recorded sample", ProcessedSound.Length, ProcessedSound.Channels, TalkBackSettings.SampleRate, false);
        // ac.SetData(ProcessedSound.Data, 0);

        // AudioSource.clip = ac;

        //  --> StartTalking
        if (this.CallbackRecordingStopped != null) {
            // CallbackRecordingStopped(ac.length);
            this.CallbackRecordingStopped.runWith(0);
        }

        this.BuildTalkFrames();

        // let mmmTalkFrames:List<TalkFrame> =this.TalkFrames;
        // let i:number = 0;
    }

    TryStartListening() {
        // if (this.mMicrophoneHandler && this.mMicrophoneHandler.MicrophoneState != MicState.Idle) {
        //     return;
        // }
        // //MainUiController.Instance.OnMouseMessage(this.mMicrophoneHandler.frameCnt+"TryStartListening 当前状态  ="+this.mMicrophoneHandler.MicrophoneState);
        // this.mMicrophoneHandler.AcquireMicrophone();
        // this.mMicrophoneHandler.OnConvertingDone = Laya.Handler.create(this,this.OnConvertingDone,null,false);

        this.CanTalk = false;
    }

    StopListening() {
        this.Listening = false;

        // if (this.mMicrophoneHandler) {
        //      this.mMicrophoneHandler.ReleaseMicrophone();
        //      this.mMicrophoneHandler.OnConvertingDone = null;
        // }

    }

    StopRepeating(interrupted:boolean) {
        if (this.soundChanel != null) {
            this.soundChanel.stop();
        }

        this.CanTalk = false;

        if (this.Playing) {
            this.TalkingStopped(interrupted);
        }
    }

    PlayRecordedSound() {
        this.Listening = false;
        this.CanTalk = false;

        if (this.soundChanel) {
             this.soundChanel.stop();
             this.soundChanel.loops = 1;
        }

        this.soundChanel  = Laya.SoundManager.playSound(this.ProcessedSound.blobUrl,1,Laya.Handler.create(this,this.SoundPlayCompele),0);
        this.isSoundPlaying = true;
        this.Playing = true;
        this.playTalkTime = 0;

        this.UpdateTalkFrame(); //TODO
    }

    SoundPlayCompele(){
        this.isSoundPlaying = false;
        this.TalkingStoppedZero();
    }

    _update(state: Laya.RenderState){
        super._update(state);
        //兼容微信
        if (WeChatRecorderManager.Instance.IsSupportWeChat) {
            if (this.isRecording) {
                 this.recordTime  += Laya.timer.delta;
            }

            if ( this.isSoundPlaying) {
                this.recordTime  -= Laya.timer.delta;
                  if (this.CallbackTalk != null) {
                        // JK.console.log("**  ="+ 0.5*(Math.sin(0.012 * Math.PI *this.recordTime) + 1));
                        this.CallbackTalk.runWith(0.15*(Math.sin(0.012 * Math.PI * this.recordTime) + 1));
                  }
                if (this.recordTime <= 0) {
                     this.isSoundPlaying = false;
                     this.TalkingStoppedZero();
                }
            }
        }else{
            if (this.Playing) {
                if (this.isSoundPlaying) {
                    //s = v * delt           由于SoundManager  播放完成回掉有些延迟 这里让速度便慢些播放
                    this.playTalkTime += (Laya.timer.delta  ) * (this.ProcessedSound.Length / this.ProcessedSound.duration);
                    this.UpdateTalkFrame();
                    if (this.playTalkTime >= this.ProcessedSound.Length) {
                        this.isSoundPlaying = false;
                    }
                } else {
                    this.TalkingStoppedZero();
                }
            }
        }
    }

    //T开始说话
    public StartTalking() {
        if (!this.CanTalk) {
            return;
        }
        this.CanTalk = false;
        this.PlayRecordedSound();
    }

    // 更新说话帧
    UpdateTalkFrame() {

        let talkFrame = this.ProcessedSound.TalkFrame(this.playTalkTime);
        if (this.CallbackTalk != null) {
            //MainUiController.Instance.OnMouseMessage(this.mMicrophoneHandler.frameCnt+" UpdTalkFrame,flen: "+this.ProcessedSound.TalkFramesLength+",,"+talkFrame);
            this.CallbackTalk.runWith(talkFrame);
        }
        // JK.console.log("=============UpdateTalkFrame============");
    }

    //开始录音 听动画
    RecordingStarted() {
        // JK.console.log("=============RecordingStarted============");
        this.Listening = true;

        if (this.CallbackRecordingStarted != null) {
            this.CallbackRecordingStarted.run();
        }else{
             console.log("RecordingStarted fail CallbackRecordingStarted is null");
        }
    }

    //说话结束 不中断
    TalkingStoppedZero() {
        this.TalkingStopped(false);
    }

    //说话结束（是否中断）
    TalkingStopped(interruped:boolean) {
        console.log("TalkingStopped==========");

        this.Playing = false;
        this.isSoundPlaying = false;
        this.playTalkTime = 0;
        if (this.soundChanel) {
             this.soundChanel.stop();
        }

        if (this.CallbackTalkingStopped != null) {
            this.CallbackTalkingStopped.runWith(interruped);
        }
    }

    PlayRecordedSoundWeChat(voiceUrl:string) {
        if (this.soundChanel) {
            this.soundChanel.stop();
            this.soundChanel.loops = 1;
        }

        this.soundChanel  = Laya.SoundManager.playSound(voiceUrl,1,Laya.Handler.create(this,this.SoundPlayCompele),0);
        this.isRecording = false;
        this.isSoundPlaying = true;
        this.Playing = true;
    }
}
