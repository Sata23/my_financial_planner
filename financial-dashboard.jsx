import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from "recharts";

// ── HARDCODED DATA FROM DOCUMENTS ─────────────────────────────────────────
const HOLDINGS_RAW = [
  { name: "State Bank of India", ticker: "SBIN", qty: 16, buyPrice: 910.43, sector: "Banking", type: "Equity" },
  { name: "Adani Power Ltd", ticker: "ADANIPOWER", qty: 20, buyPrice: 144.82, sector: "Energy", type: "Equity" },
  { name: "Eicher Motors Ltd", ticker: "EICHERMOT", qty: 2, buyPrice: 6598, sector: "Auto", type: "Equity" },
  { name: "HDFC Bank Ltd", ticker: "HDFCBANK", qty: 12, buyPrice: 959.57, sector: "Banking", type: "Equity" },
  { name: "ICICI Pru Nifty ETF", ticker: "ICICIB22", qty: 25, buyPrice: 280.77, sector: "Index ETF", type: "ETF" },
  { name: "MO Midcap 100 ETF", ticker: "MOM100", qty: 190, buyPrice: 62.5, sector: "Index ETF", type: "ETF" },
  { name: "TVS Motor Company", ticker: "TVSMOTOR", qty: 2, buyPrice: 3513.3, sector: "Auto", type: "Equity" },
  { name: "Kotak PSU Bank ETF", ticker: "KOTAKPSUBK", qty: 5, buyPrice: 767.54, sector: "Index ETF", type: "ETF" },
  { name: "Tata Steel Ltd", ticker: "TATASTEEL", qty: 5, buyPrice: 175.03, sector: "Metals", type: "Equity" },
  { name: "Bank of India", ticker: "BANKINDIA", qty: 10, buyPrice: 127.07, sector: "Banking", type: "Equity" },
  { name: "Bank of Baroda", ticker: "BANKBARODA", qty: 20, buyPrice: 267.45, sector: "Banking", type: "Equity" },
  { name: "Eternal Ltd", ticker: "ETERNAL", qty: 20, buyPrice: 334.91, sector: "Consumer", type: "Equity" },
  { name: "Shriram Finance", ticker: "SHRIRAMFIN", qty: 2, buyPrice: 819.3, sector: "Finance", type: "Equity" },
  { name: "Ashok Leyland", ticker: "ASHOKLEY", qty: 15, buyPrice: 135.65, sector: "Auto", type: "Equity" },
  { name: "Bajaj Finance", ticker: "BAJFINANCE", qty: 11, buyPrice: 999.33, sector: "Finance", type: "Equity" },
  { name: "L&T Finance", ticker: "LTF", qty: 5, buyPrice: 295.75, sector: "Finance", type: "Equity" },
  { name: "Cummins India", ticker: "CUMMINSIND", qty: 1, buyPrice: 4020.4, sector: "Industrial", type: "Equity" },
  { name: "Muthoot Finance", ticker: "MUTHOOTFIN", qty: 1, buyPrice: 3722, sector: "Finance", type: "Equity" },
  { name: "SBI Life Insurance", ticker: "SBILIFE", qty: 2, buyPrice: 2004.6, sector: "Insurance", type: "Equity" },
  { name: "Bharat Electronics", ticker: "BEL", qty: 3, buyPrice: 400.7, sector: "Defence", type: "Equity" },
  { name: "Indian Oil Corp", ticker: "IOC", qty: 10, buyPrice: 162.95, sector: "Energy", type: "Equity" },
  { name: "Aditya Birla Capital", ticker: "ABCAPITAL", qty: 5, buyPrice: 289.65, sector: "Finance", type: "Equity" },
  { name: "Bajaj Auto", ticker: "BAJAJ-AUTO", qty: 1, buyPrice: 9244, sector: "Auto", type: "Equity" },
  { name: "RBL Bank", ticker: "RBLBANK", qty: 10, buyPrice: 319.5, sector: "Banking", type: "Equity" },
  { name: "Vodafone Idea", ticker: "IDEA", qty: 75, buyPrice: 9.78, sector: "Telecom", type: "Equity" },
  { name: "HDFC Gold ETF", ticker: "HDFCGOLDETF", qty: 64, buyPrice: 100.38, sector: "Gold", type: "Gold ETF" },
  { name: "SBI Gold ETF", ticker: "SBIGETS", qty: 35, buyPrice: 99.38, sector: "Gold", type: "Gold ETF" },
  { name: "Nippon Gold Bees", ticker: "GOLDBEES", qty: 94, buyPrice: 99.35, sector: "Gold", type: "Gold ETF" },
  { name: "Nippon Silver ETF", ticker: "SILVERBEES", qty: 59, buyPrice: 135.62, sector: "Silver", type: "Silver ETF" },
  { name: "TBO Tek", ticker: "TBOTEK", qty: 5, buyPrice: 1682, sector: "Technology", type: "Equity" },
  { name: "Tata Capital", ticker: "TATACAPITAL", qty: 46, buyPrice: 326, sector: "Debt", type: "Debt" },
  { name: "Indian Bank", ticker: "INDIANB", qty: 15, buyPrice: 814.8, sector: "Banking", type: "Equity" },
  { name: "Kotak Mahindra Bank", ticker: "KOTAKBANK", qty: 10, buyPrice: 423.56, sector: "Banking", type: "Equity" },
];

const LOAN = {
  outstanding_aug26: 2538536,
  outstanding_mar25: 2795173,
  emi: 32829,
  fy25_interest: 269273,
  fy25_principal: 422610,
  fy26_interest_prov: 233405,
  fy26_principal_prov: 357887,
  rate: 9.5, // approximate from EMI pattern
  account: "0212675100001571",
  bank: "IDBI Bank",
  borrower: "Ankhi Sarker",
};

const INSURANCE = {
  insurer: "ICICI Lombard",
  product: "Criti Shield Plus",
  cover: 1000000,
  buckets: 5,
  premium_total: 11108,
  premium_base: 9413.78,
  premium_gst: 1694.48,
  period: "08 Jul 2025 – 07 Jul 2026",
};

const TAX = {
  fy25: { sec24b: 269273, sec80c_loan: 422610, sec80d: 9414 },
  fy26: { sec24b: 233405, sec80c_loan: 357887, sec80d: 9414 },
};

const COLORS = {
  bg: "#080c1a",
  card: "#0d1329",
  border: "#1a2340",
  gold: "#f0a500",
  teal: "#00d4aa",
  coral: "#ff6b6b",
  blue: "#4a9eff",
  purple: "#9b59b6",
  text: "#e8edf5",
  muted: "#6b7a99",
  gain: "#00d4aa",
  loss: "#ff6b6b",
};

const SECTOR_COLORS = ["#f0a500","#00d4aa","#4a9eff","#ff6b6b","#9b59b6","#2ecc71","#e67e22","#1abc9c","#e74c3c","#3498db","#f39c12"];

const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
const fmtC = (n) => "₹" + fmt(n);
const fmtP = (n) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

// ── YAHOO FINANCE PRICE FETCH ─────────────────────────────────────────────
async function fetchPrice(ticker) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.NS?interval=1d&range=1d`;
    const r = await fetch(url);
    const d = await r.json();
    const price = d?.chart?.result?.[0]?.meta?.regularMarketPrice;
    return price || null;
  } catch { return null; }
}

// ── LOAN AMORTIZATION ─────────────────────────────────────────────────────
function buildAmortization(outstanding, rate, emi, months = 60) {
  let bal = outstanding;
  const rows = [];
  const monthlyRate = rate / 100 / 12;
  for (let i = 1; i <= months && bal > 0; i++) {
    const interest = Math.round(bal * monthlyRate);
    const principal = Math.min(Math.round(emi - interest), bal);
    bal = Math.max(0, bal - principal);
    rows.push({ month: i, interest, principal, balance: bal });
  }
  return rows;
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function FinancialDashboard() {
  const [tab, setTab] = useState("networth");
  const [holdings, setHoldings] = useState(HOLDINGS_RAW.map(h => ({ ...h, currentPrice: h.buyPrice, loading: true })));
  const [fetching, setFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fy, setFy] = useState("fy26");
  const [prepayment, setPrepayment] = useState(0);
  const [loanRate, setLoanRate] = useState(LOAN.rate);

  const totalInvested = HOLDINGS_RAW.reduce((s, h) => s + h.buyPrice * h.qty, 0);
  const totalCurrent = holdings.reduce((s, h) => s + (h.currentPrice || h.buyPrice) * h.qty, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = (totalPnL / totalInvested) * 100;
  const netWorth = totalCurrent - LOAN.outstanding_aug26;

  const refreshPrices = useCallback(async () => {
    setFetching(true);
    const updated = await Promise.all(
      HOLDINGS_RAW.map(async (h) => {
        const price = await fetchPrice(h.ticker);
        return { ...h, currentPrice: price || h.buyPrice, loading: false, live: !!price };
      })
    );
    setHoldings(updated);
    setLastUpdated(new Date());
    setFetching(false);
  }, []);

  useEffect(() => { refreshPrices(); }, []);

  // Sector allocation
  const sectorMap = {};
  holdings.forEach(h => {
    const val = (h.currentPrice || h.buyPrice) * h.qty;
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + val;
  });
  const sectorData = Object.entries(sectorMap).sort((a,b) => b[1]-a[1]).map(([name, value]) => ({ name, value: Math.round(value) }));

  // Asset class
  const assetMap = {};
  holdings.forEach(h => {
    const val = (h.currentPrice || h.buyPrice) * h.qty;
    assetMap[h.type] = (assetMap[h.type] || 0) + val;
  });
  const assetData = Object.entries(assetMap).map(([name, value]) => ({ name, value: Math.round(value) }));

  // Sorted holdings for table
  const holdingsSorted = [...holdings].map(h => ({
    ...h,
    currentValue: (h.currentPrice || h.buyPrice) * h.qty,
    buyValue: h.buyPrice * h.qty,
    pnl: ((h.currentPrice || h.buyPrice) - h.buyPrice) * h.qty,
    pnlPct: ((h.currentPrice || h.buyPrice) - h.buyPrice) / h.buyPrice * 100,
  })).sort((a,b) => b.buyValue - a.buyValue);

  // Amortization
  const amortRows = buildAmortization(
    LOAN.outstanding_aug26,
    loanRate,
    LOAN.emi + prepayment / 12,
    72
  );
  const payoffMonth = amortRows.length;
  const payoffDate = new Date(2026, 7 + payoffMonth);

  // Growth projections
  const growthData = [0,1,2,3,4,5,7,10,15].map(yr => ({
    year: `Y${yr}`,
    "12% CAGR": Math.round(totalCurrent * Math.pow(1.12, yr)),
    "15% CAGR": Math.round(totalCurrent * Math.pow(1.15, yr)),
    "18% CAGR": Math.round(totalCurrent * Math.pow(1.18, yr)),
  }));

  const taxData = TAX[fy];
  const taxSaving30 = Math.round((taxData.sec24b + taxData.sec80c_loan + taxData.sec80d) * 0.3);

  const styles = {
    app: { background: COLORS.bg, minHeight: "100vh", fontFamily: "'DM Mono', 'Courier New', monospace", color: COLORS.text, padding: "0" },
    header: { background: `linear-gradient(135deg, #0d1329 0%, #111827 100%)`, borderBottom: `1px solid ${COLORS.border}`, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", flexDirection: "column" },
    logoTitle: { fontSize: "20px", fontWeight: "700", color: COLORS.gold, letterSpacing: "3px", textTransform: "uppercase" },
    logoSub: { fontSize: "11px", color: COLORS.muted, letterSpacing: "2px" },
    headerRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" },
    refreshBtn: { background: fetching ? COLORS.border : COLORS.gold, color: COLORS.bg, border: "none", padding: "8px 18px", borderRadius: "4px", cursor: fetching ? "not-allowed" : "pointer", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "inherit" },
    lastUpdated: { fontSize: "10px", color: COLORS.muted },
    tabs: { display: "flex", gap: "2px", padding: "16px 28px 0", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.card },
    tab: (active) => ({ padding: "10px 20px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: active ? "700" : "400", color: active ? COLORS.gold : COLORS.muted, borderBottom: active ? `2px solid ${COLORS.gold}` : "2px solid transparent", background: "none", border: "none", fontFamily: "inherit", transition: "color 0.2s" }),
    content: { padding: "28px" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
    grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" },
    grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
    card: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "20px" },
    statCard: (accent) => ({ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${accent}`, borderRadius: "8px", padding: "16px 20px" }),
    statLabel: { fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.muted, marginBottom: "6px" },
    statValue: (color) => ({ fontSize: "22px", fontWeight: "700", color: color || COLORS.text, letterSpacing: "1px" }),
    statSub: { fontSize: "11px", color: COLORS.muted, marginTop: "4px" },
    sectionTitle: { fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.gold, marginBottom: "16px", fontWeight: "700" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "12px" },
    th: { padding: "8px 12px", textAlign: "left", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}` },
    thR: { padding: "8px 12px", textAlign: "right", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.muted, borderBottom: `1px solid ${COLORS.border}` },
    td: { padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}20`, fontSize: "12px" },
    tdR: { padding: "10px 12px", textAlign: "right", borderBottom: `1px solid ${COLORS.border}20`, fontSize: "12px" },
    badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: "3px", fontSize: "10px", fontWeight: "700", background: color + "22", color: color, letterSpacing: "1px" }),
    pill: { display: "inline-block", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", background: COLORS.border, color: COLORS.muted },
    slider: { width: "100%", accentColor: COLORS.gold, cursor: "pointer" },
    input: { background: COLORS.border, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "6px 12px", borderRadius: "4px", fontSize: "13px", fontFamily: "inherit", width: "80px" },
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "10px 14px", borderRadius: "6px", fontSize: "12px" }}>
        <div style={{ color: COLORS.muted, marginBottom: "6px" }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, marginBottom: "2px" }}>{p.name}: {fmtC(p.value)}</div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoTitle}>⬡ WealthOS</div>
          <div style={styles.logoSub}>Santanu Sarker · PAN: AZCPS7886D · IndMoney: WY55249RNY</div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.refreshBtn} onClick={refreshPrices} disabled={fetching}>
            {fetching ? "⟳ Fetching..." : "↻ Refresh Prices"}
          </button>
          {lastUpdated && <div style={styles.lastUpdated}>Updated {lastUpdated.toLocaleTimeString("en-IN")}</div>}
          {!lastUpdated && <div style={styles.lastUpdated}>Using buy prices · click Refresh for live data</div>}
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {[["networth","Net Worth"],["portfolio","Portfolio"],["loan","Home Loan"],["tax","Tax Planning"],["goals","Goals"]].map(([k,v]) => (
          <button key={k} style={styles.tab(tab===k)} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>

      <div style={styles.content}>

        {/* ── TAB: NET WORTH ─────────────────────────────────────────── */}
        {tab === "networth" && (
          <div>
            <div style={styles.grid4}>
              <div style={styles.statCard(COLORS.gold)}>
                <div style={styles.statLabel}>Net Worth</div>
                <div style={styles.statValue(COLORS.gold)}>{fmtC(netWorth)}</div>
                <div style={styles.statSub}>Portfolio − Loan</div>
              </div>
              <div style={styles.statCard(COLORS.teal)}>
                <div style={styles.statLabel}>Portfolio Value</div>
                <div style={styles.statValue(COLORS.teal)}>{fmtC(totalCurrent)}</div>
                <div style={styles.statSub} style={{ color: totalPnLPct >= 0 ? COLORS.gain : COLORS.loss }}>
                  {fmtC(totalPnL)} ({fmtP(totalPnLPct)}) P&L
                </div>
              </div>
              <div style={styles.statCard(COLORS.coral)}>
                <div style={styles.statLabel}>Loan Outstanding</div>
                <div style={styles.statValue(COLORS.coral)}>{fmtC(LOAN.outstanding_aug26)}</div>
                <div style={styles.statSub}>IDBI · {LOAN.borrower}</div>
              </div>
              <div style={styles.statCard(COLORS.blue)}>
                <div style={styles.statLabel}>Monthly EMI</div>
                <div style={styles.statValue(COLORS.blue)}>{fmtC(LOAN.emi)}</div>
                <div style={styles.statSub}>≈{Math.round(LOAN.emi/totalCurrent*100*12)}% of portfolio/yr</div>
              </div>
            </div>

            <div style={styles.grid2}>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Asset Class Breakdown</div>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={assetData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {assetData.map((_,i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmtC(v)} contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                  {assetData.map((d,i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: SECTOR_COLORS[i] }} />
                      <span style={{ color: COLORS.muted }}>{d.name}</span>
                      <span style={{ color: COLORS.text, fontWeight: 600 }}>{fmtC(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.sectionTitle}>Balance Sheet Snapshot</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "Equity & ETFs", val: holdings.filter(h=>h.type==="Equity"||h.type==="ETF").reduce((s,h)=>s+h.currentPrice*h.qty,0), color: COLORS.teal },
                    { label: "Gold ETFs", val: holdings.filter(h=>h.type==="Gold ETF").reduce((s,h)=>s+h.currentPrice*h.qty,0), color: COLORS.gold },
                    { label: "Silver ETF", val: holdings.filter(h=>h.type==="Silver ETF").reduce((s,h)=>s+h.currentPrice*h.qty,0), color: "#aaa" },
                    { label: "Debt (Tata Capital)", val: holdings.filter(h=>h.type==="Debt").reduce((s,h)=>s+h.currentPrice*h.qty,0), color: COLORS.blue },
                  ].map((item,i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", color: COLORS.muted }}>{item.label}</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: item.color }}>{fmtC(item.val)}</span>
                      </div>
                      <div style={{ height: "4px", background: COLORS.border, borderRadius: "2px" }}>
                        <div style={{ height: "100%", width: `${(item.val/totalCurrent*100).toFixed(1)}%`, background: item.color, borderRadius: "2px" }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "12px", marginTop: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: COLORS.coral }}>Home Loan Liability</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: COLORS.coral }}>−{fmtC(LOAN.outstanding_aug26)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: `1px dashed ${COLORS.border}` }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text }}>NET WORTH</span>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: COLORS.gold }}>{fmtC(netWorth)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.card, marginTop: "20px" }}>
              <div style={styles.sectionTitle}>Insurance Coverage</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" }}>
                {["Cancer & Blood","Heart & Vessels","Major Organs","Nervous System","Other Illness"].map((b,i) => (
                  <div key={i} style={{ background: COLORS.border, borderRadius: "6px", padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "6px", letterSpacing: "1px" }}>{b}</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.gold }}>₹10L</div>
                    <div style={{ fontSize: "9px", color: COLORS.teal, marginTop: "4px" }}>● ACTIVE</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", color: COLORS.muted }}>
                <span>ICICI Lombard Criti Shield Plus · Policy 4191/399655686/00/000</span>
                <span>Premium ₹11,108/yr · Expires 07 Jul 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PORTFOLIO ─────────────────────────────────────────── */}
        {tab === "portfolio" && (
          <div>
            <div style={styles.grid4}>
              <div style={styles.statCard(COLORS.teal)}>
                <div style={styles.statLabel}>Invested</div>
                <div style={styles.statValue()}>{fmtC(totalInvested)}</div>
              </div>
              <div style={styles.statCard(COLORS.blue)}>
                <div style={styles.statLabel}>Current Value</div>
                <div style={styles.statValue(COLORS.blue)}>{fmtC(totalCurrent)}</div>
                <div style={{ fontSize: "9px", color: lastUpdated ? COLORS.teal : COLORS.muted }}>
                  {lastUpdated ? "● Live prices" : "○ Buy prices (click Refresh)"}
                </div>
              </div>
              <div style={styles.statCard(totalPnL >= 0 ? COLORS.teal : COLORS.coral)}>
                <div style={styles.statLabel}>Total P&L</div>
                <div style={styles.statValue(totalPnL >= 0 ? COLORS.teal : COLORS.coral)}>{fmtC(Math.abs(totalPnL))}</div>
                <div style={styles.statSub}>{fmtP(totalPnLPct)}</div>
              </div>
              <div style={styles.statCard(COLORS.purple)}>
                <div style={styles.statLabel}>Holdings</div>
                <div style={styles.statValue(COLORS.purple)}>33</div>
                <div style={styles.statSub}>stocks & ETFs</div>
              </div>
            </div>

            <div style={{ ...styles.grid2, marginBottom: "20px" }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Sector Allocation</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={sectorData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                      {sectorData.map((_,i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmtC(v)} contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {sectorData.slice(0,8).map((d,i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: SECTOR_COLORS[i] }} />
                      <span style={{ color: COLORS.muted }}>{d.name} {(d.value/totalCurrent*100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Top 10 Holdings by Value</div>
                {holdingsSorted.slice(0,10).map((h,i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600 }}>{h.name}</div>
                      <div style={{ fontSize: "10px", color: COLORS.muted }}>{h.qty} × {fmtC(h.currentPrice)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700 }}>{fmtC(h.currentValue)}</div>
                      <div style={{ fontSize: "10px", color: h.pnlPct >= 0 ? COLORS.gain : COLORS.loss }}>{fmtP(h.pnlPct)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>All Holdings</div>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Stock</th>
                      <th style={styles.th}>Sector</th>
                      <th style={styles.thR}>Qty</th>
                      <th style={styles.thR}>Buy ₹</th>
                      <th style={styles.thR}>Current ₹</th>
                      <th style={styles.thR}>Invested</th>
                      <th style={styles.thR}>Value</th>
                      <th style={styles.thR}>P&L</th>
                      <th style={styles.thR}>P&L %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdingsSorted.map((h, i) => (
                      <tr key={i} style={{ opacity: h.loading ? 0.6 : 1 }}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: 600 }}>{h.name}</div>
                          <div style={{ fontSize: "10px", color: COLORS.muted }}>{h.type}</div>
                        </td>
                        <td style={styles.td}><span style={styles.pill}>{h.sector}</span></td>
                        <td style={styles.tdR}>{h.qty}</td>
                        <td style={styles.tdR}>{fmt(h.buyPrice)}</td>
                        <td style={styles.tdR}>
                          <span style={{ color: h.live ? COLORS.teal : COLORS.muted }}>{fmt(h.currentPrice)}</span>
                        </td>
                        <td style={styles.tdR}>{fmtC(h.buyValue)}</td>
                        <td style={styles.tdR}>{fmtC(h.currentValue)}</td>
                        <td style={{ ...styles.tdR, color: h.pnl >= 0 ? COLORS.gain : COLORS.loss }}>{fmtC(Math.abs(h.pnl))}</td>
                        <td style={{ ...styles.tdR, color: h.pnlPct >= 0 ? COLORS.gain : COLORS.loss, fontWeight: 700 }}>{fmtP(h.pnlPct)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: HOME LOAN ─────────────────────────────────────────── */}
        {tab === "loan" && (
          <div>
            <div style={styles.grid4}>
              <div style={styles.statCard(COLORS.coral)}>
                <div style={styles.statLabel}>Outstanding (Aug '26)</div>
                <div style={styles.statValue(COLORS.coral)}>{fmtC(LOAN.outstanding_aug26)}</div>
                <div style={styles.statSub}>A/C {LOAN.account}</div>
              </div>
              <div style={styles.statCard(COLORS.blue)}>
                <div style={styles.statLabel}>Monthly EMI</div>
                <div style={styles.statValue(COLORS.blue)}>{fmtC(LOAN.emi)}</div>
                <div style={styles.statSub}>ECS auto-debit</div>
              </div>
              <div style={styles.statCard(COLORS.gold)}>
                <div style={styles.statLabel}>Est. Payoff</div>
                <div style={styles.statValue(COLORS.gold)} style={{ fontSize: 18 }}>{payoffDate.toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</div>
                <div style={styles.statSub}>{payoffMonth} months remaining</div>
              </div>
              <div style={styles.statCard(COLORS.teal)}>
                <div style={styles.statLabel}>Total Prepaid</div>
                <div style={styles.statValue(COLORS.teal)}>{fmtC(500000)}</div>
                <div style={styles.statSub}>₹3L Jul'24 + ₹2L Aug'25</div>
              </div>
            </div>

            <div style={{ ...styles.grid2, marginBottom: "20px" }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Prepayment Simulator</div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: COLORS.muted, marginBottom: "8px" }}>Additional Annual Prepayment</div>
                  <input type="range" min={0} max={300000} step={10000} value={prepayment} onChange={e=>setPrepayment(+e.target.value)} style={styles.slider} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: COLORS.muted }}>
                    <span>₹0</span><span style={{ color: COLORS.gold, fontWeight: 700 }}>{fmtC(prepayment)}/yr</span><span>₹3L</span>
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", color: COLORS.muted, marginBottom: "6px" }}>Interest Rate: {loanRate}%</div>
                  <input type="range" min={8} max={12} step={0.25} value={loanRate} onChange={e=>setLoanRate(+e.target.value)} style={styles.slider} />
                </div>
                <div style={{ background: COLORS.border, borderRadius: "6px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: COLORS.muted }}>New payoff estimate</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: COLORS.teal }}>{payoffDate.toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: COLORS.muted }}>Total interest saved</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: COLORS.gold }}>{prepayment > 0 ? "↓ Calculating..." : "—"}</span>
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.sectionTitle}>12-Month EMI Breakdown</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={amortRows.slice(0,12)} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 10 }} tickFormatter={v=>`M${v}`} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 10 }} tickFormatter={v=>Math.round(v/1000)+"k"} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="interest" name="Interest" stackId="a" fill={COLORS.coral} />
                    <Bar dataKey="principal" name="Principal" stackId="a" fill={COLORS.teal} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: "16px", fontSize: "11px", marginTop: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width:10,height:10,background:COLORS.coral,borderRadius:2 }}/><span style={{color:COLORS.muted}}>Interest</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width:10,height:10,background:COLORS.teal,borderRadius:2 }}/><span style={{color:COLORS.muted}}>Principal</span></div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Loan Balance Over Time</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={amortRows.filter((_,i)=>i%6===0)} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <defs>
                    <linearGradient id="loanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.coral} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.coral} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 10 }} tickFormatter={v=>`M${v}`} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 10 }} tickFormatter={v=>Math.round(v/100000)+"L"} />
                  <Tooltip formatter={v => fmtC(v)} contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, fontSize: 11 }} />
                  <Area type="monotone" dataKey="balance" name="Balance" stroke={COLORS.coral} fill="url(#loanGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── TAB: TAX PLANNING ──────────────────────────────────────── */}
        {tab === "tax" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[["fy25","FY 2024–25 (Actual)"],["fy26","FY 2025–26 (Provisional)"]].map(([k,v]) => (
                <button key={k} onClick={()=>setFy(k)} style={{ padding: "8px 20px", background: fy===k ? COLORS.gold : COLORS.border, color: fy===k ? COLORS.bg : COLORS.muted, border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", fontFamily: "inherit" }}>{v}</button>
              ))}
            </div>

            <div style={styles.grid3}>
              <div style={styles.statCard(COLORS.blue)}>
                <div style={styles.statLabel}>Section 24(b) — Home Loan Interest</div>
                <div style={styles.statValue(COLORS.blue)}>{fmtC(taxData.sec24b)}</div>
                <div style={styles.statSub}>{fy==="fy26"?"~ Provisional":"Actual · IDBI Bank cert."}</div>
                <div style={{ marginTop: "8px", fontSize: "11px", color: COLORS.muted }}>Tax saved @30%: <span style={{color:COLORS.blue,fontWeight:700}}>{fmtC(Math.round(taxData.sec24b*0.3))}</span></div>
              </div>
              <div style={styles.statCard(COLORS.teal)}>
                <div style={styles.statLabel}>Section 80C — Loan Principal</div>
                <div style={styles.statValue(COLORS.teal)}>{fmtC(taxData.sec80c_loan)}</div>
                <div style={styles.statSub}>{fy==="fy26"?"~ Provisional (₹1.5L max)":"Actual · IDBI Bank cert."}</div>
                <div style={{ marginTop: "8px", fontSize: "11px", color: COLORS.muted }}>Capped at ₹1,50,000. Eligible: <span style={{color:COLORS.teal,fontWeight:700}}>{fmtC(Math.min(taxData.sec80c_loan,150000))}</span></div>
              </div>
              <div style={styles.statCard(COLORS.gold)}>
                <div style={styles.statLabel}>Section 80D — Health Insurance</div>
                <div style={styles.statValue(COLORS.gold)}>{fmtC(taxData.sec80d)}</div>
                <div style={styles.statSub}>ICICI Lombard Criti Shield Plus</div>
                <div style={{ marginTop: "8px", fontSize: "11px", color: COLORS.muted }}>Tax saved @30%: <span style={{color:COLORS.gold,fontWeight:700}}>{fmtC(Math.round(taxData.sec80d*0.3))}</span></div>
              </div>
            </div>

            <div style={{ ...styles.card, marginTop: "20px" }}>
              <div style={styles.sectionTitle}>Total Tax Deduction Summary — {fy==="fy25"?"FY 2024–25":"FY 2025–26 (Provisional)"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px 40px" }}>
                {[
                  { label: "24(b) Home Loan Interest", val: taxData.sec24b, note: "Full amount" },
                  { label: "80C Principal (capped ₹1.5L)", val: Math.min(taxData.sec80c_loan, 150000), note: `of ${fmtC(taxData.sec80c_loan)} paid` },
                  { label: "80D Health Insurance", val: taxData.sec80d, note: "Base premium only" },
                ].map((r,i) => (
                  <div key={i} style={{ display: "contents" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <div style={{ width: "3px", height: "32px", background: [COLORS.blue,COLORS.teal,COLORS.gold][i], borderRadius: "2px" }} />
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>{r.label}</div>
                        <div style={{ fontSize: "11px", color: COLORS.muted }}>{r.note}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "right", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <div style={{ fontSize: "16px", fontWeight: 700 }}>{fmtC(r.val)}</div>
                      <div style={{ fontSize: "11px", color: COLORS.teal }}>≈ {fmtC(Math.round(r.val*0.3))} saved</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", padding: "16px", background: `linear-gradient(135deg, ${COLORS.gold}22, ${COLORS.teal}11)`, borderRadius: "6px", border: `1px solid ${COLORS.gold}44` }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>Total Deductions</div>
                  <div style={{ fontSize: "11px", color: COLORS.muted }}>Assuming 30% tax bracket</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: COLORS.gold }}>{fmtC(taxData.sec24b + Math.min(taxData.sec80c_loan,150000) + taxData.sec80d)}</div>
                  <div style={{ fontSize: "13px", color: COLORS.teal }}>Est. Tax Saving: {fmtC(taxSaving30)}</div>
                </div>
              </div>
              <div style={{ marginTop: "12px", fontSize: "11px", color: COLORS.muted, fontStyle: "italic" }}>
                ⚠ Consult a CA for final tax computation. 80C includes other instruments (PPF, ELSS, etc.) up to ₹1.5L total. Provisional FY26 figures subject to change.
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: GOALS ─────────────────────────────────────────────── */}
        {tab === "goals" && (
          <div>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Portfolio Growth Projections</div>
              <div style={{ fontSize: "12px", color: COLORS.muted, marginBottom: "16px" }}>
                Starting from current value of <strong style={{color:COLORS.text}}>{fmtC(totalCurrent)}</strong> (₹1,98,581 invested)
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 11 }} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} tickFormatter={v => v>=10000000 ? `${(v/10000000).toFixed(1)}Cr` : `${(v/100000).toFixed(0)}L`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="12% CAGR" stroke={COLORS.blue} strokeWidth={2} dot={{ fill: COLORS.blue, r: 3 }} />
                  <Line type="monotone" dataKey="15% CAGR" stroke={COLORS.gold} strokeWidth={2} dot={{ fill: COLORS.gold, r: 3 }} />
                  <Line type="monotone" dataKey="18% CAGR" stroke={COLORS.teal} strokeWidth={2} dot={{ fill: COLORS.teal, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...styles.grid2, marginTop: "20px" }}>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>10-Year Wealth Milestones</div>
                {[
                  { label: "5 Years @15%", val: Math.round(totalCurrent * Math.pow(1.15, 5)), icon: "▲" },
                  { label: "10 Years @15%", val: Math.round(totalCurrent * Math.pow(1.15, 10)), icon: "▲▲" },
                  { label: "15 Years @15%", val: Math.round(totalCurrent * Math.pow(1.15, 15)), icon: "▲▲▲" },
                  { label: "Loan-free net worth (est.)", val: Math.round(totalCurrent * Math.pow(1.15, 5)), icon: "★" },
                ].map((m,i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: "12px", color: COLORS.muted }}>{m.icon} {m.label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.gold }}>{fmtC(m.val)}</div>
                  </div>
                ))}
              </div>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>What's Missing from Your Plan</div>
                {[
                  "Monthly income / salary (for savings rate)",
                  "EPF / PPF / NPS balances",
                  "Spouse's income & investments",
                  "Term life insurance",
                  "Children's education fund target",
                  "Retirement corpus goal & target age",
                  "Emergency fund (3–6 months expenses)",
                ].map((item,i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}20`, fontSize: "12px" }}>
                    <span style={{ color: COLORS.coral, fontSize: "14px" }}>○</span>
                    <span style={{ color: COLORS.muted }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: "12px", fontSize: "11px", color: COLORS.muted }}>
                  Share these details to build a complete financial plan.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: COLORS.muted }}>
        <span>WealthOS · Personal Financial Dashboard · Santanu Sarker</span>
        <span>Data: IndMoney holdings 31-Mar-2026 · IDBI Loan Aug-2026 · ICICI Lombard Jul-2025</span>
      </div>
    </div>
  );
}
