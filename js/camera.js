import Ray from './ray.js';
import {random_in_unit_disk} from './vec3.js';

export default class Camera {
    constructor(lookfrom, lookat, vup, fov, aspect_ratio, aperture, focus_dist) {
        let theta = fov * (Math.PI / 180);
        let h = Math.tan(theta / 2);
        this.viewport_height = 2 * h;
        this.viewport_width = aspect_ratio * this.viewport_height;

        this.w = lookfrom.subtract(lookat).normalize();
        this.u = vup.cross(this.w).normalize();
        this.v = this.w.cross(this.u);

        this.origin = lookfrom;
        this.horizontal = this.u.scale(this.viewport_width).scale(focus_dist);
        this.vertical = this.v.scale(this.viewport_height).scale(focus_dist);
        this.lower_left_corner = this.origin
            .subtract(this.horizontal.divide(2))
            .subtract(this.vertical.divide(2))
            .subtract(this.w.scale(focus_dist));

        this.lens_radius = aperture / 2;
    }

    get_ray(s, t) {
        const rd = random_in_unit_disk().scale(this.lens_radius);
        const offset = this.u.scale(rd.x).add(this.v.scale(rd.y));

        const direction = this.lower_left_corner
            .add(this.horizontal.scale(s))
            .add(this.vertical.scale(t))
            .subtract(this.origin)
            .subtract(offset);

        return new Ray(this.origin.add(offset), direction);
    }
}