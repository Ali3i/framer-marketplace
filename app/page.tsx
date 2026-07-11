"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Gift,
  Menu,
  Minus,
  Pause,
  Play,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id: "sole" | "auralis" | "celeste";
  name: string;
  price: number;
  description: string;
  material: string;
  image: string;
  alt: string;
  index: string;
};

type CartLine = { product: Product; quantity: number };

const products: Product[] = [
  {
    id: "sole",
    name: "Solé Ring",
    price: 420,
    description: "A soft gold ring finished with a pearl accent for effortless daily elegance.",
    material: "18k gold-plated stainless steel, pearl detail.",
    image: "/images/sole-ring.png",
    alt: "Slim champagne-gold Solé ring with a small pearl accent",
    index: "01",
  },
  {
    id: "auralis",
    name: "Auralis Bracelet",
    price: 590,
    description: "A sculpted bracelet designed to sit lightly on the wrist with a refined glow.",
    material: "18k gold-plated brass, zircon accents.",
    image: "/images/auralis-bracelet.png",
    alt: "Curved champagne-gold Auralis bracelet with subtle zircon accents",
    index: "02",
  },
  {
    id: "celeste",
    name: "Celeste Pendant",
    price: 480,
    description: "A delicate moon pendant inspired by quiet evenings and soft feminine light.",
    material: "18k gold-plated chain, pearl center.",
    image: "/images/celeste-pendant.png",
    alt: "Delicate Celeste necklace with a moon pendant and pearl center",
    index: "03",
  },
];

const testimonials = [
  "The ring feels delicate but premium. I wear it almost every day.",
  "The packaging alone felt like a luxury gift.",
  "Minimal, feminine, and exactly my style.",
];

const ease = [0.22, 1, 0.36, 1] as const;
const MotionImage = motion.create(Image);

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand-mark${light ? " brand-mark--light" : ""}`} href="#top" aria-label="Luméa Atelier home">
      <span className="brand-name">Luméa<span className="pearl-dot" aria-hidden="true" /></span>
      <span className="brand-atelier">Atelier</span>
    </a>
  );
}

function Header({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  const links = [
    ["Collection", "#collection"],
    ["Story", "#story"],
    ["Craft", "#craft"],
    ["Gift", "#gift"],
    ["Contact", "#contact"],
  ];

  return (
    <>
      <motion.header
        className={`site-header${scrolled ? " site-header--scrolled" : ""}`}
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.8, ease }}
      >
        <BrandMark />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="shop-link" href="#collection">Shop now</a>
          <button className="icon-button bag-button" onClick={onCartOpen} aria-label={`Open shopping bag, ${cartCount} items`}>
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="bag-count" aria-hidden="true">{cartCount}</span>
          </button>
          <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={21} strokeWidth={1.4} />
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mobile-menu__top">
              <BrandMark />
              <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
            </div>
            <nav aria-label="Mobile navigation">
              {links.map(([label, href], index) => (
                <motion.a
                  href={href}
                  key={label}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.6, ease }}
                ><span>0{index + 1}</span>{label}</motion.a>
              ))}
            </nav>
            <p>Quietly luminous jewelry, made for every version of you.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MagneticLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  return (
    <motion.a
      href={href}
      className={`button${secondary ? " button--secondary" : ""}`}
      animate={offset}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({ x: (event.clientX - rect.left - rect.width / 2) * 0.12, y: (event.clientY - rect.top - rect.height / 2) * 0.12 });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >{children}</motion.a>
  );
}

function HeroSection() {
  const visualRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 45, damping: 20 });
  const y = useSpring(my, { stiffness: 45, damping: 20 });
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.94]);
  const reduced = useReducedMotion();

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === "touch") return;
    const rect = visualRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 18);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * 14);
  };

  return (
    <section className="hero" id="top" onPointerMove={handlePointer} onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <div className="hero-light hero-light--one" aria-hidden="true" />
      <div className="hero-light hero-light--two" aria-hidden="true" />
      <div className="dust" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} />)}</div>
      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.7, ease }}>
            The debut collection · 2026
          </motion.p>
          <h1 aria-label="Jewelry that moves with your light.">
            {["Jewelry that", "moves with", "your light."].map((line, index) => (
              <span className={index === 2 ? "italic" : ""} key={line}>
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 1.08 + index * 0.12, duration: 0.95, ease }}>{line}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-subcopy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8, ease }}>
            Three timeless pieces designed for quiet elegance, soft confidence, and everyday luxury.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.75, duration: 0.75, ease }}>
            <MagneticLink href="#collection">Explore collection <ArrowRight size={16} /></MagneticLink>
            <MagneticLink href="#film" secondary><Play size={14} fill="currentColor" /> Watch the film</MagneticLink>
          </motion.div>
          <motion.div className="hero-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}>
            <span>01 — 03</span><span>Champagne gold<br />Pearl details</span>
          </motion.div>
        </div>
        <motion.div className="hero-visual" ref={visualRef} style={reduced ? undefined : { y: heroY, scale: heroScale }}>
          <div className="hero-orbit hero-orbit--outer" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--inner" aria-hidden="true" />
          <motion.div className="hero-image-wrap" style={reduced ? undefined : { x, y }} initial={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ delay: 0.8, duration: 1.35, ease }}>
            <Image src="/images/hero-jewelry.png" alt="Solé ring, Auralis bracelet, and Celeste pendant floating together in warm light" fill priority sizes="(max-width: 820px) 120vw, 58vw" />
            <div className="hero-image-sheen" aria-hidden="true" />
          </motion.div>
          <motion.div className="product-label product-label--ring" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2, duration: 0.8 }}><i />Solé ring</motion.div>
          <motion.div className="product-label product-label--bracelet" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.15, duration: 0.8 }}>Auralis bracelet<i /></motion.div>
          <motion.div className="product-label product-label--pendant" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 0.8 }}><i />Celeste pendant</motion.div>
        </motion.div>
      </div>
      <a className="scroll-cue" href="#film"><span>Scroll to discover</span><i /></a>
    </section>
  );
}

function SectionIntro({ label, title, copy, dark = false }: { label: string; title: React.ReactNode; copy?: string; dark?: boolean }) {
  return (
    <motion.div className={`section-intro${dark ? " section-intro--dark" : ""}`} initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.85, ease }}>
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </motion.div>
  );
}

function ProductFilm() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  const scenes = [
    { image: "/images/sole-ring.png", label: "Solé / Reflection study", position: "52% 54%" },
    { image: "/images/auralis-bracelet.png", label: "Auralis / Satin study", position: "50% 46%" },
    { image: "/images/celeste-pendant.png", label: "Celeste / Light study", position: "50% 58%" },
  ];

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => setScene((current) => (current + 1) % scenes.length), 4300);
    return () => window.clearInterval(timer);
  }, [playing, reduced, scenes.length]);

  return (
    <section className="film-section" id="film">
      <div className="page-shell film-shell">
        <div className="film-topline"><span>The collection in motion</span><span>Film 01 · 00:18</span></div>
        <motion.div className="film-frame" initial={{ clipPath: "inset(12% 8% 12% 8%)", opacity: 0.5 }} whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease }}>
          <AnimatePresence mode="wait">
            <MotionImage
              key={scenes[scene].image}
              src={scenes[scene].image}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 640px) 100vw, 88vw"
              style={{ objectPosition: scenes[scene].position }}
              initial={{ opacity: 0, scale: 1.07 }}
              animate={{ opacity: 1, scale: playing && !reduced ? 1.015 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2 }, scale: { duration: 4.5, ease: "linear" } }}
            />
          </AnimatePresence>
          <div className="film-vignette" aria-hidden="true" />
          <button className="film-control" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause collection film" : "Play collection film"}>
            {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
          </button>
          <p className="film-scene"><span>0{scene + 1}</span>{scenes[scene].label}</p>
        </motion.div>
        <motion.p className="film-caption" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>
          Designed to catch light softly — <em>never loudly.</em>
        </motion.p>
      </div>
    </section>
  );
}

function ProductCard({ product, onView }: { product: Product; onView: (product: Product) => void }) {
  return (
    <motion.article className={`product-card product-card--${product.id}`} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.85, ease }}>
      <button className="product-image" onClick={() => onView(product)} aria-label={`View ${product.name}`}>
        <span className="product-index">{product.index}</span>
        <Image src={product.image} alt={product.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 820px) 50vw, 33vw" />
        <span className="image-glow" aria-hidden="true" />
      </button>
      <div className="product-info">
        <div className="product-heading"><h3>{product.name}</h3><span>{product.price} SAR</span></div>
        <p>{product.description}</p>
        <div className="product-material"><span>Material</span><p>{product.material}</p></div>
        <button className="text-link" onClick={() => onView(product)}>View piece <ArrowRight size={15} /></button>
      </div>
    </motion.article>
  );
}

function ProductShowcase({ onView }: { onView: (product: Product) => void }) {
  return (
    <section className="collection-section" id="collection">
      <div className="page-shell">
        <div className="collection-heading">
          <SectionIntro label="The debut collection · Three pieces" title={<>A quiet signature,<br /><em>made luminous.</em></>} />
          <p>Each form is considered from every angle—designed to layer beautifully and feel personal from the first wear.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} onView={onView} key={product.id} />)}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="story-section" id="story">
      <div className="story-grid page-shell">
        <div className="story-copy">
          <SectionIntro label="Our story · 04" title={<>Made for the moments between <em>ordinary and unforgettable.</em></>} />
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.8, ease }}>
            Luméa Atelier creates jewelry for women who prefer elegance without noise. Each piece is designed with soft curves, warm reflections, and timeless details that feel personal from the first wear.
          </motion.p>
          <div className="story-signature"><i /><span>Designed in quiet light<br />Luméa Atelier</span></div>
        </div>
        <motion.div className="story-visual" initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease }}>
          <Image src="/images/celeste-pendant.png" alt="Macro view of the Celeste moon pendant catching warm light" fill sizes="(max-width: 820px) 100vw, 55vw" />
          <div className="story-reflection" aria-hidden="true" />
          <span>Soft light study · Celeste</span>
        </motion.div>
      </div>
    </section>
  );
}

function CraftSection() {
  const features = [
    { icon: Sparkles, title: "Soft Gold Finish", text: "Warm champagne tones, polished to glow softly against the skin." },
    { icon: CircleDot, title: "Pearl-Inspired Details", text: "Small, luminous accents chosen for their quiet feminine character." },
    { icon: Gift, title: "Gift-Ready Packaging", text: "Ivory presentation boxes finished with a restrained touch of gold." },
  ];
  return (
    <section className="craft-section" id="craft">
      <div className="page-shell">
        <div className="craft-title"><p className="eyebrow">The Luméa standard · 05</p><h2>Considered in every detail.</h2></div>
        <div className="craft-grid">
          {features.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.75, ease }}>
              <div className="craft-icon"><Icon size={25} strokeWidth={1.2} /></div><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><i />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiftSection() {
  return (
    <section className="gift-section" id="gift">
      <div className="gift-aura" aria-hidden="true" />
      <div className="gift-grid page-shell">
        <motion.div className="gift-visual" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1, ease }}>
          <div className="gift-orbit" aria-hidden="true" />
          <Image src="/images/gift-box.png" alt="Luméa ivory jewelry gift box with a warm golden glow" width={1448} height={1086} sizes="(max-width: 820px) 100vw, 55vw" />
          <span>Signature ivory packaging</span>
        </motion.div>
        <div className="gift-copy">
          <SectionIntro label="The art of giving · 06" title={<>A small box.<br /><em>A lasting impression.</em></>} copy="Every Luméa piece arrives in our signature ivory box with gold foil detail, ready to gift." />
          <MagneticLink href="#collection">Choose a gift <ArrowRight size={16} /></MagneticLink>
          <p className="gift-note">A personal note can be included with every order.</p>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const change = (direction: number) => setActive((current) => (current + direction + testimonials.length) % testimonials.length);
  return (
    <section className="testimonials-section" aria-label="Customer notes">
      <div className="page-shell testimonials-shell">
        <p className="eyebrow">Worn & remembered · 07</p>
        <div className="quote-mark" aria-hidden="true">“</div>
        <div className="quote-stage" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.blockquote key={active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease }}>
              “{testimonials[active]}”
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="quote-controls">
          <span>0{active + 1} / 0{testimonials.length}</span>
          <div><button onClick={() => change(-1)} aria-label="Previous testimonial"><ArrowLeft /></button><button onClick={() => change(1)} aria-label="Next testimonial"><ArrowRight /></button></div>
        </div>
        <div className="quote-traces" aria-hidden="true">{testimonials.map((_, index) => <i className={index === active ? "active" : ""} key={index} />)}</div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="final-glow" aria-hidden="true" />
      <div className="final-orbit final-orbit--one" aria-hidden="true" />
      <div className="final-orbit final-orbit--two" aria-hidden="true" />
      <motion.div className="final-content" initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 1, ease }}>
        <p className="eyebrow">Your first Luméa · 08</p>
        <h2>Begin with <em>one piece.</em></h2>
        <p>Discover the three-piece debut collection from Luméa Atelier.</p>
        <MagneticLink href="#collection">Shop the collection <ArrowRight size={16} /></MagneticLink>
      </motion.div>
      <span className="final-signature" aria-hidden="true">L · A</span>
    </section>
  );
}

function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubscribed(true); };
  return (
    <footer id="contact">
      <div className="footer-main page-shell">
        <div className="footer-brand"><BrandMark light /><p>Quietly luminous jewelry for the moments that stay with you.</p></div>
        <div className="footer-links"><div><span>Explore</span><a href="#collection">Collection</a><a href="#story">Our story</a><a href="#gift">Gifting</a></div><div><span>Care</span><a href="#contact">Shipping</a><a href="#contact">Returns</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></div></div>
        <div className="newsletter"><span>Letters from Luméa</span><p>Private notes, new pieces, and gifting rituals.</p>{subscribed ? <p className="subscribe-success">You’re on the list. Welcome to Luméa.</p> : <form onSubmit={submit}><label htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" type="email" required placeholder="you@example.com" /><button type="submit" aria-label="Subscribe to newsletter"><ArrowRight /></button></div></form>}</div>
      </div>
      <div className="footer-bottom page-shell"><span>© 2026 Luméa Atelier</span><span>Riyadh · Saudi Arabia</span><span>Terms · Privacy</span></div>
    </footer>
  );
}

function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return (
    <AnimatePresence>
      {open && <motion.div className="drawer-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button className="drawer-backdrop" onClick={onClose} aria-label="Close dialog" />
        <motion.div className="drawer" role="dialog" aria-modal="true" aria-label={title} ref={panelRef} tabIndex={-1} onKeyDown={trapFocus} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.65, ease }}>
          <div className="drawer-head"><BrandMark /><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X /></button></div>
          {children}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}

function ProductDrawer({ product, onClose, onAdd }: { product: Product | null; onClose: () => void; onAdd: (product: Product) => void }) {
  const [added, setAdded] = useState(false);
  return (
    <Drawer open={Boolean(product)} onClose={onClose} title={product ? `${product.name} details` : "Piece details"}>
      {product && <div className="quick-view">
        <div className="quick-image"><Image src={product.image} alt={product.alt} fill sizes="480px" /></div>
        <p className="eyebrow">Debut collection · {product.index}</p>
        <div className="quick-title"><h2>{product.name}</h2><span>{product.price} SAR</span></div>
        <p>{product.description}</p><div className="quick-material"><span>Material</span><p>{product.material}</p></div>
        <button className="button quick-add" onClick={() => { onAdd(product); setAdded(true); }}>{added ? "Added to bag" : "Add to bag"}<ShoppingBag size={17} /></button>
        <span className="quick-note">Complimentary signature packaging included.</span>
      </div>}
    </Drawer>
  );
}

function CartDrawer({ open, onClose, lines, updateQuantity }: { open: boolean; onClose: () => void; lines: CartLine[]; updateQuantity: (id: Product["id"], amount: number) => void }) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return (
    <Drawer open={open} onClose={onClose} title="Shopping bag">
      <div className="cart-content">
        <div className="cart-title"><p className="eyebrow">Your selection</p><h2>Shopping bag</h2></div>
        {lines.length === 0 ? <div className="empty-cart"><ShoppingBag strokeWidth={1} /><p>Your bag is waiting for something luminous.</p><button className="text-link" onClick={onClose}>Explore the collection <ArrowRight size={15} /></button></div> : <>
          <div className="cart-lines">{lines.map(({ product, quantity }) => <article key={product.id}><Image src={product.image} alt="" width={110} height={130} /><div><h3>{product.name}</h3><p>{product.price} SAR</p><div className="quantity"><button onClick={() => updateQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus /></button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus /></button></div></div></article>)}</div>
          <div className="cart-total"><div><span>Subtotal</span><strong>{subtotal} SAR</strong></div><p>Shipping calculated at checkout.</p><button className="button">Continue to checkout <ArrowRight size={16} /></button></div>
        </>}
      </div>
    </Drawer>
  );
}

function Loader() {
  return (
    <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.65, ease } }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}><BrandMark /><motion.i animate={{ scale: [0.65, 1, 0.65], opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.2, repeat: Infinity }} /></motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 1050); return () => window.clearTimeout(timer); }, []);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      return existing ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: Product["id"], amount: number) => setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0));
  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main>
        <HeroSection />
        <ProductFilm />
        <ProductShowcase onView={setSelected} />
        <BrandStory />
        <CraftSection />
        <GiftSection />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <ProductDrawer key={selected?.id ?? "empty"} product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} lines={cart} updateQuantity={updateQuantity} />
    </>
  );
}
