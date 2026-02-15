# Italian Pizza

Sistema de pedidos para pizzaria com painel administrativo. Permite pedidos por **mesa**, pedidos para **entrega**, gestão de mesas, cardápio, caixa e pedidos viagem.

---

## Preview

| Área        | Descrição |
|------------|-----------|
| **Cliente – Mesa**  | Escolher mesa, montar pedido por categorias (Pizzas, Bebidas) e enviar. |
| **Cliente – Entrega** | Fluxo em 3 etapas: dados (nome, endereço, telefone), cardápio com observações e pagamento (crédito/débito, PIX ou na entrega). |
| **Admin**   | Login, mesas e pedidos, conferência de caixa, resumo mensal, cardápio e pedidos viagem. |

---

## Tecnologias

- **HTML5** (semântico, acessível)
- **CSS3** (variáveis em `:root`, Tailwind CDN, `form-inputs.css`)
- **JavaScript** (vanilla, sem frameworks)
- **LocalStorage** para persistência (mesas, pedidos, cardápio, caixa, pedidos viagem)
- **Deploy:** estático, compatível com Vercel, Netlify ou qualquer host de arquivos

---

## Como rodar localmente

1. Clone ou baixe o repositório.
2. Coloque a imagem **logo_pizzaria.avif** na **raiz do projeto** (ou em `assets/img/` e ajuste os caminhos nos HTMLs).
3. Sirva a pasta por um servidor HTTP (recomendado para evitar restrições de CORS com LocalStorage):
   - **Script incluído:** execute `iniciar-servidor.bat` (Windows) na raiz do projeto.
   - **Node:** `npx serve .` na raiz.
   - **Python:** `python -m http.server 8080` na raiz.
4. Acesse no navegador:
   - **Raiz:** `http://localhost:8080/` → redireciona para o login do painel.
   - **Cliente – Mesa:** `http://localhost:8080/cliente/pedido.html`
   - **Cliente – Entrega:** `http://localhost:8080/cliente/pedido-casa.html`
   - **Admin – Login:** `http://localhost:8080/admin/login.html`

**Credenciais padrão (apenas desenvolvimento):** `admin@admin.com` / `Admin`

Para os pedidos dos clientes aparecerem no painel, use o **mesmo endereço base** (mesma origem) para as páginas do cliente e do admin.

---

## Deploy

O projeto é estático. Basta fazer upload da pasta ou conectar o repositório a um serviço de deploy:

1. **Vercel / Netlify:** conecte o repositório; não é necessário comando de build.
2. Após o deploy, as URLs serão do tipo:
   - `https://seu-projeto.vercel.app/`
   - `https://seu-projeto.vercel.app/cliente/pedido.html`
   - `https://seu-projeto.vercel.app/cliente/pedido-casa.html`
   - `https://seu-projeto.vercel.app/admin/login.html`

Os dados ficam no **LocalStorage** do navegador; não há backend. Para uso em produção com múltiplos dispositivos e pagamentos reais, use o **CHECKLIST-PRODUCAO.md**.

---

## Estrutura de pastas

```
├── index.html              # Redireciona para admin/login.html
├── README.md
├── CHECKLIST-PRODUCAO.md   # Checklist pré-produção
├── config.js.example       # Exemplo de config (copiar para config.js)
├── .gitignore
├── iniciar-servidor.bat    # Servidor local (Windows)
│
├── assets/
│   └── img/                # Imagens (opcional; logo pode ficar na raiz)
│
├── cliente/
│   ├── pedido.html         # Pedido por mesa
│   └── pedido-casa.html    # Pedido para entrega
│
├── admin/
│   ├── login.html
│   ├── admin.html          # Mesas e pedidos
│   ├── admin-caixa.html    # Conferência de caixa
│   ├── admin-caixa-resumo.html
│   ├── admin-cardapio.html
│   └── admin-pedidos-viagem.html
│
├── css/
│   ├── styles.css          # Estilos globais (admin, etc.)
│   └── form-inputs.css    # Campos de formulário (variáveis :root)
│
├── js/
│   ├── tailwind-config.js
│   ├── data.js             # LocalStorage: mesas, pedidos, cardápio, caixa
│   ├── auth.js             # Proteção do painel e botão Sair
│   ├── login.js            # Validação e redirecionamento do login
│   ├── utils.js            # Sanitização e utilitários
│   ├── pedido.js           # Lógica do pedido na mesa
│   ├── pedido-casa.js      # Lógica do pedido em casa
│   ├── admin.js
│   ├── admin-caixa.js
│   ├── admin-caixa-resumo.js
│   ├── admin-cardapio.js
│   └── admin-pedidos-viagem.js
│
└── logo_pizzaria.avif      # Logo (raiz do projeto)
```

---

## Rotas / páginas

Cada página funciona de forma isolada; as URLs esperadas são:

| Rota | Arquivo | Uso |
|------|---------|-----|
| `/` | `index.html` | Redireciona para login do painel |
| `/cliente/pedido.html` | Pedido por mesa | Cliente escolhe mesa e monta pedido |
| `/cliente/pedido-casa.html` | Pedido entrega | Cliente preenche dados, cardápio e pagamento |
| `/admin/login.html` | Login | Acesso ao painel |
| `/admin/admin.html` | Mesas e pedidos | Após login |
| `/admin/admin-caixa.html` | Conferência de caixa | Após login |
| `/admin/admin-caixa-resumo.html` | Resumo mensal | Após login |
| `/admin/admin-cardapio.html` | Cardápio | Após login |
| `/admin/admin-pedidos-viagem.html` | Pedidos viagem | Após login |

---

## Roadmap futuro

- [ ] Backend (API) e banco de dados
- [ ] Integração com gateway de pagamento
- [ ] Login admin real (sessão/JWT)
- [ ] PWA e notificações para novos pedidos
- [ ] Relatórios e dashboard de vendas

---

## Licença

Uso conforme definido pelo autor do projeto.

---

**Autor:** Yuri Monzini
