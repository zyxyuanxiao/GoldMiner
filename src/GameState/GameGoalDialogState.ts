class GameGoalDialogState extends CommonDialogState<GameGoalUiController>
{
    Controller:GameGoalUiController;
    OnEnter(previousState: BaseDialogState, data: Object):void
    {
        super.OnEnter(previousState, data);
        this.InitUiController(["res/atlas/MainUI.atlas","res/atlas/style1.atlas"]);
    }

    InitUiController(uiAtlas:Array<string>)
    {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
        this.Controller = new GameGoalUiController();
        this.Controller.zOrder = 100;
        Laya.stage.addChild(this.Controller);
        }.bind(this)));
    }

    public OnUpdate():void {
        super.OnUpdate();
    }

    public OnExit(nextState:BaseDialogState, data:Object) {
        if (this.Controller != null)
        {
            this.Controller.destroy();
            Laya.stage.removeChild(this.Controller);
            delete this.Controller;
            this.Controller = null;
        }
        super.OnExit(nextState, data);
    }

    public OnAction(gameAction:DialogAction, data:Object):void{
        super.OnAction(gameAction, data);
        switch (gameAction)
        {
            case DialogAction.Start:
            Main.Instance.GameStateManager.GameBattleState.Play();
            Main.Instance.DialogStateManager.ChangeState(null);
            break;
            case DialogAction.Restart:
            PlayerData.Instance.Reset();
            Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.MenuState);
            Main.Instance.DialogStateManager.ChangeState(null);
            break;
        }
    }
}

class GameGoalUiController extends ui.GameGoalUI
{
    constructor()
    {
        super();
        this.OnResize();
        this.btn_play.on(Laya.Event.CLICK, this, this.OnPlay);
        this.label_level.text = "关卡" + "--";
        if (LevelData.Instance.LevelItems[PlayerData.Instance.level] != null)
        {
            var lev:LevelItem = LevelData.Instance.LevelItems[PlayerData.Instance.level];
            this.label_level.text = StringTool.format("关卡({0}/{1})", lev.level, PlayerData.MaxLevel);
            this.label_goal.text = LevelData.Instance.LevelItems[PlayerData.Instance.level].Goal.toFixed(0);
        }
        else
            this.label_goal.text = "已无可用的关卡内容";
        this.label_gold.text = PlayerData.Instance.gold.toFixed(0);
    }

    OnResize() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }

    OnPlay()
    {
        if (LevelData.Instance.LevelItems[PlayerData.Instance.level] == null)
        {
            Main.Instance.DialogStateManager.FireAction(DialogAction.Restart);
            return;
        }
        Main.Instance.DialogStateManager.FireAction(DialogAction.Start);
    }
}