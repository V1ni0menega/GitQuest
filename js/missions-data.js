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
    },

    // ─── Módulo 3: Desfazendo Coisas & Viagem no Tempo ───
    {
        title: "Missão 11: Descarte no Working Directory",
        xp: 100,
        description: "Você fez alterações experimentais em 'app.js' que não deram certo. Antes de preparar o arquivo, descarte essas modificações não salvas usando o comando moderno 'git restore app.js'.",
        command: "git restore app.js",
        checklist: [
            { text: "Descartar alterações locais com 'git restore app.js'", checkKey: "fileRestored" }
        ],
        hints: [
            "O comando 'git restore <arquivo>' desfaz alterações no Working Directory, voltando o arquivo ao estado do último commit.",
            "Ao contrário do antigo 'git checkout -- <arquivo>', 'git restore' atua exclusivamente na restauração de código.",
            "Comando recomendado: digite 'git restore app.js' no terminal."
        ]
    },
    {
        title: "Missão 12: Desindexação do Staging",
        xp: 100,
        description: "Você adicionou o arquivo 'app.js' ao Staging com 'git add', mas percebeu que ele ainda não deveria ser commitado. Retire-o da área de preparação sem perder as linhas de código com 'git restore --staged app.js'.",
        command: "git restore --staged app.js",
        checklist: [
            { text: "Retirar arquivo do Staging com 'git restore --staged app.js'", checkKey: "fileUnstaged" }
        ],
        hints: [
            "A flag '--staged' instrui o Git a retirar o arquivo da Staging Area e devolvê-lo ao Working Directory.",
            "Seus códigos continuam intactos na pasta de trabalho, apenas deixam de ir para o próximo commit.",
            "Comando recomendado: digite 'git restore --staged app.js'."
        ]
    },
    {
        title: "Missão 13: Retificação com Amend",
        xp: 150,
        description: "Você acabou de gravar um snapshot, mas percebeu um erro de digitação na mensagem. Retifique o último commit sem criar um commit duplicado usando 'git commit --amend -m \"feat: mensagem corrigida com sucesso\"'.",
        command: 'git commit --amend -m "feat: mensagem corrigida com sucesso"',
        checklist: [
            { text: "Reescrever o último snapshot com 'git commit --amend'", checkKey: "commitAmended" }
        ],
        hints: [
            "A flag '--amend' substitui a ponta do branch atual pelo novo snapshot retificado.",
            "É a ferramenta ideal para consertar erros de mensagem ou arquivos esquecidos imediatamente após o commit.",
            "Comando recomendado: digite 'git commit --amend -m \"feat: mensagem corrigida com sucesso\"'."
        ]
    },
    {
        title: "Missão 14: Reversão Segura com Revert",
        xp: 150,
        description: "Quando um commit defeituoso já foi integrado e você precisa anular seus efeitos sem reescrever o histórico público, crie um contra-commit seguro com 'git revert HEAD'.",
        command: "git revert HEAD",
        checklist: [
            { text: "Criar contra-commit seguro com 'git revert HEAD'", checkKey: "commitReverted" }
        ],
        hints: [
            "O 'git revert' não apaga o passado: ele grava um NOVO commit com as alterações exatamente opostas.",
            "Essa é a prática recomendada em equipes porque preserva a integridade do histórico.",
            "Comando recomendado: digite 'git revert HEAD' no terminal."
        ]
    },

    // ─── Módulo 4: Resolução de Conflitos ───
    {
        title: "Missão 15: Detecção de Conflito",
        xp: 150,
        description: "Duas branches alteraram a mesma linha de código! Tente fundir a branch divergente 'feature-conflito' na 'main' com 'git merge feature-conflito' e observe o Git pausar e entrar no estado de MERGING.",
        command: "git merge feature-conflito",
        checklist: [
            { text: "Disparar tentativa de fusão com 'git merge feature-conflito'", checkKey: "conflictDetected" }
        ],
        hints: [
            "Quando o Git encontra alterações conflitantes na mesma linha, ele para e insere marcadores no código.",
            "O prompt do terminal refletirá o estado '(main|MERGING)' até a resolução ser concluída.",
            "Comando recomendado: digite 'git merge feature-conflito'."
        ]
    },
    {
        title: "Missão 16: Resolução do Conflito",
        xp: 200,
        description: "Você editou o código e escolheu a versão definitiva! Marque o arquivo 'app.js' como resolvido com 'git add app.js' e finalize a fusão registrando o commit com 'git commit -m \"fix: resolve conflito de merge\"'.",
        command: 'git add app.js && git commit -m "fix: resolve conflito de merge"',
        checklist: [
            { text: "Marcar conflito resolvido com 'git add app.js'", checkKey: "conflictStaged" },
            { text: "Finalizar o merge commit com 'git commit'", checkKey: "conflictResolved" }
        ],
        hints: [
            "No Git, adicionar o arquivo conflitante ao Staging via 'git add' sinaliza que o conflito foi resolvido.",
            "Ao commitar em seguida, o Git gera o nó de Merge Commit e limpa o estado de MERGING.",
            "Comandos recomendados: primeiro 'git add app.js' e depois 'git commit -m \"fix: resolve conflito de merge\"'."
        ]
    },
    {
        title: "Missão 17: Abortar Fusão",
        xp: 100,
        description: "Se um conflito for complexo demais e você quiser cancelar toda a operação voltando ao estado limpo original de onde partiu, aborte o merge com 'git merge --abort'.",
        command: "git merge --abort",
        checklist: [
            { text: "Cancelar o estado de conflito com 'git merge --abort'", checkKey: "mergeAborted" }
        ],
        hints: [
            "O comando 'git merge --abort' restaura o Working Directory e o ponteiro HEAD exatamente como estavam antes do merge.",
            "É o botão de emergência perfeito quando um merge dá errado.",
            "Comando recomendado: digite 'git merge --abort'."
        ]
    },

    // ─── Módulo 5: Colaboração & Repositórios Remotos ───
    {
        title: "Missão 18: Conexão com Servidor Remoto",
        xp: 150,
        description: "Associe seu repositório local a um servidor remoto na nuvem usando 'git remote add origin https://github.com/gitquest/repo.git' e depois liste os endereços configurados com 'git remote -v'.",
        command: "git remote add origin https://github.com/gitquest/repo.git && git remote -v",
        checklist: [
            { text: "Adicionar remoto 'origin' com 'git remote add'", checkKey: "remoteAdded" },
            { text: "Inspecionar os remotos com 'git remote -v'", checkKey: "remoteViewed" }
        ],
        hints: [
            "Por convenção da indústria, o repositório remoto principal de um projeto recebe o apelido 'origin'.",
            "A flag '-v' (verbose) exibe as URLs de busca (fetch) e envio (push).",
            "Comandos recomendados: digite 'git remote add origin https://github.com/gitquest/repo.git' e depois 'git remote -v'."
        ]
    },
    {
        title: "Missão 19: Publicação com Git Push",
        xp: 200,
        description: "Envie todos os seus commits locais para o servidor remoto com a flag de rastreamento upstream: 'git push -u origin main'.",
        command: "git push -u origin main",
        checklist: [
            { text: "Enviar commits com 'git push -u origin main'", checkKey: "pushedToRemote" }
        ],
        hints: [
            "A flag '-u' (--set-upstream) vincula sua branch local 'main' à branch remota 'origin/main'.",
            "Nos envios futuros, bastará digitar apenas 'git push' sem precisar reespecificar o remoto.",
            "Comando recomendado: digite 'git push -u origin main'."
        ]
    },
    {
        title: "Missão 20: Sincronização com Fetch & Pull",
        xp: 150,
        description: "Colegas de equipe subiram novidades para o repositório! Primeiro baixe as referências com 'git fetch' e em seguida integre as alterações no seu código local com 'git pull'.",
        command: "git fetch && git pull",
        checklist: [
            { text: "Baixar referências remotas com 'git fetch'", checkKey: "fetchedRemote" },
            { text: "Incorporar atualizações com 'git pull'", checkKey: "pulledRemote" }
        ],
        hints: [
            "O 'git fetch' apenas consulta o servidor e atualiza os ponteiros remotos sem tocar no seu código de trabalho.",
            "O 'git pull' combina um 'fetch' com um 'merge', aplicando as alterações no seu Working Directory.",
            "Comandos recomendados: primeiro digite 'git fetch' e em seguida 'git pull'."
        ]
    },

    // ─── Módulo 6: Ferramentas do Dia a Dia (Power Tools) ───
    {
        title: "Missão 21: Gaveta Temporária com Stash",
        xp: 150,
        description: "Você foi interrompido para corrigir um bug urgente, mas suas alterações locais ainda não estão prontas para virar um commit. Guarde tudo na gaveta temporária com 'git stash'.",
        command: "git stash",
        checklist: [
            { text: "Guardar alterações temporárias com 'git stash'", checkKey: "stashSaved" }
        ],
        hints: [
            "O 'git stash' limpa o Working Directory e guarda suas alterações inacabadas em uma pilha de rascunhos.",
            "Isso permite alternar de branch imediatamente sem perder o trabalho em andamento.",
            "Comando recomendado: digite 'git stash' no terminal."
        ]
    },
    {
        title: "Missão 22: Recuperando Trabalho com Stash Pop",
        xp: 150,
        description: "O bug urgente foi resolvido! Agora consulte os stashes salvos com 'git stash list' e recupere seu trabalho de volta na área de trabalho usando 'git stash pop'.",
        command: "git stash list && git stash pop",
        checklist: [
            { text: "Listar stashes salvos com 'git stash list'", checkKey: "stashListed" },
            { text: "Restaurar trabalho com 'git stash pop'", checkKey: "stashPopped" }
        ],
        hints: [
            "O comando 'git stash list' exibe todos os rascunhos salvos com seus respectivos identificadores stash@{0}.",
            "O comando 'git stash pop' retira o último rascunho da pilha e reaplica as alterações no seu Working Directory.",
            "Comandos recomendados: primeiro 'git stash list' e depois 'git stash pop'."
        ]
    },
    {
        title: "Missão 23: Auditoria Linha a Linha com Blame",
        xp: 200,
        description: "Descubra quem escreveu cada linha do arquivo 'app.js', o hash do commit e o momento exato em que a alteração ocorreu usando o comando de auditoria 'git blame app.js'.",
        command: "git blame app.js",
        checklist: [
            { text: "Auditar autoria de código com 'git blame app.js'", checkKey: "blameChecked" }
        ],
        hints: [
            "O 'git blame' exibe linha a linha o autor, commit e carimbo de data/hora de qualquer arquivo rastreado.",
            "É a ferramenta suprema para entender a intenção original de uma lógica de código.",
            "Comando recomendado: digite 'git blame app.js' no terminal."
        ]
    }
]
