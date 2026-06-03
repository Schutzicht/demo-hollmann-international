import Lenis from "lenis";

// ----------------------------------------------------------------------------
// Types & data shipped from the server
// ----------------------------------------------------------------------------
type Car = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  model: string;
  priceNet: number;
  priceGross: number | null;
  vatNote: string;
  power: string;
  accel: string;
  topSpeed: string;
  engine: string;
  drivetrain: string;
  transmission: string;
  year: number;
  mileage: string;
  image: string;
  badge: string;
};
type Currency = { code: string; symbol: string; rate: number };

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

function parseJSON<T>(id: string, fallback: T): T {
  const el = document.getElementById(id);
  if (!el?.textContent) return fallback;
  try {
    return JSON.parse(el.textContent) as T;
  } catch {
    return fallback;
  }
}
const CARS = parseJSON<Car[]>("vehicle-data", []);
const CURRENCIES = parseJSON<Currency[]>("currency-data", [
  { code: "EUR", symbol: "€", rate: 1 },
]);
const carById = (id: string) => CARS.find((c) => c.id === id);

// ----------------------------------------------------------------------------
// Tiny store (localStorage + custom event)
// ----------------------------------------------------------------------------
const K = { fav: "hl:fav", cmp: "hl:cmp", cur: "hl:cur" };
const readArr = (k: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(k) || "[]");
  } catch {
    return [];
  }
};
let favs = readArr(K.fav);
let cmp = readArr(K.cmp);
let cur = localStorage.getItem(K.cur) || "EUR";
const saveFav = () => localStorage.setItem(K.fav, JSON.stringify(favs));
const saveCmp = () => localStorage.setItem(K.cmp, JSON.stringify(cmp));

// ----------------------------------------------------------------------------
// Money
// ----------------------------------------------------------------------------
const currency = () => CURRENCIES.find((c) => c.code === cur) || CURRENCIES[0];
function fmtMoney(eur: number): string {
  const c = currency();
  return c.symbol + Math.round(eur * c.rate).toLocaleString("en-US");
}
function applyCurrency() {
  document.querySelectorAll<HTMLElement>("[data-price]").forEach((el) => {
    const eur = Number(el.dataset.price || "0");
    el.textContent = fmtMoney(eur);
  });
  document.querySelectorAll<HTMLElement>("[data-cur-code]").forEach((el) => {
    el.textContent = cur;
  });
  document.querySelectorAll<HTMLElement>("[data-currency-set]").forEach((b) => {
    const on = b.dataset.currencySet === cur;
    b.classList.toggle("text-gold", on);
    b.classList.toggle("text-fog", !on);
  });
}

// ----------------------------------------------------------------------------
// Favorites + Compare badges and button states
// ----------------------------------------------------------------------------
function syncStates() {
  document.querySelectorAll<HTMLElement>("[data-fav]").forEach((b) => {
    b.classList.toggle("is-active", favs.includes(b.dataset.fav!));
    b.setAttribute("aria-pressed", String(favs.includes(b.dataset.fav!)));
  });
  document.querySelectorAll<HTMLElement>("[data-compare]").forEach((b) => {
    b.classList.toggle("is-active", cmp.includes(b.dataset.compare!));
    b.setAttribute("aria-pressed", String(cmp.includes(b.dataset.compare!)));
  });
  document.querySelectorAll<HTMLElement>("[data-fav-count]").forEach((el) => {
    el.textContent = String(favs.length);
    el.classList.toggle("opacity-0", favs.length === 0);
  });
}

// ----------------------------------------------------------------------------
// Toast
// ----------------------------------------------------------------------------
let toastTimer: number;
function toast(msg: string) {
  let t = document.querySelector<HTMLElement>("[data-toast]");
  if (!t) {
    t = document.createElement("div");
    t.setAttribute("data-toast", "");
    t.className =
      "fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 translate-y-4 border border-gold/40 bg-ink-850/95 px-6 py-3 text-sm text-cream opacity-0 backdrop-blur transition-all duration-300";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => {
    t!.classList.remove("opacity-0", "translate-y-4");
  });
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    t!.classList.add("opacity-0", "translate-y-4");
  }, 2200);
}

// ----------------------------------------------------------------------------
// Shortlist drawer
// ----------------------------------------------------------------------------
function renderShortlist() {
  const list = document.querySelector<HTMLElement>("[data-shortlist-items]");
  const empty = document.querySelector<HTMLElement>("[data-shortlist-empty]");
  if (!list) return;
  if (favs.length === 0) {
    list.innerHTML = "";
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");
  list.innerHTML = favs
    .map((id) => carById(id))
    .filter(Boolean)
    .map((c) => {
      const car = c as Car;
      return `<div class="flex gap-4 border-b border-white/8 pb-5">
        <a href="/vehicles/${car.slug}" class="block h-20 w-28 shrink-0 overflow-hidden bg-ink-900">
          <img src="${car.image}" alt="${car.title}" class="h-full w-full object-cover" />
        </a>
        <div class="flex flex-1 flex-col">
          <div class="text-[0.6rem] tracking-[0.2em] text-gold uppercase">${car.brand}</div>
          <a href="/vehicles/${car.slug}" class="font-display text-lg leading-tight text-cream">${car.model}</a>
          <div class="mt-auto flex items-center justify-between">
            <span class="text-gold-bright" data-price="${car.priceNet}">${fmtMoney(car.priceNet)}</span>
            <button data-fav="${car.id}" class="text-[0.62rem] tracking-[0.14em] text-fog uppercase transition-colors hover:text-gold-bright">Remove</button>
          </div>
        </div>
      </div>`;
    })
    .join("");
}
function openDrawer() {
  renderShortlist();
  document.querySelector("[data-shortlist]")?.classList.remove("translate-x-full");
  document.querySelector("[data-shortlist-backdrop]")?.classList.remove("pointer-events-none", "opacity-0");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  document.querySelector("[data-shortlist]")?.classList.add("translate-x-full");
  document.querySelector("[data-shortlist-backdrop]")?.classList.add("pointer-events-none", "opacity-0");
  document.body.style.overflow = "";
}

// ----------------------------------------------------------------------------
// Compare bar + modal
// ----------------------------------------------------------------------------
function renderCompareBar() {
  const bar = document.querySelector<HTMLElement>("[data-compare-bar]");
  const wrap = document.querySelector<HTMLElement>("[data-compare-thumbs]");
  const count = document.querySelector<HTMLElement>("[data-compare-count]");
  if (!bar || !wrap) return;
  if (cmp.length === 0) {
    bar.classList.add("translate-y-[140%]");
  } else {
    bar.classList.remove("translate-y-[140%]");
  }
  if (count) count.textContent = String(cmp.length);
  wrap.innerHTML = cmp
    .map((id) => carById(id))
    .filter(Boolean)
    .map((c) => {
      const car = c as Car;
      return `<div class="relative h-12 w-16 overflow-hidden border border-white/12 bg-ink-900">
        <img src="${car.image}" alt="${car.title}" class="h-full w-full object-cover" />
        <button data-compare="${car.id}" aria-label="Remove" class="absolute right-0 top-0 flex h-4 w-4 items-center justify-center bg-ink/80 text-[10px] text-cream">×</button>
      </div>`;
    })
    .join("");
}
function specRow(label: string, vals: string[]) {
  return `<tr class="border-b border-white/8">
    <th class="py-3 pr-4 text-left text-[0.62rem] tracking-[0.14em] text-fog uppercase">${label}</th>
    ${vals.map((v) => `<td class="px-3 py-3 text-center text-sm text-cream">${v}</td>`).join("")}
  </tr>`;
}
function openCompare() {
  const cars = cmp.map((id) => carById(id)).filter(Boolean) as Car[];
  const modal = document.querySelector<HTMLElement>("[data-compare-modal]");
  const body = document.querySelector<HTMLElement>("[data-compare-body]");
  if (!modal || !body) return;
  if (cars.length < 2) {
    toast("Select at least two cars to compare");
    return;
  }
  body.innerHTML = `
    <div class="grid gap-4" style="grid-template-columns: repeat(${cars.length}, minmax(0,1fr));">
      ${cars
        .map(
          (c) => `<a href="/vehicles/${c.slug}" class="group block">
            <div class="aspect-[3/2] overflow-hidden bg-ink-900"><img src="${c.image}" alt="${c.title}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/></div>
            <div class="mt-3 text-[0.62rem] tracking-[0.2em] text-gold uppercase">${c.brand}</div>
            <div class="font-display text-xl text-cream">${c.model}</div>
            <div class="mt-1 text-gold-bright" data-price="${c.priceNet}">${fmtMoney(c.priceNet)}</div>
          </a>`
        )
        .join("")}
    </div>
    <table class="mt-8 w-full border-collapse">
      <tbody>
        ${specRow("Year", cars.map((c) => String(c.year)))}
        ${specRow("Power", cars.map((c) => c.power))}
        ${specRow("0 to 100", cars.map((c) => c.accel))}
        ${specRow("Top speed", cars.map((c) => c.topSpeed))}
        ${specRow("Engine", cars.map((c) => c.engine))}
        ${specRow("Drivetrain", cars.map((c) => c.drivetrain))}
        ${specRow("Transmission", cars.map((c) => c.transmission))}
        ${specRow("Mileage", cars.map((c) => c.mileage))}
      </tbody>
    </table>`;
  modal.classList.remove("pointer-events-none", "opacity-0");
  modal.querySelector("[data-modal-panel]")?.classList.remove("translate-y-6");
  document.body.style.overflow = "hidden";
}
function closeCompare() {
  const modal = document.querySelector<HTMLElement>("[data-compare-modal]");
  modal?.classList.add("pointer-events-none", "opacity-0");
  modal?.querySelector("[data-modal-panel]")?.classList.add("translate-y-6");
  document.body.style.overflow = "";
}

// ----------------------------------------------------------------------------
// Enquiry modal
// ----------------------------------------------------------------------------
function openEnquiry(id?: string) {
  const modal = document.querySelector<HTMLElement>("[data-enquiry-modal]");
  if (!modal) return;
  const car = id ? carById(id) : undefined;
  const ctx = modal.querySelector<HTMLElement>("[data-enquiry-context]");
  const subject = modal.querySelector<HTMLInputElement>("[data-enquiry-subject]");
  const wa = modal.querySelector<HTMLAnchorElement>("[data-enquiry-wa]");
  if (car && ctx) {
    ctx.innerHTML = `<div class="flex gap-4 border border-white/8 bg-ink-900 p-4">
      <div class="h-16 w-24 shrink-0 overflow-hidden bg-ink-850"><img src="${car.image}" class="h-full w-full object-cover" alt="${car.title}"/></div>
      <div><div class="text-[0.6rem] tracking-[0.2em] text-gold uppercase">${car.brand}</div>
      <div class="font-display text-lg text-cream">${car.model}</div>
      <div class="text-sm text-gold-bright" data-price="${car.priceNet}">${fmtMoney(car.priceNet)}</div></div>
    </div>`;
    ctx.classList.remove("hidden");
    if (subject) subject.value = car.title;
  } else if (ctx) {
    ctx.classList.add("hidden");
    if (subject) subject.value = "General enquiry";
  }
  if (wa) {
    const msg = car
      ? `Hello Hollmann International, I am interested in the ${car.title} (${fmtMoney(car.priceNet)}). Could you share more details?`
      : "Hello Hollmann International, I would like to enquire about a vehicle.";
    wa.href = `https://wa.me/4942180608210?text=${encodeURIComponent(msg)}`;
  }
  modal.classList.remove("pointer-events-none", "opacity-0");
  modal.querySelector("[data-modal-panel]")?.classList.remove("translate-y-6");
  document.body.style.overflow = "hidden";
}
function closeEnquiry() {
  const modal = document.querySelector<HTMLElement>("[data-enquiry-modal]");
  modal?.classList.add("pointer-events-none", "opacity-0");
  modal?.querySelector("[data-modal-panel]")?.classList.add("translate-y-6");
  document.body.style.overflow = "";
}

// ----------------------------------------------------------------------------
// Lightbox (detail gallery)
// ----------------------------------------------------------------------------
let lbImages: string[] = [];
let lbIndex = 0;
function openLightbox(images: string[], index: number) {
  lbImages = images;
  lbIndex = index;
  let lb = document.querySelector<HTMLElement>("[data-lightbox]");
  if (!lb) return;
  updateLightbox();
  lb.classList.remove("pointer-events-none", "opacity-0");
  document.body.style.overflow = "hidden";
}
function updateLightbox() {
  const img = document.querySelector<HTMLImageElement>("[data-lightbox-img]");
  const counter = document.querySelector<HTMLElement>("[data-lightbox-counter]");
  if (img) img.src = lbImages[lbIndex];
  if (counter) counter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
}
function lbNext(dir: number) {
  if (!lbImages.length) return;
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  updateLightbox();
}
function closeLightbox() {
  document.querySelector("[data-lightbox]")?.classList.add("pointer-events-none", "opacity-0");
  document.body.style.overflow = "";
}

// ----------------------------------------------------------------------------
// Pseudo-360 drag state (window listeners bound once at the bottom)
// ----------------------------------------------------------------------------
let rotFrames: string[] = [];
let rotImg: HTMLImageElement | null = null;
let rotDragging = false;
let rotStartX = 0;
let rotFrame = 0;
let rotElem: HTMLElement | null = null;
function rotSetFrame(f: number) {
  if (!rotFrames.length) return;
  rotFrame = ((f % rotFrames.length) + rotFrames.length) % rotFrames.length;
  if (rotImg) rotImg.src = rotFrames[rotFrame];
}
function rotDown(x: number, el: HTMLElement) {
  if (!rotFrames.length) return;
  rotDragging = true;
  rotStartX = x;
  rotElem = el;
  el.classList.add("cursor-grabbing");
}
function rotMove(x: number) {
  if (!rotDragging) return;
  const delta = x - rotStartX;
  if (Math.abs(delta) > 14) {
    rotSetFrame(rotFrame + (delta > 0 ? 1 : -1));
    rotStartX = x;
  }
}
function rotUp() {
  rotDragging = false;
  rotElem?.classList.remove("cursor-grabbing");
}

// ----------------------------------------------------------------------------
// Per-page initialisers (run on every astro:page-load)
// ----------------------------------------------------------------------------
function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}

function initCounters() {
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = Number(el.dataset.count || "0");
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1600);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => cio.observe(c));
}

function updateHeader() {
  const header = document.querySelector("[data-header]");
  header?.classList.toggle("scrolled", window.scrollY > 40);
}

function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
  if (video && reduce) {
    video.removeAttribute("autoplay");
    video.pause();
  }
}

let quoteTimer: number;
function initTestimonials() {
  const quotes = Array.from(document.querySelectorAll("[data-quote]"));
  const dots = Array.from(document.querySelectorAll("[data-quote-dot]"));
  if (quotes.length < 2) return;
  let active = 0;
  const show = (next: number) => {
    quotes[active].classList.replace("opacity-100", "opacity-0");
    quotes[next].classList.replace("opacity-0", "opacity-100");
    dots.forEach((d, i) => {
      d.classList.toggle("w-6", i === next);
      d.classList.toggle("bg-gold", i === next);
      d.classList.toggle("bg-cream/25", i !== next);
    });
    active = next;
  };
  clearInterval(quoteTimer);
  quoteTimer = window.setInterval(() => show((active + 1) % quotes.length), 6000);
  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      clearInterval(quoteTimer);
      show(i);
      quoteTimer = window.setInterval(() => show((active + 1) % quotes.length), 6000);
    })
  );
}

function initDetail() {
  // Thumbnail swap
  const main = document.querySelector<HTMLImageElement>("[data-main]");
  const thumbs = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-thumb]"));
  thumbs.forEach((t) =>
    t.addEventListener("click", () => {
      if (main) main.src = t.dataset.thumb!;
      thumbs.forEach((x) => {
        x.classList.toggle("border-gold", x === t);
        x.classList.toggle("border-white/8", x !== t);
      });
    })
  );

  // Drag to rotate (pseudo 360 through the image set)
  const rotor = document.querySelector<HTMLElement>("[data-rotate]");
  if (rotor) {
    rotFrames = (rotor.dataset.rotate || "").split(",").filter(Boolean);
    rotImg = rotor.querySelector<HTMLImageElement>("img");
    rotFrame = 0;
    rotor.addEventListener("mousedown", (e) => rotDown(e.clientX, rotor));
    rotor.addEventListener("touchstart", (e) => rotDown(e.touches[0].clientX, rotor), { passive: true });
    rotor.addEventListener("touchmove", (e) => rotMove(e.touches[0].clientX), { passive: true });
    rotor.addEventListener("touchend", rotUp);
  } else {
    rotFrames = [];
    rotImg = null;
  }

  // Finance estimate
  const box = document.querySelector<HTMLElement>("[data-finance]");
  if (box) {
    const price = Number(box.dataset.financePrice || "0");
    const deposit = box.querySelector<HTMLInputElement>("[data-deposit]")!;
    const depositOut = box.querySelector<HTMLElement>("[data-deposit-out]")!;
    const term = box.querySelector<HTMLSelectElement>("[data-term]")!;
    const monthly = box.querySelector<HTMLElement>("[data-monthly]")!;
    const apr = 0.069;
    const calc = () => {
      const dep = price * (Number(deposit.value) / 100);
      const months = Number(term.value);
      const m = ((price - dep) * (1 + apr * (months / 12))) / months;
      depositOut.textContent = fmtMoney(dep);
      monthly.textContent = fmtMoney(m);
    };
    deposit.addEventListener("input", calc);
    term.addEventListener("change", calc);
    calc();
  }
}

function initMagnetic() {
  if (!finePointer || reduce) return;
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

// ----------------------------------------------------------------------------
// Collection / page filtering (homepage + collection page)
// ----------------------------------------------------------------------------
function initFiltering() {
  const grid = document.querySelector<HTMLElement>("[data-grid]");
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]"));
  const search = document.querySelector<HTMLInputElement>("[data-search]");
  const sort = document.querySelector<HTMLSelectElement>("[data-sort]");
  const brandSel = document.querySelector<HTMLSelectElement>("[data-brand]");
  const priceSel = document.querySelector<HTMLSelectElement>("[data-pricemax]");
  const countEl = document.querySelector<HTMLElement>("[data-result-count]");
  const empty = document.querySelector<HTMLElement>("[data-empty]");
  let activeCat = "all";

  const apply = () => {
    const q = (search?.value || "").toLowerCase().trim();
    const brand = brandSel?.value || "all";
    const max = Number(priceSel?.value || "0");
    let shown = 0;
    cards.forEach((card) => {
      const cats = (card.dataset.cat || "").split(" ");
      const matchCat = activeCat === "all" || cats.includes(activeCat);
      const matchBrand = brand === "all" || card.dataset.cardBrand === brand;
      const matchPrice = !max || Number(card.dataset.cardPrice || "0") <= max;
      const matchQ = !q || (card.dataset.cardSearch || "").includes(q);
      const show = matchCat && matchBrand && matchPrice && matchQ;
      card.style.display = show ? "" : "none";
      if (show) shown++;
    });
    if (countEl) countEl.textContent = String(shown);
    empty?.classList.toggle("hidden", shown !== 0);

    if (sort && sort.value !== "default") {
      const visible = cards.filter((c) => c.style.display !== "none");
      visible.sort((a, b) => {
        const pa = Number(a.dataset.cardPrice || "0");
        const pb = Number(b.dataset.cardPrice || "0");
        const wa = Number(a.dataset.cardPower || "0");
        const wb = Number(b.dataset.cardPower || "0");
        if (sort.value === "price-asc") return pa - pb;
        if (sort.value === "price-desc") return pb - pa;
        if (sort.value === "power-desc") return wb - wa;
        return 0;
      });
      visible.forEach((c) => grid.appendChild(c));
    }
  };

  document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCat = btn.dataset.filter!;
      document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("border-gold", on);
        b.classList.toggle("bg-gold", on);
        b.classList.toggle("text-ink", on);
        b.classList.toggle("border-white/12", !on);
        b.classList.toggle("text-mist", !on);
      });
      apply();
    });
  });
  search?.addEventListener("input", apply);
  sort?.addEventListener("change", apply);
  brandSel?.addEventListener("change", apply);
  priceSel?.addEventListener("change", apply);
}

// ----------------------------------------------------------------------------
// Global, one-time setup
// ----------------------------------------------------------------------------
function initLenisOnce() {
  if (reduce || (window as any).__lenis) return;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  (window as any).__lenis = lenis;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// Cursor element is re-created on each navigation, so keep a refreshed reference
let cursorDot: HTMLElement | null = null;
let cursorStarted = false;
function initCursor() {
  cursorDot = document.querySelector<HTMLElement>("[data-cursor]");
  if (!finePointer || reduce || cursorStarted || !cursorDot) return;
  cursorStarted = true;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cx = x;
  let cy = y;
  document.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });
  document.addEventListener("mouseover", (e) => {
    const t = e.target as HTMLElement;
    const interactive = t.closest("a, button, [data-magnetic], input, select, textarea");
    cursorDot?.classList.toggle("is-hover", !!interactive);
  });
  document.addEventListener("mouseleave", () => cursorDot?.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => cursorDot?.classList.remove("is-hidden"));
  const render = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    if (cursorDot) cursorDot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

function initPreloader() {
  const pre = document.querySelector<HTMLElement>("[data-preloader]");
  if (!pre) return;
  if (reduce || sessionStorage.getItem("hl:seen")) {
    pre.remove();
    return;
  }
  requestAnimationFrame(() => pre.classList.add("reveal"));
  window.setTimeout(() => {
    pre.classList.add("done");
    sessionStorage.setItem("hl:seen", "1");
  }, 1700);
  window.setTimeout(() => pre.remove(), 2600);
}

// ----------------------------------------------------------------------------
// Delegated click handling (survives navigation)
// ----------------------------------------------------------------------------
document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;

  // Anchor smooth-scroll via Lenis (handles "#id" and "/#id" on the home page)
  const anchor = t.closest<HTMLAnchorElement>("a[href]");
  if (anchor) {
    const href = anchor.getAttribute("href") || "";
    const hashIdx = href.indexOf("#");
    if (hashIdx !== -1) {
      const hash = href.slice(hashIdx);
      const path = href.slice(0, hashIdx);
      const samePage =
        path === "" || path === location.pathname || (path === "/" && location.pathname === "/");
      const el = hash.length > 1 ? document.querySelector(hash) : null;
      if (samePage && el) {
        e.preventDefault();
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -20 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Favorite toggle
  const favBtn = t.closest<HTMLElement>("[data-fav]");
  if (favBtn) {
    e.preventDefault();
    const id = favBtn.dataset.fav!;
    if (favs.includes(id)) {
      favs = favs.filter((f) => f !== id);
    } else {
      favs.push(id);
      toast("Added to your shortlist");
    }
    saveFav();
    syncStates();
    renderShortlist();
  }

  // Compare toggle
  const cmpBtn = t.closest<HTMLElement>("[data-compare]");
  if (cmpBtn) {
    e.preventDefault();
    const id = cmpBtn.dataset.compare!;
    if (cmp.includes(id)) {
      cmp = cmp.filter((c) => c !== id);
    } else {
      if (cmp.length >= 3) {
        toast("Compare up to three cars");
        return;
      }
      cmp.push(id);
    }
    saveCmp();
    syncStates();
    renderCompareBar();
  }

  if (t.closest("[data-open-shortlist]")) {
    e.preventDefault();
    openDrawer();
  }
  if (t.closest("[data-close-shortlist]") || t.closest("[data-shortlist-backdrop]")) closeDrawer();

  if (t.closest("[data-open-compare]")) {
    e.preventDefault();
    openCompare();
  }
  if (t.closest("[data-close-compare]")) closeCompare();
  if (t.closest("[data-clear-compare]")) {
    cmp = [];
    saveCmp();
    syncStates();
    renderCompareBar();
    closeCompare();
  }

  const enq = t.closest<HTMLElement>("[data-enquire]");
  if (enq) {
    e.preventDefault();
    openEnquiry(enq.dataset.enquire || undefined);
  }
  if (t.closest("[data-close-enquiry]")) closeEnquiry();

  // Currency
  const curBtn = t.closest<HTMLElement>("[data-currency-set]");
  if (curBtn) {
    cur = curBtn.dataset.currencySet!;
    localStorage.setItem(K.cur, cur);
    applyCurrency();
    renderShortlist();
    renderCompareBar();
    document.querySelector("[data-currency-menu]")?.classList.add("hidden");
  }
  if (t.closest("[data-currency-toggle]")) {
    document.querySelector("[data-currency-menu]")?.classList.toggle("hidden");
  }

  // Lightbox open
  const lbOpen = t.closest<HTMLElement>("[data-open-lightbox]");
  if (lbOpen) {
    const imgs = (lbOpen.dataset.images || "").split(",").filter(Boolean);
    openLightbox(imgs, Number(lbOpen.dataset.index || "0"));
  }
  if (t.closest("[data-lightbox-next]")) lbNext(1);
  if (t.closest("[data-lightbox-prev]")) lbNext(-1);
  if (t.closest("[data-lightbox-close]") || t.closest("[data-lightbox-backdrop]")) closeLightbox();

  // Mobile menu
  if (t.closest("[data-menu-toggle]")) {
    const menu = document.querySelector("[data-menu]");
    const open = menu?.classList.contains("translate-x-full");
    menu?.classList.toggle("translate-x-full");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (t.closest("[data-menu-link]")) {
    document.querySelector("[data-menu]")?.classList.add("translate-x-full");
    document.body.style.overflow = "";
  }
});

// Forms (delegated)
document.addEventListener("submit", (e) => {
  const form = e.target as HTMLFormElement;
  if (!form.matches("[data-form]")) return;
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  form.querySelectorAll("input, textarea, select, button").forEach(
    (el) => ((el as HTMLInputElement).disabled = true)
  );
  form.querySelector("[data-success]")?.classList.remove("hidden");
});

// Keyboard for lightbox + escape to close overlays
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") lbNext(1);
  if (e.key === "ArrowLeft") lbNext(-1);
  if (e.key === "Escape") {
    closeLightbox();
    closeCompare();
    closeEnquiry();
    closeDrawer();
    document.querySelector("[data-currency-menu]")?.classList.add("hidden");
  }
});

// ----------------------------------------------------------------------------
// Lifecycle
// ----------------------------------------------------------------------------
function onPageLoad() {
  initReveal();
  initCounters();
  updateHeader();
  initHeroVideo();
  initTestimonials();
  initDetail();
  initFiltering();
  initMagnetic();
  initCursor();
  initPreloader();
  applyCurrency();
  syncStates();
  renderCompareBar();
}

// One-time global bindings (the module body runs once, even with view transitions)
initLenisOnce();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("mousemove", (e) => rotMove(e.clientX));
window.addEventListener("mouseup", rotUp);

document.addEventListener("astro:page-load", onPageLoad);
document.addEventListener("astro:after-swap", () => {
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
    lenis.resize();
  }
});
