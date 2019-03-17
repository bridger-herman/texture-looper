const TEST_IMG = './s3.png'

function setCropBackground(data) {
  $('#image-to-crop').attr('src', data);
  $('#image-to-crop').css({
    'height': '100vh',
    'width': 'auto',
  });
}

function setCropContainment() {
  $('#crop-area').draggable('option', 'containment', '#image-to-crop');
}

function setHandleContainment() {
  $('.resize-handle').draggable('option', 'containment', '#image-to-crop');
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
    $('#crop-area').draggable({scroll: false});
    setCropContainment();
  });
  $('#crop-area').append($('<div/>', {class: 'crop-mask left'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask right'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask top'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask bottom'}));

  // $('#crop-area').append($('<div/>', {class: 'resize-handle up left'}))
  // $('#crop-area').append($('<div/>', {class: 'resize-handle up right'}))
  // $('#crop-area').append($('<div/>', {class: 'resize-handle low left'}))
  $('#crop-area').append($('<div/>', {class: 'resize-handle low right'}))

  $('.resize-handle').draggable({scroll: false});
  setHandleContainment();

  // Resize the crop area based on current dragging
  $('.resize-handle').on('drag', (evt, ui) => {
    let newSize = evt.clientY - $('#crop-area').offset().top;
    $('#crop-area').css({
      height: newSize,
      width: newSize,
    });
    ui.position.left = newSize - 10;
    setCropContainment();
    setHandleContainment();
  });

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
