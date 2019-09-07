class RecordState extends BaseGameState {
    Controller: RecordUiController;
    OnEnter(previousState: BaseGameState, data: Object): void {
        this.InitUiController(["res/atlas/comp.atlas"]);
    }

    InitUiController(uiAtlas: Array<string>) {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
            this.Controller = new RecordUiController();
            this.Controller.zOrder = 100;
            Laya.stage.addChild(this.Controller);
        }.bind(this)));
    }

    OnExit(previousState: BaseGameState, data: Object) {
        super.OnExit(previousState, data);
    }
}

class RecordUiController extends ui.RecordUI {
    price: Array<number> = new Array<number>();
    count: Array<number> = new Array<number>(1, 1, 1, 1, 1);
    items: Array<{}>;
    public static Instance:RecordUiController = null;
    constructor() {
        super();
        WeChatRecorderManager.Instance.InitRecord();
        this.btn_record.on(Laya.Event.CLICK, this, this.OnStartRecord);
        this.btn_stop.on(Laya.Event.CLICK, this, this.OnStopRecord);
        this.btn_convert.on(Laya.Event.CLICK, this, this.Convert);
        this.btn_process.on(Laya.Event.CLICK, this, this.Process);
        this.btn_playAudio.on(Laya.Event.CLICK, this, this.PlayAudio);
        this.btn_playAudio2.on(Laya.Event.CLICK, this, this.PlayAudio2);
        RecordUiController.Instance = this;
        this.OnResize();
    }

    ShowMessage(...params)
    {
        var m:string = "";
        for (var i = 0; i < params.length; i++)
            m += JSON.stringify(params[i]);
        this.message.text = m;
    }

    OnResize() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }

    OnStartRecord()
    {
        WeChatRecorderManager.Instance.start();
    }

    OnStopRecord()
    {
        WeChatRecorderManager.Instance.stop();
    }

    /**
     * AAC转换PCM步骤
     */
    Convert()
    {
        if (WeChatRecorderManager.Instance.soundUrl != null)
        {
            var that = this;
            WeChatManager.Instance.fs.readFile({
            filePath: WeChatRecorderManager.Instance.soundUrl,
            success (res) {
            console.log('read success')
            that.mp3ToPcm(res.data)
            },
            fail (e) {
            console.log('read fail');
            }
        })
        }
    }

    
    //转格式
    mp3ToPcm (mp3AB) {
        var that = this;
        var pcmArrayBuffer = WechatHelper.Mp3Helper.GetInstance().ConvertToPCM(mp3AB);
        // // 和录音的格式一样
        // const fromFormat = {
        //     channels: 1,
        //     sampleRate: 44100,
        //     interleaved: true,
        //     float: false,
        //     samplesPerFrame: 1152,
        //     signed: true
        // }
        
        // // 目标音频的格式
        // const toFormat = {
        //     channels: 1,
        //     sampleRate: 16000,
        //     bitDepth: 8,
        //     interleaved: true,
        //     float: false,
        //     samplesPerFrame: 576,
        //     signed: true
        // }
        // var pcmAB = WechatHelper.PcmHelper.GetInstance().convert(pcmArrayBuffer, fromFormat, toFormat);
    }
    /**
     * 处理变音步骤
     */
    Process()
    {

    }

    /**
     * 播放原音
     */
    PlayAudio()
    {
        WeChatRecorderManager.Instance.PlayAudio();
    }

    /**
     * 播放变音
     */
    PlayAudio2()
    {

    }
}