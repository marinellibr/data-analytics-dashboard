# Data Analytics Dashboard

Dashboard interativo para visualizar eventos analíticos em tempo real. Constrói gráficos e métricas de cliques, page views, sessões e chamadas HTTP.

Desenvolvido com **Angular 18** + **Creamy Kit** + **Chart.js**

🌐 **Live:** https://marinellibr.github.io/data-analytics-dashboard

## ✨ Features

- 📊 **Eventos por dia**: barras empilhadas por dia, com cores por tipo (clique, page view, HTTP, sessão)
- 🕐 **Distribuição nas 24h**: barras verticais por hora (0–23h) de um dia selecionável
- 👁️ **Mostrar/esconder tipos**: legenda lateral com toggle, compartilhada pelos dois gráficos
- 🔍 **Filtro por aplicação**: dropdown na sidebar, alimentado por `GET /apps`
- 🔄 **Uma chamada por app**: busca tudo (events, http-calls, sessions) via `GET /apps/:appID`
- 📱 **Responsivo**: layout adaptativo para desktop, tablet e mobile

## 🚀 Quick Start

### Requisitos
- Node.js 22+
- npm

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200/`

### Build para Produção

```bash
npm run build
```

Output: `dist/data-analytics-dashboard/browser`

## ⚙️ Configuração

O dashboard busca dados de um backend API:

```typescript
// src/app/services/analytics-api.service.ts
const API_BASE_URL = 'https://data-analytics-backend-two.vercel.app';
```

Para alterar a URL do backend em desenvolvimento:

```bash
# Abrir analytics-api.service.ts e mudar:
const API_BASE_URL = 'http://localhost:3000';
```

## 📊 Visão do dashboard

- **Cards de totais**: total geral + um por tipo (clique, page view, HTTP, sessão)
- **Eventos por dia**: barras empilhadas, um dia por coluna, cores por tipo
- **Distribuição nas 24h**: barras por hora (0–23h) do dia selecionado no dropdown
- **Legenda lateral**: liga/desliga cada tipo; o toggle afeta os dois gráficos ao mesmo tempo

## 📦 Dependências

- **Angular 18** - Framework
- **Creamy Kit** - Design System (componentes reutilizáveis)
- **Chart.js** - Biblioteca de gráficos
- **SCSS** - Preprocessador CSS
- **TypeScript** - Linguagem

## 🔄 Fluxo de Dados

```
Dashboard → API Service → Backend
                            ├─ GET /apps           (lista de apps p/ o dropdown)
                            └─ GET /apps/:appID     (events + http-calls + sessions)
                ↓
        MongoDB (Produção) / JSON (Desenvolvimento)
```

Ao selecionar um app, o dashboard faz **uma única chamada** a `GET /apps/:appID`,
que já devolve as três coleções filtradas pelo `appID`. O serviço normaliza tudo
em uma lista única de atividades (`{ type, timestamp }`):

```typescript
getAppData(appID: string): Observable<AppData> {
  return this.http
    .get<RawAppData>(`${API_BASE_URL}/apps/${encodeURIComponent(appID)}`)
    .pipe(map((raw) => this.normalize(raw))); // events/http/sessions → activities
}
```

## 📝 Estrutura

```
src/
├── app/
│   ├── dashboard/
│   │   ├── dashboard.component.ts      # Lógica: signals, agrupamentos por dia/hora
│   │   ├── dashboard.component.html    # Template (cards + 2 gráficos + legenda)
│   │   ├── dashboard.component.scss    # Estilos
│   │   └── components/
│   │       └── stacked-bar-chart/      # Gráfico de barras empilhadas reutilizável
│   ├── models/
│   │   ├── activity.ts                 # Tipo unificado de atividade + cores
│   │   ├── http-call-event.model.ts
│   │   └── session.model.ts
│   ├── services/
│   │   └── analytics-api.service.ts    # GET /apps e GET /apps/:appID
│   ├── app.routes.ts                   # Roteamento (/:appID/dashboard)
│   └── app.config.ts                   # Configuração do app
├── main.ts                             # Entry point
├── index.html                          # HTML base
└── styles.scss                         # Estilos globais
```

## 🚀 Deploy

O projeto é deployado automaticamente no **GitHub Pages** via GitHub Actions a cada push para `main`.

URL: https://marinellibr.github.io/data-analytics-dashboard

## 🧪 Teste Local

1. Suba o backend (com MongoDB ou storage JSON local)
2. A lib envia eventos para `/events`, `/http-calls`, `/sessions`
3. Selecione o app no dropdown — o dashboard busca via `GET /apps/:appID`

## 📡 Integração com a Lib

Para enviar dados para o dashboard:

```typescript
// Em sua aplicação, instale e use data-analytics-lib:
import { trackClick, trackPageLoad } from 'data-analytics-lib';

trackPageLoad({
  appID: 'minha-app',
  sessionID: 'sess-123',
  location: '/pagina',
  timeOnPage: 5000
});

// O dashboard verá automaticamente em: /minha-app/dashboard
```

## 📄 Licença

ISC
