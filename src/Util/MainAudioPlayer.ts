class SoundWrapper
{
    constructor(name:string, au:any)
    {
        this.path = name;
        this.audio = au;
    }

    destroy()
    {
        this.audio.destroy();
    }
    path:string;
    audio:any;
}

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


    Reset()
    {
         for (var i = 0; i < this.soundPool.length; i++)
            {
                this.soundPool[i].destroy();
            }
            this.soundPool.splice(0);
    }
    /**
     * 播放绳子伸缩声音
     */
    Rope: SoundWrapper;
    PlayRopeSound() {
        this.StopRopeSound();
        if (this.Rope == null)
            this.Rope = this.playSound("Sounds/winch.wav", 0);
    }

    StopRopeSound() {
        if (this.Rope != null) {
            console.log("rope sound stoped");
            this.OnSoundEnd(this.Rope);
            this.Rope = null;
        }
    }

    Timers: SoundWrapper;
    PlayTimer() {
        if (this.Timers == null)
            this.Timers = this.playSound("Sounds/timer.wav", 1);
    }

    StopTimerSound() {
        if (this.Timers != null) {
            this.OnSoundEnd(this.Timers);
            this.Timers = null;
        }
    }

    /**
     * 啥也没捡到
     */
    PlayMiss() {
        this.playSound("Sounds/miss.wav", 1);
    }

    /**
     * 捡到金子
     */
    PlayGold() {
        this.playSound("Sounds/gold.wav", 1);
    }

    /**
     * 龙骨头
     */
    PlaySkull() {
        this.playSound("Sounds/skull.wav", 1);
    }

    /**
     * 石头
     */
    PlayStone() {
        this.playSound("Sounds/stone.wav", 1);
    }

    /**
     * 钻石
     */
    PlayJewel() {
        this.playSound("Sounds/jewel.wav", 1);
    }

    /**
     * 银矿
     */
    PlaySilver() {
        this.playSound("Sounds/silver.wav", 1);
    }

    /**
     * 加分
     */
    PlayScore() {
        this.playSound("Sounds/score.wav", 1);
    }

    /**
     * 游戏关卡胜利.
     */
    PlayWin() {
        this.playSound("Sounds/level_completed.wav", 1);
    }

    /**
     * 游戏整体胜利.
     */
    PlayGameWin() {
        this.playSound("Sounds/game_won.wav", 1);
    }

    /**
     * 关卡失败
     */
    PlayGameOver() {
        this.playSound("Sounds/game_over.wav", 1);
    }

    /**
     * 拾取到骨头
     */
    PlayBones() {
        this.playSound("Sounds/bone.wav", 1);
    }

    /**
     * 炸药
     */
    PlayBomb() {
        this.playSound("Sounds/bomb.wav", 1);
    }

    /**
     * 炸药桶
     */
    PlayTnt() {
        this.playSound("Sounds/explosion.wav", 1);
    }

    /**
     * 额外奖金-钱袋子-power
     */
    PlayBonus() {
        this.playSound("Sounds/bonus.wav", 1);
    }

    /**
     * 商店购买到一件物品
     */
    PlayBuyItem() {
        this.playSound("Sounds/buy.wav", 1);
    }

    PlayAnimal() {
        this.playSound("Sounds/mole.wav", 1);
    }

    isPauseSound: boolean = false;
    public set PauseSound(pause: boolean) {
        this.isPauseSound = pause;
        if (pause) {
           this.Reset();
        }
    }

    soundPool:Array<SoundWrapper> = new Array<SoundWrapper>();
    playSound(path:string, count:number, h:Laya.Handler = null):SoundWrapper
    {
        if (Laya.Browser.onPC)
        {
            Laya.SoundManager.playSound(path, count);
            return null;
        }
        var wx = window["wx"];
        var audio = wx.createInnerAudioContext();
        if (audio == null)
            return;
        audio.src = Laya.URL.basePath + path;// src 可以设置 http(s) 的路径，本地文件路径或者代码包文件路径
        audio.loop = (count != 1);
        audio.play();
        var audioWrapper = new SoundWrapper(audio.src, audio);
        this.soundPool.push(audioWrapper);
        audio.onEnded(function(){
            this.OnSoundEnd(audioWrapper);
        }.bind(this));
        return audioWrapper;
    }

    OnSoundEnd(sound:SoundWrapper)
    {
        var i:number = this.soundPool.indexOf(sound);
        if (i != -1)
        {
            this.soundPool.splice(i, 1);
        }
        sound.destroy();
    }
}