import { Linkedin, PhoneCall, Mail } from "lucide-react";
import Link from "next/link";

const contacts = [
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/in/taiwotopesunday",
  },
  {
    label: "Phone",
    icon: PhoneCall,
    href: "tel:+2347035527946",
  },
  {
    label: "Email",
    icon: Mail,
    href: "mailto:topzyray009@gmail.com",
  },
];

export default function ContactSection() {
  return (
    <section>
      <ul className="flex flex-col items-center justify-center gap-2">
        {contacts.map(({ label, icon: Icon, href }) => (
          <li
            key={label}
            className="px-3 cursor-pointer flex items-center gap-2 transition-shadow hover:shadow-md hover:shadow-primary rounded-lg"
          >
            <Icon size={16} />
            <Link
              href={href}
              target={label !== "Phone" ? "_blank" : undefined}
              className="font-medium text-xl underline-offset-2 hover:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
