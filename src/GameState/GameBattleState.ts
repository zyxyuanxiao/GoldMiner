class GameBattleState extends BaseGameState
{
    Controller:BattleUiCtrl;
    OnEnter(previousState: BaseGameState, data: Object):void
    {
        this.InitUiController(["res/atlas/MainUI.atlas","res/atlas/style1.atlas"], data);
    }

    InitUiController(uiAtlas:Array<string>, opt:any)
    {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
        this.Controller = new BattleUiCtrl();
        this.Controller.zOrder = 100;
        Laya.stage.addChild(this.Controller);
        if (opt instanceof LevelItem)
           (this.Controller as BattleUiCtrl).LoadLevel(opt as LevelItem);
        }.bind(this)));
    }

    public OnUpdate():void {
        super.OnUpdate();
        if (this.Controller != null)
            this.Controller.Update();
    }

    public OnExit(nextState:BaseGameState, data:Object) {
        if (this.Controller != null)
        {
            this.Controller.OnExit();
            this.Controller.destroy();
            Laya.stage.removeChild(this.Controller);
            delete this.Controller;
            this.Controller = null;
        }
        super.OnExit(nextState, data);
    }

    public Play()
    {
        (this.Controller as BattleUiCtrl).StartGame();
    }
    
    //调试功能
    public StartLevel(level:LevelItem)
    {
        (this.Controller as BattleUiCtrl).LoadLevel(level);
        (this.Controller as BattleUiCtrl).StartGame();
    }
}