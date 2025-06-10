import Atividades from '../model/atividadesModel.js';

class AtividadesController {

    static async enviarAtividade(req, res) {
        // try {
        //     let { idAluno, idAtividade, descricao, dataEntrega } = req.body;
        //     let atividade = await Atividades.enviarAtividade(idAluno, idAtividade, descricao, dataEntrega);
        //     if (atividade) {
        //         res.status(201).json({ message: 'Atividade enviada com sucesso', atividade });
        //     } else {
        //         res.status(400).json({ message: 'Erro ao enviar atividade' });
        //     }
        // } catch (error) {
        //     console.error('Erro ao enviar atividade:', error);
        //     res.status(500).json({ error: 'Erro ao enviar atividade' });
        // }
        try {
            let { idAluno, idAtividade, descricao, dataEntrega } = req.body;
            let nomeArquivo = req.file ? req.file.filename : null;

            let resultado = await Atividades.enviarAtividade(idAluno, idAtividade, descricao, dataEntrega, nomeArquivo);
            res.status(200).json(resultado);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao entregar atividade.' });
        }
    }

    static async cadastrarAtividade(req, res) {
        try {
            let { titulo, descricao, dataEntrega, hora, peso, idDisciplina, idTurma, tipo } = req.body;
            let atividade = await Atividades.cadastrarAtividade(titulo, descricao, dataEntrega, hora, peso, idDisciplina, idTurma, tipo);
            if (atividade) {
                res.status(201).json({ message: 'Atividade cadastrada com sucesso', atividade });
            } else {
                res.status(400).json({ message: 'Erro ao cadastrar atividade' });
            }
        } catch (error) {
            console.error('Erro ao cadastrar atividade:', error);
            res.status(500).json({ error: 'Erro ao cadastrar atividade' });
        }
    }

    static async buscarAtividadesDisciplinasTurmas(req, res) {
        try {
            let { idDisciplina, idT } = req.params;
            let atividades = await Atividades.buscarAtividades(idDisciplina, idT);
            res.json(atividades);
        } catch (error) {
            console.error('Erro ao buscar atividades:', error);
            res.status(500).json({ error: 'Erro ao buscar atividades' });
        }
    }

    static async buscarAtividade(req, res) {
        try {
            let { id } = req.params;
            let atividade = await Atividades.buscarAtividadePorId(id);
            if (!atividade) {
                return res.status(404).json({ message: 'Atividade não encontrada' });
            }
            res.json(atividade);
        } catch (error) {
            console.error('Erro ao buscar atividade:', error);
            res.status(500).json({ error: 'Erro ao buscar atividade' });
        }
    }

    static async excluirAtividade(req, res) {
        try {
            let { id } = req.params;
            let sucesso = await Atividades.excluirAtividade(id);
            if (sucesso) {
                res.status(200).json({ message: 'Atividade excluída com sucesso' });
            } else {
                res.status(404).json({ message: 'Atividade não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao excluir atividade:', error);
            res.status(500).json({ error: 'Erro ao excluir atividade' });
        }
    }

    static async atualizarAtividade(req, res) {
        try {
            let { id } = req.params;
            let { titulo, descricao, dataEntrega, hora, peso } = req.body;
            let sucesso = await Atividades.atualizarAtividade(id, { titulo, descricao, dataEntrega, hora, peso });
            if (sucesso) {
                res.status(200).json({ message: 'Atividade atualizada com sucesso' });
            } else {
                res.status(404).json({ message: 'Atividade não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
            res.status(500).json({ error: 'Erro ao atualizar atividade' });
        }
    }

    static async buscarAtividadesNaoEntregues(req, res) {
        try {
            let { id } = req.params;
            let alunos = await Atividades.buscarNaoEntregues(id);
            res.json(alunos);
        } catch (error) {
            console.error('Erro ao buscar atividades não entregues:', error);
            res.status(500).json({ error: 'Erro ao buscar atividades não entregues' });
        }
    }

    static async buscarAtividadesNaoCorrigidas(req, res) {
        try {
            let { id } = req.params;
            let alunos = await Atividades.buscarNaoCorrigidas(id);
            res.json(alunos);
        } catch (error) {
            console.error('Erro ao buscar atividades não corrigidas:', error);
            res.status(500).json({ error: 'Erro ao buscar atividades não corrigidas' });
        }
    }

    static async buscarAtividadeCorrigidas(req, res) {
        try {
            let { id } = req.params;
            let alunos = await Atividades.buscarCorrigidas(id);
            res.json(alunos);
        } catch (error) {
            console.error('Erro ao buscar atividades corrigidas:', error);
            res.status(500).json({ error: 'Erro ao buscar atividades corrigidas' });
        }
    }
    
    static async enviarCorrecao(req, res) {
        try {
            let { id, idAluno } = req.params;
            let { nota, feedback } = req.body;
            let nomeArquivo = req.file ? req.file.filename : null;
            console.log('Nome do arquivo:', nomeArquivo);

            // Verificar o status da atividade
            let atividade = await Atividades.buscarAtividadePorId(id);
            if (atividade.status === 'disponivel') {
                return res.status(403).json({ message: 'Não é possível corrigir uma atividade ainda disponível.' });
            }

            // Enviar a correção
            let sucesso = await Atividades.enviarCorrecao(id, idAluno, { nota, feedback }, nomeArquivo);
            if (sucesso) {
                res.status(200).json({ message: 'Correção enviada com sucesso' });
            } else {
                res.status(404).json({ message: 'Atividade ou aluno não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao enviar correção:', error);
            res.status(500).json({ error: 'Erro ao enviar correção' });
        }
    }

    static async atualizarCorrecao(req, res) {
        try {
            let { id, idAluno } = req.params;
            let { nota, feedback } = req.body;
            let nomeArquivo = req.file ? req.file.filename : null;
            console.log('Nome do arquivo:', nomeArquivo);

            // Atualizar a correção
            let sucesso = await Atividades.atualizarCorrecao(id, idAluno, { nota, feedback }, nomeArquivo);
            if (sucesso) {
                res.status(200).json({ message: 'Correção atualizada com sucesso' });
            } else {
                res.status(404).json({ message: 'Correção não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao atualizar correção:', error);
            res.status(500).json({ error: 'Erro ao atualizar correção' });
        }
    }

    static async excluirCorrecao(req, res) {
        try {
            let { id, idAluno } = req.params;
            let sucesso = await Atividades.excluirCorrecao(id, idAluno);
            if (sucesso) {
                res.status(200).json({ message: 'Correção excluída com sucesso' });
            } else {
                res.status(404).json({ message: 'Correção não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao excluir correção:', error);
            res.status(500).json({ error: 'Erro ao excluir correção' });
        }
    }

    static async buscarCorrecaoDaAtividadeDoAluno(req, res) {
        try {
            let { id, idAluno } = req.params;
            let correcao = await Atividades.buscarCorrecao(id, idAluno);
            if (correcao) {
                res.json(correcao);
            } else {
                res.status(404).json({ message: 'Correção não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao buscar correção:', error);
            res.status(500).json({ error: 'Erro ao buscar correção' });
        }
    }

    static async buscarRespostaDoAluno(req, res) {
        try {
            let { id, idAluno } = req.params;
            let resposta = await Atividades.buscarResposta(id, idAluno);
            if (resposta) {
                res.json(resposta);
            } else {
                res.status(404).json(null);
            }
        } catch (error) {
            console.error('Erro ao buscar resposta do aluno:', error);
            res.json(null);
        }
    }

    static async buscarAtividadesPorData(req, res) {
    try {
        let { data } = req.params;
        let atividades = await Atividades.buscarPorData(data);
        res.json(atividades);
    } catch (error) {
        console.error('Erro ao buscar atividades por data:', error);
        res.status(500).json({ error: 'Erro ao buscar atividades' });
    }
}
}
export default AtividadesController;