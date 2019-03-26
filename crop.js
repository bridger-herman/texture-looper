let EXPORT_WIDTH = 1024;
let EXPORT_HEIGHT = 1024;
let CROP_CANVAS = document.createElement('canvas');

export function updateCropMask() {
  if (document.getElementById('show-repeat-preview').checked) {
    $('.crop-mask').css('background-image', 'url(' + getCroppedImage() + ')');
  } else {
    $('.crop-mask').css('background-image', 'none');
  }
}

// Set the image background from some image data
export function setCropBackground(data) {
  $('#image-to-crop').attr('src', data);
  $('#image-to-crop').css({
    'height': '100vh',
    'width': 'auto',
  });
}

export function setCropContainment() {
  $('#crop-area').draggable('option', 'containment', '#image-to-crop');
}

// Set the image background from a newly uploaded image
export function setImage(imgData) {
  setCropBackground(imgData);

  // Store the base64 image data
  let currentImg;
  if (sessionStorage['currentImg']) {
    let imgs = JSON.parse(sessionStorage['imgData']);
    imgs.push(imgData);
    sessionStorage['imgData'] = JSON.stringify(imgs);
    currentImg = imgs.length - 1;
  } else {
    let arr = [imgData];
    currentImg = 0;
    sessionStorage.setItem('imgData', JSON.stringify(arr));
  }
  sessionStorage.setItem('currentImg', currentImg);

  // $('#drag-n-drop').css('display', 'none');
  $('#texture-list').prepend(createThumbnailSelector(currentImg, imgData));
  updateActiveThumbnail();
}

// Returns data URL to updated cropped image
export function getCroppedImage() {
  let ctx = CROP_CANVAS.getContext('2d');
  ctx.clearRect(0, 0, CROP_CANVAS.width, CROP_CANVAS.height);

  let img = document.getElementById('image-to-crop');
  let scaleFactorX = img.naturalWidth / img.width;
  let scaleFactorY = img.naturalHeight / img.height;

  let cropAreaHeight = $('#crop-area').height();
  CROP_CANVAS.width = scaleFactorX * cropAreaHeight;
  CROP_CANVAS.height = scaleFactorY * cropAreaHeight;

  let offset = $('#crop-area').offset();
  ctx.drawImage(img, scaleFactorX * -offset.left, scaleFactorY * -offset.top);
  return CROP_CANVAS.toDataURL('image/png');
}

// Returns data URL to canvas with size EXPORT_WIDTH, EXPORT_HEIGHT
export function getCroppedImageToSave() {
  let exportCanvas = document.createElement('canvas');
  let ctx = exportCanvas.getContext('2d');

  let img = document.getElementById('image-to-crop');
  let scaleFactorX = img.naturalWidth / img.width;
  let scaleFactorY = img.naturalHeight / img.height;

  let cropAreaHeight = $('#crop-area').height();
  exportCanvas.width = EXPORT_WIDTH;
  exportCanvas.height = EXPORT_HEIGHT;

  let offset = $('#crop-area').offset();
  ctx.drawImage(
    img, scaleFactorX * offset.left, scaleFactorY * offset.top,
    scaleFactorX * cropAreaHeight, scaleFactorY * cropAreaHeight, 0, 0,
    EXPORT_WIDTH, EXPORT_HEIGHT
  );
  return exportCanvas.toDataURL('image/png');
}


