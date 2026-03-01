"use client";

import { FormEvent, useMemo, useState } from "react";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/siteConfig";

type FormState = "idle" | "loading" | "success" | "error";

type Errors = {
  name?: string;
  phone?: string;
};

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(services[0]?.title ?? "");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const phoneRaw = useMemo(() => phone.replace(/[^\d+]/g, ""), [phone]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Введите имя (минимум 2 символа).";
    if (!/^\+?\d{11,15}$/.test(phoneRaw)) next.phone = "Введите телефон в международном формате.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setFormState("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneRaw, service, message }),
      });

      if (!response.ok) {
        throw new Error("request failed");
      }

      setFormState("success");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      setFormState("error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm text-[var(--text-secondary)]">Имя</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-12 w-full rounded-xl border border-white/20 bg-black/20 px-3"
          placeholder="Как к вам обращаться"
        />
        {errors.name ? <span className="mt-1 block text-xs text-red-300">{errors.name}</span> : null}
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-[var(--text-secondary)]">Телефон</span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="h-12 w-full rounded-xl border border-white/20 bg-black/20 px-3"
          placeholder="+7 (___) ___-__-__"
        />
        {errors.phone ? <span className="mt-1 block text-xs text-red-300">{errors.phone}</span> : null}
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-[var(--text-secondary)]">Услуга</span>
        <select value={service} onChange={(event) => setService(event.target.value)} className="h-12 w-full rounded-xl border border-white/20 bg-black/20 px-3">
          {services.map((item) => (
            <option key={item.id} value={item.title}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-[var(--text-secondary)]">Комментарий</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2"
          placeholder="Кратко опишите задачу"
        />
      </label>
      <button
        type="submit"
        disabled={formState === "loading"}
        className="h-12 w-full rounded-xl bg-[var(--accent)] font-semibold transition hover:brightness-110 disabled:opacity-65"
      >
        {formState === "loading" ? "Отправка..." : "Отправить заявку"}
      </button>
      {formState === "success" ? <p className="text-sm text-green-300">Заявка отправлена. Мы свяжемся с вами.</p> : null}
      {formState === "error" ? (
        <p className="text-sm text-yellow-300">
          Не удалось отправить автоматически. Напишите нам в{" "}
          <a href={siteConfig.social.whatsapp} className="underline">
            WhatsApp
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
