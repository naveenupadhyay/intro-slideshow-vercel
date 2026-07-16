import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent, WheelEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { iconMap, introContent } from "../data/introContent";
import { CTAButton } from "./CTAButton";

const INTRO_PHASE_MS = 5200;

const caseStudies = [
  {
    title: "AI-Native Engineering Operating System",
    summary: "A context and control layer that orchestrates coding agents, repo knowledge, tools, tests, evals, and human review.",
    outcomes: ["Higher leverage per engineer", "Faster idea-to-release cycles", "Safer AI adoption"]
  },
  {
    title: "Finance and Accounting",
    summary: "Audit automation for public and private filings, financial reconciliation, and evidence workflows.",
    outcomes: ["Faster audit preparation", "Stronger evidence traceability", "Lower manual reconciliation effort"]
  },
  {
    title: "Legal",
    summary: "Contract negotiation at scale and ADR workflows combining LLMs, ML models, and decision-tree logic.",
    outcomes: ["Faster contract review cycles", "Consistent negotiation positions", "Structured ADR support"]
  },
  {
    title: "Sales Outreach",
    summary: "Voice-agent driven sales outreach that calls customers, qualifies intent, and routes follow-up actions.",
    outcomes: ["Higher outreach capacity", "Cleaner intent capture", "Faster follow-up cycles"]
  },
  {
    title: "Customer Care",
    summary: "Conversational AI for regulated customer support, including a Dubai government entity use case.",
    outcomes: ["Shorter response times", "Controlled escalation paths", "Better QA visibility"]
  }
];

export function IntroAnimation() {
  const [phase, setPhase] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const lastGestureAt = useRef(0);
  const phases = introContent.intro.sequences;
  const linkedinPhase = phases.length;
  const caseStudiesPhase = phases.length + 1;
  const finalPhase = phase === linkedinPhase;
  const caseStudiesActive = phase === caseStudiesPhase;
  const current = phases[Math.min(phase, phases.length - 1)];
  const totalSteps = phases.length + 2;
  const activeStep = Math.min(phase, totalSteps - 1);

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: 8 + ((index * 19) % 84),
        top: 10 + ((index * 29) % 72),
        delay: (index % 8) * 0.2
      })),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".intro-paper",
        { y: 18, rotate: -0.35 },
        { y: -10, rotate: 0.35, duration: 4.6, yoyo: true, repeat: -1, ease: "sine.inOut" }
      );
      gsap.to(".flow-light", {
        xPercent: 110,
        opacity: 0,
        duration: 3.8,
        repeat: -1,
        ease: "power2.inOut",
        stagger: 0.36
      });
    }, rootRef);

    const timers = phases.map((_, index) =>
      window.setTimeout(() => {
        setPhase((currentPhase) => (currentPhase >= linkedinPhase ? currentPhase : Math.max(currentPhase, index + 1)));
      }, (index + 1) * INTRO_PHASE_MS)
    );

    return () => {
      timers.forEach(window.clearTimeout);
      ctx.revert();
    };
  }, [linkedinPhase, phases]);

  const advancePhase = useCallback(() => {
    setPhase((currentPhase) => Math.min(totalSteps - 1, currentPhase + 1));
  }, [totalSteps]);

  const retreatPhase = useCallback(() => {
    setPhase((currentPhase) => Math.max(0, currentPhase - 1));
  }, []);

  const navigateByGesture = useCallback(
    (direction: "next" | "previous") => {
      const now = Date.now();
      if (now - lastGestureAt.current < 650) return;
      lastGestureAt.current = now;

      if (direction === "next") {
        advancePhase();
      } else {
        retreatPhase();
      }
    },
    [advancePhase, retreatPhase]
  );

  const onWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaY) < 36) return;
      navigateByGesture(event.deltaY > 0 ? "next" : "previous");
    },
    [navigateByGesture]
  );

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (touchStartY.current === null) return;

      const diff = touchStartY.current - event.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(diff) < 48) return;
      navigateByGesture(diff > 0 ? "next" : "previous");
    },
    [navigateByGesture]
  );

  return (
    <motion.div
      ref={rootRef}
      className="relative z-50 grid h-dvh place-items-center overflow-hidden bg-[#fbfaf7] px-4 pb-4 pt-14 text-zinc-950 md:py-8"
      exit={{ opacity: 0, scale: 1.025, filter: "blur(16px)" }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <ol
        className="absolute left-4 top-4 z-30 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/80 p-1 shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur md:left-8 md:top-6"
        aria-label="Intro progress"
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const isActive = activeStep === index;
          return (
            <li key={index}>
              <button
                type="button"
                aria-current={isActive ? "step" : undefined}
                aria-label={`Go to slide ${index + 1} of ${totalSteps}`}
                className={`grid size-7 place-items-center rounded-md text-xs font-semibold tabular-nums transition ${
                  isActive ? "bg-zinc-950 text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
                onClick={() => setPhase(index)}
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(194,65,12,0.10),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(250,204,21,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(244,244,245,0.58))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(24,24,27,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.035)_1px,transparent_1px)] bg-[size:86px_86px] opacity-60" />
      <div className="absolute right-[8%] top-[10%] h-44 w-52 rotate-[-16deg] bg-[#fff0c7] shadow-[0_28px_70px_rgba(194,65,12,0.12)] [clip-path:polygon(0_0,100%_20%,28%_100%)]" />
      <div className="absolute right-[12%] top-[38%] h-20 w-32 rotate-[-10deg] bg-[#ffd98a] shadow-[0_18px_50px_rgba(194,65,12,0.12)] [clip-path:polygon(20%_0,100%_62%,0_100%)]" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute size-1 rounded-full bg-[#c4511b]/35"
          style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
          animate={{ opacity: [0.12, 0.5, 0.12], scale: [0.8, 1.6, 0.75] }}
          transition={{ duration: 3.8, repeat: Infinity, delay: particle.delay }}
        />
      ))}

      <div className="absolute left-[10%] right-[10%] top-[52%] h-px bg-gradient-to-r from-transparent via-[#c4511b]/25 to-transparent opacity-45">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className="flow-light absolute -top-1 left-0 size-2 rounded-full bg-[#c4511b] shadow-[0_0_28px_rgba(194,65,12,0.48)]" />
        ))}
      </div>

      <motion.div
        className="relative z-10 mx-auto max-h-[calc(100dvh-4.5rem)] w-full min-w-0 max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain py-2 md:max-h-[calc(100dvh-4rem)] md:max-w-6xl"
        data-testid="intro-stage"
        key={caseStudiesActive ? "case-studies" : finalPhase ? "final" : phase}
        initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {phase < linkedinPhase ? (
          <div className="grid min-w-0 gap-4 md:grid-cols-[1.25fr_0.75fr] md:items-center lg:gap-10">
            <div className="intro-paper min-w-0 rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-[0_34px_100px_rgba(24,24,27,0.12)] backdrop-blur md:p-6 lg:p-8">
              <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[#c4511b] sm:text-base md:text-lg">{current.eyebrow}</div>
              <h1 className="max-w-[18.5rem] break-words text-[2rem] font-semibold leading-[1] tracking-[-0.02em] text-zinc-950 sm:max-w-full sm:text-4xl md:text-5xl lg:max-w-4xl lg:text-5xl">
                {current.headline}
              </h1>
              <p className="mt-3 max-w-[18.5rem] text-base leading-7 text-zinc-700 sm:max-w-2xl md:mt-4 md:text-xl md:leading-8">{current.subline}</p>
              <div className="mt-4 grid gap-2.5 md:mt-5 md:gap-3">
                {current.bullets.map((item, index) => (
                  <motion.div
                    key={item}
                    className="flex min-w-0 max-w-[18.5rem] gap-3 break-words rounded-xl border border-zinc-200 bg-zinc-50/95 px-3 py-2.5 text-sm font-medium leading-6 text-zinc-800 sm:max-w-full md:px-4 md:py-3 md:text-base"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + index * 0.16 }}
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c4511b]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <IntroPanel phase={phase} />
          </div>
        ) : finalPhase ? (
          <div className="mx-auto grid max-w-5xl gap-6 rounded-2xl border border-zinc-200 bg-white/95 p-6 text-center shadow-[0_38px_120px_rgba(24,24,27,0.14)] backdrop-blur md:grid-cols-[0.8fr_1fr] md:p-8 md:text-left">
            <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-[0_24px_60px_rgba(0,0,0,0.12)] md:mx-0">
              <img src={introContent.brand.portrait} alt={introContent.brand.founder} className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-[#c4511b]">{introContent.brand.founder}</div>
              <h1 className="text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-zinc-950 sm:text-4xl lg:text-5xl">
                {introContent.intro.finalHeadline}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl">{introContent.intro.finalSubheadline}</p>
              <div className="mt-8">
                <CTAButton href={introContent.brand.linkedin}>{introContent.intro.finalCtaLabel}</CTAButton>
              </div>
            </div>
          </div>
        ) : (
          <CaseStudiesSection />
        )}
      </motion.div>
    </motion.div>
  );
}

function CaseStudiesSection() {
  return (
    <section className="mx-auto max-w-6xl rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-[0_38px_120px_rgba(24,24,27,0.14)] backdrop-blur md:p-7">
      <div className="grid gap-4 md:grid-cols-[0.78fr_1.22fr] md:items-start">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-[#c4511b] sm:text-base">Case studies</div>
          <h1 className="mt-4 text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-zinc-950 sm:text-4xl lg:text-5xl">
            Case studies I oversaw with a dedicated engineering and product org.
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-700 md:text-lg">
            Practical examples from AI product engineering work across engineering, finance, legal, sales, and customer care, overseen by me with a focused engineering and product organization.
          </p>
          <div className="mt-6">
            <CTAButton href="https://www.eleventyfirstparallel.in/case-studies">View Full Case Studies</CTAButton>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {caseStudies.map((study, index) => (
            <article key={study.title} className="rounded-xl border border-zinc-200 bg-zinc-50/95 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#c4511b]">Case {index + 1}</span>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums text-zinc-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-tight text-zinc-950">{study.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{study.summary}</p>
              <ul className="mt-3 grid gap-1.5">
                {study.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2 text-sm leading-5 text-zinc-700">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c4511b]" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntroPanel({ phase }: { phase: number }) {
  if (phase === 2) {
    return (
      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-[0_34px_90px_rgba(24,24,27,0.10)] backdrop-blur">
        {introContent.intro.pipeline.map((step, index) => {
          const Icon = iconMap[step.icon];
          return (
            <motion.div
              key={step.label}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/95 p-4"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.16 }}
            >
              <span className="grid size-10 place-items-center rounded-lg border border-[#c4511b]/20 bg-[#c4511b]/10 text-[#c4511b]">
                <Icon className="size-5" />
              </span>
              <span className="font-semibold text-zinc-900">{step.label}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (phase === 3) {
    return (
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-[0_34px_90px_rgba(24,24,27,0.10)] backdrop-blur">
        {introContent.intro.metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="rounded-xl border border-zinc-200 bg-zinc-50/95 p-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
          >
            <div className="text-3xl font-semibold tracking-[-0.03em] text-zinc-950 md:text-4xl">{metric.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">{metric.label}</div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white/92 p-3 shadow-[0_34px_90px_rgba(24,24,27,0.12)] backdrop-blur md:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(194,65,12,0.10),transparent_28%),radial-gradient(circle_at_76%_74%,rgba(250,204,21,0.12),transparent_30%)]" />
      <div className="relative grid gap-3 md:gap-4">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-[0_26px_70px_rgba(0,0,0,0.14)]">
          <img src={introContent.brand.portrait} alt={introContent.brand.founder} className="aspect-[2.2/1] w-full object-cover object-[50%_28%] md:aspect-[4/5] md:object-center" />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white/95 p-3 md:p-4">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#c4511b]">{introContent.brand.founder}</div>
          <div className="mt-2 text-lg font-semibold leading-tight text-zinc-950">Founder and CEO</div>
          <a className="mt-3 block text-sm font-semibold text-zinc-700 underline decoration-[#c4511b]/40 underline-offset-4" href={`mailto:${introContent.brand.email}`}>
            {introContent.brand.email}
          </a>
        </div>
      </div>
    </div>
  );
}
