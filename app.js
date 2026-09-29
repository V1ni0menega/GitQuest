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


// ─────────────────────────────────────────────
// 2. ESTADO
// Objeto central que representa a "memória" da aplicação.
// Toda decisão de lógica consulta ou atualiza este objeto.
// ─────────────────────────────────────────────

// (em breve: const appState = { initialized: false, ... })


// ─────────────────────────────────────────────
// 3. FUNÇÕES AUXILIARES
// Funções puras e reutilizáveis — não conhecem o estado da app
// ─────────────────────────────────────────────

// Imprime uma linha de texto no terminal visual
function printOutput(message) {
    const li = document.createElement('li')
    li.textContent = message
    terminalOutput.appendChild(li)
}


// ─────────────────────────────────────────────
// 4. LÓGICA
// Funções que processam comandos e atualizam o estado
// ─────────────────────────────────────────────

// Interpreta o comando digitado e executa a ação correspondente
function processCommand(command) {
    if (command === 'git init') {
        printOutput('Repositório Git inicializado com sucesso!')
    } else {
        printOutput('Comando não reconhecido: ' + command)
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

// Detecta o Enter no input e processa o comando
promptInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const command = promptInput.value.trim()
        printOutput('guest@gitquest:~$ ' + command)
        processCommand(command)
        promptInput.value = ''
    }
})
