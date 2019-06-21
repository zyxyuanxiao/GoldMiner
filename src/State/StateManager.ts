/**
 * @author wutude
 * 
 * 完成情况：已完成
 * 复原特殊情况说明：
 * 1、因不能类重名原有StateManager改为StateManagerBase
 * 2、因不能内部类原有StateManager.State改为单独State
*/

abstract class StateManagerBase {

    public static StateChanging:boolean;

    public static StateChangedInternal:boolean;

    public static IsUpdateBlocked:boolean;

    public static IsActionBlocked:boolean;

    private static _IsActionAndUpdateBlocked:boolean;

    public static get IsActionAndUpdateBlocked() {
        this._IsActionAndUpdateBlocked = this.IsUpdateBlocked && this.IsActionBlocked;
        return this._IsActionAndUpdateBlocked;
    }
    public static set IsActionAndUpdateBlocked(value:boolean) {
        this.IsActionBlocked = value;
        this.IsUpdateBlocked = value;
    }


    abstract IsActive():boolean;
    /**
     * virtual Function
     * 当前状态退出
     * @param state 
     * @param data 
     */
    public OnGameStateExit(state:any, data:any):void {
    }
    /**
     * virtual Funciton
     * 当前状态进入
     * @param state 
     * @param data 
     */
    public OnGameStateEnter(state:any, data:any):void {
    }
}
abstract class State<S extends State<S,A>,A> {

    private EnqueuedState:S;
    private EnqueuedData:any;
    // public InterRoomSlotController:MainRoomSlotController = null;
    protected StateManager:StateManager<S,A>;

    constructor(stateManager:StateManager<S,A>) {
        this.StateManager = stateManager;
    }

    abstract OnEnter(previousState:State<S,A>, data:Object):void;

    abstract OnExit(nextState:State<S,A>, data:Object):void;

    abstract OnAction(gameAction:A, data:Object):void;

    /**
     * virtual Function
     * 进入状态前准备
     * @param previousState 
     * @param data 
     */
    public OnPreEnter(previousState:State<S,A>, data:Object):State<S,A> {
        return this;
    }
    /**
     * virtual Funtion
     * 退出状态前
     * @param nextState 
     * @param data 
     */
    public OnPreExit(nextState:State<S,A>, data:any):void {
    }

    /**
     * virtual Funtion
     * 最终退出状态
     * @param nextState 
     * @param data 
     */
    public OnPostExit(force?: boolean):void
    {

    }

    /**
     * virtual Function
     * 应用回到前台
     */
    public OnAppResume():void {
    }
    
    /**
     * virtual Function
     * 应用暂停
     */
    public OnAppPause():void {
    }
    /**
     * virtual Function
     * 每帧Update刷新
     */
    public OnUpdate():void {
        if (this.EnqueuedState != null) {
            if (this.ChangeStateTwo(this.EnqueuedState, this.EnqueuedData)) {
                this.EnqueuedState = null;
                this.EnqueuedData = null;
            }
        }
    }
    /**
     * virtual Function
     * 每帧刷新结束前调用
     */
    public OnLateUpdate():void {
    }

    protected EnqueueStateChange(newState:S):boolean {
        return this.EnqueueStateChangeTwo(newState, null);
    }

    protected EnqueueStateChangeTwo(newState:S, data:any):boolean {
        if (this.EnqueuedState != null)
            return false;

        this.EnqueuedState = newState;
        this.EnqueuedData = data;
        if (this.ChangeStateTwo(newState, data)) {
            this.EnqueuedState = null;
            this.EnqueuedData = null;
        }
        return true;
    }
    /**
     * virtual Function
     * 改变状态
     * @param newState 
     */
    protected ChangeState(newState:S):boolean {
        return this.ChangeStateTwo(newState, null);
    }
    /**
     * virtual Function
     * 改变状态
     * @param newState 
     * @param data 
     */
    protected ChangeStateTwo(newState:S, data:any):boolean {
        return this.StateManager.ChangeState(newState, data);
    }
    /**
     * virtual Function
     * 是否能打开
     */
    public CanOpen():boolean {
        return false;
    }
    /**
     * virtual Function
     * 是否自动清理
     */
    public AutoClear():boolean{
        return false;
    }
    /**
     * virtual Function
     * 是否有其他dialogs阻碍
     * @param dialogState 
     */
    public BlockOtherDialogs(dialogState:S):boolean{
        return false;
    }
}
interface StateChangeEvent {
    (state:any, data:any):void;
}

interface StateHelper
{

}
abstract class StateManager<S extends State<S,A>, A> extends StateManagerBase{

    // protected virtual string Tag { get { return GetType().Name; } }

    public OnStatePreEnter:Array<StateChangeEvent> = [];
    public OnStatePreExit:Array<StateChangeEvent> = [];
    public OnStateExit:Array<StateChangeEvent> = [];
    public OnStateEnter:Array<StateChangeEvent> = [];
    
    protected ActionProcessing:boolean;

    public CurrentState:State<S,A>;

    public PreviousState:State<S,A>;

    public NextState:State<S,A>;

    protected Data:any;

    private PassForwardData:any;

    public IsFirstRoomLoaded:boolean;

    public ForceStateReload:boolean;

    protected OnActionExecuting:boolean;

    public IsActive():boolean {
        return this.CurrentState != null;
    }
    /**
     * virtual Function
     * 游戏回到前台
     */
    public OnAppResume():void {
        // O7Log.InfoT(Tag, "OnAppResume {0}", CurrentState);

        if (this.CurrentState != null) {
            this.CurrentState.OnAppResume();
        }
    }
    /**
     * virtual Function
     * 游戏暂停
     */
    public OnAppPause():void {
        // O7Log.InfoT(Tag, "OnAppPause {0}", CurrentState);

        if (this.CurrentState != null) {
            this.CurrentState.OnAppPause();
        }
    }
    /**
     * virtual Function
     * 每帧刷新结束前回调
     */
    public OnLateUpdate():void {
        if (this.CurrentState != null) {
            this.CurrentState.OnLateUpdate();
        }
    }

    /**
     * virtual Function
     * 发送事件
     * @param gameAction 
     * @param data 
     */
    public FireAction(gameAction:A, data?:Object):boolean {
        if (StateManagerBase.IsUpdateBlocked || StateManagerBase.IsActionBlocked) {
            return false;
        }
        if (this.CurrentState == null) {
            return false;
        }

        if (StateManagerBase.StateChanging) {
            return false;
        }

        this.ActionProcessing = true;

        this.PassForwardData = data;
        this.HandleFireAction(gameAction, data);
        this.PassForwardData = null;

        this.ActionProcessing = false;
        return true;
    }
    /**
     * virtual Function
     * 处理收到的Aciton
     * @param gameAction 
     * @param data 
     */
    protected HandleFireAction(gameAction:A, data:any):void {
        this.CurrentState.OnAction(gameAction, data);
    }
    /**
     * virtual Function
     * 是否不适合改变状态
     * @param newState 
     */
    protected BlockStateChange(newState:State<S,A>):boolean {
        return StateManagerBase.StateChanging && newState != null;
    }
    /**
     * virtual Function
     * 改变状态
     * @param newState 
     * @param data 
     */
    public ChangeState(newState:State<S,A>, data:any):boolean {
        if (this.BlockStateChange(newState))
            return false;

        if (newState == null) {
            if (this.CurrentState != null) {
                if (data==null) {
                    data = this.PassForwardData;
                }
                
                this.OnStatePreExitEvent(this.CurrentState, null, data);
                this.OnStateExitEvent(this.CurrentState, null, data);
            }
            this.CurrentState = null;
            this.ToNullState();
            return true;
        }

        if (newState != this.CurrentState || this.ForceStateReload) {
            if (data==null){
                data = this.PassForwardData;
            }

            this.Data = data;
            this.NextState = newState;
            this.PreviousState = this.CurrentState;

            if (this.CurrentState != null) {
                this.OnStatePreExitEvent(this.CurrentState, this.NextState, this.Data);
            }
            this.OnStatePreEnterEvent(this.NextState, this.CurrentState, data);

            this.StartStateChange();

            this.ForceStateReload = false;
        }
        return true;
    }
    /**
     * virtual Function
     * 状态切换调用
     */
    protected OnStateChanged():void {
        StateManagerBase.StateChangedInternal = false;

        if (this.PreviousState != null) {
            this.OnStateExitEvent(this.PreviousState, this.NextState, this.Data);
        }

        this.CurrentState = this.NextState;

        if (this.CurrentState != null) {
            this.OnStateEnterEvent(this.CurrentState, this.PreviousState, this.Data);
        }

        this.Data = null;
        this.IsFirstRoomLoaded = true;

        StateManagerBase.StateChanging = false;
    }
    /**
     * virtual Function
     * 开始状态切换
     */
    protected StartStateChange():void {
        StateManagerBase.StateChangedInternal = true;
        this.OnStateChanged();
    }

    protected abstract ToNullState():void;

    public Update():void {
        if (StateManagerBase.IsUpdateBlocked) {
            return;
        }
        this.OnUpdate();
    }
    /**
     * virtual Function
     * 每帧刷新调用
     */
    public OnUpdate():void {
    }

    protected OnStatePreEnterEvent(newState:State<S,A>, state:State<S,A>, data:any):void {

        var rerouteState = newState.OnPreEnter(state, data);
        
        while (rerouteState != newState) {
            this.NextState = rerouteState;
            newState = this.NextState;
            if (newState == null)
                break;
            rerouteState = newState.OnPreEnter(state, data);
        }

        if (this.OnStatePreEnter.length > 0) {
            this.OnStatePreEnter.forEach(element => {
                element(state, data);
            });
        }
    }

    private OnStatePreExitEvent(currentState:State<S,A>, state:State<S,A>, data:any):void {
        currentState.OnPreExit(state, data);
        if (this.OnStatePreExit.length > 0) {
            this.OnStatePreExit.forEach(element => {
                element(state, data);
            });
        }
    }
    /**
     * virtual Function
     * 状态退出回调
     * @param currentState 
     * @param state 
     * @param data 
     */
    protected OnStateExitEvent(currentState:State<S,A>, state:State<S,A>, data:any):void {
        currentState.OnExit(state, data);
        if (this.OnStateExit.length > 0) {
            this.OnStateExit.forEach(element => {
                element(currentState, data);
            });
        }
    }

    private OnStateEnterEvent(currentState:State<S,A>, state:State<S,A>, data:any):void {
        currentState.OnEnter(state, data);
        if (this.OnStateEnter.length > 0) {
            this.OnStateEnter.forEach(element => {
                element(currentState, data);
            });
        }
    }
}