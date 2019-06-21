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
    constructor() {
        //初始化引擎
        Laya.MiniAdpter.init();
        Laya.MiniAdpter.nativefiles = ["sub/source.json", "res/atlas/start.atlas"];
        Laya3D.init(1920, 1080, false);
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Material.Init();
        //开启统计信息
        //Laya.Stat.show();
        //常驻场景
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
        MainGameStateManager.Instance.Init();
        Laya.timer.frameLoop(1, this, this.Update);
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