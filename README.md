# Otimizador de Produção — Front-end

Front-end em **Vue 3 + TypeScript + Vite** para o sistema de otimização de produção industrial.

## Tecnologias

- **Vue 3** com Composition API (`<script setup>`)
- **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — estilização
- **Axios** — requisições HTTP
- **Lucide Vue** — ícones
- **Vue Router** — roteamento SPA
- **Vitest + Vue Test Utils** — testes unitários
- **vue-i18n** — internacionalização (pt-BR / en)

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm ou yarn

## Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/production-optimizer-front.git
cd production-optimizer-front

# 2. Instale as dependências
npm install

# 3. Configure o backend (opcional)
# Por padrão, o proxy do Vite aponta para https://production-optimizer-back.onrender.com
# Para usar um backend local, edite vite.config.ts:
#   target: 'http://localhost:8080'

# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run test` | Executa os testes unitários |
| `npm run test:coverage` | Executa os testes com relatório de cobertura |

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (AppLayout)
├── i18n/             # Arquivos de internacionalização
│   ├── index.ts      # Configuração do vue-i18n
│   ├── pt-BR.json    # Traduções em português
│   └── en.json       # Traduções em inglês
├── router/           # Configuração de rotas
├── services/         # Serviço de API (axios)
├── views/            # Páginas da aplicação
│   ├── MaterialsView.vue
│   ├── ProductsView.vue
│   └── OptimizationView.vue
└── main.ts           # Entry point
```

## Funcionalidades

- **Matérias-Primas**: CRUD completo (criar, editar, listar, excluir)
- **Produtos**: CRUD completo com composição de matérias-primas
- **Otimização**: Cálculo do plano de produção com maior retorno financeiro
- **Internacionalização**: Interface disponível em pt-BR e en
