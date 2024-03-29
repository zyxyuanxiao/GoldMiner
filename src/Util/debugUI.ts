class DebugUI extends ui.DebugPanelUI
{
    levelDataSource:Array<{}>;
    constructor()
    {
        super();
        this.name = "DebugPanel";
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.OnMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.OnMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.OnMouseUp);
        this.btn_close.on(Laya.Event.CLICK, this, function(){this.removeSelf();}.bind(this));
        this.btn_delete.on(Laya.Event.CLICK, this, this.DeletePlayer);
        this.level_lst.scrollBar.visible = false;
        this.levelDataSource = new Array<{}>();
        for (var i:number = 0; i < PlayerData.MaxLevel; i++)
        {
            var mdata = {
                level:i
            }
            this.levelDataSource.push(mdata);
        }

        this.level_lst.array = this.levelDataSource;
        this.level_lst.renderHandler = new Laya.Handler(this, this.RenderLevel, null, false);
        this.left = 100;
        this.top = 45;
    }

    RenderLevel(cell: Laya.Box, index: number)
    {
        var levelcell:ui.LevelButtonUI = cell.getChildAt(0) as ui.LevelButtonUI;
        var l:number = <number>cell.dataSource["level"];
        levelcell.label_level.text = (l + 1).toFixed(0);
        levelcell.on(Laya.Event.CLICK, this, function () {
            this.OnPlayLevel(l);
        }.bind(this), null);
    }

    DeletePlayer()
    {
        PlayerData.Instance.Reset();
        PlayerData.Instance.Save();
    }

    OnPlayLevel(l:number)
    {
        var lev:LevelItem = LevelData.Instance.LevelItems[l];
        if (l != 0)
            PlayerData.Instance.gold = LevelData.Instance.LevelItems[l - 1].Goal;
        Main.Instance.GameStateManager.GameBattleState.StartLevel(lev);
    }

    Drag:boolean = false;
    MousePos:Laya.Vector2 = new Laya.Vector2(0, 0);
    CachePos:Laya.Vector2 = new Laya.Vector2(0, 0);

    //判断是否点击了顶部
    OnMouseDown(e:Laya.Event)
    {
        if (Laya.MouseManager.instance.mouseY > this.y && 
        Laya.MouseManager.instance.mouseY < this.y + 50 && 
        Laya.MouseManager.instance.mouseX > this.x &&
        Laya.MouseManager.instance.mouseX < this.x + this.width)
        {
            this.Drag = true;
            this.MousePos.x = Laya.MouseManager.instance.mouseX;
            this.MousePos.y = Laya.MouseManager.instance.mouseY;
            this.CachePos.x = this.x;
            this.CachePos.y = this.y;
        }
    }

    OnMouseMove(e:Laya.Event)
    {
        if (this.Drag)
        {
            this.x = this.CachePos.x + Laya.MouseManager.instance.mouseX - this.MousePos.x;
            this.y = this.CachePos.y + Laya.MouseManager.instance.mouseY - this.MousePos.y;
        }
    }

    OnMouseUp(e:Laya.Event)
    {
        this.Drag = false;
    }

    showCollider:boolean = false;
    debugCollider:Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
    OnCollierChange()
    {
    }
}

class MeterPanel extends ui.MeterPanelUI
{
    constructor()
    {
        super();
        this.name = "MeterPanel";
        
        this.hook_speed.changeHandler = Laya.Handler.create(this,  this.OnHookSpeedChange, null, false);
        this.btn_close.on(Laya.Event.CLICK, this, function(){this.removeSelf();}.bind(this));
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.OnMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.OnMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.OnMouseUp);
        Laya.timer.frameLoop(1, this, this.update);
        this.zOrder = 500;
    }

    Drag:boolean;
    MousePos:Laya.Vector2 = new Laya.Vector2(0, 0);
    CachePos:Laya.Vector2 = new Laya.Vector2(0, 0);
    update()
    {
        if (BattleUiCtrl.Instance != null)
        {
            //基础速度
            this.label_hookspeed.text = BattleUiCtrl.Instance._EmptyPullSpeed.toFixed(0);
            //最终速度
            this.label_hookSpeedLast.text = BattleUiCtrl.Instance.HookSpeed.toFixed(0);
        }
    }

    //判断是否点击了顶部
    OnMouseDown(e:Laya.Event)
    {
        if (Laya.MouseManager.instance.mouseY > this.y && 
        Laya.MouseManager.instance.mouseY < this.y + 50 && 
        Laya.MouseManager.instance.mouseX > this.x &&
        Laya.MouseManager.instance.mouseX < this.x + this.width)
        {
            this.Drag = true;
            this.MousePos.x = Laya.MouseManager.instance.mouseX;
            this.MousePos.y = Laya.MouseManager.instance.mouseY;
            this.CachePos.x = this.x;
            this.CachePos.y = this.y;
        }
    }

    OnMouseMove(e:Laya.Event)
    {
        if (this.Drag)
        {
            this.x = this.CachePos.x + Laya.MouseManager.instance.mouseX - this.MousePos.x;
            this.y = this.CachePos.y + Laya.MouseManager.instance.mouseY - this.MousePos.y;
        }
    }

    OnMouseUp(e:Laya.Event)
    {
        this.Drag = false;
    }

    OnHookSpeedChange(v:number)
    {
        if (BattleUiCtrl.Instance != null)
            BattleUiCtrl.Instance._EmptyPullSpeed = v;
    }
}