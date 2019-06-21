class MenuState extends BaseGameState
{
    Controller:MainMenuUiController;
    public OnEnter(previousState: BaseGameState, data: Object): void
    {
        super.OnEnter(previousState, data);
        this.InitUiController(["res/atlas/MainUI.atlas"]);
    }

    InitUiController(uiAtlas:Array<string>)
    {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
        this.Controller = new MainMenuUiController();
        this.Controller.zOrder = 100;
        Laya.stage.addChild(this.Controller);
        }.bind(this)));
    }

    public OnAction(gameAction:GameAction, data:Object):void{
        super.OnAction(gameAction, data);
        switch (gameAction)
        {
            case GameAction.Start:
            PlayerData.Instance.Load();
            var lev:LevelItem = LevelData.Instance.LevelItems[PlayerData.Instance.level];
            Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.GameBattleState, lev);
            Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.GameGoalState);
            break;
        }
    }

    public OnExit(next:BaseGameState, data:Object)
    {
        super.OnExit(next, data);
        if (this.Controller != null)
        {
            this.Controller.destroy();
            delete this.Controller;
            this.Controller = null;
        }
    }
}