class LevelEditState extends BaseGameState {
    Controller: LevelEditController;
    OnEnter(previousState: BaseGameState, data: Object): void  {
        this.InitUiController(["res/atlas/MainUI.atlas", "res/atlas/style1.atlas"], data);
    }

    InitUiController(uiAtlas: Array<string>, opt: any)  {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
            this.Controller = new LevelEditController();
            this.Controller.zOrder = 100;
            Laya.stage.addChild(this.Controller);
        }.bind(this)));
    }

    public OnUpdate(): void {
        super.OnUpdate();
    }

    public OnExit(nextState: BaseGameState, data: Object) {
        if (this.Controller != null)  {
            this.Controller.destroy();
            Laya.stage.removeChild(this.Controller);
            delete this.Controller;
            this.Controller = null;
        }
        super.OnExit(nextState, data);
    }

    //调试功能
    public TestLevel(level: LevelItem)  {

        // (this.Controller as BattleUiCtrl).LoadLevel(level);
        // (this.Controller as BattleUiCtrl).StartGame();
    }
}

class LevelEditController extends ui.LevelEditorUI {
    level: LevelItem;
    levelDataSource: any;
    mineDataSource: any;
    constructor()  {
        super();
        this.btn_saveLevel.on(Laya.Event.CLICK, this, this.SaveLevel);
        this.btn_LevelGoal.on(Laya.Event.CLICK, this, this.LevelGoal);
        this.btn_testLevel.on(Laya.Event.CLICK, this, this.TestLevel);
        this.btn_openlevel.on(Laya.Event.CLICK, this, this.ShowLevel);
        this.btn_addmine.on(Laya.Event.CLICK, this, this.ShowMine);
        this.levelDataSource = Array<{}>();
        this.OnResize();



        for (var i = 0; i < LevelData.Instance.LevelItems.length; i++) {
            var _data = {
                text: { text: StringTool.format("关卡:{0}", LevelData.Instance.LevelItems[i].level), color: "#000000" },
                type: false
            };
            this.levelDataSource.push(_data);
        }

        this.levelList.array = this.levelDataSource;
        this.levelList.renderHandler = new Laya.Handler(this, this.RenderLevel, null, false);

        this.mineDataSource = Array<{}>();
        for (var i: number = 1; i <= 10; i++)  {
            var m: Mine = MineFactory.CreateMine(MineType.Stone, i, 0, 0);
            this.mineDataSource.push(m);
        }
        for (var i: number = 1; i <= 10; i++)  {
            var m: Mine = MineFactory.CreateMine(MineType.Sliver, i, 0, 0);
            this.mineDataSource.push(m);
        }
        for (var i: number = 1; i <= 10; i++)  {
            var m: Mine = MineFactory.CreateMine(MineType.Gold, i, 0, 0);
            this.mineDataSource.push(m);
        }
        var m0: Mine = MineFactory.CreateMine(MineType.Diamond, 1, 0, 0);
        var m1: Mine = MineFactory.CreateMine(MineType.Dragon, 1, 0, 0);
        var m2: Mine = MineFactory.CreateMine(MineType.Bone, 1, 0, 0);
        var m3: Mine = MineFactory.CreateMine(MineType.Bag, 1, 0, 0);
        var m4: Mine = MineFactory.CreateMine(MineType.RedDiamond, 1, 0, 0);
        var m5: Mine = MineFactory.CreateMine(MineType.GreenDiamond, 1, 0, 0);
        var m6: Mine = MineFactory.CreateMine(MineType.Tnt, 1, 0, 0);
        var m7: Mine = MineFactory.CreateMine(MineType.AnimalA, 1, 0, 0);
        var m8: Mine = MineFactory.CreateMine(MineType.AnimalB, 1, 0, 0);
        var m9: Mine = MineFactory.CreateMine(MineType.AnimalC, 1, 0, 0);
        var m10: Mine = MineFactory.CreateMine(MineType.AnimalA, 1, 0, 0);
        this.mineDataSource.push(m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10);
        this.mineList.array = this.mineDataSource;
        this.mineList.renderHandler = new Laya.Handler(this, this.RenderMine);
    }

    OnResize()  {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }

    RenderLevel(cell: Laya.Box, index: number)  {
        console.log(cell, index);
        var levelcell: ui.LevelButtonUI = cell.getChildAt(0) as ui.LevelButtonUI;
        levelcell.label_level.text = cell.dataSource["text"]["text"];
        levelcell.on(Laya.Event.CLICK, this, function () {
            console.log("click lev:", index);
            if (this.level != null)  {
                this.SaveLevel();
                this.level = null;
            }
            this.level = LevelData.Instance.LevelItems[index];
            this.OnOpenLevel();
            this.ShowLevel();
            //this.label_level.text;
        }.bind(this), null);
    }

    RenderMine(cell: Laya.Box, index: number)  {
        var levelcell: ui.LevelButtonUI = cell.getChildAt(0) as ui.LevelButtonUI;
        var m:Mine = cell.dataSource as Mine;
        if (m.type == MineType.Stone || m.type == MineType.Gold || m.type == MineType.Sliver)
            levelcell.label_level.text = StringTool.format("{0}-{1}-{2}", m.name, m.level, m.value);
        else
            levelcell.label_level.text = m.name;
        levelcell.on(Laya.Event.CLICK, this, function () {
            this.AddMine(m);
            this.ShowMine();
        }.bind(this), null);
    }

    OnOpenLevel()  {
        
        this.label_level.text = StringTool.format("当前关卡:{0}", this.level.level);
        this.level_goal.text = "关卡目标:" + this.level.Goal.toFixed(0);
        this.level_time.text = "关卡限时:" + this.level.time.toFixed(0);

    }

    levelExpand: boolean = false;
    ShowLevel()  {
        if (this.levelExpand)  {
            Laya.Tween.to(this.levelList, { left: -255 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, ()=>{
                this.levelExpand = false;
            }), 500);
        }
        else  {
            Laya.Tween.to(this.levelList, { left: 0 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, ()=>{
                this.levelExpand = true;
            }), 500);
        }
    }
    mineExpand: boolean = false;
    ShowMine()  {
        if (this.mineExpand)  {
            Laya.Tween.to(this.mineList, { right: -540 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, ()=>{
                this.mineExpand = false;
            }), 500);
        }
        else  {
            Laya.Tween.to(this.mineList, { right: 0 }, 500, Laya.Ease.cubicOut, Laya.Handler.create(this, ()=>{
                this.mineExpand = true;
            }), 500);
        }
    }

    AddMine(m:Mine)
    {

    }

    SaveLevel()  {
        if (this.level != null)
        {
            LevelData.Instance.LevelItems[this.level.level - 1] = this.level;
            var leveldata:Array<LevelJson> = new Array<LevelJson>();
            for (var i = 0; i < LevelData.Instance.LevelItems.length; i++)
            {
                var lev:LevelItem = LevelData.Instance.LevelItems[i];
                var levSave:LevelItemJson = new LevelItemJson(lev.level, lev.Goal, lev.time);
                for (var j:number = 0; j < lev.Mines.length; j++)
                {
                    var m:Mine = lev.Mines[j];
                    var mineSave:MineJson = new MineJson(m.type, m.level, m.pos.x, m.pos.y);
                    levSave.Push(mineSave);
                }
                leveldata.push(levSave);
            }
            var levelJson:string = JSON.stringify(leveldata);
            console.log(levelJson);
            var file:File = new File([levelJson], "data.txt", {type: "text/plain;charset=utf-8"});
            saveAs(file);
            this.level = null;
        }
    }

    LevelGoal()  {
        if (this.level == null)  {
            FlutterManager.Instance.OpenFlutterManager("还未打开任何关卡");
            return;
        }
        Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.EditDialogState, this.level);
    }

    TestLevel()  {

    }
}