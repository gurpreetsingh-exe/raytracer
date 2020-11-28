import HittableList from './hittable_list.js';
import {Lambertian, Metal, Dielectric} from './material.js';
import Sphere from './sphere.js';
import {Vec3, Point3, Color, rand_v, rand_range_v} from './vec3.js';
import {rand, rand_range} from './random.js';

export function random_scene() {
    let world = new HittableList();

    const ground_mt = new Lambertian(new Color(0.5, 0.5, 0.5));
    world.add(new Sphere(new Point3(0, -1000, 0), 1000, ground_mt));

    let random_amount = 11;
    for (let i = -random_amount; i < random_amount; ++i) {
        for (let j = -random_amount; j < random_amount; ++j) {
            let mat = rand();
            let center = new Point3(i + (0.9 * rand()), 0.2, j + (0.9 * rand()));

            if (center.subtract(new Point3(4, 0.2, 0)).length() > 0.9) {
                if (mat < 0.8) {
                    let albedo = rand_v().multiply(rand_v());
                    let sphere_material = new Lambertian(albedo);
                    world.add(new Sphere(center, 0.2, sphere_material));
                } else if (mat < 0.95) {
                    let albedo = rand_range_v(0.5, 1);
                    let fuzz = rand_range(0, 0.5);
                    let sphere_material = new Metal(albedo, fuzz);
                    world.add(new Sphere(center, 0.2, sphere_material));
                } else {
                    let sphere_material = new Dielectric(1.5);
                    world.add(new Sphere(center, 0.2, sphere_material));
                }
            }
        }
    }

    const mat1 = new Dielectric(1.5);
    world.add(new Sphere(new Point3(0, 1, 0), 1, mat1));

    const mat2 = new Lambertian(new Color(0.4, 0.2, 0.1));
    world.add(new Sphere(new Point3(-4, 1, 0), 1, mat2));

    const mat3 = new Metal(new Color(0.7, 0.6, 0.5), 0);
    world.add(new Sphere(new Point3(4, 1, 0), 1, mat3));

    return world;
}
