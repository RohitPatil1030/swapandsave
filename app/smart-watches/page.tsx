"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SmartWatches from "../components/SmartWatches";
import { smartWatches, type Product } from "../components/marketplace-data";

export default function SmartWatchesPage() {
  const [selected, setSelected] = useState<Product>(smartWatches[0]);
  const [saved, setSaved] = useState<string[]>([]);
  const toggleSaved = (name: string) => setSaved((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name]);

  return <main className="app-shell">
    <Header />
    <section className="watch-page-hero"><p className="eyebrow">SMART WATCHES COLLECTION</p><h1>Wear your day.<br /><em>Swap your way.</em></h1><p>Find a watch that fits your rhythm, then trade up when your next adventure calls.</p><a className="button button-green" href="#smart-watches">Browse the collection <span>↓</span></a></section>
    <SmartWatches watches={smartWatches} selected={selected} saved={saved} onSelect={setSelected} onToggleSaved={toggleSaved} />
    <section className="watch-page-note"><span className="brand-mark"><span>↗</span><span>↙</span></span><div><p className="eyebrow">SMART VALUE ENGINE</p><h2>Every watch has a next chapter.</h2><p>Compare condition, model, and current demand to find a fair swap value before you make an offer.</p></div><Link className="text-link" href="/#discover">Browse all products <span>→</span></Link></section>
    <Footer />
  </main>;
}
