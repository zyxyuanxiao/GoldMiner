/*
*  录音已经处理过的数据
*/
class ProcessedSound{
    /// <summary>
    /// 处理过的数据
    /// </summary>
    public  Data:Int16Array;
    /// <summary>
    /// 已经处理完成声音数据的指针 
    /// </summary>
    public  Length:number;


    public  TalkFrames:Float32Array;
    public  TalkFramesLength:number;

    public readonly  Channels:number;
    public readonly  SampleRate:number;
    public readonly  TalkFramesPerSecond:number;

    private processBlob:Blob = null;
    public  blobUrl:string = "";
    public duration:number = 0;

    constructor(listenAndRepeatSettings:TalkBackSettings){
            let maxDataLen:number = listenAndRepeatSettings.SampleRate * listenAndRepeatSettings.MaxRecordingTime * 2;
            let maxTalkFrames:number = Math.round(listenAndRepeatSettings.MaxRecordingTime * listenAndRepeatSettings.TalkFramesPerSecond) + 1;

            this.Data = new Int16Array(maxDataLen);
            this.Length = 0;

            this.TalkFrames = new Float32Array(maxTalkFrames);
            this.TalkFramesLength = 0;

            this.SampleRate = listenAndRepeatSettings.SampleRate;
            this.TalkFramesPerSecond = listenAndRepeatSettings.TalkFramesPerSecond;
            this.Channels = listenAndRepeatSettings.MicrophoneChannels;
    }


    public  CopyTo( processedSound:ProcessedSound):void {
        if (processedSound.Channels != this.Channels)
            throw new Error("InvalidOperationException Can't copy!");
        if (processedSound.SampleRate != this.SampleRate)
            throw new Error("InvalidOperationException Can't copy!");
        if (processedSound.TalkFramesPerSecond != this.TalkFramesPerSecond)
            throw new Error("InvalidOperationException Can't copy!");
        if (processedSound.Data.length != this.Data.length)
            throw new Error("InvalidOperationException Can't copy!");
        if (processedSound.TalkFrames.length != this.TalkFrames.length)
            throw new Error("InvalidOperationException Can't copy!");

        processedSound.Length = this.Length;
        processedSound.TalkFramesLength = this.TalkFramesLength;
        Utility.ArrayCopy1(this.Data, processedSound.Data, this.Data.length);
        Utility.ArrayCopy1(this.TalkFrames, processedSound.TalkFrames, this.TalkFrames.length);
        processedSound.blobUrl = this.blobUrl;
        processedSound.duration = this.duration;
    }

    public  ResetAndClear():void {
        Utility.ArrayClear(this.TalkFrames, 0, this.TalkFrames.length,0.0);
        Utility.ArrayClear(this.Data, 0, this.Data.length,0);
        this.TalkFramesLength = 0;
        this.Length = 0;
        //TODO
        // public processBlob:Blob;
        // public blobUrl:string;
    }

    //public float TalkFrame(float time) {
    public  TalkFrame( time:number):number {
        let pos = Math.round(time / Utility.FloatToInt(this.SampleRate / this.TalkFramesPerSecond));
        if (pos >= this.TalkFrames.length) {
            pos = this.TalkFrames.length - 1;
        }
        return this.TalkFrames[pos];
    }

    public CreateSoundUrl(_blob:Blob,_during:number):void{
        this.processBlob = _blob;
        this.duration = _during;
        this.blobUrl = Laya.Browser.window.URL.createObjectURL(_blob);  
    }
}