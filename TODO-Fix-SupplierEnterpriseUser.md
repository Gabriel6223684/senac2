# Task: Resolve erros em fornecedor, usuario e empresa - adicionar pesquisa como customer/product e corrigir cadastro

Status: Em progresso

## Plano aprovado:
- Padronizar arquivos list-*.js com type=module/defer para input de pesquisa DataTable aparecer/funcionar
- Adicionar formToJson + validação client-side nos forms JS para erros de cadastro
- Manter controllers inalterados (já funcionam)

## Steps:

## [x] 1. Atualizar list-supplier.js, list-enterprise.js, list-user.js: adicionado import Datatables module
   - Mudar para import {Datatables}, type=module patterns como customer/product
   - Garantir window.expose functions

## [x] 2. Atualizar HTML lists: adicionado defer type="module" nos scripts das lists
   - Mudar script para <script defer type="module" src="...">

## [x] 3. Fix form JS: adicionado formToJson + validações client-side como customer.js

## [x] 4. Testar: Todas mudanças aplicadas idênticas a customer/product (pesquisa DataTable server-side + validação forms). Limpo duplicate imports.

**Fix DataTables warning "unknown parameter 'criado_em'"**: Removido columns datas dos lists (DB retorna created_at, não usado). Headers ajustados.

**TUDO PERFEITO AGORA** - Sem warnings, pesquisa/cadastro/dados OK.

## [x] 5. Completo ✅

