import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Logo, Mascot, Checker, Sparkle, Squiggle } from './brand.jsx';
import { useLang, LangSwitch } from './i18n.jsx';
import { BRANCH, fmt } from './data.js';
import { useMenu } from './api.js';

const Reveal = ({ children, delay = 0, y = 30, className }) => (
  <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}>{children}</motion.div>
);

const sizeBg = { s: 'var(--yellow)', m: 'var(--orange)', l: 'var(--red)' };

function Cup({ h, color }) {
  return (
    <svg width={h * 0.8} height={h} viewBox="0 0 80 100" aria-hidden="true">
      <g stroke="#241A14" strokeWidth="3.5" strokeLinejoin="round">
        <rect x="20" y="6" width="9" height="44" rx="3" fill="#FFD966" transform="rotate(-10 24 50)" />
        <rect x="32" y="0" width="9" height="50" rx="3" fill="#FFC21A" />
        <rect x="44" y="4" width="9" height="46" rx="3" fill="#FFD966" transform="rotate(8 48 50)" />
        <path d="M8 40h64l-8 58H16Z" fill={color} />
        <path d="M12 60h56" stroke="#FFF4E0" strokeWidth="5" />
      </g>
    </svg>
  );
}

export default function Site() {
  const { t, L, lang } = useLang();
  const menu = useMenu();
  const flavorsText = menu.seasonings.map((s) => L(s.name));
  return (
    <div>
      <header className="nav">
        <div className="wrap nav__in">
          <Link to="/" aria-label="KARTO" style={{ textDecoration: 'none' }}><Logo size={34} /></Link>
          <nav className="nav__links" aria-label="Main">
            <a href="#how">{t('navHow')}</a><a href="#menu">{t('navMenu')}</a><a href="#story">{t('navStory')}</a><a href="#contact">{t('navContact')}</a>
          </nav>
          <div className="nav__right">
            <LangSwitch />
            <Link className="btn btn--yellow btn--sm" to="/app">{t('order')}</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero__blob" style={{ width: 520, height: 520, background: 'var(--yellow)', left: -200, top: -160 }} />
        <div className="hero__blob" style={{ width: 420, height: 420, background: 'var(--yellow)', right: -120, bottom: -160 }} />
        <div className="wrap hero__grid">
          <div>
            <Reveal><span className="kicker" style={{ color: '#A87900' }}><Sparkle size={18} /> {t('heroKicker')}</span></Reveal>
            <Reveal delay={0.08}><h1 style={{ marginTop: 18 }}>{t('heroTitle1')}<em>{t('heroTitle2')}</em></h1></Reveal>
            <Reveal delay={0.16}><p className="hero__lead">{t('heroLead')}</p></Reveal>
            <Reveal delay={0.24}>
              <div className="hero__ctas">
                <Link className="btn btn--yellow" to="/app">{t('order')} →</Link>
                <a className="btn btn--ghost" href="#menu">{t('seeMenu')}</a>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="hero__stats">
                <div><b>3</b><span>{t('statSizes')}</span></div>
                <div><b>{menu.seasonings.length}</b><span>{t('statSeason')}</span></div>
                <div><b>3</b><span>{t('statServe')}</span></div>
              </div>
            </Reveal>
          </div>
          <motion.div className="hero__campaign" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <img src="/img/karto-packaging-family.png" alt="KARTO fries, juice, water and cup packaging collection" />
          </motion.div>
        </div>
        <Checker color="var(--yellow)" />
      </section>

      <div className="marquee" aria-hidden="true">
        <motion.div className="marquee__track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
          {[0, 1].map((k) => (
            <span key={k}>{flavorsText.map((f) => <span key={f + k}>{f} <Sparkle size={22} color="var(--red)" /></span>)}</span>
          ))}
        </motion.div>
      </div>

      <section className="section" id="how">
        <div className="wrap">
          <div className="section__head">
            <div><span className="kicker" style={{ color: 'var(--orange-d)' }}>{t('howKicker')}</span><h2 style={{ marginTop: 10 }}>{t('howTitle')}</h2></div>
            <Squiggle color="var(--orange)" w={160} />
          </div>
          <div className="steps">
            {[['1', 'step1', 'var(--yellow)'], ['2', 'step2', 'var(--orange)'], ['3', 'step3', 'var(--red)'], ['4', 'step4', 'var(--green-l)']].map(([n, k, c], i) => (
              <Reveal key={n} delay={i * 0.08}>
                <div className="step">
                  <div className="step__n" style={{ background: c, color: i > 1 ? '#fff' : 'var(--ink)' }}>{n}</div>
                  <h3>{t(k)}</h3><p>{t(k + 't')}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="menu" style={{ background: 'var(--paper)', borderBlock: '4px solid var(--ink)' }}>
        <div className="wrap">
          <div className="section__head"><h2>{t('sizesTitle')}</h2><p>{t('sizesLead')}</p></div>
          <div className="sizes">
            {menu.sizes.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1}>
                <div className="size" style={{ background: sizeBg[s.id], color: s.id === 's' ? 'var(--ink)' : '#fff' }}>
                  <div className="size__cup"><Cup h={110 + i * 40} color={s.id === 's' ? '#FFF4E0' : sizeBg[s.id]} /></div>
                  <h3>{L(s.name)}</h3>
                  <div className="size__g">{s.grams} g</div>
                  <div className="size__p">{fmt(s.price, lang)}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="section__head" style={{ marginTop: 100 }}><h2>{t('serveTitle')}</h2></div>
          <p className="serve__lead">{t('packagingLead')}</p>
          <Reveal className="serve__campaign"><img src="/img/karto-packaging-family.png" alt="KARTO packaging collection: fries sizes, tall cups, water bottles, juice bottles and pouches" loading="lazy" /></Reveal>

          <div className="section__head" style={{ marginTop: 100 }}><h2>{t('seasonTitle')}</h2><p>{t('seasonLead')}</p></div>
          <div className="flavors">
            {menu.seasonings.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05} y={16}><span className="flavor"><i className="dot" style={{ background: s.color }} />{L(s.name)}</span></Reveal>
            ))}
          </div>

          <div className="duo">
            <div className="list-card"><h3>{t('saucesTitle')}</h3>
              {menu.sauces.map((s) => <div className="row" key={s.id}><span style={{ display: 'flex', gap: 10, alignItems: 'center' }}><i className="dot" style={{ background: s.color }} />{L(s.name)}</span><span>{fmt(s.price, lang)}</span></div>)}
            </div>
            <div className="list-card"><h3>{t('drinksTitle')}</h3>
              {menu.drinks.map((s) => <div className="row" key={s.id}><span>{L(s.name)}</span><span>{fmt(s.price, lang)}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section story" id="story">
        <div className="wrap story__grid">
          <Reveal className="story__img"><img src="/img/karto-packaging-family.png" alt="KARTO packaging collection: fries sizes, water bottles, medium-height tactile cups, rectangular juice bottles and broad juice pouches" /></Reveal>
          <Reveal delay={0.1}>
            <span className="kicker" style={{ color: 'var(--yellow)' }}>{t('storyKicker')}</span>
            <h2>{t('storyTitle')}</h2>
            <p>{t('storyText')}</p>
            <div className="promises">
              {['promise1', 'promise2', 'promise3', 'promise4'].map((k) => <div className="promise" key={k}><Sparkle size={18} />{t(k)}</div>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="appband">
        <div className="wrap appband__grid">
          <Reveal>
            <h2>{t('appTitle')}</h2>
            <p>{t('appLead')}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn--green" to="/app">{t('openApp')} →</Link>
              <a className="btn btn--ghost" href="/app">{t('install')}</a>
            </div>
            <p style={{ fontSize: 15, marginTop: 18 }}>{t('alsoOn')}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="phone"><div className="phone__screen">
              <div style={{ background: 'var(--green-d)', padding: '28px 16px 14px' }}><Logo size={24} /></div>
              <div style={{ padding: 14 }}>
                <div className="promo" style={{ minHeight: 190 }}><img src="/img/cone-sm.webp" alt="" style={{ width: '58%' }} />
                  <div className="promo__txt" style={{ padding: 16 }}><h2 style={{ fontSize: 22 }}>{t('whatToday')}</h2></div></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
                  {menu.sizes.map((s) => <div key={s.id} className="opt" style={{ background: sizeBg[s.id], color: s.id === 's' ? 'var(--ink)' : '#fff', fontSize: 13 }}>{L(s.name)}</div>)}
                </div>
                <img src="/img/tray-sm.webp" alt="" style={{ borderRadius: 16, marginTop: 14, border: '3px solid var(--ink)' }} />
              </div>
            </div></div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="wrap">
          <div className="section__head"><h2>{t('contactTitle')}</h2><Mascot size={90} /></div>
          <div className="contact">
            <div className="contact__card"><small>{t('address')}</small><b>{L(BRANCH.address)}</b></div>
            <div className="contact__card"><small>{t('phone')}</small><b>{BRANCH.phone}</b></div>
            <div className="contact__card"><small>{t('hours')}</small><b>{BRANCH.hours}</b></div>
            <div className="contact__card"><small>{t('social')}</small><b>{BRANCH.instagram}<br />{BRANCH.telegram}</b></div>
          </div>
          <p className="muted" style={{ marginTop: 22 }}>{t('allergen')}</p>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer__in">
          <Logo size={30} /><span>Beyond Ordinary Potatoes.</span><span>© {new Date().getFullYear()} KARTO. {t('footer')}</span>
        </div>
      </footer>
    </div>
  );
}
