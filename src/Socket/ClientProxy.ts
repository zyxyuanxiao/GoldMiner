class Client {
    socket: Laya.Socket;
    byte:Laya.Byte;
    constructor()  {
        this.byte = new Laya.Byte();
        //这里我们采用小端
        this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
        this.socket = new Laya.Socket();
        //这里我们采用小端
        this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
        //建立连接
        this.socket.connect("www.idevgame.com", 90);
        this.socket.on(Laya.Event.OPEN, this, this.openHandler);
        this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
        this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
        this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
    }

    openHandler(event) {
        //正确建立连接；
        console.log("openHandler");
    }

    receiveHandler(msg) {
        ///接收到数据触发函数
    }

    closeHandler(e) {
        //关闭事件
    }

    errorHandler(e) {
        //连接出错
        console.log(e);
    }
}