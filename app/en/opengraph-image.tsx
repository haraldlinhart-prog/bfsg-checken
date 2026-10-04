import { ogImage, OG_ALT, OG_SIZE } from '../components/OgImage';

export const alt = OG_ALT.en;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('en');
}
