import { useState } from "react";
import "./DockIcon.css";

// Built-in pixel SVG fallbacks recoloured with Dusk Sky palette tokens
const PixelFallbackIcon = ({ fallbackKey }) => {
  switch (fallbackKey) {
    case "home":
      return (
        <svg
          className="dock-fallback-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Temple Pediment / Roof */}
          <rect x="11" y="2" width="2" height="2" fill="#E3AB55" />
          <rect x="9" y="4" width="6" height="2" fill="#E3AB55" />
          <rect x="6" y="6" width="12" height="2" fill="#E3AB55" />
          <rect x="3" y="8" width="18" height="2" fill="#B9852F" />
          {/* Columns */}
          <rect x="4" y="10" width="3" height="9" fill="#9EB2BD" />
          <rect x="9" y="10" width="2" height="9" fill="#D9C7A3" />
          <rect x="13" y="10" width="2" height="9" fill="#D9C7A3" />
          <rect x="17" y="10" width="3" height="9" fill="#9EB2BD" />
          {/* Base */}
          <rect x="3" y="19" width="18" height="2" fill="#B9852F" />
          <rect x="2" y="21" width="20" height="2" fill="#141A23" />
        </svg>
      );

    case "invitations":
      return (
        <svg
          className="dock-fallback-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Scroll parchment */}
          <rect x="5" y="3" width="14" height="18" fill="#F3E7CC" />
          <rect x="4" y="2" width="16" height="2" fill="#E3AB55" />
          <rect x="4" y="20" width="16" height="2" fill="#E3AB55" />
          {/* Text lines */}
          <rect x="8" y="7" width="8" height="2" fill="#9EB2BD" />
          <rect x="8" y="11" width="8" height="2" fill="#9EB2BD" />
          {/* Wax seal in --torch */}
          <rect x="10" y="14" width="4" height="4" fill="#E2762D" />
          <rect x="11" y="15" width="2" height="2" fill="#E3AB55" />
        </svg>
      );

    case "teams":
      return (
        <svg
          className="dock-fallback-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Shield in panel & steel */}
          <rect x="7" y="5" width="10" height="10" fill="#3B4759" />
          <rect x="9" y="7" width="6" height="6" fill="#9EB2BD" />
          <rect x="8" y="15" width="8" height="3" fill="#3B4759" />
          <rect x="10" y="18" width="4" height="2" fill="#9EB2BD" />
          {/* Swords crossed diagonal hints */}
          <rect x="4" y="4" width="3" height="3" fill="#E3AB55" />
          <rect x="17" y="4" width="3" height="3" fill="#E3AB55" />
          <rect x="4" y="17" width="3" height="3" fill="#9EB2BD" />
          <rect x="17" y="17" width="3" height="3" fill="#9EB2BD" />
        </svg>
      );

    case "submissions":
      return (
        <svg
          className="dock-fallback-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Up arrow */}
          <rect x="11" y="3" width="2" height="2" fill="#E3AB55" />
          <rect x="9" y="5" width="6" height="2" fill="#E3AB55" />
          <rect x="7" y="7" width="10" height="2" fill="#E3AB55" />
          <rect x="10" y="9" width="4" height="5" fill="#E3AB55" />
          {/* Submission crate */}
          <rect x="4" y="14" width="16" height="7" fill="#3B4759" />
          <rect x="5" y="15" width="14" height="2" fill="#9EB2BD" />
          <rect x="11" y="17" width="2" height="3" fill="#141A23" />
        </svg>
      );

    case "profile":
      return (
        <svg
          className="dock-fallback-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Helmet Crest in --torch & gold */}
          <rect x="10" y="2" width="4" height="4" fill="#E2762D" />
          <rect x="8" y="5" width="8" height="2" fill="#E3AB55" />
          {/* Helmet Dome in --steel */}
          <rect x="6" y="7" width="12" height="8" fill="#9EB2BD" />
          {/* Visor T-slit in dark navy shadow */}
          <rect x="8" y="12" width="8" height="2" fill="#141A23" />
          <rect x="11" y="14" width="2" height="5" fill="#141A23" />
          {/* Cheekguards */}
          <rect x="6" y="15" width="3" height="4" fill="#9EB2BD" />
          <rect x="15" y="15" width="3" height="4" fill="#9EB2BD" />
        </svg>
      );

    default:
      return (
        <svg
          className="dock-fallback-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="16" height="16" fill="#3B4759" stroke="#9EB2BD" strokeWidth="2" />
          <rect x="10" y="10" width="4" height="4" fill="#E3AB55" />
        </svg>
      );
  }
};

/**
 * Reusable DockIcon component.
 * Supports image path with automatic pixel SVG fallback on missing/failed load.
 */
function DockIcon({
  label,
  image,
  onClick,
  isActive = false,
  badgeCount = 0,
  fallbackKey,
  ariaLabel
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      className={`dock-icon-btn ${isActive ? "active" : ""}`}
      onClick={onClick}
      aria-label={ariaLabel || label}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Tooltip on hover/focus */}
      <div className="dock-tooltip" role="tooltip" aria-hidden="true">
        <span>{label}</span>
        {isActive && <span className="tooltip-active-tag"> • Active</span>}
      </div>

      <div className="dock-icon-wrapper">
        {image && !imageError ? (
          <img
            src={image}
            alt=""
            className="dock-icon-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <PixelFallbackIcon fallbackKey={fallbackKey} />
        )}

        {/* Small pixel badge for pending counts in --torch */}
        {badgeCount > 0 && (
          <span className="dock-pixel-badge" aria-label={`${badgeCount} pending`}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </div>

      {/* Non-color active indicator notch in --gold */}
      {isActive && <span className="dock-active-notch" aria-hidden="true" />}
    </button>
  );
}

export default DockIcon;
