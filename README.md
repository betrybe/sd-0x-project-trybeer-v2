# Boas vindas ao repositório do projeto TryBeer!

Você já usa o GitHub diariamente para desenvolver os exercícios, certo? Agora, para desenvolver os projetos, você deverá seguir as instruções a seguir. Fique atento a cada passo, e se tiver qualquer dúvida, nos envie por _Slack_! #vqv 🚀

Aqui você vai encontrar os detalhes de como estruturar o desenvolvimento do seu projeto a partir desse repositório, utilizando uma branch específica e um _Pull Request_ para colocar seus códigos.

## O que deverá ser desenvolvido

Esse projeto é uma continuação do projeto `Trybeer`! Ou seja, o _commit_ inicial nesse repositório será todo o projeto que foi desenvolvido por vocês anteriormente. Logo, esse será o ponto de partida de vocês para esse projeto.

Como vocês podem presumir, o grupo continua sendo o mesmo que foi quando vocês desenvolveram o `Trybeer v1`.

Nesse projeto vocês irão desenvolver novas funcionalidades a partir dos conhecimentos adquiridos nos últimos blocos. Além de desenvolver novas funcionalidades, vocês terão também novos desafios, pois algumas demandas farão com que vocês refatorem a arquitetura do projeto.

No projeto `Trybeer v1` vocês utilizaram apenas o banco de dados _MySQL_. Já nesse projeto, vocês terão que utilizar, além do _MySQL_, o _MongoDB_. Vocês verão com mais detalhes nos requisitos do projeto.

Como dito anteriormente, o principal intuito desse projeto é que vocês refatorem alguns pontos do que já foi desenvolvido por vocês, como por exemplo, refatorar o projeto para utilizar o _ORM Sequelize_, para utilizar a abordagem _DDD_, dentre outras coisas. E, como dito anteriormente também, novas features deverão ser adicionadas, como por exemplo, a implementação de um chat para estabelecer uma conversa entre o estabelecimento e a pessoa usuária, dentre outras implementações.

Dito tudo isso, vamos para os requisitos para que vocês tenham maiores detalhes do que deve ser desenvolvido nesse projeto!

Você pode acessar um protótipo do front-end [aqui](https://www.figma.com/file/tzP4txu6Uy0qCxVZWdWMBO/TryBeer?node-id=0%3A1).

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

4. O projeto deve respeitar a estrutura proposta pela abordagem _DDD_. Dito isso, ele deve ser composto por três pastas: `application`, `domain` e `infrastructure`. Atente-se para o objetivo de cada pasta/camada do DDD. A estrutura esperada para a sua aplicação é similar a descrita abaixo. Você pode adicionar mais arquivos, se quiser, contanto que respeite a estrutura.

   ```
   └── application
   │   ├── user
   │   │   └── userController.js
   │   └── ...
   └── domain
   │   ├── user.js
   │   └── ...
   └── infrastructure
   │   └── database
   │   │   └── config
   │   │   │   └── config.json
   │   │   └── migrations
   │   │   │   ├── [timestamp]-create-user-table.js
   │   │   │   └── ...
   │   │   └── models
   │   │   │   ├── index.js
   │   │   │   ├── User.js
   │   │   │   └── ...
   │   │   └── seeders
   │   │   │   ├── [timestamp]-create-first-user.js
   │   │   │   └── ...
   │   └── user
   │   │   ├── UserMapper.js
   │   │   └── UserRepository.js
   │   └── ...
   ```

5. Crie quantos `seeders` e quantas `migrations` quiser. Porém, lembre-se de criar todas as `migrations` necessárias para que o projeto seja gerado 100% funcional utilizando o banco de dados arquitetado por você. O arquivo `.sql`, contendo as _queries_ de criação/configuração do banco, não será mais necessário, visto que o projeto passará a utilizar `migrations` e `seeders`. Estes devem, portanto, ser removidos.

### Bônus

### Testes

6. A cobertura de testes unitários do front-end deve ser de, no mínimo, 90%.

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

### DEPOIS DE TERMINAR O DESENVOLVIMENTO

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
