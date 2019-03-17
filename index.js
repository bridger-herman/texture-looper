const TEST_IMG = './s3.png'

function setCropBackground(data) {
  $('#image-to-crop').attr('src', data);
  $('#image-to-crop').css({
    'height': '100vh',
    'width': 'auto',
  });
}

function init() {
  // Try to load the image url from storage (don't lose data over refresh)
  if (sessionStorage['imgData'] != null) {
    setCropBackground(sessionStorage['imgData']);
  }

  $('#file-upload').on('change', (evt) => {
    if (!evt.target.files || !evt.target.files[0]) {
      alert('No files uploaded!');
      return;
    }

    let reader = new FileReader();
    $(reader).on('load', (fileEvent) => {
      setCropBackground(fileEvent.target.result);

      // Store the base64 image data
      sessionStorage.setItem('imgData', fileEvent.target.result);
    });
    reader.readAsDataURL(evt.target.files[0]);
  });

  let image = $('#image-to-crop');
  image.load(() => {
    $('#crop-area').draggable({
      containment: [
        image.offset().left,
        image.offset().top,
        image.offset().left + image.width() - $('#crop-area').width(),
        image.offset().top + image.height() - $('#crop-area').height(),
      ],
    });
  });
  $('#crop-area').append($('<div/>', {class: 'crop-mask left'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask right'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask top'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask bottom'}));

  $('button#save').on('click', (evt) => {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let img = document.getElementById('image-to-crop');
    let scaleFactorX = img.naturalWidth / img.width;
    let scaleFactorY = img.naturalHeight / img.height;

    let cropAreaHeight = $('#crop-area').height();
    canvas.width = scaleFactorX * cropAreaHeight;
    canvas.height = scaleFactorY * cropAreaHeight;

    let offset = $('#crop-area').offset();
    ctx.drawImage(img, scaleFactorX * -offset.left, scaleFactorY * -offset.top);
    let dataUrl = canvas.toDataURL('image/png');
    window.open(dataUrl);
  });
}

window.onload = init
