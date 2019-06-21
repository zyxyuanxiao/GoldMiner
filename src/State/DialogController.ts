class DialogController {
    public OnDialogStateEnter(previousState: BaseDialogState, data: Object) {
        
    }
    AnimationLength:number = 0.3;
    protected IsClosing:boolean;
    public Disappear():boolean {
        if (this.IsClosing) {
            return true;
        }
        this.IsClosing = true;
        return false;
    }
}