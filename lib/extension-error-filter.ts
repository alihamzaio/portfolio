/** Inline script — runs before React so wallet extensions cannot trip the Next.js dev overlay. */
export const extensionErrorFilterScript = `
(function () {
  function isExtensionNoise(reason) {
    var msg =
      typeof reason === "string"
        ? reason
        : reason && reason.message
          ? String(reason.message)
          : String(reason || "");
    var stack = (reason && reason.stack) || "";
    return (
      /failed to connect to metamask/i.test(msg) ||
      /metamask/i.test(msg) ||
      /chrome-extension:\\/\\//i.test(stack) ||
      /moz-extension:\\/\\//i.test(stack)
    );
  }

  window.addEventListener("unhandledrejection", function (event) {
    if (isExtensionNoise(event.reason)) event.preventDefault();
  });

  window.addEventListener(
    "error",
    function (event) {
      if (isExtensionNoise(event.error) || /chrome-extension:\\/\\//i.test(event.filename || "")) {
        event.preventDefault();
      }
    },
    true
  );
})();
`.trim()
