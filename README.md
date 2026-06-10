# Data Analytics Dashboard

Dashboard interativo para visualizar eventos analíticos em tempo real. Constrói gráficos e métricas de cliques, page views, sessões e chamadas HTTP.

Desenvolvido com **Angular 18** + **Creamy Kit** + **Chart.js**

🌐 **Live:** https://marinellibr.github.io/data-analytics-dashboard

## ✨ Features

- 📊 **4 abas de visualização**: Visão Geral, Sessões, HTTP, Eventos
- 📈 **Gráficos interativos**: Timeline, distribuição de ações, status HTTP, top páginas
- 🔍 **Filtro por aplicação**: Selecione qual app analisar na sidebar
- 🔄 **Dados em tempo real**: Sincroniza com backend via API
- 📱 **Responsivo**: Design adaptativo para desktop, tablet e mobile

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

## 📊 Abas Disponíveis

### Visão Geral
- **Total de eventos** (cliques + page views)
- **Sessões** no período
- **Total de cliques**
- **Carregamentos de página**
- Gráficos: Timeline de eventos, Distribuição cliques vs page views

### Sessões
- **Total de sessões**
- **Tempo médio na página** (segundos)
- **Page views** no período
- Gráficos: Dispositivos, Origem do tráfego, Top páginas

### HTTP
- **Total de chamadas HTTP**
- **Taxa de erros** (requisições 4xx e 5xx)
- **Duração média** de resposta
- Gráficos: Status das respostas, Tempo por endpoint

### Eventos
- Tabela completa de todos os eventos (cliques e page views)
- Gráfico: Top páginas com mais eventos
- Filtro por: tipo de ação, localização, data/hora

## 📦 Dependências

- **Angular 18** - Framework
- **Creamy Kit** - Design System (componentes reutilizáveis)
- **Chart.js** - Biblioteca de gráficos
- **SCSS** - Preprocessador CSS
- **TypeScript** - Linguagem

## 🔄 Fluxo de Dados

```
Dashboard → API Service → Backend (/events, /http-calls, /sessions)
                ↓
        MongoDB (Produção) / JSON (Desenvolvimento)
```

O dashboard faz um único `forkJoin` ao carregar para buscar os 3 collections em paralelo:

```typescript
getAll(): Observable<AnalyticsData> {
  return forkJoin({
    events: this.getEvents(),          // POST /events
    httpCalls: this.getHttpCalls(),    // POST /http-calls
    sessions: this.getSessions()       // POST /sessions
  });
}
```

## 📝 Estrutura

```
src/
├── app/
│   ├── dashboard/
│   │   ├── dashboard.component.ts      # Lógica principal, signals
│   │   ├── dashboard.component.html    # Template (4 abas)
│   │   ├── dashboard.component.scss    # Estilos
│   │   └── components/
│   │       ├── action-chart/           # Gráfico de cliques vs page views
│   │       ├── device-chart/           # Gráfico de dispositivos
│   │       ├── http-status-chart/      # Gráfico de status HTTP
│   │       ├── location-chart/         # Gráfico de páginas top
│   │       ├── referrer-chart/         # Gráfico de origem de tráfego
│   │       ├── response-time-chart/    # Gráfico de tempo por endpoint
│   │       └── timeline-chart/         # Gráfico temporal de eventos
│   ├── models/                         # Interfaces de tipos
│   ├── services/
│   │   └── analytics-api.service.ts    # Chamadas HTTP ao backend
│   ├── app.routes.ts                   # Roteamento (/:appID/dashboard)
│   └── app.config.ts                   # Configuração do app
├── main.ts                             # Entry point
├── index.html                          # HTML base
└── styles.scss                         # Estilos globais
```

## 🚀 Deploy

O projeto é deployado automaticamente no **GitHub Pages** via GitHub Actions a cada push para `main`.

URL: https://marinellibr.github.io/data-analytics-dashboard

## 🧪 Teste Local com Mock Data

Dados de exemplo já estão inclusos via computados signals. Para testar com dados reais:

1. Certifique-se de que o backend está rodando
2. A lib envia eventos para `/events`, `/http-calls`, `/sessions`
3. O dashboard será automaticamente atualizado com os novos dados

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
