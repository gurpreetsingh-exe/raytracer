import Ray from './ray.js';
import {Vec3, Point3, Color, reflect, refract, random_unit_vector} from './vec3.js';
import {rand} from './random.js';

class Material {
    constructor() {}

    scatter(ray_in, hit_rec, attenuation, scattered) {}
}

export class Lambertian extends Material {
    constructor(color) {
        super();
        this.color = color;

        this.scattered = new Ray(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
        this.attenuation = new Color(0, 0, 0);
    }

    scatter(ray_in, hit_rec) {
        const scatter_direction = hit_rec.normal.add(random_unit_vector());

        if (scatter_direction.near_zero()) {
            scatter_direction = hit_rec.normal;
        }

        this.scattered = new Ray(hit_rec.p, scatter_direction);
        this.attenuation = this.color;
        return true;
    }
}

export class Metal extends Material {
    constructor(color, fuzz) {
        super();
        this.color = color;
        this.fuzz = fuzz < 1.0 ? fuzz : 1.0;

        this.scattered = new Ray(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
        this.attenuation = new Color(0, 0, 0);
    }

    scatter(ray_in, hit_rec) {
        const reflected = reflect(ray_in.direction.normalize(), hit_rec.normal);
        this.scattered = new Ray(hit_rec.p, reflected.add(random_unit_vector().scale(this.fuzz)));
        this.attenuation = this.color;
        return (this.scattered.direction.dot(hit_rec.normal) > 0);
    }
}

export class Dielectric extends Material {
    constructor(ior) {
        super();
        this.ior = ior;

        this.scattered = new Ray(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
        this.attenuation = new Color(1.0, 1.0, 1.0);
    }

    reflectance(cosine, ref_idx) {
        let r0 = (1 - ref_idx) / (1 + ref_idx);
        r0 = r0 * r0;
        return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
    }

    scatter(ray_in, hit_rec) {
        this.attenuation = new Color(1.0, 1.0, 1.0);
        let refraction_ratio = hit_rec.front_face ? (1.0 / this.ior) : this.ior;

        const unit_direction = ray_in.direction.normalize();
        let cosine = Math.min(unit_direction.minus().dot(hit_rec.normal), 1.0);
        let sine = Math.sqrt(1.0 - (cosine * cosine));

        let cannot_refract = refraction_ratio * sine > 1.0;
        let direction;

        if (cannot_refract || this.reflectance(cosine, refraction_ratio) > rand()) {
            direction = reflect(unit_direction, hit_rec.normal);
        } else {
            direction = refract(unit_direction, hit_rec.normal, refraction_ratio);
        }

        this.scattered = new Ray(hit_rec.p, direction);
        return true;
    }
}

