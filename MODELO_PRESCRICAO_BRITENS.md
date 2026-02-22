# 📝 MODELO DE PRESCRIÇÃO - BRITENS LC

## 🎯 Informações do Modelo

**Nome do Modelo:** Modelo BRITENS LC - Uso Contínuo Noturno

---

## 💊 Detalhes da Prescrição

### Medicamento
- **Nome Comercial:** BRITENS LC
- **Princípio Ativo:** Carmelose Sódica (Lágrima artificial)
- **Apresentação:** Solução oftálmica estéril em frasco conta-gotas
- **Laboratório:** Latinofarma

### Posologia
```
1 (uma) gota no(s) olho(s) afetado(s)
1x ao dia - à noite
Uso contínuo
```

### Via de Administração
- **Via:** Tópica Ocular (Colírio)

### Indicação
- Tratamento de Síndrome do Olho Seco
- Lubrificação e umectação ocular
- Alívio do desconforto ocular

---

## 📋 Instruções para Criação do Modelo no Ninsaúde

### Via Interface Web:
1. Acesse o Ninsaúde Clinic
2. Vá em **Configurações → Modelos de Documentos**
3. Clique em **Novo Modelo**
4. Preencha os campos:
   - **Título:** Modelo BRITENS LC - Uso Contínuo Noturno
   - **Tipo:** Prescrição
   - **Ativo:** Sim
   - **Observações:** Modelo padrão para prescrição de BRITENS LC - 1 gota à noite, uso contínuo para tratamento de olho seco

### Via API (JSON):
```json
{
  "titulo": "Modelo BRITENS LC - Uso Contínuo Noturno",
  "tipo": 3,
  "ativo": 1,
  "note": "Modelo padrão para prescrição de BRITENS LC - 1 gota à noite, uso contínuo para tratamento de olho seco"
}
```

**Endpoint:** `POST /v1/configuracao_documentomodelo`

---

## ✍️ Texto Completo da Prescrição

```
PRESCRIÇÃO MÉDICA

Medicamento: BRITENS LC - SOLUÇÃO OFTÁLMICA ESTÉRIL
Laboratório: Latinofarma
Princípio Ativo: Carmelose Sódica

POSOLOGIA:
Instilar 1 (uma) gota no(s) olho(s) afetado(s), 1 vez ao dia, ao deitar.

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

---

## 🔍 Informações Técnicas

### Composição (Carmelose Sódica)
- Agente lubrificante e umectante
- Aumenta a viscosidade da lágrima
- Protege a superfície ocular
- Alivia sintomas de olho seco

### Indicações Clínicas
- ✅ Síndrome do Olho Seco (Ceratite Sicca)
- ✅ Deficiência de lágrimas
- ✅ Ressecamento ocular por fatores ambientais
- ✅ Desconforto por uso de lentes de contato
- ✅ Pós-cirúrgico oftálmico

### Contra-indicações
- ❌ Hipersensibilidade aos componentes da fórmula
- ❌ Infecções oculares ativas sem tratamento

---

## 🔄 Renovação do Token de Acesso

**IMPORTANTE:** O script criado (`create-britens-prescription-template.js`)  precisa de um token de acesso válido.

### Como renovar o token:

1. **Via Ninsaúde Clinic (Recomendado):**
   - Faça logout e login novamente
   - Gere um novo refresh token nas configurações
   - Atualize o arquivo `.env` com o novo token

2. **Obter novo Refresh Token:**
   - Acesse as configurações da API no Ninsaúde
   - Gere um novo token de acesso
   - Copie e cole no arquivo `.env`:
   ```env
   NINSAUDE_REFRESH_TOKEN=seu_novo_token_aqui
   ```

3. **Execute novamente o script:**
   ```bash
   node create-britens-prescription-template.js
   ```

---

## 📊 Casos de Uso do Modelo

### 1. Uso em Consultas de Rotina
- Modelo pré-configurado para diagnóstico de olho seco
- Posologia padronizada
- Reduz tempo de prescrição

### 2. Prescrição Rápida
- 1 clique para adicionar ao prontuário
- Informações completas já preenchidas
- Orientações ao paciente inclusas

### 3. Padronização do Tratamento
- Mesma posologia para todos os pacientes
- Facilita acompanhamento
- Melhora adesão ao tratamento

---

## 🗂️ Arquivos Relacionados

- `create-britens-prescription-template.js` - Script de criação
- `add-britenslc.js` - Script de tentativa de adicionar medicamento
- `MEDICAMENTOS.md` - Documentação do módulo de medicamentos

---

## ✅ Checklist de Criação

- [ ] Token de acesso válido no `.env`
- [ ] Medicamento BRITENS LC verificado na base
- [ ] Modelo de prescrição criado
- [ ] Modelo ativado no sistema
- [ ] Modelo testado em prontuário real
- [ ] Modelo associado aos profissionais

---

**Criado em:** 14/02/2026  
**Versão:** 1.0  
**Status:** Aguardando renovação de token para criação  
