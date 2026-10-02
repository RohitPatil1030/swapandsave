import type { Product } from "./marketplace-data";
import SwapPanel from "./SwapPanel";

type MarketplaceProps = {
  products: Product[];
  categories: string[];
  activeCategory: string;
  query: string;
  selected: Product;
  saved: string[];
  yourItem: string;
  yourValue: number;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onSelect: (product: Product) => void;
  onToggleSaved: (name: string) => void;
  onYourItemChange: (value: string) => void;
  onYourValueChange: (value: number) => void;
  onFindMatch: () => void;
};

export default function Marketplace({ products, categories, activeCategory, query, selected, saved, yourItem, yourValue, onCategoryChange, onQueryChange, onSelect, onToggleSaved, onYourItemChange, onYourValueChange, onFindMatch }: MarketplaceProps) {
  return <section className="content-section" id="discover"><div className="section-heading"><div><p className="eyebrow">FIND YOUR NEXT FAVORITE</p><h2>Browse the community</h2></div><a className="text-link" href="#all">View all listings <span>→</span></a></div><div className="toolbar"><div className="search-wrap"><span>⌕</span><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search for anything..." aria-label="Search listings" /></div><div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? "selected" : ""} onClick={() => onCategoryChange(category)}>{category}</button>)}</div><button className="filter-button">☷ <span>Filters</span></button></div><div className="listing-layout"><div className="product-grid">{products.map((product) => <article className={`product-card ${selected.name === product.name ? "chosen" : ""}`} key={product.name} onClick={() => onSelect(product)}><div className="product-image" style={{ backgroundColor: product.color, backgroundImage: `url(${product.image})` }}><button className="save-button" onClick={(event) => { event.stopPropagation(); onToggleSaved(product.name); }} aria-label={`Save ${product.name}`}>{saved.includes(product.name) ? "♥" : "♡"}</button><span className="condition">{product.condition}</span></div><div className="product-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><div className="product-meta"><strong>${product.price}</strong><span>·</span><span>Swap value</span></div><p className="seller">{product.seller} <span>·</span> {product.location}</p></div></article>)}</div><SwapPanel selected={selected} yourItem={yourItem} yourValue={yourValue} onYourItemChange={onYourItemChange} onYourValueChange={onYourValueChange} onFindMatch={onFindMatch} /></div></section>;
}
