# SENSUS — Front-end (lado do paciente)

Interface web da Clínica Universitária de Psicologia **SENSUS**, feita com **Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript**.

> ⚠️ Somente front-end. Os dados são **mockados** (`lib/data.ts`) e os envios de formulário são **simulados**. A integração com a API (pasta `app/` na raiz do repositório, em Python) ainda será feita.

## Como rodar

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção (também verifica os tipos)
```

Requer Node.js 20 ou superior.

## Estrutura de pastas

```
frontend/
├── app/                        # Rotas (cada pasta = uma URL)
│   ├── layout.tsx              # Layout global: fonte, Header e Footer
│   ├── globals.css             # Paleta SENSUS + classes reutilizáveis (.btn-primary, .input, .card…)
│   ├── page.tsx                # "/"  Portal do Paciente: hero + busca de especialistas
│   ├── agendamento/[id]/       # "/agendamento/:id"  Solicitação de agendamento
│   ├── triagem/                # "/triagem"  Formulário de Triagem Inteligente
│   ├── login/                  # "/login"  (?perfil=equipe abre a aba da equipe)
│   ├── cadastro/               # "/cadastro"
│   ├── servicos/               # "/servicos"  página institucional
│   ├── clinica/                # "/clinica"   página institucional
│   ├── recursos/               # "/recursos"  página institucional
│   └── not-found.tsx           # página 404
│
├── components/                 # Componentes de interface
│   ├── Header.tsx / Footer.tsx / Logo.tsx      # Estrutura do site
│   ├── BuscaEspecialistas.tsx                  # Filtros (serviço, Presencial/Vídeo, texto) + lista
│   ├── EspecialistaCard.tsx                    # Cartão de horário/especialista
│   ├── SolicitacaoAgendamento.tsx              # Escolha de data/horário e envio
│   ├── TriagemForm.tsx                         # Triagem em 4 etapas
│   ├── LoginForm.tsx / CadastroForm.tsx        # Autenticação
│   ├── AuthShell.tsx / PasswordInput.tsx       # Apoio às telas de login/cadastro
│   └── Illustration.tsx                        # Placeholder das fotos (trocar por imagens reais)
│
└── lib/                        # Lógica sem interface
    ├── data.ts                 # Especialistas mockados, tipos, máscaras (CPF/telefone), validações
    └── triagem.ts              # Regras da triagem: temas detectados, prioridade, recomendações
```

## Paleta de cores

Definida em `app/globals.css` (bloco `@theme`). Use as classes do Tailwind com estes nomes:

| Token          | Uso                                   | Exemplo de classe        |
| -------------- | ------------------------------------- | ------------------------ |
| `sensus-700`   | Cor da marca, títulos, botões         | `bg-sensus-700`          |
| `sensus-50…900`| Variações do azul-petróleo            | `text-sensus-500`        |
| `cream`        | Fundo das páginas                     | `bg-cream`               |
| `sand-*`       | Selo "Presencial", avisos             | `badge-presencial`       |
| `sky-soft/ink` | Selo "Online"                         | `badge-online`           |
| `mist`         | Rodapé                                | `bg-mist`                |
| `alert-*`      | Erros e alertas de risco              | `text-alert-600`         |

## Guia rápido de alterações

| Quero…                                         | Onde mexer                                         |
| ---------------------------------------------- | -------------------------------------------------- |
| Adicionar/editar especialistas e horários      | `lib/data.ts` → `ESPECIALISTAS`                    |
| Mudar cores ou estilo dos botões/campos        | `app/globals.css`                                  |
| Alterar itens do menu                          | `components/Header.tsx` → `NAV`                    |
| Ajustar regras da triagem (prioridade, temas)  | `lib/triagem.ts`                                   |
| Mudar perguntas da triagem                     | `components/TriagemForm.tsx`                       |
| Conectar com a API real                        | Trocar os `setTimeout(...)` de simulação nos formulários por `fetch` e `ESPECIALISTAS` por dados da API |

## Fluxo de trabalho no Git (projeto em grupo)

Este front-end fica na branch **`frontend-paciente`**, separada do `main`.

```bash
git checkout frontend-paciente
git pull                       # pega as últimas alterações
# ... faça suas mudanças ...
git add frontend/
git commit -m "feat(frontend): descrição da mudança"
git push
```

Quando estiver pronto para juntar ao projeto principal, abra um **Pull Request** de `frontend-paciente` → `main` no GitHub.
