"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { products, type Product } from "./marketplace-data";
import SwapScene from "./SwapScene";
import SwapAI from "./SwapAI";

type Page =
  | "home"
  | "payment"
  | "history"
  | "sell"
  | "twm"
  | "account"
  | "deals";
type ThemeName =
  | "midnight"
  | "sunset"
  | "forest"
  | "violet"
  | "ocean"
  | "mint"
  | "sky"
  | "peach"
  | "rose"
  | "cloud"
  | "cream"
  | "slate";
type Listing = Product & { owner: string };
type HistoryEntry = {
  id: number;
  type: string;
  description: string;
  amount: number;
  date: string;
};

const themeOptions: { id: ThemeName; label: string }[] = [
  { id: "midnight", label: "Midnight" },
  { id: "sunset", label: "Sunset" },
  { id: "forest", label: "Forest" },
  { id: "violet", label: "Violet" },
  { id: "ocean", label: "Ocean" },
  { id: "mint", label: "Mint" },
  { id: "sky", label: "Sky" },
  { id: "peach", label: "Peach" },
  { id: "rose", label: "Rose" },
  { id: "cloud", label: "Cloud" },
  { id: "cream", label: "Cream" },
  { id: "slate", label: "Slate" },
];

const defaultOther: Listing[] = [
  { ...products[3], owner: "Alice" },
  { ...products[0], name: "Gaming Headset", price: 210, owner: "Ben" },
  { ...products[4], name: "Gym Duffel", price: 130, owner: "Clara" },
];

const navItems: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "payment", label: "Payment" },
  { id: "history", label: "History" },
  { id: "sell", label: "List My Product" },
  { id: "twm", label: "Trade With Me" },
  { id: "account", label: "My Account" },
  { id: "deals", label: "Deals" },
];

const persistedDashboardState =
  typeof window === "undefined"
    ? null
    : (() => {
        try {
          return JSON.parse(
            localStorage.getItem("swap-save-dashboard") || "null",
          );
        } catch {
          return null;
        }
      })();

const persistedTheme: ThemeName =
  typeof window === "undefined"
    ? "midnight"
    : (() => {
        const storedTheme = localStorage.getItem("swapzone-theme");
        return themeOptions.some((option) => option.id === storedTheme)
          ? (storedTheme as ThemeName)
          : "midnight";
      })();

export default function Dashboard() {
  const [page, setPage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileThemeMenuOpen, setMobileThemeMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeName>(persistedTheme);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    persistedDashboardState?.user || null,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState<number>(
    persistedDashboardState?.balance ?? 5000,
  );
  const [query, setQuery] = useState("");
  const [myListings, setMyListings] = useState<Listing[]>(
    persistedDashboardState?.myListings || [],
  );
  const [otherListings] = useState<Listing[]>(
    persistedDashboardState?.otherListings || defaultOther,
  );
  const [history, setHistory] = useState<HistoryEntry[]>(
    persistedDashboardState?.history || [],
  );
  const [kycVerified] = useState(Boolean(persistedDashboardState?.kycVerified));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");
  const [shipping, setShipping] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    pincode: "",
    mobile: "",
    landmark: "",
  });
  const [couponUnlocked, setCouponUnlocked] = useState(
    Boolean(persistedDashboardState?.couponUnlocked),
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [newListing, setNewListing] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [payment, setPayment] = useState({
    item: "",
    amount: "",
    method: "UPI",
  });
  const [mineId, setMineId] = useState("");
  const [otherId, setOtherId] = useState(defaultOther[0].name);

  useEffect(() => {
    localStorage.setItem(
      "swap-save-dashboard",
      JSON.stringify({
        user,
        balance,
        myListings,
        otherListings,
        history,
        kycVerified,
        couponUnlocked,
      }),
    );
  }, [
    user,
    balance,
    myListings,
    otherListings,
    history,
    kycVerified,
    couponUnlocked,
  ]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("swapzone-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user?.name) {
      setShipping((current) => ({ ...current, name: user.name }));
    }
  }, [user?.name]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };
  const addHistory = (entry: Omit<HistoryEntry, "id" | "date">) =>
    setHistory((items) => [
      { ...entry, id: Date.now(), date: new Date().toLocaleString() },
      ...items,
    ]);
  const filteredProducts = useMemo(
    () =>
      products.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const login = (event: FormEvent) => {
    event.preventDefault();
    if (!email || password.length < 4)
      return showNotice("Enter an email and a 4+ character password");
    setUser({ name: email.split("@")[0], email });
    showNotice("Welcome to SwapZone");
  };
  const applyCoupon = () => {
    if (!couponUnlocked)
      return showNotice("Complete your first trade to unlock a coupon");
    if (couponCode.trim().toUpperCase() !== "SAVE10")
      return showNotice("Enter a valid coupon code");
    setCouponApplied(true);
    showNotice("Coupon applied: 10% off");
  };
  const makePayment = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(payment.amount);
    const finalAmount = couponApplied ? Math.round(amount * 0.9) : amount;
    if (!payment.item || amount < 1 || finalAmount > balance)
      return showNotice("Check the item and available balance");
    setBalance((value) => value - finalAmount);
    addHistory({
      type: "payment",
      description: `Paid for ${payment.item} via ${payment.method}${couponApplied ? " with SAVE10" : ""}`,
      amount: -finalAmount,
    });
    setPayment({ item: "", amount: "", method: "UPI" });
    setCouponCode("");
    setCouponApplied(false);
    showNotice("Payment completed");
  };
  const addListing = (event: FormEvent) => {
    event.preventDefault();
    const item = {
      ...products[0],
      name: newListing.name,
      price: Number(newListing.price),
      owner: user?.name || "Me",
    };
    if (!item.name || item.price < 1)
      return showNotice("Add a name and valid price");
    setMyListings((items) => [item, ...items]);
    addHistory({
      type: "listing",
      description: `Listed ${item.name}`,
      amount: 0,
    });
    setNewListing({ name: "", price: "", description: "" });
    showNotice("Listing published");
  };
  const completeTrade = (hasListing: boolean) => {
    if (!hasListing) return showNotice("Select your listing first");
    addHistory({
      type: "trade",
      description: "Trade proposal sent",
      amount: 0,
    });
    if (!couponUnlocked) {
      setCouponUnlocked(true);
      showNotice("First trade completed. Coupon SAVE10 unlocked");
    } else {
      showNotice("Trade proposal sent");
    }
  };
  const signOut = () => {
    setUser(null);
    showNotice("Signed out");
  };

  if (!user)
    return (
      <main className="dashboard-shell">
        <section className="login-screen">
          <div className="dashboard-logo">
            <span className="brand-mark" aria-hidden="true" />
            <b className="dashboard-wordmark">
              Swap <i>&amp;</i> Save
            </b>
          </div>
          <div className="login-card">
            <p className="eyebrow">THE MARKETPLACE THAT MOVES</p>
            <h1>
              Trade better.
              <br />
              <em>Waste less.</em>
            </h1>
            <p className="dashboard-muted">
              Swap, sell, and discover products from a community that keeps good
              things moving.
            </p>
            <form onSubmit={login}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="4+ characters"
                  required
                />
              </label>
              <button className="dashboard-button" type="submit">
                Sign in <span>-&gt;</span>
              </button>
            </form>
            <p className="login-hint">
              Demo mode: any email and password with 4+ characters works.
            </p>
          </div>
        </section>
      </main>
    );

  const renderPage = () => {
    if (page === "home")
      return (
        <>
          <div className="dashboard-hero">
            <div>
              <p className="eyebrow">YOUR MARKETPLACE</p>
              <h1>
                Good things deserve
                <br />
                <em>a second life.</em>
              </h1>
              <p>
                Discover products, swap listings, and pay securely with real
                money.
              </p>
            </div>
            <div className="dashboard-kpis">
              <div>
                <small>Balance</small>
                <b>INR {balance.toLocaleString("en-IN")}</b>
              </div>
              <div>
                <small>Transactions</small>
                <b>{history.length}</b>
              </div>
            </div>
          </div>
          <SwapScene theme={theme} />
          <div className="dashboard-toolbar">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
            />
            <span>{filteredProducts.length} products</span>
          </div>
          <div className="dashboard-grid">
            {filteredProducts.map((item) => (
              <article
                className="dashboard-product"
                key={item.name}
                onClick={() => setSelectedProduct(item)}
                style={{ cursor: "pointer" }}
              >
                <img src={item.image} alt={item.name} />
                <div>
                  <small>{item.category}</small>
                  <h3>{item.name}</h3>
                  <b>INR {item.price.toLocaleString("en-IN")}</b>
                  <button
                    className="dashboard-button small"
                    onClick={(event) => {
                      event.stopPropagation();
                      setPayment({
                        item: item.name,
                        amount: String(item.price),
                        method: "UPI",
                      });
                      setPage("payment");
                    }}
                  >
                    Buy
                  </button>
                </div>
              </article>
            ))}
          </div>
          {selectedProduct && (
            <div
              className="product-detail-overlay"
              onClick={() => setSelectedProduct(null)}
            >
              <div
                className="product-detail-modal"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="product-detail-close"
                  aria-label="Close product details"
                  onClick={() => setSelectedProduct(null)}
                >
                  Ã—
                </button>
                <div className="product-detail-image-wrap">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="product-detail-content">
                  <p className="eyebrow">{selectedProduct.category}</p>
                  <h3>{selectedProduct.name}</h3>
                  <p className="product-detail-meta">
                    {selectedProduct.condition} Â· {selectedProduct.seller} Â·{" "}
                    {selectedProduct.location}
                  </p>
                  <p className="product-detail-price">
                    INR {selectedProduct.price.toLocaleString("en-IN")}
                  </p>
                  <p className="dashboard-muted">
                    This product is ready for a quick checkout or an easy swap.
                    Browse the details, compare the value, and move forward when
                    you&apos;re ready.
                  </p>
                  <div className="product-detail-actions">
                    <button
                      className="dashboard-button"
                      onClick={() => {
                        setPayment({
                          item: selectedProduct.name,
                          amount: String(selectedProduct.price),
                          method: "UPI",
                        });
                        setSelectedProduct(null);
                        setPage("payment");
                      }}
                    >
                      Buy now <span>-&gt;</span>
                    </button>
                    <button
                      className="dashboard-button secondary"
                      onClick={() => setSelectedProduct(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    if (page === "payment")
      return (
        <PageFrame
          title="Payment"
          subtitle="Complete a secure checkout. KYC is required."
        >
          <form
            className="dashboard-card dashboard-form"
            onSubmit={makePayment}
          >
            <label>
              Full name
              <input
                value={shipping.name}
                onChange={(event) =>
                  setShipping({ ...shipping, name: event.target.value })
                }
                placeholder="Customer name"
                required
              />
            </label>
            <label>
              Address
              <textarea
                value={shipping.address}
                onChange={(event) =>
                  setShipping({ ...shipping, address: event.target.value })
                }
                placeholder="Street address"
                required
              />
            </label>
            <div className="two-dashboard-col">
              <label>
                City
                <input
                  value={shipping.city}
                  onChange={(event) =>
                    setShipping({ ...shipping, city: event.target.value })
                  }
                  placeholder="City"
                  required
                />
              </label>
              <label>
                Pincode
                <input
                  value={shipping.pincode}
                  onChange={(event) =>
                    setShipping({ ...shipping, pincode: event.target.value })
                  }
                  placeholder="Postal code"
                  required
                />
              </label>
            </div>
            <div className="two-dashboard-col">
              <label>
                Mobile number
                <input
                  value={shipping.mobile}
                  onChange={(event) =>
                    setShipping({ ...shipping, mobile: event.target.value })
                  }
                  placeholder="10-digit mobile"
                  required
                />
              </label>
              <label>
                Landmark
                <input
                  value={shipping.landmark}
                  onChange={(event) =>
                    setShipping({ ...shipping, landmark: event.target.value })
                  }
                  placeholder="Optional landmark"
                />
              </label>
            </div>
            <label>
              Item name
              <input
                value={payment.item}
                onChange={(event) =>
                  setPayment({ ...payment, item: event.target.value })
                }
                placeholder="Premium Headphones"
                required
              />
            </label>
            <label>
              Amount (INR{" "}
              <input
                type="number"
                min="1"
                value={payment.amount}
                onChange={(event) =>
                  setPayment({ ...payment, amount: event.target.value })
                }
                required
              />
            </label>
            {couponUnlocked && (
              <div className="coupon-checkout">
                <label>
                  Coupon code
                  <input
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value);
                      setCouponApplied(false);
                    }}
                    placeholder="SAVE10"
                  />
                </label>
                <button
                  className="dashboard-button secondary"
                  type="button"
                  onClick={applyCoupon}
                >
                  Apply coupon
                </button>
                {couponApplied && <small>10% discount applied</small>}
              </div>
            )}
            <label>
              Payment method
              <select
                value={payment.method}
                onChange={(event) =>
                  setPayment({ ...payment, method: event.target.value })
                }
              >
                <option>UPI</option>
                <option>Card</option>
                <option>Net Banking</option>
              </select>
            </label>
            <button className="dashboard-button" type="submit">
              Pay securely <span>-&gt;</span>
            </button>
          </form>
        </PageFrame>
      );
    if (page === "history")
      return (
        <PageFrame
          title="History"
          subtitle="Your recent payments and activity logs."
        >
          <div className="dashboard-card">
            {history.length === 0 ? (
              <p className="dashboard-muted">No activity yet.</p>
            ) : (
              history.map((entry) => (
                <div className="history-row" key={entry.id}>
                  <div>
                    <b>{entry.type}</b>
                    <p>{entry.description}</p>
                  </div>
                  <span className={entry.amount < 0 ? "negative" : "positive"}>
                    {entry.amount
                      ? `INR ${Math.abs(entry.amount).toLocaleString("en-IN")}`
                      : "Done"}
                    <small>{entry.date}</small>
                  </span>
                </div>
              ))
            )}
          </div>
        </PageFrame>
      );
    if (page === "sell")
      return (
        <PageFrame
          title="List My Product"
          subtitle="List your item and find a fair swap."
        >
          <div className="two-dashboard-col">
            <form
              className="dashboard-card dashboard-form"
              onSubmit={addListing}
            >
              <label>
                Product name
                <input
                  value={newListing.name}
                  onChange={(event) =>
                    setNewListing({ ...newListing, name: event.target.value })
                  }
                  placeholder="Running Shoes"
                  required
                />
              </label>
              <label>
                Price (INR{" "}
                <input
                  type="number"
                  value={newListing.price}
                  onChange={(event) =>
                    setNewListing({ ...newListing, price: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={newListing.description}
                  onChange={(event) =>
                    setNewListing({
                      ...newListing,
                      description: event.target.value,
                    })
                  }
                  placeholder="Condition, brand, color..."
                />
              </label>
              <button className="dashboard-button" type="submit">
                List product <span>-&gt;</span>
              </button>
            </form>
            <div className="dashboard-card">
              <h3>My Listings</h3>
              {myListings.length === 0 ? (
                <p className="dashboard-muted">
                  Your listings will appear here.
                </p>
              ) : (
                myListings.map((item) => (
                  <div className="compact-listing" key={item.name}>
                    <span>{item.name}</span>
                    <b>INR {item.price}</b>
                  </div>
                ))
              )}
            </div>
          </div>
        </PageFrame>
      );
    if (page === "twm") {
      const mine = myListings.find((item) => item.name === mineId);
      const other =
        otherListings.find((item) => item.name === otherId) || otherListings[0];
      const difference = (other?.price || 0) - (mine?.price || 0);
      return (
        <PageFrame
          title="Trade With Me"
          subtitle="Propose a fair trade between two listings."
        >
          <div className="dashboard-card dashboard-form">
            <label>
              Your listing
              <select
                value={mineId}
                onChange={(event) => setMineId(event.target.value)}
              >
                <option value="">Select your listing</option>
                {myListings.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
            <label>
              Other listing
              <select
                value={otherId}
                onChange={(event) => setOtherId(event.target.value)}
              >
                {otherListings.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
            <div className="trade-board">
              <div>
                <small>Your side</small>
                <b>{mine?.name || "-"}</b>
                <span>INR {mine?.price || 0}</span>
              </div>
              <strong>-&gt;</strong>
              <div>
                <small>Other side</small>
                <b>{other?.name || "-"}</b>
                <span>INR {other?.price || 0}</span>
              </div>
            </div>
            <p className={`fair-status ${difference === 0 ? "good" : "ok"}`}>
              {mine
                ? difference === 0
                  ? "Fair trade"
                  : difference > 0
                    ? `You receive INR ${difference.toLocaleString("en-IN")}`
                    : `You pay INR ${Math.abs(difference).toLocaleString("en-IN")}`
                : "Select both listings to analyze"}
            </p>
            <button
              className="dashboard-button"
              onClick={() => completeTrade(Boolean(mine))}
            >
              Propose trade <span>-&gt;</span>
            </button>
          </div>
        </PageFrame>
      );
    }
    if (page === "account")
      return (
        <PageFrame
          title="My Account"
          subtitle="Manage your profile and payment balance."
        >
          <div className="dashboard-card account-card">
            <div className="account-avatar">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <button className="dashboard-button secondary" onClick={signOut}>
              Logout
            </button>
          </div>
        </PageFrame>
      );
    return (
      <PageFrame
        title="Deals & Coupons"
        subtitle="Rewards for keeping the marketplace moving."
      >
        {couponUnlocked ? (
          <div className="dashboard-card coupon-card">
            <span>TRADE REWARD</span>
            <h2>SAVE10</h2>
            <p>10% off your next purchase after completing a trade.</p>
            <button
              className="dashboard-button"
              onClick={() => {
                setCouponCode("SAVE10");
                setPage("payment");
              }}
            >
              Use coupon at payment <span>-&gt;</span>
            </button>
          </div>
        ) : (
          <div className="dashboard-card">
            <h3>Complete your first trade</h3>
            <p>Trade once to unlock the SAVE10 coupon.</p>
          </div>
        )}
      </PageFrame>
    );
  };

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <button
          className="dashboard-logo"
          onClick={() => {
            setPage("home");
            setMobileMenuOpen(false);
            setMobileThemeMenuOpen(false);
          }}
        >
          <span className="brand-mark" aria-hidden="true" />
          <b className="dashboard-wordmark">SwapZone</b>
        </button>
        <div className="dashboard-theme-picker">
          <select
            className="dashboard-theme-select"
            value={theme}
            onChange={(event) => setTheme(event.target.value as ThemeName)}
            aria-label="Select dashboard theme"
          >
            {themeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="dashboard-mobile-theme-menu">
            <button
              className="dashboard-mobile-theme-toggle"
              type="button"
              aria-label={`Theme: ${themeOptions.find((option) => option.id === theme)?.label ?? "Midnight"}`}
              aria-haspopup="menu"
              aria-expanded={mobileThemeMenuOpen}
              aria-controls="dashboard-theme-options"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileThemeMenuOpen((open) => !open);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setMobileThemeMenuOpen(false);
              }}
            >
              {themeOptions.find((option) => option.id === theme)?.label ?? "Midnight"}
              <span aria-hidden="true">⌄</span>
            </button>
            <div
              id="dashboard-theme-options"
              className="dashboard-mobile-theme-options"
              role="menu"
              aria-label="Dashboard themes"
              hidden={!mobileThemeMenuOpen}
            >
              {themeOptions.map((option) => (
                <button
                  className={theme === option.id ? "active" : ""}
                  key={option.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === option.id}
                  onClick={() => {
                    setTheme(option.id);
                    setMobileThemeMenuOpen(false);
                  }}
                >
                  {option.label}
                  {theme === option.id && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          className="dashboard-mobile-menu-toggle"
          type="button"
          aria-controls="dashboard-header-menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => {
            setMobileThemeMenuOpen(false);
            setMobileMenuOpen((open) => !open);
          }}
        >
          Menu <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
        </button>
        <div
          id="dashboard-header-menu"
          className={`dashboard-header-actions ${mobileMenuOpen ? "is-open" : ""}`}
        >
          <nav id="dashboard-navigation" aria-label="Dashboard navigation">
            {navItems.map((item) => (
              <button
                className={page === item.id ? "active" : ""}
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setMobileMenuOpen(false);
                  setMobileThemeMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="dashboard-user">
            <span>{user.name}</span>
            <button
              className="user-dot"
              onClick={() => {
                setPage("account");
                setMobileMenuOpen(false);
                setMobileThemeMenuOpen(false);
              }}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </button>
          </div>
        </div>
      </header>
      <section className="dashboard-content" data-page={page}>
        {renderPage()}
      </section>
      <SwapAI onNavigate={setPage} />
      {notice && <div className="dashboard-toast">{notice}</div>}
    </main>
  );
}

function PageFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SWAPZONE</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </>
  );
}
