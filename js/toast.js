// ─── Módulo de Alertas & Feedback Retrô (Toast) ───
// Gerencia a exibição do banner arcade comemorativo de conquista / Level Up

import { playRetro8BitSound } from './audio.js'

// Seletores internos encapsulados no módulo
const retroToastElement = document.getElementById('retro-toast')
const retroMsgElement   = document.getElementById('retro-msg')
const retroSubElement   = document.getElementById('retro-sub')

let retroToastTimeout = null

/**
 * Exibe o toast comemorativo estilo retrô 8-bit e toca o acorde triunfante.
 * @param {string} msg Mensagem principal (ex: "+50 XP CONQUISTADO!")
 * @param {string} sub Subtítulo explicativo (ex: "MISSÃO CUMPRIDA")
 */
export function showRetroCelebration(msg, sub = 'MISSÃO CUMPRIDA') {
    if (!retroToastElement) return

    if (retroMsgElement) retroMsgElement.textContent = msg
    if (retroSubElement) retroSubElement.textContent = sub

    retroToastElement.classList.remove('hidden')
    
    // Toca o sintetizador 8-bit chiptune
    playRetro8BitSound()

    // Agenda o fechamento automático após 2.8 segundos sem travar a UI
    if (retroToastTimeout) clearTimeout(retroToastTimeout)
    retroToastTimeout = setTimeout(() => {
        retroToastElement.classList.add('hidden')
    }, 2800)
}
