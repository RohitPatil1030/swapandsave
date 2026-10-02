"use client";

import { useMemo, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import Marketplace from "./Marketplace";
import SmartWatches from "./SmartWatches";
import { categories, products, smartWatches, type Product } from "./marketplace-data";

export default function HomeMarketplace() {
  const [activeCategory, setActiveCategory] = useState("All items");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product>(products[0]);
  const [saved, setSaved] = useState<string[]>([]);
  const [yourItem, setYourItem] = useState("Kindle Paperwhite");
  const [yourValue, setYourValue] = useState(220);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All items" || product.category === activeCategory;
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.location.toLowerCase().includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const toggleSaved = (name: string) => {
    setSaved((items) => (items.includes(name) ? items.filter((item) => item !== name) : [...items, name]));
  };

  const handleFindMatch = () => {
    if (visibleProducts.length === 0) return;

    const targetPrice = Number(yourValue) || 0;
    const bestMatch = [...visibleProducts]
      .filter((product) => product.name !== selected.name)
      .sort((a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice))[0];

    if (bestMatch) {
      setSelected(bestMatch);
    }
  };

  return (
    <main className="app-shell">
      <Header />
      <Hero />
      <Marketplace
        products={visibleProducts}
        categories={categories}
        activeCategory={activeCategory}
        query={query}
        selected={selected}
        saved={saved}
        yourItem={yourItem}
        yourValue={yourValue}
        onCategoryChange={setActiveCategory}
        onQueryChange={setQuery}
        onSelect={setSelected}
        onToggleSaved={toggleSaved}
        onYourItemChange={setYourItem}
        onYourValueChange={setYourValue}
        onFindMatch={handleFindMatch}
      />
      <SmartWatches
        watches={smartWatches}
        selected={selected}
        saved={saved}
        onSelect={setSelected}
        onToggleSaved={toggleSaved}
      />
      <Footer />
    </main>
  );
}
