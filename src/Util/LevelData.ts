class LevelJson
{
    public static LEVELDATA_PATH: string = "Level.json";
    public static Instance:LevelJson;
    width:number = 0;
    height:number = 0;
    constructor() {
        LevelJson.Instance = this;
        if (this.level == null)
            this.level = {};
        var allLevel:JSON = Laya.Loader.getRes(LevelJson.LEVELDATA_PATH);
        if (allLevel == null)
            return;
        this.width = allLevel["designW"];
        this.height = allLevel["designH"];
        for(var i in allLevel["level"]){
            var levelItem = allLevel["level"][i];
            var key = levelItem.level;
            this.level[key] = levelItem;
            LevelData.Instance.AddLevel(levelItem);
        };
        Laya.loader.clearRes(LevelJson.LEVELDATA_PATH);
    }
    level:{};
}

class LevelItem
{
    Mines:Array<Mine> = new Array<Mine>();
    Goal:number = 0;
    public Add(m:Mine)
    {
        this.Mines.push(m);
    }
    level:number = 0;
    time:number = 0;
    Reset()
    {
        for (var i:number = 0; i < this.Mines.length; i++)
        {
            this.Mines[i].Reset();
        }
    }
}

class LevelData
{
    private static _Instance:LevelData;
    public static get Instance():LevelData
    {
        if (LevelData._Instance == null)
            LevelData._Instance = new LevelData();
        return LevelData._Instance;
    }
    LevelItems:Array<LevelItem> = new Array<LevelItem>();
    DebugLevel:Array<LevelItem> = new Array<LevelItem>();
    public Reset()
    {
        this.LevelItems.splice(0);
    }

    public AddLevel(l:JSON)
    {
        var lev:LevelItem = new LevelItem();
        lev.Goal = l["goal"];
        lev.time = l["time"];
        lev.level = l["level"];
        lev.Mines = new Array<Mine>();
        var m = l["mines"];
        for (var i = 0; i < m.length; i++)
        {
            var ms:Mine = MineFactory.CreateMine(m[i]["type"] as MineType, m[i]["level"], m[i]["x"] / LevelJson.Instance.width * Laya.stage.width, m[i]["y"] / LevelJson.Instance.height * Laya.stage.height);
            lev.Mines.push(ms);
        }
        this.LevelItems.push(lev);
    }

    //创建一个随机关卡.关卡数，道具配置要合理，否则可能无法过关
    public CreateLevel(l:number):LevelItem
    {
        var lev:LevelItem = new LevelItem();
        lev.Goal = this.CalcGoal(l);
        var gold0:Mine = MineFactory.CreateMine(MineType.Gold, 3, 20, 20);
        lev.Add(gold0);
        var gold1:Mine = MineFactory.CreateMine(MineType.Stone, 1, 62, 85);
        var sliver:Mine = MineFactory.CreateMine(MineType.Sliver, 1, 120, 240);
        var diamond:Mine = MineFactory.CreateMine(MineType.Diamond, 1, 240, 125);
        var Dragon:Mine = MineFactory.CreateMine(MineType.Dragon, 1, 280, 325);
        for (var i = 0; i < 5; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var stone:Stone = MineFactory.CreateMine(MineType.Stone, Math.random() * 9 + 1, x, y);
            lev.Add(stone);
        }
        for (var i = 0; i < 5; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var gold:Gold = MineFactory.CreateMine(MineType.Gold, Math.random() * 9 + 1, x, y);
            lev.Add(gold);
        }
        for (var i = 0; i < 5; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var sliver:Silver = MineFactory.CreateMine(MineType.Sliver, Math.random() * 9 + 1, x, y);
            lev.Add(sliver);
        }
        for (var i = 0; i < 2; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var tnt:Tnt = MineFactory.CreateMine(MineType.Tnt, 0, x, y);
            lev.Add(tnt);
        }
        for (var i = 0; i < 1; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var bone:Bone = MineFactory.CreateMine(MineType.Bone, 0, x, y);
            lev.Add(bone);
        }
        for (var i = 0; i < 4; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var bag:Bag = MineFactory.CreateMine(MineType.Bag, 0, x, y);
            lev.Add(bag);
        }
        for (var i = 0; i < 1; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var dia:RedDiamond = MineFactory.CreateMine(MineType.RedDiamond, 0, x, y);
            lev.Add(dia);
        }
        for (var i = 0; i < 1; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var dia:GreenDiamond = MineFactory.CreateMine(MineType.GreenDiamond, 0, x, y);
            lev.Add(dia);
        }
        for (var i = 0; i < 1; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var p:Animal = MineFactory.CreateMine(MineType.Animal, 0, x, y);
            lev.Add(p);
        }
        for (var i = 0; i < 1; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var p:AnimalA = MineFactory.CreateMine(MineType.AnimalA, 0, x, y);
            lev.Add(p);
        }
        for (var i = 0; i < 1; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var p:AnimalB = MineFactory.CreateMine(MineType.AnimalB, 0, x, y);
            lev.Add(p);
        }
        for (var i = 0; i < 1; i++)
        {
            var x:number = Math.ceil(Math.random() * (Laya.stage.width - 250));
            var y:number = Math.ceil(Math.random() * (Laya.stage.height - 520) + 30);
            var p:AnimalC = MineFactory.CreateMine(MineType.AnimalC, 0, x, y);
            lev.Add(p);
        }
        lev.Add(gold1);
        lev.Add(sliver);
        lev.Add(diamond);
        lev.Add(Dragon);
        lev.level = l;
        lev.time = 45;
        return lev;
    }

    cache:Array<number> = new Array<number>(650, 1195);
    CalcGoal(l:number):number
    {
        if (this.cache.length > l - 1)
            return this.cache[l - 1];
        if (l == 1)
            return this.cache[0];
        else if (l == 2)
            return this.cache[1];
        else
        {
            var m:number = l-1;
            var n:number = l-2;
            var mv:number = this.CalcGoal(m);
            if (this.cache.length < m)
                this.cache.push(mv);
            var nv:number = this.CalcGoal(n);
            if (this.cache.length < n)
                this.cache.push(nv);
            return 2 * mv - nv + 270;
        }
    }

    constructor()
    {
        this.Reset();
        // for (var i = 1; i <= 20; i++)
        // {
        //     var lev:LevelItem = this.CreateLevel(i);
        //     this.LevelItems.push(lev);
        // }

        // var lev0:LevelItem = this.CreateDebugLevel0();
        // this.DebugLevel.push(lev0);
    }

    //场景中间一个大石头
    CreateDebugLevel0():LevelItem
    {
        var lev:LevelItem = new LevelItem();
        var gold0:Mine = MineFactory.CreateMine(MineType.Gold, 10, (Laya.stage.width - 250) / 2, 30 + (Laya.stage.height - 550) / 2);
        lev.Add(gold0);
        lev.Goal = gold0.value;
        lev.level = 1;
        lev.time = 1000;
        return lev;
    }
}