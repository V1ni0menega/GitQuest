// ─── Módulo do Modal de Missões & Mapa de Trilha ───
// Gerencia a janela modal de fases, abas, status de botões e estatísticas globais

import { missions } from './missions-data.js'

// Seletores do DOM encapsulados no módulo
const missionsModal       = document.getElementById('missions-modal')
const openMissionsBtn     = document.getElementById('open-missions-btn')
const missionTitleTrigger = document.getElementById('mission-title-trigger')
const closeModalBtn       = document.getElementById('close-modal-btn')
const closeModalDot       = document.getElementById('close-modal-dot')

const moduleSections = {
    fundamentos: document.getElementById('module-1-section'),
    branches:    document.getElementById('module-2-section'),
    desfazer:    document.getElementById('module-3-section'),
    conflitos:   document.getElementById('module-4-section'),
    remoto:      document.getElementById('module-5-section'),
    historico:   document.getElementById('module-6-section')
}

const tabButtons = document.querySelectorAll('.modal-tabs .tab-btn')
const allLevelButtons = document.querySelectorAll('.module-section .level-btn')

// Descrições de passo de cada módulo
const stepDescs = {
    1: document.getElementById('module-step-desc'),
    2: document.getElementById('module-2-step-desc'),
    3: document.getElementById('module-3-step-desc'),
    4: document.getElementById('module-4-step-desc'),
    5: document.getElementById('module-5-step-desc'),
    6: document.getElementById('module-6-step-desc')
}

// Seletores das Estatísticas Globais & Stepper do Navbar
const globalXpElement     = document.getElementById('global-xp')
const globalStarsElement  = document.getElementById('global-stars')
const navPhasesBar        = document.getElementById('nav-phases-bar')
const navStepButtons      = document.querySelectorAll('#nav-stepper .step-item')

// Determina qual aba corresponde ao índice de missão
function getTabForMission(index) {
    if (index < 6) return 'fundamentos'
    if (index < 10) return 'branches'
    if (index < 14) return 'desfazer'
    if (index < 17) return 'conflitos'
    if (index < 20) return 'remoto'
    return 'historico'
}

// Abre a janela modal e sincroniza a aba com a missão atual
export function openMissionsModal() {
    if (!missionsModal) return
    missionsModal.classList.remove('hidden')
}

// Fecha a janela modal
export function closeMissionsModal() {
    if (!missionsModal) return
    missionsModal.classList.add('hidden')
}

/**
 * Ativa visualmente a aba selecionada e exibe o módulo correspondente
 */
export function setActiveTab(tabKey) {
    tabButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tabKey)
    })
    Object.entries(moduleSections).forEach(([key, section]) => {
        if (section) {
            section.style.display = (key === tabKey) ? 'flex' : 'none'
        }
    })
}

/**
 * Sincroniza a pílula global no topo, o stepper da navbar e os botões de fase dentro do modal
 * @param {number} currentMissionIndex Índice da fase atual
 * @param {number} xp Pontuação atual de XP
 */
export function updateModalAndStatsUI(currentMissionIndex, xp) {
    // 1. Atualiza Stats Globais no Topo
    if (globalXpElement) globalXpElement.textContent = xp
    const completedStars = Math.min(currentMissionIndex, missions.length)
    if (globalStarsElement) {
        globalStarsElement.textContent = `${completedStars}/${missions.length}`
    }

    // 2. Atualiza Barra de Progresso Mini na Navbar
    if (navPhasesBar) {
        const percent = Math.round((completedStars / missions.length) * 100)
        navPhasesBar.style.width = `${percent}%`
    }

    // 3. Atualiza Stepper da Navbar Principal (6 fases essenciais do Módulo 1)
    navStepButtons.forEach((btn, index) => {
        btn.classList.remove('completed', 'active', 'locked')
        const circle = btn.querySelector('.step-circle')
        if (index < currentMissionIndex) {
            btn.classList.add('completed')
            btn.disabled = false
            btn.title = `Fase ${index + 1}: Concluída! Clique para revisar.`
            if (circle) circle.textContent = '✔'
        } else if (index === currentMissionIndex) {
            btn.classList.add('active')
            btn.disabled = false
            btn.title = `Fase ${index + 1}: Em andamento!`
            if (circle) circle.textContent = (index + 1)
        } else {
            btn.classList.add('locked')
            btn.disabled = true
            btn.title = `Fase ${index + 1}: Bloqueada`
            if (circle) circle.textContent = (index + 1)
        }
    })

    // 4. Atualiza Todos os Botões de Nível em Todos os Módulos (1 a 6)
    allLevelButtons.forEach((btn) => {
        const missionIdx = parseInt(btn.dataset.missionIndex, 10)
        if (isNaN(missionIdx)) return

        btn.classList.remove('completed', 'active', 'locked')
        if (missionIdx < currentMissionIndex) {
            btn.classList.add('completed')
            btn.disabled = false
            btn.title = `Fase ${missionIdx + 1}: Concluída! Clique para revisar.`
        } else if (missionIdx === currentMissionIndex) {
            btn.classList.add('active')
            btn.disabled = false
            btn.title = `Fase ${missionIdx + 1}: Em andamento!`
        } else {
            btn.classList.add('locked')
            btn.disabled = true
            btn.title = `Fase ${missionIdx + 1}: Bloqueada`
        }
    })

    // 5. Atualiza Subtítulos de Passo de Cada Módulo
    const currentMission = missions[currentMissionIndex]
    if (stepDescs[1]) {
        if (currentMissionIndex < 6 && currentMission) {
            stepDescs[1].textContent = `${currentMissionIndex + 1}: ${currentMission.title}`
        } else {
            stepDescs[1].textContent = '🎉 Módulo 1 concluído com sucesso!'
        }
    }

    if (stepDescs[2]) {
        if (currentMissionIndex >= 6 && currentMissionIndex < 10 && currentMission) {
            stepDescs[2].textContent = `${currentMissionIndex - 5}: ${currentMission.title}`
        } else if (currentMissionIndex >= 10) {
            stepDescs[2].textContent = '🎉 Módulo 2 concluído com sucesso!'
        } else {
            stepDescs[2].textContent = '1: Missão 07: O Comando Switch'
        }
    }

    if (stepDescs[3]) {
        if (currentMissionIndex >= 10 && currentMissionIndex < 14 && currentMission) {
            stepDescs[3].textContent = `${currentMissionIndex - 9}: ${currentMission.title}`
        } else if (currentMissionIndex >= 14) {
            stepDescs[3].textContent = '🎉 Módulo 3 concluído com sucesso!'
        } else {
            stepDescs[3].textContent = '1: Missão 11: Descarte no Working Directory'
        }
    }

    if (stepDescs[4]) {
        if (currentMissionIndex >= 14 && currentMissionIndex < 17 && currentMission) {
            stepDescs[4].textContent = `${currentMissionIndex - 13}: ${currentMission.title}`
        } else if (currentMissionIndex >= 17) {
            stepDescs[4].textContent = '🎉 Módulo 4 concluído com sucesso!'
        } else {
            stepDescs[4].textContent = '1: Missão 15: Detecção de Conflito'
        }
    }

    if (stepDescs[5]) {
        if (currentMissionIndex >= 17 && currentMissionIndex < 20 && currentMission) {
            stepDescs[5].textContent = `${currentMissionIndex - 16}: ${currentMission.title}`
        } else if (currentMissionIndex >= 20) {
            stepDescs[5].textContent = '🎉 Módulo 5 concluído com sucesso!'
        } else {
            stepDescs[5].textContent = '1: Missão 18: Conexão com Servidor Remoto'
        }
    }

    if (stepDescs[6]) {
        if (currentMissionIndex >= 20 && currentMissionIndex < missions.length && currentMission) {
            stepDescs[6].textContent = `${currentMissionIndex - 19}: ${currentMission.title}`
        } else if (currentMissionIndex >= missions.length) {
            stepDescs[6].textContent = '🎉 Todas as 23 fases concluídas!'
        } else {
            stepDescs[6].textContent = '1: Missão 21: Gaveta Temporária com Stash'
        }
    }
}

/**
 * Inicializa todos os ouvintes de eventos da janela modal e stepper de forma desacoplada
 * @param {Object} handlers Callbacks de interação
 * @param {Function} handlers.onSelectMission Chamado quando o usuário escolhe uma fase desbloqueada
 */
export function initModalEvents({ onSelectMission } = {}) {
    // Abertura do Modal
    if (openMissionsBtn) {
        openMissionsBtn.addEventListener('click', () => {
            openMissionsModal()
        })
    }
    if (missionTitleTrigger) {
        missionTitleTrigger.addEventListener('click', () => {
            openMissionsModal()
        })
    }

    // Interatividade do Stepper do Navbar
    navStepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.stepIndex, 10)
            if (onSelectMission && !isNaN(index) && !btn.classList.contains('locked')) {
                onSelectMission(index)
            }
        })
    })

    // Fechamento do Modal
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeMissionsModal)
    if (closeModalDot) closeModalDot.addEventListener('click', closeMissionsModal)

    // Fechar ao clicar no backdrop (fundo escuro fora da janela)
    if (missionsModal) {
        missionsModal.addEventListener('click', function (event) {
            if (event.target === missionsModal) {
                closeMissionsModal()
            }
        })
    }

    // Fechar com a tecla Escape
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && missionsModal && !missionsModal.classList.contains('hidden')) {
            closeMissionsModal()
        }
    })

    // Alternância de Abas
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabKey = btn.dataset.tab
            setActiveTab(tabKey)
        })
    })

    // Navegação direta por qualquer botão de nível das 23 fases
    allLevelButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
            const index = parseInt(btn.dataset.missionIndex, 10)
            if (!btn.disabled && onSelectMission && !isNaN(index)) {
                onSelectMission(index)
            }
        })
    })
}
