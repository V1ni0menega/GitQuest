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
        ],
        hints: [
            "Repositórios Git precisam ser inicializados na raiz do projeto para criar a pasta oculta .git, que armazena todo o histórico.",
            "Para começar a rastrear alterações, utilize o comando do Git para criar um novo repositório local.",
            "Comando recomendado: digite 'git init' no terminal e pressione Enter para inicializar."
        ]
    },
    {
        title: "Missão 02: Preparando Arquivos",
        xp: 50,
        description: "Arquivos foram detectados no seu Working Directory. Adicione todos eles à Staging Area com a notação de ponto: git add .",
        command: "git add .",
        checklist: [
            { text: "Rastrear todos os arquivos com 'git add .'", checkKey: "filesAdded" }
        ],
        hints: [
            "Arquivos modificados ou novos ficam no Working Directory. Antes de salvar uma versão, precisamos colocá-los na Staging Area.",
            "O comando 'git add' prepara arquivos para o commit. Usar o caractere '.' (ponto) inclui todos os arquivos da pasta atual.",
            "Comando recomendado: execute 'git add .' para adicionar todos os arquivos ao Staging."
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
            "Um commit grava um snapshot permanente dos arquivos que estão na Staging Area.",
            "Para definir a mensagem do commit sem abrir outro editor, passe o argumento '-m' acompanhado do texto entre aspas.",
            "Comando recomendado: digite 'git commit -m \"Initial commit\"' para registrar sua primeira versão."
        ]
    }
]
