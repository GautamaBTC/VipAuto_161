"use client";

import { useEffect, useRef } from "react";
import { ClipboardCheck, Crown, Handshake, ScanLine, Warehouse, Wrench, CircleDollarSign, Zap } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ComparisonCard } from "@/components/comparison/ComparisonCard";
import { ComparisonItem } from "@/components/comparison/ComparisonItem";

const garageItems = [
  {
    icon: <Wrench className="h-5 w-5" />,
    text: "Замена деталей без поиска первопричины",
  },
  {
    icon: <CircleDollarSign className="h-5 w-5" />,
    text: "Неясные сроки и стоимость по факту",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    text: "Нестабильный результат на сложной электрике",
  },
] as const;

const vipItems = [
  {
    icon: <ScanLine className="h-5 w-5" />,
    text: "Диагностика цепей и блоков под нагрузкой",
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    text: "Прозрачное согласование до старта ремонта",
  },
  {
    icon: <ClipboardCheck className="h-5 w-5" />,
    text: "Контрольная проверка перед выдачей автомобиля",
  },
] as const;

export function ComparisonSection() {
  const gsap = useGSAP();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const garageRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const vipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const garage = garageRef.current;
    const divider = dividerRef.current;
    const vip = vipRef.current;
    if (!header || !garage || !vip) return;

    const cards = [garage, divider, vip].filter(Boolean) as HTMLDivElement[];

    if (reduced) {
      gsap.set([header, ...cards], { autoAlpha: 1, y: 0, x: 0 });
      return;
    }

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    tweens.push(
      gsap.from(header, {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          once: true,
        },
      }),
    );

    cards.forEach((card, i) => {
      gsap.set(card, { autoAlpha: 0, y: 40 });
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        once: true,
        onEnter: () => {
          tweens.push(
            gsap.to(card, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              delay: i * 0.15,
              ease: "expo.out",
            }),
          );
        },
      });
      triggers.push(trigger);
    });

    [garage, vip].forEach((card) => {
      const items = card.querySelectorAll<HTMLElement>("[data-comparison-item]");
      gsap.set(items, { autoAlpha: 0, x: -20 });
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 75%",
        once: true,
        onEnter: () => {
          tweens.push(
            gsap.to(items, {
              autoAlpha: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.12,
              delay: 0.35,
              ease: "power3.out",
            }),
          );
        },
      });
      triggers.push(trigger);
    });

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [gsap, reduced]);

  return (
    <section ref={sectionRef} id="compare" className="section-padding relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(ellipse, rgba(255,95,46,0.08) 0%, rgba(215,23,23,0.06) 50%, transparent 72%)",
        }}
      />

      <div className="container-shell relative z-10">
        <div ref={headerRef} className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-5 py-2 text-[13px] font-semibold uppercase tracking-wider text-[var(--accent-2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" />
            Сравнение
          </div>

          <h2 className="text-[clamp(26px,5vw,44px)] font-bold leading-tight tracking-tight text-gray-100">
            Обычный гараж <span className="text-white/30">vs</span>{" "}
            <span className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              VIPАвто
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/45">
            Наглядно показываем, чем профессиональный подход отличается от случайного ремонта.
          </p>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
          <ComparisonCard
            ref={garageRef}
            variant="garage"
            badge="Гаражный подход"
            title="Обычный гараж"
            titleIcon={<Warehouse className="h-5 w-5" />}
          >
            {garageItems.map((item) => (
              <div key={item.text} data-comparison-item>
                <ComparisonItem icon={item.icon} text={item.text} variant="negative" />
              </div>
            ))}
          </ComparisonCard>

          <div ref={dividerRef} className="comparison-divider hidden lg:flex">
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <span className="text-lg font-bold tracking-tight text-white/35">vs</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-2 lg:hidden">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-bold text-white/35">
              vs
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <ComparisonCard
            ref={vipRef}
            variant="vip"
            badge="Подход VIPАвто"
            title="VIPАвто"
            titleIcon={<Crown className="h-5 w-5" />}
          >
            {vipItems.map((item) => (
              <div key={item.text} data-comparison-item>
                <ComparisonItem icon={item.icon} text={item.text} variant="positive" />
              </div>
            ))}
          </ComparisonCard>
        </div>
      </div>
    </section>
  );
}
