# ⚔️ GitQuest — Domine o Git Jogando

> Uma plataforma web gamificada e interativa para aprender os fundamentos e o fluxo de trabalho do Git através de feedback visual em tempo real e terminal simulado.

---

## 🎯 Sobre o Projeto

O **GitQuest** nasceu para resolver uma das maiores dores de estudantes e programadores iniciantes: **a alta abstração conceitual do Git**.

Em vez de memorizar comandos no terminal às cegas ou temer perder códigos e históricos, o jogador executa comandos reais do Git em um terminal simulado e **vê instantaneamente**:
* Os arquivos transitando fisicamente entre o **Working Directory**, a **Staging Area** e o **Repositório**.
* Os nós da **Árvore de Commits** sendo criados e interligados a cada commit.
* O ponteiro da branch (`HEAD -> main`) avançando a cada etapa.

---

## ✨ Funcionalidades Principais

* 💻 **Terminal Interativo Simulado**: Suporte a comandos fundamentais (`git init`, `git status`, `git add`, `git commit`, `git log`, `git branch`, `git diff`, `clear`).
* 🔄 **Visualizador de Áreas do DOM**: Animação em tempo real mostrando o ciclo de vida dos arquivos.
* 🌳 **Árvore Gráfica de Commits**: Grafo visual desenhado dinamicamente com hashes abreviados e mensagens de commit.
* 🎮 **Missões por Fases Progressivas**: Desafios com níveis de dificuldade crescente e objetivos didáticos claros.
* 💡 **Sistema de Dicas e Tratamento Amigável de Erros**: Feedback pedagógico imediato quando um comando for digitado incorretamente.
* ⚡ **100% Client-Side**: Roda totalmente no navegador sem necessidade de instalar dependências, banco de dados ou servidores externos.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando **tecnologias nativas da Web**, priorizando os fundamentos da manipulação do DOM e lógica de programação:

* **HTML5**: Estruturação semântica da aplicação e dos painéis.
* **CSS3**: Layout moderno com CSS Grid e Flexbox, variáveis CSS, tema escuro (*Dark Developer Theme*) e micro-animações.
* **JavaScript Vanilla (ES6+)**: Manipulação nativa do DOM, interpretador de comandos e motor de simulação de estados do Git.

---

## 🎮 Estrutura do Jogo (Fases)

1. **Fase 1: O Primeiro Passo** — Inicializando o repositório (`git init`).
2. **Fase 2: Preparando Arquivos** — Verificando status e indexando (`git status`, `git add`).
3. **Fase 3: Criando a Linha do Tempo** — O primeiro commit (`git commit -m`).
4. **Fase 4: Rastreando o Histórico** — Consultando o log (`git log`).
5. **Fase 5: Múltiplos Arquivos e Modificações** — Fluxo completo de versionamento.
6. **Fase 6: Criando Universos Paralelos** — Ramificações com branches (`git branch`, `git checkout/switch`).

---

## 📂 Estrutura de Arquivos

```text
projeto-gitquest/
├── index.html            # Estrutura e marcação dos painéis
├── style.css             # Estilização visual, layout e temas
├── app.js                # Controle de interface (DOM) e gerenciamento de fases
├── git-engine.js         # Interpretador e motor de simulação dos comandos Git
├── etapa_1_definicao_sistema.md # Documentação da Etapa 1 do projeto
└── README.md             # Apresentação e guia do projeto
```

---

## 🚀 Como Executar Localmente

Como o projeto é construído em **JavaScript puro**, não é necessário instalar nenhum gerenciador de pacotes (npm/yarn):

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/gitquest.git
   ```
2. **Acesse a pasta do projeto:**
   ```bash
   cd gitquest
   ```
3. **Execute no navegador:**
   * Basta dar um duplo clique no arquivo `index.html`, ou;
   * Utilizar a extensão **Live Server** no VS Code / Antigravity IDE.

---

## 🎓 Contexto Acadêmico

Projeto desenvolvido para a disciplina de **Desenvolvimento de Sistemas Web III** — Curso Técnico / Graduação em Tecnologia.

---

<p align="center">
  Desenvolvido com ☕ e foco no aprendizado prático de desenvolvimento web.
</p>
