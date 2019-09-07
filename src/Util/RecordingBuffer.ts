/*
* name;
*/
class RecordingBuffer{
    public  mProcessedSound:ProcessedSound;

    public  mRunning:boolean = false;

    //采样指针（Samples 中最大记录数量）
    private SamplesCaptured:number;
    private ProcessedSamplesCaptured:number = 0;
    //未处理的buffer
    private Samples:Float32Array;

    private  AudioBufferAvgSampleValue:number = 0;
    //采样频率
    private readonly SampleRate:number;
    // 最小采样数量
    private readonly MinSilenceSamples:number = 0;
    // 最大采样数量
    private readonly MaxSamplesToCapture:number = 0;
    private readonly SamplesChunkSilence:Array<boolean>;
    private  SamplesChunkIndex:number = 0;

    /// <summary>
    /// 数据是否收集完成
    /// </summary>
    private   DoneCollectingData:boolean = false;  

    private readonly  AudioBufferLastFramesMax:Float32Array;
    private  AudioBufferSize:number = 0;
    private readonly mTalkBackSettings:TalkBackSettings;

      // processed data
    private AudioBufferMaxSampleValue:number = 0;
    // frame analyse
    private  DataAnalyseIndex:number = 0;
    private readonly  BatchSize :number;
    private FirstRun:boolean = true;
    // 音频处理
    private mSoundSonic:Sonic;

    constructor(talkbackSetting:TalkBackSettings){
        this.mTalkBackSettings = talkbackSetting;
        this.SampleRate = talkbackSetting.SampleRate;

        this.MaxSamplesToCapture = this.SampleRate * talkbackSetting.MaxRecordingTime;
        this.MinSilenceSamples = Math.round(talkbackSetting.MicrophoneRecordingStartDelay * talkbackSetting.SampleRate);   // 采样最小数量

        this.Samples = new Float32Array(this.MaxSamplesToCapture);
        this.SamplesCaptured = 0;
        this.AudioBufferLastFramesMax = new Float32Array(this.mTalkBackSettings.ListenAverageFramesCount);  //平均听的帧数 5个

        this.BatchSize = Math.ceil(this.SampleRate / this.mTalkBackSettings.TalkFramesPerSecond); //  1秒15帧，，16000/15 = 1066  每帧数据
        this.mProcessedSound = new ProcessedSound(talkbackSetting);

        this.mSoundSonic = new Sonic( this.SampleRate,talkbackSetting.MicrophoneChannels);        
        
        this.SamplesChunkSilence =   new Array(this.MaxSamplesToCapture / this.MinSilenceSamples); // 样本静音块     16000*15 / 16000 * 0.1
        
    }

    /**
     * 是否可以可以分析采样
     */
    public get EnoughtSamplesForSilenceDetection():boolean{
          return this.SamplesCaptured > this.MinSilenceSamples;
    }

    /**
     * 是否采样数量满
     */
    public get FullSamplesFortoStop():boolean{
          return this.SamplesCaptured >= this.MaxSamplesToCapture - 1;  //索引记得-1
    }

    public ClearBuffer():void{
            Utility.ArrayClear(this.Samples, 0, this.Samples.length,0.0);
            Utility.ArrayClear(this.SamplesChunkSilence, 0, this.SamplesChunkSilence.length,false);
            this.mProcessedSound.ResetAndClear();
    } 

    public  SetDoneCollectingData():void {
        this.DoneCollectingData = true;
    }


    public  Abort():void {            
        // if (SoundConversionThread != null) {
        //     lock (AddSamplesLock) {
        //         Running = false;
        //         Monitor.Pulse(AddSamplesLock);
        //     }
        //     SoundConversionThread.Join();
        // }

        // SoundConversionThread = null;
        if (this.mRunning) {
            //   Laya.timer.clear(this,this.ProcessSamples);
                this.mRunning = false;
        }    
            
    }


    public  StartConverting():void {
        this.mRunning = true;
        this.ProcessedSamplesCaptured = 0;
         this.DataAnalyseIndex = 0;
        this.mSoundSonic.InitSonic(this.mTalkBackSettings.SoundTouchPitch,this.mTalkBackSettings.SoundTouchTempo,this.mTalkBackSettings.SoundTouchRate,1,1,false);//是否需要在处理声音的地方初始化       
        // this.mSoundSonic.InitSonic(talkbackSetting.SoundTouchPitch,talkbackSetting.SoundTouchTempo,talkbackSetting.SoundTouchRate,1,1,false);//是否需要在处理声音的地方初始化
        

        
            // if (SoundConversionThread != null) {
            //     lock (AddSamplesLock) {
            //         Running = false;
            //         Monitor.Pulse(AddSamplesLock);
            //     }
            //     SoundConversionThread.Join();
            // }

            // SoundConversionThread = new O7Thread(this.ProcessSamples);
            // SoundConversionThread.Name = "SoundConversionAndAnalysis";
            // Running = true;
            // SoundConversionThread.Start();
    }

     public  InitSamplesBuffer():void {            

            this.mProcessedSound.ResetAndClear();

            // reset chunk analitics
            this.SamplesChunkIndex = 0;

            // reset captured samples buffer & pointers
            this.SamplesCaptured = 0;

            // reset silence barrier
            this.AudioBufferAvgSampleValue = 0;

            this.DoneCollectingData = false;            
    }

    private  CalcNewSilenceAvg():void {
        let a:number = 0;
        for (var i = 0; i < this.AudioBufferSize; i++) {
            a += this.AudioBufferLastFramesMax[i];
        }
        this.AudioBufferAvgSampleValue = a / this.AudioBufferSize;
    }


    private  AddNewSilenceFrameMax( value:number):void {
        this.AudioBufferSize++;

        if (this.AudioBufferSize > this.mTalkBackSettings.ListenAverageFramesCount) {
            this.AudioBufferSize = this.mTalkBackSettings.ListenAverageFramesCount;
        }

        for (var i = 1; i < this.mTalkBackSettings.ListenAverageFramesCount; i++) {
            this.AudioBufferLastFramesMax[i - 1] = this.AudioBufferLastFramesMax[i];
        }
        //队列
        this.AudioBufferLastFramesMax[this.AudioBufferLastFramesMax.length - 1] = value;
    }

    public  CalculateSilenceBarrier():void {
        let max:number = 0;
        for (var i = 0; i < this.MinSilenceSamples; i++)
        { 
            if (max < this.Samples[i]) {
                max = Math.abs(this.Samples[i]);
            }
        }
        if (max > 1) {
            max = 1;
        }
        this.AddNewSilenceFrameMax(max);
        this.CalcNewSilenceAvg();
        // clear current buffer
        this.SamplesCaptured = 0;
    }

    /// <summary>
    /// 判断是否需要开始录音
    /// </summary>
    /// <returns></returns>
    public  ShouldStartRecording():boolean {
        //假如 AudioBufferAvgSampleValue = 0.4 * 1.3 = 0.52
        let maxLimit:number = this.AudioBufferAvgSampleValue * this.mTalkBackSettings.ListenSilenceStartFactor;
        

        //maxLimit 这个值会每次增大，导致错误问题出现============
        //0.4 + 0.06 = 0.46 
        if (maxLimit < (this.AudioBufferAvgSampleValue + this.mTalkBackSettings.ListenSilenceEnviromentAbsDeltaStart)) {
            maxLimit = this.AudioBufferAvgSampleValue + this.mTalkBackSettings.ListenSilenceEnviromentAbsDeltaStart;
        }
        
        let sum:number = 0;  //float
        let maxVal:number = 0;
        let  t:number;  //float
        for (var i = 0; i < this.MinSilenceSamples; i++) {  //1600
            t = Math.abs(this.Samples[i]);
            sum += t;            
            if (t > maxLimit) {
                maxVal++;
            }
        }
        //Recording starts when there are enough loud samples (More than 20) and    当有足够大的样本(超过20个)时开始录音
        let sumLimit:number = this.MinSilenceSamples * this.mTalkBackSettings.ListenStartRecordingFactor; //2.44

        let isshould = ((sum >= sumLimit) && (maxVal > 20));
        // JK.console.log("isshould="+isshould+".,,,,,====maxLimit=="+maxLimit+"maxVal=="+maxVal+"  data="+this.Samples.slice(0,10));
        return isshould ;
        
    }

    /**
     * 是否应该停止录音
     */
    public  ShouldStopRecording():boolean {
            let silenceCheckStartPosition:number = this.SamplesChunkIndex * this.MinSilenceSamples;
            
            if (this.SamplesCaptured > silenceCheckStartPosition + this.MinSilenceSamples) { // check new chunk for silence

                this.SamplesChunkSilence[this.SamplesChunkIndex] = this.IsSilence(silenceCheckStartPosition);
                
                this.SamplesChunkIndex++;             
            }
            
            // check if last N chunk containes silence
            let chunksWithSilence:number = 0;
            for (var i = this.SamplesChunkIndex - 1; i > 0; i--) {
                    
                if (this.SamplesChunkSilence[i]) {
                    chunksWithSilence++;
                } else {
                    break;
                }
            }

            return chunksWithSilence >= this.mTalkBackSettings.ListenStopMaxSilenceChunks;

    }

    private  IsSilence( offset:number):boolean {
            let maxLimit:number = this.AudioBufferAvgSampleValue * this.mTalkBackSettings.ListenSilenceEndFactor;

            if (maxLimit < (this.AudioBufferAvgSampleValue + this.mTalkBackSettings.ListenSilenceEnviromentAbsDeltaEnd)) {
                maxLimit = this.AudioBufferAvgSampleValue + this.mTalkBackSettings.ListenSilenceEnviromentAbsDeltaEnd;
            }

            let barrierExeeds:number = 0;

            for (var i = 0; i < this.MinSilenceSamples; i++) {

                if (Math.abs(this.Samples[i + offset]) > maxLimit) {
                    barrierExeeds++;
                }
            }

            return barrierExeeds < 20;         
    }


    public  AddSamples( data:Float32Array, numOfSamples:number):number {
            // get buffer size to copy
            let copyLen:number = numOfSamples / this.mTalkBackSettings.MicrophoneChannels;
            if (this.SamplesCaptured + copyLen >= this.MaxSamplesToCapture) {
                copyLen = this.MaxSamplesToCapture - this.SamplesCaptured - 1;
            }
     
            if (copyLen > 0) {

                if (this.mTalkBackSettings.MicrophoneChannels == 1) {
                    // lock (SamplesLock) { //TODO
                    Utility.ArrayCopy(data, 0, this.Samples, this.SamplesCaptured, copyLen);
                    // }
                } else {
                    //暂时不出来 多声道
                    // lock (SamplesLock) {
                    //     for (int i = 0; i < copyLen; i++) { // capture only mono sound, skip other channels
                    //         Samples[i + SamplesCaptured] = data[i * mTalkBackSettings.MicrophoneChannels];//TODO should probably average the samples on more than 1 mic channel
                    //     }
                    // }
                }             
                this.SamplesCaptured += copyLen;

            }
            // O7Log.DebugT(Tag, "SamplesCaptured {0} copyLen {1}", SamplesCaptured, copyLen);
            // JK.console.log("SamplesCaptured: "+ this.SamplesCaptured+"  copyLen: "+copyLen);
            return copyLen;
    }


    public  Notify():void {
        // AddSamplesLock 释放锁
        // lock (AddSamplesLock)
        //     Monitor.Pulse(AddSamplesLock);

        // if (this.mRunning) {
        //         Laya.timer.clear(this,this.ProcessSamples);
        //         this.mRunning = false;
        // }   
    }

    public Recorded():void{
        this.mRunning = false;
        this.mSoundSonic.flushStream();
    }


    private isSonicProcess = true;
    public ProcessSamples():void{
        if (this.mRunning == false)  return;
        let toProcessed = this.SamplesCaptured - this.ProcessedSamplesCaptured;         
        if (toProcessed <= 0) return;


        let tempBuffer:Float32Array =  this.Samples.slice(this.ProcessedSamplesCaptured,this.SamplesCaptured);
        if (this.isSonicProcess) {            
            //[star end)
            this.mSoundSonic.writeFloatToStream(tempBuffer,toProcessed);
            // JK.console.log(tempBuffer.length+" ** " + toProcessed+"<=====>"+ this.Samples.slice(this.ProcessedSamplesCaptured,this.ProcessedSamplesCaptured+30))
            var outBuffer = new Int16Array(toProcessed * 2);
            var numWritten = 0;
            do {                  
                numWritten = this.mSoundSonic.readShortFromStream(outBuffer, toProcessed);  //读出Int16Array            
                if(numWritten > 0) {                        
                    Utility.ArrayCopy(outBuffer.slice(0,numWritten),0,this.mProcessedSound.Data,this.mProcessedSound.Length,numWritten);
                    this.mProcessedSound.Length += numWritten;
                }
            } while(numWritten > 0);
            // JK.console.log("====="+ this.mProcessedSound.Data.slice(this.mProcessedSound.Length-this.ProcessedSamplesCaptured,this.mProcessedSound.Length));
            this.ProcessedSamplesCaptured = this.SamplesCaptured;
            // JK.console.log("已经处理的录音---："+this.ProcessedSamplesCaptured+",,,procesded.Leng = "+this.mProcessedSound.Length);

           this.AnalyseFrames(true);  //this.ProcessedSamplesCaptured < this.SamplesCaptured
        }else{
            let bufferInt16:Int16Array = new Int16Array(tempBuffer.length);
            Utility.FloatTo16BitPCM(tempBuffer,bufferInt16);
            Utility.ArrayCopy(bufferInt16,0,this.mProcessedSound.Data,this.mProcessedSound.Length,toProcessed);
            this.mProcessedSound.Length += toProcessed;
            this.ProcessedSamplesCaptured = this.SamplesCaptured;
        }           
    }

    private  GetSampleValueInSoundNormRange( val:number):number {
        if (val > this.mTalkBackSettings.ListenNormalizationFactor)
            val = this.mTalkBackSettings.ListenNormalizationFactor;
        else if (val < (-this.mTalkBackSettings.ListenNormalizationFactor))
            val = -this.mTalkBackSettings.ListenNormalizationFactor;
        return val;    
    }

    private  GetNormFactor( maxVal:number):number {
        if (maxVal != 0) {
            return this.mTalkBackSettings.ListenNormalizationFactor / maxVal;
        } else {
            return this.mTalkBackSettings.ListenNormalizationFactor;
        }        
    }

    public  AnalyseFrames( doPartial:boolean) :void{

            while (this.DataAnalyseIndex < this.mProcessedSound.Length) {

                let AUDIO_CHUNK_AMP_BINS:number = this.mTalkBackSettings.TalkFrameBins;//32
                let AUDIO_CHUNK_FRAME_SIZE:number;

                if (this.DataAnalyseIndex + this.BatchSize > this.mProcessedSound.Length)
                {  //16000/15 = 1066  每帧数据

                    if (!this.DoneCollectingData) { // wait for more data, stop analysing

                        break;
                    }

                    AUDIO_CHUNK_FRAME_SIZE = this.mProcessedSound.Length - this.DataAnalyseIndex;
             
                    if (AUDIO_CHUNK_FRAME_SIZE < this.BatchSize && doPartial) {
                 
                        break;
                    }

                } else {

                    AUDIO_CHUNK_FRAME_SIZE = this.BatchSize; //16000 / 15 = 1066  每帧数据
                }//endif

                let AUDIO_CHUNK_AMP_BIN_SIZE_FLOAT:number = (1.0 / AUDIO_CHUNK_AMP_BINS);  //  1/32
     
                let bins:Int32Array = new Int32Array(AUDIO_CHUNK_AMP_BINS);  //32
                for (let i = 0; i < AUDIO_CHUNK_AMP_BINS; i++) {
                    bins[i] = 0;
                }

                let maxSample:number = 0;
                for (let i = 0; i < AUDIO_CHUNK_FRAME_SIZE; i++)
                {   ////16000/15 = 1066  每帧数据,每帧数据处理
                    let tBinNum = Math.round(Mathf.Abs(this.mProcessedSound.Data[i + this.DataAnalyseIndex] / Utility.SHORT_MAX) / AUDIO_CHUNK_AMP_BIN_SIZE_FLOAT);
                    if (tBinNum >= AUDIO_CHUNK_AMP_BINS || tBinNum < 0) {
                        tBinNum = AUDIO_CHUNK_AMP_BINS - 1;
                    }

                    bins[tBinNum]++;                 
                }
             
                for (let i = 0; i < AUDIO_CHUNK_AMP_BINS; i++) {

                    if (bins[i] > (AUDIO_CHUNK_FRAME_SIZE / 50))  // 21
                        maxSample = i;
                }
         
                maxSample = maxSample * AUDIO_CHUNK_AMP_BIN_SIZE_FLOAT; //1 / 32


                let NOISE_LIMIT:number = this.mTalkBackSettings.ListenNoiseLimit;//0.0274
    
                let audioNum:number = 0;

                // new talk with logaritmic animation
                if (maxSample < NOISE_LIMIT) {
                    audioNum = 0;
                } else {
               
                    audioNum = (maxSample - NOISE_LIMIT) / (1 - NOISE_LIMIT);

                    let boost:number = 0.8;

                    // boost talk frames
                    if (audioNum > boost) {
                        audioNum = boost;
                    } else {
                        audioNum = audioNum / boost;
                    }
                }

                audioNum = Math.pow(audioNum, 1.5);
         
                this.DataAnalyseIndex += AUDIO_CHUNK_FRAME_SIZE;
                if (this.mProcessedSound.TalkFramesLength < this.mProcessedSound.TalkFrames.length) {//This happens when you record for more than the meximum allowed time (15s currently)
                    this.mProcessedSound.TalkFrames[this.mProcessedSound.TalkFramesLength] = audioNum;   
                    this.mProcessedSound.TalkFramesLength++;   
                }
         
            }

    }

    public DoEndAnalyFrames(){

        if (this.FirstRun && this.AudioBufferMaxSampleValue < 0.5) {
            this.AudioBufferMaxSampleValue = this.mTalkBackSettings.ListenNormalizationFactor;
        }
        this.FirstRun = false;

        let maxEndSamplesCutoff:number = Utility.FloatToInt( this.mTalkBackSettings.ListenEndCutoff * this.MinSilenceSamples);
        this.mProcessedSound.Length = Math.max(this.mProcessedSound.Length - maxEndSamplesCutoff, 1); // MTA-2596 (crash if ProcessedSound.Length <= 0) 
        let maxEndSamplesFadeout:number =  Utility.FloatToInt(this.mTalkBackSettings.ListenEndFadeout * this.MinSilenceSamples);

        let normFactor:number = this.GetNormFactor(this.AudioBufferMaxSampleValue);
        for (let i = 0; i < this.mProcessedSound.Length; i++) {
            this.mProcessedSound.Data[i] = this.GetSampleValueInSoundNormRange(this.mProcessedSound.Data[i] * normFactor);

            let endPos:number = this.mProcessedSound.Length - maxEndSamplesFadeout;
            if (i > endPos) { // fadeout
                let fadeout:number = 1 - ((i - endPos) /  maxEndSamplesFadeout);
                this.mProcessedSound.Data[i] *= fadeout;
            }
        }
    }
}