# Keikaku

MVP web em React de um quadro Kanban inspirado em Trello e Planner, com login/cadastro mockado, colunas fixas e movimentacao de cards por arrastar e soltar.

## Tecnologias

- React
- Vite
- JavaScript
- CSS
- HTML

## Funcionalidades do MVP

- Tela 1 com login e cadastro
- Usuario mockado inicial:
  - Nome: Matheus
  - CPF: 12345678910
  - E-mail: xude@email.com
  - Senha: 123456
- Persistencia local com `localStorage`
- Tela 2 com colunas:
  - Product Backlog
  - Sprint Backlog
  - To Do
  - Doing
  - Done
- Criacao de cards por coluna
- Copia de cards de outras colunas pelo botao `+`
- Cards com atividade, responsavel, data de entrega e comentarios opcionais
- Drag and drop entre colunas
- Alertas visuais em `#FFFF00` para cards com entrega hoje ou amanha
- Fonte principal Helvetica
- Tema base em `#FFDBBB`

## Estrutura de pastas

```text
keikaku/
|-- index.html
|-- package.json
|-- vite.config.js
|-- README.md
`-- src/
    |-- App.jsx
    |-- main.jsx
    `-- styles.css
```

## Como rodar localmente

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra no navegador o endereco exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

## Observacoes

- O projeto foi pensado como MVP simples para apresentacao.
- Os dados ficam salvos no navegador e podem ser resetados limpando o `localStorage`.
