import { useEffect } from 'react';

const SITE = 'Savora';

/** Sets the document title and meta description for basic per-page SEO. */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — Good Food. Great Moments.`;
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}
