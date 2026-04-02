export function buildScript(): string {
  return `
(function() {
  var card = document.querySelector('.card');
  var canvas = document.querySelector('.card-canvas');
  var ctx = canvas.getContext('2d');

  // State
  var targetX = 0; // rotateY target (-1 to 1)
  var targetY = 0; // rotateX target (-1 to 1)
  var currentX = 0;
  var currentY = 0;
  var MAX_TILT = 8;
  var LERP = 0.08;
  var inputActive = false;
  var idleTime = 0;

  // Resize canvas to match card pixel dimensions
  function resizeCanvas() {
    var rect = card.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Input: Mouse ---
  document.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
    targetY = Math.max(-1, Math.min(1, -(e.clientY - cy) / (window.innerHeight / 2)));
    inputActive = true;
  });

  document.addEventListener('mouseleave', function() {
    targetX = 0;
    targetY = 0;
    inputActive = false;
  });

  // --- Input: Accelerometer ---
  var hasGyro = false;
  var baseBeta = null;
  var baseGamma = null;
  var calibrationSamples = 0;

  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    hasGyro = true;

    // Calibrate from first few readings to establish "neutral" hold position
    if (calibrationSamples < 5) {
      if (baseBeta === null) {
        baseBeta = e.beta;
        baseGamma = e.gamma;
      } else {
        baseBeta = baseBeta * 0.7 + e.beta * 0.3;
        baseGamma = baseGamma * 0.7 + e.gamma * 0.3;
      }
      calibrationSamples++;
      return;
    }

    var db = e.beta - baseBeta;
    var dg = e.gamma - baseGamma;
    targetX = Math.max(-1, Math.min(1, dg / 30));
    targetY = Math.max(-1, Math.min(1, -db / 30));
    inputActive = true;
  }

  function startGyro() {
    window.addEventListener('deviceorientation', handleOrientation);
  }

  if (typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ — permission must be requested inside a user gesture
      document.addEventListener('touchend', function() {
        DeviceOrientationEvent.requestPermission().then(function(state) {
          if (state === 'granted') startGyro();
        }).catch(function() {});
      }, { once: true });
    } else {
      startGyro();
    }
  }

  // --- Idle animation ---
  function idleTilt(t) {
    targetX = Math.sin(t * 0.0005) * 0.15;
    targetY = Math.cos(t * 0.0007) * 0.1;
  }

  // --- Canvas shine ---
  function paintShine(w, h, lx, ly) {
    ctx.clearRect(0, 0, w, h);

    // Specular highlight — moves opposite to tilt
    var specX = w * (0.5 - lx * 0.4);
    var specY = h * (0.5 - ly * 0.4);
    var specRadius = Math.max(w, h) * 0.7;
    var grad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specRadius);
    grad.addColorStop(0, 'rgba(255,255,255,0.12)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.04)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Edge glow on the side nearest the light
    var edgeGrad;
    if (Math.abs(lx) > Math.abs(ly)) {
      var ex = lx < 0 ? 0 : w;
      edgeGrad = ctx.createLinearGradient(ex, 0, ex + (lx < 0 ? w * 0.3 : -w * 0.3), 0);
    } else {
      var ey = ly < 0 ? 0 : h;
      edgeGrad = ctx.createLinearGradient(0, ey, 0, ey + (ly < 0 ? h * 0.3 : -h * 0.3));
    }
    edgeGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
    edgeGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // --- Animation loop ---
  function frame(t) {
    if (!inputActive) {
      idleTime = t;
      idleTilt(t);
    }

    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;

    var rotY = currentX * MAX_TILT;
    var rotX = -currentY * MAX_TILT;

    card.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';

    // Shadow shifts opposite to tilt
    var sx = -currentX * 20;
    var sy = currentY * 20;
    card.style.boxShadow =
      (sx * 0.1) + 'px ' + (sy * 0.1 + 2) + 'px 4px rgba(0,0,0,0.2), ' +
      (sx * 0.3) + 'px ' + (sy * 0.3 + 8) + 'px 16px rgba(0,0,0,0.18), ' +
      (sx * 0.6) + 'px ' + (sy * 0.6 + 20) + 'px 40px rgba(0,0,0,0.15), ' +
      (sx) + 'px ' + (sy + 40) + 'px 80px rgba(0,0,0,0.12)';

    var rect = card.getBoundingClientRect();
    paintShine(rect.width, rect.height, currentX, currentY);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // --- Name auto-fit ---
  function fitName() {
    var el = document.querySelector('.card-name');
    var container = el && el.closest('.card-main');
    if (!el || !container) return;
    el.style.fontSize = '';
    var size = parseFloat(window.getComputedStyle(el).fontSize);
    while (el.scrollWidth > container.offsetWidth && size > 8) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }
  requestAnimationFrame(fitName);
  window.addEventListener('resize', fitName);
})();
  `;
}
