// Draws the Vice Heat movie poster: seven portrait panels, a chrome title
// across the middle, a pink script subtitle, a press-quote top bar, a
// tagline strip and a billing block with a gold seal and a barcode.
// Everything is drawn in a 1920 x 1080 space; exports re-render this poster
// and crop it to the post size they need.
import { GRADES } from './grades.js';

/** The poster's native size. */
export const POSTER_W = 1920;
/** The poster's native size. */
export const POSTER_H = 1080;

/** The seven crew members, in panel order: hero first. */
export const CREW = [
  { id: 'driver', role: 'THE DRIVER', file: 'driver.jpg', place: 'OCEAN DRIVE', time: '6:42 PM', line: 'LOOKING FOR TROUBLE' },
  { id: 'boss', role: 'THE BOSS', file: 'boss.jpg', place: 'SILVER PALMS', time: '7:05 PM', line: 'OWNS THE ROOM' },
  { id: 'mechanic', role: 'THE MECHANIC', file: 'mechanic.jpg', place: 'GARAGE 88', time: '5:58 PM', line: 'FIXES ANYTHING' },
  { id: 'captain', role: 'THE CAPTAIN', file: 'captain.jpg', place: 'MARINA BAY', time: '5:16 PM', line: 'NEVER LOSES A RACE' },
  { id: 'rider', role: 'THE RIDER', file: 'rider.jpg', place: 'ROUTE 9', time: '8:20 PM', line: 'FASTER THAN RUMOR' },
  { id: 'lookout', role: 'THE LOOKOUT', file: 'lookout.jpg', place: 'ROOFTOP 12', time: '11:02 PM', line: 'SEES EVERYTHING' },
  { id: 'wheelman', role: 'THE WHEELMAN', file: 'wheelman.jpg', place: 'NEON STRIP', time: '12:30 AM', line: 'DRIVES THE GETAWAY' },
];

/** The two panel arrangements, in the order the studio lists them. */
export const LAYOUTS = {
  coast: 'Coast Grid',
  strip: 'Wide Strip',
};

/**
 * The seven panel rectangles for a layout, in CREW order, inside the
 * 1920 x 1080 poster. Coast Grid gives the hero driver the wide centre;
 * Wide Strip puts the hero on the left and the other six in a 3 x 2 grid.
 */
export function panelRects(layout) {
  const top = 84;
  const bottom = 920;
  const midY = 486;
  if (layout === 'strip') {
    const hero = { x: 28, y: top, w: 832, h: bottom - top };
    const cols = [872, 1216, 1560];
    const widths = [332, 332, 332];
    const rows = [top, 498];
    const heights = [midY - top, bottom - 498];
    const rest = [];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) rest.push({ x: cols[c], y: rows[r], w: widths[c], h: heights[r] });
    }
    return [hero, ...rest];
  }
  return [
    { x: 440, y: top, w: 740, h: bottom - top },
    { x: 28, y: top, w: 400, h: midY - top },
    { x: 28, y: 498, w: 400, h: bottom - 498 },
    { x: 1192, y: top, w: 344, h: midY - top },
    { x: 1548, y: top, w: 344, h: midY - top },
    { x: 1192, y: 498, w: 344, h: bottom - 498 },
    { x: 1548, y: 498, w: 344, h: bottom - 498 },
  ];
}

/** A rounded-rectangle path on `ctx`. */
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A five-pointed star path centred at (cx, cy). */
function starPath(ctx, cx, cy, outer, inner) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/** Draws `img` cover-fit into `rect`, with a zoom and a pan offset. */
function drawPhoto(ctx, img, rect, zoom, ox, oy, grade) {
  const scale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight) * zoom;
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = rect.x + (rect.w - dw) / 2 + ox * rect.w;
  const dy = rect.y + (rect.h - dh) / 2 + oy * rect.h;
  ctx.save();
  ctx.filter = grade.filter;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
  const wash = ctx.createLinearGradient(0, rect.y, 0, rect.y + rect.h);
  wash.addColorStop(0, grade.top);
  wash.addColorStop(1, grade.bottom);
  ctx.fillStyle = wash;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  // A soft shade at the foot so the role tag stays readable.
  const shade = ctx.createLinearGradient(0, rect.y + rect.h - 150, 0, rect.y + rect.h);
  shade.addColorStop(0, 'rgba(10, 4, 18, 0)');
  shade.addColorStop(1, 'rgba(10, 4, 18, 0.62)');
  ctx.fillStyle = shade;
  ctx.fillRect(rect.x, rect.y + rect.h - 150, rect.w, 150);
}

/** Draws one panel's role tag and its place/time caption. */
function drawPanelCaption(ctx, member, rect, top) {
  const pad = 16;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  // Caption line: place, time, one-liner. The tag sits beside it, below the
  // line at the foot, above it at the head (the hero's foot is behind the title).
  const lineY = top ? rect.y + 34 : rect.y + rect.h - 62;
  const tagY = top ? rect.y + 44 : rect.y + rect.h - 52;
  ctx.font = '700 21px "Arial Narrow", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  const caption = `${member.place} · ${member.time} — ${member.line}`;
  ctx.fillText(caption, rect.x + pad, lineY, rect.w - pad * 2);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  // Role tag: black chip with a gold leading bar.
  ctx.font = '800 27px Arial, sans-serif';
  const tw = ctx.measureText(member.role).width;
  const tagW = tw + 34;
  const tagH = 40;
  const tagX = rect.x + pad;
  ctx.fillStyle = 'rgba(8, 3, 14, 0.92)';
  ctx.fillRect(tagX, tagY, tagW, tagH);
  ctx.fillStyle = '#ffc93c';
  ctx.fillRect(tagX, tagY, 7, tagH);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(member.role, tagX + 18, tagY + 29);
  ctx.restore();
}

/** Draws one portrait panel: photo, grade, frame and caption. */
function drawPanel(ctx, member, photo, rect, grade, captionTop) {
  ctx.save();
  roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.clip();
  if (photo) drawPhoto(ctx, photo.img, rect, photo.zoom, photo.ox, photo.oy, grade);
  else {
    ctx.fillStyle = '#3a1c4d';
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }
  ctx.restore();
  ctx.save();
  roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
  drawPanelCaption(ctx, member, rect, captionTop);
}

/** The press-quote top bar: five gold stars, a quote, VOL and WANTED badges. */
function drawTopBar(ctx, state) {
  ctx.fillStyle = '#160a20';
  ctx.fillRect(0, 0, POSTER_W, 72);
  ctx.fillStyle = '#ffc93c';
  for (let i = 0; i < 5; i++) {
    starPath(ctx, 62 + i * 52, 38, 19, 8);
    ctx.fill();
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 700 30px Georgia, serif';
  ctx.fillStyle = '#ffe9a8';
  const quote = `“${state.quote}”`;
  const quoteW = ctx.measureText(quote).width;
  ctx.font = '700 22px Arial, sans-serif';
  const herald = '— THE COAST HERALD';
  const heraldW = ctx.measureText(herald).width;
  // Centre the quote and its attribution as one group, so they never overlap.
  const groupCx = 960 - (heraldW + 24) / 2;
  ctx.font = 'italic 700 30px Georgia, serif';
  ctx.fillText(quote, groupCx, 34);
  ctx.font = '700 22px Arial, sans-serif';
  ctx.fillStyle = '#c9a86a';
  ctx.textAlign = 'left';
  ctx.fillText(herald, groupCx + quoteW / 2 + 24, 36);
  // VOL badge.
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffc93c';
  ctx.fillRect(1648, 16, 108, 40);
  ctx.fillStyle = '#160a20';
  ctx.font = '800 24px Arial, sans-serif';
  ctx.fillText('VOL. 02', 1662, 44);
  // WANTED badge.
  ctx.fillStyle = '#ff2e88';
  ctx.fillRect(1772, 16, 132, 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('★ WANTED ★', 1784, 44);
}

/**
 * The chrome title, drawn on its own canvas so horizontal sun stripes can
 * be cut into the letters with a source-atop composite, then stamped on.
 */
function drawChromeTitle(ctx, text, cx, baseline, size) {
  const off = document.createElement('canvas');
  off.width = POSTER_W;
  off.height = 420;
  const o = off.getContext('2d');
  o.textAlign = 'center';
  o.textBaseline = 'alphabetic';
  o.font = `900 ${size}px "Arial Black", Arial, sans-serif`;
  try { o.letterSpacing = '4px'; } catch { /* older canvas: no tracking */ }
  const y = 300;
  o.shadowColor = '#ff2e88';
  o.shadowBlur = 34;
  o.shadowOffsetY = 10;
  o.lineJoin = 'round';
  o.strokeStyle = '#2a0a2e';
  o.lineWidth = size * 0.085;
  o.strokeText(text, cx, y);
  o.shadowBlur = 0;
  o.shadowOffsetY = 0;
  const chrome = o.createLinearGradient(0, y - size, 0, y + size * 0.12);
  chrome.addColorStop(0, '#fffbe8');
  chrome.addColorStop(0.32, '#ffd34d');
  chrome.addColorStop(0.55, '#ff7a2f');
  chrome.addColorStop(0.78, '#ff2e88');
  chrome.addColorStop(1, '#a81aff');
  o.fillStyle = chrome;
  o.fillText(text, cx, y);
  // Sun stripes across the lower half of the letters.
  o.globalCompositeOperation = 'source-atop';
  for (let sy = y - size * 0.28; sy < y + size * 0.1; sy += 30) {
    o.fillStyle = 'rgba(42, 10, 46, 0.28)';
    o.fillRect(0, sy, POSTER_W, 9);
  }
  // A white sheen along the top edge of the letters.
  const sheen = o.createLinearGradient(0, y - size, 0, y - size * 0.55);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
  o.fillStyle = sheen;
  o.fillRect(0, y - size, POSTER_W, size * 0.55);
  o.globalCompositeOperation = 'source-over';
  ctx.drawImage(off, 0, baseline - 300);
}

/** The pink neon script subtitle under the chrome title. */
function drawScriptSubtitle(ctx, text, cx, y) {
  ctx.save();
  ctx.translate(cx, y);
  ctx.rotate(-0.022);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 700 76px Georgia, serif';
  ctx.shadowColor = '#ff5fa2';
  ctx.shadowBlur = 26;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#4d0a33';
  ctx.lineWidth = 10;
  ctx.strokeText(text, 0, 0);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ff7fb8';
  ctx.fillText(text, 0, 0);
  ctx.fillStyle = '#ffd7ea';
  ctx.font = 'italic 700 72px Georgia, serif';
  ctx.fillText(text, 0, -3);
  ctx.restore();
}

/** The orange tagline strip between the panels and the billing block. */
function drawTaglineStrip(ctx, text) {
  const band = ctx.createLinearGradient(0, 932, 0, 992);
  band.addColorStop(0, '#ff8a2a');
  band.addColorStop(0.5, '#ff5e3a');
  band.addColorStop(1, '#e83e8c');
  ctx.fillStyle = band;
  ctx.fillRect(0, 932, POSTER_W, 60);
  ctx.fillStyle = '#1c0716';
  ctx.fillRect(0, 932, POSTER_W, 4);
  ctx.fillRect(0, 988, POSTER_W, 4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 32px Arial, sans-serif';
  try { ctx.letterSpacing = '6px'; } catch { /* older canvas */ }
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillText(text.toUpperCase(), 960, 963);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  try { ctx.letterSpacing = '0px'; } catch { /* older canvas */ }
}

/** A gold starburst seal with the original-art claim. */
function drawSeal(ctx, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.21);
  ctx.beginPath();
  for (let i = 0; i < 48; i++) {
    const rad = i % 2 === 0 ? r : r * 0.86;
    const a = (i * Math.PI) / 24;
    const x = rad * Math.cos(a);
    const y = rad * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = '#f5b301';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#7a5200';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.66, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#7a5200';
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#3a2400';
  ctx.font = '800 26px Arial, sans-serif';
  ctx.fillText('ORIGINAL', 0, -26);
  ctx.fillText('COVER ART', 0, 6);
  ctx.font = '800 20px Arial, sans-serif';
  ctx.fillText('★★★', 0, 36);
  ctx.restore();
}

/** A small barcode with its number, drawn from a fixed seed. */
function drawBarcode(ctx, x, y, w, h) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 8, y - 8, w + 16, h + 30);
  let seed = 90211060217;
  let bx = x;
  ctx.fillStyle = '#111111';
  while (bx < x + w) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const bw = 2 + (seed % 5);
    if (seed % 3 !== 0) ctx.fillRect(bx, y, bw, h);
    bx += bw + 2 + (seed % 3);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '400 17px Arial, sans-serif';
  ctx.fillText('8 90211 060217', x + w / 2, y + h + 2);
}

/** The billing block: credits on the left, COMING SOON and barcode right. */
function drawBilling(ctx) {
  ctx.fillStyle = '#12061a';
  ctx.fillRect(0, 992, POSTER_W, 88);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f5e6c8';
  ctx.font = '800 24px Arial, sans-serif';
  ctx.fillText('A VICE HEAT PICTURE', 28, 1022);
  ctx.fillStyle = '#b9a684';
  ctx.font = '400 19px Arial, sans-serif';
  ctx.fillText('STARRING YOUR CREW  ·  SHOT ON YOUR OWN CAMERA  ·  GRADED AT SUNSET', 28, 1048);
  ctx.fillText('VICE CITY  ·  OCEAN DRIVE  ·  PALMLINE STUDIOS  ·  ALL CHARACTERS ORIGINAL', 28, 1070);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffc93c';
  ctx.font = '800 34px Arial, sans-serif';
  ctx.fillText('COMING SOON', 1610, 1046);
  drawBarcode(ctx, 1660, 1010, 200, 44);
}

/**
 * Renders the whole poster onto `ctx` at the poster's native size.
 * `state` holds the title, subtitle, tagline, quote, layout, grade and a
 * `photos` array (CREW order) of { img, zoom, ox, oy } or null.
 */
export function renderPoster(ctx, state) {
  const grade = GRADES[state.grade] ?? GRADES.sunset;
  ctx.fillStyle = '#160a20';
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
  const rects = panelRects(state.layout);
  CREW.forEach((member, i) => {
    // The hero's foot sits behind the title, so its tag rides at the top.
    drawPanel(ctx, member, state.photos[i] ?? null, rects[i], grade, i === 0);
  });
  drawTopBar(ctx, state);
  // The chrome title, sized to span the poster, then the script subtitle.
  let size = 250;
  ctx.font = `900 ${size}px "Arial Black", Arial, sans-serif`;
  const title = state.title.trim().toUpperCase() || 'VICE HEAT';
  while (ctx.measureText(title).width > 1560 && size > 60) {
    size -= 6;
    ctx.font = `900 ${size}px "Arial Black", Arial, sans-serif`;
  }
  drawChromeTitle(ctx, title, POSTER_W / 2, 742, size);
  drawScriptSubtitle(ctx, state.subtitle.trim() || 'Kings of the Coast', POSTER_W / 2, 798);
  drawTaglineStrip(ctx, state.tagline);
  // The seal rides the poster's top-right corner, clear of every role tag.
  drawSeal(ctx, 1796, 132, 76);
  drawBilling(ctx);
}

/**
 * Renders the poster, then places it on `canvas` at the canvas's own size.
 * A landscape export takes the poster whole. A square or portrait export
 * keeps the whole poster too: it sits fitted on a blurred, darkened crop of
 * itself, so the title is never cut off at the sides the way a plain crop
 * would cut it.
 */
export function renderExport(canvas, state) {
  const poster = document.createElement('canvas');
  poster.width = POSTER_W;
  poster.height = POSTER_H;
  renderPoster(poster.getContext('2d'), state);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#160a20';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (canvas.width === POSTER_W && canvas.height === POSTER_H) {
    ctx.drawImage(poster, 0, 0);
    return;
  }
  // Backdrop: the poster cropped to cover, blurred and darkened.
  const coverScale = Math.max(canvas.width / POSTER_W, canvas.height / POSTER_H);
  const dw = POSTER_W * coverScale;
  const dh = POSTER_H * coverScale;
  ctx.save();
  ctx.filter = 'blur(28px) brightness(0.5) saturate(1.2)';
  ctx.drawImage(poster, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  ctx.restore();
  // Foreground: the whole poster, fitted inside the frame.
  const fitScale = Math.min(canvas.width / POSTER_W, canvas.height / POSTER_H);
  const fw = POSTER_W * fitScale;
  const fh = POSTER_H * fitScale;
  ctx.drawImage(poster, (canvas.width - fw) / 2, (canvas.height - fh) / 2, fw, fh);
}
