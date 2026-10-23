// ─── Módulo de Áudio Retrô (Web Audio API) ───
// Sintetizador algorítmico 8-bit chiptune (sem dependências e sem arquivos externos)

export function playRetro8BitSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return

        const ctx = new AudioContext()

        // Acorde alegre de 4 notas em onda quadrada (Estilo Game Boy / NES)
        // C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
        const notes = [523.25, 659.25, 783.99, 1046.50]

        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            // Onda quadrada = assinatura clássica de jogos arcade e 8-bit
            osc.type = 'square'
            osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08)

            // Envelope acústico com decay exponencial para evitar estalo acústico
            gain.gain.setValueAtTime(0.06, ctx.currentTime + index * 0.08)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.14)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start(ctx.currentTime + index * 0.08)
            osc.stop(ctx.currentTime + index * 0.08 + 0.15)
        })
    } catch (e) {
        // Fallback silencioso caso haja restrição de áudio no ambiente
        console.warn('Web Audio indisponível:', e)
    }
}
