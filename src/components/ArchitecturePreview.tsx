"use client";

import { useRef, useState } from "react";

interface Props {
  label: string;
  title: string;
  src: string;
  alt: string;
}

/**
 * Button + native <dialog> lightbox. The browser handles focus trapping and Escape.
 * The image is only requested after the first open, so the (large) GIF never slows the page load.
 */
export default function ArchitecturePreview({ label, title, src, alt }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const [failed, setFailed] = useState(false);

  const open = () => {
    setOpened(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button type="button" className="btn" onClick={open} aria-haspopup="dialog">
        {label}
      </button>
      <dialog
        ref={dialog}
        className="arch-dialog"
        aria-label={`${title} ${label.toLowerCase()}`}
        // A click on the backdrop lands on the <dialog> element itself.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="arch-panel">
          <div className="arch-bar">
            <h2>{title}: {label.toLowerCase()}</h2>
            <button type="button" className="btn ghost arch-close" onClick={close}>Close</button>
          </div>
          {opened &&
            (failed ? (
              <p className="empty">The architecture preview could not be loaded. Try again in a moment.</p>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="arch-media" src={src} alt={alt} decoding="async" onError={() => setFailed(true)} />
            ))}
        </div>
      </dialog>
    </>
  );
}
