// ─── Módulo do Modal de Vitória da Trilha (GEG-18) ───
// Celebra a conclusão de todas as metas e oferece opções de navegação

const victoryModal          = document.getElementById('victory-modal')
const closeVictoryBtn       = document.getElementById('close-victory-btn')
const closeVictoryDot       = document.getElementById('close-victory-dot')
const victoryKeepPlayingBtn = document.getElementById('victory-keep-playing-btn')
const victoryViewTrailBtn   = document.getElementById('victory-view-trail-btn')
const victoryFinalXp        = document.getElementById('victory-final-xp')

/**
 * Abre o modal de vitória e atualiza as estatísticas finais
 * @param {number} xp XP final acumulado pelo jogador
 */
export function openVictoryModal(xp = 0) {
    if (!victoryModal) return

    if (victoryFinalXp) {
        victoryFinalXp.textContent = xp
    }

    victoryModal.classList.remove('hidden')
}

/**
 * Fecha o modal de vitória
 */
export function closeVictoryModal() {
    if (!victoryModal) return
    victoryModal.classList.add('hidden')
}

/**
 * Inicializa os ouvintes de evento do modal de vitória
 * @param {Object} options
 * @param {Function} options.onViewTrail Callback para abrir a trilha de missões
 * @param {Function} options.onContinue Callback para continuar no terminal
 */
export function initVictoryModal({ onViewTrail, onContinue } = {}) {
    if (!victoryModal) return

    // Botões de fechar (X e bolinha vermelha)
    if (closeVictoryBtn) {
        closeVictoryBtn.addEventListener('click', () => {
            closeVictoryModal()
            if (typeof onContinue === 'function') onContinue()
        })
    }

    if (closeVictoryDot) {
        closeVictoryDot.addEventListener('click', () => {
            closeVictoryModal()
            if (typeof onContinue === 'function') onContinue()
        })
    }

    // Botão Continuar no Terminal
    if (victoryKeepPlayingBtn) {
        victoryKeepPlayingBtn.addEventListener('click', () => {
            closeVictoryModal()
            if (typeof onContinue === 'function') onContinue()
        })
    }

    // Botão Ver Trilha de Missões
    if (victoryViewTrailBtn) {
        victoryViewTrailBtn.addEventListener('click', () => {
            closeVictoryModal()
            if (typeof onViewTrail === 'function') onViewTrail()
        })
    }

    // Fechar ao clicar fora da janela (backdrop click)
    victoryModal.addEventListener('click', (event) => {
        if (event.target === victoryModal) {
            closeVictoryModal()
            if (typeof onContinue === 'function') onContinue()
        }
    })

    // Fechar com tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !victoryModal.classList.contains('hidden')) {
            closeVictoryModal()
            if (typeof onContinue === 'function') onContinue()
        }
    })
}
