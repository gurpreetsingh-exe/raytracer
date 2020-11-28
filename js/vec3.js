import {rand, rand_range} from './random.js';

export class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    minus() { 
        return new Vec3(-this.x, -this.y, -this.z);
    }

    add(v) {
        return new Vec3(this.x + v.x,
                        this.y + v.y,
                        this.z + v.z);
    }

    subtract(v) {
        return new Vec3(this.x - v.x,
                        this.y - v.y,
                        this.z - v.z);
    }

    scale(t) {
        return new Vec3(this.x * t,
                        this.y * t,
                        this.z * t);
    }

    divide(t) {
        return this.scale(1 / t);
    }

    multiply(v) {
        return new Vec3(this.x * v.x,
                        this.y * v.y,
                        this.z * v.z);
    }

    length() {
        return Math.sqrt(this.x * this.x
                       + this.y * this.y
                       + this.z * this.z);
    }

    length_squared() {
        return this.x * this.x
             + this.y * this.y
             + this.z * this.z;
    }

    dot(v) {
        return this.x * v.x
             + this.y * v.y
             + this.z * v.z;
    }

    cross(v) {
        return new Vec3(this.y * v.z - this.z * v.y,
                        this.z * v.x - this.x * v.z,
                        this.x * v.y - this.y * v.x);
    }

    normalize() {
        return this.divide(this.length());
    }

    near_zero() {
        const s = 1e-8;
        return (Math.abs(this.x) < s) && (Math.abs(this.y) < s) && (Math.abs(this.z) < s);
    }
}

export function rand_v() {
    return new Vec3(rand(), rand(), rand());
}

export function rand_range_v(min, max) {
    return new Vec3(rand_range(min, max), rand_range(min, max), rand_range(min, max));
}

export function random_in_unit_sphere() {
    while (true) {
        const p = rand_range_v(-1, 1);
        if (p.length_squared() >= 1) {
            continue;
        }
        return p;
    }
}

export function random_unit_vector() {
    return random_in_unit_sphere().normalize();
}

export function random_in_hemisphere(normal) {
    const in_unit_sphere = random_in_unit_sphere();
    if (in_unit_sphere.dot(normal) > 0.0) {
        return in_unit_sphere;
    } else {
        return in_unit_sphere.minus();
    }
}

export function random_in_unit_disk() {
    while (true) {
        let p = new Vec3(rand_range(-1, 1), rand_range(-1, 1), 0);
        if (p.length_squared() >= 1) {
            continue;
        }
        return p;
    }
}

export function reflect(v, n) {
    return v.subtract(n.scale(2 * v.dot(n)));
}

export function refract(uv, n, etai_over_etat) {
    let cos_theta = Math.min(uv.minus().dot(n), 1.0);
    const r_out_prep = uv.add(n.scale(cos_theta)).scale(etai_over_etat);
    const r_out_parallel = n.scale(-Math.sqrt(Math.abs(1.0 - r_out_prep.length_squared())));

    return r_out_prep.add(r_out_parallel);
}

export class Point3 extends Vec3 {};
export class Color extends Vec3 {};