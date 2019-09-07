/* 工具类
*  yann;
*/
class Utility {

    public static INT_MAX: number = 2147483647;
    public static INT_MIN: number = -2147483648;
    public static SHORT_MAX: number = 32767;
    public static SHORT_MIN: number = 32768;
    public static BYTE_MAX: number = 127;
    public static BYTE_MIN: number = 128;

    /**
     * 清理数组元素
     * @param array
     * @param index
     * @param length
     * @param _default 默认值
     */
    public static ArrayClear(array: any, index: number, length: number, _default: any): void {
        var arrayEnd = index + length;
        while (index < arrayEnd)
            array[index++] = _default;
    }

    /**
     * 数组拷贝
     * @param src      原数组
     * @param srcPos   原数组开始位置
     * @param dest     目标数组
     * @param destPos  目标数组开始位置
     * @param length   拷贝长度
     */
    public static ArrayCopy(src, srcPos: number, dest, destPos: number, length: number): void {
        var srcEnd = srcPos + length;
        while (srcPos < srcEnd)
            dest[destPos++] = src[srcPos++];
    }

    /**
     * 数组拷贝 ??为啥不能重载
     * @param src      原数组
     * @param dest     目标数组
     * @param length   拷贝长度
     */
    public static ArrayCopy1(src, dest, length: number): void {
        Utility.ArrayCopy(src, 0, dest, 0, length);
    }

    /**
     *
     * @param value
     */
    public static Int32ToShort(value: number): number {
        return (value << 16) >> 16;
    }

    /**
     *
     * @param value
     */
    public static Int32ToByte(value: number): number {
        return (value << 24) >> 24;
    }

    /**
     *
     * @param value
     */
    public static FloatToInt(value: number): number {
        return Math.floor(value);
    }

    /**
     * js元数据拷贝
     * @param objDes
     * @param objSource
     */
    public static MetaCopy(objDes, objSource): void {
        objDes || (objDes = {});
        objSource || (objSource = {});
        for (var k in objSource) {
            objDes[k] = objSource[k];
        }
        return objDes;
    }


    /**
     * float 解调 short
     * @param floatArr
     * @param int16Arr
     * @return
     */
    public static FloatTo16BitPCM(floatArr: Float32Array, int16Arr: Int16Array): number {
        var soundData = 0.0;
        var power = 0;
        for (var j = 0; j < floatArr.length; j++) {
            soundData = Math.max(-1, Math.min(1, floatArr[j]));
            soundData = soundData < 0 ? soundData * Utility.SHORT_MIN : soundData * Utility.SHORT_MAX;
            int16Arr[j] = soundData;
            power += Math.abs(soundData);
        }
        return power;
    }


    /// <summary>
    /// 检查标识位
    /// </summary>
    /// <param name="state"></param>
    /// <param name="flag"></param>
    /// <returns></returns>
    public static IsBit(state: number, flag: number): boolean {
        return (state & flag) != 0;
    }
    /// <summary>
    /// 设置标识位
    /// </summary>
    /// <param name="state"></param>
    /// <param name="flag"></param>
    /// <param name="value"></param>
    public static SetBit(state: number, flag: number, value: boolean): number {
        if (value) {
            state |= flag;
        }
        else {
            state &= ~flag;
        }
        return state;
    }

    /**
     * String.Format
     * @param value
     * @param args
     */
    public static Format(value: string, ...args: any[]): string {
        return value.format(args);
    }

    public static IsNullOrEmpty(target: string) {
        if (target == null || target.length <= 0) {
            return true;
        }
        return false;
    }

    public static HasText(target: string) {
        return !Utility.IsNullOrEmpty(target);
    }

    public static CombineStringWithCount(value: string, count: number): string {
        // Assert.IsTrue(count >= 1, "count must be >= 1");
        // Assert.IsTrue(value.IndexOf('=') == -1, "value must not contain '='");
        if (count == 1)
            return value;
        return Utility.Format("{0}={1}", value, count.toString());
    }

    //, out string value, out int count
    //[boolean,string,number]
    public static TryParsingCombinedStringWithCount(combined: string): any {
        if (Utility.IsNullOrEmpty(combined)) {
            return [false, combined, 0];
        }
        let pair: string[] = combined.split('=');
        let value: string = pair[0];
        let count: number = 0;
        if (pair.length == 1) {
            // No count data - only one
            count = 1;
            return true;
        }
        let temp: number = parseInt(pair[1]);
        return [!isNaN(temp), value, count];
    }


    public static ParseStringToVector(str: string, separate: string = "|"): Laya.IClone {
        if (!str) {
            return null;
        }
        let strArr: string[] = str.split(separate);

        if (strArr.length == 2) {
            let vec: Laya.Vector2 = new Laya.Vector2(parseFloat(strArr[0]), parseFloat(strArr[1]));
            return vec;
        }

        if (strArr.length == 3) {
            let vec: Laya.Vector3 = new Laya.Vector3(parseFloat(strArr[0]), parseFloat(strArr[1]), parseFloat(strArr[2]));
            return vec;
        }


        if (strArr.length == 4) {
            let vec: Laya.Vector4 = new Laya.Vector4(parseFloat(strArr[0]), parseFloat(strArr[1]), parseFloat(strArr[2]), parseFloat(strArr[3]));
            return vec;
        }

        return null;
    }

    public static IntToColor32(intColor: number): Laya.Vector4 {
        let A: number = (intColor >> 24) & 0xFF
        let B: number = (intColor >> 16) & 0xFF;
        let G: number = (intColor >> 8) & 0xFF;
        let R: number = (intColor) & 0xFF        
        return new Laya.Vector4(R / 255, G / 255, B / 255, A / 255);
    }

    public static Color32ToInt(color: Laya.Vector4): number {
        let A: number = Utility.FloatToInt(color.w * 255);
        let B: number = Utility.FloatToInt(color.z * 255);
        let G: number = Utility.FloatToInt(color.y * 255);
        let R: number = Utility.FloatToInt(color.x * 255);
        let intColor: number = (A << 24) + (B << 16) + (G << 8) + R;
        return intColor;
    }

}