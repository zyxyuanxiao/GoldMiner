// extends Laya.Script

class TalkBackSettings {   
    protected readonly  maxFloatInt:number = 32767;    
    //tom 录音最短时间
    public MinRecordingTime:number = 5;  
    //tom 录音最长时间
    public MaxRecordingTime:number = 15;  //15

    public  MicrophoneRecordingStartDelay:number = 0.1;
    public  MicrophoneChannels:number = 1;

    public  TalkFramesPerSecond:number = 15;
    public  TalkFrameFrequencyThreshold:number = 150.0;
    public  MinTalkFrameVolume:number = 0.01;
    //音频调节相关
    public SoundTouchPitch:number  = 6; //变调
    public SoundTouchRate:number = 15;   //变速 & 变速
    private SoundTouchTempoValue:number = 0.0;  //变速

    // public SoundTouchPitch:number  = 0; //变调
    // public SoundTouchRate:number = 0;   //变速 & 变速
    // private SoundTouchTempoValue:number = 0.0;  //变速

    public  ListenAverageFramesCount:number = 5; //平均帧数
    public  ListenStartRecordingFactor:number = 50.0 / this.maxFloatInt;
    public  ListenStopMaxSilenceChunks:number = 5;
    public  ListenNormalizationFactor:number = 25000.0 / this.maxFloatInt;
    public  ListenNoiseLimit:number = 900 / this.maxFloatInt;

    //判断开启录音和停止录音相关的参数
    public  ListenSilenceStartFactor:number = 1.3;
    public  ListenSilenceEndFactor:number = 1.2;
    public  ListenSilenceEnviromentAbsDeltaStart:number = 2000.0 / this.maxFloatInt;
    public  ListenSilenceEnviromentAbsDeltaEnd:number = 1000.0 / this.maxFloatInt;
    public  TalkFrameBins:number = 32;

    private mSampleRate:number = 16000;

    public SoundTouchMaxSamplesToProcess:number = 4096;  //Sonic 最大处理数量

    public  ListenEndCutoff :number= 0.0;
    public ListenEndFadeout:number = 0.0;
    constructor(){
        // super();
        // this.ListenSilenceEnviromentAbsDeltaStart = 2000.0 / this.maxFloatInt; //0.061037
        // this.ListenSilenceEnviromentAbsDeltaEnd = 1000.0 / this.maxFloatInt;   //0.030518
    }

    //======================get/set============================
    public get SoundTouchTempo():number{
        //TODO // if sleepy repeat slowly  
        return this.SoundTouchTempoValue;
    }
    
    public get SampleRate():number{      
        return 0;
        // return this.mSampleRate;
        //return jinkejoy.MicphoneRecord.GetInstance({}).GetDeviceSamepleRate();
    }

    public  get ListeningEnabled():boolean {
        //TOOD
        return true;
    }
    
}