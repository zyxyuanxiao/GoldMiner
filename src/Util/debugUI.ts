class DebugUI extends ui.DebugPanelUI
{
    constructor()
    {
        super();
        this.name = "DebugPanel";
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.OnMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.OnMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.OnMouseUp);
        this.btn_play0.on(Laya.Event.CLICK, this, this.OnPlayLevel, [0]);
        this.btn_close.on(Laya.Event.CLICK, this, function(){this.removeSelf();}.bind(this));
        this.zOrder = 500;
        this.left = 100;
        this.top = 45;
    }

    OnPlayLevel(l:number)
    {
        var lev:LevelItem = LevelData.Instance.DebugLevel[l];
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