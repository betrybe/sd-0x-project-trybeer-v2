# Boas vindas ao repositório do projeto TryBeer v2!

Você já usa o GitHub diariamente para desenvolver os exercícios, certo? Agora, para desenvolver os projetos, você deverá seguir as instruções a seguir. Fique atento a cada passo, e se tiver qualquer dúvida, nos envie por _Slack_! #vqv 🚀

Aqui você vai encontrar os detalhes de como estruturar o desenvolvimento do seu projeto a partir desse repositório, utilizando uma branch específica e um _Pull Request_ para colocar seus códigos.

## O que deverá ser desenvolvido

Esse projeto é uma continuação do projeto `Trybeer`! Ou seja, o _commit_ inicial nesse repositório será todo o projeto que foi desenvolvido por vocês anteriormente. Logo, esse será o ponto de partida de vocês para esse projeto.

O grupo continua sendo o mesmo que foi quando vocês desenvolveram o `Trybeer v1`.

Nesse projeto vocês irão desenvolver novas funcionalidades a partir dos conhecimentos adquiridos nos últimos blocos. Além de desenvolver novas funcionalidades, vocês terão também novos desafios, pois algumas demandas farão com que vocês refatorem a arquitetura do projeto.

No projeto `Trybeer v1` vocês utilizaram apenas o banco de dados _MySQL_. Já nesse projeto além do _MySQL_, vocês terão que utilizar o _MongoDB_. Vocês verão com mais detalhes nos requisitos do projeto.

O principal intuito desse projeto é que vocês refatorem alguns pontos do que já foi desenvolvido por vocês. A intenção é refatorar o projeto para, por exemplo, utilizar o _ORM Sequelize_, utilizar a abordagem _DDD_, dentre outras coisas. Novas features deverão ser adicionadas como, por exemplo, a implementação de um chat para estabelecer uma conversa entre o estabelecimento e a pessoa usuária, dentre outras implementações.

Dito tudo isso, vamos para os requisitos para que vocês tenham maiores detalhes do que deve ser desenvolvido nesse projeto!

Você pode acessar um protótipo do front-end [aqui](https://www.figma.com/file/dRYG01MdRnxQr6nlp1wT2o/Trybeer-v2?node-id=0%3A1).

Para servir arquivos estáticos como imagens no back-end, utilize o seguinte path:
`/back-end/public/`

##### ⚠️ Lembre-se de escrever testes unitários e sinta-se livre para alterar a UI. Contudo, respeite os atributos `data-testid`, pois eles serão usados na correção do projeto.

Você pode ler mais sobre os atributos que serão utilizados para testes [neste link](https://www.eduardopedroso.com.br/?p=494).

##### ⚠️ Para ver os comentários sobre cada componente, basta clicar no ícone de comentários no Figma (lado esquerdo superior).

![image](https://res.cloudinary.com/drdpedroso/image/upload/c_scale,w_400/v1575815877/Screenshot_2019-12-08_at_11.37.25_kzt7rl.png)

---

## Desenvolvimento

Esse repositório deve conter, como dito anteriormente, o código desenvolvido por vocês no primeiro projeto `Trybeer`. Após clonar o projeto, faça o _commit_ inicial com todo o código do projeto e comece o desenvolvimento dos requisitos a partir dele.

Para o banco de dados, você deverá utilizar o `MySQL` e o `MongoDB`. Modele-os e utilize, para o `MySQL`, as funcionalidades do _Sequelize_ para que o seu projeto seja corrigido utilizando o banco de dados arquitetado por você!

##### Você também deve **escrever testes unitários que devem cobrir pelo menos 90% do projeto**. Na [documentação do Jest CLI](https://jestjs.io/docs/en/cli) é possível ver como essa cobertura é coletada.

## Requisitos do projeto

⚠️ Lembre-se de que o seu projeto só será avaliado se estiver passando pelos _checks_ do **CodeClimate** e se estiver, também, seguindo corretamente os padrões REST para rotas e DDD para o back-end. Além disso, você deve utilizar das `migrations` e dos `seeders` para a criação do seu banco de dados, das tabelas e inserção de dados iniciais.

O intuito desse app é que uma pessoa possa pedir uma cerveja no aplicativo e outra pessoa possa aceitar esse pedido no **admin**.

⚠️ **Dica**: Ao refatorar e adicionar funcionalidades, não se esqueça de que está respeitando os princípios do SOLID. Atente-se a implementação dos princípios sempre que tiver fazendo alguma alteração no código.

##### O projeto sera composto por duas entregas, cada uma especificada abaixo com seus respectivos requisitos e o prazo decidido com a facilitação.

## Requisitos do projeto

### Testes

1. A cobertura de testes unitários do back-end deve ser de, no mínimo, 90%.

### Abordagem DDD e Sequelize

2. A lógica da regra de negócio da aplicação deve estar centralizada no back-end, ou seja, na API `Node.js`. Com isso, o único lugar que deve conter a lógica será o back-end: o banco de dados e front-end **não devem** conter lógicas de regra de negócio. Ou seja, muito cuidado ao utilizar _triggers_, _procedures_, dentre outras, e muito cuidado com regras de negócio no front-end.

3. O projeto deve passar a utilizar o _ORM Sequelize_ ao invés do driver do _MySQL_.

4. Crie quantos `seeders` e quantas `migrations` quiser. Porém, lembre-se de criar todas as `migrations` necessárias para que o projeto seja gerado 100% funcional utilizando o banco de dados arquitetado por você. O arquivo `.sql`, contendo as _queries_ de criação/configuração do banco, não será mais necessário, visto que o projeto passará a utilizar `migrations` e `seeders`. Estes devem, portanto, ser removidos.

### Status do pedido

5. Todo pedido realizado deve ter um status referente ao seu progresso atual.

8. Os _status_ do pedido devem ser os seguintes:

   - `Pendente` logo quando o pedido for criado;

   - `Preparando` quando o pedido for iniciado pelo usuário admin;

   - `Entregue` quando o pedido terminar.

9. O usuário admin deve ter o controle de alterar o status do pedido. Lembre-se de seguir princípio `Open/Closed` de _SOLID_ para está implementação de forma que possam ser acrescentados novos comportamentos e `status` sem impactar os status já existentes.

10. Qualquer atualização feita no pedido pelo usuário admin deve se refletir em tempo real para o cliente.

### Funcionalidade de chat, visão de cliente

11. Essa funcionalidade só deve existir na **visão de cliente**

12. A plataforma deve ter acessível, no menu lateral, uma funcionalidade de chat denominada `Conversar com a loja`.

    - Um clique no item descrito como `Conversar com a loja` deve levar para uma página de chat.

13. Na página de chat, as mensagens devem aparecer ordenadas com as mais recentes embaixo.

    - A página deve mostrar as mensagens enviadas e recebidas, com as mensagens mais recentes mais embaixo.

    - A página deve ter um input para envio de nova mensagem ao chat.

14. O nickname de cliente deve ser o email cadastrado.

15. O histórico da conversa deve ser salvo no banco de dados `MondoDB` e aparecer quando a pessoa abre a página.

### Funcionalidade de chat, visão de admin

16. Essa funcionalidade só deve existir na **visão de admin**

17. A plataforma deve ter acessível, no menu lateral, uma funcionalidade de chats denominada `Conversas`.

    - Um clique no botão `Conversas` direciona para uma página que lista todas as conversas da loja.

    - As conversas devem aparecer numa lista. Cada conversa deve ser identificada pelo email da pessoa cliente em questão.

    - Caso não tenham conversas, deve ser exibido o texto "Nenhuma conversa por aqui".

18. Um clique num item da lista de conversas deve exibir na tela o respectivo chat.

    - Um clique em um item da lista deve exibir na tela a janela com o chat daquela conversa.

    - O _nickname_ da loja na conversa deve ser "Loja".

    - A página da conversa deve mostrar, no topo da tela, o email do usuário que a Loja está conversando.

    - A página da conversa deve ter um botão de voltar que ao ser clicado redireciona a pessoa a página de listagem de conversas novamente.

19. O histórico de cada conversa deve ser salvo no banco de dados e aparecer quando a pessoa abre a página.

20. A lista de conversas deve ser ordenada pela data da última mensagem.

    - A lista de conversas deve ser ordenada pela data da última mensagem (recebida ou enviada), as mais recentes no topo da lista.

## Bônus

### Funcionalidade de chat, visão de admin: envio de mensagens em broadcast

21. Essa funcionalidade só deve existir na **visão de admin**

22. Na página de chats deve haver um botão identificado com `Nova linha de transmissão`:

    - Ao clicar no botão, deve-se disponibilizar a lista de conversas disponíveis e, ao lado de cada uma, deve haver uma checkbox;

    - O usuário admin da loja deve ser capaz de selecionar as checkboxes das conversas que quiser e, através de um input, enviar uma mesma mensagem a todas essas conversas ao mesmo tempo;

    - A página deve fazer uma validação para garantir que, no momento desse envio, ao menos uma conversa esteja selecionada.

### Deploy Heroku

23. Faça _scripts bash_ contendo a sequência de comandos necessários para realizar o deploy via Heroku tanto para o **front-end** quanto para o **back-end**. Os scripts devem ter os seguintes nomes:

    - `deploy-front-end.sh`;

    - `deploy-back-end.sh`.

### Monitoramento do Back-End

24. Faça um _script bash_ contendo a sequência de comandos necessários para realizar o monitoramento da `API` via _PM2_. O script deve ter o seguinte nome:

    - `monitoring-run.sh`.

### Testes

25. A cobertura de testes unitários do front-end deve ser de, no mínimo, 90%.

---

## Instruções para entregar seu projeto:

### ANTES DE COMEÇAR A DESENVOLVER:

1. Clone o repositório

- `git clone git@github.com:tryber/trybeer-v2-project.git`.
- Entre na pasta do repositório que você acabou de clonar:
  - `cd trybeer-project`

2. Instale as dependências do front-end e do back-end

- Instale as dependências do front-end e inicie o servidor
  - `cd front-end`
  - `npm install`
  - `npm start` (uma nova página deve abrir no seu navegador com um texto simples)
- Instale as dependências do back-end
  - `cd back-end`
  - `npm install`

3. Crie uma branch a partir da branch `master`

- Verifique que você está na branch `master`
  - Exemplo: `git branch`
- Se não estiver, mude para a branch `master`
  - Exemplo: `git checkout master`
- Agora, crie uma branch onde você vai guardar os `commits` do seu projeto
  - Você deve criar uma branch no seguinte formato: `nome-de-usuário-nome-do-projeto`
  - Exemplo: `git checkout -b joaozinho-trybeer`

5. Adicione as mudanças ao _stage_ do Git e faça um `commit`

- Verifique que as mudanças ainda não estão no _stage_
  - Exemplo: `git status` (deve aparecer listada a pasta _components_ em vermelho)
- Adicione o novo arquivo ao _stage_ do Git
  - Exemplo:
    - `git add .` (adicionando todas as mudanças - _que estavam em vermelho_ - ao stage do Git)
    - `git status` (deve aparecer listado o arquivo _components/Header.jsx_ em verde)
- Faça o `commit` inicial
  - Exemplo:
    - `git commit -m 'iniciando o projeto'` (fazendo o primeiro commit)
    - `git status` (deve aparecer uma mensagem tipo _nothing to commit_ )

6. Adicione a sua branch com o novo `commit` ao repositório remoto

- Usando o exemplo anterior: `git push -u origin joaozinho-trybeer`

7. Crie um novo `Pull Request` _(PR)_

- Vá até a página de _Pull Requests_ do [repositório no GitHub](https://github.com/tryber/trybeer-v2-project/pulls)
- Clique no botão verde _"New pull request"_
- Clique na caixa de seleção _"Compare"_ e escolha a sua branch **com atenção**
- Clique no botão verde _"Create pull request"_
- Adicione uma descrição para o _Pull Request_ e clique no botão verde _"Create pull request"_
- **Não se preocupe em preencher mais nada por enquanto!**
- Volte até a [página de _Pull Requests_ do repositório](https://github.com/tryber/trybeer-v2-project/pulls) e confira que o seu _Pull Request_ está criado

---

### DURANTE O DESENVOLVIMENTO

- ⚠ **LEMBRE-SE DE CRIAR TODOS OS ARQUIVOS DENTRO DA PASTA COM O SEU NOME** ⚠

* Faça `commits` das alterações que você fizer no código regularmente

* Lembre-se de sempre após um (ou alguns) `commits` atualizar o repositório remoto

* Os comandos que você utilizará com mais frequência são:
  1. `git status` _(para verificar o que está em vermelho - fora do stage - e o que está em verde - no stage)_
  2. `git add` _(para adicionar arquivos ao stage do Git)_
  3. `git commit` _(para criar um commit com os arquivos que estão no stage do Git)_
  4. `git push -u nome-da-branch` _(para enviar o commit para o repositório remoto na primeira vez que fizer o `push` de uma nova branch)_
  5. `git push` _(para enviar o commit para o repositório remoto após o passo anterior)_

---

### DEPOIS DE TERMINAR O DESENVOLVIMENTO (OPCIONAL)

Para **"entregar"** seu projeto, siga os passos a seguir:

- Vá até a página **DO SEU** _Pull Request_, adicione a label de _"code-review"_ e marque seus colegas
  - No menu à direita, clique no _link_ **"Labels"** e escolha a _label_ **code-review**
  - No menu à direita, clique no _link_ **"Assignees"** e escolha **o seu usuário**
  - No menu à direita, clique no _link_ **"Reviewers"** e digite `students`, selecione o time `tryber/students-sd-01`

Se ainda houver alguma dúvida sobre como entregar seu projeto, [aqui tem um video explicativo](https://vimeo.com/362189205).

---

### REVISANDO UM PULL REQUEST

⚠⚠⚠

À medida que você e os outros alunos forem entregando os projetos, vocês serão alertados **via Slack** para também fazer a revisão dos _Pull Requests_ dos seus colegas. Fiquem atentos às mensagens do _"Pull Reminders"_ no _Slack_!

Os monitores também farão a revisão de todos os projetos, e irão avaliar tanto o seu _Pull Request_, quanto as revisões que você fizer nos _Pull Requests_ dos seus colegas!!!

Use o material que você já viu sobre [Code Review](https://course.betrybe.com/real-life-engineer/code-review/) para te ajudar a revisar os projetos que chegaram para você.
