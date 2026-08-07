"use client";

import { Suspense, useEffect, useState } from "react";
import { X } from "lucide-react";
import NavigationSidebar from "@/components/layout/NavigationSidebar";
import { useTranslation } from "@/lib/useTranslation";

type SidebarMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function SidebarMenu({ open, onClose }: SidebarMenuProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setVisible(false), 300);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open && !visible) return null;

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[60] bg-charcoal/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-label={t.aria_close_menu}
        tabIndex={open ? 0 : -1}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-[82.5%] max-w-[22rem] flex-col overflow-y-auto border-r border-nightview-light/60 bg-warm-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex shrink-0 items-center justify-end border-b border-nightview-light/50 px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-nightview transition-colors hover:bg-nightview-light/25 hover:text-brand-pink"
            aria-label={t.aria_close_menu}
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <Suspense fallback={<div className="flex-1 px-4 py-5" />}>
          <div className="flex min-h-0 flex-1 flex-col">
            <NavigationSidebar onNavigate={onClose} />
          </div>
        </Suspense>
      </aside>
    </>
  );
}
