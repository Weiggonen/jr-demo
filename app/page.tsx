"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const LOADING_MS = 5000;
const STAGGER_MS = 350;
const TOTAL_SECTIONS = 9;

const dealers = [
  { name: "K AUTO RETAIL OY", price: "12 870 €", days: 16, highlight: false },
  { name: "YR-AUTO OY", price: "13 600 €", days: 8, highlight: false },
  { name: "K AUTO RETAIL OY", price: "13 800 €", days: 63, highlight: false },
  { name: "JARMO RINTA-JOUPPI OY", price: "14 400 €", days: 114, highlight: true },
  { name: "K AUTO RETAIL OY", price: "14 690 €", days: 30, highlight: false },
  { name: "JARMO RINTA-JOUPPI OY", price: "14 800 €", days: 44, highlight: false },
  { name: "SAKA FINLAND OY", price: "18 800 €", days: 43, highlight: false },
  { name: "SAKA FINLAND OY", price: "19 800 €", days: 114, highlight: false },
  { name: "KAMUX SUOMI OY", price: "23 900 €", days: 15, highlight: false },
];

const sellingPoints = [
  "Suomiauto",
  "Yhdeltä omistajalta",
  "Kahdet hyväkuntoiset renkaat",
];

const tradeIns = ["Volvo XC60", "Tesla Model 3", "Toyota Avensis"];

function CheckBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 border border-green-200">
      <svg className="h-4 w-4 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
      {text}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
      {children}
    </h3>
  );
}

function ScoreBadge({ label, value, score }: { label: string; value: string; score: number }) {
  const light =
    score >= 70
      ? { bg: "bg-green-500", ring: "ring-green-200", text: "text-green-700" }
      : score >= 30
        ? { bg: "bg-yellow-400", ring: "ring-yellow-200", text: "text-yellow-700" }
        : { bg: "bg-red-500", ring: "ring-red-200", text: "text-red-700" };

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${light.text}`}>{value}</span>
        <span className={`inline-block h-3 w-3 rounded-full ${light.bg} ring-2 ${light.ring}`} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center border border-gray-100">
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function RevealSection({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full border-[3px] border-red-200 border-t-red-600 animate-spin" />
        <svg className="h-7 w-7 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17h1a2 2 0 002-2v-1h8v1a2 2 0 002 2h1" />
          <path d="M3 11l1.5-5A2 2 0 016.4 4.5h11.2a2 2 0 011.9 1.5L21 11" />
          <rect x="3" y="11" width="18" height="6" rx="2" />
          <circle cx="6.5" cy="17" r="1.5" />
          <circle cx="17.5" cy="17" r="1.5" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">Tunnistetaan autoa…</p>
        <p className="text-xs text-gray-400 mt-1">Haetaan tietoja järjestelmistä</p>
      </div>
      <div className="flex gap-1.5 mt-1">
        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOADING_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    let n = 0;
    const iv = setInterval(() => {
      n++;
      setRevealed(n);
      if (n >= TOTAL_SECTIONS) clearInterval(iv);
    }, STAGGER_MS);
    return () => clearInterval(iv);
  }, [loading]);

  const show = (i: number) => revealed >= i;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left: Screenshot */}
      <div className="w-[70%] overflow-auto bg-gray-200">
        <Image
          src="/image001.png"
          alt="J. Rinta-Jouppi järjestelmä – Audi A4 (LNK-407)"
          width={1866}
          height={1568}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Right: Extension Panel */}
      <div className="w-[30%] flex flex-col border-l border-gray-300 bg-white shadow-[-2px_0_8px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-red-700 to-red-800">
          <div className="flex items-center gap-2.5 px-4 py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
              <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657L9.25 18.693z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">AutoAssist</h1>
              <p className="text-[10px] text-red-200">Audi A4 · LNK-407</p>
            </div>
          </div>
          {/* Key points */}
          <div
            className={`flex border-t border-red-600/50 overflow-hidden transition-all duration-500 ease-out ${
              show(1) ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex-1 px-3 py-2 text-center border-r border-red-600/50">
              <div className="text-[10px] text-red-200 uppercase tracking-wide">Tinkivara</div>
              <div className="text-base font-bold text-white">800 €</div>
            </div>
            <div className="flex-1 px-3 py-2 text-center">
              <div className="text-[10px] text-red-200 uppercase tracking-wide">Kilpailijoiden alin</div>
              <div className="text-base font-bold text-white">12 870 €</div>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <RevealSection visible={show(2)}>
              <SectionTitle>Historiatarkistus</SectionTitle>
              <div className="space-y-1.5">
                <CheckBadge text="CarVertical – Ei huomioita" />
                <CheckBadge text="CARfax – Ei huomioita" />
              </div>
            </RevealSection>

            <RevealSection visible={show(3)}>
              <SectionTitle>Pisteet</SectionTitle>
              <div className="space-y-1.5">
                <ScoreBadge label="Myyntipisteet" value="12 %" score={12} />
                <ScoreBadge label="KM-pisteet" value="0 %" score={0} />
              </div>
            </RevealSection>

            <RevealSection visible={show(4)}>
              <SectionTitle>Markkinatilanne</SectionTitle>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500">
                      <th className="px-2.5 py-2 font-medium">Autoliike</th>
                      <th className="px-2.5 py-2 font-medium text-right">Hinta</th>
                      <th className="px-2.5 py-2 font-medium text-right">Pv</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealers.map((d, i) => (
                      <tr
                        key={i}
                        className={
                          d.highlight
                            ? "bg-red-50 font-semibold text-red-800 border-l-2 border-red-500"
                            : i % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50/50"
                        }
                      >
                        <td className="px-2.5 py-1.5 truncate max-w-[140px]">
                          {d.name}
                          {d.highlight && (
                            <span className="ml-1 text-[9px] text-red-500 font-normal">(sinä)</span>
                          )}
                        </td>
                        <td className="px-2.5 py-1.5 text-right whitespace-nowrap">{d.price}</td>
                        <td className="px-2.5 py-1.5 text-right whitespace-nowrap">{d.days}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealSection>

            <RevealSection visible={show(5)}>
              <SectionTitle>Tyyppiviat & Trafitiedot</SectionTitle>
              <CheckBadge text="Ei huomioita" />
            </RevealSection>

            <RevealSection visible={show(6)}>
              <SectionTitle>Tunnusluvut</SectionTitle>
              <div className="flex gap-2.5">
                <StatCard label="Keskiarvokate" value="972 €" />
                <StatCard label="Keskim. varastopäivät" value="49 pv" />
              </div>
            </RevealSection>

            <RevealSection visible={show(7)}>
              <SectionTitle>Top 3 myyntiargumenttia</SectionTitle>
              <div className="space-y-1.5">
                {sellingPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 border border-emerald-100">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {point}
                  </div>
                ))}
              </div>
            </RevealSection>

            <RevealSection visible={show(8)}>
              <SectionTitle>Top 3 halutut vaihtoautot</SectionTitle>
              <div className="space-y-1.5">
                {tradeIns.map((car, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 border border-amber-100">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {car}
                  </div>
                ))}
              </div>
            </RevealSection>

            <RevealSection visible={show(9)}>
              <SectionTitle>Edistyneet suositukset</SectionTitle>
              <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800 leading-relaxed">
                    Voit tulla hinnassa vastaan <strong>maksimissaan 800 €</strong>.
                    Tämä auto keskimäärin lojuu varastossa liian kauan, ja tuolla
                    hinnalla päästäisiin vielä pienelle katteelle tästä autosta.
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
        )}
      </div>
    </div>
  );
}
