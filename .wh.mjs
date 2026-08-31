import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem("mr:preloaded","1")}catch{}});
await p.goto("http://localhost:3000/en", { waitUntil: "load" });

const idx = () => p.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]')?.getAttribute("aria-label"));
const box = () => p.evaluate(() => { const c = document.querySelector('[aria-roledescription="carousel"]'); const r = c.getBoundingClientRect();
  return { x: r.left + r.width/2, y: r.top + r.height/2, top: r.top }; });

// bring the carousel into view
await p.evaluate(() => document.querySelector('[aria-roledescription="carousel"]').scrollIntoView({ block: "center" }));
await new Promise(r => setTimeout(r, 1000));

// --- 1. wheel over the carousel must scroll the PAGE, not the carousel ---
const bBefore = await box();
const yBefore = await p.evaluate(() => window.scrollY);
const iBefore = await idx();
await p.mouse.move(bBefore.x, bBefore.y);
await p.mouse.wheel({ deltaY: 400 });
await new Promise(r => setTimeout(r, 900));
const yAfter = await p.evaluate(() => window.scrollY);
const iAfter = await idx();
console.log(`  wheel over carousel : pageScroll ${yBefore} -> ${yAfter} (${yAfter > yBefore ? "PAGE SCROLLED ok" : "PAGE STUCK <-- bad"})`);
console.log(`                        carousel   ${iBefore} -> ${iAfter} (${iBefore === iAfter ? "unchanged ok" : "MOVED <-- bad"})`);

// --- 2. drag must still work ---
await p.evaluate(() => document.querySelector('[aria-roledescription="carousel"]').scrollIntoView({ block: "center" }));
await new Promise(r => setTimeout(r, 800));
const b2 = await box();
const i2 = await idx();
await p.mouse.move(b2.x + 120, b2.y);
await p.mouse.down();
for (let k = 1; k <= 12; k++) { await p.mouse.move(b2.x + 120 - k * 18, b2.y); await new Promise(r => setTimeout(r, 16)); }
await p.mouse.up();
await new Promise(r => setTimeout(r, 1100));
const i3 = await idx();
console.log(`  drag                : ${i2} -> ${i3} (${i2 !== i3 ? "OK" : "<-- DID NOT MOVE"})`);

// --- 3. indicators + arrows ---
const i4 = await idx();
await p.evaluate(() => [...document.querySelectorAll('[role="tab"]')][4].click());
await new Promise(r => setTimeout(r, 900));
const i5 = await idx();
console.log(`  indicator click     : ${i4} -> ${i5} (${i5 === "Go to slide 5" ? "OK" : "<-- WRONG"})`);
const nx = await p.$("[aria-label=\"Next slide\"]"); if (nx) { await nx.click(); } else { console.log("  arrow selector      : NOT FOUND"); }
await new Promise(r => setTimeout(r, 900));
console.log(`  arrow               : ${i5} -> ${await idx()} (${(await idx()) !== i5 ? "OK" : "<-- DID NOT MOVE"})`);
await b.close();
