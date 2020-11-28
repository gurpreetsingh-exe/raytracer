import {Hittable} from './hittable.js';

export default class Sphere extends Hittable {
    constructor(center, radius, material) {
        super();
        this.center = center;
        this.radius = radius;

        this.material = material;
    }

    hit(ray, t_min, t_max, hit_rec) {
        const oc = ray.origin.subtract(this.center);
        let a = ray.direction.length_squared();
        let half_b = oc.dot(ray.direction);
        let c = oc.length_squared() - (this.radius * this.radius);

        let discriminant = (half_b * half_b) - (a * c);
        if (discriminant < 0) {
            return false;
        }

        let sqrt_d = Math.sqrt(discriminant);

        let root = (-half_b - sqrt_d) / a;
        if (root < t_min || root > t_max) {
            root = (-half_b + sqrt_d) / a;
            if (root < t_min || root > t_max) {
                return false;
            }
        }

        hit_rec.t = root;
        hit_rec.p = ray.at(hit_rec.t);
        const outward_normal = hit_rec.p.subtract(this.center).divide(this.radius);

        hit_rec.set_face_normal(ray, outward_normal);

        hit_rec.material = this.material;

        return true;
    }
}