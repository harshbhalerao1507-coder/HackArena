import homeIcon from "../assets/icons/dock/dock-home.png";
import invitationsIcon from "../assets/icons/dock/dock-invitations.png";
import teamsIcon from "../assets/icons/dock/dock-teams.png";
import profileIcon from "../assets/icons/dock/dock-profile.png";

/**
 * Dock items configuration.
 * To replace an icon, update the image path or drop replacement 128x128 PNGs
 * into /src/assets/icons/dock/ with the corresponding filenames.
 */
export const DOCK_ITEMS_CONFIG = [
  {
    id: "home",
    label: "Dashboard",
    route: "/studentDashboard",
    image: homeIcon,
    fallbackKey: "home",
    ariaLabel: "Student Dashboard (Home)"
  },
  {
    id: "invitations",
    label: "Invitations",
    route: "/studentDashboard/invitations",
    image: invitationsIcon,
    fallbackKey: "invitations",
    showBadge: true,
    ariaLabel: "Pending Invitations"
  },
  {
    id: "teams",
    label: "My Teams",
    route: "/teamDashboard",
    image: teamsIcon,
    fallbackKey: "teams",
    ariaLabel: "My Teams"
  },
  {
    id: "profile",
    label: "Profile",
    action: "profile",
    image: profileIcon,
    fallbackKey: "profile",
    ariaLabel: "Gladiator Profile"
  }
];
