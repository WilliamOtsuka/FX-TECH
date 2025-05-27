import Turmas from "../model/turmasModel.js";

class TurmasController {
    static async listarTurmas(req, res) {
        try {
            let turmas = await Turmas.listarTurmas();
            if (turmas.length > 0) {
                res.json(turmas);
            } else {
                res.status(404).json({ message: "Nenhuma turma encontrada." });
            }
        }
        catch (error) {
            console.error("Erro ao listar turmas:", error);
            res.status(500).json({ error: "Erro ao listar turmas." });
        }
    }

    static async atualizarTurma(req, res) {
        try {
            let { id } = req.params;
            let { nome, anoLetivo, ensino } = req.body;

            // Validação básica
            if (!nome || !anoLetivo || !ensino) {
                return res.status(400).json({ message: "Nome, ano letivo e ensino são obrigatórios." });
            }

            let turmaAtualizada = {
                nome,
                anoLetivo,
                ensino
            };

            let resultado = await Turmas.atualizarTurma(id, turmaAtualizada);

            if (resultado) {
                res.status(200).json({ message: "Turma atualizada com sucesso." });
            } else {
                res.status(404).json({ message: "Turma não encontrada." });
            }
        } catch (error) {
            console.error("Erro ao atualizar turma:", error);
            res.status(500).json({ error: "Erro ao atualizar turma." });
        }
    }

    static async deletarTurma(req, res) {
        try {
            let { id } = req.params;
            let resultado = await Turmas.deletarTurma(id);
            if (resultado) {
                res.status(200).json({ message: "Turma deletada com sucesso." });
            } else {
                res.status(404).json({ message: "Turma não encontrada." });
            }
        } catch (error) {
            console.error("Erro ao deletar turma:", error);
            res.status(500).json({ error: "Erro ao deletar turma." });
        }
    }

    static async listarPeriodosPorTurma(req, res) {
        try {
            let { id } = req.params;
            let periodos = await Turmas.buscarPeriodosPorTurma(id);
            if (periodos.length > 0) {
                res.json(periodos);
            } else {
                res.status(404).json({ message: "Nenhum período encontrado para a turma." });
            }
        } catch (error) {
            console.error("Erro ao listar períodos por turma:", error);
            res.status(500).json({ error: "Erro ao listar períodos por turma." });
        }
    }
    static async listarDisciplinasPorTurma(req, res) {
        try {
            let { idT } = req.params;
            let disciplinas = await Turmas.buscarDisciplinasPorTurma(idT);
            if (disciplinas.length > 0) {   
                res.json(disciplinas);
            } else if (disciplinas.length === 0) {
                console.log("Turma sem disciplinas encontrado!");
                res.json([]);
            }
            else {
                res.status(404).json({ message: "Nenhuma disciplina encontrada para a turma." });
            }
        } catch (error) {
            console.error("Erro ao buscar disciplinas por turma:", error);
            res.status(500).json({ error: "Erro ao buscar disciplinas por turma." });
        }
    }

    static async listarParticipantesPorTurma(req, res) {
        try {
            let { idT } = req.params;
    
            let participantes = await Turmas.listarParticipantesPorTurma(idT);
    
            if (participantes.length > 0) {
                res.json(participantes);
            } else if (participantes.length === 0) {
                console.log("Turma sem alunos encontrado!");
                res.json([]);
            }
            else {
                res.status(404).json({ message: "Nenhum participante encontrado para a turma." });
            }
        } catch (error) {
            console.error("Erro ao listar participantes por turma:", error);
            res.status(500).json({ error: "Erro ao listar participantes por turma." });
        }
    }
    static async listarAlunosTurma(req, res) {
        try {
            let { idT, idDisciplina } = req.params;
            console.log("ID Disciplina:", idDisciplina);
            let alunos = await Turmas.listarAlunosTurma(idT, idDisciplina);
            if (alunos.length > 0) {
                res.json(alunos);
            } else {
                res.status(404).json({ message: "Nenhum aluno encontrado para a disciplina e turma especificadas." });
            }
        } catch (error) {
            console.error("Erro ao listar alunos por disciplina e turma:", error);
            res.status(500).json({ error: "Erro ao listar alunos por disciplina e turma." });
        }
    }
}

export default TurmasController;