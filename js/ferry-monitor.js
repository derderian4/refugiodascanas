const ferryApiUrl = "https://acquavias.com.br/wp-json/wp/v2/pages/2";
const ferryRefreshButton = document.querySelector("[data-ferry-refresh]");
const ferryStatus = document.querySelector("[data-ferry-status]");
const ferryWaitTargets = {
  sao: {
    value: document.querySelector('[data-ferry-wait="sao"]'),
    unit: document.querySelector('[data-ferry-unit="sao"]'),
  },
  ilha: {
    value: document.querySelector('[data-ferry-wait="ilha"]'),
    unit: document.querySelector('[data-ferry-unit="ilha"]'),
  },
};

function formatWait(rawValue, target) {
  const text = rawValue.trim();
  const minutes = text.match(/(\d+)\s*(?:min(?:utos?)?)/i);

  if (!text) {
    target.value.textContent = "Indisponível";
    target.unit.textContent = "";
    return;
  }

  if (minutes) {
    target.value.textContent = minutes[1];
    target.unit.textContent = "min";
    return;
  }

  target.value.textContent = text;
  target.unit.textContent = "";
}

function markUnavailable() {
  Object.values(ferryWaitTargets).forEach((target) => {
    target.value.textContent = "Indisponível";
    target.unit.textContent = "";
  });
}

async function updateFerryWait() {
  if (!ferryRefreshButton || !ferryStatus || ferryRefreshButton.disabled) return;

  ferryRefreshButton.disabled = true;
  ferryStatus.textContent = "Consultando os dados da AcquaVias…";
  ferryStatus.classList.remove("is-error");

  try {
    const requestUrl = new URL(ferryApiUrl);
    requestUrl.searchParams.set("_fields", "content");
    requestUrl.searchParams.set("_", Date.now().toString());

    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const pageData = await response.json();
    const page = new DOMParser().parseFromString(pageData.content.rendered, "text/html");
    const waits = [...page.querySelectorAll(".aqv-tempo-dinamico__valor")];

    if (waits.length < 2) throw new Error("Tempos de espera não encontrados na resposta.");

    // A página da operadora apresenta primeiro São Sebastião e depois Ilhabela.
    formatWait(waits[0].textContent, ferryWaitTargets.sao);
    formatWait(waits[1].textContent, ferryWaitTargets.ilha);

    const checkedAt = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    ferryStatus.textContent = `Última consulta: ${checkedAt}. Atualização automática a cada 2 minutos.`;
  } catch (error) {
    markUnavailable();
    ferryStatus.textContent = "Não foi possível consultar a fonte agora. Tente atualizar ou abra a página da AcquaVias.";
    ferryStatus.classList.add("is-error");
    console.error("Falha ao consultar os tempos da balsa:", error);
  } finally {
    ferryRefreshButton.disabled = false;
  }
}

ferryRefreshButton?.addEventListener("click", updateFerryWait);
updateFerryWait();
window.setInterval(() => {
  if (!document.hidden) updateFerryWait();
}, 120_000);

document.querySelectorAll("[data-camera-select]").forEach((select) => {
  select.addEventListener("change", () => {
    const frame = select.closest(".ferry-camera")?.querySelector("[data-camera-frame]");
    if (!frame) return;

    const cameraUrl = new URL("https://acquastream.i9ia.io/turismo/camera.html");
    cameraUrl.searchParams.set("f", select.value);
    frame.src = cameraUrl.href;
    frame.title = `Câmera ${select.selectedIndex + 1} da fila em ${select.getAttribute("aria-label").replace("Câmera de ", "")}`;
  });
});
