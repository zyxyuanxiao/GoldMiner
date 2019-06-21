class Mathf {
    public static Clamp01(value: number) {
        return Mathf.Clamp(value, 0, 1);
    }

    public static Clamp(value: number, min: number, max: number): number {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }
    static Deg2Rad: number = 0.0174532924;
    static Rad2Deg: number = 57.29578;
    static Lerp(a: number, b: number, t: number): number {
        if (t < 0)
            return a;
        if (t > 1)
            return b;
        return a + (b - a) * t;
    }

    //i为正数，描述由a到b方向上运动的长度.
    //a沿着b方向运动i距离后的数
    static MoveTowards(a: number, b: number, i: number): number {
        if (a == b)
            return a;
        if (a < b) {
            if (a + Math.abs(i) > b)
                return b;
            return a + Math.abs(i);
        }
        else if (a > b) {
            if (a - Math.abs(i) < b)
                return b;
            return a - Math.abs(i);
        }
    }

    static Abs(v: number) {
        return Math.abs(v);
    }

    static Min(...values: number[]): number {
        return Math.min(...values);
    }

    static Max(...values: number[]): number {
        return Math.max(...values);
    }

    static DistanceVec3(from: Laya.Vector3, to: Laya.Vector3): number {
        return (from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y) + (from.z - to.z) * (from.z - to.z)
    }

    static Vec3Add(src: Laya.Vector3, del: number) {
        return new Laya.Vector3(src.x + del, src.y + del, src.z + del)
    }

    static Vec3Mul(src: Laya.Vector3, del: number) {
        return new Laya.Vector3(src.x * del, src.y * del, src.z * del)
    }

    static Vec3AddByVec3(from: Laya.Vector3, to: Laya.Vector3) {
        return new Laya.Vector3(from.x + to.x, from.y + to.y, from.z + to.z)
    }

    static Vec3SubVec3(from: Laya.Vector3, to: Laya.Vector3) {
        return new Laya.Vector3(from.x - to.x, from.y - to.y, from.z - to.z)
    }
    
    //把世界坐标转换到当前节点的本地坐标下
    static InverseTransformPoint(transform:Laya.Transform3D, vec:Laya.Vector3):Laya.Vector3
    {
        var ret:Laya.Vector3 = Laya.Vector3.ZERO.clone();
        var quat:Laya.Quaternion = Laya.Quaternion.DEFAULT.clone();
        Laya.Quaternion.invert(transform.rotation, quat);
        Laya.Vector3.transformQuat(transform.position, quat, ret);
        ret = Mathf.Vec3SubVec3(vec, ret);
        Laya.Vector3.transformQuat(ret, transform.rotation, ret);
        return ret;
    }
}