const ferryFrame = document.querySelector("[data-ferry-frame]");
const ferryRefreshButton = document.querySelector("[data-ferry-refresh]");
const ferryStatus = document.querySelector("[data-ferry-status]");

if (ferryFrame && ferryRefreshButton && ferryStatus) {
  function showLoadedTime() {
    const loadedAt = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    ferryStatus.textContent = `Painel externo carregado às ${loadedAt}.`;
  }

  ferryFrame.addEventListener("load", showLoadedTime);

  ferryRefreshButton.addEventListener("click", () => {
    ferryStatus.textContent = "Solicitando atualização do painel da AcquaVias…";
    const refreshUrl = new URL(ferryFrame.dataset.source);
    refreshUrl.searchParams.set("monitor_refresh", Date.now().toString());
    ferryFrame.src = refreshUrl.href;
  });
}
