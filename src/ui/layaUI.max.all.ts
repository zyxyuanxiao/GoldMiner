
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class DebugPanelUI extends Dialog {
		public btn_close:Laya.Button;
		public btn_play0:Laya.Button;
		public btn_play1:Laya.Button;
		public btn_play2:Laya.Button;
		public btn_play3:Laya.Button;

        public static  uiView:any ={"type":"Dialog","props":{"width":900,"height":724},"child":[{"type":"Image","props":{"top":0,"skin":"MainUI/zhu_bg_2.png","right":0,"left":0,"bottom":0,"sizeGrid":"26,27,25,27"}},{"type":"Button","props":{"width":91,"var":"btn_close","top":18,"stateNum":1,"skin":"MainUI/button_close.png","right":30,"height":99}},{"type":"HBox","props":{"top":125,"staticCache":true,"right":45,"left":45,"cacheAsBitmap":true,"cacheAs":"bitmap","bottom":35},"child":[{"type":"VBox","props":{"width":175},"child":[{"type":"Button","props":{"width":185,"var":"btn_play0","skin":"comp/button.png","labelSize":35,"label":"调试关卡1","height":85}},{"type":"Button","props":{"width":185,"var":"btn_play1","skin":"comp/button.png","labelSize":35,"label":"调试关卡2","height":85}},{"type":"Button","props":{"width":185,"var":"btn_play2","skin":"comp/button.png","labelSize":35,"label":"调试关卡3","height":85}},{"type":"Button","props":{"width":185,"var":"btn_play3","skin":"comp/button.png","labelSize":35,"label":"调试关卡4","height":85}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.DebugPanelUI.uiView);

        }

    }
}

module ui {
    export class FlutterWindowUI extends Dialog {
		public parentBox:Laya.Box;
		public labContext:Laya.Label;

        public static  uiView:any ={"type":"Dialog","props":{"width":640,"mouseThrough":true,"mouseEnabled":true,"height":300,"centerX":0},"child":[{"type":"Box","props":{"width":340,"var":"parentBox","height":73,"centerX":0},"child":[{"type":"Image","props":{"y":36,"x":170,"width":500,"skin":"MainUI/wl_bg.png","sizeGrid":"18,20,19,18","height":73,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"var":"labContext","text":"请分享到群","fontSize":30,"font":"Arial","color":"#fbf6f6","centerY":0.5,"centerX":0.5}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.FlutterWindowUI.uiView);

        }

    }
}

module ui {
    export class GameGoalUI extends Dialog {
		public label_level:Laya.Label;
		public label_gold:Laya.Label;
		public label_goal:Laya.Label;
		public btn_play:Laya.Image;

        public static  uiView:any ={"type":"Dialog","props":{"width":1920,"height":1080},"child":[{"type":"Image","props":{"width":960,"skin":"style1/gui_frame-sheet0.png","sizeGrid":"50,50,50,50","height":640,"centerY":-100,"centerX":0}},{"type":"Label","props":{"y":239,"var":"label_level","text":"关卡1-1","fontSize":35,"font":"Arial","color":"#f6f4f4","centerX":0}},{"type":"Label","props":{"y":415,"var":"label_gold","text":"胜利","fontSize":35,"font":"Arial","color":"#f6f4f4","centerX":-55}},{"type":"Label","props":{"y":565,"var":"label_goal","text":"胜利","fontSize":35,"font":"Arial","color":"#f6f4f4","centerX":-55}},{"type":"Image","props":{"width":304,"var":"btn_play","skin":"style1/button-sheet0.png","sizeGrid":"14,45,38,45","height":124,"centerX":0,"bottom":118},"child":[{"type":"Image","props":{"width":80,"skin":"style1/button_play-sheet0.png","height":80,"centerY":-8,"centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.GameGoalUI.uiView);

        }

    }
}

module ui {
    export class GameResultUI extends Dialog {
		public label_result:Laya.Label;
		public label_gold:Laya.Label;
		public label_goal:Laya.Label;
		public btn_play:Laya.Image;

        public static  uiView:any ={"type":"Dialog","props":{"width":960,"height":640},"child":[{"type":"Image","props":{"top":0,"skin":"style1/gui_frame-sheet0.png","sizeGrid":"50,50,50,50","right":0,"left":0,"bottom":0}},{"type":"Label","props":{"y":122,"var":"label_result","text":"胜利","fontSize":35,"font":"Arial","color":"#f6f4f4","centerX":0}},{"type":"Label","props":{"y":299,"var":"label_gold","text":"胜利","fontSize":35,"font":"Arial","color":"#f6f4f4","centerX":-55}},{"type":"Label","props":{"y":445,"var":"label_goal","text":"胜利","fontSize":35,"font":"Arial","color":"#f6f4f4","centerX":-55}},{"type":"Image","props":{"width":200,"var":"btn_play","skin":"style1/button_restart-sheet1.png","scaleY":1,"scaleX":1,"right":124,"height":200,"bottom":139,"anchorY":0.5,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.GameResultUI.uiView);

        }

    }
}

module ui {
    export class GoldUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":300,"height":300},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"style1/gold_01-sheet0.png"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.GoldUI.uiView);

        }

    }
}

module ui {
    export class LoadingUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":1920,"height":1080}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.LoadingUI.uiView);

        }

    }
}

module ui {
    export class MainMenuUI extends View {
		public label_title:Laya.Label;
		public btn_start:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":1920,"height":1080},"child":[{"type":"Image","props":{"top":0,"skin":"Level/11121212.jpg","right":0,"left":0,"bottom":0}},{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"MainUI/zhe_hei.png","sizeGrid":"4,4,4,4","right":0,"left":0,"layoutEnabled":false,"bottom":0,"alpha":0.8}},{"type":"Label","props":{"width":650,"var":"label_title","text":"黄金矿工","strokeColor":"#f67109","stroke":10,"overflow":"hidden","fontSize":132,"font":"SimHei","color":"#eabdbd","centerY":-247,"centerX":-3,"borderColor":"#1c1b1b","bold":true,"blendMode":"lighter","bgColor":"#100909","align":"center"},"child":[{"type":"Label","props":{"y":150,"text":"中文加强版","strokeColor":"#f67109","stroke":10,"fontSize":65,"font":"SimHei","color":"#f8f3f3","centerX":0,"bold":true,"align":"center"}}]},{"type":"Image","props":{"width":304,"var":"btn_start","skin":"style1/button-sheet0.png","height":110,"centerY":126,"centerX":-11},"child":[{"type":"Label","props":{"width":176,"text":"开始","height":64,"fontSize":64,"color":"#fff9f9","centerY":-10,"centerX":19,"bold":true}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.MainMenuUI.uiView);

        }

    }
}

module ui {
    export class MainUiUI extends View {
		public StartHook:Laya.FrameAnimation;
		public light:Laya.FrameAnimation;
		public light2:Laya.FrameAnimation;
		public light3:Laya.FrameAnimation;
		public player0:Laya.FrameAnimation;
		public player_idle:Laya.FrameAnimation;
		public player1:Laya.FrameAnimation;
		public wall1:Laya.Image;
		public wall0:Laya.Image;
		public wall2:Laya.Image;
		public img_background:Laya.Image;
		public Map:Laya.Panel;
		public MineBackground:Laya.Image;
		public player:Laya.Image;
		public hookAnchor:Laya.Image;
		public hookRight:Laya.Image;
		public HookHolder:Laya.Image;
		public hookLeft:Laya.Image;
		public HookHead:Laya.Image;
		public MineRoot:Laya.Image;
		public avatarUrl:Laya.Image;
		public Currency_gold:Laya.Label;
		public goal:Laya.Label;
		public label_score:Laya.Label;
		public TimeLeft:Laya.Label;
		public label_level:Laya.Label;
		public nickName:Laya.Label;
		public btn_toolBomb:Laya.Image;
		public label_bombNum:Laya.Label;
		public debug_panel:Laya.VBox;
		public btn_openMeter:Laya.Button;
		public btn_openDebug:Laya.Button;
		public btn_nextLevel:Laya.Button;
		public btn_AddTime:Laya.Button;
		public btn_shop:Laya.Button;
		public btn_pause:Laya.Button;
		public btn_mute:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":1920,"height":1080},"child":[{"type":"Image","props":{"y":0,"width":100,"var":"wall1","top":0,"right":-50,"bottom":0}},{"type":"Image","props":{"y":0,"x":-50,"width":100,"var":"wall0","top":0,"left":-50,"bottom":0}},{"type":"Image","props":{"var":"wall2","right":0,"left":0,"height":100,"bottom":-50}},{"type":"Image","props":{"y":0,"x":0,"var":"img_background","top":0,"skin":"Level/background_game-sheet0.png","right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":44,"skin":"style1/lamps-sheet1.png","right":711},"child":[{"type":"Image","props":{"y":52,"x":25,"skin":"style1/lightsheet3.png","scaleY":1,"scaleX":1,"blendMode":"lighter","anchorY":0.5,"anchorX":0.5},"compId":69}]},{"type":"Image","props":{"y":16,"skin":"style1/lamps-sheet1.png","right":313},"child":[{"type":"Image","props":{"y":52,"x":25,"skin":"style1/lightsheet0.png","scaleY":1,"scaleX":1,"blendMode":"lighter","anchorY":0.5,"anchorX":0.5},"compId":67}]},{"type":"Image","props":{"y":20,"skin":"style1/lamps-sheet1.png","left":623},"child":[{"type":"Image","props":{"y":52,"x":25,"skin":"style1/lightsheet0.png","scaleY":1,"scaleX":1,"blendMode":"lighter","anchorY":0.5,"anchorX":0.5},"compId":71}]}]},{"type":"Image","props":{"y":123,"x":64,"skin":"style1/gui_target-sheet0.png"}},{"type":"Image","props":{"y":38,"x":64,"skin":"style1/gui_score-sheet0.png"}},{"type":"Image","props":{"y":188,"skin":"style1/gui_time-sheet0.png","right":9}},{"type":"Panel","props":{"var":"Map","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"var":"MineBackground","top":450,"right":125,"left":125,"bottom":100}},{"type":"Image","props":{"y":42,"var":"player","skin":"Player/miner-sheet_01.png","centerX":45,"anchorY":0,"anchorX":0.5},"compId":87},{"type":"Image","props":{"y":290,"x":960,"width":70,"var":"hookAnchor","sizeGrid":"0,0,0,0,1","rotation":-90,"anchorY":0.5,"anchorX":1},"child":[{"type":"Image","props":{"y":5,"x":10,"var":"hookRight","skin":"style1/hook_right-sheet0.png","rotation":90,"pivotY":12,"pivotX":12},"compId":62},{"type":"Image","props":{"x":-45,"width":0,"var":"HookHolder","height":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":-5,"x":10,"var":"hookLeft","skin":"style1/hook_left-sheet0.png","rotation":90,"anchorY":0.15,"anchorX":0.75},"compId":19}]},{"type":"Image","props":{"y":290,"x":960,"width":65,"var":"HookHead","skin":"style1/rope.png","sizeGrid":"0,0,0,0,1","rotation":-90,"anchorY":0.5,"anchorX":1}},{"type":"Image","props":{"var":"MineRoot","top":450,"right":125,"left":125,"bottom":100}}]},{"type":"Image","props":{"y":60,"width":128,"var":"avatarUrl","height":128,"centerX":-160}},{"type":"Label","props":{"y":40,"x":233,"var":"Currency_gold","text":"$1995","fontSize":55,"color":"#f9f9f9"}},{"type":"Label","props":{"y":124,"x":235,"var":"goal","text":"$1995","fontSize":55,"color":"#fdfdfd"}},{"type":"Label","props":{"y":124,"x":65,"visible":false,"text":"目标：","fontSize":55,"color":"#fbf6f6"}},{"type":"Label","props":{"visible":false,"var":"label_score","top":254,"text":"+10000","fontSize":55,"font":"SimSun","color":"#fdfdfd","centerX":-180,"align":"center"}},{"type":"Label","props":{"y":132,"x":1754,"text":"关卡：","right":46,"fontSize":40,"color":"#fdfdfd"}},{"type":"Label","props":{"y":200,"x":1824,"var":"TimeLeft","text":"35","right":46,"fontSize":45,"color":"#fdfdfd"}},{"type":"Label","props":{"y":135,"x":1851,"var":"label_level","text":"35","right":25,"fontSize":40,"color":"#fdfdfd"}},{"type":"Label","props":{"y":199,"var":"nickName","text":"Winson","fontSize":32,"font":"Microsoft YaHei","color":"#f6f4f4","centerX":0}},{"type":"Image","props":{"y":210,"var":"btn_toolBomb","skin":"style1/bonus_bomb-sheet0.png","centerX":210}},{"type":"Label","props":{"var":"label_bombNum","top":300,"text":"X150","fontSize":45,"font":"Arial","color":"#ffffff","centerX":210}},{"type":"VBox","props":{"width":200,"var":"debug_panel","top":450,"space":2,"right":-200,"height":400},"child":[{"type":"Button","props":{"width":200,"var":"btn_openMeter","stateNum":3,"skin":"comp/button.png","labelSize":35,"label":"观察速度","height":85}},{"type":"Button","props":{"width":200,"var":"btn_openDebug","stateNum":3,"skin":"comp/button.png","labelSize":35,"label":"打开调试","height":85}},{"type":"Button","props":{"width":200,"var":"btn_nextLevel","stateNum":3,"skin":"comp/button.png","labelSize":35,"label":"下一关","height":85}},{"type":"Button","props":{"width":200,"var":"btn_AddTime","stateNum":3,"skin":"comp/button.png","labelSize":35,"label":"增加时长","height":85}},{"type":"Button","props":{"width":200,"var":"btn_shop","stateNum":3,"skin":"comp/button.png","labelSize":35,"label":"过关","height":85}}]},{"type":"Button","props":{"y":160,"var":"btn_pause","stateNum":1,"skin":"MainUI/button_pause-sheet1.png","right":375}},{"type":"Image","props":{"y":160,"var":"btn_mute","skin":"MainUI/soundbutton-sheet0.png","scaleY":0.8,"scaleX":0.8,"right":220}}],"animations":[{"nodes":[{"target":19,"keyframes":{"rotation":[{"value":90,"tweenMethod":"linearNone","tween":true,"target":19,"key":"rotation","index":0},{"value":131,"tweenMethod":"linearNone","tween":true,"target":19,"key":"rotation","index":10},{"value":90,"tweenMethod":"linearNone","tween":true,"target":19,"key":"rotation","index":20}]}},{"target":62,"keyframes":{"rotation":[{"value":90,"tweenMethod":"linearNone","tween":true,"target":62,"key":"rotation","index":0},{"value":63,"tweenMethod":"linearNone","tween":true,"target":62,"key":"rotation","index":10},{"value":90,"tweenMethod":"linearNone","tween":true,"target":62,"key":"rotation","index":20}]}}],"name":"StartHook","id":1,"frameRate":24,"action":0},{"nodes":[{"target":67,"keyframes":{"skin":[{"value":"style1/lightsheet0.png","tweenMethod":"linearNone","tween":false,"target":67,"key":"skin","index":0},{"value":"style1/lightsheet1.png","tweenMethod":"linearNone","tween":false,"target":67,"key":"skin","index":1},{"value":"style1/lightsheet2.png","tweenMethod":"linearNone","tween":false,"target":67,"key":"skin","index":2},{"value":"style1/lightsheet3.png","tweenMethod":"linearNone","tween":false,"target":67,"key":"skin","index":3}]}}],"name":"light","id":2,"frameRate":24,"action":0},{"nodes":[{"target":69,"keyframes":{"skin":[{"value":"style1/lightsheet3.png","tweenMethod":"linearNone","tween":false,"target":69,"key":"skin","index":0},{"value":"style1/lightsheet2.png","tweenMethod":"linearNone","tween":false,"target":69,"key":"skin","index":1},{"value":"style1/lightsheet1.png","tweenMethod":"linearNone","tween":false,"target":69,"key":"skin","index":2},{"value":"style1/lightsheet0.png","tweenMethod":"linearNone","tween":false,"target":69,"key":"skin","index":3}]}}],"name":"light2","id":3,"frameRate":24,"action":0},{"nodes":[{"target":71,"keyframes":{"skin":[{"value":"style1/lightsheet3.png","tweenMethod":"linearNone","tween":false,"target":71,"key":"skin","index":0},{"value":"style1/lightsheet2.png","tweenMethod":"linearNone","tween":false,"target":71,"key":"skin","index":1},{"value":"style1/lightsheet1.png","tweenMethod":"linearNone","tween":false,"target":71,"key":"skin","index":2},{"value":"style1/lightsheet0.png","tweenMethod":"linearNone","tween":false,"target":71,"key":"skin","index":3}]}}],"name":"light3","id":4,"frameRate":24,"action":0},{"nodes":[{"target":87,"keyframes":{"x":[{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":0},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":1},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":6}],"skin":[{"value":"Player/miner-sheet_01.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":0},{"value":"Player/miner-sheet_02.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":1},{"value":"Player/miner-sheet_03.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":2},{"value":"Player/miner-sheet_04.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":3},{"value":"Player/miner-sheet_05.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":4},{"value":"Player/miner-sheet_06.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":5},{"value":"Player/miner-sheet_07.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":6}],"centerX":[{"value":45,"tweenMethod":"linearNone","tween":false,"target":87,"key":"centerX","index":0},{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":1},{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":2},{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":3},{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":4},{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":5},{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":6}]}}],"name":"player0","id":5,"frameRate":24,"action":0},{"nodes":[{"target":87,"keyframes":{"x":[{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":0},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":1},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":2},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":3},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":4},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":5},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":6},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":7},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":8}],"skin":[{"value":"Player/miner-sheet_08.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":0},{"value":"Player/miner-sheet_09.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":1},{"value":"Player/miner-sheet_10.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":2},{"value":"Player/miner-sheet_11.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":3},{"value":"Player/miner-sheet_12.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":4},{"value":"Player/miner-sheet_13.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":5},{"value":"Player/miner-sheet_14.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":6},{"value":"Player/miner-sheet_15.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":7},{"value":"Player/miner-sheet_16.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":8}],"centerX":[{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":0}],"blendMode":[{"value":"","tweenMethod":"linearNone","tween":false,"target":87,"key":"blendMode","index":0}]}}],"name":"player_idle","id":6,"frameRate":24,"action":0},{"nodes":[{"target":87,"keyframes":{"x":[{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":0},{"value":0,"tweenMethod":"linearNone","tween":true,"target":87,"key":"x","index":1}],"skin":[{"value":"Player/miner-sheet_07.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":0},{"value":"Player/miner-sheet_06.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":1},{"value":"Player/miner-sheet_05.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":2},{"value":"Player/miner-sheet_04.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":3},{"value":"Player/miner-sheet_03.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":4},{"value":"Player/miner-sheet_02.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":5},{"value":"Player/miner-sheet_01.png","tweenMethod":"linearNone","tween":false,"target":87,"key":"skin","index":6}],"centerX":[{"value":45,"tweenMethod":"linearNone","tween":true,"target":87,"key":"centerX","index":0}]}}],"name":"player1","id":7,"frameRate":24,"action":0}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.MainUiUI.uiView);

        }

    }
}

module ui {
    export class MeterPanelUI extends Dialog {
		public hook_speed:Laya.HSlider;
		public btn_close:Laya.Button;
		public label_hookspeed:Laya.Label;
		public label_hookSpeedLast:Laya.Label;

        public static  uiView:any ={"type":"Dialog","props":{"y":0,"width":580,"height":280,"cacheAsBitmap":true},"child":[{"type":"Image","props":{"width":750,"top":0,"skin":"MainUI/zhu_bg_2.png","right":0,"left":0,"height":750,"bottom":0,"sizeGrid":"26,27,25,27"}},{"type":"HSlider","props":{"y":141,"x":114,"width":350,"var":"hook_speed","skin":"comp/hslider.png","scaleY":1.5,"scaleX":1,"height":50,"centerX":0,"allowClickBack":true}},{"type":"Button","props":{"width":94,"var":"btn_close","top":25,"right":25,"height":100},"child":[{"type":"Image","props":{"skin":"MainUI/button_close.png"}}]},{"type":"Label","props":{"y":127,"x":43,"var":"label_hookspeed","text":"40","fontSize":35,"color":"#060606"}},{"type":"Label","props":{"var":"label_hookSpeedLast","top":194,"text":"40","right":262,"fontSize":35,"color":"#0a0909"}},{"type":"Label","props":{"top":72,"text":"空钩子速度","fontSize":32,"centerX":-130}},{"type":"Label","props":{"top":194,"text":"钩子实际速度：","fontSize":32,"color":"#080808","centerX":-130}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.MeterPanelUI.uiView);

        }

    }
}

module ui {
    export class RankUI extends Dialog {
		public rankView:Laya.Box;
		public openContainer:Laya.Sprite;
		public btn_close:Laya.Button;
		public fightFrend:Laya.Button;
		public btn_nextpage:Laya.Button;
		public btn_prevpage:Laya.Button;

        public static  uiView:any ={"type":"Dialog","props":{"width":1920,"positionVariance_0":100,"maxPartices":100,"height":1080},"child":[{"type":"Box","props":{"width":750,"var":"rankView","height":900,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"top":0,"right":0,"name":"Rank","left":0,"bottom":0},"child":[{"type":"Image","props":{"top":0,"skin":"rankUI/ty_kuang_di.png","right":0,"name":"bg","left":0,"bottom":0,"sizeGrid":"115,90,140,96"},"child":[{"type":"Image","props":{"y":0,"skin":"rankUI/top.png","right":-5,"name":"top","left":-5,"height":132,"sizeGrid":"0,117,0,101"}},{"type":"Sprite","props":{"y":150,"x":35,"width":680,"var":"openContainer","height":560}}]},{"type":"Button","props":{"x":-35,"width":112,"var":"btn_close","stateNum":1,"skin":"MainUI/btn_Close_UI_TEX.png","name":"close","height":111}},{"type":"Button","props":{"width":320,"visible":true,"var":"fightFrend","stateNum":1,"skin":"MainUI/BtnSmallYellow_UI_TEX.png","name":"fightFrend","labelStrokeColor":"#7c6b56","labelSize":50,"labelColors":"9c261b","labelBold":true,"label":"挑战好友","height":140,"centerX":0,"bottom":50,"sizeGrid":"0,50,0,61"}},{"type":"Button","props":{"width":114,"var":"btn_nextpage","stateNum":1,"skin":"MainUI/btn_Round_UI_TEX.png","labelSize":80,"labelPadding":"-10","labelBold":true,"labelAlign":"center","height":123,"centerX":250,"bottom":51},"child":[{"type":"Image","props":{"skin":"MainUI/icn_Arrow_UI_TEX.png","centerY":-6,"centerX":3}}]},{"type":"Button","props":{"width":114,"var":"btn_prevpage","stateNum":1,"skin":"MainUI/btn_Round_UI_TEX.png","labelSize":80,"labelPadding":"-13","labelBold":true,"labelAlign":"center","height":123,"gray":false,"centerX":-250,"bottom":51},"child":[{"type":"Image","props":{"skin":"MainUI/icn_Arrow_UI_TEX.png","scaleX":-1,"centerY":-6,"centerX":-3}}]}]},{"type":"Label","props":{"top":28,"text":"好友排行","fontSize":75,"color":"#2e4375","centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.RankUI.uiView);

        }

    }
}

module ui {
    export class ShopUI extends View {
		public btn_buyBomb:Laya.Image;
		public btn_buypower:Laya.Image;
		public btn_buydiamond:Laya.Image;
		public buy_luck:Laya.Image;
		public buy_stonebook:Laya.Image;
		public btn_buytime:Laya.Image;
		public icon_time:Laya.Image;
		public label_lucky:Laya.Label;
		public label_bomb:Laya.Label;
		public label_gold:Laya.Label;
		public label_des:Laya.Label;
		public label_price:Laya.Label;
		public btn_buy:Laya.Image;
		public btn_play:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":1920,"height":1080},"child":[{"type":"Image","props":{"top":0,"skin":"Level/background_shop-sheet0.png","right":0,"left":0,"bottom":0}},{"type":"Image","props":{"y":258,"x":337,"var":"btn_buyBomb","skin":"style1/shop_bomb-sheet1.png"}},{"type":"Image","props":{"y":0,"skin":"style1/gui_shop-sheet0.png","centerX":0}},{"type":"Image","props":{"y":263,"x":793,"var":"btn_buypower","skin":"style1/shop_power-sheet1.png"}},{"type":"Image","props":{"y":263,"x":1220,"var":"btn_buydiamond","skin":"style1/shop_jewel-sheet1.png"}},{"type":"Image","props":{"y":631,"x":538,"var":"buy_luck","skin":"style1/shop_bag-sheet1.png"}},{"type":"Image","props":{"y":627,"x":983,"var":"buy_stonebook","skin":"style1/shop_silver-sheet1.png"}},{"type":"Image","props":{"y":612,"x":71,"width":402,"var":"btn_buytime","skin":"style1/shop_silver-sheet0.png","height":334},"child":[{"type":"Image","props":{"var":"icon_time","skin":"style1/shoptime.png","scaleY":0.5,"scaleX":0.5,"rotation":21,"centerY":-53,"centerX":0,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":117,"width":1450,"skin":"MainUI/zhe_hei.png","sizeGrid":"18,20,19,18","height":146,"centerX":0,"alpha":1}},{"type":"Label","props":{"var":"label_lucky","top":40,"text":"35","fontSize":45,"font":"Arial","color":"#fdf8f8","centerX":-654}},{"type":"Label","props":{"var":"label_bomb","top":40,"text":"1","fontSize":45,"font":"Arial","color":"#fdf8f8","centerX":-325}},{"type":"Label","props":{"var":"label_gold","top":40,"text":"100000","fontSize":45,"font":"Arial","color":"#fdf8f8","centerX":142}},{"type":"Label","props":{"y":32,"text":"商店","right":225,"fontSize":55,"color":"#f9f8f8"}},{"type":"Label","props":{"y":168,"x":280,"var":"label_des","text":"石头书:当你挖到时候时，石头的价值提升至500%-800%","fontSize":50,"color":"#f8f8f8","bold":false}},{"type":"Label","props":{"var":"label_price","text":"$125","right":37,"fontSize":185,"font":"Microsoft YaHei","color":"#ffffff","bottom":500}},{"type":"Image","props":{"width":285,"var":"btn_buy","skin":"style1/button-sheet0.png","scaleY":1.2,"scaleX":1.2,"right":121,"height":125,"bottom":288},"child":[{"type":"Label","props":{"text":"购买","fontSize":60,"color":"#fbfbfb","centerY":-6,"centerX":0,"bold":true}}]},{"type":"Image","props":{"width":285,"var":"btn_play","skin":"style1/button-sheet0.png","scaleY":1.2,"scaleX":1.2,"right":121,"height":125,"bottom":114},"child":[{"type":"Label","props":{"text":"下一关","fontSize":60,"color":"#fbfbfb","centerY":-6,"centerX":0,"bold":true}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.ShopUI.uiView);

        }

    }
}

module ui {
    export class StartUpUI extends View {
		public bg_img:Laya.Image;
		public pro_main:Laya.ProgressBar;

        public static  uiView:any ={"type":"View","props":{"width":1920,"mouseThrough":false,"mouseEnabled":true,"height":1080,"centerX":0},"child":[{"type":"Image","props":{"var":"bg_img","anchorY":0.5,"anchorX":0.5}},{"type":"ProgressBar","props":{"width":620,"var":"pro_main","skin":"start/progress.png","sizeGrid":"10,10,10,10","height":36,"centerX":0,"bottom":100}},{"type":"Label","props":{"top":255,"text":"黄金矿工超级版","fontSize":45,"font":"Microsoft YaHei","color":"#f9f9f9","centerX":0}},{"type":"Image","props":{}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.StartUpUI.uiView);

        }

    }
}
