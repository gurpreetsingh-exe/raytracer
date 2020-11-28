function clamp(val, min, max) {
    if (val < min) {
        return min;
    }

    if (val > max) {
        return max;
    }

    return val;
}

function write_color(pixel_color) {
    return `rgb(${255.99 * pixel_color.x},
                ${255.99 * pixel_color.y}, 
                ${255.99 * pixel_color.z})`;
}

export function write_color_ms(pixel_color, samples_per_pixel) {
    let r = pixel_color.x;
    let g = pixel_color.y;
    let b = pixel_color.z;

    let scale = 1 / samples_per_pixel;
    r = Math.sqrt(scale * r);
    g = Math.sqrt(scale * g);
    b = Math.sqrt(scale * b);

    return `${parseInt(256 * clamp(r, 0.0, 0.999))} ${parseInt(256 * clamp(g, 0.0, 0.999))} ${parseInt(256 * clamp(b, 0.0, 0.999))}\n`;
}