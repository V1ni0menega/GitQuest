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

const terminal       = document.querySelector('.panel-terminal')
const promptInput    = document.querySelector('.prompt-input')
const terminalOutput = document.querySelector('.terminal-output')

 //seletores para os containers da pipeline//

const workingFiles  = document.querySelector('.stage-working .stage-files')
const stagingFiles  = document.querySelector('.stage-staging .stage-files')
const repositoryFiles = document.querySelector('.stage-repo .stage-files')

/// seletores para o estado de missões
const missionTitleElement       = document.querySelector('.mission-title')
const missionDescriptionElement = document.querySelector('.mission-description')
const missionXpElement          = document.querySelector('.mission-badge')
const missionCommandElement     = document.querySelector('.mission-instruction code')
const missionStepIndicator      = document.getElementById('mission-step-indicator')
const missionChecklist          = document.getElementById('mission-checklist')
const nextMissionBtn            = document.getElementById('next-mission-btn')

// Seletores do Terminal e Pipeline
const promptLabel          = document.getElementById('prompt-label')
const pipelineBranchBadge  = document.getElementById('pipeline-branch-badge')

// ─────────────────────────────────────────────
// 2. ESTADO
// Objeto central que representa a "memória" da aplicação.
// Toda decisão de lógica consulta ou atualiza este objeto.
// ────────────────────────────────────────────
const gitState = {
    initialized: false,
    filesAdded: false,
    comitted : false, 
    workingFiles: [],
    stagedFiles:[],
    branches:['main'],
    currentBranch:'main',
    history:[],
    position: 0,
    xp : 0,
    currentMissionIndex: 0,
    victoryShown: false,
}



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

    // 2. Comandos com subargumentos e flags (ex: git checkout -b feature, git branch feature ou git add .)
    const words = trimmed.split(/\s+/)
    if (words[0] === 'git' && words.length > 2) {
        // Caso especial: git checkout -b <nome>
        if (words[1] === 'checkout' && words[2] === '-b' && words.length > 3) {
            return {
                base: 'git checkout',
                arg: words[3],
                flag: '-b',
                msg: ''
            }
        }

        const subCommand = words[1]
        if (subCommand === 'branch' || subCommand === 'checkout' || subCommand === 'add') {
            return {
                base: 'git ' + subCommand,
                arg: words[2],
                flag: '',
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

function printOutput(message,type = '') {
    const li = document.createElement('li')
    li.textContent = message
    if(type){
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

function renderMission() {
    const current = missions[gitState.currentMissionIndex]

    if (current) {
        missionTitleElement.textContent = current.title
        missionDescriptionElement.textContent = current.description
        missionXpElement.textContent = '+' + current.xp + ' XP'
        missionCommandElement.textContent = current.command
        if (missionStepIndicator) {
            missionStepIndicator.textContent = 'Fase ' + (gitState.currentMissionIndex + 1) + ' de ' + missions.length
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

        // Exibe o botão de avançar caso a missão atual já esteja cumprida (GEG-18)
        const allCompleted = isMissionCompleted(current)
        if (nextMissionBtn) {
            if (allCompleted && gitState.currentMissionIndex < missions.length - 1) {
                nextMissionBtn.classList.remove('hidden')
            } else {
                nextMissionBtn.classList.add('hidden')
            }
        }
    } else {
        // 🎉 ESTADO DE VITÓRIA (quando terminar todas as missões)!
        missionTitleElement.textContent = '🏆 Trilha Concluída!'
        if (missionStepIndicator) {
            missionStepIndicator.textContent = 'Trilha 100% concluída'
        }
        missionDescriptionElement.textContent = 'Parabéns, dev! Você dominou o ciclo completo do Git: init, add, commit e branches!'
        missionXpElement.textContent = 'Nível 1 • ' + gitState.xp + ' XP'
        missionCommandElement.textContent = 'git status / git branch'

        if (missionChecklist) {
            missionChecklist.innerHTML = `
                <li class="checklist-item completed">
                    <span class="checklist-box">✔</span>
                    <span class="checklist-text">Todas as missões desta trilha foram concluídas!</span>
                </li>
            `
        }

        if (nextMissionBtn) {
            nextMissionBtn.classList.add('hidden')
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




// ─────────────────────────────────────────────
// 4. LÓGICA
// Funções que processam comandos e atualizam o estado
// ─────────────────────────────────────────────

// Interpreta o comando digitado e executa a ação correspondente
function processCommand(command) {
    const parsed = parserCommand(command)

    switch (parsed.base) {
        case 'clear':
        case 'cls':
            break

        case 'help':
            printOutput('Comandos disponíveis: git init, git add ., git commit -m "...", git status, git branch, git branch <nome>, git checkout <nome>, git checkout -b <nome>, clear', 'info')
            break

        case 'git status':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                break
            }

            printOutput(`On branch ${gitState.currentBranch}`, 'info')

            if (!gitState.comitted) {
                printOutput('No commits yet', 'warning')
            }

            if (!gitState.filesAdded && !gitState.comitted) {
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
            break

        case 'git branch':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                break
            }

            // Se passou o nome (ex: git branch feature-login) ➔ CRIA a nova branch
            if (parsed.arg) {
                if (!gitState.comitted) {
                    printOutput(`fatal: not a valid object name: 'main' (crie o primeiro commit antes de criar branches!)`, 'error')
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
                break
            }

            if (!parsed.arg) {
                printOutput('fatal: branch name required for checkout', 'error')
                break
            }

            // Se usou a flag -b (ex: git checkout -b nova-feature) ➔ CRIA E ALTERNA SIMULTANEAMENTE!
            if (parsed.flag === '-b') {
                if (!gitState.comitted) {
                    printOutput(`fatal: not a valid object name: 'main' (crie o primeiro commit antes de ramificar!)`, 'error')
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
                showRetroCelebration(`BRANCH '${parsed.arg.toUpperCase()}'!`, 'NOVA RAMIFICAÇÃO CRIADA')
                break
            }

            // Checkout comum (alternar para branch existente)
            if (!gitState.branches.includes(parsed.arg)) {
                printOutput(`error: pathspec '${parsed.arg}' did not match any file(s) known to git`, 'error')
            } else if (parsed.arg === gitState.currentBranch) {
                printOutput(`Already on '${parsed.arg}'`, 'warning')
            } else {
                gitState.currentBranch = parsed.arg
                updatePromptAndPipelineBranch()
                printOutput(`Switched to branch '${parsed.arg}'`, 'success')
            }
            break

        case 'git init':
            if (gitState.initialized) {
                printOutput('Repositório já inicializado.', 'warning')
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

                setTimeout(() => {
                    if (gitState.currentMissionIndex === 0) {
                        gitState.currentMissionIndex = 1
                        renderMission()
                    }
                }, 1600)
            }
            break
        case 'git add':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                break
            }

            if (!parsed.arg) {
                printOutput('Nada especificado, nada adicionado.', 'warning')
                printOutput("Talvez você queira dizer 'git add .'?", 'info')
                break
            }

            if (parsed.arg !== '.' && parsed.arg !== '-A' && parsed.arg !== '--all') {
                printOutput(`fatal: pathspec '${parsed.arg}' did not match any files (use "git add ." para adicionar todos os arquivos)`, 'error')
                break
            }

            if (gitState.filesAdded) {
                printOutput('Arquivos já adicionados ao staging.', 'warning')
                break
            }

            gitState.filesAdded = true
            workingFiles.innerHTML = ''
            stagingFiles.appendChild(createFileItem('index.html'))
            stagingFiles.appendChild(createFileItem('style.css'))
            stagingFiles.appendChild(createFileItem('app.js'))

            printOutput('Arquivos adicionados ao staging area!', 'success')

            gitState.xp += 50
            renderMission()
            showRetroCelebration('+50 XP CONQUISTADO!', 'MISSÃO 02: STAGING AREA')

            setTimeout(() => {
                if (gitState.currentMissionIndex === 1) {
                    gitState.currentMissionIndex = 2
                    renderMission()
                }
            }, 1600)
            break

        case 'git commit':
            if (!gitState.initialized) {
                printOutput('fatal: not a git repository (or any of the parent directories): .git', 'error')
                break
            }

            if (!gitState.filesAdded) {
                printOutput('no changes added to commit (use "git add ." to stage files)', 'error')
                break
            }

            if (gitState.comitted) {
                printOutput('nothing to commit, working tree clean', 'warning')
                break
            }

            if (parsed.flag !== '-m') {
                printOutput('fatal: use a flag -m para informar a mensagem do commit. Ex: git commit -m "sua mensagem"', 'error')
                break
            }

            if (!parsed.msg || parsed.msg.trim() === '') {
                printOutput('Aborting commit due to empty commit message.', 'error')
                break
            }

            gitState.comitted = true
            stagingFiles.innerHTML = ''
            repositoryFiles.appendChild(createFileItem('index.html', gitState.currentBranch))
            repositoryFiles.appendChild(createFileItem('style.css', gitState.currentBranch))
            repositoryFiles.appendChild(createFileItem('app.js', gitState.currentBranch))

            printOutput(`[${gitState.currentBranch} (root-commit)] ${parsed.msg}`, 'success')
            printOutput('3 files changed, 3 insertions(+)', 'success')

            gitState.xp += 100
            renderMission()
            showRetroCelebration('+100 XP CONQUISTADO!', 'TRILHA BÁSICA CONCLUÍDA!')

            setTimeout(() => {
                if (gitState.currentMissionIndex === 2) {
                    gitState.currentMissionIndex = 3
                    renderMission()
                }
            }, 1600)
            break
        default:
            printOutput('Comando não reconhecido: ' + command,'error')
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
    nextMissionBtn.addEventListener('click', () => {
        if (gitState.currentMissionIndex < missions.length) {
            gitState.currentMissionIndex++
            renderMission()
            promptInput.focus()
            if (missions[gitState.currentMissionIndex]) {
                printOutput(`Navegando para ${missions[gitState.currentMissionIndex].title}!`)
            }
        }
    })
}

// ─── Inicialização da Aplicação ───
// Sincroniza a interface com o estado inicial ao carregar a página
renderMission()
