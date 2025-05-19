import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items?: {
    label: string;
    href: string;
    active?: boolean;
  }[];
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const defaultItems = [
    { label: "Home", href: "/", active: false },
    { label: "Shop", href: "/shop", active: true },
  ];

  const breadcrumbItems = items.length ? items : defaultItems;

  return (
    <nav className="flex items-center text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
          )}
          <Link
            to={item.href}
            className={`${
              item.active
                ? "font-medium text-foreground hover:text-orange-500"
                : "text-muted-foreground hover:text-foreground"
            } transition-colors`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
