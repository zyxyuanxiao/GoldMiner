
// enum MicState {
//     Idle,
//     //Before the mic is acquired
//     AquiringMicrophone,
//     // wait for microphone
//     AquiringSilenceBarrier,
//     // read some samples and set silence barrier
//     AnalysingSound,
//     // analyse sound and start listening when appropriate
//     Recording,
//     Processing,
//     Processed
// }
// class MicrophoneHandler extends Laya.Script {
//     public frameCnt:number = 0;
//     private mIsExplorerSupport:boolean= false;
//     private mIsHaveAuthority:boolean = false;
//     private DefaultDataBufferSize:number = 0;

//     private micStatus:number = 0;
//     private STATUS_OPEN:number = 1 << 1;
//     private STATUS_RECORDING:number = 1 << 2;
//     private STATUS_FORMAT:number = 1 << 3;

//     private mH5Audio:Laya.AudioSound = null;
//     private mMicRecord:jinkejoy.MicphoneRecord = null;
//     private mTalkBackSettings:TalkBackSettings = null;
//     private mRecordingBuffer:RecordingBuffer = null;
    
//     private microphoneState:MicState = MicState.Idle;

//     // Callbacks
//     public OnConvertingDone:Laya.Handler = null;
//     public OnRecordingStarted:Laya.Handler = null;
    

//     private mRecordingStartTime:number = 0;

//     private DataBuffer:Float32Array = null;
    
//     constructor(){
//         super();
        
//         //浏览器是否支持
//         this.mIsExplorerSupport = false;
//         //玩家是否允许录音权限
//         this.mIsHaveAuthority = false;
//         this.DefaultDataBufferSize = 2000;
//         // Callbacks
//         this.OnRecordingStarted = null;
//         this.OnConvertingDone = null;
//         //录音状态
//         this.micStatus = 0;
//         this.STATUS_OPEN = 1 << 1;
//         this.STATUS_RECORDING = 1 << 2;
//         this.STATUS_FORMAT = 1 << 3;
//         this.mH5Audio = new Laya.AudioSound();
//         // buffer  powerLevel  duration
//         this.mMicRecord = jinkejoy.MicphoneRecord.GetInstance({ bitRate: 16, onProcess: function (buffer, powerLevel, duration) {
//                 //处理回调
//             } });
//         this.mTalkBackSettings = new TalkBackSettings(); //new 调节参数请到里面去手动处理
//         // var THIS = this;
//         this.mIsExplorerSupport = this.mMicRecord.ExplorerSupport();

//         this.microphoneState = MicState.Idle;   
//     }

//     _start(){
        
//     }

//      public OnPlay():void  {
//           Laya.SoundManager.playSound(this.mRecordingBuffer.mProcessedSound.blobUrl);
//     }


//     public Init():void  {
//         //  JK.console.log("=============MicrophoneHandler.Init=================");
//         this.mRecordingBuffer = new RecordingBuffer(this.mTalkBackSettings);
//     }

//     public get Active(){
//         // return !(this.MicrophoneState == MicState.Idle || this.MicrophoneState == MicState.Processed);
//         return true;
//     }


//     public get MicrophoneState(){
//         return this.microphoneState;
//     }

//     public set MicrophoneState(_microphoneState:MicState){
//        this.microphoneState = _microphoneState;
//             switch (this.microphoneState) {
//                 case MicState.Processed:                  
//                     if (this.OnConvertingDone != null) {
//                         // JK.console.log("==========================录音结束===============================");
//                         this.OnConvertingDone.runWith(this.mRecordingBuffer.mProcessedSound);
//                     }
//                     break;
//                 case MicState.Recording:
//                     if (this.OnRecordingStarted != null) {
//                         // JK.console.log("==========================录音开始===============================");
//                         this.OnRecordingStarted.run();
//                     }
//                     break;
//                 case MicState.Processing:
//                     this.mRecordingBuffer.SetDoneCollectingData();
//                     break;
//                 default:
//                     break;
//             }
//     }


//     public Stop():void {
//         this.mRecordingBuffer.Abort();
//         this.mRecordingBuffer.ClearBuffer();
//         this.ReleaseMicrophone();
//         this.micStatus = 0;
//         this.mMicRecord.Close();
//     }
//     public Reset():void{
//         if (this.mRecordingBuffer != null) {
//             this.mRecordingBuffer.ClearBuffer();
//         }
//     }
//     public AcquireMicrophone() {       
//         var THIS = this;
//         if (this.Active) {
//             return;
//         }
         
//         // stop any previous action
//         this.ReleaseMicrophone();
//         this.mRecordingStartTime = Laya.timer.currTimer;
//         // 浏览器不支持 或则玩家拒绝录音权限
//         if (!this.mMicRecord.ExplorerSupport()) { // || this.mIsHaveAuthority == false
//             // JK.console.log("MicrophoneHandler/AcquireMicrophone  浏览器不支持 or 玩家拒绝了录音权限");
//             return;
//         }

//         //MainUiController.Instance.OnMouseMessage(this.mMicRecord.ExplorerSupport()+"=supp="+this.frameCnt+"Mic AcquireMicro");
//         // start mic if not already started 在循环缓冲区(循环)中开始记录
//         if (!this.mMicRecord.IsRecording() && !Utility.IsBit(this.micStatus, this.STATUS_OPEN)) {
//             // 开始打开媒体流

//              this.mMicRecord.Open(function () {
//                     console.log("MicrophoneHandler/AcquireMicrophone open success");
//                     THIS.mIsHaveAuthority = true;
//                     if (THIS.DataBuffer == null)
//                         THIS.DataBuffer = new Float32Array(THIS.DefaultDataBufferSize);
//                     THIS.MicrophoneState = MicState.AquiringMicrophone;
//                     THIS.mRecordingBuffer.InitSamplesBuffer();
//                     //MainUiController.Instance.OnMouseMessage(THIS.MicrophoneState+"=1state="+this.frameCnt+"Micr AcquireMicrophone");
//                 }, function (cmdCode, exception) {
//                     console.log("MicrophoneHandler/AcquireMicrophone" + exception);
//                     if (cmdCode == 2) {
//                         THIS.mIsHaveAuthority = false;
//                     }

//                     //MainUiController.Instance.OnMouseMessage(exception+" =exc="+THIS.MicrophoneState+"=state="+this.frameCnt+"Micr Acqui");
//                 });
//                 this.micStatus = Utility.SetBit(this.micStatus, this.STATUS_OPEN, true);

//         }else{            
//               this.MicrophoneState = MicState.AquiringMicrophone;
//               this.mRecordingBuffer.InitSamplesBuffer();            
//         }
//     }
//     public ReleaseMicrophone ():void {
//         this.MicrophoneState = MicState.Idle;
//         if (this.mRecordingBuffer != null) {
//             this.mRecordingBuffer.Abort();
//         }
//         // 关闭流
//         if (this.mMicRecord.IsRecording()) {
//             this.micStatus = 0;
//             this.mMicRecord.Close();
//         }
//     }
//     //检测设备浏览器是否支持mic
//     public IsMicrophoneAcquired() {
//         return this.mMicRecord.ExplorerSupport();
//     }
//     public AddSamplesToRecordingBuffer(){
//         var THIS = this;
//         try {
//             // 从获取之后需要延迟 0.1s
//             if (this.mRecordingStartTime + this.mTalkBackSettings.MicrophoneRecordingStartDelay > Laya.timer.currTimer) {
//                 return; //-1
//             }
//             if (this.mMicRecord.IsRecording()) {
//                 return;
//             }
//             // read audio from mic
//             // let data :Float32Array;
//             // let numOfSamples:number = 0;
//             //异步
//             if (!this.mMicRecord.IsRecording() || ( Utility.IsBit(this.micStatus, this.STATUS_OPEN) && Utility.IsBit(this.micStatus, this.STATUS_RECORDING) == false)) {
//                 this.mMicRecord.Begin(function (float32Buffer) {
//                     // var data = float32Buffer;
//                     // var numOfSamples = data.length;                    
//                     // for (var i = 0; i < data.length; i++) {
//                     //     var s = Math.sin(2 * Math.PI * 400 * i / 48000);
//                     //     data[i] = s;
//                     // }
//                     // THIS.mRecordingBuffer.AddSamples(data, numOfSamples);

//                     THIS.mRecordingBuffer.AddSamples(float32Buffer, float32Buffer.length);
//                     if (THIS.mRecordingBuffer.mRunning) {
//                         // 有一个最大值
//                         THIS.mRecordingBuffer.ProcessSamples();
//                     }
//                 });
//                 this.micStatus = Utility.SetBit(this.micStatus, this.STATUS_RECORDING, true);
//             }
//             // return   
//         }
//         finally {
//             this.mRecordingBuffer.Notify();
//         }
//     }
//     public OnDestroy():void{
//         this.ReleaseMicrophone();
//         this.micStatus = 0;
//         this.mMicRecord.Close();
//     }
//     public OnApplicationPause(paused):void {
//         if (paused) {
//             this.Stop();
//         }
//         else {
//             this.Reset();
//         }
//     }
//     public _update():void {
//         this.frameCnt ++;
//         if (this.frameCnt > Utility.SHORT_MAX) {
//             this.frameCnt = 0;
//         }
//         // JK.console.log("当前执行帧 = "+this.frameCnt);
//         switch (this.MicrophoneState) {
//             case MicState.AquiringMicrophone:
//                 if (this.IsMicrophoneAcquired()) {
//                     this.MicrophoneState = MicState.AquiringSilenceBarrier;
//                 }
//                  //MainUiController.Instance.OnMouseMessage(this.frameCnt+"onUpdate AquiringMicrophone");
//                 break;
//             case MicState.AquiringSilenceBarrier:
//                 this.AddSamplesToRecordingBuffer();
//                 if (this.mRecordingBuffer.EnoughtSamplesForSilenceDetection) {
//                     // this.mMicRecord.Pause();
//                     this.mRecordingBuffer.CalculateSilenceBarrier();
//                     // start analysing sound
//                     this.MicrophoneState = MicState.AnalysingSound;
//                 }
//                 //MainUiController.Instance.OnMouseMessage("onUpdate AquiringSilenceBarrier");
//                 break;
//             case MicState.AnalysingSound: // //分析声音
//                 this.AddSamplesToRecordingBuffer();
//                 if (this.mRecordingBuffer.EnoughtSamplesForSilenceDetection) {
//                     if (this.mRecordingBuffer.ShouldStartRecording()) { // start recording and keep already recorded samples
//                         this.MicrophoneState = MicState.Recording;
//                         this.mRecordingBuffer.StartConverting(); //开始转音 直接在回调函数转音
//                     }
//                     else { // clear buffer and keep analysing
//                         this.mRecordingBuffer.CalculateSilenceBarrier();
//                     }
//                 }
//                 //MainUiController.Instance.OnMouseMessage(this.frameCnt+"onUpdate AnalysingSound");
//                 break;
//             case MicState.Recording:
//                 this.AddSamplesToRecordingBuffer();

//                 if (this.mRecordingBuffer.FullSamplesFortoStop || this.mRecordingBuffer.ShouldStopRecording()) { // samples array is full, stop recording
//                     this.MicrophoneState = MicState.Processing;
//                 }
//                 //MainUiController.Instance.OnMouseMessage(this.frameCnt+"onUpdate Recording");
//                 break;
//             case MicState.Processing:
//                 var THIS = this;        
//                 if (Utility.IsBit(this.micStatus, this.STATUS_FORMAT) == false) {
//                     this.mMicRecord.Close();
//                     // flushStream
//                     var curBuffer = this.mRecordingBuffer.mProcessedSound.Data.slice(0, this.mRecordingBuffer.mProcessedSound.Length);
//                     this.mMicRecord.Format(curBuffer, function (_blob, duration) {
//                         THIS.mRecordingBuffer.mProcessedSound.CreateSoundUrl(_blob, duration);
//                         THIS.mRecordingBuffer.Recorded();
//                         THIS.MicrophoneState = MicState.Processed;
//                         THIS.micStatus = 0;                
//                     });
//                     this.micStatus = Utility.SetBit(this.micStatus, this.STATUS_FORMAT, true);
//                 }
//                 //MainUiController.Instance.OnMouseMessage(this.frameCnt+"onUpdate Processing");
              
//                 break;
//             case MicState.Idle:
//                 // MainUiController.Instance.OnMouseMessage(this.frameCnt+"onUpdate Idle");
//                 break;
//             case MicState.Processed:
//                 this.microphoneState = MicState.Idle;
//                 // MainUiController.Instance.OnMouseMessage(this.frameCnt+"onUpdate Processed");
//                 // JK.console.log("onUpdate Processed");
//                 break;
//             default:
//                 throw new Error("Unhandled microphone state.");
//         }
//     }
// }