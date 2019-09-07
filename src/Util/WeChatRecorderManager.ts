/*
*  autor:yann
*  微信录音管理; 
*  issue 1: 第一次按住的时候可能需要弹录音权限,此时录音会失败  
*  issue 2: 每次start 都需要向wx注册回调，否则不会有回调事件 
*  issue 4: 微信暂时不支持PCM 脉冲数据，后期如果支持，可以在onFrameRecorded 处理音频
*/ 
class WeChatRecorderManager{
    private static m_instance:WeChatRecorderManager;
    private static mTempFileName = "001.mp3";
    public static get Instance():WeChatRecorderManager{
        if (WeChatRecorderManager.m_instance === undefined) {
            WeChatRecorderManager.m_instance =  new WeChatRecorderManager();
        }
        return WeChatRecorderManager.m_instance;
    }

    private wx:any = null;
    private recoderManager:any = null;
    private isRecording = false;
    private index:number = 1;

    public onError:Laya.Handler = null; // Object res  errMsg	string
    public onInterruptionBegin:Laya.Handler = null;
    public onInterruptionEnd:Laya.Handler = null;
    public onPause:Laya.Handler = null;
    public onResume:Laya.Handler = null;
    public onStart:Laya.Handler = null;
    public onStop:Laya.Handler = null;     //Object res    tempFilePath	string
    public onFrameRecorded:Laya.Handler = null;  //Object res  frameBuffer	ArrayBuffer  isLastFrame	boolean
    private recordTime:number = 0;
    public soundUrl:string = "";
    constructor(){        
        this.wx = Laya.Browser.window.wx;
        if (this.IsSupportWeChat) {
            this.recoderManager = this.wx.getRecorderManager();
        }
    }

    public InitRecord(){
        WeChatRecorderManager.Instance.onError = Laya.Handler.create(this,(errorMsg)=>{
            console.error(" 录音出错 "+errorMsg);
            RecordUiController.Instance.ShowMessage("录音出错");
        },null,false);

        WeChatRecorderManager.Instance.onStart = Laya.Handler.create(this,()=>{
            console.log("录音开始");
            RecordUiController.Instance.ShowMessage("录音开始");
            this.recordTime = 0;
            this.isRecording = true;
        },null,false);

        WeChatRecorderManager.Instance.onStop = Laya.Handler.create(this,(voiceUrl)=>{
            console.log("录音结束", voiceUrl);
            this.soundUrl = voiceUrl;
            RecordUiController.Instance.ShowMessage("录音结束", this.soundUrl);
            //this.PlayRecordedSoundWeChat(voiceUrl);
        });

        WeChatRecorderManager.Instance.onInterruptionBegin = Laya.Handler.create(this,()=>{
             console.log("中断录音");
             RecordUiController.Instance.ShowMessage("中断录音", this.soundUrl);
             WeChatRecorderManager.Instance.stop();
        });

    }

    private Playing:boolean;
    private isSoundPlaying:boolean = false;
    private soundChanel:Laya.SoundChannel = null;

    PlayAudio()
    {
        MainAudioPlayer.Instance.playSound(this.soundUrl, 1, null, true);
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

    SoundPlayCompele(){
        this.isSoundPlaying = false;
        this.TalkingStopped(false);
    }

    public  CallbackTalkingStopped:Laya.Handler = null;   //bool
    private playTalkTime :number = 0;   //当前播放的采样点
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
    /**
     * 是否支持微信
     */
    public get IsSupportWeChat():boolean{
        return !!this.wx;        
    }

    /**
     * 缓存路径
     */
    public get getTempFilePath():string{
        if (!this.IsSupportWeChat) {
            return "";
        }
        return this.wx.env.USER_DATA_PATH+"/00"+this.index+".mp3";    //;WeChatRecorderManager.mTempFileName;
    }


    public registerCallBack(){
        let self = this;
        if (!this.IsSupportWeChat) {
            console.error("WeChatRecorderManager 当前平台不支持微信");
            return;
        }

        this.recoderManager.onError((res)=>{
            const { errMsg } = res;
            if (self.onError != null) {
                self.onError.runWith(errMsg);
            }
        });

        this.recoderManager.onStart(()=>{
            self.isRecording = true;
            if (self.onStart != null) {
                self.onStart.run();
            }
        });

        this.recoderManager.onInterruptionBegin(()=>{
            self.isRecording = false;
            if (self.onInterruptionBegin != null) {
                self.onInterruptionBegin.run();
            }
        });

        this.recoderManager.onInterruptionEnd(()=>{
            if (self.onInterruptionEnd != null) {
                self.onInterruptionEnd.run();
            }
        });

        this.recoderManager.onPause(()=>{
            if (self.onPause != null) {
                self.onPause.run();
            }
        });

        this.recoderManager.onResume(()=>{
            if (self.onResume != null) {
                self.onResume.run();
            }
        });

        this.recoderManager.onStop((res)=>{
            self.isRecording = false;
            const { tempFilePath } = res;           // wxfile://temp.....fsa.mp3;  这个路径不能直接使用
            self.index ++;
            let fileManager:any = self.wx.getFileSystemManager();

            fileManager.saveFile({
                 tempFilePath:tempFilePath,
                 filePath:self.getTempFilePath,
                 success:function(sucRes){
                    if (self.onStop != null) {                        
                        self.onStop.runWith(self.getTempFilePath);
                    }
                 },
                 fail:function(failRes){
                    // 失败直接中断
                    console.error(" save file fail ");
                    if (self.onInterruptionBegin != null) {
                        self.onInterruptionBegin.run();
                    }
                 },
                 complete:function(){
                    //TODO
                 }
            });            

        });

        
    }

    
    public start(){
        if (!this.IsSupportWeChat) {
            console.error("WeChatRecorderManager 当前平台不支持微信");
            return;
        }
        if (this.isRecording) {
            console.error(" 当前正在录音，请勿重复操作 ");
        }

        
        this.registerCallBack();
        //https://developers.weixin.qq.com/minigame/dev/api/media/recorder/RecorderManager.start.html
        const options = {   
            duration: 20000,              //时间暂时调大些
            sampleRate: 44100,//44100,
            numberOfChannels: 1,
            encodeBitRate: 192000,   //320000,
            format: 'aac',
            // frameSize: 4,        
            audioSource:"auto",
         }

         this.recoderManager.start(options);
    }

    public stop(){
        this.recoderManager.stop();
    }   


    public pause(){
        if (!this.IsSupportWeChat) {
            console.error("WeChatRecorderManager 当前平台不支持微信");
            return;
        }
        this.recoderManager.pause();
    }


    public resume(){
        if (!this.IsSupportWeChat) {
            console.error("WeChatRecorderManager 当前平台不支持微信");
            return;
        }
        this.recoderManager.resume();
    }
    
}