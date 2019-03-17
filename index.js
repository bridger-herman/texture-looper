const TEST_IMG = './s3.png'

function setCropBackground(data) {
  $('#image-to-crop').attr('src', data);
  $('#image-to-crop').css({
    'height': '100vh',
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

  $('#crop-area').draggable({containment: 'parent'});
}

window.onload = init
