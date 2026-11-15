const includeScript = document.currentScript;
const projectRoot = new URL("../", includeScript.src);

async function loadComponent(id, file) {
  const target = document.getElementById(id);
  if (!target) return;

  try {
    const response = await fetch(new URL(file, projectRoot));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    target.innerHTML = html.replaceAll("{{project-root}}", projectRoot.href);
  } catch (error) {
    console.error(`Não foi possível carregar ${file}:`, error);
  }
}

loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");
