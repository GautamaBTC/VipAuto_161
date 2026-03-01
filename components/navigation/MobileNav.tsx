"use client";

import { useCallback, useState } from "react";
import { Cpu, Info, MessageSquare, Newspaper, Phone, Wrench } from "lucide-react";
import { BurgerButton } from "@/components/navigation/BurgerButton";
import { FullscreenMenu } from "@/components/navigation/FullscreenMenu";
import { NavLink } from "@/components/navigation/NavLink";

const navItems = [
  { href: "#services", label: "Услуги", icon: <Wrench className="h-5 w-5" />, accentClass: "text-[var(--accent)]" },
  { href: "#compare", label: "Сравнение", icon: <Cpu className="h-5 w-5" />, accentClass: "text-[var(--accent-2)]" },
  { href: "#advantages", label: "О компании", icon: <Info className="h-5 w-5" />, accentClass: "text-[#86efac]" },
  { href: "#reviews", label: "Отзывы", icon: <MessageSquare className="h-5 w-5" />, accentClass: "text-[#93c5fd]" },
  { href: "#process", label: "Процесс", icon: <Newspaper className="h-5 w-5" />, accentClass: "text-[#fcd34d]" },
  { href: "#contacts", label: "Контакты", icon: <Phone className="h-5 w-5" />, accentClass: "text-[#00b894]" },
] as const;

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <BurgerButton isOpen={isOpen} onToggle={toggle} />
      <FullscreenMenu isOpen={isOpen} onClose={close}>
        {navItems.map((item, i) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            index={i}
            accentColorClass={item.accentClass}
            onClick={close}
          />
        ))}
      </FullscreenMenu>
    </>
  );
}
