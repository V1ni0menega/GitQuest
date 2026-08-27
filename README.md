<div align="center">

# ⚔️ GitQuest 

### Domine os fundamentos e o fluxo de trabalho do Git de forma visual e gamificada.

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>

<p align="center">
  Uma aplicação interativa para aprender Git através de um terminal simulado, visualização de áreas em tempo real e grafo interativo de commits — direto no navegador e sem necessidade de configurações complexas.
</p>

</div>

---

## 🎯 Sobre o Projeto

Aprender Git pode ser intimidador devido à alta abstração de seus conceitos (áreas de staging, ponteiros de branch, commits e árvores de histórico). O **GitQuest** transforma essa jornada em uma experiência interativa e visual.

Em vez de apenas rodar comandos no terminal às cegas, o usuário visualiza em tempo real:
- 📦 **O ciclo de vida dos arquivos**: transição física entre *Working Directory*, *Staging Area* (Index) e *Repositório Local*.
- 🌳 **Árvore de Commits Dinâmica**: nós interligados gerados instantaneamente a cada commit com seus respectivos identificadores (hashes) e mensagens.
- 🎯 **Ponteiros de Navegação**: o avanço da `HEAD` e das *branches* a cada ramificação ou troca de contexto.

---

## ✨ Principais Recursos

- 💻 **Terminal Simulado Integrado**: Suporte nativo a comandos essenciais como `git init`, `git status`, `git add`, `git commit`, `git log`, `git branch`, `git checkout/switch`, `git diff`, `clear` e `help`.
- 🔄 **Pipeline Visual em Tempo Real**: Feedback visual imediato do estado dos arquivos conforme os comandos são disparados.
- 🌿 **Grafo Visual de Branches e Commits**: Renderização clara do histórico e das ramificações do repositório.
- 🎮 **Trilhas de Desafios Progressivos**: Missões com objetivos pedagógicos e níveis crescentes de complexidade.
- 💡 **Feedback Inteligente de Erros**: Mensagens amigáveis e dicas contextuais quando um comando não produz o efeito esperado.
- ⚡ **Zero Dependências & 100% Client-Side**: Roda inteiramente no navegador, com carregamento ultrarrápido e sem necessidade de backend.

---

## 🛠️ Tecnologias

Construído com tecnologias nativas da web para máxima performance e acessibilidade:

- **Git**: Inspiração central e base de todos os conceitos simulados.
- **HTML5**: Estruturação semântica e acessível.
- **CSS3 Moderno**: Interface escura (*Dark Theme*), Flexbox, CSS Grid e micro-animações fluidas.
- **JavaScript Vanilla (ES6+)**: Manipulação de DOM e motor de simulação de estados do Git.

---

## 🚀 Como Executar

Por ser uma aplicação baseada em JavaScript puro, não é necessário instalar gerenciadores de pacotes nem configurar ambientes de compilação:

```bash
# 1. Clone o repositório
git clone https://github.com/V1ni0menega/GitQuest.git

# 2. Acesse a pasta do projeto
cd GitQuest

# 3. Abra o index.html no seu navegador favorito ou utilize um servidor estático local (como Live Server)
```

---

## 🤝 Contribuições

Contribuições, ideias de novas fases e sugestões de melhorias são muito bem-vindas!

1. Faça um **Fork** do projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/minha-feature`)
3. Faça commit das suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/minha-feature`)
5. Abra um **Pull Request**

---

## 🧡 Créditos e Agradecimentos

- **[Git](https://git-scm.com/)**: Criado originalmente em 2005 por **[Linus Torvalds](https://github.com/torvalds)**, o Git revolucionou o desenvolvimento de software colaborativo no mundo todo.
- Este projeto é uma homenagem educacional com o objetivo de tornar o ecossistema e os fluxos do Git ainda mais acessíveis, visuais e intuitivos para a comunidade de desenvolvedores.

---

<p align="center">
  Desenvolvido com ☕ e foco no aprendizado prático de desenvolvimento web.
</p>
