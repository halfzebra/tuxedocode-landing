"use client";

import { useState, type FocusEvent, type SubmitEvent } from "react";

import { CONTACT_EMAIL } from "@/lib/constants";

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClassName =
  "w-full border bg-bg px-[14px] py-[13px] font-sans text-[15px] text-ink outline-none focus:border-ink";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);

  function checkEmail(event: FocusEvent<HTMLInputElement>) {
    const value = event.currentTarget.value.trim();
    setEmailInvalid(value.length > 0 && !EMAIL_RE.test(value));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    if (!EMAIL_RE.test(email)) {
      setEmailInvalid(true);
      form.querySelector<HTMLInputElement>("input[name='email']")?.focus();
      return;
    }

    setEmailInvalid(false);
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          company: formData.get("company"),
          email,
          message: formData.get("message"),
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(body.error || "Could not send your message. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setErrorMessage("Could not send your message. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 border border-ink bg-surface px-10 py-14 md:col-start-2 md:row-start-1 md:row-span-2">
        <span className="font-mono text-[10px] tracking-[0.12em] text-label uppercase">
          Message sent
        </span>
        <h2 className="text-[26px] leading-[1.15] font-extrabold tracking-[-0.03em] text-balance md:text-[30px]">
          Thanks — I have your message
        </h2>
        <p className="max-w-[44ch] text-base leading-[1.6] text-body-muted text-pretty">
          I will reply from {CONTACT_EMAIL}, usually within one working day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="border-b border-rule-soft pb-[2px] text-[15px] font-semibold"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 border border-rule bg-surface p-10 md:col-start-2 md:row-start-1 md:row-span-2"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.12em] text-label uppercase">
            Name
          </span>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            maxLength={200}
            className={`${inputClassName} border-rule`}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.12em] text-label uppercase">
            Company
          </span>
          <input
            type="text"
            name="company"
            placeholder="Optional"
            maxLength={200}
            className={`${inputClassName} border-rule`}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.12em] text-label uppercase">
          Email
        </span>
        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          required
          maxLength={200}
          onBlur={checkEmail}
          className={`${inputClassName} ${emailInvalid ? "border-error" : "border-rule"}`}
        />
        {emailInvalid && (
          <span className="font-mono text-[10px] tracking-[0.1em] text-error uppercase">
            Enter an email so I can reply
          </span>
        )}
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.12em] text-label uppercase">
          What do you need?
        </span>
        <textarea
          name="message"
          rows={6}
          placeholder="A few lines about the project, the stack, and the timeline."
          required
          maxLength={5000}
          className={`${inputClassName} border-rule resize-y leading-[1.6]`}
        />
      </label>
      {status === "error" && (
        <p className="text-sm text-error" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-w-[186px] bg-ink px-7 py-[15px] text-[15px] font-bold text-bg hover:bg-accent disabled:opacity-55"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-[13px] text-meta">
          Or email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="border-b border-rule-soft"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </form>
  );
}
