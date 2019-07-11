class Util
{
    public static start()
    {
        PlayerData.Instance.Load();
        if (PlayerData.Instance.gold == 0)
        {
            var lev:LevelItem = LevelData.Instance.LevelItems[PlayerData.Instance.level];
            Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.GameBattleState, lev);
            Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.GameGoalState);
        }
        else
        {
            //进商店.
            Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.ShopState);
            Main.Instance.DialogStateManager.ChangeState(null);
        }
    }

    public static CalcGoal(n:number)
    {
        return 105 + 545 * n + 135 * (n-1)*(n-2);
    }
}