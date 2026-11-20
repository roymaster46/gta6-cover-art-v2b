// Fixed scenes for screenshots: ?shot=cover shows the exported poster alone,
// ?shot=editor shows the studio with the sample crew loaded, ?shot=wide the
// Wide Strip layout. `layout`, `grade` and `size` pick the scene's options.
// window.__shotReady is set once the poster has been painted.
export async function runShot(shot, query, setup) {
  const layout = query.get('layout') ?? 'coast';
  const grade = query.get('grade') ?? 'sunset';
  const size = query.get('size') ?? '1920x1080';
  if (shot === 'cover' || shot === 'wide') document.body.classList.add('shot-cover');
  await setup({ layout, grade, size, shot });
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
