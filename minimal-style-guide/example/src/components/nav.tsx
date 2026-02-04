import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Manifesto" },
  { href: "/showcase", label: "Showcase" },
  { href: "/audit", label: "Audit" },
];

export function Nav() {
  const [location] = useLocation();

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <a
            className={cn(
              "transition-colors hover:text-foreground/80",
              location === link.href
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {link.label}
          </a>
        </Link>
      ))}
    </nav>
  );
}
