class MainDialogStateManager extends DialogStateManager<BaseDialogState, DialogAction> {
    public readonly CheckAutoOpenDialogsFrequency: number = 1;
    private readonly LevelLimitedViewShowDelta: number = 2;

    private readonly CommonRoomAutoOpenedDialogStates: Array<DialogStateWrapper> = [];
    private readonly AllRoomAutoOpenedDialogStates: Array<DialogStateWrapper> = [];

    //public LevelUpDialogState:LevelUpDialogState;
    //public LevelUpRewardsDialogState:LevelUpRewardsDialogState;
    //public RewardDialogState:RewardDialogState;

    private LastAction: DialogAction;
    private LastLoggedState: string;
    private NextDialogsAutoOpenCheckTime: number = 0;

    protected OnActionExecuting: boolean;

    //////////定义DialogState///////////////
    public gameResult:GameResultDialogState;
    public GameGoalState:GameGoalDialogState;
    public RankState:RankDialogState;
    public GameEnd:GameEndDialogState;
    public EditDialogState:EditDialogState;
    public PauseDialogState:PauseDialogState;
    ////////////////////////////////////////


    public readonly CheckAndOpenCommonRoomDialogsFunct: Function;

    constructor() {
        super();
        this.gameResult = new GameResultDialogState(this);
        this.GameGoalState = new GameGoalDialogState(this);
        this.RankState = new RankDialogState(this);
        this.EditDialogState = new EditDialogState(this);
        this.GameEnd = new GameEndDialogState(this);
        this.PauseDialogState = new PauseDialogState(this);
        this.CheckAndOpenCommonRoomDialogsFunct = this.CheckAndOpenDialogStates;
    }

    public ApplyProperties() {
    }

    public Init(): void {
        this.ApplyProperties();
        Main.Instance.GameStateManager.OnStateExit.push(this.OnGameStateExit as StateChangeEvent);
    }

    public ExistCommonAutoDialog(dialogState:BaseDialogState):boolean
    {
        for (var i = 0; i < this.CommonRoomAutoOpenedDialogStates.length; i++)
        {
            if (this.CommonRoomAutoOpenedDialogStates[i].DialogState == dialogState)
            {
                return true;
            }
        }
        if (this.CurrentState == dialogState)
            return true;
        return false;
    }

    //如果已存在对应得界面，不再反复弹出
    public AutoOpenDialogOnCommonRooms(dialogState: BaseDialogState, data?:any): void {
        if (this.ExistCommonAutoDialog(dialogState))
            return;
        this.CommonRoomAutoOpenedDialogStates.push(new DialogStateWrapper(dialogState, data));
    }

    private AutoOpenDialogOnAllRooms(dialogState: BaseDialogState): void {
        this.AllRoomAutoOpenedDialogStates.push(new DialogStateWrapper(dialogState, null));
    }

    /**
     * override Function
     */
    public OnUpdate(): void {
        if (this.CurrentState == null) {
            if (Main.Instance.loading) return;

            var time: number = Laya.timer.currTimer;
            if (this.NextDialogsAutoOpenCheckTime < time) { //                if (NextDialogsAutoOpenCheckTime < time) {
                this.NextDialogsAutoOpenCheckTime = time + this.CheckAutoOpenDialogsFrequency; //                    NextDialogsAutoOpenCheckTime = time + CheckAutoOpenDialogsFrequency;
                this.CheckAndOpenDialogStates(this.AllRoomAutoOpenedDialogStates);
            }
        } else {
            this.CurrentState.OnUpdate();
        }
    }

    private CheckAndOpenDialogStates(dialogStates?: Array<DialogStateWrapper>): boolean {
        if (dialogStates.length>0) {
            this.OnActionExecuting = true;

            var removeDialogStateWrapper: DialogStateWrapper = null;
            var opened: boolean;
            for (var key in dialogStates) {
                var dialogStateWrapper: DialogStateWrapper = dialogStates[key];
                var dialogState: BaseDialogState = dialogStateWrapper.DialogState;
                if (!this.OpenDialog(dialogState, dialogStateWrapper.Data)) continue;
                if (dialogState.AutoClear()) {
                    removeDialogStateWrapper = dialogStateWrapper;
                }
                opened = true;
                break;
            }

            this.OnActionExecuting = false;

            if (removeDialogStateWrapper != null) {
                dialogStates.splice(dialogStates.indexOf(removeDialogStateWrapper),1);
            }

            return opened;
        } else {
            if (this.CommonRoomAutoOpenedDialogStates.length==0) return false;
            if (StateManagerBase.StateChanging) return false;
            if (Main.Instance.GameStateManager.CurrentState == null) return false;
            if (Main.Instance.DialogStateManager.CurrentState != null) return false;
            //还差当前汤姆猫的状态是否允许弹窗
            //还差是否打开主菜单
            return this.CheckAndOpenDialogStates(this.CommonRoomAutoOpenedDialogStates);
        }
    }

    public OnBackPress(): boolean {
        return this.FireAction(DialogAction.BackButton, null);
    }

    protected BlockStateChange(nextState: BaseDialogState): boolean {
        if (StateManagerBase.StateChangedInternal && nextState != null) {
            return true;
        }
        return false;
    }

    /**
     * override Function
     */
    public ChangeState(newState: BaseDialogState, data?: Object): boolean {
        var exitState: BaseDialogState = this.CurrentState as BaseDialogState;

        var changedState: boolean = super.ChangeState(newState, data);

        if (changedState) {
            // 可做释放临时资源
            // this.LogScreenChangeEvent(exitState);
        }
        return changedState;
    }

    /**
     * override Function
     */
    public OpenDialog(dialogState: BaseDialogState, data: Object): boolean {
        var dialogOpened: boolean = super.OpenDialog(dialogState, data);
        // if (dialogOpened) {
        //     let commonRoom: CommonRoomState = Main.Instance.GameStateManager.CurrentState as CommonRoomState;
        //     if (commonRoom != null) {
        //         commonRoom.RoomInteractivityController.ResetFingerFollowing();
        //     }
        // }
        return dialogOpened;
    }

    /**
     * override Function
     */
    public OnGameStateExit(state: Object, data: Object): void {
        if (this.CurrentState != null && !(this.CurrentState as BaseDialogState).BlockCloseOnGameStateExit) {
            super.OnGameStateExit(state, data);
        }
    }

    /**
     * override Function
     */
    protected HandleFireAction(gameAction: DialogAction, data: Object): void {
        this.LastAction = gameAction;
        super.HandleFireAction(gameAction, data);
    }

    public IsLevelInRange(level: number): boolean {
        // if (Main.Instance.LevelUpHelper.CurrentLevel < level) return false;
        // if (Main.Instance.LevelUpHelper.CurrentLevel >= level + this.LevelLimitedViewShowDelta) return false;
        return true;
    }
}