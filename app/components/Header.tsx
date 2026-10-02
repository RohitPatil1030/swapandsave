import Link from "next/link";

export default function Header() {
  return <header className="topbar"><a className="brand" href="#top" aria-label="SwapZone home"><span className="brand-mark"><span>↗</span><span>↙</span></span><span className="brand-name">SwapZone</span></a><nav className="nav-links"><a className="active" href="#discover">Discover</a><a href="#how-it-works">How it works</a><Link href="/dashboard">My swaps</Link></nav><div className="header-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><button className="avatar" aria-label="Open profile">AR</button></div></header>;
}
