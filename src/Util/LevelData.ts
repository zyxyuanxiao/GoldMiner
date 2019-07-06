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
    TotalGoal:number = 0;
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
    public Reset()
    {
        this.LevelItems.splice(0);
    }

    public AddLevel(l:JSON)
    {
        var lev:LevelItem = new LevelItem();
        lev.level = l["level"];
        if (lev.level == 1)
        {
            lev.TotalGoal = lev.Goal;
            if (lev.TotalGoal == 0)
                lev.TotalGoal = lev.Goal = 650;
        }
        else
            lev.TotalGoal = LevelData.Instance.LevelItems[lev.level - 2].TotalGoal + lev.Goal;
        lev.time = l["time"];
        lev.Mines = new Array<Mine>();
        var m = l["mines"];
        for (var i = 0; i < m.length; i++)
        {
            var ms:Mine = MineFactory.CreateMine(m[i]["type"] as MineType, m[i]["level"], m[i]["x"] / LevelJson.Instance.width * Laya.stage.width, m[i]["y"] / LevelJson.Instance.height * Laya.stage.height);
            lev.Mines.push(ms);
        }
        this.LevelItems.push(lev);
    }

    constructor()
    {
        this.Reset();
    }
}