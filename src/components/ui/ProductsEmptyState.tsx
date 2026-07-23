import Link from "next/link";

type EmptyAction = {
  href: string;
  label: string;
  external?: boolean;
};

type ProductsEmptyStateProps = {
  title?: string;
  message: string;
  detail?: string;
  actions?: EmptyAction[];
  className?: string;
};

export default function ProductsEmptyState({
  title,
  message,
  detail,
  actions,
  className = "",
}: ProductsEmptyStateProps) {
  return (
    <div
      className={`flex min-h-[12rem] flex-col items-center justify-center px-4 py-12 text-center md:min-h-[16rem] md:py-16 ${className}`}
      role="status"
    >
      <div className="mx-auto max-w-md">
        {title ? (
          <h2 className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-charcoal md:text-base md:tracking-[0.22em]">
            {title}
          </h2>
        ) : null}
        <p
          className={`font-sans text-sm leading-relaxed text-soft-brown md:text-base ${
            title ? "mt-3" : ""
          }`}
        >
          {message}
        </p>
        {detail ? (
          <p className="mt-2 font-sans text-xs leading-relaxed text-charcoal/70 md:text-sm">
            {detail}
          </p>
        ) : null}

        {actions && actions.length > 0 ? (
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {actions.map((action) => {
              const className =
                "inline-flex min-w-[10.5rem] items-center justify-center rounded-full border border-charcoal/80 bg-transparent px-7 py-2.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:border-rose hover:bg-rose hover:text-charcoal";

              if (action.external) {
                return (
                  <a
                    key={action.href}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {action.label}
                  </a>
                );
              }

              return (
                <Link key={action.href} href={action.href} className={className}>
                  {action.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
