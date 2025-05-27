import Usuarios from '../model/usuariosModel.js';

class UsuariosController {
    static async login(req, res) {
        try {
            let { ra, tipo, senha } = req.body;
            if (!ra || !tipo || !senha) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            }

            let result = await Usuarios.login(ra, tipo, senha);

            if (!result) {
                return res.status(401).json({ message: 'RA, tipo ou senha inválidos' });
            }

            // ✅ Enviar os dados para o frontend
            return res.status(200).json({
                token: result.token,
                user: {
                    ...result.user,
                    perfil: result.perfil,
                    turmas: result.turmas
                }
            });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }

    static async cadastrarFuncionario(req, res) {
        try {
            let { nome, senha, cargo, email_pessoal, email_educacional, contato, cpf, RA } = req.body;

            if (!nome || !cargo || !email_pessoal || !email_educacional || !RA || !cpf || !contato) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            }

            let novoFuncionario = {
                nome,
                senha,
                cargo,
                email_pessoal,
                email_educacional,
                contato,
                cpf,
                RA
            };

            let funcionario = await Usuarios.cadastrarFuncionario(novoFuncionario);
            return res.status(201).json(funcionario);
        } catch (error) {
            console.error("Erro ao cadastrar funcionário:", error);
            return res.status(500).json({ error: 'Erro ao cadastrar o funcionário' });
        }
    }

    static async listarFuncionarios(req, res) {
        try {
            let funcionarios = await Usuarios.listarFuncionarios();
            return res.json(funcionarios);
        } catch (error) {
            console.error("Erro ao listar funcionários:", error);
            return res.status(500).json({ error: 'Erro ao listar funcionários' });
        }
    }

    static async atualizarFuncionario(req, res) {
        try {
            let { id } = req.params;
            let { nome, cargo, email_pessoal, email_educacional, RA, cpf, contato } = req.body;

            if (!nome || !cargo || !email_pessoal || !email_educacional || !RA || !cpf || !contato) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            }

            let sucesso = await Usuarios.atualizarFuncionario(id, { nome, cargo, email_pessoal, email_educacional, RA, cpf, contato });
            if (sucesso) {
                return res.status(200).json({ message: 'Funcionário atualizado com sucesso!' });
            } else {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            return res.status(500).json({ error: 'Erro ao atualizar o funcionário' });
        }
    }

    static async excluirFuncionario(req, res) {
        try {
            let { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            let associado = await Usuarios.verificarAssociacaoTurmaProfessor(id);
            if (associado) {
                return res.status(400).json({ message: 'Não é possível excluir o funcionário, pois ele está associado a uma ou mais turmas.' });
            }

            let sucesso = await Usuarios.excluirFuncionario(id);
            if (sucesso) {
                return res.status(200).json({ message: 'Funcionário excluído com sucesso!' });
            } else {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
            return res.status(500).json({ error: 'Erro ao excluir o funcionário' });
        }
    }

    static async listarAlunos(req, res) {
        try {
            let alunos = await Usuarios.listarAlunos();
            return res.json(alunos);
        } catch (error) {
            console.error("Erro ao listar alunos:", error);
            return res.status(500).json({ error: 'Erro ao listar alunos' });
        }
    }

    static async atualizarAluno(req, res) {
        try {
            let { id } = req.params;
            let { nome, email_pessoal, email_educacional, contato, cpf, data_nascimento, pai, mae, endereco, ra } = req.body;

            if (!nome || !email_pessoal || !email_educacional || !contato || !cpf || !data_nascimento || !pai || !mae || !endereco || !ra) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            }

            let alunoAtualizado = {
                nome,
                email_pessoal,
                email_educacional,
                contato,
                cpf,
                data_nascimento,
                pai,
                mae,
                endereco,
                ra
            };

            let sucesso = await Usuarios.atualizarAluno(id, alunoAtualizado);
            if (sucesso) {
                return res.status(200).json({ message: 'Aluno atualizado com sucesso!' });
            } else {
                return res.status(404).json({ message: 'Aluno não encontrado' });
            }
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            return res.status(500).json({ error: 'Erro ao atualizar o aluno' });
        }
    }

    static async excluirAluno(req, res) {
        try {
            let { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            let associado = await Usuarios.verificarAssociacaoTurmaAluno(id);
            if (associado) {
                return res.status(400).json({ message: 'Não é possível excluir o aluno, pois ele está associado a uma ou mais turmas.' });
            }

            let sucesso = await Usuarios.excluirAluno(id);
            if (sucesso) {
                return res.status(200).json({ message: 'Aluno excluído com sucesso!' });
            } else {
                return res.status(404).json({ message: 'Aluno não encontrado' });
            }
        } catch (error) {
            console.error("Erro ao excluir aluno:", error);
            return res.status(500).json({ error: 'Erro ao excluir o aluno' });
        }
    }

    static async buscarMaiorRAFuncionario(req, res) {
        try {
            const { ano } = req.params;

            // Busca o maior RA já cadastrado para o ano informado
            const maiorRA = await Usuarios.buscarMaiorRAFuncionario(ano);
            let ultimoRA = maiorRA || "";
            let prefixo = "10" + ano;
            let sequencial = 1;

            if (ultimoRA && ultimoRA.startsWith(prefixo)) {
                // Continua a sequência do ano informado
                sequencial = parseInt(ultimoRA.slice(4), 10) + 1;
            } else {
                // Começa do 1 para o novo ano
                sequencial = 1;
            }

            let novoRA = prefixo + String(sequencial).padStart(5, "0");
            return res.status(200).json({ novoRA });
        } catch (error) {
            console.log("Erro ao buscar maior RA de funcionário:", error);
            return res.status(500).json({ error: 'Erro ao buscar maior RA de funcionário' });
        }
    }
}

export default UsuariosController;