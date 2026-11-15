# Instruções do projeto

## Colaboração

- Antes de alterar arquivos, explique brevemente o que entendeu e quais mudanças pretende fazer.
- Se faltar informação que possa mudar o escopo ou a solução, faça perguntas objetivas antes de executar essa parte.
- Quando ajudar, apresente boas práticas e alternativas de organização junto com a recomendação.
- Não repita perguntas já respondidas nesta conversa ou registradas em `agents/memory.md`.
- Preserve alterações existentes fora do escopo solicitado.
- Ao concluir, resuma as mudanças e informe as verificações realizadas.

## Desenvolvimento

- Leia a estrutura e os arquivos relacionados antes de editar; mantenha as mudanças restritas ao pedido.
- Este é um site estático. Preserve a navegação por HTML, a responsividade e a acessibilidade sem introduzir dependências desnecessárias.
- Use `css/styles.css` como folha de estilos compartilhada. Adicione CSS específico de página somente quando houver uma necessidade real e documente ou vincule essa folha no HTML correspondente.
- Use HTML semântico, nomes de classe consistentes e caminhos relativos compatíveis com a pasta de cada página.
- Mantenha os componentes compartilhados em `components/` e carregue-os pelo mecanismo existente em `js/include.js`.
- Não execute testes automatizados, a menos que o usuário peça. Faça verificações estáticas adequadas ao escopo, como caminhos locais e `git diff --check`.

## Memória do projeto

- Consulte `agents/memory.md` quando a tarefa depender de preferências ou decisões anteriores do projeto.
- Acrescente à memória apenas preferências duradouras ou decisões de projeto confirmadas pelo usuário. Não registre detalhes transitórios de tarefas.
- Mantenha a memória curta, organizada por tópicos e atualizada quando uma decisão anterior mudar.
