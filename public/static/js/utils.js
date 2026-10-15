/**
 * PROTOMANIA UI Animation & Counter Utilities
 */

export function animateValue(el, start, end, duration = 650, prefix = "", suffix = "") {
  if (!el) return;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth easeOutCubic curve
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * ease;
    
    // Format decimals sensibly
    const formatted = end % 1 === 0 ? Math.round(current) : current.toFixed(1);
    el.textContent = `${prefix}${formatted}${suffix}`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      const finalFormatted = end % 1 === 0 ? Math.round(end) : end.toFixed(1);
      el.textContent = `${prefix}${finalFormatted}${suffix}`;
    }
  }
  
  requestAnimationFrame(update);
}
