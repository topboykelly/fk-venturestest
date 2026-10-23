import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Section";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { contact } from "@/data/store";
import { telUrl, whatsappUrl } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with F.K. DealsGH Ventures for wholesale orders and delivery.",
};

export default function ContactPage() {
  return (
    <section className="relative bg-grid pt-32 pb-20 md:pt-36 md:pb-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            label="Get in Touch"
            title={
              <>
                Contact <Accent>Us</Accent>
              </>
            }
          />
          <p className="mt-4 max-w-xl text-lg text-muted">
            Reach out for wholesale pricing, bulk orders or delivery questions. We usually reply within a few
            hours during business days.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6 rounded-4xl bg-surface p-6 md:p-8 dark:ring-1 dark:ring-white/5">
              <ul className="flex flex-col gap-5">
                <li className="flex items-start gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted">Location</p>
                    <p className="font-medium">{contact.location}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted">Hours</p>
                    <p className="font-medium">{contact.hours}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted">Phone / WhatsApp</p>
                    <a href={telUrl} className="font-medium hover:text-accent">
                      {contact.phone}
                    </a>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-sm text-accent hover:underline"
                    >
                      Open WhatsApp
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                    <Mail className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted">Email</p>
                    <a href={`mailto:${contact.email}`} className="font-medium hover:text-accent">
                      {contact.email}
                    </a>
                  </div>
                </li>
              </ul>
              <div className="border-t border-ink/10 pt-6">
                <p className="mb-3 text-sm text-muted">Follow us</p>
                <SocialLinks />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
