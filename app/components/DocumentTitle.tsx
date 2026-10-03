'use client';
import { useEffect } from 'react';

/** Sets the document title from a client component (not-found pages cannot export metadata). */
export default function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
