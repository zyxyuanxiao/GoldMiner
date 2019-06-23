enum MineType
{
    Stone,//石头
    Gold,//金矿
    Sliver,//银矿
    Diamond,//钻石
    Dragon,//龙骨
    Bone,//骨头
    Bag,//钱袋
    RedDiamond,//红色钻石
    GreenDiamond,//绿色钻石
    Tnt,//炸药桶
    AnimalA,//动物衔着钻石
    AnimalB,//动物衔着绿色宝石
    AnimalC,//动物衔着红色宝石
    Animal,//纯动物
    Power,//力量药剂
}

class MineJson
{
    constructor(t:MineType, l:number, x:number, y:number)
    {
        this.type = t;
        this.level = l;
        this.x = x;
        this.y = y;
    }
    type:MineType;
    level:number;
    x:number;
    y:number;
}

class LevelItemJson
{
    constructor(l:number, g:number, t:number)
    {
        this.level = l;
        this.goal = g;
        this.time = t;
        this.mines = new Array<MineJson>();
    }
    level:number;
    goal:number;
    time:number;
    mines:Array<MineJson>;
    Push(m:MineJson)
    {
        this.mines.push(m);
    }
}

class Mine
{
    static weightBase:number = 10;//基本单位重量
    constructor(level:number, type:MineType, x:number, y:number, v:number)
    {
        switch (type)
        {
            case MineType.Stone:
            var prefix:string = level.toFixed(0);
            if (prefix.length < 2)
                prefix = "0" + prefix;
            this.skinPath = StringTool.format("style1/stone_{0}-sheet0.png", prefix);
            this.backPath = StringTool.format("style1/stone_{0}-sheet0_trace.png", prefix);
            this.name = "石头";
            break;
            case MineType.Gold:
            var prefix:string = level.toFixed(0);
            if (prefix.length < 2)
                prefix = "0" + prefix;
            this.skinPath = StringTool.format("style1/gold_{0}-sheet0.png", prefix);
            this.backPath = StringTool.format("style1/gold_{0}-sheet0_trace.png", prefix);
            this.name = "金子";
            break;
            case MineType.Sliver:
            var prefix:string = level.toFixed(0);
            if (prefix.length < 2)
                prefix = "0" + prefix;
            this.skinPath = StringTool.format("style1/silver_{0}-sheet0.png", prefix);
            this.backPath = StringTool.format("style1/silver_{0}-sheet0_trace.png", prefix);
            this.name = "银子";
            break;
            case MineType.Diamond:
            this.skinPath = "style1/diamond-sheet0.png";
            this.backPath = "style1/diamond_trace-sheet0.png";
            this.name = "钻石";
            break;
            case MineType.Dragon:
            this.skinPath = "style1/skull-sheet0.png";
            this.backPath = "style1/skull_trace-sheet0.png";
            this.name = "龙头骨";
            break;
            //这4种用动画做.
            case MineType.Animal://动物
            this.aniPath = "mole0.ani";
            this.name = "动物";
            break;
            case MineType.AnimalA://动物钻石
            this.aniPath = "mole1.ani";
            this.name = "动物钻";
            break;
            case MineType.AnimalB://动物红宝石
            this.aniPath = "mole2.ani";
            this.name = "动物红钻";
            break;
            case MineType.AnimalC://动物绿宝石
            this.aniPath = "mole3.ani";
            this.name = "动物绿钻";
            break;
            case MineType.RedDiamond://红宝石
            this.skinPath = "style1/ruby-sheet0.png";
            this.backPath = "style1/ruby_trace-sheet0.png";
            this.name = "红宝石";
            break;
            case MineType.GreenDiamond://绿宝石
            this.skinPath = "style1/emerald-sheet0.png";
            this.backPath = "style1/emerald_trace-sheet0.png";
            this.name = "绿宝石";
            break;
            case MineType.Tnt://炸药桶
            this.skinPath = "style1/barrel-sheet0.png";
            this.backPath = "style1/barrel_trace-sheet0.png";
            this.name = "炸药桶";
            break;
            case MineType.Bone://单根骨头
            this.skinPath = "style1/bone-sheet0.png";
            this.backPath = "style1/bone_trace-sheet0.png";
            this.name = "骨头";
            break;
            case MineType.Bag://钱袋子
            this.skinPath = "style1/bag-sheet0.png";
            this.backPath = "style1/bag_trace-sheet0.png";
            this.name = "随机袋";
            break;
            case MineType.Power://强力
            this.skinPath = "style1/bonus_power-sheet0.png";
            this.backPath = "";
            break;
        }
        this.pos = new Laya.Point(x, y);
        this.value = Math.ceil(v);
        this.level = Math.ceil(level);
        this.type = type;
    }

    name:string = "";
    left:boolean = false;
    public OnGotoTheEnd():void
    {
        if (this.ani == null || this.Hooked)
            return;
        this.ani.play();
        this.stopTime = 500 + Math.random() * 1000;
        this.left = !this.left;
        this.ani.scaleX = this.left ? -1 : 1;
        this.tween = Laya.Tween.to(this.ani, {x:this.pos.x + (this.left ? - this.moveRange:this.moveRange)}, this.animTime, Laya.Ease.linearNone, Laya.Handler.create(this, function(){
            this.ani.stop();
            Laya.timer.once(this.stopTime, this, this.OnGotoTheEnd);
        }.bind(this)));
    }

    static PaddingWidth:number = 250;
    static PaddingHeight:number = 550;
    tween:Laya.Tween;
    //把图片加载出来，放到舞台
    public Load(parent:Laya.Node, backparent:Laya.Node)
    {
        if (this.aniPath != null)
        {
            this.ani = new Laya.Animation();
            this.ani.loadAnimation(this.aniPath);
            this.ani.zOrder = 999;
            this.moveSpeed = 30 + Math.random() * 50;
            this.ani.interval = 160 - this.moveSpeed;
            this.moveRange = (Laya.stage.width - Mine.PaddingWidth) / 4;
            this.animTime = (1000.0 * this.moveRange / this.moveSpeed);
            this.stopTime = 500 + Math.random() * 1000;
            parent.addChild(this.ani);
            this.ani.size(100,66);
            this.ani.pos(this.pos.x, this.pos.y);
            this.ani.play();
            this.ani.scaleX = this.left ? -1 : 1;
            this.tween = Laya.Tween.to(this.ani, {x:this.pos.x + (this.left ? -this.moveRange: this.moveRange)}, this.animTime, Laya.Ease.linearNone, Laya.Handler.create(this, function(){
                this.ani.stop();
                Laya.timer.once(this.stopTime, this, this.OnGotoTheEnd);
            }.bind(this)));
        }
        if (this.sprite == null && this.skinPath != null)
        {
            this.sprite = new Laya.Image();
            this.sprite.skin = this.skinPath;
            parent.addChild(this.sprite);
            this.sprite.pos(this.pos.x, this.pos.y);
            this.sprite.anchorX = 0.5;
            this.sprite.anchorY = 0.5;
            if (this.type == MineType.Dragon || 
                this.type == MineType.Bag || 
                this.type == MineType.Diamond || 
                this.type == MineType.RedDiamond || 
                this.type == MineType.GreenDiamond || 
                this.type == MineType.Tnt)
                this.sprite.rotation = 0;
            else
            this.sprite.rotation = Math.random() * 360;
            if (this.backPath != "")
            {
                this.spriteTrace = new Laya.Image();
                this.spriteTrace.skin = this.backPath;
                backparent.addChild(this.spriteTrace);
                this.spriteTrace.pos(this.pos.x, this.pos.y);
                this.spriteTrace.anchorX = 0.5;
                this.spriteTrace.anchorY = 0.5;
                this.spriteTrace.rotation = this.sprite.rotation;
            }
        }
    }

    ResetMine()
    {
        if (this.sprite != null)
        {
            this.sprite.removeSelf();
            this.sprite.destroy();
        }
        this.sprite = null;
    }

    ResetAni()
    {
        if (this.ani != null)
        {
            this.ani.removeSelf();
            this.ani.destroy();
        }
        this.ani = null;
        if (this.tween != null)
        {
            this.tween.clear();
            this.tween = null;
        }
    }

    Reset()
    {
        this.Hooked = false;
        this.hookPoint.x = 0;
        this.hookPoint.y = 0;
        if (this.tween != null)
        {
            this.tween.clear();
            this.tween = null;
        }
        if (this.sprite != null)
        {
            this.sprite.removeSelf();
            this.sprite.destroy();
        }

        if (this.spriteTrace != null)
        {
            this.spriteTrace.removeSelf();
            this.spriteTrace.destroy();
        }

        this.sprite = null;
        this.spriteTrace = null;

        this.ResetAni();
    }

    PlaySound()
    {

    }

    OnHook()
    {
        this.Hooked = true;
        if (this.ani != null && this.ani.isPlaying)
            this.ani.stop();
        if (this.tween != null)
        {
            this.tween.clear();
            this.tween = null;
        }
    }

    Hooked:boolean = false;//是否被抓起

    animTime:number = 0;//单侧动画移动时长
    moveSpeed:number = 0;//动物移动速度
    moveRange:number = 0;//单侧移动距离
    stopTime:number = 0;//单侧停留时间

    Pause()
    {
        if (this.tween != null)
            this.tween.pause();
        if (this.ani != null)
            this.ani.stop();
    }

    Resume()
    {
        if (this.tween != null)
            this.tween.resume();
        if (this.ani != null)
            this.ani.play();
    }

    public Near(m:Mine):boolean
    {
        //m是炸药桶,
        if (this.sprite != null)
        {
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = this.sprite.localToGlobal(this.hookPoint);
            var vec:Laya.Vector2 = new Laya.Vector2(m.hookPoint.x - this.hookPoint.x, m.hookPoint.y - this.hookPoint.y);
            var sqr:number = (vec.x * vec.x + vec.y * vec.y);
            //2者半径+ 300左右
            if (sqr < 90000)
                return true;
        }
        return false;
    }

    //使用道具炸药.
    public Bomb(anchor:Laya.Sprite)
    {
        this.PlayBomb(anchor);
    }

    bomb:Laya.Animation;
    PlayBomb(anchor:Laya.Sprite)
    {
        if (this.bomb != null)
        {
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = anchor.localToGlobal(this.hookPoint);
            this.bomb.pos(this.hookPoint.x, this.hookPoint.y);
            this.bomb.play(0, false);
            return;
        }
        if (this.bomb == null)
        {
            this.bomb = new Laya.Animation();
            this.bomb.loadAnimation("Bomb.ani");
            Laya.stage.addChild(this.bomb);
            this.bomb.size(200,200);
            this.bomb.pivotX = 1.0/2;
            this.bomb.pivotY = 1.0/2;
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = anchor.localToGlobal(this.hookPoint);
            this.bomb.pos(this.hookPoint.x, this.hookPoint.y);
            this.bomb.zOrder = 999;
            this.bomb.play(0, false);
        }
    }

    //TNT-处理爆炸
    PlayExplosion(anchor:Laya.Image)
    {
        this.PlayBarrelExplosion(anchor);
    }

    expolsionBarrel:Laya.Animation;
    hookPoint:Laya.Point = new Laya.Point();
    PlayBarrelExplosion(anchor:Laya.Image)
    {
        if (this.expolsionBarrel != null)
        {
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = anchor.localToGlobal(this.hookPoint);
            this.expolsionBarrel.pos(this.hookPoint.x, this.hookPoint.y);
            this.expolsionBarrel.play(0, false);
            return;
        }
        if (this.expolsionBarrel == null)
        {
            this.expolsionBarrel = new Laya.Animation();
            this.expolsionBarrel.loadAnimation("Barrel.ani");
            Laya.stage.addChild(this.expolsionBarrel);
            this.expolsionBarrel.size(300,300);
            this.expolsionBarrel.pivotX = 1.0/2;
            this.expolsionBarrel.pivotY = 1.0/2;
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = anchor.localToGlobal(this.hookPoint);
            this.expolsionBarrel.pos(this.hookPoint.x, this.hookPoint.y);
            this.expolsionBarrel.zOrder = 999;
            this.expolsionBarrel.play(0, false);
        }
    }
    skinPath:string;
    backPath:string;
    sprite:Laya.Image;
    spriteTrace:Laya.Image;
    value:number;
    level:number;
    type:MineType;
    pos:Laya.Point;
    aniPath:string;
    ani:Laya.Animation;
}

/**
 * 单独一根骨头
 */
class Bone extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.Bone, x, y, 1);
    }
    PlaySound()
    {
        MainAudioPlayer.Instance.PlayBones();
    }
}

/**
 * 钱袋-作用? 随机出道具.
 */
class Bag extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.Bag, x, y, 0);
    }

    PlaySound()
    {
        MainAudioPlayer.Instance.PlayBonus();
    }
}

/**
 * 石头
 */
class Stone extends Mine
{
    constructor(level:number, x:number, y:number)
    {
        super(level, MineType.Stone, x, y, level * 2);
    }

    PlaySound()
    {
        MainAudioPlayer.Instance.PlayStone();
    }
}

class Silver extends Mine
{
    constructor(level:number, x:number, y:number)
    {
        super(level, MineType.Sliver, x, y, Math.floor(level * level * 1.5));
    }
    PlaySound()
    {
        MainAudioPlayer.Instance.PlaySilver();
    }
}

class Gold extends Mine
{
    constructor(level:number, x:number, y:number)
    {
        super(level, MineType.Gold, x, y, level * 5 * level);
    }

    PlaySound()
    {
        MainAudioPlayer.Instance.PlayGold();
    }
}

class Diamond extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.Diamond, x, y, 500);
    }
    PlaySound()
    {
        MainAudioPlayer.Instance.PlayJewel();
    }
}

class RedDiamond extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.RedDiamond, x, y, 300);
    }
    PlaySound()
    {
        MainAudioPlayer.Instance.PlayJewel();
    }
}

class GreenDiamond extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.GreenDiamond, x, y, 150);
    }
    PlaySound()
    {
        MainAudioPlayer.Instance.PlayJewel();
    }
}

/**
 * 增加BUFF-X秒内-道具的重量视为1
 */
class Power extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.Power, x, y, 0);
    }
    PlaySound()
    {
        MainAudioPlayer.Instance.PlayBonus();
    }
}

/**
 * 爆炸-后收回钩子
 */
class Tnt extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.Tnt, x, y, 0);
    }
    
    PlaySound()
    {
        MainAudioPlayer.Instance.PlayTnt();
    }
}

//动物-会行走
class Animal extends Mine
{
    constructor(x:number, y:number, t:MineType, v:number)
    {
        super(0, t, x, y, v);
    }

    PlaySound()
    {
        MainAudioPlayer.Instance.PlayAnimal();
    }
}

/**
 * 钻石-动物
 */
class AnimalA extends Animal
{
    constructor(x:number, y:number)
    {
        super(x, y, MineType.AnimalA, 505);
    }
}

//绿色宝石
class AnimalB extends Animal
{
    constructor(x:number, y:number)
    {
        super(x, y, MineType.AnimalB, 305);
    }
}

//红色宝石
class AnimalC extends Animal
{
    constructor(x:number, y:number)
    {
        super(x, y, MineType.AnimalC, 155);
    }
}

class Dragon extends Mine
{
    constructor(x:number, y:number)
    {
        super(0, MineType.Dragon, x, y, 1);
    }
    PlaySound()
    {
        MainAudioPlayer.Instance.PlaySkull();
    }
}

class MineFactory
{
    constructor()
    {
        for (var i:number = 0; i < 100; i++)
        {
            var sprite = Laya.Pool.getItemByClass("Mine", Laya.Image);
        }
    }

    static CreateMine(type:MineType, level:number, x:number, y:number):Mine
    {
        var rMine:Mine;
        switch (type)
        {
            case MineType.Gold:
            rMine = new Gold(level, x, y);
            break;
            case MineType.Sliver:
            rMine = new Silver(level, x, y);
            break;
            case MineType.Stone:
            rMine = new Stone(level, x, y);
            break;
            case MineType.Diamond:
            rMine = new Diamond(x, y);
            break;
            case MineType.Dragon:
            rMine = new Dragon(x, y);
            break;
            case MineType.Bag:
            rMine = new Bag(x, y);
            break;
            case MineType.Bone:
            rMine = new Bone(x, y);
            break;
            case MineType.RedDiamond:
            rMine = new RedDiamond(x, y);
            break;
            case MineType.GreenDiamond:
            rMine = new GreenDiamond(x, y);
            break;
            case MineType.Power:
            rMine = new Power(x, y);
            break;
            case MineType.Tnt:
            rMine = new Tnt(x, y);
            break;
            case MineType.Animal:
            rMine = new Animal(x, y, MineType.Animal, 5);
            break;
            case MineType.AnimalA:
            rMine = new AnimalA(x, y);
            break;
            case MineType.AnimalB:
            rMine = new AnimalB(x, y);
            break;
            case MineType.AnimalC:
            rMine = new AnimalC(x, y);
            break;
        }
        return rMine;
    }
}
//骨头，炸弹，