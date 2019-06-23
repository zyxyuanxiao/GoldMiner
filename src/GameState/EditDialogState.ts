class EditDialogState extends CommonDialogState<EditController>
{
    Controller:EditController;
    OnEnter(previousState: BaseDialogState, data: Object):void
    {
        super.OnEnter(previousState, data);
        this.InitUiController(["res/atlas/MainUI.atlas","res/atlas/style1.atlas"], data as LevelItem);
    }

    InitUiController(uiAtlas:Array<string>, data:LevelItem)
    {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
        this.Controller = new EditController(data);
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

class EditController extends ui.EditDialogUI
{
    level:LevelItem;
    constructor(lev:LevelItem)
    {
        super();
        this.level = lev;
        this.OnResize();
        this.btn_close.on(Laya.Event.CLICK, this, function(){
            Main.Instance.DialogStateManager.ChangeState(null);
        }.bind(this));
        this.btn_apply.on(Laya.Event.CLICK, this, function(){
            this.OnApply();
        }.bind(this));
        this.edit_goal.text = this.level.Goal.toFixed(0);
        this.edit_time.text = this.level.time.toFixed(0);
    }

    OnResize() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }

    OnApply()
    {
        if (this.edit_time.text != "")
        {
            this.level.time = parseInt(this.edit_time.text);
        }
        if (this.edit_goal.text != "")
        {
            this.level.Goal = parseInt(this.edit_goal.text);
        }
        Main.Instance.DialogStateManager.ChangeState(null);
    }
}