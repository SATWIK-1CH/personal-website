const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Project filters */
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
const emptyState = document.getElementById("filter-empty");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((f) => f.classList.remove("is-active"));
    btn.classList.add("is-active");

    const key = btn.dataset.filter;
    let visible = 0;

    projects.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/);
      const show = key === "all" || tags.includes(key);
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible > 0;
  });
});

/* Expand / collapse project details */
document.querySelectorAll(".project").forEach((card) => {
  const btn = card.querySelector(".read-more");
  const detail = card.querySelector(".project-detail");
  if (!btn || !detail) return;

  const toggle = () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    detail.hidden = open;
    btn.innerHTML = open
      ? 'Read more <span aria-hidden="true">→</span>'
      : 'Show less <span aria-hidden="true">↑</span>';
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target === card) toggle();
  });
});

/* Skill tags highlight related projects */
const skillMap = {
  Python: "all",
  SQL: "all",
  XGBoost: "pricing fraud",
  Search: "search",
  Pricing: "pricing",
  Fraud: "fraud",
  LLMs: "search",
  Experimentation: "pricing",
  MLOps: "all",
};

document.querySelectorAll("#skill-tags .tag").forEach((tag) => {
  tag.addEventListener("click", () => {
    const skill = tag.dataset.skill;
    const mapped = skillMap[skill] || "all";
    const primary = mapped.split(/\s+/)[0];

    document.querySelectorAll("#skill-tags .tag").forEach((t) => {
      t.classList.toggle("is-active", t === tag);
    });

    const target =
      document.querySelector(`.filter[data-filter="${primary}"]`) ||
      document.querySelector('.filter[data-filter="all"]');
    if (target) target.click();

    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  });
});

/* Animated counters */
const counters = document.querySelectorAll("[data-count]");
let counted = false;

function animateCounters() {
  if (counted) return;
  counted = true;

  counters.forEach((el) => {
    const target = Number(el.dataset.count);
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

const impact = document.getElementById("impact");
if (impact && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        animateCounters();
        io.disconnect();
      }
    },
    { threshold: 0.35 }
  );
  io.observe(impact);
} else {
  animateCounters();
}

/* Scroll spy for section nav */
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const topNav = document.querySelector(".top-nav");

function onScroll() {
  if (topNav) topNav.classList.toggle("is-stuck", window.scrollY > 8);

  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 120) current = section;
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("is-active", href === `#${current.id}`);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Mobile profile drawer */
const toggleBtn = document.getElementById("profile-toggle");
const drawer = document.getElementById("mobile-drawer");
const drawerContent = document.getElementById("drawer-content");
const drawerClose = document.getElementById("drawer-close");
const sidebarInner = document.querySelector(".sidebar-inner");

function openDrawer() {
  if (!drawer || !drawerContent || !sidebarInner) return;
  drawerContent.innerHTML = sidebarInner.innerHTML;
  drawer.hidden = false;
  toggleBtn?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  if (!drawer) return;
  drawer.hidden = true;
  toggleBtn?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

toggleBtn?.addEventListener("click", openDrawer);
drawerClose?.addEventListener("click", closeDrawer);
drawer?.addEventListener("click", (e) => {
  if (e.target === drawer) closeDrawer();
});
