export function rand() {
    return Math.random();
}

export function rand_range(min, max) {
    return min + (max - min) * rand();
}
