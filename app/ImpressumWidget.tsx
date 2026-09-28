'use client';
import { useEffect } from 'react';

export default function ImpressumWidget() {
  useEffect(() => {
    if (document.getElementById('if-widget-styles')) return;
    const s = document.createElement('script');
    s.src = 'https://impressum-free.de/widget.js';
    s.setAttribute('data-domain', 'bfsg-checken.de');
    document.head.appendChild(s);
  }, []);

  return <span id="impressum-free-widget" />;
}
