function wrapper(selectorA, selectorB) {
  function initCanvas() {
    const canvas = document.createElement('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.style.zIndex = 1000000;
    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style['pointer-events'] = 'none';

    const ctx = canvas.getContext('2d');

    return { canvas, ctx };
  }

  function getElemCenter(selector) {
    const el = document.querySelectorAll(selector)[0];
    if (!el) {
      return;
    }
    
    const rect = el.getBoundingClientRect();
    const y = rect.top + el.offsetHeight / 2;
    const x = rect.left + el.offsetWidth / 2;

    // const x = el.offsetLeft + el.offsetWidth / 2;
    // const y = el.offsetTop + el.offsetHeight / 2;

    return { x, y };
  }

  function canvasDrawLine(ctx, a, b) {
    const { x: x1, y: y1 } = a;
    const { x: x2, y: y2 } = b;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function clear(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawLineBetweenElements(canvas, ctx, selectorA, selectorB) {
    clear(canvas, ctx);

    const pointA = getElemCenter(selectorA);
    const pointB = getElemCenter(selectorB);

    if (pointA && pointB) {
      canvasDrawLine(ctx, pointA, pointB);
    }
  }

  function bindElements(selectorA, selectorB) {
    let canvas;
    let ctx;

    const buildCanvas = () => {
      if (canvas) {
        document.body.removeChild(canvas);
      }

      const res = initCanvas();

      canvas = res.canvas;
      ctx = res.ctx;

      document.body.appendChild(canvas);

      drawLineBetweenElements(canvas, ctx, selectorA, selectorB);
    };

    buildCanvas();

    let rafID;

    const withRaf = (fn) => {
      return (...args) => {
        if (rafID) {
          window.cancelAnimationFrame(rafID);
          rafID = undefined;
        }

        rafID = window.requestAnimationFrame(() => {
          fn(...args);
        });
      };
    };

    document.addEventListener(
      'scroll',
      withRaf(() => {
        drawLineBetweenElements(canvas, ctx, selectorA, selectorB);
      }),
      true
    );

    window.addEventListener(
      'resize',
      withRaf(() => {
        buildCanvas();
      })
    );

    // TODO better check mutationsList
    let skipNext = false
    const observer = new MutationObserver((mutationsList, observer) => {
    	if (!skipNext) {
				skipNext = true
				buildCanvas();
			} else {
				skipNext = false
			}
    });

    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    // observer.disconnect();
  }

  bindElements(selectorA, selectorB);
}

wrapper('.box-absolute', '.box-fixed');
wrapper('.box-scroll', '.box-fixed');
wrapper('.box-sticky', '.box-absolute');
wrapper('.box-sticky', '.box-inline');

// wrapper('.news__tab-text', '.input__voice-search');

document.querySelectorAll('#btn1')[0].addEventListener('click', () => {
  const div = document.createElement('div');

  div.style.height = '20px';

  document.body.insertBefore(div, document.body.childNodes[0]);
});
