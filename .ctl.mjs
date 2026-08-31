import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem("mr:preloaded","1")}catch{}});
await p.goto("http://localhost:3000/en", { waitUntil: "load" });
await p.evaluate(() => document.querySelector('[aria-roledescription="carousel"]')?.scrollIntoView({block:"center"}));
await new Promise(r => setTimeout(r, 1200));
console.log(await p.evaluate(() => {
  const c = document.querySelector('[aria-roledescription="carousel"]');
  const btns = [...c.querySelectorAll("button")].map(x => `${x.getAttribute("aria-label")||x.getAttribute("role")||"?"}`);
  return "  buttons inside carousel: " + JSON.stringify(btns);
}));
await b.close();
