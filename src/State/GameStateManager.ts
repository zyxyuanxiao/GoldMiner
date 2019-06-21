abstract class GameStateManager<S extends State<S,A>,A> extends StateManager<S,A> {
    public OnStatePreExitPostRender:Function;
    public static RoomLoadComplete:boolean = false;
    public EntryState:S;

    public InclusiveCurrentState:State<S,A>;

    private PendingDialogOpenChecks:Array<Function> = [];

    public DialogStateManager:StateManager<S,A>;
    /**
     * virtual Function
     * 初始化调用
     */
    public Init():void {
        this.EnterInitialState();
    }
    /**
     * virtual Function
     * 每帧刷新调用
     */
    public OnUpdate():void {
        super.OnUpdate();

        if(this.CurrentState == null) {
            return;
        }

        this.PendingDialogOpenChecks = [];
        this.CurrentState.OnUpdate();
        this.CheckAndOpenAllDialogs();
        this.PendingDialogOpenChecks = [];
    }
    //override
    protected BlockStateChange(newState:S):boolean {
        if(newState == null) {
            return true;
        }
        return super.BlockStateChange(newState);
    }
    
    private CheckAndOpenAllDialogs():void {
        for (var i = 0; i < this.PendingDialogOpenChecks.length; i++) {
            var func = this.PendingDialogOpenChecks[i];
            
            if (!this.CanAutoOpen())
                return;

            if (func())
                return;
        }
    }

    public TryToAutoOpen(openingMethods:Function):void {
        this.PendingDialogOpenChecks.push(openingMethods);
    }
    /**
     * virtual Function
     * 是否可以自动打开
     */
    public CanAutoOpen():boolean {

        if (StateManager.StateChanging)
            return false;

        return true;
    }
    
    public CheckAndOpenState(state:S, data?:any):boolean {
        if (this.DialogStateManager != null && this.DialogStateManager.IsActive()) return false;

        if (!state.CanOpen()) return false;

        this.OnActionExecuting = true;
        var changedState = this.ChangeState(state, data);
        this.OnActionExecuting = false;
        return changedState;
    }

    public CheckAndOpenStates(autoOpenStates:Array<S>):boolean {
        var openGameState:S = null;

        if (this.DialogStateManager != null && this.DialogStateManager.IsActive())
            return false;

        var removeState:S = null;

        for (var i = 0; i < autoOpenStates.length; i++) {
            var gameState:S = autoOpenStates[i];

            if(gameState.CanOpen()) {
                openGameState = gameState;

                if(gameState.AutoClear()) {
                    removeState = gameState;
                }
                break;
            }
        }

        if (removeState != null) {
            var index = autoOpenStates.indexOf(removeState);
            autoOpenStates[index] = null;
        }

        var changedState:boolean = false;
        if (openGameState != null) {
            this.OnActionExecuting = true;
            changedState = this.ChangeState(openGameState, this);
            this.OnActionExecuting = false;
        }
        return changedState;
    }
    /**
     * 是否能够加载scene场景
     */
    protected abstract CanLoadScene():boolean;

    protected abstract LoadSceneName():string;
    //override
    protected StartStateChange():void {
        this.InclusiveCurrentState = this.NextState;
        StateManager.StateChanging = true;
        StateManager.StateChangedInternal = true;
        if (this.CanLoadScene()) {
            Laya.loader.create(this.LoadSceneName(), Laya.Handler.create(this, function(){
                this.Onload();
            }.bind(this)), null, Laya.Scene);
        } else {
            super.StartStateChange();
        }
    }

    Onload()
    {
        super.StartStateChange();
    }
    
    public EnterInitialState():void {
        var stateAndData:Pair<S,Object> = this.GetEntryStateAndData();

        this.Data = stateAndData.Value;
        this.EntryState = stateAndData.Key;

        this.NextState = this.EntryState;
        this.InclusiveCurrentState = this.NextState;

        if (this.PreviousState == null) {
            // this.OnStatePreEnterEvent(this.NextState, this.PreviousState, this.Data);
            // 改为直接切换到主界面
            this.ChangeState(this.NextState, this.Data);
        }
    }

    protected abstract GetEntryStateAndData():Pair<S,any>;
    /**
     * virtual Function
     * 加载Scene回调
     * @param lvl 
     */
    public OnLevelWasLoaded(lvl:number):void {
        this.OnStateChanged();
    }
    //override
    public FireAction(gameAction:A, data?:Object):boolean {
        // if (StateManager.ActionTriggeredInUpdate)
        // {
        //     return false;
        // }
            

        return super.FireAction(gameAction, data);
    }

    public OnStatePreExitPostRenderEvent():void {
        if (this.CurrentState == null)
            return;

        if (this.OnStatePreExitPostRender != null) {
            this.OnStatePreExitPostRender(this.NextState, this.Data);
        }
    }
    //override
    protected  OnStateExitEvent(currentState:S, state:S, data:any) {
        if (this.DialogStateManager != null)
            this.DialogStateManager.OnGameStateExit(currentState, data);

        super.OnStateExitEvent(currentState, state, data);
    }

    public abstract OnBackPress():boolean;
}