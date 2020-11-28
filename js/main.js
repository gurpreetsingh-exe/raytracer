import Ray from './ray.js';
import Camera from './camera.js';
import {HitRecord} from './hittable.js';
import {Vec3, Point3, Color, rand_v, rand_range_v} from './vec3.js';
import {rand, rand_range} from './random.js';
import {write_color_ms} from './color.js';
import {random_scene} from './random_scene.js';

function ray_color(ray, world, depth) {
    let hit_rec = new HitRecord();

    if (depth <= 0) {
        return new Color(0, 0, 0);
    }

    if (world.hit(ray, 0.001, Infinity, hit_rec)) {
        hit_rec.material.scattered = new Ray(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
        hit_rec.material.attenuation = new Color(0, 0, 0);

        if (hit_rec.material.scatter(ray, hit_rec)) {
            return hit_rec.material.attenuation.multiply(ray_color(hit_rec.material.scattered, world, depth - 1));
        }

        return new Color(0, 0, 0);
    }

    const unit_direction = ray.direction.normalize();
    let t = 0.5 * (unit_direction.y + 1.0);

    return new Color(1.0, 1.0, 1.0).scale(1.0 - t).add(new Color(0.5, 0.7, 1.0).scale(t));
}

// Image
const aspect_ratio = 16 / 9;
const image_width = 400;
const image_height = image_width / aspect_ratio;
let samples_per_pixel = 50;
let max_depth = 50;

const world = random_scene();

// Camera
const lookfrom = new Point3(13, 2, 3);
const lookat = new Point3(0, 0, 0);
const vup = new Vec3(0, 1, 0);
let field_of_view = 20;
let aperture = 0.2;
let dist_to_focus = 10;

const camera = new Camera(
    lookfrom,
    lookat,
    vup,
    field_of_view,
    aspect_ratio,
    aperture,
    dist_to_focus);

// Render
console.log(`P3\n${image_width} ${image_height}\n255\n`);

for (let j = image_height - 1; j >= 0; --j) {

    process.stderr.clearLine(0)
    process.stderr.cursorTo(0)
    process.stderr.write(`Scanlines remaining: ${Math.floor(j)}`);

    for (let i = 0; i < image_width; ++i) {
        let pixel_color = new Color(0, 0, 0);
        for (let s = 0; s < samples_per_pixel; ++s) {
            let u = (i + rand()) / (image_width - 1);
            let v = (j + rand()) / (image_height - 1); 
            const ray = camera.get_ray(u, v);
            pixel_color = pixel_color.add(ray_color(ray, world, max_depth));
        }

        let color = write_color_ms(pixel_color, samples_per_pixel);
        console.log(color);
    }
}

console.error(`\nRendering Done, Samples: ${samples_per_pixel}, Resolution: ${image_width}x${image_height}`);