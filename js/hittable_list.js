import {Hittable} from './hittable.js';

export default class HittableList extends Hittable {
    constructor() {
        super();
    }

    add(object) {
        this.objects.add(object);
    }

    clear() {
        this.objects.clear();
    }

    hit(ray, t_min, t_max, hit_rec) {
        const temp_rec = hit_rec;
        let hit_anything = false;
        let closest_so_far = t_max;

        for (const object of this.objects) {
            if (object.hit(ray, t_min, closest_so_far, temp_rec)) {
                hit_anything = true;
                closest_so_far = temp_rec.t;
                hit_rec = temp_rec;
            }
        }

        return hit_anything;
    }
}