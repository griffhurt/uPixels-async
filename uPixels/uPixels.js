var brightnessSlider, delaySlider, startingPositionSlider, segmentLengthSlider
$(document).ready(function() {
  $("#colorpicker").spectrum({
    color: "rgb(0, 255, 155)",
    preferredFormat: 'rgb',
    showButtons: false,
    showInput: true
  });
  $("#second-colorpicker").spectrum({
    color: "rgb(0, 171, 255)",
    preferredFormat: 'rgb',
    showButtons: false,
    showInput: true,
    containerClassName: 'second-colorpicker',
    change: function(color) {
      console.log($(this).spectrum('get').toRgb());
    }
  });

  M.AutoInit();
  $('.tabs').tabs({
    'swipeable': true
  });

  delaySlider = document.getElementById('delay-slider');
  noUiSlider.create(delaySlider, {
    start: 10,
    step: 1,
    behavior: 'drag-tap',
    range: {
      'min': 10,
      'max': 1000
    },
    format: wNumb({
      decimals: 0
    })
  });

  delaySlider.noUiSlider.on('update', function(delay) {
    $('#delay-label').text(delay);
  })

  brightnessSlider = document.getElementById('brightness-slider');
  noUiSlider.create(brightnessSlider, {
    start: 100,
    step: 1,
    behavior: 'drag-tap',
    range: {
      'min': 0,
      'max': 100
    },
    format: wNumb({
      decimals: 0
    })
  });

  brightnessSlider.noUiSlider.on('update', function(brightness) {
    $('#brightness-label').text(brightness);
  })

  startingPositionSlider = document.getElementById('starting-position-slider');
  noUiSlider.create(startingPositionSlider, {
    start: 1,
    step: 1,
    behavior: 'drag-tap',
    range: {
      'min': [0],
      'max': [300]
    },
    format: wNumb({
      decimals: 0
    })
  });

  startingPositionSlider.noUiSlider.on('update', function(position) {
    $('#position-label').text(position);
  })
});

function changeVal(element, val) {
  $(element).val(+$(element).val() + val);
}

function togglePickers() {
  if ($("#random-color-checkbox").prop('checked')) {
    $("#colorpicker").spectrum("disable");
    $("#second-colorpicker").spectrum("disable");
    document.getElementById('brightness-slider').setAttribute('disabled', true);
  } else {
    $("#colorpicker").spectrum("enable");
    $("#second-colorpicker").spectrum("enable");
    document.getElementById('brightness-slider').removeAttribute('disabled');
  }
}

function toggleDelaySlider() {
  if ($("#default-delay-checkbox").prop('checked')) {
    document.getElementById('delay-slider').setAttribute('disabled', true);
  } else {
    document.getElementById('delay-slider').removeAttribute('disabled');
  }
}


function getFirstColor() {
  return $("#colorpicker").spectrum("get").toRgb();
}

function getBrightness() {
  return document.getElementById('brightness-slider').noUiSlider.get() / 100;
}

function getColorSelection() {
  brightness = getBrightness()
  if ($('#random-color-checkbox').is(":checked")) {
    return null
  } else {
    color = getFirstColor()
  }
  return {
    'r': Math.round(color['r'] * brightness),
    'g': Math.round(color['g'] * brightness),
    'b': Math.round(color['b'] * brightness)
  }
}

function getDelaySelection() {
  if ($('#default-delay-checkbox').is(":checked")) {
    return undefined
  } else {
    return document.getElementById('delay-slider').noUiSlider.get()
  }
}

function execute(action, params = {}) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/execute', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({'action': action, 'params': params}));
}

function rainbow() {
  execute('rainbow', {
    'ms': getDelaySelection(),
    'iterations': Number($('.rainbow .iterations').val())
  })
}

function bounce() {
  execute('bounce', {
    'ms': getDelaySelection(),
    'color': getColorSelection()
  })
}

function chase() {
  if ($('.chase #left').is(":checked")) {
    direction = 'left'
  } else {
    direction = 'right'
  }
  execute('chase', {
    'ms': getDelaySelection(),
    'color': getColorSelection(),
    'direction': direction
  })
}

function rgbFade() {
  execute('rgbFade', {
    'ms': getDelaySelection()
  })
}

function altColors() {
  if ($('#random-color-checkbox').is(":checked")) {
    secondColor = false
  } else {
    secondColor = $("#second-colorpicker").spectrum("get").toRgb()
  }
  execute('altColors', {
    'ms': getDelaySelection(),
    'firstColor': getColorSelection(),
    'secondColor': secondColor
  })
}

function randomFill() {
  execute('randomFill', {
    'ms': getDelaySelection(),
    'color': getColorSelection()
  })
}

function fillFromMiddle() {
  color
  execute('fillFromMiddle', {
    'ms': getDelaySelection(),
    'color': getColorSelection()
  })
}

function fillFromSides() {
  execute('fillFromSides', {
    'ms': getDelaySelection(),
    'color': getColorSelection()
  })
}

function fillStrip() {
  execute('fillStrip', {
    'ms': getDelaySelection(),
    'color': getColorSelection()
  })
}

function setSegment() {
  clearStrip();
  start = Number(document.getElementById('starting-position-slider').noUiSlider.get())
  execute('setSegment', {
    "segment_of_leds": Array.from(new Array(Number($(".segment-select").val())), (x, i) => i + start),
    "color": getColorSelection()
  })
}

function clearStrip() {
  execute('clear')
}
