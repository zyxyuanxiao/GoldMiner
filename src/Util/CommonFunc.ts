class CommonFunc {
    static RegisterClick(btn: Laya.Component, action: GameAction, data?: Object, isNotScale?: boolean) {
        var scaleX = btn.scaleX;
        var scaleY = btn.scaleY;
        if (action != GameAction.None) {
            btn.on(Laya.Event.CLICK, Main.Instance, (e) => {
                Main.Instance.GameStateManager.FireAction(action, data);
                let tt = e as Laya.Event;
                tt.stopPropagation();
            });
        }


        if (isNotScale)
            return;

        btn.on(Laya.Event.MOUSE_DOWN, Main.Instance, () => {
            btn.scale(scaleX * 0.9, scaleY * 0.9, true);
        });
        btn.on(Laya.Event.MOUSE_UP, Main.Instance, () => {
            btn.scale(scaleX, scaleY, true);
        });
        btn.on(Laya.Event.MOUSE_OUT, Main.Instance, () => {
            btn.scale(scaleX, scaleY, true);
        });
    }

    static RegisterDialogClick(btn: Laya.Button, action: DialogAction, data?: Object, isNotScale?: boolean) {
        var scaleX = btn.scaleX;
        var scaleY = btn.scaleY;
        btn.on(Laya.Event.CLICK, Main.Instance, () => {
            Main.Instance.DialogStateManager.FireAction(action, data);
        });

        if (isNotScale)
            return;
        btn.on(Laya.Event.MOUSE_DOWN, Main.Instance, () => {
            btn.scale(scaleX * 0.9, scaleY * 0.9, true);
        });
        btn.on(Laya.Event.MOUSE_UP, Main.Instance, () => {
            btn.scale(scaleX, scaleY, true);
        });
        btn.on(Laya.Event.MOUSE_OUT, Main.Instance, () => {
            btn.scale(scaleX, scaleY, true);
        });
    }

    //循环缩放
    static RegisterUIScale(uiObject: Laya.Component, fromScale: number, toScale: number, speed: number)  {
        CommonFunc.UnRegisterUIScale(uiObject);

        let targetScale = toScale;

        let complete = function () {
            Laya.Tween.to(uiObject, { scaleX: targetScale, scaleY: targetScale }, speed, Laya.Ease.linearInOut, Laya.Handler.create(this, complete_1), null);
            targetScale = toScale;
        }

        let complete_1 = function ()  {
            Laya.Tween.to(uiObject, { scaleX: targetScale, scaleY: targetScale }, speed, Laya.Ease.linearInOut, Laya.Handler.create(this, complete), null);
            targetScale = fromScale;
        }

        complete_1();
    }

    static UnRegisterUIScale(uiObject: Laya.Component)  {
        Laya.Tween.clearAll(uiObject);
        uiObject.scaleX = 1;
        uiObject.scaleY = 1;
    }
}