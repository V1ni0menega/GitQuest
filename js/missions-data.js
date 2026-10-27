// ─── Configuração & Dados das Missões (Módulo 1: Fundamentos) ───
// Centraliza a lista estática de fases, objetivos, comandos esperados e pontuações de XP

export const missions = [
    {
        title: "Missão 01: O Início",
        xp: 50,
        description: "Você acabou de iniciar um novo projeto. Crie e inicialize o repositório Git local para começar a rastrear seus arquivos.",
        command: "git init",
        checklist: [
            { text: "Inicializar o repositório Git local", checkKey: "initialized" }
        ]
    },
    {
        title: "Missão 02: Preparando Arquivos",
        xp: 50,
        description: "Arquivos foram detectados no seu Working Directory. Adicione todos eles à Staging Area com a notação de ponto: git add .",
        command: "git add .",
        checklist: [
            { text: "Rastrear todos os arquivos com 'git add .'", checkKey: "filesAdded" }
        ]
    },
    {
        title: "Missão 03: O Primeiro Commit",
        xp: 100,
        description: "Seus arquivos estão no Staging. Salve o primeiro snapshot da história com a flag de mensagem: git commit -m \"Initial commit\".",
        command: 'git commit -m "Initial commit"',
        checklist: [
            { text: "Criar o primeiro commit com mensagem descritiva", checkKey: "comitted" }
        ]
    }
]
