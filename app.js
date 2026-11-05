// =============================================================
// app.js — Orquestrador do GitQuest
// Conecta a Engine de Git à Interface do Usuário (UI)
// Estrutura: Imports → Seletores → Estado → Auxiliares → Lógica → Eventos
// =============================================================

import { missions } from './js/missions-data.js'
import { showRetroCelebration } from './js/toast.js'
import { closeMissionsModal, updateModalAndStatsUI, initModalEvents, openMissionsModal } from './js/modal.js'
import { initWelcomeModal, openWelcomeModal } from './js/welcome-modal.js'
import { initVictoryModal, openVictoryModal } from './js/victory-modal.js'

// ─────────────────────────────────────────────
// 1. SELETORES
// Referências aos elementos do HTML que o JS precisa controlar
// ─────────────────────────────────────────────

const terminal = document.querySelector('.panel-terminal')
const promptInput = document.querySelector('.prompt-input')
const terminalOutput = document.querySelector('.terminal-output')

//seletores para os containers da pipeline//

const workingFiles = document.querySelector('.stage-working .stage-files')
const stagingFiles = document.querySelector('.stage-staging .stage-files')
const repositoryFiles = document.querySelector('.stage-repo .stage-files')

/// seletores para o estado de missões
const missionTitleElement = document.querySelector('.mission-title')
const missionDescriptionElement = document.querySelector('.mission-description')
const missionXpElement = document.querySelector('.mission-badge')
const missionCommandElement = document.querySelector('.mission-instruction code')
const missionStepIndicator = document.getElementById('mission-step-indicator')
const missionChecklist = document.getElementById('mission-checklist')
const missionActions = document.getElementById('mission-actions')
const nextMissionBtn = document.getElementById('next-mission-btn')

// Seletores de Dicas Pedagógicas (GEG-19)
const missionHintContainer = document.getElementById('mission-hint-container')
const missionHintBtn = document.getElementById('mission-hint-btn')
const missionHintBadge = document.getElementById('mission-hint-badge')
const missionHintCard = document.getElementById('mission-hint-card')
const missionHintLevelTag = document.getElementById('hint-level-tag')
const missionHintText = document.getElementById('mission-hint-text')

// Seletores do Terminal e Pipeline
const promptLabel = document.getElementById('prompt-label')
const pipelineBranchBadge = document.getElementById('pipeline-branch-badge')

// ─────────────────────────────────────────────
// 2. ESTADO
// Objeto central que representa a "memória" da aplicação.
// Toda decisão de lógica consulta ou atualiza este objeto.
// ────────────────────────────────────────────
const gitState = {
    initialized: false,
    statusChecked: false, // Fase 2: git status
    filesAdded: false,    // Fase 2: git add .
    comitted: false,      // Fase 3: git commit
    commits: [],          // Histórico de commits [{ hash, branch, author, date, msg }]
    logViewed: false,     // Fase 4: git log
    diffViewed: false,    // GEG-21: git diff explorado
    phase5Spawned: false, // Fase 5: geração de múltiplos arquivos
    phase5Added: false,   // Fase 5: git add . para novos arquivos
    phase5Committed: false,// Fase 5: segundo commit
    branchCreated: false, // Fase 6: git branch / checkout para nova branch
    // ─── Módulo 2: Branches & Fusões ───
    branchLoginCreated: false,   // Fase 7: git switch -c feature-login
    switchedBackToMain: false,   // Fase 7: git switch main
    onFeatureLogin: false,       // Fase 8: git switch feature-login
    featureLoginCommitted: false,// Fase 8: git commit na feature
    switchedToMainForMerge: false,// Fase 9: git switch main
    mergeCompleted: false,       // Fase 9: git merge feature-login
    branchDeleted: false,        // Fase 10: git branch -d feature-login
    workingFiles: [],
    stagedFiles: [],
    branches: ['main'],
    currentBranch: 'main',
    history: [],
    position: 0,
    xp: 0,
    currentMissionIndex: 0,
    victoryShown: false,
    hintsRevealed: {}, // { [missionIndex]: quantidade_revelada } (limite de 3 por fase)
}

// Expõe no window para testes e depuração
window.gitState = gitState



// ─────────────────────────────────────────────
// 3. FUNÇÕES AUXILIARES
// Funções puras e reutilizáveis — não conhecem o estado da app
// ─────────────────────────────────────────────

// Imprime uma linha de texto no terminal visual
function parserCommand(command) {
    const trimmed = command.trim()

    if (trimmed === 'clear' || trimmed === 'cls') {
        terminalOutput.innerHTML = ''
        return { base: 'clear', arg: '', msg: '' }
    }

    if (trimmed.includes('-help') || trimmed === 'help') {
        return { base: 'help', arg: '', msg: '' }
    }

    // 1. Caso com flag -m (ex: git commit -m "msg")
    if (trimmed.includes('-m')) {
        const mIndex = trimmed.indexOf('-m')
        const basePart = trimmed.slice(0, mIndex).trim()
        let cleanMsg = trimmed.slice(mIndex + 2).trim()
        // Remove aspas duplas ou simples envolventes da mensagem
        if ((cleanMsg.startsWith('"') && cleanMsg.endsWith('"')) || (cleanMsg.startsWith("'") && cleanMsg.endsWith("'"))) {
            cleanMsg = cleanMsg.slice(1, -1).trim()
        }
        return {
            base: basePart,
            arg: '',
            flag: '-m',
            msg: cleanMsg
        }
    }

    // 2. Comandos com subargumentos e flags (ex: git checkout -b feature, git switch -c feature, git branch feature ou git add .)
    const words = trimmed.split(/\s+/)
    if (words[0] === 'git' && words.length > 2) {
        // Caso especial: git checkout -b <nome>
        if (words[1] === 'checkout' && words[2] === '-b') {
            return {
                base: 'git checkout',
                arg: words.length > 3 ? words[3] : '',
                flag: '-b',
                rawFlag: '-b',
                msg: ''
            }
        }

        // Caso especial: git switch -c <nome> (ou flags equivalentes -C, -b, --create)
        if (words[1] === 'switch' && (words[2] === '-c' || words[2] === '-C' || words[2] === '-b' || words[2] === '--create')) {
            return {
                base: 'git switch',
                arg: words.length > 3 ? words[3] : '',
                flag: '-c',
                rawFlag: words[2],
                msg: ''
            }
        }

        // Caso especial: git branch -d <nome> ou git branch -D <nome> (GEG-51)
        if (words[1] === 'branch' && (words[2] === '-d' || words[2] === '-D')) {
            return {
                base: 'git branch',
                arg: words.length > 3 ? words[3] : '',
                flag: words[2],
                rawFlag: words[2],
                msg: ''
            }
        }

        // Caso especial: git merge [--no-ff] <nome> (GEG-49 / GEG-50)
        if (words[1] === 'merge') {
            const hasNoFf = words.includes('--no-ff')
            const branchName = words.find((w, i) => i > 1 && !w.startsWith('-')) || ''
            return {
                base: 'git merge',
                arg: branchName,
                flag: hasNoFf ? '--no-ff' : '',
                rawFlag: hasNoFf ? '--no-ff' : '',
                msg: ''
            }
        }

        const subCommand = words[1]
        if (subCommand === 'branch' || subCommand === 'checkout' || subCommand === 'switch' || subCommand === 'merge' || subCommand === 'add' || subCommand === 'log' || subCommand === 'status' || subCommand === 'diff') {
            return {
                base: 'git ' + subCommand,
                arg: words.slice(2).join(' '),
                flag: '',
                rawFlag: '',
                msg: ''
            }
        }
    }

    // 3. Comandos normais (ex: git init, git add, git branch, git commit, git status)
    return {
        base: trimmed,
        arg: '',
        flag: '',
        msg: ''
    }
}

function printOutput(message, type = '') {
    const li = document.createElement('li')
    li.textContent = message
    if (type) {
        li.classList.add(type)
    }
    terminalOutput.appendChild(li)
    terminalOutput.scrollTop = terminalOutput.scrollHeight  // auto-scroll para o fim
}

function createFileItem(name, branchTag = '') {
    const div = document.createElement('div')
    div.className = 'file-item'

    if (branchTag) {
        div.innerHTML = `${name} <span class="file-branch-badge ${branchTag === 'main' ? 'badge-main' : 'badge-feature'}">${branchTag}</span>`
    } else {
        div.textContent = name
    }

    return div
}

// Simulação de Diff Visual Realista (GEG-21)
// Exibe diferenças de linhas (+ verde, - vermelho) entre Working Directory, Staging e HEAD
function renderDiffOutput(arg = '') {
    const isStaged = arg.includes('--staged') || arg.includes('--cached')
    const targetFile = arg.replace('--staged', '').replace('--cached', '').trim()

    // 1. Caso: Repositório sem commits e arquivos ainda não indexados no Staging
    if (!gitState.filesAdded && !gitState.comitted) {
        if (isStaged) {
            printOutput('Nenhuma alteração na Staging Area para comparar com HEAD.', 'info')
            printOutput('Dica: use "git add <arquivo>" para indexar antes de ver com "git diff --staged".', 'warning')
            return
        }

        if (!targetFile || targetFile === 'app.js') {
            printOutput('diff --git a/app.js b/app.js', 'diff-header')
            printOutput('--- a/app.js', 'diff-header')
            printOutput('+++ b/app.js', 'diff-header')
            printOutput('@@ -1,3 +1,6 @@', 'diff-range')
            printOutput('+ // GitQuest Engine Core', 'diff-add')
            printOutput('+ const gameTitle = "GitQuest";', 'diff-add')
            printOutput('+ console.log("Sistema inicializado com sucesso!");', 'diff-add')
        }

        if (!targetFile || targetFile === 'style.css') {
            if (!targetFile) printOutput('')
            printOutput('diff --git a/style.css b/style.css', 'diff-header')
            printOutput('--- a/style.css', 'diff-header')
            printOutput('+++ b/style.css', 'diff-header')
            printOutput('@@ -1,2 +1,5 @@', 'diff-range')
            printOutput('+ :root {', 'diff-add')
            printOutput('+     --terminal-bg: #0b0f19;', 'diff-add')
            printOutput('+     --accent-green: #10b981;', 'diff-add')
            printOutput('+ }', 'diff-add')
        }
        return
    }

    // 2. Caso: Arquivos indexados na Staging Area (após git add ., antes do commit)
    if (gitState.filesAdded && !gitState.comitted) {
        if (!isStaged) {
            printOutput('Nenhuma alteração pendente entre o Working Directory e a Staging Area.', 'info')
            printOutput('Dica: seus arquivos já foram indexados! Use "git diff --staged" para ver as alterações prontas para o commit.', 'warning')
            return
        }

        if (!targetFile || targetFile === 'app.js') {
            printOutput('diff --git a/app.js b/app.js (staged)', 'diff-header')
            printOutput('--- /dev/null', 'diff-header')
            printOutput('+++ b/app.js', 'diff-header')
            printOutput('@@ -0,0 +1,5 @@', 'diff-range')
            printOutput('+ // GitQuest Engine Core (Indexado para Commit)', 'diff-add')
            printOutput('+ const gameTitle = "GitQuest";', 'diff-add')
            printOutput('+ console.log("Pronto para o snapshot!");', 'diff-add')
        }

        if (!targetFile || targetFile === 'index.html') {
            if (!targetFile) printOutput('')
            printOutput('diff --git a/index.html b/index.html (staged)', 'diff-header')
            printOutput('--- /dev/null', 'diff-header')
            printOutput('+++ b/index.html', 'diff-header')
            printOutput('@@ -0,0 +1,4 @@', 'diff-range')
            printOutput('+ <!DOCTYPE html>', 'diff-add')
            printOutput('+ <html lang="pt-br">', 'diff-add')
            printOutput('+ <body><div id="app"></div></body>', 'diff-add')
        }
        return
    }

    // 3. Caso: Fase 5 (Múltiplos novos arquivos: components.js, README.md)
    if (gitState.currentMissionIndex === 4) {
        if (!gitState.phase5Added) {
            if (isStaged) {
                printOutput('Nenhuma alteração na Staging Area. Use "git add ." para indexar.', 'info')
                return
            }
            printOutput('diff --git a/components.js b/components.js', 'diff-header')
            printOutput('--- a/components.js', 'diff-header')
            printOutput('+++ b/components.js', 'diff-header')
            printOutput('@@ -1,2 +1,5 @@', 'diff-range')
            printOutput('- // Versão legada', 'diff-remove')
            printOutput('+ export function createCard(title) {', 'diff-add')
            printOutput('+     return `<div class="card">${title}</div>`;', 'diff-add')
            printOutput('+ }', 'diff-add')
            printOutput('')
            printOutput('diff --git a/README.md b/README.md', 'diff-header')
            printOutput('--- /dev/null', 'diff-header')
            printOutput('+++ b/README.md', 'diff-header')
            printOutput('@@ -0,0 +1,3 @@', 'diff-range')
            printOutput('+ # Documentação GitQuest', 'diff-add')
            printOutput('+ Guia interativo do desenvolvedor.', 'diff-add')
            return
        } else if (gitState.phase5Added && !gitState.phase5Committed) {
            if (!isStaged) {
                printOutput('Nenhuma alteração pendente entre o Working Directory e a Staging Area.', 'info')
                printOutput('Dica: use "git diff --staged" para ver as alterações prontas para o commit.', 'warning')
                return
            }
            printOutput('diff --git a/components.js b/components.js (staged)', 'diff-header')
            printOutput('--- a/components.js', 'diff-header')
            printOutput('+++ b/components.js', 'diff-header')
            printOutput('@@ -1,2 +1,5 @@', 'diff-range')
            printOutput('- // Versão legada', 'diff-remove')
            printOutput('+ export function createCard(title) {', 'diff-add')
            printOutput('+     return `<div class="card">${title}</div>`;', 'diff-add')
            printOutput('+ }', 'diff-add')
            return
        }
    }

    // 4. Caso padrão: Working tree limpa
    printOutput('working tree clean. Nenhuma diferença em relação ao último commit (HEAD).', 'success')
}

function updatePromptAndPipelineBranch() {
    if (promptLabel) {
        if (gitState.initialized) {
            promptLabel.innerHTML = `guest@gitquest <span class="prompt-branch">(${gitState.currentBranch})</span>:~$ `
        } else {
            promptLabel.textContent = 'guest@gitquest:~$ '
        }
    }
    if (pipelineBranchBadge) {
        pipelineBranchBadge.textContent = `HEAD ➔ ${gitState.currentBranch}`
        pipelineBranchBadge.style.borderColor = 'var(--accent-color)'
        setTimeout(() => {
            pipelineBranchBadge.style.borderColor = 'var(--accent-terminal)'
        }, 350)
    }
}

function isMissionCompleted(mission) {
    if (!mission || !mission.checklist) return false
    return mission.checklist.every(item => Boolean(gitState[item.checkKey]))
}

function advanceToNextMission() {
    const current = missions[gitState.currentMissionIndex]
    if (!current || !isMissionCompleted(current)) {
        printOutput('Você precisa concluir todos os objetivos desta fase antes de avançar!', 'warning')
        return
    }

    if (gitState.currentMissionIndex < missions.length - 1) {
        gitState.currentMissionIndex++
        renderMission()
        if (promptInput) {
            promptInput.value = ''
            promptInput.placeholder = ''
            promptInput.focus()
        }
        if (missions[gitState.currentMissionIndex]) {
            printOutput(`Navegando para ${missions[gitState.currentMissionIndex].title}!`, 'info')
        }
    } else if (gitState.currentMissionIndex === missions.length - 1) {
        // Última fase: avança para o estado final de vitória
        gitState.currentMissionIndex++
        renderMission()
        if (promptInput) {
            promptInput.value = ''
            promptInput.placeholder = ''
        }
        openVictoryModal(gitState.xp)
    }
}

function updateHintUI() {
    const current = missions[gitState.currentMissionIndex]

    if (!current || !missionHintContainer) {
        if (missionHintContainer) missionHintContainer.classList.add('hidden')
        if (missionHintBtn) missionHintBtn.classList.add('hidden')
        return
    }

    if (missionHintBtn) missionHintBtn.classList.remove('hidden')
    const missionHints = current.hints || []
    const maxHints = Math.min(3, missionHints.length)
    const revealed = gitState.hintsRevealed[gitState.currentMissionIndex] || 0
    const remaining = Math.max(0, maxHints - revealed)

    // O card de dica só aparece depois que o jogador pede a primeira dica
    missionHintContainer.classList.toggle('hidden', revealed === 0)

    const btnTextSpan = missionHintBtn ? missionHintBtn.querySelector('.hint-btn-text') : null

    if (revealed === 0) {
        if (missionHintCard) missionHintCard.classList.add('hidden')
        if (missionHintBadge) missionHintBadge.textContent = `${maxHints} restantes`
        if (missionHintBtn) missionHintBtn.disabled = false
        if (btnTextSpan) btnTextSpan.textContent = 'Pedir Dica'
    } else {
        if (missionHintCard) missionHintCard.classList.remove('hidden')
        if (missionHintLevelTag) missionHintLevelTag.textContent = `Dica ${revealed} de ${maxHints}`
        if (missionHintText) missionHintText.textContent = missionHints[revealed - 1] || ''

        if (remaining <= 0) {
            if (missionHintBadge) missionHintBadge.textContent = 'Limite atingido'
            if (missionHintBtn) missionHintBtn.disabled = true
            if (btnTextSpan) btnTextSpan.textContent = 'Limite Atingido'
        } else {
            const labelRestante = remaining === 1 ? '1 restante' : `${remaining} restantes`
            if (missionHintBadge) missionHintBadge.textContent = labelRestante
            if (missionHintBtn) missionHintBtn.disabled = false
            if (btnTextSpan) btnTextSpan.textContent = 'Próxima Dica'
        }
    }
}

function renderMission() {
    const current = missions[gitState.currentMissionIndex]

    if (current) {
        missionTitleElement.textContent = current.title
        missionDescriptionElement.textContent = current.description
        if (missionXpElement) missionXpElement.textContent = '+' + current.xp + ' XP'
        if (missionCommandElement) missionCommandElement.textContent = current.command
        if (missionStepIndicator) {
            missionStepIndicator.textContent = 'Fase ' + (gitState.currentMissionIndex + 1) + ' de ' + missions.length
        }


        // Fase 5: Gera múltiplos arquivos no Working Directory caso ainda não existam
        if (gitState.currentMissionIndex === 4 && !gitState.phase5Spawned) {
            gitState.phase5Spawned = true
            workingFiles.appendChild(createFileItem('components.js'))
            workingFiles.appendChild(createFileItem('README.md'))
            printOutput('Novos arquivos detectados no Working Directory: components.js, README.md', 'info')
        }

        // Renderiza o checklist de objetivos da missão (GEG-18)
        if (missionChecklist && current.checklist) {
            missionChecklist.innerHTML = ''
            current.checklist.forEach(item => {
                const isDone = Boolean(gitState[item.checkKey])
                const li = document.createElement('li')
                li.className = 'checklist-item' + (isDone ? ' completed' : '')
                li.innerHTML = `
                    <span class="checklist-box">${isDone ? '✔' : ''}</span>
                    <span class="checklist-text">${item.text}</span>
                `
                missionChecklist.appendChild(li)
            })
        }

        // Sincroniza o componente de dicas da fase (GEG-19)
        updateHintUI()

        // Botão de Próxima Fase ao lado do Título
        const allCompleted = isMissionCompleted(current)
        if (missionActions) {
            missionActions.classList.remove('hidden')
        }
        if (nextMissionBtn) {
            if (allCompleted) {
                nextMissionBtn.disabled = false
                nextMissionBtn.classList.remove('disabled')
                nextMissionBtn.classList.add('ready')
                if (gitState.currentMissionIndex === missions.length - 1) {
                    nextMissionBtn.textContent = 'Concluir Trilha 🏆'
                    nextMissionBtn.title = 'Concluir a trilha e comemorar a vitória! (ou pressione ENTER)'
                    if (promptInput) promptInput.placeholder = 'Fase concluída! Pressione [ENTER] para ver sua vitória 🏆'
                } else {
                    nextMissionBtn.textContent = 'Próxima Fase ➔'
                    nextMissionBtn.title = 'Avançar para a próxima fase (ou pressione ENTER)'
                    if (promptInput) promptInput.placeholder = 'Fase concluída! Pressione [ENTER] para avançar ➔'
                }
            } else {
                nextMissionBtn.disabled = true
                nextMissionBtn.classList.add('disabled')
                nextMissionBtn.classList.remove('ready')
                nextMissionBtn.title = 'Complete os objetivos desta fase para avançar'
                nextMissionBtn.textContent = 'Próxima Fase ➔'
                if (promptInput) promptInput.placeholder = ''
            }
        }
    } else {
        // 🎉 ESTADO DE VITÓRIA (quando terminar todas as missões)!
        missionTitleElement.textContent = '🏆 Trilha Concluída!'
        if (missionStepIndicator) {
            missionStepIndicator.textContent = 'Trilha 100% concluída'
        }
        missionDescriptionElement.textContent = 'Parabéns, dev! Você dominou o ciclo completo do Git: init, add, commit e branches!'
        if (missionXpElement) missionXpElement.textContent = 'Nível 1 • ' + gitState.xp + ' XP'
        if (missionCommandElement) missionCommandElement.textContent = 'git status / git branch'


        if (missionChecklist) {
            missionChecklist.innerHTML = `
                <li class="checklist-item completed">
                    <span class="checklist-box">✔</span>
                    <span class="checklist-text">Todas as missões desta trilha foram concluídas!</span>
                </li>
            `
        }

        // Oculta dicas e banner no estado final de vitória
        updateHintUI()
        if (missionActions) {
            missionActions.classList.add('hidden')
        }

        // Exibe o modal de vitória (GEG-18)
        if (!gitState.victoryShown) {
            gitState.victoryShown = true
            openVictoryModal(gitState.xp)
        }
    }

    // Sincroniza o Modal, o Pill Global e a visualização da branch
    updateModalAndStatsUI(gitState.currentMissionIndex, gitState.xp)
    updatePromptAndPipelineBranch()
}
window.renderMission = renderMission




// ─────────────────────────────────────────────
// 4. LÓGICA
// Funções que processam comandos e atualizam o estado
// ─────────────────────────────────────────────

// Interpreta o comando digitado e executa a ação correspondente
// Analisador de Erros Pedagógicos (GEG-19)
// Substitui mensagens de erro crípticas por orientações contextuais e educativas
function handlePedagogicalError(command, parsed) {
    const trimmed = (command || '').trim()
    const words = trimmed.split(/\s+/)
    const firstWord = (words[0] || '').toLowerCase()
    const current = missions[gitState.currentMissionIndex]

    // 1. Digitou sem o prefixo "git" (ex: init, add ., commit -m "...")
    const gitCommands = ['init', 'add', 'commit', 'status', 'branch', 'checkout', 'log', 'diff', 'push', 'pull', 'clone', 'merge']
    if (gitCommands.includes(firstWord)) {
        printOutput(`Comando '${words[0]}' não encontrado no ambiente.`, 'error')
        printOutput(`Dica: no Git, todos os comandos devem começar com 'git'. Tente executar: git ${trimmed}`, 'warning')
        return
    }

    // 2. Erros de digitação comuns no prefixo "git" (ex: gt, got, gti, gi, etc.)
    const gitTypos = ['gt', 'got', 'gti', 'gitt', 'gi', 'gut']
    if (gitTypos.includes(firstWord)) {
        printOutput(`Comando '${words[0]}' não reconhecido.`, 'error')
        const rest = words.slice(1).join(' ')
        printOutput(`Dica: você quis dizer 'git'? Tente: git ${rest}`.trim(), 'warning')
        return
    }

    // 3. Subcomandos do git com erro ortográfico
    if (firstWord === 'git' && words.length > 1) {
        const sub = (words[1] || '').toLowerCase()
        const typoMap = {
            'comit': 'commit',
            'commti': 'commit',
            'commmit': 'commit',
            'cm': 'commit',
            'ad': 'add',
            'aad': 'add',
            'statsu': 'status',
            'staus': 'status',
            'st': 'status',
            'stat': 'status',
            'chekout': 'checkout',
            'checout': 'checkout',
            'co': 'checkout',
            'brnach': 'branch',
            'brabch': 'branch',
            'br': 'branch',
            'int': 'init',
            'ini': 'init',
            'initt': 'init',
            'dif': 'diff',
            'dff': 'diff',
            'difff': 'diff',
            'swich': 'switch',
            'swtich': 'switch',
            'sw': 'switch',
            'merg': 'merge',
            'megre': 'merge',
            'mrg': 'merge'
        }

        if (typoMap[sub]) {
            const suggestion = `git ${typoMap[sub]}${words.length > 2 ? ' ' + words.slice(2).join(' ') : ''}`
            printOutput(`git: '${sub}' não é um comando git válido.`, 'error')
            printOutput(`Dica: você quis dizer '${suggestion}'?`, 'warning')
            return
        }

        // Subcomandos remotos ainda não ativos nesta trilha local
        if (sub === 'push' || sub === 'pull' || sub === 'clone' || sub === 'remote') {
            printOutput(`git: '${sub}' opera com repositórios remotos.`, 'warning')
            printOutput(`Dica: nesta trilha estamos aprendendo os comandos locais (init, add, commit, branch).`, 'info')
            return
        }
    }

    // 4. Erro genérico com contextualização pedagógica da fase atual
    printOutput('Comando não reconhecido: ' + command, 'error')
    if (current) {
        const goalSummary = current.checklist && current.checklist[0] ? current.checklist[0].text : current.description
        printOutput(`Dica: você está na '${current.title}'. Objetivo: ${goalSummary}.`, 'info')
        printOutput(`Clique no botão 'Pedir Dica' no painel de missões para ver uma sugestão contextual!`, 'info')
    } else {
        printOutput(`Digite 'help' para listar os comandos disponíveis no GitQuest.`, 'info')
    }
}

// Interpreta o comando digitado e executa a ação correspondente
function processCommand(command) {
    const parsed = parserCommand(command)

    switch (parsed.base) {
        case 'clear':
        case 'cls':
            break

        case 'help':
            printOutput('Comandos disponíveis: git init, git add ., git commit -m "...", git status, git diff, git diff --staged, git log, git branch, git branch <nome>, git branch -d <nome>, git checkout <nome>, git checkout -b <nome>, git switch <nome>, git switch -c <nome>, git merge <nome>, clear', 'info')
            break

        case 'git status':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: você precisa inicializar o repositório com "git init" antes de checar o status.', 'warning')
                break
            }

            printOutput(`On branch ${gitState.currentBranch}`, 'info')

            if (gitState.commits.length === 0) {
                printOutput('No commits yet', 'warning')
            }

            // Suporte de status para a Fase 5 (múltiplos arquivos)
            if (gitState.currentMissionIndex === 4) {
                if (!gitState.phase5Added) {
                    printOutput('Untracked files:', 'warning')
                    printOutput('  (use "git add <file>..." to include in what will be committed)', 'info')
                    printOutput('	components.js', 'error')
                    printOutput('	README.md', 'error')
                    printOutput('nothing added to commit but untracked files present (use "git add ." to track)')
                } else if (gitState.phase5Added && !gitState.phase5Committed) {
                    printOutput('Changes to be committed:', 'info')
                    printOutput('  (use "git restore --staged <file>..." to unstage)', 'info')
                    printOutput('	new file:   components.js', 'success')
                    printOutput('	new file:   README.md', 'success')
                } else {
                    printOutput('nothing to commit, working tree clean', 'success')
                }
            } else if (!gitState.filesAdded && !gitState.comitted) {
                printOutput('Untracked files:', 'warning')
                printOutput('  (use "git add <file>..." to include in what will be committed)', 'info')
                printOutput('	app.js', 'error')
                printOutput('	index.html', 'error')
                printOutput('	style.css', 'error')
                printOutput('nothing added to commit but untracked files present (use "git add ." to track)')
            } else if (gitState.filesAdded && !gitState.comitted) {
                printOutput('Changes to be committed:', 'info')
                printOutput('  (use "git restore --staged <file>..." to unstage)', 'info')
                printOutput('	new file:   app.js', 'success')
                printOutput('	new file:   index.html', 'success')
                printOutput('	new file:   style.css', 'success')
            } else {
                printOutput('nothing to commit, working tree clean', 'success')
            }

            // Checagem de objetivo da Fase 2 (GEG-20)
            if (gitState.currentMissionIndex === 1 && !gitState.statusChecked) {
                gitState.statusChecked = true
                gitState.xp += 25
                renderMission()
                showRetroCelebration('+25 XP!', 'STATUS DO REPOSITÓRIO INSPECIONADO')
            }
            break

        case 'git diff':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: você precisa inicializar o repositório com "git init" antes de checar as diferenças.', 'warning')
                break
            }

            renderDiffOutput(parsed.arg)

            // Checagem de objetivo da Fase 5 (GEG-21: Inspeção de Diferenças)
            if (gitState.currentMissionIndex === 4 && !gitState.diffViewed) {
                gitState.diffViewed = true
                gitState.xp += 75
                renderMission()
                showRetroCelebration('+75 XP CONQUISTADO!', 'DIFERENÇAS INSPECIONADAS COM GIT DIFF!')
            } else if (!gitState.diffViewed) {
                gitState.diffViewed = true
                showRetroCelebration('GIT DIFF EXPLORADO!', 'COMPARAÇÃO DE CÓDIGO LINHA A LINHA')
            }
            break

        case 'git log':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: execute "git init" para inicializar o repositório.', 'warning')
                break
            }

            if (gitState.commits.length === 0) {
                printOutput(`fatal: your current branch '${gitState.currentBranch}' does not have any commits yet`, 'error')
                printOutput('Dica: grave seu primeiro snapshot com "git commit -m \\"...\\"" antes de usar "git log".', 'warning')
                break
            }

            if (parsed.arg && parsed.arg.includes('--oneline')) {
                gitState.commits.forEach(c => {
                    printOutput(`${c.hash.substring(0, 7)} ${c.msg}`, 'info')
                })
            } else {
                gitState.commits.forEach(c => {
                    printOutput(`commit ${c.hash} (HEAD -> ${c.branch})`, 'warning')
                    if (c.mergeParents) {
                        printOutput(`Merge: ${c.mergeParents.join(' ')}`, 'info')
                    }
                    printOutput(`Author: ${c.author}`)
                    printOutput(`Date:   ${c.date}`)
                    printOutput('')
                    printOutput(`    ${c.msg}`)
                    printOutput('')
                })
            }

            // Checagem de objetivo da Fase 4 (GEG-20)
            if (gitState.currentMissionIndex === 3 && !gitState.logViewed) {
                gitState.logViewed = true
                gitState.xp += 75
                renderMission()
                showRetroCelebration('+75 XP CONQUISTADO!', 'HISTÓRICO EXPLORADO!')
            }
            break

        case 'git branch':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: inicialize o repositório primeiro com "git init".', 'warning')
                break
            }

            // Exclusão de branch com flag -d ou -D (GEG-51)
            if (parsed.flag === '-d' || parsed.flag === '-D') {
                if (!parsed.arg) {
                    printOutput("fatal: branch name required", "error")
                    printOutput("Dica: informe o nome da branch a ser excluída. Exemplo: git branch -d feature-login", "warning")
                    break
                }
                if (parsed.arg === gitState.currentBranch) {
                    printOutput(`error: Cannot delete branch '${parsed.arg}' checked out at '/gitquest'`, 'error')
                    printOutput(`Dica: você não pode deletar a branch na qual está posicionado. Mude para 'main' com "git switch main" antes de deletar.`, 'warning')
                    break
                }
                const bIndex = gitState.branches.indexOf(parsed.arg)
                if (bIndex === -1) {
                    printOutput(`error: branch '${parsed.arg}' not found.`, 'error')
                    break
                }
                gitState.branches.splice(bIndex, 1)
                const commitHash = gitState.commits.length > 0 ? gitState.commits[0].hash.substring(0, 7) : '3f8b91a'
                printOutput(`Deleted branch ${parsed.arg} (was ${commitHash}).`, 'success')
                showRetroCelebration(`BRANCH '${parsed.arg.toUpperCase()}' DELETADA!`, 'LIMPEZA REALIZADA COM SUCESSO')

                // Checagem de objetivo da Fase 10 (Módulo 2 / GEG-51)
                if (gitState.currentMissionIndex === 9 && !gitState.branchDeleted) {
                    gitState.branchDeleted = true
                    gitState.xp += 100
                    renderMission()
                }
                break
            }

            // Se passou o nome (ex: git branch feature-login) ➔ CRIA a nova branch
            if (parsed.arg) {
                if (gitState.commits.length === 0) {
                    printOutput(`fatal: not a valid object name: 'main'`, 'error')
                    printOutput('Dica: branches são ponteiros para commits. Crie o primeiro commit antes de ramificar!', 'warning')
                    break
                }
                if (gitState.branches.includes(parsed.arg)) {
                    printOutput(`fatal: a branch named '${parsed.arg}' already exists`, 'error')
                } else {
                    gitState.branches.push(parsed.arg)
                    printOutput(`Branch '${parsed.arg}' criada com sucesso!`, 'success')
                }
            }
            // Se NÃO passou nome (apenas "git branch") ➔ LISTA as branches existentes
            else {
                gitState.branches.forEach(function (branch) {
                    if (branch === gitState.currentBranch) {
                        printOutput('* ' + branch, 'success')
                    } else {
                        printOutput('  ' + branch)
                    }
                })
            }
            break

        case 'git checkout':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: execute "git init" para inicializar o repositório.', 'warning')
                break
            }

            if (!parsed.arg && parsed.flag !== '-b') {
                printOutput('fatal: branch name required for checkout', 'error')
                printOutput('Dica: especifique o nome da branch. Exemplo: git checkout main ou git checkout -b feature-auth', 'warning')
                break
            }

            // Se usou a flag -b (ex: git checkout -b feature-auth) ➔ CRIA E ALTERNA SIMULTANEAMENTE!
            if (parsed.flag === '-b') {
                if (!parsed.arg) {
                    printOutput("fatal: '-b' requires a branch name", 'error')
                    printOutput('Dica: especifique o nome da branch após a flag -b. Exemplo: git checkout -b feature-auth', 'warning')
                    break
                }

                if (gitState.commits.length === 0) {
                    printOutput(`fatal: not a valid object name: 'main'`, 'error')
                    printOutput('Dica: grave seu primeiro commit antes de ramificar com "git checkout -b"!', 'warning')
                    break
                }

                if (gitState.branches.includes(parsed.arg)) {
                    printOutput(`fatal: a branch named '${parsed.arg}' already exists`, 'error')
                    break
                }

                gitState.branches.push(parsed.arg)
                gitState.currentBranch = parsed.arg
                updatePromptAndPipelineBranch()
                printOutput(`Switched to a new branch '${parsed.arg}'`, 'success')
                printOutput(`Dica moderna: no Git 2.23+, você também pode usar "git switch -c ${parsed.arg}", separando ramificações de arquivos!`, 'info')
                showRetroCelebration(`BRANCH '${parsed.arg.toUpperCase()}'!`, 'NOVA RAMIFICAÇÃO CRIADA')

                // Checagem de objetivo da Fase 6 (GEG-20: Ramificações)
                if (parsed.arg === 'feature-auth' || gitState.currentMissionIndex === 5) {
                    if (!gitState.branchCreated) {
                        gitState.branchCreated = true
                        gitState.xp += 150
                        renderMission()
                    }
                }
                break
            }

            // Checkout comum (alternar para branch existente)
            if (!gitState.branches.includes(parsed.arg)) {
                printOutput(`error: pathspec '${parsed.arg}' did not match any file(s) known to git`, 'error')
                printOutput(`Dica: a branch '${parsed.arg}' não existe. Para criá-la e alternar ao mesmo tempo, use: git checkout -b ${parsed.arg} ou git switch -c ${parsed.arg}`, 'warning')
            } else if (parsed.arg === gitState.currentBranch) {
                printOutput(`Already on '${parsed.arg}'`, 'warning')
            } else {
                gitState.currentBranch = parsed.arg
                updatePromptAndPipelineBranch()
                printOutput(`Switched to branch '${parsed.arg}'`, 'success')

                // Checagem de objetivo da Fase 6 caso alterne para feature-auth
                if (parsed.arg === 'feature-auth' || gitState.currentMissionIndex === 5) {
                    if (!gitState.branchCreated) {
                        gitState.branchCreated = true
                        gitState.xp += 150
                        renderMission()
                    }
                }
            }
            break

        case 'git switch':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: execute "git init" para inicializar o repositório.', 'warning')
                break
            }

            if (gitState.commits.length === 0) {
                printOutput(`fatal: your current branch '${gitState.currentBranch}' does not have any commits yet`, 'error')
                printOutput('Dica: crie seu primeiro snapshot com "git commit -m \\"...\\"" antes de ramificar com "git switch"!', 'warning')
                break
            }

            // Caso 1: Criação e alternância simultânea: git switch -c <nome>
            if (parsed.flag === '-c') {
                if (!parsed.arg) {
                    printOutput("fatal: missing branch name for '-c'", 'error')
                    printOutput('Dica: especifique o nome da branch após a flag -c. Exemplo: git switch -c feature-auth', 'warning')
                    break
                }

                if (gitState.branches.includes(parsed.arg)) {
                    printOutput(`fatal: a branch named '${parsed.arg}' already exists`, 'error')
                    printOutput(`Dica: a branch já existe. Para apenas alternar para ela, use: git switch ${parsed.arg}`, 'warning')
                    break
                }

                if (parsed.rawFlag === '-b') {
                    printOutput('(Nota pedagógica: no "git switch", a flag canônica é "-c" de create, enquanto "-b" pertencia ao "git checkout" legado)', 'info')
                }

                gitState.branches.push(parsed.arg)
                gitState.currentBranch = parsed.arg
                updatePromptAndPipelineBranch()
                printOutput(`Switched to a new branch '${parsed.arg}'`, 'success')
                showRetroCelebration(`BRANCH '${parsed.arg.toUpperCase()}'!`, 'NOVA RAMIFICAÇÃO COM GIT SWITCH')

                // Checagem de objetivo da Fase 6 (GEG-20 / GEG-48)
                if (parsed.arg === 'feature-auth' || gitState.currentMissionIndex === 5) {
                    if (!gitState.branchCreated) {
                        gitState.branchCreated = true
                        gitState.xp += 150
                        renderMission()
                    }
                }

                // Checagem de objetivo da Fase 7 (Módulo 2: git switch -c feature-login)
                if (gitState.currentMissionIndex === 6 && (parsed.arg === 'feature-login' || !gitState.branchLoginCreated)) {
                    gitState.branchLoginCreated = true
                    renderMission()
                }
                break
            }

            // Caso 2: Sem argumento de branch
            if (!parsed.arg) {
                printOutput('fatal: missing branch or commit argument', 'error')
                printOutput('Dica: especifique a branch para a qual deseja alternar. Exemplo: git switch main ou crie com git switch -c feature-auth', 'warning')
                break
            }

            // Caso 3: Alternar para branch existente
            if (!gitState.branches.includes(parsed.arg)) {
                printOutput(`fatal: invalid reference: ${parsed.arg}`, 'error')
                printOutput(`Dica: a branch '${parsed.arg}' não existe localmente. Para criá-la e alternar ao mesmo tempo, use: git switch -c ${parsed.arg}`, 'warning')
            } else if (parsed.arg === gitState.currentBranch) {
                printOutput(`Already on '${parsed.arg}'`, 'warning')
            } else {
                gitState.currentBranch = parsed.arg
                updatePromptAndPipelineBranch()
                printOutput(`Switched to branch '${parsed.arg}'`, 'success')

                // Checagem de objetivo da Fase 6 caso alterne para feature-auth
                if (parsed.arg === 'feature-auth' || gitState.currentMissionIndex === 5) {
                    if (!gitState.branchCreated) {
                        gitState.branchCreated = true
                        gitState.xp += 150
                        renderMission()
                    }
                }

                // Checagem de objetivo da Fase 7 (Módulo 2: retorno para main)
                if (gitState.currentMissionIndex === 6 && parsed.arg === 'main' && gitState.branchLoginCreated && !gitState.switchedBackToMain) {
                    gitState.switchedBackToMain = true
                    gitState.xp += 100
                    renderMission()
                    showRetroCelebration('+100 XP CONQUISTADO!', 'COMANDO SWITCH DOMINADO!')
                }

                // Checagem de objetivo da Fase 8 (Módulo 2: switch para feature-login)
                if (gitState.currentMissionIndex === 7 && parsed.arg === 'feature-login' && !gitState.onFeatureLogin) {
                    gitState.onFeatureLogin = true
                    renderMission()
                }

                // Checagem de objetivo da Fase 9 (Módulo 2: retorno para main para preparar o merge)
                if (gitState.currentMissionIndex === 8 && parsed.arg === 'main' && !gitState.switchedToMainForMerge) {
                    gitState.switchedToMainForMerge = true
                    renderMission()
                }
            }
            break

        case 'git merge':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: execute "git init" para inicializar o repositório.', 'warning')
                break
            }

            if (!parsed.arg) {
                printOutput('fatal: No commit specified and merge.default unspecified.', 'error')
                printOutput('Dica: especifique o nome da branch a ser fundida. Exemplo: git merge feature-login', 'warning')
                break
            }

            if (!gitState.branches.includes(parsed.arg)) {
                printOutput(`merge: ${parsed.arg} - not something we can merge`, 'error')
                printOutput(`Dica: a branch '${parsed.arg}' não existe no repositório local.`, 'warning')
                break
            }

            if (parsed.arg === gitState.currentBranch) {
                printOutput('Already up to date.', 'info')
                printOutput(`Dica: você já está na branch '${parsed.arg}'. Para fundir alterações, posicione-se na branch de destino (ex: main).`, 'warning')
                break
            }

            // Caso Three-Way Merge (com flag --no-ff ou fusão com histórico divergente - GEG-50)
            if (parsed.flag === '--no-ff') {
                const mergeHash = Math.random().toString(16).substring(2, 9)
                const p1 = gitState.commits.length > 0 ? gitState.commits[0].hash.substring(0, 7) : '7a4e12b'
                const p2 = '3f8b91a'
                gitState.commits.unshift({
                    hash: mergeHash,
                    branch: gitState.currentBranch,
                    author: 'Dev Aprendiz <guest@gitquest.dev>',
                    date: new Date().toUTCString(),
                    msg: `Merge branch '${parsed.arg}' into ${gitState.currentBranch}`,
                    mergeParents: [p1, p2]
                })

                repositoryFiles.appendChild(createFileItem(`merge-commit (${parsed.arg})`, gitState.currentBranch))

                printOutput(`Merge made by the 'ort' strategy.`, 'info')
                printOutput(' login.html | 24 ++++++++++++++++++++++++', 'diff-add')
                printOutput(' login.css  | 18 ++++++++++++++++++', 'diff-add')
                printOutput(' 2 files changed, 42 insertions(+)', 'success')
                showRetroCelebration('THREE-WAY MERGE!', 'NÓ DE MERGE COMMIT GERADO')

                if (gitState.currentMissionIndex === 8 && !gitState.mergeCompleted) {
                    gitState.mergeCompleted = true
                    gitState.xp += 200
                    renderMission()
                }
                break
            }

            // Fusão linear Fast-Forward (GEG-49)
            const oldHash = gitState.commits.length > 1 ? gitState.commits[1].hash.substring(0, 7) : '7a4e12b'
            const newHash = gitState.commits.length > 0 ? gitState.commits[0].hash.substring(0, 7) : '3f8b91a'
            printOutput(`Updating ${oldHash}..${newHash}`, 'info')
            printOutput('Fast-forward', 'warning')
            printOutput(' login.html | 24 ++++++++++++++++++++++++', 'diff-add')
            printOutput(' login.css  | 18 ++++++++++++++++++', 'diff-add')
            printOutput(' 2 files changed, 42 insertions(+)', 'success')
            showRetroCelebration('FAST-FORWARD!', 'FUSÃO LINEAR REALIZADA COM SUCESSO')

            // Checagem de objetivo da Fase 9 (Módulo 2 / GEG-49)
            if (gitState.currentMissionIndex === 8 && !gitState.mergeCompleted) {
                gitState.mergeCompleted = true
                gitState.xp += 200
                renderMission()
            }
            break

        case 'git init':
            if (gitState.initialized) {
                printOutput('Repositório já inicializado.', 'warning')
                printOutput('Dica: o repositório já está ativo (.git criado). O próximo passo é preparar arquivos com "git add .".', 'info')
            } else {
                gitState.initialized = true
                workingFiles.appendChild(createFileItem('index.html'))
                workingFiles.appendChild(createFileItem('style.css'))
                workingFiles.appendChild(createFileItem('app.js'))
                printOutput('Repositório Git inicializado com sucesso!', 'success')

                gitState.xp += 50
                renderMission()
                updatePromptAndPipelineBranch()
                showRetroCelebration('+50 XP CONQUISTADO!', 'MISSÃO 01: O INÍCIO')
            }
            break

        case 'git add':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: você precisa inicializar o repositório primeiro com "git init".', 'warning')
                break
            }

            if (!parsed.arg) {
                printOutput('Nada especificado, nada adicionado.', 'warning')
                printOutput('Dica: use "git add ." com ponto para incluir todos os arquivos da pasta atual.', 'info')
                break
            }

            if (parsed.arg !== '.' && parsed.arg !== '-A' && parsed.arg !== '--all') {
                printOutput(`fatal: pathspec '${parsed.arg}' did not match any files (use "git add ." para adicionar todos os arquivos)`, 'error')
                printOutput('Dica: nesta missão, utilize a notação de ponto: "git add ." para rastrear todos os arquivos.', 'warning')
                break
            }

            // Suporte para Fase 5 (múltiplos arquivos)
            if (gitState.currentMissionIndex === 4) {
                if (gitState.phase5Added) {
                    printOutput('Arquivos já adicionados ao staging.', 'warning')
                    printOutput('Dica: seus novos arquivos já estão preparados. Grave o snapshot com: git commit -m "feat: novos componentes".', 'info')
                    break
                }

                gitState.phase5Added = true
                workingFiles.innerHTML = ''
                stagingFiles.appendChild(createFileItem('components.js'))
                stagingFiles.appendChild(createFileItem('README.md'))

                printOutput('Novos arquivos adicionados ao staging area!', 'success')

                gitState.xp += 50
                renderMission()
                showRetroCelebration('+50 XP CONQUISTADO!', 'MÚLTIPLOS ARQUIVOS NO STAGING')
                break
            }

            // Suporte para Fase 8 (arquivos de feature no Módulo 2)
            if (gitState.currentMissionIndex === 7) {
                workingFiles.innerHTML = ''
                stagingFiles.appendChild(createFileItem('login.html'))
                stagingFiles.appendChild(createFileItem('login.css'))
                printOutput('Novos arquivos de login adicionados ao staging area!', 'success')
                break
            }

            if (gitState.filesAdded) {
                printOutput('Arquivos já adicionados ao staging.', 'warning')
                printOutput('Dica: seus arquivos já estão preparados. Agora crie um snapshot com: git commit -m "Initial commit".', 'info')
                break
            }

            gitState.filesAdded = true
            workingFiles.innerHTML = ''
            stagingFiles.appendChild(createFileItem('index.html'))
            stagingFiles.appendChild(createFileItem('style.css'))
            stagingFiles.appendChild(createFileItem('app.js'))

            printOutput('Arquivos adicionados ao staging area!', 'success')

            gitState.xp += 25
            renderMission()
            showRetroCelebration('+25 XP CONQUISTADO!', 'MISSÃO 02: STAGING AREA')
            break

        case 'git commit':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                printOutput('Dica: inicialize o repositório com "git init" antes de tentar commitar.', 'warning')
                break
            }

            if (parsed.flag !== '-m') {
                printOutput('fatal: use a flag -m para informar a mensagem do commit. Ex: git commit -m "sua mensagem"', 'error')
                printOutput('Dica: o Git exige uma mensagem descritiva. Exemplo: git commit -m "Initial commit"', 'warning')
                break
            }

            if (!parsed.msg || parsed.msg.trim() === '') {
                printOutput('Aborting commit due to empty commit message.', 'error')
                printOutput('Dica: informe o que foi alterado dentro das aspas da flag -m. Exemplo: git commit -m "Initial commit"', 'warning')
                break
            }

            // Suporte para Fase 5 (segundo commit com múltiplos arquivos)
            if (gitState.currentMissionIndex === 4) {
                if (!gitState.phase5Added) {
                    printOutput('no changes added to commit (use "git add ." to stage files)', 'error')
                    printOutput('Dica: prepare os arquivos adicionando-os ao Staging com "git add ." antes de commitar.', 'warning')
                    break
                }

                if (gitState.phase5Committed) {
                    printOutput('nothing to commit, working tree clean', 'warning')
                    printOutput('Dica: o segundo snapshot já foi registrado! Repositório limpo.', 'info')
                    break
                }

                gitState.phase5Committed = true
                stagingFiles.innerHTML = ''
                repositoryFiles.appendChild(createFileItem('components.js', gitState.currentBranch))
                repositoryFiles.appendChild(createFileItem('README.md', gitState.currentBranch))

                const commitHash = Math.random().toString(16).substring(2, 9)
                gitState.commits.unshift({
                    hash: commitHash,
                    branch: gitState.currentBranch,
                    author: 'Dev Aprendiz <guest@gitquest.dev>',
                    date: new Date().toUTCString(),
                    msg: parsed.msg
                })

                printOutput(`[${gitState.currentBranch} ${commitHash}] ${parsed.msg}`, 'success')
                printOutput('2 files changed, 42 insertions(+)', 'success')

                gitState.xp += 50
                renderMission()
                showRetroCelebration('+50 XP CONQUISTADO!', 'SEGUNDO SNAPSHOT GRAVADO!')
                break
            }

            // Suporte para Fase 8 (commit exclusivo na branch feature)
            if (gitState.currentMissionIndex === 7) {
                if (gitState.featureLoginCommitted) {
                    printOutput('nothing to commit, working tree clean', 'warning')
                    break
                }
                gitState.featureLoginCommitted = true
                stagingFiles.innerHTML = ''
                repositoryFiles.appendChild(createFileItem('login.html', gitState.currentBranch))
                repositoryFiles.appendChild(createFileItem('login.css', gitState.currentBranch))

                const commitHash = Math.random().toString(16).substring(2, 9)
                gitState.commits.unshift({
                    hash: commitHash,
                    branch: gitState.currentBranch,
                    author: 'Dev Aprendiz <guest@gitquest.dev>',
                    date: new Date().toUTCString(),
                    msg: parsed.msg
                })

                printOutput(`[${gitState.currentBranch} ${commitHash}] ${parsed.msg}`, 'success')
                printOutput('2 files changed, 42 insertions(+)', 'success')

                gitState.xp += 150
                renderMission()
                showRetroCelebration('+150 XP CONQUISTADO!', 'COMMIT NA FEATURE REGISTRADO!')
                break
            }

            if (!gitState.filesAdded) {
                printOutput('no changes added to commit (use "git add ." to stage files)', 'error')
                printOutput('Dica: arquivos modificados precisam ser preparados no Staging com "git add ." antes de fazer o commit.', 'warning')
                break
            }

            if (gitState.comitted) {
                printOutput('nothing to commit, working tree clean', 'warning')
                printOutput('Dica: o snapshot já foi gravado com sucesso! Repositório limpo.', 'info')
                break
            }

            gitState.comitted = true
            stagingFiles.innerHTML = ''
            repositoryFiles.appendChild(createFileItem('index.html', gitState.currentBranch))
            repositoryFiles.appendChild(createFileItem('style.css', gitState.currentBranch))
            repositoryFiles.appendChild(createFileItem('app.js', gitState.currentBranch))

            const firstCommitHash = Math.random().toString(16).substring(2, 9)
            gitState.commits.unshift({
                hash: firstCommitHash,
                branch: gitState.currentBranch,
                author: 'Dev Aprendiz <guest@gitquest.dev>',
                date: new Date().toUTCString(),
                msg: parsed.msg
            })

            printOutput(`[${gitState.currentBranch} (root-commit) ${firstCommitHash}] ${parsed.msg}`, 'success')
            printOutput('3 files changed, 3 insertions(+)', 'success')

            gitState.xp += 100
            renderMission()
            showRetroCelebration('+100 XP CONQUISTADO!', 'PRIMEIRO COMMIT GRAVADO!')
            break
        default:
            handlePedagogicalError(command, parsed)
            break
    }
}
// ─────────────────────────────────────────────
// 5. EVENTOS
// Escutam interações do usuário e disparam a lógica
// ─────────────────────────────────────────────

// Clicar em qualquer área do terminal foca o input
terminal.addEventListener('click', function () {
    promptInput.focus()
})

// Detecta teclas no input (Enter para executar, Setas para histórico)
promptInput.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'Enter':
            const current = missions[gitState.currentMissionIndex]
            if (current && isMissionCompleted(current)) {
                // Se a fase atual já está concluída, bater Enter avança diretamente para a próxima fase!
                advanceToNextMission()
                promptInput.value = ''
                break
            }

            const command = promptInput.value.trim()

            if (command !== '') {
                printOutput('guest@gitquest:~$ ' + command)
                gitState.history.push(command)
                gitState.position = gitState.history.length
                processCommand(command)
            } else {
                printOutput('guest@gitquest:~$ ')
            }

            promptInput.value = ''
            break

        case 'ArrowUp':
            event.preventDefault()
            if (gitState.history.length > 0 && gitState.position > 0) {
                gitState.position--
                promptInput.value = gitState.history[gitState.position]
            }
            break

        case 'ArrowDown':
            event.preventDefault()
            if (gitState.history.length > 0) {
                if (gitState.position < gitState.history.length - 1) {
                    gitState.position++
                    promptInput.value = gitState.history[gitState.position]
                } else if (gitState.position === gitState.history.length - 1) {
                    gitState.position = gitState.history.length
                    promptInput.value = ''
                }
            }
            break
    }
})

// ─── Eventos do Modal de Missões ───
// Inicializa os ouvintes do modal através do módulo desacoplado
initModalEvents({
    onSelectMission: (index) => {
        if (index <= gitState.currentMissionIndex) {
            gitState.currentMissionIndex = index
            renderMission()
            closeMissionsModal()
            printOutput(`Navegando para ${missions[index].title}!`)
        }
    },
    onTabWarning: (tabName) => {
        printOutput(`Módulo "${tabName}" será liberado nas próximas atualizações!`, 'warning')
    }
})

// ─── Eventos do Modal de Boas-Vindas & Onboarding ───
initWelcomeModal({
    onStart: () => {
        promptInput.focus()
    },
    onOpenTrail: () => {
        openMissionsModal()
    }
})

// ─── Eventos do Modal de Vitória (GEG-18) ───
initVictoryModal({
    onViewTrail: () => {
        openMissionsModal()
    },
    onContinue: () => {
        promptInput.focus()
    }
})

// ─── Botão de Avanço Manual de Missão (GEG-18) ───
if (nextMissionBtn) {
    nextMissionBtn.addEventListener('click', advanceToNextMission)
}

// ─── Evento do Botão de Dica Pedagógica (GEG-19) ───
if (missionHintBtn) {
    missionHintBtn.addEventListener('click', () => {
        const currentIdx = gitState.currentMissionIndex
        const currentMission = missions[currentIdx]
        if (!currentMission || !currentMission.hints) return

        const currentCount = gitState.hintsRevealed[currentIdx] || 0
        const maxHints = Math.min(3, currentMission.hints.length)
        if (currentCount >= maxHints) return

        const newCount = currentCount + 1
        gitState.hintsRevealed[currentIdx] = newCount
        updateHintUI()

        const hintText = currentMission.hints[newCount - 1]
        printOutput(`[Dica ${newCount}/${maxHints}]: ${hintText}`, 'warning')
        promptInput.focus()
    })
}

// ─── Inicialização da Aplicação ───
// Sincroniza a interface com o estado inicial ao carregar a página
renderMission()
