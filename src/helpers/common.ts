import { androidAppUrl, iosAppUrl } from "~/lib/appLinks";

export const detectDeviceType = () =>
  /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
    navigator.userAgent
  )
    ? "mobile"
    : "desktop";

// App store for the visitor's phone or tablet, or undefined elsewhere.
// iPadOS reports a Mac user agent, so a touch-capable "Mac" counts as iOS.
export const detectMobileAppUrl = () => {
  const { userAgent, maxTouchPoints } = navigator;

  if (/iPhone|iPad|iPod/i.test(userAgent)) return iosAppUrl;
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return iosAppUrl;
  if (/Android/i.test(userAgent)) return androidAppUrl;

  return undefined;
};
