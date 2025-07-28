# Projeto de Catálogo e Gerenciamento

Este projeto é uma aplicação web dividida em duas partes principais: um backend API desenvolvido em .NET (C#) e um frontend de gerenciamento construído com React e TypeScript.

## Estrutura do Projeto

O projeto é organizado nas seguintes pastas principais:

-   `CatalogoApi/`: Contém o código-fonte do backend da API, desenvolvido em C#.
-   `gerenciador/`: Contém o código-fonte do frontend da aplicação de gerenciamento, desenvolvido com React e TypeScript.

## Backend (CatalogoApi)

O `CatalogoApi` é uma API RESTful desenvolvida em .NET 8.0, utilizando Entity Framework Core para interação com o banco de dados PostgreSQL. Ele gerencia entidades como filmes, livros e playlists, além de autenticação de usuários.

### Tecnologias Utilizadas

-   .NET 8.0
-   ASP.NET Core
-   Entity Framework Core
-   Npgsql.EntityFrameworkCore.PostgreSQL
-   Microsoft.AspNetCore.Identity.EntityFrameworkCore
-   Swashbuckle.AspNetCore (Swagger/OpenAPI)

### Configuração e Execução do Backend

1.  **Pré-requisitos:**
    * .NET SDK 8.0 ou superior.
    * PostgreSQL.
    * Docker (opcional, para execução via contêineres).

2.  **Configuração do Banco de Dados:**
    * Abra o arquivo `CatalogoApi/appsettings.json` (e `appsettings.Development.json` para ambiente de desenvolvimento).
    * Atualize a string de conexão do PostgreSQL. Um exemplo pode ser:
        ```json
        "ConnectionStrings": {
          "DefaultConnection": "Host=localhost;Port=5432;Database=catalogodb;Username=your_username;Password=your_password"
        }
        ```
        Certifique-se de substituir `your_username` e `your_password` pelas suas credenciais do PostgreSQL.

3.  **Migrações do Banco de Dados:**
    * Navegue até o diretório `CatalogoApi/` no seu terminal.
    * Execute os seguintes comandos para aplicar as migrações e criar o banco de dados:
        ```bash
        dotnet ef database update
        ```

4.  **Execução da Aplicação:**
    * No diretório `CatalogoApi/`, execute:
        ```bash
        dotnet run
        ```
    * A API estará disponível em `https://localhost:7077` (ou a porta configurada no `Properties/launchSettings.json`).
    * A documentação Swagger estará disponível em `https://localhost:7077/swagger`.

### Endpoints da API

A API expõe endpoints para gerenciamento de:

-   **Autenticação:** Registro e login de usuários.
-   **Filmes:** CRUD (Create, Read, Update, Delete) de filmes.
-   **Livros:** CRUD de livros.
-   **Playlists:** CRUD de playlists e associação com filmes/livros.

## Frontend (gerenciador)

O `gerenciador` é uma aplicação web SPA (Single Page Application) construída com React e TypeScript, utilizando Vite para um ambiente de desenvolvimento rápido e Tailwind CSS para estilização. Ele fornece uma interface para interagir com a API do backend.

### Tecnologias Utilizadas

-   React 19.x
-   TypeScript 5.x
-   Vite 7.x
-   Tailwind CSS 3.x
-   Axios (para requisições HTTP)
-   Lucide React (ícones)
-   ESLint (com regras para React e TypeScript)

### Configuração e Execução do Frontend

1.  **Pré-requisitos:**
    * Node.js (versão recomendada: >=18).
    * npm ou Yarn.

2.  **Instalação de Dependências:**
    * Navegue até o diretório `gerenciador/` no seu terminal.
    * Execute:
        ```bash
        npm install
        # ou yarn install
        ```

3.  **Configuração da API:**
    * Abra o arquivo `gerenciador/src/services/api.ts`.
    * Certifique-se de que a `baseURL` esteja apontando para o endereço da sua API backend (ex: `https://localhost:7077`).

4.  **Execução da Aplicação:**
    * No diretório `gerenciador/`, execute:
        ```bash
        npm run dev
        # ou yarn dev
        ```
    * A aplicação frontend estará disponível em `http://localhost:5173` (ou a porta configurada no `vite.config.ts`).

### Estrutura do Frontend

-   `src/components/`: Contém componentes reutilizáveis da UI (botões, inputs, modais, cards, etc.) e formulários específicos (ClientForm, CommentForm, ProjectForm, TaskForm).
-   `src/context/`: Inclui contextos da aplicação como `AppContext.tsx` e `AuthContext.tsx` para gerenciamento de estado global e autenticação.
-   `src/data/`: Pode conter dados mockados para desenvolvimento (`mockData.ts`).
-   `src/services/`: Contém a configuração da instância do Axios para a comunicação com a API (`api.ts`).
-   `src/types/`: Define as interfaces TypeScript para as entidades da aplicação (`index.ts`).
-   `src/utils/`: Contém utilitários como `cookies.ts`.
-   `src/views/`: Contém as principais visualizações/páginas da aplicação (ClientsView, LoginView, ProjectDetailsView, RegisterView).

## ESLint e Padronização de Código

O projeto vem pré-configurado com ESLint para garantir a padronização e qualidade do código, especialmente para TypeScript e React. As configurações estendem as regras recomendadas e incluem plugins específicos para React.

Para estender as regras do ESLint, você pode modificar o `gerenciador/eslint.config.js` conforme as sugestões no `gerenciador/README.md` original, incluindo regras `type-aware` e plugins `eslint-plugin-react-x` e `eslint-plugin-react-dom`.

```javascript
// Exemplo de configuração avançada do ESLint (já presente no README original)
// eslint.config.js
import tseslint from 'typescript-eslint';
import globalIgnores from 'eslint-plugin-react-x/configs/globals-ignores'; // Importação sugerida no README original
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Outras configurações...

      // Remove tseslint.configs.recommended e substitui por isso
      ...tseslint.configs.recommendedTypeChecked,
      // Alternativamente, use isso para regras mais estritas
      ...tseslint.configs.strictTypeChecked,
      // Opcionalmente, adicione isso para regras estilísticas
      ...tseslint.configs.stylisticTypeChecked,

      // Ativar regras de lint para React
      reactX.configs['recommended-typescript'],
      // Ativar regras de lint para React DOM
      reactDom.configs.recommended,

      // Outras configurações...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // outras opções...
    },
  },
]);
