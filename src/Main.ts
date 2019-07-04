// 程序入口
class Main {
    public PersistScene: Laya.Scene;
    public PersistContainer: Laya.Sprite3D;
    MainCamera: Laya.Camera;
    SFXCamera: Laya.Camera;
    clientProxy:Client;
    static Instance:Main;
    public GameStateManager: MainGameStateManager;
    public DialogStateManager: MainDialogStateManager;
    public level:LevelJson;
    public loading:boolean = false;
    public debugPanel:DebugUI;
    public meterPanel:MeterPanel;
    public WeChatManager:WeChatManager;
    constructor() {
        //初始化引擎
        Laya.MiniAdpter.init();
        Laya.MiniAdpter.nativefiles = ["sub/source.json", "res/atlas/start.atlas"];
        Laya3D.init(1080, 1920, false);
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        Material.Init();
        //开启统计信息
        //Laya.Stat.show();
        //常驻场景
        if (!Laya.Browser.onPC)
            Laya.URL.basePath = "https://mtt-cdn.jinkejoy.com/mta/GoldMiner/";
        this.PersistScene = new Laya.Scene();
        this.PersistScene.name = "DontDestroyOnLoad";
        this.PersistContainer = new Laya.Sprite3D("Persist");
        this.PersistScene.addChild(this.PersistContainer);
        //添加照相机
        this.SFXCamera = (this.PersistScene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        this.SFXCamera.name = "SFXCamera";
        this.SFXCamera.transform.translate(new Laya.Vector3(-1000, 0, 0));
        this.SFXCamera.clearColor = null;
        this.SFXCamera.orthographic = true;
        this.SFXCamera.renderingOrder = 9999;
        this.SFXCamera.clearFlag = Laya.Camera.CLEARFLAG_DEPTHONLY;
        //this.clientProxy = new Client();
        Main.Instance = this;
        this.DialogStateManager = new MainDialogStateManager();
        this.GameStateManager = new MainGameStateManager();
        this.WeChatManager = new WeChatManager();
        MainGameStateManager.Instance.Init();
        Laya.timer.frameLoop(1, this, this.Update);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.OnKeyUp);
        if (Laya.Browser.onMobile)
        {
            window["wx"].onShow(function () 
            {
                this.onShow();
            }.bind(this))
        }
    }

    //从后台进入到小游戏
    onShow()
    {
        MainAudioPlayer.Instance.Reset();
    }

    OnKeyUp(e:KeyboardEvent)
    {
        if (e.keyCode == Laya.Keyboard.D)
        {
            this.OnOpenDebug();
        }
    }

    OnOpenDebug()  {
        var res: Array<string> = [
            "res/atlas/MainUI.atlas",
            "res/atlas/comp.atlas",
            "res/atlas/LetterCard.atlas"
        ];

        Laya.loader.load(res, Laya.Handler.create(this, () => {
            if (Main.Instance.debugPanel == null)
                Main.Instance.debugPanel = new DebugUI();
            if (Laya.stage.getChildIndex(Main.Instance.debugPanel) == -1) {
                Main.Instance.debugPanel.zOrder = 10000;
                Laya.stage.addChildAt(Main.Instance.debugPanel, Laya.stage.numChildren);
            }
            else
                Laya.stage.removeChild(Main.Instance.debugPanel);
        }));
    }

    Update()
    {
        Main.Instance.GameStateManager.Update();
        Main.Instance.DialogStateManager.Update();
    }

    Init()
    {
        this.level = new LevelJson();
    }
}

var GameMain: Main = new Main();