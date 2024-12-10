import type { LinkType } from '@/db/enum';
import { faEnvelope, faGlobe, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram,
  faFacebook,
  faYoutube,
  faLinkedin,
  faTiktok,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

export type LinkOption = {
  label: string;
  type: LinkType;
  icon: IconDefinition;
  placeholder: string;
};
export const LinkOptions: LinkOption[] = [
  { label: 'Website', type: 'website', icon: faGlobe, placeholder: 'Enter website URL' },
  { label: 'Email', type: 'email', icon: faEnvelope, placeholder: 'Enter email address' },
  { label: 'X (formerly Twitter)', type: 'x', icon: faXTwitter, placeholder: 'Enter your X username' },
  { label: 'Instagram', type: 'instagram', icon: faInstagram, placeholder: 'Enter your Instagram username' },
  { label: 'Facebook', type: 'facebook', icon: faFacebook, placeholder: 'Enter your Facebook username' },
  { label: 'Youtube', type: 'youtube', icon: faYoutube, placeholder: 'Enter your Youtube username' },
  { label: 'Linkedin', type: 'linkedin', icon: faLinkedin, placeholder: 'Enter your Linkedin username' },
  { label: 'Tiktok', type: 'tiktok', icon: faTiktok, placeholder: 'Enter your Tiktok username' },
] as const;

type LinkBaseUrlMapProps = {
  [key in LinkType]: string;
};
export const LinkBaseUrlMap: LinkBaseUrlMapProps = {
  website: '',
  email: 'mailto:',
  x: 'https://x.com/',
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  youtube: 'https://www.youtube.com/@',
  linkedin: 'https://www.linkedin.com/',
  tiktok: 'https://www.tiktok.com/@',
};
