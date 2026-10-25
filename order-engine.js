const startMaskedGarmentEngine = () => {
  document.body.dataset.engine = 'masked-v1';
  const assets = 'assets/';
  const files = {
    Coverall: ['charcoal-work-coverall-mockup-3-base.png', 'charcoal-work-coverall-mockup-3-fabric-mask.png', 'charcoal-work-coverall-mockup-3-trim-mask.png'],
    Shirt: ['charcoal-gray-short-sleeved-uniform-shirt-1-base.png', 'charcoal-gray-short-sleeved-uniform-shirt-1-fabric-mask.png', 'charcoal-gray-short-sleeved-uniform-shirt-1-trim-mask.png'],
    Trousers: ['charcoal-straight-leg-uniform-trousers-2-base.png', 'charcoal-straight-leg-uniform-trousers-2-fabric-mask.png', 'charcoal-straight-leg-uniform-trousers-2-trim-mask.png'],
    Blazer: ['gray-blazer-product-mockup-2-base.png', 'gray-blazer-product-mockup-2-fabric-mask.png', 'gray-blazer-product-mockup-2-trim-mask.png'],
    Skirt: ['charcoal-gray-uniform-skirt-with-contrast-trim-4-base.png', 'charcoal-gray-uniform-skirt-with-contrast-trim-4-fabric-mask.png', 'charcoal-gray-uniform-skirt-with-contrast-trim-4-trim-mask.png']
  };
  const cache = new Map();
  const load = name => cache.has(name) ? cache.get(name) : cache.set(name, new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = assets + name; })).get(name);
  const rgb = hex => { const value = hex.replace('#', ''); return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)]; };
  const checked = name => document.querySelector(`input[name="${name}"]:checked`);
  const colour = kind => document.querySelector(`#${kind}-swatches .is-selected`)?.dataset.hex || (kind === 'fabric' ? '#233D68' : '#C28E3B');
  const visual = document.querySelector('.garment-visual'); let canvas = document.querySelector('#garment-canvas'); if (!canvas) { visual.replaceChildren(); canvas = document.createElement('canvas'); canvas.id = 'garment-canvas'; canvas.setAttribute('aria-label', 'Live garment preview'); visual.appendChild(canvas); } let pending = 0;
  const render = async () => {
    const names = files[checked('garment')?.value || 'Coverall']; const token = ++pending;
    try {
      const [base, fabricMask, trimMask] = await Promise.all(names.map(load)); if (token !== pending) return;
      const width = base.naturalWidth, height = base.naturalHeight; canvas.width = width; canvas.height = height;
      const work = document.createElement('canvas'); work.width = width; work.height = height; const ctx = work.getContext('2d', {willReadFrequently:true});
      const maskCanvas = document.createElement('canvas'); maskCanvas.width = width; maskCanvas.height = height; const maskCtx = maskCanvas.getContext('2d', {willReadFrequently:true});
      ctx.clearRect(0,0,width,height); ctx.drawImage(base,0,0); const pixels = ctx.getImageData(0,0,width,height);
      const apply = (mask, hex) => { maskCtx.clearRect(0,0,width,height); maskCtx.drawImage(mask,0,0,width,height); const alpha=maskCtx.getImageData(0,0,width,height).data; const [r,g,b]=rgb(hex); for(let i=0;i<pixels.data.length;i+=4){const amount=Math.max(alpha[i+3],alpha[i],alpha[i+1],alpha[i+2])/255;if(!amount||!pixels.data[i+3])continue;const lum=(.2126*pixels.data[i]+.7152*pixels.data[i+1]+.0722*pixels.data[i+2])/255;const shade=.28+lum*.72;pixels.data[i]=pixels.data[i]*(1-amount)+r*shade*amount;pixels.data[i+1]=pixels.data[i+1]*(1-amount)+g*shade*amount;pixels.data[i+2]=pixels.data[i+2]*(1-amount)+b*shade*amount;}};
      apply(fabricMask, colour('fabric')); apply(trimMask, colour('trim')); ctx.putImageData(pixels,0,0); const output=canvas.getContext('2d'); output.clearRect(0,0,width,height); output.drawImage(work,0,0);
    } catch (error) { console.error('Garment colour engine failed', error); }
  };
  document.querySelectorAll('input[name="garment"], #fabric-swatches button, #trim-swatches button').forEach(control => control.addEventListener('click', () => { requestAnimationFrame(render); setTimeout(render, 80); }));
  document.addEventListener('input', event => { if (event.target.closest('#uniform-panel')) setTimeout(render, 40); });
  new MutationObserver(() => requestAnimationFrame(render)).observe(document.querySelector('#fabric-current'), {childList:true,characterData:true,subtree:true});
  new MutationObserver(() => requestAnimationFrame(render)).observe(document.querySelector('#trim-current'), {childList:true,characterData:true,subtree:true}); render();
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startMaskedGarmentEngine); else startMaskedGarmentEngine();
