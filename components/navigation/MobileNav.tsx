"use client";

import { useCallback, useState } from "react";
import { Award, Cog, Contact, ListChecks, MessageSquare, Scale } from "lucide-react";
import { BurgerButton } from "@/components/navigation/BurgerButton";
import { FullscreenMenu } from "@/components/navigation/FullscreenMenu";
import { NavLink } from "@/components/navigation/NavLink";

const navItems = [
  { href: "#compare", label: "Сравнение", icon: <Scale className="h-5 w-5" />, accent: "purple" as const, direction: "left" as const },
  { href: "#services", label: "Услуги", icon: <Cog className="h-5 w-5" />, accent: "teal" as const, direction: "right" as const },
  { href: "#advantages", label: "Преимущества", icon: <Award className="h-5 w-5" />, accent: "green" as const, direction: "left" as const },
  { href: "#process", label: "Процесс", icon: <ListChecks className="h-5 w-5" />, accent: "gold" as const, direction: "right" as const },
  { href: "#reviews", label: "Отзывы", icon: <MessageSquare className="h-5 w-5" />, accent: "pink" as const, direction: "left" as const },
  { href: "#contacts", label: "Контакты", icon: <Contact className="h-5 w-5" />, accent: "green" as const, direction: "right" as const },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <BurgerButton isOpen={isOpen} onToggle={toggle} />

      <FullscreenMenu isOpen={isOpen} onClose={close}>
        {navItems.map((item, index) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            index={index}
            direction={item.direction}
            accentColor={item.accent}
            onClick={close}
          />
        ))}
      </FullscreenMenu>
    </>
  );
}
