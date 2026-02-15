# Checklist – Produção

Use este checklist antes de colocar o sistema em produção real (venda, múltiplos usuários, pagamentos reais).

---

## Backend e dados

- [ ] Conectar banco de dados (substituir LocalStorage por API)
- [ ] Criar API REST (ou GraphQL) para mesas, pedidos, cardápio, caixa, usuários
- [ ] Migrar dados do LocalStorage para o banco (se houver dados de homologação)
- [ ] Configurar variáveis de ambiente (URL da API, chaves) e usar `config.js` (não commitar secrets)

---

## Pagamento e financeiro

- [ ] Integrar gateway de pagamento (ex.: Stripe, Mercado Pago, PagSeguro)
- [ ] Tratar webhooks de confirmação de pagamento
- [ ] Testar fluxo completo: pedido → pagamento → confirmação no painel
- [ ] Definir política de estorno e cancelamento

---

## Autenticação e segurança

- [ ] Criar login admin real (backend: sessão/JWT, senha hasheada)
- [ ] Remover credenciais fixas do front (admin@admin.com / Admin)
- [ ] HTTPS em produção
- [ ] Configurar CORS e headers de segurança (CSP, X-Frame-Options, etc.)
- [ ] Sanitizar e validar todos os inputs no backend (evitar XSS e SQL injection)

---

## Qualidade e testes

- [ ] Testes automatizados (E2E ou unitários) para fluxos críticos
- [ ] Testar em dispositivos móveis e vários navegadores
- [ ] Revisar acessibilidade (leitores de tela, contraste, foco)
- [ ] Testes de carga se houver múltiplos acessos simultâneos

---

## Deploy final

- [ ] Deploy em ambiente de produção (Vercel, Netlify, ou servidor próprio)
- [ ] Configurar domínio e SSL
- [ ] Monitoramento e logs (erros, tempo de resposta)
- [ ] Backup regular do banco de dados
- [ ] Documentar processo de deploy e rollback

---

## Opcional

- [ ] PWA (service worker, instalação no celular)
- [ ] Notificações push para novos pedidos (admin)
- [ ] Relatórios e dashboards (vendas por período, itens mais vendidos)

---

*Atualize este checklist conforme o projeto evoluir.*
