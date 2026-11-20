# Memória do projeto

## Preferências de colaboração

- Antes de editar, informar o entendimento do pedido e o plano de alterações.
- Pedir esclarecimentos quando informações ausentes puderem mudar materialmente a solução.
- Sugerir boas práticas e alternativas de organização quando forem úteis.
- Sempre perguntar antes de ALTERAR QUALQUER DOCUMENTO OU ARQUIVO

## Estrutura e interface

- A página inicial ativa é `index.html`; `index_old.html` preserva a versão anterior.
- As páginas estão organizadas em `pages/acomodacoes/`, `pages/hospedes/` e `pages/contatos/`.
- O guia do hóspede começa em `pages/hospedes/index.html`.
- O centralizador de hóspedes lista alimentação, pontos turísticos e atividades; o acesso à acomodação fica no menu principal.
- A identidade visual aprovada é "pôr do sol": azul-noite, terracota, dourado e creme, fonte sem serifa, cantos arredondados e ícones SVG próprios (sem Font Awesome); as páginas compartilham `css/styles.css`.
- A página inicial tem topo com foto e degradê; as páginas internas usam uma faixa escura menor (breadcrumbs + introdução), sem foto.
- O cabeçalho compartilhado mostra a marca à esquerda e links em linha (Acomodações, Hóspedes, Balsa, Contato); no celular vira botão ☰ com lista estilo app.
- No celular, só os cards de navegação (página inicial e guia do hóspede) viram lista estilo app; cards de conteúdo continuam como cards.
- O rodapé é enxuto: marca, frase genérica sobre as hospedagens e apenas o WhatsApp. O site terá várias pousadas, então textos gerais não devem citar só o estúdio.
- `index_old.html` com `css/teste_old.css` é a página de teste da identidade visual e deve ser mantida.
