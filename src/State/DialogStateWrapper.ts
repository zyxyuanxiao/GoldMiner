class DialogStateWrapper {
    public DialogState: BaseDialogState;
    public Data: Object;

    constructor(dialogState: BaseDialogState, data: Object) {
        this.DialogState = dialogState;
        this.Data = data;
    }
}