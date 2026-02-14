# Italian Pizza – Sistema de Pedidos

Sistema completo de pedidos para pizzaria: pedidos por **mesa**, pedidos para **entrega (viagem)**, painel administrativo com **login**, **caixa**, **cardápio** e **pedidos viagem**. Interface em HTML, CSS (Tailwind) e JavaScript, com dados persistidos em **LocalStorage**.

---

## Funcionalidades

### Para o cliente

| Página | Descrição |
|--------|------------|
| **Pedido na mesa** (`pedido.html`) | Cliente escolhe a mesa, monta o pedido no cardápio e envia. Os pedidos aparecem no painel por mesa. |
| **Pedido em casa** (`pedido-casa.html`) | Fluxo em 3 etapas: (1) Dados (nome, rua, número, CEP, telefone), (2) Cardápio + observações, (3) Pagamento (crédito/débito online, PIX ou pagamento na entrega). Pedidos vão para a tela **Pedidos viagem** no painel. |

### Para o administrador (após login)

| Página | Descrição |
|--------|------------|
| **Login** (`login.html`) | Acesso ao painel com e-mail e senha (credenciais abaixo). |
| **Mesas e Pedidos** (`admin.html`) | Cadastro de mesas (adicionar, editar, apagar), visualização da conta por mesa, impressão da conta e registro de **conta paga** (valor recebido, forma: débito/crédito/PIX). Mesas com pedido em aberto não podem ser editadas nem excluídas. |
| **Conferência de Caixa** (`admin-caixa.html`) | Fluxo de caixa por dia, lista de todos os pagamentos (mesa e pedido viagem) e botão **Fechar caixa** para registrar o total do dia. |
| **Resumo mensal** (`admin-caixa-resumo.html`) | Total por dia (após fechar o caixa) e total por mês para conferência. |
| **Cardápio** (`admin-cardapio.html`) | Cadastro e edição de itens do cardápio (nome, descrição, categoria, preço). |
| **Pedidos viagem** (`admin-pedidos-viagem.html`) | Lista de pedidos de entrega: itens, endereço, forma de pagamento, observações. Para pedidos **já pagos** (online): **Dar baixa** (lança no caixa e remove da lista). Para **pagamento na entrega**: botão **Pago** (quando o entregador volta, marca como pago e dá baixa no caixa). |

---

## Acesso ao painel

- **URL:** a mesma do site + `/login.html` (ex.: `https://seu-dominio.vercel.app/login.html`).
- **E-mail:** `admin@admin.com`
- **Senha:** `Admin`  
A sessão usa `sessionStorage` (ao fechar o navegador, é necessário fazer login novamente).

---

## Tecnologias

- **HTML5**
- **Tailwind CSS** (via CDN) nas telas do cliente e do painel
- **JavaScript** (vanilla), sem frameworks
- **LocalStorage** para persistência (mesas, pedidos, pagamentos, cardápio, fechamentos de caixa, pedidos viagem)

---

## Estrutura do projeto

```
├── index.html              # Redireciona para login.html
├── login.html              # Tela de login do painel
├── pedido.html             # Pedido por mesa (clientes)
├── pedido-casa.html        # Pedido para entrega (clientes)
├── admin.html              # Painel: mesas e pedidos
├── admin-caixa.html        # Conferência de caixa
├── admin-caixa-resumo.html # Resumo mensal (caixa fechado)
├── admin-cardapio.html     # Cadastro do cardápio
├── admin-pedidos-viagem.html # Pedidos de entrega
├── logo_pizzaria.avif      # Logo (raiz do projeto)
├── css/
│   └── styles.css          # Estilos globais (admin legado)
├── js/
│   ├── data.js             # LocalStorage: mesas, pedidos, pagamentos, cardápio, fechamentos, pedidos viagem
│   ├── auth.js             # Proteção de rotas do painel (redirect para login)
│   ├── pedido.js           # Lógica do pedido por mesa
│   ├── pedido-casa.js      # Lógica do pedido em casa (dados, cardápio, pagamento)
│   ├── admin.js            # Mesas, conta, imprimir, registrar pagamento
│   ├── admin-caixa.js      # Conferência de caixa, fechar caixa
│   ├── admin-caixa-resumo.js # Resumo mensal
│   ├── admin-cardapio.js   # CRUD do cardápio
│   └── admin-pedidos-viagem.js # Lista e dar baixa em pedidos viagem
└── README.md
```

---

## Como rodar localmente

1. **Servidor local (recomendado)**  
   Na pasta do projeto:
   ```bash
   npx serve
   ```
   Ou use a extensão **Live Server** no VS Code. Acesse pela URL exibida (ex.: `http://localhost:3000`).

2. **Páginas de cliente** (use a **mesma origem** do painel para os dados aparecerem):
   - Pedido na mesa: `http://localhost:3000/pedido.html`
   - Pedido em casa: `http://localhost:3000/pedido-casa.html`

3. **Painel:**  
   `http://localhost:3000/` ou `http://localhost:3000/login.html` → login com `admin@admin.com` / `Admin`.

---

## Deploy (Vercel ou outro host estático)

- Suba **toda a pasta** do projeto (incluindo `css/`, `js/` e `logo_pizzaria.avif`).
- Não é necessário comando de build: o projeto é estático (HTML + CSS + JS).

### URLs após o deploy

Sendo `https://seu-projeto.vercel.app` a URL base:

| Uso | URL |
|-----|-----|
| Início (redireciona para login) | `https://seu-projeto.vercel.app/` |
| Login do painel | `https://seu-projeto.vercel.app/login.html` |
| Pedido na mesa (clientes) | `https://seu-projeto.vercel.app/pedido.html` |
| Pedido em casa / entrega (clientes) | `https://seu-projeto.vercel.app/pedido-casa.html` |
| Painel – Mesas e Pedidos | `https://seu-projeto.vercel.app/admin.html` |
| Conferência de Caixa | `https://seu-projeto.vercel.app/admin-caixa.html` |
| Resumo mensal | `https://seu-projeto.vercel.app/admin-caixa-resumo.html` |
| Cardápio | `https://seu-projeto.vercel.app/admin-cardapio.html` |
| Pedidos viagem | `https://seu-projeto.vercel.app/admin-pedidos-viagem.html` |

**Importante:** no mesmo domínio (ex.: Vercel), **pedido**, **pedido-casa** e **painel** compartilham o **LocalStorage**, então os pedidos e o caixa funcionam entre as telas.

---

## Observações importantes

1. **Mesma origem**  
   As páginas de pedido (`pedido.html`, `pedido-casa.html`) e o painel devem ser acessados pelo **mesmo domínio e porta**. Se o cliente abrir por outro endereço (ex.: `file://` ou outro site), os dados não serão os mesmos do painel.

2. **Dados no navegador**  
   Tudo fica no **LocalStorage** do navegador. Não há backend nem banco de dados. Para múltiplos dispositivos ou backup, seria necessário um servidor e banco no futuro.

3. **Logo**  
   O arquivo `logo_pizzaria.avif` deve estar na **raiz** do projeto (junto de `index.html`) para carregar corretamente nas telas.

4. **PIX**  
   O código PIX em `pedido-casa.html` é **exemplo**. Em produção, substitua pelo código real da chave PIX da pizzaria.
