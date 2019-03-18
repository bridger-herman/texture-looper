function resetHandles() {
  let cropArea = $('#crop-area');
  $('.resize-handle').draggable('option', 'containment', '#image-to-crop');
  $('.resize-handle.low.right').offset({left: cropArea.offset().left + cropArea.width() - 10, top: cropArea.offset().top + cropArea.height() - 10});
  $('.resize-handle.up.left').offset({left: cropArea.offset().left - 10, top: cropArea.offset().top - 10});
}

function initHandles() {
  $('#crop-area').append($('<div/>', {class: 'resize-handle up left'}))
  // $('#crop-area').append($('<div/>', {class: 'resize-handle up right'}))
  // $('#crop-area').append($('<div/>', {class: 'resize-handle low left'}))
  $('#crop-area').append($('<div/>', {class: 'resize-handle low right'}))

  $('.resize-handle').draggable({scroll: false});
  resetHandles();

  // Resize the crop area based on current dragging
  $('.resize-handle.low.right').on('drag', (evt, ui) => {
    let newSize = evt.clientY - $('#crop-area').offset().top;
    $('#crop-area').css({
      height: newSize,
      width: newSize,
    });
    ui.position.left = newSize - 10;
    $('#crop-area').draggable('option', 'containment', '#image-to-crop');
    resetHandles();
  });
  $('.resize-handle.up.left').on('drag', (evt, ui) => {
    let originalPosition = $('#crop-area').offset();
    let newSize = $('#crop-area').height() - (evt.clientY - $('#crop-area').offset().top);
    $('#crop-area').css({
      height: newSize,
      width: newSize,
      left: (evt.clientY - originalPosition.top) + originalPosition.left,
      top: evt.clientY,
    });
    ui.position.left = -10;
    ui.position.top = -10;
    $('#crop-area').draggable('option', 'containment', '#image-to-crop');
    resetHandles();
  });

}
