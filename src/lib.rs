// Functions accessible from JavaScript
extern crate base64;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

pub mod image;
pub mod pixel;

use image::Image;
use pixel::Pixel;

const STRENGTH: f64 = 5.0;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen]
    pub fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

/// Normal map generator
/// Algorithm from: http://jon-martin.com/?p=123
#[wasm_bindgen]
pub fn normal_map(b64_image: String) -> String {
    let converted = Image::from(b64_image);
    let mut result = Image::new(converted.width, converted.height);
    for row in 1..result.height - 1 {
        for col in 1..result.width - 1 {
            let row_f = row as f64;
            let col_f = col as f64;
            let west = converted.get_pixel_mirrored(col_f - 1.0, row_f).luminance() * STRENGTH;
            let east = converted.get_pixel_mirrored(col_f + 1.0, row_f).luminance() * STRENGTH;
            let north = converted.get_pixel_mirrored(col_f, row_f - 1.0).luminance() * STRENGTH;
            let south = converted.get_pixel_mirrored(col_f, row_f + 1.0).luminance() * STRENGTH;

            let delta_x = ((east - west) + 1.0) * 0.5;
            let delta_y = ((south - north) + 1.0) * 0.5;

            result.set_pixel(row, col, Pixel::from_rgb(delta_x, delta_y, 1.0));
        }
    }
    let s = String::from(result);
    s
}
