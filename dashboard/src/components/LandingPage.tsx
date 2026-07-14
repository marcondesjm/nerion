import { useEffect, useRef } from "react";
import "@/styles/landing.css";

const PRODUCT_NAME = "Nerion OS";
const PRODUCT_SLUG = "nerion-os";

const lessonImages = [
  "https://mazyos.com.br/assets/a11da237-2519-4965-8b9f-5b6f2263f5c9.jpg",
  "https://mazyos.com.br/assets/Screenshot%20at%20May%2013%2016-24-07.png",
  "https://mazyos.com.br/assets/f854894a-de6b-48e5-9347-527ec30f1dfa.jpg",
];

const explorerGroups = [
  {
    folder: "_contexto/",
    note: "quem voce e, ICP, oferta",
    files: [
      ["empresa.md", "M"],
      ["preferencias.md", "tom de voz, marca"],
      ["estrategia.md", "foco e prazos"],
    ],
  },
  {
    folder: "clientes/",
    note: "um contexto por cliente",
    files: [
      ["nike/", "M"],
      ["adidas/", ""],
      ["burger-king/", "+"],
    ],
  },
  {
    folder: "marca/",
    note: "design system, logos",
    files: [
      ["paleta.css", ""],
      ["tipografia.md", ""],
      ["assets/", ""],
    ],
  },
  {
    folder: "conteudo/",
    note: "carrosseis, posts, copies",
    files: [
      ["carrosseis/", "+"],
      ["posts/", ""],
      ["copies/", ""],
    ],
  },
  {
    folder: "ads/",
    note: "campanhas, criativos, copies",
    files: [
      ["campanhas/", ""],
      ["criativos/", ""],
      ["copies-ads.md", ""],
    ],
  },
  {
    folder: "propostas/",
    note: "modelos comerciais",
    files: [
      ["template-base.md", ""],
      ["pricing.json", ""],
      ["garantia.md", ""],
    ],
  },
  {
    folder: ".claude/",
    note: "skills + commands do Nerion OS",
    files: [
      ["skills/", "gerador-carrossel/"],
      ["proposta-comercial/", ""],
      ["resposta-atendimento/", ""],
      ["commands/", "atalhos do dia a dia"],
    ],
  },
];

const faqs = [
  [
    `O que exatamente o ${PRODUCT_NAME} faz?`,
    `${PRODUCT_NAME} organiza contexto, skills e comandos para transformar IA em operacao. Ele deixa memoria, pastas e execucoes prontas para marketing, vendas, conteudo e atendimento.`,
  ],
  [
    "Funciona para a minha empresa?",
    "Funciona para pequenas empresas, grandes empresas, prestadores de servicos, agencias e profissionais solo que querem usar IA com processo.",
  ],
  [
    "Como comeca um projeto?",
    `Voce recebe o acesso, instala o ${PRODUCT_NAME}, responde sobre o negocio e deixa memoria, skills e comandos prontos para operar.`,
  ],
  [
    "Quanto tempo ate ver resultado?",
    "A estrutura fica pronta para usar no mesmo dia. O resultado depende da implementacao, mas a base ja nasce organizada para execucao.",
  ],
  [
    "Funciona com Codex?",
    "Funciona. A estrutura pode rodar no Codex mantendo contextos, skills e comandos dentro do projeto.",
  ],
  [
    "Vai ter aulas de implementacao?",
    "Vai. As aulas cobrem prospeccao, entrega e expansao de LTV para quem quer atender empresas com IA.",
  ],
];

function ExplorerMockup() {
  return (
    <div className="vscode-card" aria-label={`Explorer do ${PRODUCT_NAME}`}>
      <div className="vscode-top">
        <div className="traffic">
          <span />
          <span />
          <span />
        </div>
        <span>~/{PRODUCT_SLUG}</span>
        <strong>3 alteracoes · main</strong>
      </div>
      <div className="vscode-body">
        <aside className="activity-bar">
          <span>□</span>
          <span>⌕</span>
          <span className="active">⑂</span>
          <span>▦</span>
          <span>▶</span>
        </aside>
        <section className="explorer-panel">
          <div className="explorer-header">
            <strong>EXPLORER</strong>
            <span>~ / projetos / {PRODUCT_SLUG}</span>
            <em>+ ↻ ⋯</em>
          </div>
          <div className="tree">
            {explorerGroups.map((group) => (
              <div className="tree-group" key={group.folder}>
                <div className="tree-folder">
                  <span>▸</span>
                  <strong>{group.folder}</strong>
                  <small>- {group.note}</small>
                </div>
                {group.files.map(([file, note]) => (
                  <div className="tree-file" key={`${group.folder}-${file}`}>
                    <span>{file}</span>
                    {note && <small>{note}</small>}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="terminal-row">
            <span>›</span>
            <strong>nerion</strong>
            <em>sync --all</em>
            <i />
          </div>
        </section>
      </div>
      <div className="vscode-status">
        <span>main</span>
        <span>3 alteracoes</span>
        <span>0 problemas</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>Spaces: 2</span>
      </div>
    </div>
  );
}

export function LandingPage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const page = pageRef.current;
      if (!page || page.scrollTop > 30) {
        return;
      }

      page.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }, 12400);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="mazyos-clone" ref={pageRef}>
      <section className="intro-screen" aria-label="Apresentacao Nerion OS">
        <div className="intro-words nerion-intro">
          <span>Nerion OS.</span>
          <span>Mais velocidade.</span>
          <span>Mais contexto.</span>
          <span>Mais organizacao.</span>
          <span>Mais inteligencia.</span>
          <span>Tudo com Nerion OS.</span>
        </div>
      </section>

      <section className="hero-screen" id="hero">
        <div className="hero-content">
          <div className="hero-copy">
            <span className="label">NERION OS · SISTEMA OPERACIONAL</span>
            <h1>
              Transforme empresas
              <br />
              com um sistema
              <br />
              inteligente de IA.
            </h1>
            <p>Implemente, organize e escale com todas as pastas conectadas.</p>
            <a className="outline-button" href="#pricing">
              ACESSAR NERION OS
            </a>
          </div>
          <img
            className="robot"
            src="/assets/hero/nerion-os-android.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="lessons-screen" id="lessons">
        <h2>Nerion OS + Aulas de como implementar</h2>
        <p>Os mesmos segredos aplicados em projetos reais, abertos para voce.</p>
        <div className="lesson-stack">
          {lessonImages.map((image, index) => (
            <img
              alt="Aula do metodo Nerion OS"
              key={image}
              src={image}
              style={{ transform: `translateX(${(index - 1) * 28}px) rotate(${(index - 1) * 3}deg)` }}
            />
          ))}
        </div>
        <a className="outline-button" href="#pricing">
          QUERO CONHECER
        </a>
      </section>

      <section className="pricing-screen" id="pricing">
        <div className="pricing-title">
          <h2>Pronto para começar?</h2>
          <p>Contextos, habilidades e comandos prontos para você voar.</p>
        </div>
        <div className="pricing-grid">
          <article className="price-panel">
            <span>ACESSO IMEDIATO</span>
            <h3>Comece a usar o Nerion OS agora</h3>
            <p>Sistema completo, skills, aulas e atualizacoes.</p>
            <hr />
            <div className="price-box">
              <span>PAGAMENTO UNICO</span>
              <div>
                <small>R$</small>
                <strong>47</strong>
              </div>
              <em>a vista no PIX ou cartao</em>
            </div>
            <hr />
            <a className="solid-button" href="https://pay.kirvano.com" rel="noreferrer" target="_blank">
              GARANTIR ACESSO POR R$ 47
            </a>
            <p className="fine-print">Acesso liberado imediatamente apos o pagamento.</p>
            <p className="update-print">
              Preco da primeira versao.
              <br />A cada atualizacao, sobe R$ 29.
            </p>
          </article>
          <ExplorerMockup />
        </div>
      </section>

      <section className="faq-screen">
        <span>Duvidas frequentes</span>
        <h2>Tudo o que voce precisa saber</h2>
        <div className="faq-box">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="thanks-card">
        <div>
          <span>500 MEMBROS</span>
          <h2>Muito obrigado aos 500 membros.</h2>
          <p>Voce faz parte da primeira leva do Nerion OS.</p>
          <hr />
          <p>
            Entre antes da proxima leva e receba a tag de <strong>Fundador Nerion OS</strong> na comunidade.
          </p>
          <a className="solid-button" href="#pricing">
            GARANTIR ACESSO
          </a>
        </div>
      </section>

      <footer className="clone-footer">
        <p>Nerion Marketing e Servicos Digitais LTDA</p>
        <p>contato@nerionos.com.br</p>
        <p>© 2026 Nerion. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
