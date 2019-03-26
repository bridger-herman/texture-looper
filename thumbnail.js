import { setCropBackground, updateCropMask } from './crop.js'

function thumnailClickable(el) {
  $(el).on('click', (evt) => {
    let texThumbId = $(evt.target).parents('.texture-thumb').attr('id') || evt.target.id;
    let sliceIndex = texThumbId.lastIndexOf('-'); // Should be texture-thumb-<NUMBER>
    let imageIndex = texThumbId.substring(sliceIndex + 1);
    sessionStorage['currentImg'] = imageIndex;
    updateActiveThumbnail();

    let imgs = JSON.parse(sessionStorage['imgData']);
    let currentImgData = imgs[imageIndex];
    setCropBackground(currentImgData);

    updateCropMask();
  });
}

export function updateActiveThumbnail() {
  $('.texture-thumb').removeClass('active');
  $('.texture-thumb').each((index, el) => {
    if (el.id.includes(sessionStorage['currentImg'])) {
      $(el).addClass('active');
    }
  });
}

export function createThumbnailSelector(index, imgData) {
  let el = $('<li/>', {
    class: 'texture-thumb',
    id: 'texture-thumb-' + index,
  }).append($('<img/>', {
    src: imgData,
    css: {
      width: '30%',
      height: 'auto',
    }
  })).append($('<p/>', {text: 'GRAD-' + index}));

  thumnailClickable(el);
  return el;
}
