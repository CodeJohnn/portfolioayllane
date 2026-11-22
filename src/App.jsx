import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react';
import { perfil, experiencias, projetos, publicacoes } from './content';

const acervo = [
  { id: 'experiencias', titulo: 'Experiências', registros: experiencias },
  { id: 'projetos', titulo: 'Projetos acadêmicos', registros: projetos },
  { id: 'publicacoes', titulo: 'Publicações', registros: publicacoes },
];

const navegacao = [
  ['Início', 'inicio'],
  ['Sobre', 'sobre'],
  ['Formação', 'formacao'],
  ...acervo.map(({ id, titulo }) => [titulo, id]),
  ['Contato', 'contato'],
];

function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  const menu = useRef(null);

  function fecharComEscape(evento) {
    if (evento.key === 'Escape' && aberto) {
      setAberto(false);
      menu.current?.focus();
    }
  }

  return (
    <header className="masthead" onKeyDown={fecharComEscape}>
      <a className="wordmark" href="#inicio" onClick={() => setAberto(false)}>
        <span className="monogram" aria-hidden="true">AC</span>
        <span>{perfil.nome}</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        ref={menu}
        aria-label={aberto ? 'Fechar navegação' : 'Abrir navegação'}
        aria-controls="navegacao"
        aria-expanded={aberto}
        onClick={() => setAberto(!aberto)}
      >
        {aberto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="navegacao" className={aberto ? 'nav is-open' : 'nav'} aria-label="Navegação principal">
        {navegacao.map(([rotulo, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setAberto(false)}>{rotulo}</a>
        ))}
      </nav>
    </header>
  );
}

function Abertura({ origem, retrato }) {
  return (
    <section className="hero" id="inicio" aria-labelledby="titulo-principal">
      <div className="hero-scene" aria-hidden="true" />
      <div className="hero-portrait" ref={origem}>
        <img ref={retrato} src="/ayllane-retrato.png" alt="Ayllane Cristine em traje social" width="816" height="1927" fetchpriority="high" />
      </div>
      <div className="hero-copy">
        <p className="label">Portfólio acadêmico</p>
        <h1 id="titulo-principal">Ayllane <em>Cristine</em></h1>
        <p className="hero-role">{perfil.titulo}</p>
        <a className="hero-link" href="#sobre">
          Conheça minha trajetória <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function RegistroAcademico({ id, titulo, registros }) {
  return (
    <section id={id} className="record" aria-labelledby={`${id}-titulo`}>
      <h3 id={`${id}-titulo`}>{titulo}</h3>
      {registros.length ? (
        <ul className="record-list">
          {registros.map(({ titulo: nome, categoria, descricao }) => (
            <li key={nome}>
              {categoria && <p className="label">{categoria}</p>}
              <h4>{nome}</h4>
              <p>{descricao}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="record-empty">Ainda sem registros no portfólio.</p>
      )}
    </section>
  );
}

function Contato() {
  const telefone = perfil.telefone.replace(/\D/g, '');
  const gmail = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(perfil.email)}`;

  return (
    <section className="contact" id="contato" aria-labelledby="contato-titulo">
      <div className="container contact-grid" data-reveal>
        <div>
          <p className="label">Contato</p>
          <h2 id="contato-titulo">Entre em contato</h2>
          <p>Para conversas acadêmicas e profissionais.</p>
        </div>
        <address className="contact-links">
          <a href={gmail} target="_blank" rel="noopener noreferrer">
            <span className="label">Gmail</span>
            <span>{perfil.email}</span>
            <ArrowUpRight aria-hidden="true" size={19} />
          </a>
          <a href={`https://wa.me/${telefone}`} target="_blank" rel="noopener noreferrer">
            <span className="label">WhatsApp</span>
            <span>{perfil.telefone}</span>
            <ArrowUpRight aria-hidden="true" size={19} />
          </a>
          {perfil.linkedin && (
            <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer">
              <span className="label">Rede profissional</span>
              <span>LinkedIn</span>
              <ArrowUpRight aria-hidden="true" size={19} />
            </a>
          )}
        </address>
      </div>
    </section>
  );
}

function useRevelacao() {
  const conteudo = useRef(null);

  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          target.classList.add('reveal-in');
          observador.unobserve(target);
        }
      });
    }, { threshold: 0.15 });

    conteudo.current?.querySelectorAll('[data-reveal]').forEach((elemento) => observador.observe(elemento));
    return () => observador.disconnect();
  }, []);

  return conteudo;
}

function useRetratoNaRolagem() {
  const origem = useRef(null);
  const destino = useRef(null);
  const sobre = useRef(null);
  const retrato = useRef(null);

  useLayoutEffect(() => {
    const imagem = retrato.current;
    const quadroInicial = origem.current;
    const quadroFinal = destino.current;
    const secao = sobre.current;
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    let geometria;
    let quadro = null;

    function desenhar() {
      quadro = null;
      if (movimentoReduzido.matches || !geometria) return;

      const { fim, x, y, escala } = geometria;
      const progresso = Math.max(0, Math.min(1, window.scrollY / fim));
      imagem.style.transform = progresso === 0
        ? ''
        : `translate3d(${x * progresso}px, ${y * progresso}px, 0) scale(${1 + (escala - 1) * progresso})`;
    }

    function medir() {
      if (movimentoReduzido.matches) {
        imagem.style.removeProperty('transform');
        return;
      }

      const inicio = quadroInicial.getBoundingClientRect();
      const alvo = quadroFinal.getBoundingClientRect();
      const proporcao = Number(imagem.getAttribute('width')) / Number(imagem.getAttribute('height'));
      const alturaInicial = Math.min(inicio.height, inicio.width / proporcao);
      const alturaFinal = Math.min(alvo.height, alvo.width / proporcao, alturaInicial * 0.88);
      // O retrato deve chegar enquanto a seção entra na área de leitura.
      const entradaNaTela = window.innerHeight * 0.28;

      geometria = {
        fim: Math.max(1, secao.getBoundingClientRect().top + window.scrollY - entradaNaTela),
        x: alvo.left + alvo.width / 2 - (inicio.left + inicio.width / 2),
        y: alvo.top + (alvo.height + alturaFinal) / 2 - inicio.bottom,
        escala: alturaFinal / alturaInicial,
      };
      agendar();
    }

    function agendar() {
      if (quadro === null && !movimentoReduzido.matches) {
        quadro = window.requestAnimationFrame(desenhar);
      }
    }

    const observador = new ResizeObserver(medir);
    [quadroInicial, quadroFinal, secao, document.body].forEach((elemento) => observador.observe(elemento));
    window.addEventListener('resize', medir);
    window.addEventListener('scroll', agendar, { passive: true });
    movimentoReduzido.addEventListener('change', medir);
    medir();

    return () => {
      if (quadro !== null) window.cancelAnimationFrame(quadro);
      observador.disconnect();
      window.removeEventListener('resize', medir);
      window.removeEventListener('scroll', agendar);
      movimentoReduzido.removeEventListener('change', medir);
      imagem.style.removeProperty('transform');
    };
  }, []);

  return { origem, destino, sobre, retrato };
}

export default function App() {
  const conteudo = useRevelacao();
  const { origem, destino, sobre, retrato } = useRetratoNaRolagem();

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo" ref={conteudo} tabIndex={-1}>
        <Abertura origem={origem} retrato={retrato} />
        <section className="container profile" id="sobre" aria-labelledby="sobre-titulo" ref={sobre}>
          <div className="profile-photo" ref={destino} aria-hidden="true" />
          <div className="profile-copy" data-reveal>
            <p className="label">Sobre mim</p>
            <h2 id="sobre-titulo">Ayllane Cristine</h2>
            <p>{perfil.sobre}</p>
            <a className="line-link" href="#formacao">Ver formação <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </section>
        <section className="education" id="formacao" aria-labelledby="formacao-titulo">
          <div className="container education-grid" data-reveal>
            <h2 id="formacao-titulo">Formação</h2>
            <div>
              <h3>Bacharelado em Direito</h3>
              {perfil.faculdade && <p>{perfil.faculdade}</p>}
              {perfil.semestre && <p>{perfil.semestre}</p>}
              <p className="label">Graduação em andamento</p>
            </div>
          </div>
        </section>
        <section className="container academic" aria-labelledby="academico-titulo">
          <h2 id="academico-titulo">Atividade acadêmica</h2>
          <div className="records" data-reveal>
            {acervo.map((grupo) => <RegistroAcademico key={grupo.id} {...grupo} />)}
          </div>
        </section>
        <Contato />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <small>© {new Date().getFullYear()} Ayllane Cristine</small>
          <a href="#inicio">Voltar ao início <ArrowUp size={15} aria-hidden="true" /></a>
        </div>
      </footer>
    </>
  );
}

