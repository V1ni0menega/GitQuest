// ─── Configuração & Dados das Missões (Módulo 1: Fundamentos) ───
// Centraliza a lista estática de fases, objetivos, comandos esperados e pontuações de XP

export const missions = [
    {
        title: "Missão 01: O Início",
        xp: 50,
        description: "Você acabou de iniciar um novo projeto. Crie e inicialize o repositório Git local para começar a rastrear seus arquivos.",
        command: "git init"
    },
    {
        title: "Missão 02: Preparando Arquivos",
        xp: 50,
        description: "Arquivos foram detectados no seu Working Directory. Adicione-os à Staging Area para prepará-los para o commit.",
        command: "git add"
    },
    {
        title: "Missão 03: O Primeiro Commit",
        xp: 100,
        description: "Seus arquivos estão no Staging. Salve o primeiro snapshot da história do repositório criando o seu commit.",
        command: "git commit"
    }
]
