const { useEffect, useMemo, useRef, useState } = React;
const Motion = window.Motion || {};
const motion = Motion.motion || {};
const MotionDiv = motion.div || createMotionFallback("div");
const MotionSpan = motion.span || createMotionFallback("span");

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4";
const CAPABILITIES_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4";

function createMotionFallback(Tag) {
  return function MotionFallback({
    initial,
    animate,
    whileInView,
    viewport,
    transition,
    style,
    children,
    ...props
  }) {
    const ref = useRef(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
      const node = ref.current;
      if (!node) return undefined;

      if (whileInView) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActive(true);
              if (viewport?.once !== false) observer.disconnect();
            }
          },
          { threshold: viewport?.amount || 0.1 },
        );
        observer.observe(node);
        return () => observer.disconnect();
      }

      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }, [viewport?.amount, viewport?.once, whileInView]);

    const motionStyle = resolveMotionStyle(active ? whileInView || animate : initial, transition, active);

    return (
      <Tag ref={ref} style={{ ...style, ...motionStyle }} {...props}>
        {children}
      </Tag>
    );
  };
}

function resolveMotionStyle(definition = {}, transition = {}, active) {
  const pick = (value) => {
    if (Array.isArray(value)) return active ? value[value.length - 1] : value[0];
    return value;
  };

  const y = pick(definition.y);
  const duration = transition.duration || 0.7;
  const delay = transition.delay || 0;
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
  const style = {
    transition: `filter ${duration}s ${easing}, opacity ${duration}s ${easing}, transform ${duration}s ${easing}`,
    transitionDelay: `${delay}s`,
  };

  if (definition.filter !== undefined) style.filter = pick(definition.filter);
  if (definition.opacity !== undefined) style.opacity = pick(definition.opacity);
  if (y !== undefined) style.transform = `translateY(${typeof y === "number" ? `${y}px` : y})`;

  return style;
}

function ArrowUpRight({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7h10v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4l14 8-14 8V4Z" />
    </svg>
  );
}

function MaterialIcon({ path }) {
  return (
    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function FadingVideo({ src, className = "", style = {}, poster }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const FADE_MS = 500;
    const FADE_OUT_LEAD = 0.55;

    const cancelFade = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const fadeTo = (target, duration) => {
      cancelFade();
      const start = Number.parseFloat(video.style.opacity || "0") || 0;
      const startedAt = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        video.style.opacity = String(start + (target - start) * eased);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const onLoadedData = () => {
      video.style.opacity = "0";
      video.play().catch(() => {});
      fadeTo(1, FADE_MS);
    };

    const onTimeUpdate = () => {
      if (!video.duration || fadingOutRef.current) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const onEnded = () => {
      video.style.opacity = "0";
      timeoutRef.current = window.setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        video.play().catch(() => {});
        fadeTo(1, FADE_MS);
      }, 100);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.load();

    return () => {
      cancelFade();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={{ ...style, opacity: 0 }}
      poster={poster}
      muted
      autoPlay
      playsInline
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function BlurText({ text, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <MotionSpan
          key={`${word}-${index}`}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            visible
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
                }
              : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: "easeOut",
            delay: (index * 100) / 1000,
          }}
        >
          {word}
        </MotionSpan>
      ))}
    </p>
  );
}

function Nav() {
  const links = [
    ["Mission", "/mission/"],
    ["Programs", "/programs/"],
    ["Restoration", "/havilah-house/"],
    ["Field Notes", "/field-notes/"],
    ["Partners", "/partners/"],
  ];

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 px-5 lg:px-16" aria-label="Primary navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a className="liquid-glass grid h-12 w-12 place-items-center rounded-full" href="/" aria-label="The Reath Foundation home">
          <img className="h-10 w-10 rounded-full object-cover" src="/assets/reath-logo.png" alt="" />
        </a>

        <div className="liquid-glass hidden items-center rounded-full px-1.5 py-1.5 lg:flex">
          {links.map(([label, href]) => (
            <a key={label} className="px-3 py-2 font-body text-sm font-medium text-white/90" href={href}>
              {label}
            </a>
          ))}
          <a className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-body text-sm font-semibold text-black" href="/support/">
            Support the Work
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="h-12 w-12" aria-hidden="true" />
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="video-fallback relative flex min-h-screen overflow-hidden bg-black">
      <FadingVideo
        src={HERO_VIDEO}
        className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: "120%", height: "120%" }}
      />
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Nav />

        <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
          <MotionDiv
            className="liquid-glass inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full px-2 py-2"
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-semibold text-black">New</span>
            <span className="pr-3 font-body text-sm font-light text-white/90">First chapter unfolding in the Santa Ynez Valley</span>
          </MotionDiv>

          <BlurText
            text="A living foundation for place-based learning and renewal"
            className="mt-7 flex max-w-4xl flex-wrap justify-center font-heading text-6xl italic leading-[0.8] tracking-[-4px] text-white text-balance md:text-7xl lg:text-[5.5rem]"
          />

          <MotionDiv
            className="mt-5 max-w-2xl font-body text-sm font-light leading-tight text-white md:text-base"
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            The Reath Foundation stewards place-based education, family enrichment, scholarships, restoration projects, and community renewal through a nonprofit home built for trust.
          </MotionDiv>

          <MotionDiv
            className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
          >
            <a className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white" href="/mission/">
              Enter the Mission
              <ArrowUpRight />
            </a>
            <a className="inline-flex items-center gap-2 font-body text-sm font-medium text-white" href="/havilah-house/">
              View Restoration
              <PlayIcon />
            </a>
          </MotionDiv>

          <MotionDiv
            className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row"
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
          >
            <StatCard number="01 Home" label="Havilah House as the first restoration chapter" icon="clock" />
            <StatCard number="All Ages" label="Families, learners, mentors, hosts, and local partners" icon="globe" />
          </MotionDiv>
        </div>

        <MotionDiv
          className="flex flex-col items-center gap-4 px-4 pb-8"
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 font-body text-xs font-medium text-white">
            Collaborating across education, technology, restoration, and local civic life
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 font-heading text-2xl italic tracking-tight text-white md:gap-x-16 md:text-3xl">
            <span>Bēhere</span>
            <span>Rhythm</span>
            <span>Havilah</span>
            <span>Families</span>
            <span>Partners</span>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}

function StatCard({ number, label, icon }) {
  return (
    <div className="liquid-glass flex w-[220px] flex-col items-start rounded-[1.25rem] p-5 text-left">
      <div className="mb-7 h-7 w-7 text-white">
        {icon === "clock" ? (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21M12 3C9.7 5.5 8.5 8.5 8.5 12S9.7 18.5 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="font-heading text-4xl italic leading-none tracking-[-1px] text-white">{number}</div>
      <div className="mt-2 font-body text-xs font-light leading-snug text-white">{label}</div>
    </div>
  );
}

const cards = [
  {
    title: "Place-Based Learning",
    body: "Local landscapes, homes, institutions, and histories become living classrooms for children, families, and mentors.",
    icon: "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
    tags: ["Local Study", "Mentors", "Projects", "Field Work"],
  },
  {
    title: "Family Enrichment",
    body: "Meals, circles, workshops, seasonal rhythms, and hospitality strengthen family culture without adding more noise.",
    icon: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
    tags: ["Meals", "Circles", "Parents", "Hospitality"],
  },
  {
    title: "Scholarships & Access",
    body: "Donor-supported pathways make programs, restoration apprenticeships, and community gatherings possible for more families.",
    icon: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
    tags: ["Gifts", "Scholarships", "Access", "Underwriting"],
  },
];

function Capabilities() {
  return (
    <section id="capabilities" className="video-fallback relative min-h-screen overflow-hidden bg-black">
      <FadingVideo src={CAPABILITIES_VIDEO} className="absolute inset-0 z-0 h-full w-full object-cover" />
      <div className="relative z-10 flex min-h-screen flex-col px-5 pb-10 pt-24 md:px-16 lg:px-20">
        <MotionDiv
          className="mb-auto"
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="mb-6 font-body text-sm text-white/80">// Stewardship</p>
          <h2 className="font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
            Community
            <br />
            renewed
          </h2>
        </MotionDiv>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <MotionDiv
              key={card.title}
              className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6"
              initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
              whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.12, duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="liquid-glass grid h-11 w-11 shrink-0 place-items-center rounded-[0.75rem]">
                  <MaterialIcon path={card.icon} />
                </div>
                <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                  {card.tags.map((tag) => (
                    <span key={tag} className="liquid-glass rounded-full px-3 py-1 font-body text-[11px] text-white/90">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-6">
                <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">{card.title}</h3>
                <p className="mt-3 max-w-[32ch] font-body text-sm font-light leading-snug text-white/90">{card.body}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Hero />
      <Capabilities />
    </>
  );
}

window.FadingVideo = FadingVideo;
window.BlurText = BlurText;
window.ReathCinematicHome = App;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
