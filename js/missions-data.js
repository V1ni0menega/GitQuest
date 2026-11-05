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
        title: "Missão 05: Inspeção & Múltiplos Arquivos",
        xp: 150,
        description: "Novos arquivos surgiram no seu projeto ('components.js' com alterações e 'README.md'). Primeiro inspecione as linhas adicionadas e removidas com 'git diff', depois prepare ambos com 'git add .' e registre o novo snapshot com 'git commit -m \"feat: novos componentes\"'.",
        command: 'git diff && git add . && git commit -m "feat: novos componentes"',
        checklist: [
            { text: "Inspecionar as diferenças no código com 'git diff'", checkKey: "diffViewed" },
            { text: "Preparar múltiplos arquivos com 'git add .'", checkKey: "phase5Added" },
            { text: "Gravar o segundo commit com mensagem descritiva", checkKey: "phase5Committed" }
        ],
        hints: [
            "O comando 'git diff' compara o código do Working Directory com a Staging Area ou último commit.",
            "Quando múltiplos arquivos são criados ou alterados, 'git add .' prepara todos simultaneamente.",
            "Comandos recomendados: primeiro digite 'git diff', depois 'git add .', e finalize com 'git commit -m \"feat: novos componentes\"'."
        ]
    },
    {
        title: "Missão 06: Ramificações",
        xp: 150,
        description: "Para desenvolver uma nova funcionalidade sem comprometer a branch principal 'main', crie e alterne para a branch 'feature-auth' usando o comando moderno 'git switch -c feature-auth' (ou 'git checkout -b feature-auth').",
        command: "git switch -c feature-auth",
        checklist: [
            { text: "Criar e alternar para a branch 'feature-auth'", checkKey: "branchCreated" }
        ],
        hints: [
            "Branches permitem criar linhas de desenvolvimento isoladas e paralelas para novas funcionalidades.",
            "No Git moderno (v2.23+), o comando 'git switch -c <nome>' cria e alterna para a nova branch de forma limpa e segura.",
            "Comando recomendado: digite 'git switch -c feature-auth' (ou 'git checkout -b feature-auth') no terminal."
        ]
    },

    // ─── Módulo 2: Branches & Fusões ───
    {
        title: "Missão 07: O Comando Switch",
        xp: 100,
        description: "No Git moderno (v2.23+), o comando 'git switch' foi introduzido para separar a troca de branches do descarte de arquivos. Crie uma nova branch com 'git switch -c feature-login' e em seguida alterne de volta para a 'main' com 'git switch main'.",
        command: "git switch -c feature-login && git switch main",
        checklist: [
            { text: "Criar e alternar com 'git switch -c feature-login'", checkKey: "branchLoginCreated" },
            { text: "Alternar de volta para 'main' com 'git switch main'", checkKey: "switchedBackToMain" }
        ],
        hints: [
            "A flag '-c' (create) no git switch cria a branch e já muda o ponteiro HEAD para ela.",
            "Para voltar para a branch principal sem criar nada, execute apenas 'git switch main'.",
            "Comandos recomendados: primeiro digite 'git switch -c feature-login' e depois 'git switch main'."
        ]
    },
    {
        title: "Missão 08: Trabalho Isolado",
        xp: 150,
        description: "Alterne novamente para a branch de trabalho com 'git switch feature-login'. Arquivos da nova tela ('login.html' e 'login.css') foram detectados! Prepare-os com 'git add .' e grave o snapshot exclusivo dessa branch com 'git commit -m \"feat: tela de login\"'.",
        command: 'git switch feature-login && git add . && git commit -m "feat: tela de login"',
        checklist: [
            { text: "Mudar para a branch 'feature-login' com 'git switch'", checkKey: "onFeatureLogin" },
            { text: "Gravar o commit exclusivo na branch de feature", checkKey: "featureLoginCommitted" }
        ],
        hints: [
            "Sempre confirme em qual branch você está antes de commitar; o prompt indicará (feature-login).",
            "Use 'git switch feature-login' para se posicionar, 'git add .' para preparar os arquivos e faça o commit com a flag -m.",
            "Comandos recomendados: 'git switch feature-login', depois 'git add .', e finalize com 'git commit -m \"feat: tela de login\"'."
        ]
    },
    {
        title: "Missão 09: Fusão Fast-Forward",
        xp: 200,
        description: "A tela de login está pronta e testada! Para integrar suas alterações na linha principal, primeiro volte para a 'main' com 'git switch main', e depois realize a fusão linear direta com 'git merge feature-login'.",
        command: "git switch main && git merge feature-login",
        checklist: [
            { text: "Retornar para a branch principal com 'git switch main'", checkKey: "switchedToMainForMerge" },
            { text: "Realizar a fusão linear com 'git merge feature-login'", checkKey: "mergeCompleted" }
        ],
        hints: [
            "Regra de ouro do merge: posicione-se SEMPRE na branch de destino (a que receberá o código) antes de fundir.",
            "Quando a branch principal não recebeu novos commits após a ramificação, o Git avança o ponteiro instantaneamente (Fast-Forward).",
            "Comandos recomendados: digite 'git switch main' e depois 'git merge feature-login'."
        ]
    },
    {
        title: "Missão 10: Limpeza de Branches",
        xp: 100,
        description: "Com o código da 'feature-login' integrado com segurança na 'main', a branch temporária cumpriu seu papel. Remova a ramificação antiga com 'git branch -d feature-login'.",
        command: "git branch -d feature-login",
        checklist: [
            { text: "Excluir com segurança a branch 'feature-login' com '-d'", checkKey: "branchDeleted" }
        ],
        hints: [
            "A flag '-d' realiza uma exclusão segura, confirmando que a branch já foi fundida antes de deletar.",
            "Você não pode deletar uma branch se o HEAD estiver nela; certifique-se de estar na 'main'.",
            "Comando recomendado: digite 'git branch -d feature-login'."
        ]
    }
]
