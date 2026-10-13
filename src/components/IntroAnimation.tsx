import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent, WheelEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Check, FileText, Play, Video } from "lucide-react";
import { introContent } from "../data/introContent";
import { CTAButton } from "./CTAButton";

const VIDEO_START_DELAY_MS = 3000;
const VIDEO_VISIBLE_SLIDES_TOTAL_MS = 40000;
const MOBILE_GESTURE_QUERY = "(max-width: 767px)";
const CASE_STUDIES_URL = "https://www.naveenupadhyay.com/case-studies";

const isMobileViewport = () =>
  typeof window !== "undefined" && window.matchMedia(MOBILE_GESTURE_QUERY).matches;

const caseStudies = [
  {
    domain: "Engineering",
    title: "ForgeOS — Human-Led, AI-Powered Engineering",
    summary:
      "An AI-native engineering operating system that brings together experienced developers and specialized AI agents to transform requirements into production-grade software—with built-in context, orchestration, testing, and human oversight.",
    capabilities: [
      {
        title: "Multi-Agent Orchestration",
        description: "Specialized planning, coding, testing, and code-review agents collaborate throughout the engineering lifecycle."
      },
      {
        title: "Unified Context & Control",
        description: "A centralized layer connecting repository knowledge, development tools, coding agents, automated tests, evaluations, and human approvals."
      },
      {
        title: "Human-in-the-Loop Engineering",
        description: "Developers refine requirements, validate architecture, review AI-generated code, and control production releases."
      }
    ],
    outcomes: ["Higher Engineering Leverage", "Faster Idea-to-Production", "Production-Grade Quality"],
    youtubeEmbedUrl: "https://www.youtube.com/embed/T6-zwdcmdOs?vq=hd720&hd=1",
    videoSrc: ""
  },
  {
    domain: "Education",
    title: "Education AI — Intelligent Learning Platforms",
    summary:
      "AI-powered education systems that personalize learning, support educators, and automate academic workflows. Combining conversational AI, adaptive learning, intelligent assessments, and learning analytics to create scalable, engaging educational experiences.",
    capabilities: [
      {
        title: "AI Tutors & Personalized Learning",
        description:
          "Conversational AI tutors that adapt explanations, difficulty levels, and learning paths to individual students, providing contextual guidance and feedback."
      },
      {
        title: "Intelligent Assessments & Analytics",
        description: "AI-driven assessments, automated evaluation, learning-gap identification, and personalized recommendations to support student progress."
      },
      {
        title: "Academic Workflow Automation",
        description: "AI agents supporting curriculum development, lesson planning, content generation, student engagement, and institutional workflows."
      }
    ],
    outcomes: ["Personalized Learning at Scale", "Higher Educator Productivity", "Intelligent Learning Experiences"],
    youtubeEmbedUrl: "https://www.youtube.com/embed/aDXsjcSA3t8?vq=hd720&hd=1",
    videoSrc: ""
  },
  {
    domain: "Finance",
    title: "Finance & Accounting — Intelligent Financial Operations",
    summary:
      "AI-native financial systems that automate complex accounting workflows, streamline financial operations, and transform financial data into actionable insights. Combining intelligent document processing, reconciliation, financial analysis, and human-controlled automation.",
    capabilities: [
      {
        title: "Intelligent Document Processing",
        description: "AI agents that extract, classify, validate, and process invoices, purchase orders, receipts, bank statements, and other financial documents."
      },
      {
        title: "Accounting & Reconciliation Automation",
        description: "Intelligent transaction matching, account reconciliation, exception detection, journal-entry preparation, and integration with ERP and accounting systems."
      },
      {
        title: "Financial Intelligence & Compliance",
        description: "AI-powered anomaly detection, financial reporting, cash-flow insights, compliance monitoring, and human approval workflows."
      }
    ],
    outcomes: ["Reduced Manual Processing", "Faster Financial Operations", "Stronger Financial Controls"],
    videoSrc: ""
  },
  {
    domain: "Legal",
    title: "Legal AI — Intelligent Legal Workflows",
    summary:
      "AI-powered legal systems that accelerate document analysis, contract review, legal research, and compliance workflows. Combining intelligent document processing, contextual search, and agentic automation while keeping legal professionals in control of critical decisions.",
    capabilities: [
      {
        title: "Contract Intelligence & Review",
        description:
          "AI agents that analyze contracts, identify key clauses, highlight potential risks, compare versions, and suggest revisions based on legal and commercial guidelines."
      },
      {
        title: "Legal Research & Knowledge Intelligence",
        description: "Context-aware search and analysis across legal documents, policies, case materials, and knowledge repositories, with source references and structured insights."
      },
      {
        title: "Legal Workflow Automation",
        description: "AI-assisted document drafting, contract lifecycle management, obligation tracking, compliance monitoring, and approval workflows."
      }
    ],
    outcomes: ["Faster Document Reviews", "Reduced Administrative Work", "Better Legal Visibility"],
    videoSrc: ""
  },
  {
    domain: "Sales",
    title: "Sales Outreach — AI-Powered Revenue Intelligence",
    summary:
      "Intelligent sales systems that combine prospect research, lead qualification, personalized outreach, and sales workflow automation. AI agents help identify relevant opportunities, generate contextual engagement, and streamline sales operations.",
    capabilities: [
      {
        title: "Intelligent Prospect Discovery",
        description: "AI-powered prospect identification, account research, lead enrichment, and qualification based on ideal customer profiles and business signals."
      },
      {
        title: "Personalized Outreach Automation",
        description: "AI agents that generate contextual email sequences, personalized messaging, follow-up recommendations, and multichannel engagement workflows."
      },
      {
        title: "Sales Intelligence & CRM Automation",
        description: "Automated lead prioritization, CRM updates, meeting preparation, pipeline analysis, and actionable sales recommendations."
      }
    ],
    outcomes: ["Faster Prospect Discovery", "More Relevant Engagement", "Higher Sales Productivity"],
    videoSrc: ""
  },
  {
    domain: "Customer care",
    title: "Customer Care — AI-Powered Customer Experience",
    summary:
      "Intelligent customer service systems that combine conversational AI, business process automation, and human-agent collaboration to deliver scalable, context-aware customer experiences across multiple communication channels.",
    capabilities: [
      {
        title: "Conversational AI Support",
        description:
          "AI-powered chat, voice, email, and messaging agents that understand customer requests, retrieve relevant knowledge, and provide contextual, multilingual support."
      },
      {
        title: "Automated Service Workflows",
        description:
          "AI agents that retrieve order information, check account status, create service requests, update tickets, and execute authorized actions through connected enterprise systems."
      },
      {
        title: "Human-Agent Collaboration & Quality",
        description: "Intelligent escalation to human representatives with complete conversation context, AI-assisted response suggestions, quality evaluations, and service analytics."
      }
    ],
    outcomes: ["Faster Customer Resolution", "Scalable Customer Support", "Better Customer Experiences"],
    videoSrc: ""
  }
];

type CaseStudyMode = "text" | "video";

export function IntroAnimation() {
  const [phase, setPhase] = useState(0);
  const [showProfileVideo, setShowProfileVideo] = useState(false);
  const soundRequested = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("sound") === "on";
  }, []);
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
  const videoVisibleSteps = linkedinPhase + 1;
  const autoPhaseMs = VIDEO_VISIBLE_SLIDES_TOTAL_MS / videoVisibleSteps;
  const showProfileVideoNow = useCallback(() => {
    setShowProfileVideo(true);
  }, []);

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
    const timer = window.setTimeout(() => {
      setShowProfileVideo(true);
    }, VIDEO_START_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

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

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (phase >= totalSteps - 1) return undefined;

    const timer = window.setTimeout(() => {
      setPhase((currentPhase) => Math.min(totalSteps - 1, currentPhase + 1));
    }, autoPhaseMs);

    return () => window.clearTimeout(timer);
  }, [autoPhaseMs, phase, totalSteps]);

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
      if (isMobileViewport()) return;
      if (Math.abs(event.deltaY) < 36) return;
      navigateByGesture(event.deltaY > 0 ? "next" : "previous");
    },
    [navigateByGesture]
  );

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (isMobileViewport()) return;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (isMobileViewport()) {
        touchStartY.current = null;
        return;
      }
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
      <div
        className="absolute left-4 top-4 z-30 rounded-lg border border-zinc-200 bg-white/80 p-1 shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur md:left-8 md:top-6"
        aria-label="Intro progress"
      >
        <ol className="flex items-center gap-1.5">
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
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-200/90" aria-hidden="true">
          <motion.div
            key={`slide-progress-${activeStep}`}
            className="h-full w-full origin-left rounded-full bg-[#c4511b]"
            initial={{ scaleX: activeStep === totalSteps - 1 ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: activeStep === totalSteps - 1 ? 0 : autoPhaseMs / 1000, ease: "linear" }}
          />
        </div>
      </div>

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
        className={`relative z-10 mx-auto max-h-[calc(100dvh-4.5rem)] w-full min-w-0 max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain py-2 md:max-h-[calc(100dvh-4rem)] ${
          caseStudiesActive ? "md:max-w-[1320px]" : "md:max-w-6xl"
        }`}
        data-testid="intro-stage"
        key={caseStudiesActive ? "case-studies" : finalPhase ? "final" : "intro"}
        initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {phase < linkedinPhase ? (
          <div className="grid min-w-0 gap-4 md:grid-cols-[1.25fr_0.75fr] md:items-center lg:gap-10">
            <div key={phase} className="intro-paper min-w-0 rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-[0_34px_100px_rgba(24,24,27,0.12)] backdrop-blur md:p-6 lg:p-8">
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
            <IntroPanel showProfileVideo={showProfileVideo} soundRequested={soundRequested} onRequestVideo={showProfileVideoNow} />
            <ProfileInfoCard className="md:hidden" />
          </div>
        ) : finalPhase ? (
          <div className="mx-auto grid max-w-5xl gap-6 rounded-2xl border border-zinc-200 bg-white/95 p-6 text-center shadow-[0_38px_120px_rgba(24,24,27,0.14)] backdrop-blur md:grid-cols-[0.8fr_1fr] md:p-8 md:text-left">
            <ProfileMedia
              showVideo={showProfileVideo}
              soundRequested={soundRequested}
              onRequestVideo={showProfileVideoNow}
              frameClassName="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-[0_24px_60px_rgba(0,0,0,0.12)] md:mx-0"
              mediaClassName="mx-auto h-[38dvh] max-h-[360px] w-auto max-w-full object-contain md:aspect-[4/5] md:h-auto md:max-h-none md:w-full md:object-cover"
            />
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

export function CaseStudiesSection({ standalone = false }: { standalone?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [modes, setModes] = useState<Record<number, CaseStudyMode>>({});
  const [focusMode, setFocusMode] = useState(false);
  const resolvedModes = caseStudies.map((_, index) => modes[index] ?? "text");
  const allText = resolvedModes.every((mode) => mode === "text");
  const allVideo = resolvedModes.every((mode) => mode === "video");

  const setAll = (mode: CaseStudyMode) => {
    setModes(Object.fromEntries(caseStudies.map((_, index) => [index, mode])));
  };

  const setMode = (index: number, mode: CaseStudyMode) => {
    setModes((currentModes) => ({ ...currentModes, [index]: mode }));
  };

  const jumpToCase = (index: number) => {
    document.getElementById(`case-${index + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleFocus = (nextFocusMode: boolean) => {
    setFocusMode(nextFocusMode);
    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <section
      ref={sectionRef}
      className={`mx-auto flex max-w-[1320px] flex-wrap items-start gap-[clamp(32px,5vw,72px)] bg-black px-[clamp(20px,4vw,56px)] font-sans text-white ${
        focusMode ? "pb-[clamp(32px,6vw,88px)] pt-[clamp(72px,6vw,88px)]" : "py-[clamp(32px,6vw,88px)]"
      }`}
    >
      {!focusMode ? (
        <aside className="flex flex-[1_1_320px] flex-col gap-7 md:sticky md:top-8 md:max-w-[440px]">
          <h2 className="m-0 text-balance text-[clamp(36px,4.2vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]">
            Case studies of AI work done under my leadership.
          </h2>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#a3a3a3]">View all as</span>
            <ReadWatchSwitch allText={allText} allVideo={allVideo} onRead={() => setAll("text")} onWatch={() => setAll("video")} />
          </div>

          <nav className="hidden flex-col gap-0.5 border-t border-[#333] pt-4 md:flex" aria-label="Case study index">
            {caseStudies.map((study, index) => (
              <button
                key={study.title}
                type="button"
                className="-ml-3.5 flex items-baseline gap-3.5 rounded-full px-3.5 py-2.5 text-left text-base font-medium text-white transition hover:bg-[#1c1c1c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => jumpToCase(index)}
              >
                <span className="text-xs font-semibold tabular-nums text-[#a3a3a3]">{String(index + 1).padStart(2, "0")}</span>
                <span>{study.title}</span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="hidden items-center gap-2 self-start p-0 text-[15px] font-semibold text-white underline underline-offset-4 transition hover:text-[#a3a3a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex"
            onClick={() => toggleFocus(true)}
          >
            Focus on cards
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          {!standalone ? (
            <a
              href={CASE_STUDIES_URL}
              className="flex items-center gap-2 self-start text-[15px] font-semibold text-white underline underline-offset-4 transition hover:text-[#a3a3a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Full case studies
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          ) : null}
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        {focusMode ? (
          <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[#333] bg-black py-3">
            <button
              type="button"
              className="flex items-center gap-2 p-0 text-[15px] font-semibold text-white underline underline-offset-4 transition hover:text-[#a3a3a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => toggleFocus(false)}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Show intro
            </button>
            <div className="flex flex-wrap items-center gap-3">
              {!standalone ? (
                <a
                  href={CASE_STUDIES_URL}
                  className="flex items-center gap-2 text-[15px] font-semibold text-white underline underline-offset-4 transition hover:text-[#a3a3a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Full case studies
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              ) : null}
              <ReadWatchSwitch allText={allText} allVideo={allVideo} compact onRead={() => setAll("text")} onWatch={() => setAll("video")} />
            </div>
          </div>
        ) : null}

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${focusMode ? "420px" : "100%"}), 1fr))` }}
        >
          {caseStudies.map((study, index) => {
            const mode = resolvedModes[index];
            const number = String(index + 1).padStart(2, "0");

            return (
              <article id={`case-${index + 1}`} key={study.title} className="flex scroll-mt-6 flex-col gap-5 rounded-2xl bg-[#1c1c1c] p-[clamp(22px,2.6vw,32px)]">
                <header className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-semibold tabular-nums text-[#a3a3a3]">{number}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a3a3a3]">{study.domain}</span>
                    </div>
                    <h3 className="m-0 text-balance text-[clamp(23px,2.2vw,28px)] font-bold leading-[1.15] tracking-[-0.025em] text-white">
                      {study.title}
                    </h3>
                  </div>

                  <div role="tablist" aria-label={`${study.title} view`} className="inline-flex shrink-0 gap-0.5 rounded-full bg-[#2e2e2e] p-1">
                    <CaseTab active={mode === "text"} label="Overview" onClick={() => setMode(index, "text")} />
                    <CaseTab active={mode === "video"} label="Video explainer" icon={<Play size={14} fill="currentColor" strokeWidth={0} />} onClick={() => setMode(index, "video")} />
                  </div>
                </header>

                <div className="grid">
                  <div className={`col-start-1 row-start-1 flex flex-col gap-5 transition-opacity duration-200 ${mode === "text" ? "visible opacity-100" : "invisible opacity-0"}`}>
                    <p className="m-0 max-w-[62ch] text-pretty text-[17px] leading-[1.6] text-[#cfcfcf]">{study.summary}</p>
                    {"capabilities" in study && study.capabilities ? (
                      <div className="grid gap-3 md:grid-cols-3">
                        {study.capabilities.map((capability) => (
                          <div key={capability.title} className="rounded-2xl border border-[#3a3a3a] bg-black/20 p-4">
                            <h4 className="m-0 text-sm font-semibold leading-snug text-white">{capability.title}</h4>
                            <p className="mt-2 text-sm leading-6 text-[#a3a3a3]">{capability.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#a3a3a3]">Outcomes</span>
                      <div className="flex flex-wrap gap-2">
                        {study.outcomes.map((outcome) => (
                          <span key={outcome} className="inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] py-2 pl-2.5 pr-3.5 text-sm font-medium text-white">
                            <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`col-start-1 row-start-1 flex flex-col gap-3 transition-opacity duration-200 ${mode === "video" ? "visible opacity-100" : "invisible opacity-0"}`}>
                    {"youtubeEmbedUrl" in study && study.youtubeEmbedUrl ? (
                      <iframe
                        className="block aspect-video w-full rounded-2xl bg-black"
                        src={study.youtubeEmbedUrl}
                        title={`${study.title} video explainer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : study.videoSrc ? (
                      <video src={study.videoSrc} controls preload="metadata" className="block aspect-video w-full rounded-2xl bg-black" />
                    ) : (
                      <div className="relative flex aspect-video w-full flex-col justify-between overflow-hidden rounded-2xl bg-black p-5 text-white">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a3a3a3]">{number} · Explainer</span>
                        <div className="flex flex-1 items-center justify-center">
                          <div className="flex size-16 items-center justify-center rounded-full bg-white text-black">
                            <Play size={24} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                          </div>
                        </div>
                        <div className="flex items-end justify-between gap-3">
                          <span className="max-w-[70%] text-base font-semibold leading-snug">{study.title}</span>
                          <span className="text-xs text-[#a3a3a3]">Video coming soon</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ReadWatchSwitch({
  allText,
  allVideo,
  compact = false,
  onRead,
  onWatch
}: {
  allText: boolean;
  allVideo: boolean;
  compact?: boolean;
  onRead: () => void;
  onWatch: () => void;
}) {
  return (
    <div className="inline-flex self-start rounded-full border border-[#333] p-1">
      <button
        type="button"
        className={`flex items-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          compact ? "px-4 py-2" : "px-[18px] py-2.5"
        } ${allText ? "bg-white text-black" : "bg-transparent text-[#bdbdbd] hover:text-white"}`}
        onClick={onRead}
      >
        <FileText size={16} aria-hidden="true" />
        Read
      </button>
      <button
        type="button"
        className={`flex items-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          compact ? "px-4 py-2" : "px-[18px] py-2.5"
        } ${allVideo ? "bg-white text-black" : "bg-transparent text-[#bdbdbd] hover:text-white"}`}
        onClick={onWatch}
      >
        <Video size={16} aria-hidden="true" />
        Watch
      </button>
    </div>
  );
}

function CaseTab({
  active,
  label,
  icon,
  onClick
}: {
  active: boolean;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        active ? "bg-white text-black" : "bg-transparent text-[#bdbdbd] hover:text-white"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function ProfileMedia({
  showVideo,
  soundRequested,
  onRequestVideo,
  frameClassName,
  mediaClassName
}: {
  showVideo: boolean;
  soundRequested: boolean;
  onRequestVideo: () => void;
  frameClassName: string;
  mediaClassName: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userStartedVideo, setUserStartedVideo] = useState(false);
  const [soundPreference, setSoundPreference] = useState(soundRequested);
  const [soundEnabled, setSoundEnabled] = useState(soundRequested);
  const [hasEnded, setHasEnded] = useState(false);
  const videoVisible = showVideo || userStartedVideo;

  const playVideo = useCallback(async (withSound: boolean, restart = false) => {
    const video = videoRef.current;
    if (!video) return;

    if (restart) {
      video.currentTime = 0;
    }

    setHasEnded(false);
    video.muted = !withSound;
    video.volume = 1;

    try {
      await video.play();
      setSoundEnabled(withSound && !video.muted);
    } catch {
      video.muted = true;
      setSoundEnabled(false);
      void video.play().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    if (!showVideo) return;

    void playVideo(soundPreference || soundRequested);
  }, [playVideo, showVideo, soundPreference, soundRequested]);

  const requestSound = useCallback(() => {
    setSoundPreference(true);
    setSoundEnabled(true);

    if (!showVideo) {
      setUserStartedVideo(true);
      onRequestVideo();
    }

    void playVideo(true);
  }, [onRequestVideo, playVideo, showVideo]);

  return (
    <div className={`${frameClassName} relative`}>
      <>
        <a
          href={introContent.brand.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Naveen Upadhyay on LinkedIn"
          className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full border border-white/55 bg-[#0a66c2]/90 text-base font-bold leading-none text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-[#0a66c2] focus:outline-none focus:ring-2 focus:ring-white/85"
        >
          in
        </a>
        <video
          ref={videoRef}
          className={`${mediaClassName} ${videoVisible ? "" : "pointer-events-none absolute inset-0 opacity-0"}`}
          poster={introContent.brand.portrait}
          muted={!soundEnabled}
          playsInline
          preload="auto"
          aria-hidden={videoVisible ? undefined : true}
          aria-label={videoVisible ? `${introContent.brand.founder} intro video` : undefined}
          onEnded={() => setHasEnded(true)}
        >
          <source src={introContent.brand.profileVideo} type="video/mp4" />
        </video>
        {!videoVisible ? (
          <>
            <img src={introContent.brand.portrait} alt={introContent.brand.founder} className={mediaClassName} />
            <button
              type="button"
              aria-label="Start video with sound"
              className="absolute bottom-3 left-3 rounded-full border border-white/45 bg-zinc-950/35 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-zinc-950/55 focus:outline-none focus:ring-2 focus:ring-white/80"
              onClick={requestSound}
            >
              Sound on
            </button>
          </>
        ) : (
        <>
          {hasEnded ? (
            <button
              type="button"
              aria-label="Play video again"
              className="absolute inset-0 grid place-items-center bg-zinc-950/20 backdrop-blur-[1px] transition hover:bg-zinc-950/30 focus:outline-none focus:ring-2 focus:ring-white/80"
              onClick={() => void playVideo(soundEnabled || soundPreference || soundRequested, true)}
            >
              <span className="grid size-16 place-items-center rounded-full border border-white/55 bg-zinc-950/45 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur md:size-20">
                <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white md:border-y-[12px] md:border-l-[20px]" />
              </span>
            </button>
          ) : null}
          <button
            type="button"
            aria-label="Turn sound on"
            className={`absolute bottom-3 left-3 rounded-full border border-white/45 bg-zinc-950/35 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-zinc-950/55 focus:outline-none focus:ring-2 focus:ring-white/80 ${
              soundEnabled || hasEnded ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            onClick={requestSound}
          >
            Sound on
          </button>
        </>
        )}
      </>
    </div>
  );
}

function IntroPanel({
  showProfileVideo,
  soundRequested,
  onRequestVideo
}: {
  showProfileVideo: boolean;
  soundRequested: boolean;
  onRequestVideo: () => void;
}) {
  return (
    <div className="relative order-first min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white/92 p-3 shadow-[0_34px_90px_rgba(24,24,27,0.12)] backdrop-blur md:order-none md:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(194,65,12,0.10),transparent_28%),radial-gradient(circle_at_76%_74%,rgba(250,204,21,0.12),transparent_30%)]" />
      <div className="relative grid gap-3 md:gap-4">
        <ProfileMedia
          showVideo={showProfileVideo}
          soundRequested={soundRequested}
          onRequestVideo={onRequestVideo}
          frameClassName="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-[0_26px_70px_rgba(0,0,0,0.14)]"
          mediaClassName="mx-auto h-[34dvh] max-h-[300px] w-auto max-w-full object-contain md:aspect-[4/5] md:h-auto md:max-h-none md:w-full md:object-cover md:object-center"
        />
        <ProfileInfoCard className="hidden md:block" />
      </div>
    </div>
  );
}

function ProfileInfoCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white/95 p-3 md:p-4 ${className}`}>
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#c4511b]">{introContent.brand.founder}</div>
      <div className="mt-2 text-lg font-semibold leading-tight text-zinc-950">CTO and CPO consultant</div>
      <a className="mt-3 block text-sm font-semibold text-zinc-700 underline decoration-[#c4511b]/40 underline-offset-4" href={`mailto:${introContent.brand.email}`}>
        {introContent.brand.email}
      </a>
    </div>
  );
}
