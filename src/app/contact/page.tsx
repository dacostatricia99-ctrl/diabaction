import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { contact } from "@/data/demo";
import { telLink, whatsappLink, mailLink } from "@/lib/format";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Diabaction Congo par téléphone, WhatsApp ou email.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" subtitle="Une question ? Joignez-nous en un clic." />
      <div className="container-page grid gap-8 py-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-extrabold text-ink">Nous joindre directement</h2>
          <ul className="mt-3 space-y-3">
            <li>
              <a href={telLink(contact.phone)} className="card flex items-center gap-3 p-4 hover:shadow-float">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon name="phone" width={22} height={22} />
                </span>
                <span>
                  <span className="block font-bold text-ink">Appeler</span>
                  <span className="text-sm text-ink/70">{contact.phone}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-3 p-4 hover:shadow-float"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-soft text-success">
                  <Icon name="whatsapp" width={22} height={22} />
                </span>
                <span>
                  <span className="block font-bold text-ink">WhatsApp</span>
                  <span className="text-sm text-ink/70">Écrire sur WhatsApp</span>
                </span>
              </a>
            </li>
            <li>
              <a href={mailLink(contact.email)} className="card flex items-center gap-3 p-4 hover:shadow-float">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon name="mail" width={22} height={22} />
                </span>
                <span>
                  <span className="block font-bold text-ink">Email</span>
                  <span className="text-sm text-ink/70">{contact.email}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-extrabold text-ink">Nous écrire</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
