// Functions accessible from JavaScript
extern crate base64;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

pub mod image;
pub mod pixel;

use image::Image;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen]
    pub fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[wasm_bindgen]
pub fn calculate_normals(b64_image: String) -> String {
    let converted = Image::from(b64_image);
    let s = String::from(converted);
    s
}
