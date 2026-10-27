// ─── Módulo do Modal de Missões & Mapa de Trilha ───
// Gerencia a janela modal de fases, abas, status de botões e estatísticas globais

import { missions } from './missions-data.js'

// Seletores do DOM encapsulados no módulo
const missionsModal       = document.getElementById('missions-modal')
const openMissionsBtn     = document.getElementById('open-missions-btn')
const missionTitleTrigger = document.getElementById('mission-title-trigger')
const closeModalBtn       = document.getElementById('close-modal-btn')
const closeModalDot       = document.getElementById('close-modal-dot')
const module1LevelButtons = document.querySelectorAll('#module-1-levels .level-btn')
const moduleStepDesc      = document.getElementById('module-step-desc')
const tabButtons          = document.querySelectorAll('.modal-tabs .tab-btn')

// Seletores das Estatísticas Globais & Stepper do Navbar
const globalXpElement     = document.getElementById('global-xp')
const globalStarsElement  = document.getElementById('global-stars')
const navPhasesBar        = document.getElementById('nav-phases-bar')
const navStepButtons      = document.querySelectorAll('#nav-stepper .step-item')

// Abre a janela modal e sincroniza os dados
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

    // 3. Atualiza Stepper da Navbar Principal
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

    // 4. Atualiza Botões de Nível do Módulo 1 (Fundamentos) dentro do Modal
    module1LevelButtons.forEach((btn, index) => {
        btn.classList.remove('completed', 'active', 'locked')
        if (index < currentMissionIndex) {
            btn.classList.add('completed')
            btn.disabled = false
            btn.title = `Fase ${index + 1}: Concluída! Clique para revisar.`
        } else if (index === currentMissionIndex) {
            btn.classList.add('active')
            btn.disabled = false
            btn.title = `Fase ${index + 1}: Em andamento!`
        } else {
            btn.classList.add('locked')
            btn.disabled = true
            btn.title = `Fase ${index + 1}: Bloqueada`
        }
    })

    // 5. Atualiza Subtítulo da Fase Atual no Modal
    if (moduleStepDesc) {
        const curr = missions[currentMissionIndex]
        if (curr) {
            moduleStepDesc.textContent = `${currentMissionIndex + 1}: ${curr.title}`
        } else {
            moduleStepDesc.textContent = '🎉 Todas as fases concluídas com sucesso!'
        }
    }
}

/**
 * Inicializa todos os ouvintes de eventos da janela modal e stepper de forma desacoplada
 * @param {Object} handlers Callbacks de interação
 * @param {Function} handlers.onSelectMission Chamado quando o usuário escolhe uma fase desbloqueada
 * @param {Function} handlers.onTabWarning Chamado quando o usuário clica em uma aba futura
 */
export function initModalEvents({ onSelectMission, onTabWarning } = {}) {
    // Abertura do Modal
    if (openMissionsBtn) openMissionsBtn.addEventListener('click', openMissionsModal)
    if (missionTitleTrigger) missionTitleTrigger.addEventListener('click', openMissionsModal)

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
            tabButtons.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            if (btn.dataset.tab !== 'fundamentos' && onTabWarning) {
                onTabWarning(btn.textContent)
            }
        })
    })

    // Navegação direta pelas fases do Módulo 1
    module1LevelButtons.forEach((btn, index) => {
        btn.addEventListener('click', function () {
            if (!btn.disabled && onSelectMission) {
                onSelectMission(index)
            }
        })
    })
}
