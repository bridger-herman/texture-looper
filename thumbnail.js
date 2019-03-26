export function updateActiveThumbnail() {
  $('.texture-thumb').removeClass('active');
  $('.texture-thumb').each((index, el) => {
    if (el.id.includes(sessionStorage['currentImg'])) {
      $(el).addClass('active');
    }
  });
}

export function createThumbnailSelector(index, imgData) {
  return $('<li/>', {
    class: 'texture-thumb',
    id: 'texture-thumb-' + index,
  }).append($('<img/>', {
    src: imgData,
    css: {
      width: '30%',
      height: 'auto',
    }
  })).append($('<p/>', {text: 'GRAD-' + index}))
}


