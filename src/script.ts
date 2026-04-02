export function buildScript(): string {
  return `
(function() {
  var card = document.querySelector('.card');
  var canvas = document.querySelector('.card-canvas');
  var page = document.querySelector('.card-page');
  var ctx = canvas.getContext('2d');

  // State
  var targetX = 0;
  var targetY = 0;
  var currentX = 0;
  var currentY = 0;
  var MAX_TILT = 8;
  var LERP = 0.08;
  var mouseActive = false;

  // Resize canvas to match card pixel dimensions
  function resizeCanvas() {
    var rect = card.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Input: Mouse (desktop only) ---
  document.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
    targetY = Math.max(-1, Math.min(1, -(e.clientY - cy) / (window.innerHeight / 2)));
    mouseActive = true;
  });

  document.addEventListener('mouseleave', function() {
    targetX = 0;
    targetY = 0;
    mouseActive = false;
  });

  // --- Ambient animation (always runs, drives tilt when no mouse) ---
  function ambientTilt(t) {
    targetX = Math.sin(t * 0.0004) * 0.12 + Math.sin(t * 0.00091) * 0.06;
    targetY = Math.cos(t * 0.00053) * 0.08 + Math.cos(t * 0.00037) * 0.04;
  }

  // --- Canvas shine ---
  function paintShine(w, h, lx, ly, t) {
    ctx.clearRect(0, 0, w, h);

    // Anime-style diagonal slash shine — fast sweep with long pause
    var cycle = (t * 0.00125) % 4; // 25% faster
    var sweep;
    if (cycle < 0.4) {
      sweep = (cycle / 0.4) * 1.6 - 0.3;
    } else {
      sweep = -1; // offscreen during pause
    }
    var slashX = w * sweep;
    var slashWidth = w * 0.35;

    ctx.save();
    // Rotate context ~30 degrees for diagonal slash
    var cx = w / 2;
    var cy = h / 2;
    ctx.translate(cx, cy);
    var angle = currentX * 0.8 + currentY * 0.4;
    ctx.rotate(angle);
    ctx.translate(-cx, -cy);

    // Hard-edged subtle shine band
    var slashGrad = ctx.createLinearGradient(slashX - slashWidth, 0, slashX + slashWidth, 0);
    slashGrad.addColorStop(0, 'rgba(255,255,255,0)');
    slashGrad.addColorStop(0.15, 'rgba(255,255,255,0)');
    slashGrad.addColorStop(0.2, 'rgba(255,255,255,0.08)');
    slashGrad.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    slashGrad.addColorStop(0.8, 'rgba(255,255,255,0.08)');
    slashGrad.addColorStop(0.85, 'rgba(255,255,255,0)');
    slashGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = slashGrad;
    ctx.fillRect(-w, -h, w * 3, h * 3);

    ctx.restore();

    // Soft ambient specular that follows tilt
    var specX = w * (0.5 - lx * 0.3);
    var specY = h * (0.5 - ly * 0.3);
    var specRadius = Math.max(w, h) * 0.6;
    var grad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specRadius);
    grad.addColorStop(0, 'rgba(255,255,255,0.07)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.02)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // --- Background light animation ---
  function paintBackground(t) {
    var x = 50 + Math.sin(t * 0.0003) * 30;
    var y = 50 + Math.cos(t * 0.0004) * 20;
    page.style.background =
      'radial-gradient(ellipse at ' + x + '% ' + y + '%, rgba(255,255,255,0.08) 0%, transparent 60%), ' +
      '#e8e4df';
  }

  // --- Animation loop ---
  function frame(t) {
    if (!mouseActive) {
      ambientTilt(t);
    }

    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;

    var rotY = currentX * MAX_TILT;
    var rotX = -currentY * MAX_TILT;

    card.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';

    var sx = -currentX * 20;
    var sy = currentY * 20;
    card.style.boxShadow =
      (sx * 0.1) + 'px ' + (sy * 0.1 + 2) + 'px 4px rgba(0,0,0,0.2), ' +
      (sx * 0.3) + 'px ' + (sy * 0.3 + 8) + 'px 16px rgba(0,0,0,0.18), ' +
      (sx * 0.6) + 'px ' + (sy * 0.6 + 20) + 'px 40px rgba(0,0,0,0.15), ' +
      (sx) + 'px ' + (sy + 40) + 'px 80px rgba(0,0,0,0.12)';

    var rect = card.getBoundingClientRect();
    paintShine(rect.width, rect.height, currentX, currentY, t);
    paintBackground(t);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // --- Text auto-fit ---
  function fitText(selector, minSize) {
    var el = document.querySelector(selector);
    var container = el && el.closest('.card-main');
    if (!el || !container) return;
    el.style.fontSize = '';
    var size = parseFloat(window.getComputedStyle(el).fontSize);
    while (el.scrollWidth > container.offsetWidth && size > minSize) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }
  function fitAll() {
    fitText('.card-name', 8);
    fitText('.card-title', 4);
  }
  requestAnimationFrame(fitAll);
  window.addEventListener('resize', fitAll);

  // --- QR expand on tap ---
  var qr = document.querySelector('.card-qr');
  var overlay = document.querySelector('.card-qr-overlay');
  if (qr && overlay) {
    qr.addEventListener('click', function(e) {
      e.stopPropagation();
      overlay.classList.add('active');
    });
    overlay.addEventListener('click', function() {
      overlay.classList.remove('active');
    });
  }
})();
  `;
}
