import {Vec3, Point3} from './vec3.js';

export class HitRecord {
    constructor() {
        this.p = new Point3(0, 0, 0);
        this.normal = new Vec3(0, 0, 0);
        this.t = 0;
        this.front_face;

        this.material;
    }

    set_face_normal(ray, outward_normal) {
        this.front_face = ray.direction.dot(outward_normal) < 0;
        this.normal = this.front_face ? outward_normal : outward_normal.minus();
    }
}

export class Hittable {
    constructor() {
        this.objects = new Set();
    }

    hit(ray, t_min, t_max, hit_rec) {}
}