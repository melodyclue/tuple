import {
  faEnvelope,
  faHome,
  faInfo,
  faRadio,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { LinkDnD } from "./links/dnd";

type LinkType = "link" | "email" | "radio";

type Link = {
  id: string;
  type: LinkType;
  label: string;
  icon: IconDefinition;
  href: string;
};
const links: Link[] = [
  {
    id: "home",
    type: "link",
    label: "Home",
    icon: faHome,
    href: "/",
  },
  {
    id: "about",
    type: "link",
    label: "About",
    icon: faInfo,
    href: "/about",
  },
  {
    id: "radio",
    type: "radio",
    label: "Radio",
    icon: faRadio,
    href: "/radio",
  },
  {
    id: "contact",
    type: "email",
    label: "Contact",
    icon: faEnvelope,
    href: "/contact",
  },
];

export const List = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="pl-8">
        <h2 className="text-lg font-bold">Links</h2>
      </div>
      <LinkDnD links={links} teamId="1" />
    </div>
  );
};
