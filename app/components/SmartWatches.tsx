import type { Product } from "./marketplace-data";

type SmartWatchesProps = {
  watches: Product[];
  selected: Product;
  saved: string[];
  onSelect: (watch: Product) => void;
  onToggleSaved: (name: string) => void;
};

export default function SmartWatches({ watches, selected, saved, onSelect, onToggleSaved }: SmartWatchesProps) {
  return <section className="watch-section" id="smart-watches"><div className="watch-heading"><div><p className="eyebrow">THE WRIST TECH EDIT</p><h2>Smart watches, smarter swaps.</h2><p>Track your time, training, and trade value in one place.</p></div><a className="text-link" href="/smart-watches">Explore all watches <span>→</span></a></div><div className="watch-grid">{watches.map((watch) => <article className={`watch-card ${selected.name === watch.name ? "chosen" : ""}`} key={watch.name} onClick={() => onSelect(watch)}><div className="watch-image" style={{ backgroundColor: watch.color, backgroundImage: `url(${watch.image})` }}><button className="save-button" onClick={(event) => { event.stopPropagation(); onToggleSaved(watch.name); }} aria-label={`Save ${watch.name}`}>{saved.includes(watch.name) ? "♥" : "♡"}</button><span className="watch-badge">{watch.condition}</span></div><div className="watch-copy"><div><p>{watch.category}</p><h3>{watch.name}</h3><span>{watch.seller} · {watch.location}</span></div><strong>${watch.price}<small>swap value</small></strong></div><button className="watch-swap" onClick={() => onSelect(watch)}>Swap for this <span>→</span></button></article>)}</div></section>;
}
