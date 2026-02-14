# Italian Pizza

Sistema de pedidos para pizzaria com painel administrativo. Permite pedidos por **mesa**, pedidos para **entrega**, gestão de mesas, cardápio, caixa e pedidos viagem.

---

## Demonstração

Após publicar o projeto (ex.: Vercel), use os mesmos endereços base para cliente e admin:

| Página | URL (exemplo) |
|--------|----------------|
| **Cliente – Pedido na mesa** | `https://seu-dominio.vercel.app/cliente/pedido.html` |
| **Cliente – Pedido entrega** | `https://seu-dominio.vercel.app/cliente/pedido-casa.html` |
| **Admin – Login** | `https://seu-dominio.vercel.app/admin/login.html` |

- **Login:** `admin@admin.com` / `Admin`  
- Sessão em `sessionStorage` (ao fechar o navegador, é necessário fazer login novamente).

---

## Funcionalidades

### Cliente
- **Pedido na mesa:** escolher mesa, montar pedido no cardápio (abas por categoria: Pizzas, Bebidas, etc.) e enviar.
- **Pedido em casa:** fluxo em 3 etapas — dados (nome, endereço, telefone), cardápio com observações e pagamento (crédito/débito online, PIX ou pagamento na entrega). Pedidos aparecem em **Pedidos viagem** no painel.

### Administrador (após login)
- **Mesas e Pedidos:** cadastro de mesas, visualização da conta por mesa, impressão da conta e registro de **conta paga** (débito/crédito/PIX). Mesas com pedido em aberto não podem ser editadas nem excluídas.
- **Conferência de Caixa:** fluxo de caixa por dia, lista de pagamentos (mesa e pedido viagem), botão **Fechar caixa**.
- **Resumo mensal:** totais por dia (após fechar o caixa) e por mês.
- **Cardápio:** cadastro de itens (nome, descrição, categoria, preço), itens exibidos por categoria.
- **Pedidos viagem:** lista de pedidos de entrega; **Dar baixa** para pagos online; **Pago** para pagamento na entrega (registra no caixa e remove da lista).

---

## Tecnologias usadas

- **HTML5**
- **CSS:** Tailwind CSS (CDN)
- **JavaScript** (vanilla), sem frameworks
- **LocalStorage** para persistência (mesas, pedidos, pagamentos, cardápio, fechamentos de caixa, pedidos viagem)
- **Deploy:** configurado para **Vercel**

---

## Estrutura de pastas

```
├── index.html                 # Redireciona para admin/login.html
├── README.md
├── .gitignore
│
├── cliente/
│   ├── pedido.html            # Pedido por mesa
│   └── pedido-casa.html       # Pedido para entrega
│
├── admin/
│   ├── login.html             # Login do painel
│   ├── admin.html             # Mesas e pedidos
│   ├── admin-caixa.html       # Conferência de caixa
│   ├── admin-caixa-resumo.html
│   ├── admin-cardapio.html    # Cadastro do cardápio
│   └── admin-pedidos-viagem.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── tailwind-config.js     # Configuração compartilhada do Tailwind
│   ├── data.js                # LocalStorage: mesas, pedidos, cardápio, caixa, pedidos viagem
│   ├── auth.js                # Proteção do painel e botão Sair
│   ├── login.js               # Validação e redirecionamento do login
│   ├── pedido.js              # Lógica do pedido na mesa
│   ├── pedido-casa.js         # Lógica do pedido em casa
│   ├── admin.js               # Mesas, conta, imprimir, pagamento
│   ├── admin-caixa.js
│   ├── admin-caixa-resumo.js
│   ├── admin-cardapio.js
│   └── admin-pedidos-viagem.js
│
└── assets/
    └── logo_pizzaria.avif     # Logo (coloque o arquivo aqui)
```

---

## Como rodar localmente

1. Clone ou baixe o projeto.
2. Coloque a imagem **logo_pizzaria.avif** na pasta **assets/**.
3. Sirva a pasta por um servidor HTTP (evita problemas de CORS com LocalStorage em alguns navegadores):
   - **VS Code:** extensão "Live Server" e "Open with Live Server" na raiz do projeto.
   - **Node:** `npx serve .` na raiz.
   - **Python:** `python -m http.server 8080` na raiz e acesse `http://localhost:8080`.
4. Acesse:
   - **Cliente (mesa):** `http://localhost:PORT/cliente/pedido.html`
   - **Cliente (entrega):** `http://localhost:PORT/cliente/pedido-casa.html`
   - **Admin:** `http://localhost:PORT/admin/login.html` ou `http://localhost:PORT/` (redireciona para o login).

Para os pedidos dos clientes aparecerem no painel, use o **mesmo endereço base** (mesma origem) para as páginas do cliente e do admin.

---

## Deploy

O projeto está preparado para **Vercel**:

1. Conecte o repositório ao Vercel.
2. Deploy automático a cada push (build não é obrigatório; são arquivos estáticos).
3. Após o deploy, as URLs serão do tipo:
   - `https://seu-projeto.vercel.app/`
   - `https://seu-projeto.vercel.app/cliente/pedido.html`
   - `https://seu-projeto.vercel.app/cliente/pedido-casa.html`
   - `https://seu-projeto.vercel.app/admin/login.html`

Os dados ficam no **LocalStorage** do navegador; não há backend. Para uso em múltiplos dispositivos ou backup, seria necessário um servidor e banco de dados no futuro.

---

## Autor

**Yuri Monzini**
