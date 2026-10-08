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

}


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

// ─────────────────────────────────────────────
// 4. LÓGICA
// Funções que processam comandos e atualizam o estado
// ─────────────────────────────────────────────

// Interpreta o comando digitado e executa a ação correspondente
function processCommand(command) {
    const parsed = parserCommand(command)

        switch(parsed.base){
     case 'git init':
        if (gitState.initialized) {
            printOutput('Repositório já inicializado.','warning')
        } else {
            gitState.initialized = true
            workingFiles.appendChild(createFileItem('index.html'))
            workingFiles.appendChild(createFileItem('style.css'))
            workingFiles.appendChild(createFileItem('app.js'))
            printOutput('Repositório Git inicializado com sucesso!','success')
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

// Detecta o Enter no input e processa o comando
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


