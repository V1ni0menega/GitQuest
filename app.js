// =============================================================
// app.js — Orquestrador do GitQuest
// Conecta a Engine de Git à Interface do Usuário (UI)
// Estrutura: Seletores → Estado → Auxiliares → Lógica → Eventos
// =============================================================


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

// Seletores do Modal de Missões (Mockup)
const missionsModal       = document.getElementById('missions-modal')
const openMissionsBtn     = document.getElementById('open-missions-btn')
const missionTitleTrigger = document.getElementById('mission-title-trigger')
const closeModalBtn       = document.getElementById('close-modal-btn')
const closeModalDot       = document.getElementById('close-modal-dot')
const module1LevelButtons = document.querySelectorAll('#module-1-levels .level-btn')
const moduleStepDesc      = document.getElementById('module-step-desc')
const tabButtons          = document.querySelectorAll('.modal-tabs .tab-btn')

// Seletores do Pill Global e Toast Retrô 8-Bit
const globalXpElement     = document.getElementById('global-xp')
const globalStarsElement  = document.getElementById('global-stars')
const retroToastElement   = document.getElementById('retro-toast')
const retroMsgElement     = document.getElementById('retro-msg')
const retroSubElement     = document.getElementById('retro-sub')

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
    history:[],
    position: 0,
    xp : 0,
    currentMissionIndex: 0,

}
const missions = [
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



// ─────────────────────────────────────────────
// 3. FUNÇÕES AUXILIARES
// Funções puras e reutilizáveis — não conhecem o estado da app
// ─────────────────────────────────────────────

// Imprime uma linha de texto no terminal visual
function parserCommand(command){
    if(command.includes('-m')){
        const parts = command.split('-m')
        
        const base= parts[0].trim()

        const msg = parts[1].trim()
            return {base,msg}
        }
        return{
            base:command.trim(),msg: ''
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
    
function createFileItem(name){
    const div = document.createElement('div')

    div.className = 'file-item'
    div.textContent = name
    
    return div
}

// Sintetizador de Som Retrô 8-Bit (Web Audio API nativa)
function playRetro8BitSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return
        const ctx = new AudioContext()
        // Acorde alegre de 4 notas em onda quadrada (Estilo Game Boy / NES)
        const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'square'
            osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08)
            gain.gain.setValueAtTime(0.06, ctx.currentTime + index * 0.08)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.14)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(ctx.currentTime + index * 0.08)
            osc.stop(ctx.currentTime + index * 0.08 + 0.15)
        })
    } catch (e) {
        // Fallback silencioso
    }
}

// Dispara o Toast Comemorativo 8-Bit com Efeito Sonoro
let retroToastTimeout = null
function showRetroCelebration(msg, sub = 'MISSÃO CUMPRIDA') {
    if (!retroToastElement) return
    retroMsgElement.textContent = msg
    retroSubElement.textContent = sub
    retroToastElement.classList.remove('hidden')
    playRetro8BitSound()

    if (retroToastTimeout) clearTimeout(retroToastTimeout)
    retroToastTimeout = setTimeout(() => {
        retroToastElement.classList.add('hidden')
    }, 2800)
}

// Controle do Modal de Missões
function openMissionsModal() {
    if (!missionsModal) return
    missionsModal.classList.remove('hidden')
    updateModalAndStatsUI()
}

function closeMissionsModal() {
    if (!missionsModal) return
    missionsModal.classList.add('hidden')
}

// Atualiza o visual dos botões no Modal e o Pill Global de XP/Stars
function updateModalAndStatsUI() {
    // 1. Atualiza Stats Globais no Topo
    if (globalXpElement) globalXpElement.textContent = gitState.xp
    if (globalStarsElement) {
        const completedStars = Math.min(gitState.currentMissionIndex, missions.length)
        globalStarsElement.textContent = `${completedStars}/${missions.length}`
    }

    // 2. Atualiza Botões de Nível do Módulo 1 (Fundamentos)
    module1LevelButtons.forEach((btn, index) => {
        btn.classList.remove('completed', 'active', 'locked')
        if (index < gitState.currentMissionIndex) {
            btn.classList.add('completed')
            btn.disabled = false
            btn.title = `Fase ${index + 1}: Concluída! Clique para revisar.`
        } else if (index === gitState.currentMissionIndex) {
            btn.classList.add('active')
            btn.disabled = false
            btn.title = `Fase ${index + 1}: Em andamento!`
        } else {
            btn.classList.add('locked')
            btn.disabled = true
            btn.title = `Fase ${index + 1}: Bloqueada`
        }
    })

    // 3. Atualiza Subtítulo da Fase Atual
    if (moduleStepDesc) {
        const curr = missions[gitState.currentMissionIndex]
        if (curr) {
            moduleStepDesc.textContent = `${gitState.currentMissionIndex + 1}: ${curr.title}`
        } else {
            moduleStepDesc.textContent = '🎉 Todas as fases concluídas com sucesso!'
        }
    }
}

function renderMission() {
    const current = missions[gitState.currentMissionIndex]

    if (current) {
        missionTitleElement.textContent = current.title
        missionDescriptionElement.textContent = current.description
        missionXpElement.textContent = '+' + current.xp + ' XP'
        missionCommandElement.textContent = current.command
    } else {
        // 🎉 ESTADO DE VITÓRIA (quando terminar todas as missões)!
        missionTitleElement.textContent = '🏆 Trilha Concluída!'
        missionDescriptionElement.textContent = 'Parabéns, dev! Você dominou o ciclo completo do Git: init, add e commit!'
        missionXpElement.textContent = 'Nível 1 • ' + gitState.xp + ' XP'
        missionCommandElement.textContent = 'git status / git log'
    }

    // Sincroniza o Modal e o Pill Global
    updateModalAndStatsUI()
}




// ─────────────────────────────────────────────
// 4. LÓGICA
// Funções que processam comandos e atualizam o estado
// ─────────────────────────────────────────────

// Interpreta o comando digitado e executa a ação correspondente
function processCommand(command) {
    const parsed = parserCommand(command)

    switch (parsed.base) {
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
                gitState.currentMissionIndex++
                renderMission()
                printOutput('⭐ Missão 01 Concluída! +50 XP (Total: ' + gitState.xp + ' XP)', 'success')
                showRetroCelebration('+50 XP CONQUISTADO!', 'MISSÃO 01: O INÍCIO')
            }
            break
     case 'git add':
        if (gitState.initialized && !gitState.filesAdded) {
            gitState.filesAdded = true
            workingFiles.innerHTML = ''
            stagingFiles.appendChild(createFileItem('index.html'))
            stagingFiles.appendChild(createFileItem('style.css'))
            stagingFiles.appendChild(createFileItem('app.js'))

            printOutput('Arquivos adicionados ao staging area!','success')

            gitState.xp += 50
            gitState.currentMissionIndex++
            renderMission()
            printOutput('⭐ Missão 02 Concluída! +50 XP (Total: ' + gitState.xp + ' XP)', 'success')
            showRetroCelebration('+50 XP CONQUISTADO!', 'MISSÃO 02: STAGING AREA')
            
        } else if (gitState.initialized && gitState.filesAdded) {
            printOutput('Arquivos já adicionados ao staging.','warning')
        } else {
            printOutput('Repositório não inicializado. Execute "git init" primeiro.', 'error')
        }
        break
     case 'git commit':
        if (gitState.initialized && gitState.filesAdded && !gitState.comitted){
            gitState.comitted = true
            stagingFiles.innerHTML = ''
            repositoryFiles.appendChild(createFileItem('index.html'))
            repositoryFiles.appendChild(createFileItem('style.css'))
            repositoryFiles.appendChild(createFileItem('app.js'))

            printOutput('[main (root-commit)] ' + parsed.msg, 'success')
            printOutput('3 files changed', 'success')

            gitState.xp += 100
            gitState.currentMissionIndex++
            renderMission()
            printOutput('⭐ Missão 03 Concluída! +100 XP (Total: ' + gitState.xp + ' XP)', 'success')
            showRetroCelebration('+100 XP CONQUISTADO!', 'TRILHA BÁSICA CONCLUÍDA!')
        }
        else if (gitState.initialized && gitState.filesAdded && gitState.comitted){
            printOutput('Nada para commitar','warning')
        }
        else if (!gitState.initialized){
            printOutput('Repositório não inicializado. Execute "git init" primeiro.','error')
        }
        else if (!gitState.filesAdded){
            printOutput('Erro: você precisa usar "git add" antes de "git commit".','error')
        }
        else {
            printOutput('Erro: O que você está tentando commitar?','error')
        }
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

// Abertura do Modal
if (openMissionsBtn) openMissionsBtn.addEventListener('click', openMissionsModal)
if (missionTitleTrigger) missionTitleTrigger.addEventListener('click', openMissionsModal)

// Fechamento do Modal
if (closeModalBtn) closeModalBtn.addEventListener('click', closeMissionsModal)
if (closeModalDot) closeModalDot.addEventListener('click', closeMissionsModal)

// Fechar ao clicar no fundo escuro (backdrop)
if (missionsModal) {
    missionsModal.addEventListener('click', function (event) {
        if (event.target === missionsModal) {
            closeMissionsModal()
        }
    })
}

// Fechar ao pressionar a tecla Escape
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && missionsModal && !missionsModal.classList.contains('hidden')) {
        closeMissionsModal()
    }
})

// Alternância de Abas no Modal
tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        tabButtons.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        if (btn.dataset.tab !== 'fundamentos') {
            printOutput(`ℹ️ Módulo "${btn.textContent}" será liberado nas próximas atualizações!`, 'warning')
        }
    })
})

// Navegação direta pelas fases do Módulo 1 no Modal
module1LevelButtons.forEach((btn, index) => {
    btn.addEventListener('click', function () {
        if (!btn.disabled && index <= gitState.currentMissionIndex) {
            gitState.currentMissionIndex = index
            renderMission()
            closeMissionsModal()
            printOutput(`🎯 Navegando para ${missions[index].title}!`)
        }
    })
})

// ─── Inicialização da Aplicação ───
// Sincroniza a interface com o estado inicial ao carregar a página
renderMission()
