class StartUpState extends BaseGameState {
    public static Instance:StartUpState;
    public LevelName: string;
    public Controller: StartUpUiController;
    constructor(mgr:MainGameStateManager){
        super(mgr);
        StartUpState.Instance = this;
    }

    //本地存储启动页面图，进度条图资源。保证玩的时候一定不要卡.
    resZip:string = "https://mtt-cdn.jinkejoy.com/mta/GoldMiner/res.zip";
    resZipName:string = "res.zip";
    //res/atlas/start.atlas和res/atlas/start.png放到导出微信工程内.
    public OnEnter(state:BaseGameState, data:Object): void {
        // var wx = window["wx"];
        // if (wx != null)
        // {
        //     const loadTask = wx.loadSubpackage({
        //         name: 'source',
        //         success(res) {
        //            StartUpState.Instance.Init();},
        //         fail(res) {
        //             Laya.timer.once(500, this, function()
        //             {
        //                 StartUpState.Instance.OnEnter();
        //             }.bind(this));
        //         }
        //     })
        // }
        // else
        {
            StartUpState.Instance.Init();
        }
    }

    /**
     * 随机开屏
     */
    Init()
    {
        StartUpState.Instance.InitUiController(["res/atlas/start.atlas"]);
    }
    /**
     * 初始化并构建Ui对象
     * @param uiAtlas 所需资源
     */
    InitUiController(uiAtlas: Array<string>) {
        Laya.loader.load(uiAtlas,Laya.Handler.create(this, function(){
            this.Controller = new StartUpUiController();
            this.Controller.zOrder = 10000;
            this.Controller.mouseThrough = true;
            Laya.stage.addChild(this.Controller);
        }.bind(this)));
        this.GameInit();
    }

    public OnAction(gameAction:GameAction, data:Object):void{
    }

    toprogress:number = 0.0;
    progress:number = 0.0;
    public OnUpdate() {
        if (this.Controller != null)
        {
            this.progress = Mathf.MoveTowards(this.progress, this.toprogress, Laya.timer.delta * 0.5 / 1000.0);
            this.Controller.UpdateProgress(this.progress);
        }
    }

    
    // 完成SDK登陆调用，开始游戏初始化
    GameInit() {
        //console.log("zip加载完成，开始加载资源", Laya.timer.currFrame);
        this.progress = 0.0;
        this.toprogress = 0.0;
        var res:Array<any> = [
         {url:"Level.json", type:Laya.Loader.JSON},
         {url:"res/atlas/Player.atlas",type:Laya.Loader.ATLAS},
         {url:"res/atlas/Player.png",type:Laya.Loader.IMAGE},
         {url:"res/atlas/MainUI.atlas",type:Laya.Loader.ATLAS},
         {url:"res/atlas/MainUI.png",type:Laya.Loader.IMAGE},
         {url:"res/atlas/rankUI.atlas",type:Laya.Loader.ATLAS},
         {url:"res/atlas/rankUI.png",type:Laya.Loader.IMAGE},
         {url:"res/atlas/style1.atlas",type:Laya.Loader.ATLAS},
         {url:"res/atlas/style1.png",type:Laya.Loader.IMAGE},
         {url:"res/atlas/comp.atlas",type:Laya.Loader.ATLAS},
         {url:"res/atlas/comp.png",type:Laya.Loader.IMAGE},
        ];
        //先加载json文件,动画文件,图集文件
        Laya.loader.load(res, Laya.Handler.create(this, this.OnDataLoaded), Laya.Handler.create(this, this.OnProgress, null, false));
    }

    OnProgress(prog:number)
    {
        //console.log("加载资源", prog);
        this.toprogress = prog;
    }

    OnDataLoaded()
    {
        //console.log("加载资源完成", Laya.timer.currFrame);
        if (this.Controller != null)
        {
            this.Controller.removeSelf();
            this.Controller.destroy();
            delete this.Controller;
            this.Controller = null;
        }
        Laya.timer.clear(this, this.OnUpdate);
        Main.Instance.Init();
    }

    OnLogin(user:any)
    {
        Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.RecordState);
        // Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.MenuState);
    }
}
