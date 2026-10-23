"use client";

import { useState } from "react";
import { brand } from "@/data/store";
import { mailtoUrl, whatsappUrl } from "@/lib/contact";
import { PillButton, PillLink } from "../ui/Button";
import { Field, TextArea, TextInput } from "../ui/fields";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const subject = `Enquiry from ${name || "website"} — ${brand.name}`;

  return (
    <form
      className="space-y-4 rounded-4xl bg-surface p-6 md:p-8 dark:ring-1 dark:ring-white/5"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailtoUrl(subject, body);
      }}
    >
      <Field id="name" label="Name">
        <TextInput
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
      </Field>
      <Field id="email" label="Email">
        <TextInput
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>
      <Field id="message" label="Message">
        <TextArea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your wholesale needs…"
        />
      </Field>
      <div className="flex flex-wrap gap-3 pt-2">
        <PillButton type="submit" variant="dark" arrow>
          Send email
        </PillButton>
        <PillLink
          href={whatsappUrl(message ? `${subject}\n\n${body}` : undefined)}
          target="_blank"
          rel="noreferrer"
          variant="outline"
        >
          WhatsApp instead
        </PillLink>
      </div>
    </form>
  );
}
