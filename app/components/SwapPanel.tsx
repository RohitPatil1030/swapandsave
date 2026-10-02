import type { Product } from "./marketplace-data";

type SwapPanelProps = {
  selected: Product;
  yourItem: string;
  yourValue: number;
  onYourItemChange: (value: string) => void;
  onYourValueChange: (value: number) => void;
  onFindMatch: () => void;
};

export default function SwapPanel({ selected, yourItem, yourValue, onYourItemChange, onYourValueChange, onFindMatch }: SwapPanelProps) {
  const priceDifference = selected.price - yourValue;
  const fairnessScore = Math.max(72, Math.round(100 - Math.abs(priceDifference) / Math.max(selected.price, 1) * 35));
  const balanceMessage = priceDifference === 0 ? "Even trade, no cash needed" : priceDifference > 0 ? `They add $${priceDifference} to balance it` : `You add $${Math.abs(priceDifference)} to balance it`;

  return <aside className="swap-panel"><div className="panel-top"><p className="eyebrow">SMART MATCH</p><span className="live-dot">Live</span></div><h2>Make it a swap</h2><p className="panel-copy">Select something you own and we&apos;ll find the fairest trade.</p><div className="trade-item"><div className="mini-image" style={{ backgroundImage: `url(${selected.image})` }} /><div><p>They have</p><strong>{selected.name}</strong><span>Estimated value · ${selected.price}</span></div><button aria-label="Change selected item">⌄</button></div><div className="swap-arrow">↕</div><div className="your-item-form"><label htmlFor="your-item">Your item</label><input id="your-item" value={yourItem} onChange={(event) => onYourItemChange(event.target.value)} placeholder="e.g. Kindle Paperwhite" /><label htmlFor="your-value">Estimated value <output>${yourValue}</output></label><input id="your-value" type="range" min="20" max="1000" step="5" value={yourValue} onChange={(event) => onYourValueChange(Number(event.target.value))} /></div><div className="fairness"><span>✦</span><div><strong>Fairness score</strong><small>{balanceMessage}</small></div><b>{fairnessScore}%</b></div><button className="button button-green full-width" onClick={onFindMatch}>Find my match <span>→</span></button></aside>;
}
