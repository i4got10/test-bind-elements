function bindElements(selectorA, selectorB) {
  function createCanvasElement() {
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

  function getElementCenter(selector) {
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

  function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawLineBetweenElements(canvas, ctx, selectorA, selectorB) {
    const pointA = getElementCenter(selectorA);
    const pointB = getElementCenter(selectorB);

    if (pointA && pointB) {
      canvasDrawLine(ctx, pointA, pointB);
    }
  }

  function run(selectorA, selectorB) {
    let canvas;
    let ctx;
    let rafID;

    const addCanvasToBody = () => {
      if (canvas) {
        document.body.removeChild(canvas);
      }

      const res = createCanvasElement();

      canvas = res.canvas;
      ctx = res.ctx;

      document.body.appendChild(canvas);

      drawLineBetweenElements(canvas, ctx, selectorA, selectorB);
    };

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

    const listenScroll = () => {
      document.addEventListener(
        'scroll',
        withRaf(() => {
          clearCanvas(canvas, ctx);
          drawLineBetweenElements(canvas, ctx, selectorA, selectorB);
        }),
        true
      );
    };

    const listenResize = () => {
      window.addEventListener(
        'resize',
        withRaf(() => {
          addCanvasToBody();
        })
      );
    };

    const listenDOMMutations = () => {
      // TODO better check mutationsList
      let skipNext = false;
      const observer = new MutationObserver((mutationsList, observer) => {
        if (!skipNext) {
          skipNext = true;
          addCanvasToBody();
        } else {
          skipNext = false;
        }
      });

      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
      // observer.disconnect();
    };

    addCanvasToBody();
    listenScroll();
    listenResize();
    listenDOMMutations();
  }

  run(selectorA, selectorB);
}
