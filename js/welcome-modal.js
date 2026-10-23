// ─── Módulo do Modal de Boas-Vindas & Onboarding ───
// Apresenta a dinâmica do GitQuest para novos jogadores

const welcomeModal     = document.getElementById('welcome-modal')
const startQuestBtn    = document.getElementById('start-quest-btn')
const closeWelcomeBtn  = document.getElementById('close-welcome-btn')
const closeWelcomeDot  = document.getElementById('close-welcome-dot')
const openWelcomeBtn   = document.getElementById('open-welcome-btn')
const dontShowCheckbox = document.getElementById('welcome-dont-show')

/**
 * Abre o modal de boas-vindas.
 */
export function openWelcomeModal() {
    if (!welcomeModal) return
    welcomeModal.classList.remove('hidden')
}

/**
 * Fecha o modal de boas-vindas e salva preferência se marcada.
 */
export function closeWelcomeModal() {
    if (!welcomeModal) return

    if (dontShowCheckbox && dontShowCheckbox.checked) {
        localStorage.setItem('gitquest_welcomed', 'true')
    }

    welcomeModal.classList.add('hidden')
}

/**
 * Inicializa os ouvintes de evento do modal de boas-vindas.
 * @param {Object} options
 * @param {Function} options.onStart Callback executado quando o usuário inicia a jornada
 */
export function initWelcomeModal({ onStart } = {}) {
    if (!welcomeModal) return

    // Auto-exibe na primeira visita (se o usuário não marcou para não exibir)
    const hasSeenWelcome = localStorage.getItem('gitquest_welcomed')
    if (!hasSeenWelcome) {
        openWelcomeModal()
    }

    // Botão Principal "Bora Codar!"
    if (startQuestBtn) {
        startQuestBtn.addEventListener('click', () => {
            closeWelcomeModal()
            if (typeof onStart === 'function') {
                onStart()
            }
        })
    }

    // Botões de fechar (X e bolinha vermelha)
    if (closeWelcomeBtn) {
        closeWelcomeBtn.addEventListener('click', () => {
            closeWelcomeModal()
            if (typeof onStart === 'function') {
                onStart()
            }
        })
    }

    if (closeWelcomeDot) {
        closeWelcomeDot.addEventListener('click', () => {
            closeWelcomeModal()
            if (typeof onStart === 'function') {
                onStart()
            }
        })
    }

    // Botão de reabrir guia/ajuda na interface
    if (openWelcomeBtn) {
        openWelcomeBtn.addEventListener('click', () => {
            openWelcomeModal()
        })
    }

    // Fecha ao clicar no backdrop escuro
    welcomeModal.addEventListener('click', (event) => {
        if (event.target === welcomeModal) {
            closeWelcomeModal()
            if (typeof onStart === 'function') {
                onStart()
            }
        }
    })

    // Tecla Escape fecha o modal
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !welcomeModal.classList.contains('hidden')) {
            closeWelcomeModal()
            if (typeof onStart === 'function') {
                onStart()
            }
        }
    })
}
