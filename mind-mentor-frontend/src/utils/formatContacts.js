export const formatWhatsAppNumber = (number) => {
  if (!number) return "N/A";
  try {
    const visiblePart = number.slice(-4);
    const hiddenPart = "*".repeat(number.length - 4);
    return hiddenPart + visiblePart;
  } catch (error) {
    return "N/A";
  }
};

export const formatEmail = (email) => {
  if (!email) return "N/A";
  try {
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return "N/A";
    const visibleLocalPart =
      localPart.charAt(0) + "*".repeat(localPart.length - 1);
    return visibleLocalPart + "@" + domain;
  } catch (error) {
    return "N/A";
  }
};
