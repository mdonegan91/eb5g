(function () {
  var slides = document.querySelectorAll('.slide');
  var prev = document.querySelector('.slide-arrow--prev');
  var next = document.querySelector('.slide-arrow--next');
  if (slides.length < 2) return;

  var INTERVAL = 6000;
  var DURATION = 800;
  var EASE = 'transform ' + DURATION + 'ms ease-in-out';
  var current = 0;
  var timer = null;
  var busy = false;

  function show(index, dir) {
    if (busy) return;
    busy = true;
    var from = slides[current];
    current = (index + slides.length) % slides.length;
    var to = slides[current];

    // Park the incoming slide off-screen on the side it enters from.
    to.style.transition = 'none';
    to.style.transform = 'translateX(' + (dir * 100) + '%)';
    to.classList.add('is-active');
    to.removeAttribute('aria-hidden');
    to.offsetWidth; // force layout so the start position sticks

    from.classList.add('is-leaving');
    from.classList.remove('is-active');
    from.setAttribute('aria-hidden', 'true');

    to.style.transition = EASE;
    from.style.transition = EASE;
    to.style.transform = 'translateX(0)';
    from.style.transform = 'translateX(' + (-dir * 100) + '%)';

    setTimeout(function () {
      from.classList.remove('is-leaving');
      from.style.transition = '';
      from.style.transform = '';
      to.style.transition = '';
      to.style.transform = '';
      busy = false;
    }, DURATION);
  }

  function start() {
    if (timer) return;
    timer = setInterval(function () { show(current + 1, 1); }, INTERVAL);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function go(dir) {
    show(current + dir, dir);
    stop();
    start();
  }

  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  start();
})();
