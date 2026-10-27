// ─── Configuração & Dados das Missões (Módulo 1: Fundamentos) ───
// Centraliza a lista estática de fases, objetivos, comandos esperados e pontuações de XP

export const missions = [
    {
        title: "Missão 01: O Início",
        xp: 50,
        description: "Você acabou de iniciar um novo projeto. Crie e inicialize o repositório Git local para começar a rastrear seus arquivos.",
        command: "git init",
        checklist: [
            { text: "Inicializar o repositório Git local com 'git init'", checkKey: "initialized" }
        ],
        hints: [
            "Repositórios Git precisam ser inicializados na raiz do projeto para criar a pasta oculta .git, que armazena todo o histórico.",
            "Para começar a rastrear alterações, utilize o comando do Git para criar um novo repositório local.",
            "Comando recomendado: digite 'git init' no terminal e pressione Enter para inicializar."
        ]
    },
    {
        title: "Missão 02: Inspeção & Staging",
        xp: 50,
        description: "Arquivos foram detectados no seu Working Directory. Primeiro inspecione o estado dos arquivos com 'git status' e em seguida envie todos para a Staging Area com 'git add .'.",
        command: "git status && git add .",
        checklist: [
            { text: "Inspecionar o estado com 'git status'", checkKey: "statusChecked" },
            { text: "Rastrear os arquivos com 'git add .'", checkKey: "filesAdded" }
        ],
        hints: [
            "O comando 'git status' é essencial para verificar quais arquivos estão no Working Directory antes de prepará-los.",
            "Após verificar o status, o comando 'git add .' prepara todos os arquivos da pasta atual para o próximo snapshot.",
            "Comandos recomendados: primeiro digite 'git status' e depois digite 'git add .'."
        ]
    },
    {
        title: "Missão 03: O Primeiro Commit",
        xp: 100,
        description: "Seus arquivos estão no Staging. Salve o primeiro snapshot da história com a flag de mensagem: git commit -m \"Initial commit\".",
        command: 'git commit -m "Initial commit"',
        checklist: [
            { text: "Criar o primeiro commit com mensagem descritiva", checkKey: "comitted" }
        ],
        hints: [
            "Um commit grava um snapshot permanente dos arquivos que estão na Staging Area no histórico do repositório.",
            "Para definir a mensagem do commit sem abrir outro editor, passe a flag '-m' acompanhada do texto entre aspas.",
            "Comando recomendado: digite 'git commit -m \"Initial commit\"' para registrar sua primeira versão."
        ]
    },
    {
        title: "Missão 04: A Linha do Tempo",
        xp: 75,
        description: "Seu primeiro commit foi gravado! Agora visualize a linha do tempo do projeto com o comando 'git log' para inspecionar autor, data e mensagem.",
        command: "git log",
        checklist: [
            { text: "Visualizar o histórico de versões com 'git log'", checkKey: "logViewed" }
        ],
        hints: [
            "O comando 'git log' lista todos os commits do repositório em ordem cronológica reversa.",
            "Cada commit exibe o hash SHA-1 identificador, nome do autor, carimbo de data/hora e mensagem gravada.",
            "Comando recomendado: digite 'git log' no terminal para explorar o histórico."
        ]
    },
    {
        title: "Missão 05: Múltiplos Arquivos",
        xp: 100,
        description: "Novos arquivos surgiram no Working Directory ('components.js' e 'README.md'). Realize o ciclo completo: prepare ambos com 'git add .' e registre o novo snapshot com 'git commit -m \"feat: novos componentes\"'.",
        command: 'git add . && git commit -m "feat: novos componentes"',
        checklist: [
            { text: "Preparar múltiplos arquivos com 'git add .'", checkKey: "phase5Added" },
            { text: "Gravar o segundo commit com mensagem descritiva", checkKey: "phase5Committed" }
        ],
        hints: [
            "Quando múltiplos arquivos são criados ou alterados, 'git add .' prepara todos simultaneamente.",
            "Após preparar com 'git add .', finalize o snapshot registrando um commit com a flag '-m'.",
            "Comandos recomendados: execute 'git add .' e depois 'git commit -m \"feat: novos componentes\"'."
        ]
    },
    {
        title: "Missão 06: Ramificações",
        xp: 150,
        description: "Para desenvolver uma nova funcionalidade sem comprometer a branch principal 'main', crie e alterne para a branch 'feature-auth' usando 'git checkout -b feature-auth'.",
        command: "git checkout -b feature-auth",
        checklist: [
            { text: "Criar e alternar para a branch 'feature-auth'", checkKey: "branchCreated" }
        ],
        hints: [
            "Branches permitem criar linhas de desenvolvimento isoladas e paralelas para novas funcionalidades.",
            "A flag '-b' no git checkout cria a nova branch e já faz a troca imediatamente.",
            "Comando recomendado: digite 'git checkout -b feature-auth' no terminal."
        ]
    }
]
