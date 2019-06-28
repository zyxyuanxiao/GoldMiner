class MainAudioPlayer {
    private static _Instance: MainAudioPlayer;
    public static get Instance(): MainAudioPlayer {
        if (MainAudioPlayer._Instance == null)
            MainAudioPlayer._Instance = new MainAudioPlayer();
        return MainAudioPlayer._Instance;
    }

    constructor()
    {
    }


    /**
     * 播放绳子伸缩声音
     */
    Rope: Laya.SoundChannel;
    PlayRopeSound() {
        this.StopRopeSound();
        if (this.Rope == null)
            this.Rope = Laya.SoundManager.playSound("Sounds/winch.wav", 0);
    }

    StopRopeSound() {
        if (this.Rope != null) {
            console.log("rope sound stoped");
            this.Rope.stop();
            Laya.SoundManager.removeChannel(this.Rope);
            this.Rope = null;
        }
    }

    Timers: Laya.SoundChannel;
    PlayTimer() {
        if (this.Timers == null)
            this.Timers = Laya.SoundManager.playSound("Sounds/timer.wav", 1, Laya.Handler.create(this, this.OnTimerComplete, null, true));
    }

    OnTimerComplete() {
        this.StopTimerSound();
    }

    StopTimerSound() {
        if (this.Timers != null) {
            this.Timers.stop();
            Laya.SoundManager.removeChannel(this.Timers);
            this.Timers = null;
        }
    }

    /**
     * 啥也没捡到
     */
    PlayMiss() {
        Laya.SoundManager.playSound("Sounds/miss.wav", 1);
    }

    /**
     * 捡到金子
     */
    PlayGold() {
        Laya.SoundManager.playSound("Sounds/gold.wav", 1);
    }

    /**
     * 龙骨头
     */
    PlaySkull() {
        Laya.SoundManager.playSound("Sounds/skull.wav", 1);
    }

    /**
     * 石头
     */
    PlayStone() {
        Laya.SoundManager.playSound("Sounds/stone.wav", 1);
    }

    /**
     * 钻石
     */
    PlayJewel() {
        Laya.SoundManager.playSound("Sounds/jewel.wav", 1);
    }

    /**
     * 银矿
     */
    PlaySilver() {
        Laya.SoundManager.playSound("Sounds/silver.wav", 1);
    }

    /**
     * 加分
     */
    PlayScore() {
        Laya.SoundManager.playSound("Sounds/score.wav", 1);
    }

    /**
     * 游戏关卡胜利.
     */
    PlayWin() {
        Laya.SoundManager.playSound("Sounds/level_completed.wav", 1);
    }

    /**
     * 游戏整体胜利.
     */
    PlayGameWin() {
        Laya.SoundManager.playSound("Sounds/game_won.wav", 1);
    }

    /**
     * 关卡失败
     */
    PlayGameOver() {
        Laya.SoundManager.playSound("Sounds/game_over.wav", 1);
    }

    /**
     * 拾取到骨头
     */
    PlayBones() {
        Laya.SoundManager.playSound("Sounds/bone.wav", 1);
    }

    /**
     * 炸药
     */
    PlayBomb() {
        Laya.SoundManager.playSound("Sounds/bomb.wav", 1);
    }

    /**
     * 炸药桶
     */
    PlayTnt() {
        Laya.SoundManager.playSound("Sounds/explosion.wav", 1);
    }

    /**
     * 额外奖金-钱袋子-power
     */
    PlayBonus() {
        Laya.SoundManager.playSound("Sounds/bonus.wav", 1);
    }

    /**
     * 商店购买到一件物品
     */
    PlayBuyItem() {
        Laya.SoundManager.playSound("Sounds/buy.wav", 1);
    }

    PlayAnimal() {
        Laya.SoundManager.playSound("Sounds/mole.wav", 1);
    }

    isPauseSound: boolean = false;
    public set PauseSound(pause: boolean) {
        this.isPauseSound = pause;
        if (pause) {
            Laya.SoundManager.stopAll();
        }
    }
}