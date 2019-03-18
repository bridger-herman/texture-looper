let CROP_CANVAS = document.createElement('canvas');

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

// Returns data URL to updated cropped image
function getCroppedImage() {
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

  $('#crop-area').draggable({scroll: false, containment: '#image-to-crop'});
  $('#crop-area').append($('<div/>', {class: 'crop-mask left'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask right'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask top'}));
  $('#crop-area').append($('<div/>', {class: 'crop-mask bottom'}));

  $('#crop-area').on('dragstart', (evt) => {
    $('.crop-mask').css('background-image', 'none');
  });
  $('#crop-area').on('dragstop', (evt) => {
    if (document.getElementById('show-repeat-preview').checked) {
      $('.crop-mask').css('background-image', 'url(' + getCroppedImage() + ')');
    } else {
      $('.crop-mask').css('background-image', 'none');
    }
  });

  // Set up the repeat preview checkbox
  $('#show-repeat-preview').on('change', (evt) => {
    if (evt.target.checked) {
      $('.crop-mask').css('background-image', 'url(' + getCroppedImage() + ')');
    } else {
      $('.crop-mask').css('background-image', 'none');
    }
  });


  $('button#save').on('click', (evt) => {
    let dataUrl = getCroppedImage();

    // Create a link and virtually click it to initiate download
    // https://stackoverflow.com/a/21210576
    var link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'texture.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Setup the resizing handles
  initHandles();
}

window.onload = init
