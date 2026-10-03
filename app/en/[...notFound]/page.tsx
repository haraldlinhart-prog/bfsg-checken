import { notFound } from 'next/navigation';

/** Catches every unknown URL so the styled not-found page of this root layout is shown (with HTTP 404). */
export default function CatchAll() {
  notFound();
}
