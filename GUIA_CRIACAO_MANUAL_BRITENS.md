# 🛠️ GUIA DE CRIAÇÃO MANUAL - MODELO BRITENS LC

## ⚠️ Token Inválido - Criação Manual Necessária

O token de API está retornando erro 401. Para criar o modelo de prescrição, siga este guia passo a passo.

---

## 📋 OPÇÃO 1: Via Interface Web (Recomendado)

### Passo 1: Acesse o Ninsaúde Clinic
1. Faça login no sistema Ninsaúde Clinic
2. Vá em **Menu → Configurações**

### Passo 2: Acesse Modelos de Documentos
1. Clique em **Modelos de Documentos** (ou **Templates**)
2. Clique em **Novo Modelo** ou **Cadastrar**

### Passo 3: Preencha os Campos

**Informações Básicas:**
- **Título:** `Modelo BRITENS LC - Uso Contínuo Noturno`
- **Tipo:** `Prescrição Médica` (ou tipo 3)
- **Status:** `Ativo` ✅
- **Profissionais:** Selecione os oftalmologistas que usarão

**Conteúdo/Texto do Modelo:**
```
BRITENS LC - SOLUÇÃO OFTÁLMICA ESTÉRIL

POSOLOGIA:
Instilar 1 (uma) gota no(s) olho(s) afetado(s), 1 vez ao dia, à noite (ao deitar).

DURAÇÃO DO TRATAMENTO:
Uso contínuo conforme necessidade

VIA DE ADMINISTRAÇÃO:
Tópica ocular (Colírio)

INDICAÇÃO:
Tratamento de Síndrome do Olho Seco
Lubrificação e umectação da superfície ocular

ORIENTAÇÕES AO PACIENTE:
- Lavar as mãos antes de aplicar
- Não encostar a ponta do frasco no olho
- Aguardar pelo menos 15 minutos entre aplicações de diferentes colírios
- Aplicar preferencialmente à noite antes de dormir
- Fechar bem o frasco após o uso
- Manter em temperatura ambiente
- Validade após abertura: conforme bula

OBSERVAÇÕES:
Em caso de irritação persistente ou reações adversas, suspender o uso e
contatar o médico oftalmologista.

Este medicamento deve ser utilizado conforme prescrição médica.
```

### Passo 4: Salvar
1. Clique em **Salvar** ou **Cadastrar**
2. Verifique se aparece a mensagem de sucesso
3. O modelo estará disponível para uso imediato

---

## 📋 OPÇÃO 2: Via API (Quando Token Válido)

### Requisição HTTP:
```http
POST /v1/configuracao_documentomodelo
Authorization: Bearer {seu_access_token_valido}
Content-Type: application/json
```

### Body (JSON):
Use o arquivo `britens-prescription-model.json` criado neste projeto:
```bash
cat britens-prescription-model.json
```

Ou copie este JSON:
```json
{
  "titulo": "Modelo BRITENS LC - Uso Contínuo Noturno",
  "tipo": 3,
  "ativo": 1,
  "note": "BRITENS LC - SOLUÇÃO OFTÁLMICA ESTÉRIL\n\nPOSOLOGIA:\nInstilar 1 (uma) gota no(s) olho(s) afetado(s), 1 vez ao dia, à noite (ao deitar).\n\nDURAÇÃO DO TRATAMENTO:\nUso contínuo conforme necessidade\n\nVIA DE ADMINISTRAÇÃO:\nTópica ocular (Colírio)\n\nINDICAÇÃO:\nTratamento de Síndrome do Olho Seco\nLubrificação e umectação da superfície ocular\n\nORIENTAÇÕES AO PACIENTE:\n- Lavar as mãos antes de aplicar\n- Não encostar a ponta do frasco no olho\n- Aguardar pelo menos 15 minutos entre aplicações de diferentes colírios\n- Aplicar preferencialmente à noite antes de dormir\n- Fechar bem o frasco após o uso\n- Manter em temperatura ambiente\n- Validade após abertura: conforme bula\n\nOBSERVAÇÕES:\nEm caso de irritação persistente ou reações adversas, suspender o uso e contatar o médico oftalmologista.\n\nEste medicamento deve ser utilizado conforme prescrição médica."
}
```

### Usando cURL:
```bash
curl -X POST https://api.ninsaude.com/v1/configuracao_documentomodelo \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @britens-prescription-model.json
```

### Usando Postman:
1. Importe a coleção `Ninsaúde Clinic.postman_collection (2).json`
2. Vá em **MODELOS DE DOCUMENTOS → SALVAR OBJETOS**
3. Cole o JSON do arquivo `britens-prescription-model.json`
4. Execute a requisição

---

## 🔑 Como Obter Token Válido

### Método 1: Via Interface Web
1. Faça login no Ninsaúde Clinic
2. Vá em **Configurações → Integrações → API**
3. Clique em **Gerar Novo Token**
4. Copie o `access_token` e/ou `refresh_token`
5. Use imediatamente (válido por 15 minutos)

### Método 2: Via MCP Server
O MCP Server (`ninsaude-mcp-server`) gerencia tokens automaticamente.
Configure o `.env` e use as ferramentas disponíveis.

---

## ✅ Verificação do Modelo

### Após Criar:
1. Vá em **Modelos de Documentos**
2. Procure por "BRITENS LC"
3. Verifique se está **Ativo** ✅
4. Teste em um prontuário:
   - Crie/abra prontuário de teste
   - Selecione "Adicionar Prescrição"
   - Procure o modelo "BRITENS LC"
   - Verifique se o texto aparece corretamente

---

## 📊 Uso do Modelo

### Em Prontuário:
1. Abra o prontuário do paciente
2. Vá em **Prescrição** ou **Documentos**
3. Clique em **Novo Documento** → **Prescrição**
4. Selecione **Modelo: BRITENS LC - Uso Contínuo Noturno**
5. O texto será preenchido automaticamente
6. Ajuste se necessário (nome do paciente, data, etc.)
7. Salve e/ou imprima

### Associar a Profissionais:
1. Vá em **Configurações → Modelos de Documentos**
2. Edite o modelo BRITENS LC
3. Associe aos profissionais desejados
4. Isso permite acesso rápido no atendimento

---

## 🐛 Solução de Problemas

### Erro 401 - "Não possui acesso"
- **Causa:** Token expirado ou inválido
- **Solução:** Gere novo token via interface web

### Modelo não aparece na lista
- **Causa:** Tipo incorreto ou inativo
- **Solução:** 
  - Verifique se `tipo = 3` (Prescrição)
  - Verifique se `ativo = 1`

### Texto não formatado corretamente
- **Causa:** Quebras de linha (`\n`) não processadas
- **Solução:** Use interface web para melhor formatação

---

## 📁 Arquivos Relacionados

- `britens-prescription-model.json` - JSON pronto para importação
- `MODELO_PRESCRICAO_BRITENS.md` - Documentação completa
- `create-britens-prescription-template.js` - Script automatizado

---

## 💡 Dicas

1. **Teste antes de usar em produção:**
   - Crie prontuário de teste
   - Verifique formatação
   - Confirme informações

2. **Personalize conforme necessário:**
   - Adicione logo da clínica
   - Ajuste orientações ao paciente
   - Inclua informações de contato

3. **Mantenha atualizado:**
   - Revise periodicamente
   - Atualize conforme novas orientações
   - Considere feedback dos profissionais

---

**Criado em:** 14/02/2026  
**Última atualização:** 14/02/2026  
**Status:** Aguardando criação manual (token inválido)
