class MainGameStateManager extends GameStateManager<BaseGameState, GameAction> {
    private readonly AutoOpenedCommonRoomStates: Array<IAutoOpenState>;
    public readonly CheckAndOpenCommonRoomStatesFunct: Function;
    public LastActionPosition: number = -1;
    public static Instance: MainGameStateManager;
    public LastAction: GameAction;
    public StartUpState:StartUpState;
    public MenuState:MenuState;
    public GameBattleState:GameBattleState;
    public ShopState:ShopState;
    public LevelEditState:LevelEditState;
    public NullState:NullState;
    constructor() {
        super();
        this.StartUpState = new StartUpState(this);
        this.MenuState = new MenuState(this);
        this.GameBattleState = new GameBattleState(this);
        this.ShopState = new ShopState(this);
        this.LevelEditState = new LevelEditState(this);
        this.NullState = new NullState(this);
        MainGameStateManager.Instance = this;
        this.CheckAndOpenCommonRoomStatesFunct = this.CheckAndOpenCommonRoomStates;
    }

    /**
     * override Function
     */
    public Init(): void { //        public override void Init() {
        MainGameStateManager.Instance = this;
        this.ApplyProperties();
        // AddAutoOpenCommonRoomState(this.AgeGateState); //            AddAutoOpenCommonRoomState(AgeGateState);
        // AddAutoOpenCommonRoomState(this.RestoreState); //            AddAutoOpenCommonRoomState(RestoreState);
        // Pair<BaseGameState, object> stateAndData = GetEntryStateAndData();
        // Data = stateAndData.Second;
        // EntryState = stateAndData.First;
        // NextState = EntryState;
        // O7Log.DebugT(Tag, "Set initial state: {0}", EntryState);
        super.Init();
    }

    private ApplyProperties(): void {

    }

    public GetEntryState(): Pair<BaseGameState, Object> {
        return this.GetEntryStateAndData();

    }

    protected GetEntryStateAndData(): Pair<BaseGameState, Object> {
        var entryData: BaseGameState;
        entryData = this.StartUpState;
        return new Pair<BaseGameState, Object>(entryData, this);
    }

    /**
     * override Function
     */
    public ChangeState(newState: BaseGameState, data?: Object): boolean {
        GameStateManager.RoomLoadComplete = false;
        //console.log("from state change to state", this.CurrentState, newState);
        var r:boolean = super.ChangeState(newState, data);
        return r;
    }

    /**
     * override Function
     */
    public OnUpdate(): void {
        super.OnUpdate();
    }

    /**
     * override Function
     */
    protected OnStateChanged(): void {
        super.OnStateChanged();
    }

    /**
     * override Function
     */
    protected CanLoadScene(): boolean {
        var currentState: BaseGameState = this.CurrentState as BaseGameState;
        var nextState: BaseGameState = this.NextState as BaseGameState;

        return nextState.LevelName != null && (this.CurrentState == null || nextState.LevelName != currentState.LevelName) || this.ForceStateReload;
    }

    /**
     * override Function
     */
    protected LoadSceneName(): string {
        return (this.NextState as BaseGameState).LevelName;
    }

    /**
     * override Function
     */
    protected ToNullState(): void {
        // Main.Instance.QuitApp();
    }

    /**
     * override Function
     */
    public OnAppPause(): void {
        super.OnAppPause();
        // UserPrefs.SetInt(this.LastStateKey, (int) LastSavedState);
    }

    /**
     * override Function
     */
    public OnBackPress(): boolean {
        return this.FireAction(GameAction.BackButton);
    }

    private CheckAndOpenCommonRoomStates(): boolean {
        // return this.CheckAndOpenStates(this.AutoOpenedCommonRoomStates);
        return false;
    }

    private AddAutoOpenCommonRoomState(autoOpenState: IAutoOpenState): void {
        this.AutoOpenedCommonRoomStates.push(autoOpenState);
    }

    protected HandleFireAction(gameAction: GameAction, data: Object): void {
        this.LastAction = gameAction;
        super.HandleFireAction(gameAction, data);
    }

    public get IsSocialState(): boolean {
        return false;
    }
}