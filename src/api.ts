import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.NINSAUDE_API_URL || 'https://api.ninsaude.com/v1';

export class NinsaudeAPI {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private refreshToken: string | null = process.env.NINSAUDE_REFRESH_TOKEN || null;
    private tokenExpiry: number | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add interceptor to handle auth
        this.client.interceptors.request.use(async (config) => {
            if (!this.accessToken || this.isTokenExpired()) {
                await this.refreshAccessToken();
            }
            if (this.accessToken) {
                config.headers.Authorization = `bearer ${this.accessToken}`;
            }
            return config;
        });
    }

    private isTokenExpired(): boolean {
        if (!this.tokenExpiry) return true;
        return Date.now() >= this.tokenExpiry;
    }

    private async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('NINSAUDE_REFRESH_TOKEN is not set');
        }

        try {
            console.error('Refreshing access token...');
            const response = await axios.post(`${API_URL}/oauth2/token`, new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            // Set expiry to 14 minutes (token valid for 15 min) to be safe
            this.tokenExpiry = Date.now() + (14 * 60 * 1000);
            console.error('Access token refreshed successfully');

            if (response.data.refresh_token) {
                this.refreshToken = response.data.refresh_token;
            }

        } catch (error) {
            console.error('Failed to refresh token:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
            }
            throw new Error('Failed to authenticate with Ninsaúde API');
        }
    }

    public async listPatients(filters: any = {}) {
        try {
            // Convert filters to query params
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.nomeExato) params.append('nomeExato', filters.nomeExato);
            if (filters.cpf) params.append('cpf', filters.cpf);
            // Default active to 1 unless specified
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));
            else params.append('ativo', '1');

            const response = await this.client.get('/cadastro_paciente/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getPatient(id: string) {
        try {
            const response = await this.client.get(`/cadastro_paciente/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async createPatient(data: any) {
        try {
            const response = await this.client.post('/cadastro_paciente', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async updatePatient(id: string, data: any) {
        try {
            const response = await this.client.put(`/cadastro_paciente/${id}`, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async listAppointments(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.dataInicial) params.append('dataInicial', filters.dataInicial);
            if (filters.dataFinal) params.append('dataFinal', filters.dataFinal);
            if (filters.status) params.append('status', String(filters.status));
            if (filters.profissional) params.append('profissional', String(filters.profissional));
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));

            const response = await this.client.get('/atendimento_agenda/listar', { params });
            return response.data;

        } catch (error) {
            this.handleError(error);
        }
    }

    public async listSurveys(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.descricao) params.append('descricao', filters.descricao);
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));
            if (filters.paciente) params.append('paciente', String(filters.paciente));

            const response = await this.client.get('/zapp_pesquisa1/listar', { params });
            return response.data;

        } catch (error) {
            this.handleError(error);
        }
    }

    public async getSurvey(id: string) {
        try {
            const response = await this.client.get(`/zapp_pesquisa1/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async createSurvey(data: { descricao: string; ativo: number }) {
        try {
            const response = await this.client.post('/zapp_pesquisa1', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async updateSurvey(id: string, data: { descricao: string; ativo: number }) {
        try {
            const response = await this.client.put(`/zapp_pesquisa1/${id}`, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async deleteSurvey(id: string) {
        try {
            const response = await this.client.delete(`/zapp_pesquisa1/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Financial - Receitas (Recebimentos/Pagamentos Recebidos)
    public async createReceita(data: any) {
        try {
            const response = await this.client.post('/fluxo_receita', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async listReceitas(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.tipo) params.append('tipo', String(filters.tipo));
            if (filters.status) params.append('status', String(filters.status));
            if (filters.dataVencimentoInicial) params.append('dataVencimentoInicial', filters.dataVencimentoInicial);
            if (filters.dataVencimentoFinal) params.append('dataVencimentoFinal', filters.dataVencimentoFinal);
            if (filters.dataPagamentoInicial) params.append('dataPagamentoInicial', filters.dataPagamentoInicial);
            if (filters.dataPagamentoFinal) params.append('dataPagamentoFinal', filters.dataPagamentoFinal);
            if (filters.paciente) params.append('paciente[]', String(filters.paciente));

            const response = await this.client.get('/fluxo_receita/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Financial - Despesas (Pagamentos)
    public async createDespesa(data: any) {
        try {
            const response = await this.client.post('/fluxo_despesa', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async listDespesas(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.tipo) params.append('tipo', String(filters.tipo));
            if (filters.status) params.append('status', String(filters.status));
            if (filters.dataVencimentoInicial) params.append('dataVencimentoInicial', filters.dataVencimentoInicial);
            if (filters.dataVencimentoFinal) params.append('dataVencimentoFinal', filters.dataVencimentoFinal);
            if (filters.dataPagamentoInicial) params.append('dataPagamentoInicial', filters.dataPagamentoInicial);
            if (filters.dataPagamentoFinal) params.append('dataPagamentoFinal', filters.dataPagamentoFinal);
            if (filters.fornecedor) params.append('fornecedor[]', String(filters.fornecedor));

            const response = await this.client.get('/fluxo_despesa/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Document Templates
    public async listDocumentModelos(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.descricao) params.append('descricao', filters.descricao);
            if (filters.tipo) params.append('tipo', String(filters.tipo));
            if (filters.lingua) params.append('lingua', filters.lingua);

            const response = await this.client.get('/cadastro_documento_modelo/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Financial Reports/Charts
    public async getFluxoCaixaReport(dataInicial: string, dataFinal: string, filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));
            if (filters.conta) params.append('conta[]', String(filters.conta));

            const response = await this.client.get(
                `/fluxo_grafico/listar/fluxoCaixa/dataInicial/${dataInicial}/dataFinal/${dataFinal}`,
                { params }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getCategoriaReceitaReport(dataInicial: string, dataFinal: string, filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));

            const response = await this.client.get(
                `/fluxo_grafico/listar/categoria/receita/dataInicial/${dataInicial}/dataFinal/${dataFinal}`,
                { params }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getCategoriaDespesaReport(dataInicial: string, dataFinal: string, filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));

            const response = await this.client.get(
                `/fluxo_grafico/listar/categoria/despesa/dataInicial/${dataInicial}/dataFinal/${dataFinal}`,
                { params }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== PROFISSIONAIS (3 métodos) ====================
    public async listProfissionais(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.nome) params.append('nome', filters.nome);
            if (filters.especialidade) params.append('especialidade[]', String(filters.especialidade));
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));

            const response = await this.client.get('/cadastro_profissional/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getProfissional(id: string) {
        try {
            const response = await this.client.get(`/cadastro_profissional/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async listProfissionalAgenda(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.profissional) params.append('profissional[]', String(filters.profissional));
            if (filters.diaSemana !== undefined) params.append('diaSemana', String(filters.diaSemana));

            const response = await this.client.get('/cadastro_profissional_horario/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== CONVÊNIOS (2 métodos) ====================
    public async listConvenios(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.descricao) params.append('descricao', filters.descricao);
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));

            const response = await this.client.get('/cadastro_convenio/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getConvenio(id: string) {
        try {
            const response = await this.client.get(`/cadastro_convenio/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== SERVIÇOS (2 métodos) ====================
    public async listServicos(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.descricao) params.append('descricao', filters.descricao);
            if (filters.especialidade) params.append('especialidade[]', String(filters.especialidade));
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));

            const response = await this.client.get('/cadastro_servico/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getServico(id: string) {
        try {
            const response = await this.client.get(`/cadastro_servico/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== CONTAS BANCÁRIAS (2 métodos) ====================
    public async listContas(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.descricao) params.append('descricao', filters.descricao);
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));

            const response = await this.client.get('/fluxo_conta/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getContaSaldo() {
        try {
            const response = await this.client.get('/fluxo_grafico/listar/conta/saldo');
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== FORNECEDORES (2 métodos) ====================
    public async listFornecedores(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.nomeFantasia) params.append('nomeFantasia', filters.nomeFantasia);
            if (filters.cnpj) params.append('cnpj', filters.cnpj);
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));

            const response = await this.client.get('/cadastro_fornecedor/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async createFornecedor(data: any) {
        try {
            const response = await this.client.post('/cadastro_fornecedor', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== CATEGORIAS FINANCEIRAS (2 métodos) ====================
    public async listCategoriasReceita(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));

            const response = await this.client.get('/fluxo_categoria_receita/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async listCategoriasDespesa(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));

            const response = await this.client.get('/fluxo_categoria_despesa/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== RELATÓRIOS AVANÇADOS (4 métodos) ====================
    public async getTipoPagamentoReport(dataInicial: string, dataFinal: string, filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));

            const response = await this.client.get(
                `/fluxo_grafico/listar/tipoDePagamento/dataInicial/${dataInicial}/dataFinal/${dataFinal}`,
                { params }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getInadimplenciaReport(dataInicial: string, dataFinal: string, filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));

            const response = await this.client.get(
                `/fluxo_grafico/listar/inadimplencia/dataInicial/${dataInicial}/dataFinal/${dataFinal}`,
                { params }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getProfissionalReport(dataInicial: string, dataFinal: string, filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));

            const response = await this.client.get(
                `/fluxo_grafico/listar/profissional/dataInicial/${dataInicial}/dataFinal/${dataFinal}`,
                { params }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getConvenioReport(dataInicial: string, dataFinal: string, filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.accountUnidade) params.append('accountUnidade[]', String(filters.accountUnidade));

            const response = await this.client.get(
                `/fluxo_grafico/listar/convenio/dataInicial/${dataInicial}/dataFinal/${dataFinal}`,
                { params }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== AGENDAMENTOS (3 métodos) ====================
    public async createAgendamento(data: any) {
        try {
            const response = await this.client.post('/atendimento_agenda', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async updateAgendamento(id: string, data: any) {
        try {
            const response = await this.client.post(`/atendimento_agenda/reagendar/agendamento/${id}`, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async cancelAgendamento(id: string) {
        try {
            // Cancelar = atualizar status para 5 (Cancelado)
            const response = await this.client.put(`/atendimento_agenda/${id}`, { status: 5 });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== PRONTUÁRIOS (5 métodos) ====================
    public async createProntuario(data: any) {
        try {
            const response = await this.client.post('/prontuario_geral', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async updateProntuario(id: string, data: any) {
        try {
            const response = await this.client.put(`/prontuario_geral/${id}`, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async listProntuarios(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.paciente) params.append('paciente[]', String(filters.paciente));
            if (filters.profissional) params.append('profissional[]', String(filters.profissional));

            const response = await this.client.get('/prontuario_prontuario/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getProntuario(id: string) {
        try {
            const response = await this.client.get(`/prontuario_prontuario/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== PRODUTOS/ESTOQUE (2 métodos) ====================
    public async listProdutos(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.descricao) params.append('descricao', filters.descricao);
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));

            const response = await this.client.get('/cadastro_produto/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getProdutoEstoque(id: string) {
        try {
            const response = await this.client.get(`/cadastro_produto/${id}/estoque`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== TÍTULOS DE TRANSFERÊNCIAS (3 métodos) ====================
    public async listTitulosTransferencias(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.transacao) params.append('transacao', String(filters.transacao));

            const response = await this.client.get('/zapp_conciliacao2transacaotitulo/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async addTitulosLote(data: any) {
        try {
            const response = await this.client.post('/zapp_conciliacao2transacaotitulo/adicionar/titulo/lote', data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getTituloTransferencia(id: string) {
        try {
            const response = await this.client.get(`/zapp_conciliacao2transacaotitulo/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    // ==================== MEDICAMENTOS (2 métodos - SOMENTE LEITURA) ====================
    public async listMedicamentos(filters: any = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.limit) params.append('limit', String(filters.limit));
            if (filters.offset) params.append('offset', String(filters.offset));
            if (filters.nome) params.append('nome', filters.nome);
            if (filters.laboratorio) params.append('laboratorio', filters.laboratorio);
            if (filters.principioAtivo) params.append('principioAtivo', filters.principioAtivo);
            if (filters.ativo !== undefined) params.append('ativo', String(filters.ativo));

            const response = await this.client.get('/medicamento/listar', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getMedicamento(id: string) {
        try {
            const response = await this.client.get(`/medicamento/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.status, error.response?.data);
            throw new Error(`Ninsaúde API Error: ${JSON.stringify(error.response?.data || error.message)}`);
        }
        throw error;
    }
}
