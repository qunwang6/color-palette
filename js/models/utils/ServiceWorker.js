export class ServiceWorker {
  constructor(promptTargetElement) {
    this.targetElement = promptTargetElement;
    this.registerServiceWorker();
  }

  installPromptHandler(promptTargetElement) {
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;

      promptTargetElement.addEventListener("click", (event) => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          deferredPrompt = null;
        });
        this.installPromptNum++;
      });
    });
  }

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./sw.js", { scope: "/", type: "module" })
        .then((reg) => {
          this.installPromptHandler(this.targetElement);
        });
    }
  }
}
