function openMap(tipo) {
  let query = "";

  switch(tipo) {
    case "restaurantes":
      query = "restaurantes perto de mim";
      break;
    case "turismo":
      query = "pontos turísticos perto de mim";
      break;
    case "atividades":
      query = "o que fazer perto de mim";
      break;
  }

  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  window.open(url, "_blank");
}
