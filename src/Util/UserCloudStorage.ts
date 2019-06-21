class UserCloudStorage{

	constructor(){

	}

	KVDataList: Array<KVData> =new Array<KVData>();
	success:Function;
	fail:Function;
	complete:Function;
}


class GetCloudStorage {
    keyList: Array<string> = new Array<string>();

    success() {
        console.log("取得数据成功");
    }

    fail() {
        console.log("取得数据失败");
    }

    complete() {
        console.log("取得数据完成");
    }
}


class GetGroupCloudStorage {

    shareTicket:string;
    
    keyList: Array<string> = new Array<string>();

    success() {
        console.log("取得数据成功");
    }

    fail() {
        console.log("取得数据失败");
    }

    complete() {
        console.log("取得数据完成");
    }
}