class BattleUiCtrl extends ui.MainUiUI {
    public static Instance: BattleUiCtrl;
    wall: Array<Laya.Sprite> = new Array<Laya.Sprite>(this.wall0, this.wall1, this.wall2);
    hookCollision: Array<Laya.Sprite> = new Array<Laya.Sprite>();
    mines: List<Mine> = new List<Mine>();
    lev: LevelItem;
    time: number;
    constructor()  {
        super();
        this.OnResize();
        Laya.stage.on(Laya.Event.RESIZE, this, this.OnResize);
        this.MineRoot.on(Laya.Event.CLICK, this, this.OnStartHook);
        //PlayerData.Instance.Init(Laya.Handler.create(this, this.OnGoldChanged, null, false));
        this.OnGoldChanged(PlayerData.Instance.gold);
        this.btn_toolBomb.on(Laya.Event.CLICK, this, this.OnToolUse, [0]);
        this.UpdateTools();
        this.hookCollision.push(this.HookHolder);
        this.hookCollision.push(this.hookRight);
        this.hookCollision.push(this.hookLeft);
        this.avatarUrl.skin = PlayerData.Instance.avatarUrl;
        this.nickName.text = PlayerData.Instance.nickName;
        this.light.play();
        this.light2.play();
        this.light3.play();
        this.PlayIdle();
        BattleUiCtrl.Instance = this;
        this.avatarUrl.on(Laya.Event.CLICK, this, this.OnDebug);
        this.btn_openDebug.on(Laya.Event.CLICK, this, this.OnOpenDebug);
        this.btn_openMeter.on(Laya.Event.CLICK, this, this.OnOpenMeter);
        this.btn_AddTime.on(Laya.Event.CLICK, this, this.AddTime, [60]);
        this.btn_nextLevel.on(Laya.Event.CLICK, this, this.OnNextLevel);
        this.btn_shop.on(Laya.Event.CLICK, this, this.OnPassLevel);
        this.btn_pause.on(Laya.Event.CLICK, this, this.OnPause);
        this.btn_mute.on(Laya.Event.CLICK, this, this.OnMute);
        this.player0.interval = 80;
        this.player_idle.interval = 80;
        this.player1.interval = 80;
    }

    debugExpand: boolean = false;
    OnDebug()  {
        if (!Const.LocalDebug)
            return;
        if (this.debugExpand)  {
            Laya.Tween.to(this.debug_panel, { right: -200 }, 500, Laya.Ease.expoInOut, Laya.Handler.create(this, function () { this.debugExpand = false; }));
        }
        else  {
            Laya.Tween.to(this.debug_panel, { right: 0 }, 500, Laya.Ease.expoInOut, Laya.Handler.create(this, function () { this.debugExpand = true; }));
        }
    }

    OnPassLevel()  {
        PlayerData.Instance.gold = this.lev.Goal;
        this.time = 3;
    }

    OnOpenMeter()  {
        var res: Array<string> = [
            "res/atlas/MainUI.atlas",
            "res/atlas/comp.atlas"
        ];

        Laya.loader.load(res, Laya.Handler.create(this, () => {
            if (Main.Instance.meterPanel == null)
                Main.Instance.meterPanel = new MeterPanel();
            if (Laya.stage.getChildIndex(Main.Instance.meterPanel) == -1) {
                Laya.stage.addChild(Main.Instance.meterPanel);
            }
            else
                Laya.stage.removeChild(Main.Instance.meterPanel);
        }));
    }

    OnOpenDebug()  {
        var res: Array<string> = [
            "res/atlas/MainUI.atlas",
            "res/atlas/comp.atlas"
        ];

        Laya.loader.load(res, Laya.Handler.create(this, () => {
            if (Main.Instance.debugPanel == null)
                Main.Instance.debugPanel = new DebugUI();
            if (Laya.stage.getChildIndex(Main.Instance.debugPanel) == -1) {
                Laya.stage.addChild(Main.Instance.debugPanel);
            }
            else
                Laya.stage.removeChild(Main.Instance.debugPanel);
        }));
    }

    OnPause()  {
        this.pause = !this.pause;
        this.btn_pause.skin = this.pause ? "MainUI/button_next-sheet1.png" : "MainUI/button_pause-sheet1.png";
        for (var i: number = 0; i < this.mines.length; i++)  {
            if (this.pause)
                this.mines.At(i).Pause();
            else
                this.mines.At(i).Resume();
        }
        if (this.pause)
            this.Mute();
    }

    OnNextLevel()  {
        PlayerData.Instance.level += 1;
        if (LevelData.Instance.LevelItems.length > PlayerData.Instance.level && LevelData.Instance.LevelItems[PlayerData.Instance.level] != null)  {
            var lev: LevelItem = LevelData.Instance.LevelItems[PlayerData.Instance.level];
            Main.Instance.GameStateManager.GameBattleState.StartLevel(lev);
        }
    }

    ropeWidth: number = 65;//绳子最短长度
    OnResize() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.HookHead.x = Laya.stage.width / 2;
        this.hookAnchor.x = this.HookHead.x;
    }

    mute: boolean = false;
    OnMute()  {
        this.mute = !this.mute;
        this.btn_mute.skin = this.mute ? "MainUI/soundbutton-sheet1.png" : "MainUI/soundbutton-sheet0.png";
        Laya.SoundManager.soundMuted = this.mute;
    }

    Mute()  {
        this.mute = true;
        this.btn_mute.skin = this.mute ? "MainUI/soundbutton-sheet1.png" : "MainUI/soundbutton-sheet0.png";
        Laya.SoundManager.soundMuted = this.mute;
    }
    /**
     * 重置关卡
     */
    Reset()  {
        this.StartHook.resetToInitState();
        if (this.Item != null)  {
            this.mines.Remove(this.Item);
            this.Item.Reset();
            this.Item = null;
        }
        for (var i: number = 0; i < this.mines.Count; i++)  {
            this.mines.At(i).Reset();
        }
        this.mines.Clear();
        this.HookHead.width = this.ropeWidth;
        this.hookAnchor.width = this.ropeWidth + 5;
        this.hookAnchor.rotation = -90;
        this.HookHead.rotation = -90;
        this.passLevel = false;
    }

    /**
     * 加载关卡
     * @param id 关卡ID
     */
    LoadLevel(level: LevelItem)  {
        this.Reset();
        var index: number = level.level;
        this.img_background.left = this.img_background.right = this.img_background.top = this.img_background.bottom = 0;

        this.lev = level;
        this.lev.Reset();
        var num: number = this.lev.Mines.length;
        for (var i: number = 0; i < num; i++)  {
            this.lev.Mines[i].Load(this.MineRoot, this.MineBackground);
            this.mines.Add(this.lev.Mines[i]);
        }

        this.goal.text = StringTool.format("关卡目标:{0}", this.lev.Goal.toFixed(0));
        this.TimeLeft.text = StringTool.format("剩余时间:{0}", this.lev.time.toFixed(0));
        this.label_level.text = this.lev.level.toFixed(0);
        this.time = this.lev.time + PlayerData.Instance.ExtraTime;
        this.gameOver = true;
    }

    public StartGame()  {
        if (this.lev == null)  {
            console.log("can not load level data");
            return;
        }
        this.gameOver = false;
        this.Playing = false;
        this.HookStep = 0;
        this.HandlerClick = true;
        this.Item = null;
        this.rotating = true;
    }

    OnGoldChanged(g: number)  {
        this.Currency_gold.text = StringTool.format("当前金矿:{0}", g.toFixed(0));
    }

    rotationSpeed = 1.0;//旋转速度
    rotationPer = 1.0;//旋转倍数
    turnRight = true;//向右
    Playing: boolean = false;//是否在伸展
    HandlerClick: boolean = true;//是否能响应点击
    HookStep: number = 0;//0伸出，1回收
    Item: Mine;//勾中的物体
    rotating: boolean = true;//是否在摇摆
    gameOver: boolean = false;//是否处于结算
    pause: boolean = false;//游戏是否暂停
    Update()  {
        if (this.pause)
            return;
        if (this.gameOver)
            return;
        this.HookRotate();
        this.CheckCollision();
        this.CheckRange();
        this.UpdateRope();
        this.CheckTime();
        this.CheckBarrel();
    }

    //检查炸药桶周围的物体是否被引爆,顺序来
    barrel: Array<Mine> = new Array<Mine>();
    currentBarrel: Mine;
    barrelTick: number = 0.0;
    removed: Array<Mine> = new Array<Mine>();
    CheckBarrel()  {
        if (this.barrel != null && this.barrel.length != 0)  {
            if (Laya.timer.currTimer > this.barrelTick + 500)  {
                this.removed.splice(0);
                this.currentBarrel = this.barrel[0];
                this.barrel.splice(0, 1);
                for (var i: number = 0; i < this.mines.length; i++)  {
                    if (this.mines.At(i).Near(this.currentBarrel))  {
                        this.removed.push(this.mines.At(i));
                        if (this.mines.At(i) instanceof Tnt)
                            this.OnMineExplosion(this.mines.At(i));
                        else
                            this.OnMineBomb(this.mines.At(i));
                    }
                }

                for (var i: number = 0; i < this.removed.length; i++)  {
                    this.mines.Remove(this.removed[i]);
                }
            }
        }
    }

    /**
     * 当矿物TNT爆炸时
     * @param m 
     */
    OnMineExplosion(m: Mine)  {
        this.barrel.push(m);
        this.barrelTick = Laya.timer.currTimer;
        m.PlayBarrelExplosion(m.sprite);
        m.ResetMine();
    }

    /**
     * 当矿物被炸弹-连锁爆炸时.
     * @param m 
     */
    OnMineBomb(m: Mine)  {
        if (m.sprite != null)  {
            m.Bomb(m.sprite);
            m.ResetMine();
        }
        else if (m.ani != null)  {
            m.Bomb(m.ani);
            m.ResetAni();
        }
        MainAudioPlayer.Instance.PlayBomb();
    }

    public _EmptyPullSpeed = 12;//基础速度-无视 80/12
    _Explosion: boolean = false;//如果触发了炸药桶，钩子会回来的更快。
    _ExplosionGravity: number = 15;
    _takeBackGravity: number = 15;
    takeBackTime: number = 0;
    public get HookSpeed(): number  {
        if (this.Item != null)  {
            if (PlayerData.Instance.PowerOn)
                return this._EmptyPullSpeed;
            return 11 - this.Item.level;
        }
        return this._EmptyPullSpeed + (this._takeBackGravity + (this._Explosion ? this._ExplosionGravity : 0)) * this.takeBackTime;
    }

    toScore: number = 0;
    fromScore: number = 0;
    timeScoreTick: number = 0;
    frameScore: number = 0;
    interpolation: boolean = false;
    StartScoreUpdate(f: number, t: number)  {
        console.log("f:", f, "t:", t);
        this.fromScore = f;
        this.toScore = t;
        this.timeScoreTick = Laya.timer.currTimer;
        this.interpolation = (t - f > 60);
        this.frameScore = this.fromScore;
        Laya.timer.clear(this, this.ScoreUpdate);
        Laya.timer.frameLoop(1, this, this.ScoreUpdate)
    }

    //最大可播放一秒，最小每幀+1
    passLevel: boolean = false;
    ScoreUpdate()  {
        var r: number = 0;
        if (this.interpolation)  {
            var t: number = Laya.timer.currTimer - this.timeScoreTick;
            t /= 1000.0;
            r = Math.floor(Laya.MathUtil.lerp(this.fromScore, this.toScore, t));
        }
        else  {
            r = this.frameScore++;
        }
        this.Currency_gold.text = StringTool.format("当前金矿:{0}", r.toFixed(0));
        if (r >= this.toScore)  {
            this.fromScore = r;
            this.Currency_gold.text = StringTool.format("当前金矿:{0}", this.toScore.toFixed(0));
            if (this.toScore > this.lev.Goal && !this.passLevel)  {
                this.passLevel = true;
                this.Currency_gold.color = "#15f315";
            }
            Laya.timer.clear(this, this.ScoreUpdate);
        }
    }

    UpdateRope()  {
        if (!this.Playing)
            return;
        this.HookHead.width += (this.HookStep == 0 ? this.HookSpeed : -this.HookSpeed);
        this.hookAnchor.width = this.HookHead.width + 5;
        if (this.HookStep == 1 && this.Item == null)
            this.takeBackTime += Laya.timer.delta / 1000.0;
        if (this.HookHead.width < this.ropeWidth)  {
            if (this.HookStep == 1)  {
                if (this.Item != null)  {
                    this.PlayDust(this.HookHolder);
                    if (this.Item instanceof Animal || this.Item instanceof Heart)
                        this.HookHolder.removeChild(this.Item.ani);
                    else
                        this.HookHolder.removeChild(this.Item.sprite);
                    var rewardTool: boolean = false;
                    var f: number = 0;
                    var t: number = 0;
                    PlayerData.Instance.AddMineOnBag(this.Item);
                    //播放得到矿的时候加音效和结算和爆炸
                    if (this.Item.value != 0)  {
                        f = PlayerData.Instance.gold;
                        PlayerData.Instance.OnGetMine(this.Item);
                        t = PlayerData.Instance.gold;
                    }
                    else  {
                        //价值为0，表明有特殊效果，类似
                        if (this.Item instanceof Heart)  {
                            PlayerData.Instance.PowerOn = true;
                        }
                        else if (this.Item instanceof Bag)  {
                            //随机得到道具
                            f = PlayerData.Instance.gold;
                            rewardTool = PlayerData.Instance.GetRandomReward();
                            t = PlayerData.Instance.gold;
                        }
                    }
                    this.mines.Remove(this.Item);
                    if (this.Item instanceof Animal || this.Item instanceof Heart)
                        this.Item.ResetAni();
                    else
                        this.Item.ResetMine();
                    if (this.Item != null)
                        MainAudioPlayer.Instance.PlayScore();
                    //收回的时候，如果是可以得到钱的播放
                    //飘字
                    if (f != t)  {
                        this.hookPoint.x = 0;
                        this.hookPoint.y = 0;
                        this.hookPoint = this.HookHolder.localToGlobal(this.hookPoint);
                        this.label_score.text = "+" + Math.ceil(t - f);
                        this.label_score.pos(this.hookPoint.x, this.hookPoint.y);
                        this.label_score.visible = true;
                        this.label_score.alpha = 0.2;
                        Laya.Tween.to(this.label_score, { x: this.avatarUrl.x, y: this.avatarUrl.y + 200, alpha:1.0}, 500, Laya.Ease.cubicIn, Laya.Handler.create(this, function () {
                            Laya.Tween.to(this.label_score, { x: this.Currency_gold.x + 100, y: this.Currency_gold.y + 5, alpha:0.2}, 1800, Laya.Ease.expoInOut, Laya.Handler.create(this, function () {
                                this.StartScoreUpdate(f, t);
                                this.label_score.visible = false;
                            }.bind(this)), null);
                        }))
                    }
                    this.Item = null;
                    if (rewardTool)
                        this.UpdateTools();
                }
                this.PlayIdle();
                this._Explosion = false;
                this.Playing = false;
                MainAudioPlayer.Instance.StopRopeSound();
                this.StartHook.resetToInitState();
                Laya.timer.once(500, this, this.ReturnToRotate);
            }
        }
        else  {
        }
    }

    //刷新主界面的道具数量图标,只有炸弹.
    UpdateTools()  {
        this.btn_toolBomb.visible = PlayerData.Instance.BombCount != 0;
        this.label_bombNum.text = "+" + PlayerData.Instance.BombCount;
        this.label_bombNum.visible = this.btn_toolBomb.visible;
    }

    //继续旋转,且能响应点击.
    ReturnToRotate()  {
        this.HookStep = 0;
        this.rotating = true;
        this.HandlerClick = true;
    }

    HookRotate()  {
        if (this.rotating)  {
            this.HookHead.rotation += this.rotationSpeed;
            this.hookAnchor.rotation = this.HookHead.rotation;
            if (this.HookHead.rotation > -5)  {
                this.turnRight = true;
                this.rotationSpeed = -1.0　* this.rotationPer;
            }
            else if (this.HookHead.rotation <= -165)  {
                this.turnRight = false;
                this.rotationSpeed = 1.0 * this.rotationPer;
            }
        }
    }

    /**
     * 检查钩子与道具的碰撞
     */
    CheckCollision()  {
        //回收阶段或者在旋转时
        if (!this.Playing || this.HookStep == 1)
            return;
        for (var i: number = 0; i < this.mines.length; i++)  {
            var s: Laya.Sprite = this.mines.At(i).sprite;
            if (s == null)
                s = this.mines.At(i).ani;
            if (s == null)  {
                console.log("some mine dot removed from mines");
                continue;
            }
            for (var j: number = 0; j < this.hookCollision.length; j++)  {
                this.hookPoint.x = 0;
                this.hookPoint.y = 0;
                this.hookPoint = this.hookCollision[j].localToGlobal(this.hookPoint);
                if (s.hitTestPoint(this.hookPoint.x, this.hookPoint.y))  {
                    this.HookStep = 1;
                    this.Item = this.mines.At(i);
                    if (this.Item instanceof Animal || this.Item instanceof Heart)  {
                        this.MineRoot.removeChild(this.Item.ani);
                        this.HookHolder.addChild(this.Item.ani);
                        this.Item.ani.pos(0, 0);
                    }
                    else  {
                        this.MineRoot.removeChild(this.Item.sprite);
                        this.HookHolder.addChild(this.Item.sprite);
                        this.Item.sprite.centerX = 0;
                        this.Item.sprite.centerY = 0;
                    }
                    this.StartHook.play();
                    this.StartHook.gotoAndStop(20);
                    this.PlayRecover();
                    this.Item.PlaySound();
                    break;
                }
                this.hookPoint.x = 0;
                this.hookPoint.y = 0;
                this.hookPoint = s.localToGlobal(this.hookPoint);
                if (this.hookCollision[j].hitTestPoint(this.hookPoint.x, this.hookPoint.y))  {
                    this.HookStep = 1;
                    this.Item = this.mines.At(i);
                    if (this.Item instanceof Animal || this.Item instanceof Heart)  {
                        this.MineRoot.removeChild(this.Item.ani);
                        this.HookHolder.addChild(this.Item.ani);
                        this.Item.ani.pos(0, 0);
                    }
                    else  {
                        this.MineRoot.removeChild(this.Item.sprite);
                        this.HookHolder.addChild(this.Item.sprite);
                        this.Item.sprite.centerX = 0;
                        this.Item.sprite.centerY = 0;
                    }
                    this.StartHook.play();
                    this.StartHook.gotoAndStop(20);
                    this.PlayRecover();
                    this.Item.PlaySound();
                    break;
                }
            }
            if (this.Item != null)
                break;
        }

        if (this.Item != null)
            this.mines.Remove(this.Item);
        if (this.Item != null)  {
            if (this.Item instanceof Tnt)  {
                //会让钩子更快缩回去.
                this.Item.PlayExplosion(this.HookHolder);
                this.barrel.push(this.Item);
                this.barrelTick = Laya.timer.currTimer;
                this._Explosion = true;
                this.Item.ResetMine();
                this.Item = null;
                this.PlayIdle();
            }
            else if (this.Item instanceof Animal || this.Item instanceof AnimalA || this.Item instanceof AnimalB || this.Item instanceof AnimalC || this.Item instanceof Heart)  {
                this.Item.OnHook();
            }
        }
    }
    /**
     * 检查钩子是否触碰到边缘
     */
    hookPoint: Laya.Point = new Laya.Point();
    CheckRange()  {
        if (!this.Playing || this.HookStep != 0)
            return;
        if (this.Item != null)
            return;

        for (var i: number = 0; i < this.wall.length; i++)  {
            var s: Laya.Sprite = this.wall[i];
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = this.HookHolder.localToGlobal(this.hookPoint);
            if (s.hitTestPoint(this.hookPoint.x, this.hookPoint.y))  {
                this.HookStep = 1;
                this.PlayRecover();
                this.takeBackTime = 0.0;
                this._Explosion = false;
                MainAudioPlayer.Instance.PlayMiss();
                break;
            }
        }
    }

    OnStartHook()  {
        if (!this.HandlerClick)
            return;
        this.HandlerClick = false;
        this.Playing = true;
        this.rotating = false;
        this.HookStep = 0;
        this.takeBackTime = 0;
        this._Explosion = false;
        this.StartHook.play();
        this.StartHook.gotoAndStop(10);
        this.PlayLetGo();
        MainAudioPlayer.Instance.PlayRopeSound();
    }

    PlayTimeSound: boolean = false;
    PlayTimeSounds()  {
        MainAudioPlayer.Instance.PlayTimer();
    }

    CheckTime()  {
        this.time -= (Laya.timer.delta / 1000.0);
        if (this.time <= 0)  {
            this.OnGameResult();
        }
        this.TimeLeft.text = StringTool.format("剩余时间:{0}", Math.max(0, this.time).toFixed(0));
        if (this.time < 10 && this.time > 0)  {
            if (!this.PlayTimeSound)  {
                Laya.timer.loop(1000, this, this.PlayTimeSounds);
                this.PlayTimeSound = true;
            }
            var b: boolean = this.time - Math.floor(this.time) < 0.5;
            if (this.TimeLeft.visible != b)  {
                this.TimeLeft.visible = b;
            }
        }
        else  {
            if (this.PlayTimeSound)  {
                MainAudioPlayer.Instance.StopTimerSound();
                Laya.timer.clear(this, this.PlayTimeSounds);
                this.PlayTimeSound = false;
            }
            this.TimeLeft.visible = true;
        }
    }

    OnGameResult()  {
        for (var i = 0; i < this.mines.length; i++)  {
            this.mines.At(i).OnHook();
        }
        if (PlayerData.Instance.IsEnoughGold(this.lev.Goal))  {

        }
        else  {

        }

        var result: GameResult = new GameResult();
        result.win = PlayerData.Instance.IsEnoughGold(this.lev.Goal);
        result.goal = this.lev.Goal;
        result.gold = PlayerData.Instance.gold;
        Main.Instance.DialogStateManager.OpenDialog(Main.Instance.DialogStateManager.gameResult, result);
        this.gameOver = true;
        MainAudioPlayer.Instance.StopRopeSound();
        MainAudioPlayer.Instance.StopTimerSound();
        Laya.timer.clear(this, this.PlayTimeSounds);
        this.PlayTimeSound = false;
    }

    dustAni: Laya.Animation;//烟尘动画
    PlayDust(anchor: Laya.Image)  {
        if (this.dustAni != null)  {
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = anchor.localToGlobal(this.hookPoint);
            this.dustAni.pos(this.hookPoint.x, this.hookPoint.y);
            this.dustAni.play(0, false);
            return;
        }
        if (this.dustAni == null)  {
            this.dustAni = new Laya.Animation();
            this.dustAni.loadAnimation("Dust.ani");
            Laya.stage.addChild(this.dustAni);
            this.dustAni.size(400, 400);
            this.dustAni.pivotX = 1.0 / 2;
            this.dustAni.pivotY = 1.0 / 2;
            this.hookPoint.x = 0;
            this.hookPoint.y = 0;
            this.hookPoint = anchor.localToGlobal(this.hookPoint);
            this.dustAni.pos(this.hookPoint.x, this.hookPoint.y);
            this.dustAni.zOrder = 999;
            this.dustAni.play(0, false);
        }
    }

    public OnExit()  {
        BattleUiCtrl.Instance = null;
        MainAudioPlayer.Instance.StopRopeSound();
        MainAudioPlayer.Instance.StopTimerSound();
    }

    //翻倍剩余时间，如果剩余时间小于30S，+30S，否则翻倍
    DoubleTime()  {
        if (this.time < 30)
            this.time += 30;
        else
            this.time += this.time;
        MainAudioPlayer.Instance.StopTimerSound();
    }

    AddTime(second: number)  {
        this.time += second;
        MainAudioPlayer.Instance.StopTimerSound();
    }

    OnToolUse(toolIndex: number)  {
        switch (toolIndex)  {
            case 0:
                if (PlayerData.Instance.BombCount >= 1 && this.HookStep == 1 && !this.gameOver && this.Playing)  {
                    PlayerData.Instance.BombCount -= 1;
                    this.Item.Bomb(this.HookHolder);
                    this._Explosion = true;
                    this.Item.ResetMine();
                    this.Item = null;
                }
                this.UpdateTools();
                break;
        }
    }

    /**
     * 控制角色的拉收绳索动画
     */

    PlayIdle()  {
        this.player0.stop();
        this.player1.stop();
        if (this.player_idle != null)  {
            this.player_idle.play(0, true);
            return;
        }
    }

    /**
     * 放开绳索
     */
    PlayLetGo()  {
        this.player_idle.stop();
        this.player1.stop();
        if (this.player0 != null)  {
            this.player0.play(0, true);
        }
    }

    /**
     * 收回绳索
     */
    PlayRecover()  {
        this.player0.stop();
        this.player_idle.stop();
        if (this.player1 != null)  {
            this.player1.interval = Math.min(12.0 * (80.0 / this.HookSpeed), 80);
            this.player1.play(0, true);
        }
    }
}