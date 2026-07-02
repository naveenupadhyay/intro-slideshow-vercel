import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { iconMap, introContent } from "../data/introContent";
import { CTAButton } from "./CTAButton";

const INTRO_PHASE_MS = 5200;

export function IntroAnimation() {
  const [phase, setPhase] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const phases = introContent.intro.sequences;
  const finalPhase = phase >= phases.length;
  const current = phases[Math.min(phase, phases.length - 1)];

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
        setPhase((currentPhase) => (currentPhase >= phases.length ? currentPhase : index + 1));
      }, (index + 1) * INTRO_PHASE_MS)
    );

    return () => {
      timers.forEach(window.clearTimeout);
      ctx.revert();
    };
  }, [phases]);

  return (
    <motion.div
      ref={rootRef}
      className="relative z-50 grid h-dvh place-items-center overflow-hidden bg-[#fbfaf7] px-4 pb-4 pt-14 text-zinc-950 md:py-8"
      exit={{ opacity: 0, scale: 1.025, filter: "blur(16px)" }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
    >
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
        key={finalPhase ? "final" : phase}
        initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {!finalPhase ? (
          <div className="grid min-w-0 gap-4 md:grid-cols-[1.25fr_0.75fr] md:items-center lg:gap-10">
            <div className="intro-paper min-w-0 rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-[0_34px_100px_rgba(24,24,27,0.12)] backdrop-blur md:p-6 lg:p-8">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c4511b]">{current.eyebrow}</div>
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
        ) : (
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
        )}
      </motion.div>
    </motion.div>
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
