import { importWasm } from './loadWasm.js'
import initHandles from './handles.js'
import { updateActiveThumbnail, setCropBackground, setCropContainment,
  setImage, getCroppedImage, getCroppedImageToSave, updateCropMask,
  createThumbnailSelector, setCropNormalMap } from './crop.js'

function init() {
  // Try to load the image url from storage (don't lose data over refresh)
  if (sessionStorage['currentImg']) {
    let imgs = JSON.parse(sessionStorage['imgData']);
    setCropBackground(sessionStorage['currentImg']);

    for (let i in imgs) {
      $('#texture-list').prepend(createThumbnailSelector(i, imgs[i]));
    }

    updateActiveThumbnail();
    setCropNormalMap();
    // $('#drag-n-drop').css('display', 'none');
  }

  $('#file-upload').on('change', (evt) => {
    if (!evt.target.files || !evt.target.files[0]) {
      alert('No files uploaded!');
      return;
    }

    let reader = new FileReader();
    $(reader).on('load', (evt) => setImage(evt.target.result));
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
    updateCropMask();
    setCropNormalMap();
  });

  // Set up the repeat preview checkbox
  $('#show-repeat-preview').on('change', (evt) => {
    updateCropMask();
  });

  $('button#save').on('click', (evt) => {
    let dataUrl = getCroppedImageToSave();
    // Create a link and virtually click it to initiate download
    // https://stackoverflow.com/a/21210576
    var link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'texture.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  $('button#save-normal-map').on('click', (evt) => {
    let dataUrl = getCroppedImageToSave();
    let normalMapData = calculateNormalMap(dataUrl);

    // Create a link and virtually click it to initiate download
    // https://stackoverflow.com/a/21210576
    var link = document.createElement('a');
    link.href = normalMapData;
    link.download = 'normal-map.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Setup the resizing handles
  initHandles();

  // Setup file drag/drop
  $('body').on('drop', (evt) => {
    evt.preventDefault();
    let e = evt.originalEvent;
    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) {
      alert('No files uploaded!');
      return;
    }

    let reader = new FileReader();
    $(reader).on('load', () => setImage(evt.target.result));
    reader.readAsDataURL(e.dataTransfer.files[0]);
  });
  $('body').on('dragover', (evt) => {
    evt.preventDefault();
    // $('#drag-n-drop').css('display', 'block');
    // $('#drag-n-drop').css('background-color', 'white');
  });

  // Set up saving for project name
  $('#project-name').on('keyup', (evt) => {
    evt.target.style.borderColor = 'black';
    sessionStorage.setItem('projectName', evt.target.value);
    setTimeout(() => {
      evt.target.style.borderColor = '#9ea';
    }, 500);
  });
}

window.onload = () => {
  importWasm().then(init);
}
