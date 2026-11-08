import React, { useState, useMemo } from 'react';
import {
  computeIncomeTaxes,
  computeHeritageTaxes,
  LFI_IR_SLICES_MONTHLY,
  LFI_IR_RATES,
  LFI_CSG_SLICES_MONTHLY,
  LFI_CSG_RATES
} from '../services/taxCalculator';
import {
  IconCalculator,
  IconCheck,
  IconChevronDown,
  IconSparkles,
  IconHeartPulse,
  IconLeaf,
  IconBookOpen,
  IconShare
} from './Icons';

interface TaxSimulatorViewProps {
  onOpenShare?: () => void;
}

export const TaxSimulatorView: React.FC<TaxSimulatorViewProps> = ({ onOpenShare }) => {
  const [activeMode, setActiveMode] = useState<'revenu' | 'heritage'>('revenu');

  // --- State Mode Revenu ---
  const [isCouple, setIsCouple] = useState(false);
  const [salary1, setSalary1] = useState<number>(1850); // Salaire médian par défaut
  const [salary2, setSalary2] = useState<number>(1700);
  const [children, setChildren] = useState<number>(0);
  const [showPedagogy, setShowPedagogy] = useState(false);

  // --- State Mode Héritage ---
  const [patrimony, setPatrimony] = useState<number>(200000);
  const [heirs, setHeirs] = useState<number>(2);
  const [isSingleParent, setIsSingleParent] = useState(true);
  const [toChildren, setToChildren] = useState(true);

  // --- Calculations ---
  const incomeResult = useMemo(() => {
    const salaries = isCouple ? [salary1, salary2] : [salary1];
    return computeIncomeTaxes(salaries, children);
  }, [isCouple, salary1, salary2, children]);

  const heritageResult = useMemo(() => {
    return computeHeritageTaxes(patrimony, heirs, isSingleParent, toChildren);
  }, [patrimony, heirs, isSingleParent, toChildren]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const quickSalaries = [
    { label: 'SMIC (1 400 €)', value: 1400 },
    { label: 'Médian (1 850 €)', value: 1850 },
    { label: 'Moyen (2 600 €)', value: 2600 },
    { label: 'Cadre (3 800 €)', value: 3800 },
    { label: 'Aisé (5 500 €)', value: 5500 },
    { label: 'Très aisé (10 000 €)', value: 10000 }
  ];

  const quickPatrimonies = [
    { label: '80 000 €', value: 80000 },
    { label: '200 000 €', value: 200000 },
    { label: '400 000 €', value: 400000 },
    { label: '1 000 000 €', value: 1000000 },
    { label: '5 000 000 €', value: 5000000 },
    { label: '15 000 000 € (Plafond 12M€)', value: 15000000 }
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fadeIn px-4 sm:px-6 pt-4 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-[#1d033a] via-[#100124] to-[#250444] border border-purple-500/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-3">
            <IconCalculator size={14} className="text-purple-300" />
            <span>Révolution Fiscale • Programme 2027</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Simulateur d'impôts de La France Insoumise
          </h2>
          <p className="text-sm text-purple-200/90 mt-1.5 max-w-2xl leading-relaxed">
            Découvrez en temps réel combien vous paierez avec le barème progressif à 14 tranches et la CSG progressive de <strong>L'Avenir en commun</strong>. 
            <span className="text-emerald-400 font-bold ml-1">90 % des Français paieront moins ou pas plus d'impôts !</span>
          </p>

          {/* Mode Switcher */}
          <div className="mt-5 grid grid-cols-2 gap-2 bg-[#0c0017] p-1.5 rounded-2xl border border-purple-500/30">
            <button
              onClick={() => setActiveMode('revenu')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeMode === 'revenu'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <span>💼 Impôt sur le revenu &amp; CSG</span>
            </button>

            <button
              onClick={() => setActiveMode('heritage')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeMode === 'heritage'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <span>🏛️ Droits de succession &amp; Héritage</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1 : IMPÔT SUR LE REVENU & CSG */}
      {/* ========================================================================= */}
      {activeMode === 'revenu' && (
        <div className="space-y-6">
          {/* Card Formulaire */}
          <div className="rounded-3xl bg-[#130327] border border-purple-500/30 p-5 sm:p-6 shadow-xl space-y-5">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span>Vos informations de situation</span>
            </h3>

            {/* Situation Maritale */}
            <div>
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                Situation familiale
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouple(false)}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    !isCouple
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                      : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:text-white'
                  }`}
                >
                  Célibataire / Seul(e)
                </button>
                <button
                  type="button"
                  onClick={() => setIsCouple(true)}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    isCouple
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                      : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:text-white'
                  }`}
                >
                  En couple (marié·e / pacsé·e)
                </button>
              </div>
            </div>

            {/* Salaire 1 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  {isCouple ? 'Votre salaire net mensuel avant impôt' : 'Salaire net mensuel avant impôt'}
                </label>
                <span className="text-base font-black text-white font-mono">
                  {formatCurrency(salary1)} / mois
                </span>
              </div>

              <input
                type="range"
                min="600"
                max="15000"
                step="50"
                value={salary1}
                onChange={(e) => setSalary1(Number(e.target.value))}
                className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />

              {/* Quick pills */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {quickSalaries.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSalary1(s.value)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      salary1 === s.value
                        ? 'bg-purple-500 text-white border-purple-300 shadow-sm'
                        : 'bg-purple-900/30 text-purple-300/80 border-purple-700/40 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Salaire 2 (si couple) */}
            {isCouple && (
              <div className="pt-4 border-t border-purple-800/40 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Salaire net mensuel de votre partenaire
                  </label>
                  <span className="text-base font-black text-white font-mono">
                    {formatCurrency(salary2)} / mois
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="50"
                  value={salary2}
                  onChange={(e) => setSalary2(Number(e.target.value))}
                  className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {quickSalaries.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSalary2(s.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        salary2 === s.value
                          ? 'bg-pink-600 text-white border-pink-400 shadow-sm'
                          : 'bg-purple-900/30 text-purple-300/80 border-purple-700/40 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enfants à charge */}
            <div>
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                Nombre d'enfants à charge
              </label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setChildren(cnt)}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      children === cnt
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                        : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:text-white'
                    }`}
                  >
                    {cnt === 5 ? '5+' : cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Résultat Principal */}
          <div className={`rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all ${
            incomeResult.gain > 0
              ? 'bg-gradient-to-br from-[#0c2a1e] via-[#091f16] to-[#070014] border-emerald-500/50'
              : incomeResult.gain === 0
              ? 'bg-gradient-to-br from-[#101b33] via-[#091224] to-[#070014] border-blue-500/50'
              : 'bg-gradient-to-br from-[#2b0f38] via-[#1a0824] to-[#070014] border-purple-500/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                incomeResult.gain > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : incomeResult.gain === 0
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
              }`}>
                {incomeResult.gain > 0
                  ? '✨ Baisse d’impôt garantie'
                  : incomeResult.gain === 0
                  ? 'Imposition inchangée'
                  : '🤝 Contribution de solidarité'}
              </span>

              <div className="text-xs text-purple-300/80 font-semibold">
                Avec La France Insoumise
              </div>
            </div>

            {/* Grand chiffre de gain */}
            <div className="my-3">
              {incomeResult.gain > 0 ? (
                <>
                  <div className="text-3xl sm:text-5xl font-black text-emerald-300 tracking-tight">
                    +{formatCurrency(incomeResult.gain)} <span className="text-lg sm:text-2xl font-bold text-emerald-400/80">/ an</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
                    soit +{formatCurrency(incomeResult.gainMonthly)} net de pouvoir d'achat par mois !
                  </div>
                </>
              ) : incomeResult.gain === 0 ? (
                <>
                  <div className="text-3xl sm:text-4xl font-black text-blue-300 tracking-tight">
                    0 € de variation
                  </div>
                  <div className="text-sm font-semibold text-blue-300 mt-1">
                    Votre impôt reste exactement le même qu'aujourd'hui.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight">
                    +{formatCurrency(Math.abs(incomeResult.gain))} <span className="text-lg sm:text-2xl font-bold text-amber-400/80">/ an</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-amber-300 mt-1">
                    soit +{formatCurrency(Math.abs(incomeResult.gainMonthly))} de contribution solidaire par mois
                  </div>
                  <p className="text-xs text-purple-300/80 mt-2 max-w-xl">
                    Appartenant aux 10 % des plus hauts revenus, votre contribution permettra de financer la retraite à 60 ans, l'hôpital public et la gratuité scolaire.
                  </p>
                </>
              )}
            </div>

            {/* Jauge Percentile INSEE */}
            <div className="mt-5 p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
              <span className="text-purple-300">
                📊 Votre niveau de revenu se situe parmi les <strong>{incomeResult.percentile} %</strong> les plus élevés de France.
              </span>
            </div>

            {/* Tableau comparatif chiffré */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 mb-3">
                Détail de votre prélèvement fiscal annuel
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pb-2 border-b border-white/10 text-purple-300 font-bold">
                <span className="text-left">Poste fiscal</span>
                <span>Aujourd'hui</span>
                <span className="text-purple-200">Avec LFI</span>
              </div>

              <div className="space-y-2.5 mt-3 text-xs sm:text-sm">
                {/* Ligne 1 : Impôt sur le revenu */}
                <div className="grid grid-cols-3 gap-2 items-center text-center">
                  <span className="text-left font-medium text-purple-200">
                    Impôt sur le revenu (IR)
                  </span>
                  <span className="font-mono text-slate-300">
                    {formatCurrency(incomeResult.current.ir)}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(incomeResult.lfi.ir)}
                  </span>
                </div>

                {/* Ligne 2 : CSG */}
                <div className="grid grid-cols-3 gap-2 items-center text-center">
                  <span className="text-left font-medium text-purple-200">
                    CSG (9,2% fixe vs progressive)
                  </span>
                  <span className="font-mono text-slate-300">
                    {formatCurrency(incomeResult.current.csg)}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(incomeResult.lfi.csg)}
                  </span>
                </div>

                {/* Ligne 3 : Total */}
                <div className="grid grid-cols-3 gap-2 items-center text-center pt-2.5 border-t border-white/15 font-bold">
                  <span className="text-left text-white">
                    Total prélevé
                  </span>
                  <span className="font-mono text-slate-300">
                    {formatCurrency(incomeResult.current.total)}
                  </span>
                  <span className={`font-mono font-black ${
                    incomeResult.gain > 0 ? 'text-emerald-400' : 'text-amber-300'
                  }`}>
                    {formatCurrency(incomeResult.lfi.total)}
                  </span>
                </div>

                {/* Ligne 4 : Taux effectif */}
                <div className="grid grid-cols-3 gap-2 items-center text-center text-[11px] text-purple-400">
                  <span className="text-left">Taux effectif global</span>
                  <span>{incomeResult.effectiveRateCurrent} %</span>
                  <span className="font-bold text-purple-300">{incomeResult.effectiveRateLfi} %</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Pédagogique Déroulante */}
          <div className="rounded-3xl bg-[#130327] border border-purple-500/30 overflow-hidden shadow-xl">
            <button
              onClick={() => setShowPedagogy(!showPedagogy)}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-purple-950/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <IconBookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-white">
                    Comprendre la révolution fiscale à 14 tranches
                  </h4>
                  <p className="text-xs text-purple-300/80 mt-0.5">
                    Voir les barèmes complets de l'IR et de la CSG progressive
                  </p>
                </div>
              </div>

              <div className={`text-purple-400 transition-transform duration-300 ${showPedagogy ? 'rotate-180' : ''}`}>
                <IconChevronDown size={20} />
              </div>
            </button>

            {showPedagogy && (
              <div className="p-5 sm:p-6 border-t border-purple-800/40 bg-[#0d011c] space-y-6 text-xs sm:text-sm animate-fadeIn">
                {/* Point 1 */}
                <div className="space-y-2">
                  <h5 className="font-black text-purple-200 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>1. Impôt sur le revenu : passer de 5 à 14 tranches</span>
                  </h5>
                  <p className="text-purple-300/80 leading-relaxed">
                    Aujourd'hui, l'impôt sur le revenu ne compte que 5 tranches, ce qui fait peser un effort disproportionné sur les classes moyennes dès qu'elles changent de tranche. La France Insoumise rétablit un barème progressif à 14 tranches (comme sous Pierre Mauroy), pour adoucir les transitions et soulager les salaires modestes et moyens.
                  </p>

                  {/* Tableau des 14 tranches IR */}
                  <div className="overflow-x-auto rounded-xl border border-purple-700/40 mt-3">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-purple-950/60 text-purple-200 font-bold border-b border-purple-700/40">
                        <tr>
                          <th className="p-2.5">Tranche</th>
                          <th className="p-2.5">Revenu mensuel / part</th>
                          <th className="p-2.5">Taux LFI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-800/30 text-purple-300">
                        {LFI_IR_SLICES_MONTHLY.map((slice, idx) => {
                          const nextSlice = LFI_IR_SLICES_MONTHLY[idx + 1];
                          const label = nextSlice
                            ? `De ${formatCurrency(slice)} à ${formatCurrency(nextSlice)}`
                            : `Au-delà de ${formatCurrency(slice)}`;
                          return (
                            <tr key={idx} className="hover:bg-purple-900/20">
                              <td className="p-2 font-mono font-bold text-white">#{idx + 1}</td>
                              <td className="p-2">{label}</td>
                              <td className="p-2 font-bold font-mono text-purple-200">
                                {Math.round(LFI_IR_RATES[idx] * 1000) / 10} %
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="space-y-2 pt-4 border-t border-purple-800/30">
                  <h5 className="font-black text-purple-200 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                    <span>2. Rendre la CSG progressive (14 tranches de 6% à 19%)</span>
                  </h5>
                  <p className="text-purple-300/80 leading-relaxed">
                    Aujourd'hui, chaque travailleur paie un taux de CSG uniforme de <strong>9,2 %</strong>, qu'il soit au SMIC ou multimillionnaire. C'est l'un des impôts les plus injustes. Avec La France Insoumise, la CSG démarre à <strong>6 %</strong> pour les bas salaires et progresse jusqu'à 19 % pour les très hauts salaires.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2 : DROITS DE SUCCESSION & HÉRITAGE */}
      {/* ========================================================================= */}
      {activeMode === 'heritage' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#130327] border border-purple-500/30 p-5 sm:p-6 shadow-xl space-y-5">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
              <span>Paramètres de transmission patrimoniale</span>
            </h3>

            {/* Patrimoine transmis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Patrimoine total net à transmettre
                </label>
                <span className="text-base font-black text-white font-mono">
                  {formatCurrency(patrimony)}
                </span>
              </div>

              <input
                type="range"
                min="20000"
                max="25000000"
                step="20000"
                value={patrimony}
                onChange={(e) => setPatrimony(Number(e.target.value))}
                className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />

              {/* Quick pills */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {quickPatrimonies.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPatrimony(p.value)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      patrimony === p.value
                        ? 'bg-pink-600 text-white border-pink-400 shadow-sm'
                        : 'bg-purple-900/30 text-purple-300/80 border-purple-700/40 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nombre d'enfants */}
            <div>
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                Nombre d'enfants héritiers
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setHeirs(cnt)}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      heirs === cnt
                        ? 'bg-pink-600 border-pink-400 text-white shadow-md'
                        : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:text-white'
                    }`}
                  >
                    {cnt === 5 ? '5+' : cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Parents transmetteurs */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSingleParent(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  isSingleParent
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                    : 'bg-purple-950/40 border-purple-800/60 text-purple-300'
                }`}
              >
                1 parent transmetteur
              </button>
              <button
                type="button"
                onClick={() => setIsSingleParent(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  !isSingleParent
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                    : 'bg-purple-950/40 border-purple-800/60 text-purple-300'
                }`}
              >
                Les 2 parents (couple)
              </button>
            </div>
          </div>

          {/* Résultat Héritage */}
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1d033a] via-[#100124] to-[#070014] border border-pink-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/40">
                Droits de succession
              </span>
              <span className="text-xs text-purple-300/80 font-semibold">
                Abattement LFI : 120 000 € / enfant
              </span>
            </div>

            {heritageResult.lfiTax === 0 ? (
              <div>
                <div className="text-3xl sm:text-5xl font-black text-emerald-300 tracking-tight">
                  0 € d'impôt
                </div>
                <p className="text-sm text-emerald-400 font-bold mt-1">
                  Exonération intégrale avec La France Insoumise !
                </p>
                <p className="text-xs text-purple-300/80 mt-2">
                  Tout patrimoine transmis inférieur à 120 000 € par enfant (contre 100 000 € aujourd'hui) est totalement défiscalisé. Vos enfants touchent 100 % du montant transmis.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Net transmis aux enfants : <span className="text-pink-300">{formatCurrency(heritageResult.lfiNet)}</span>
                </div>
                <div className="text-xs text-purple-300/80 mt-1">
                  Droits prélevés : {formatCurrency(heritageResult.lfiTax)}
                  {heritageResult.gain > 0 && (
                    <span className="text-emerald-400 font-bold ml-2">
                      (soit {formatCurrency(heritageResult.gain)} de taxes en moins qu'aujourd'hui !)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Plafond 12 M€ */}
            {heritageResult.isCapped && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
                <span className="font-bold">⚠️ Règle de l'héritage maximum à 12 millions d'euros :</span>
                <p className="mt-1 text-amber-300/90 leading-relaxed">
                  Dans le programme de La France Insoumise, aucun héritier ne peut percevoir plus de 12 millions d'euros. Le surplus est versé dans un fonds national d'émancipation de la jeunesse et de garantie d'autonomie.
                </p>
              </div>
            )}

            {/* Comparatif Aujourd'hui vs LFI */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-purple-300 font-bold mb-1">Aujourd'hui (Système actuel)</div>
                <div className="text-lg font-black font-mono text-white">{formatCurrency(heritageResult.currentTax)}</div>
                <div className="text-[11px] text-purple-400 mt-0.5">Net transmis : {formatCurrency(heritageResult.currentNet)}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-pink-950/40 border border-pink-500/30">
                <div className="text-pink-300 font-bold mb-1">Avec La France Insoumise</div>
                <div className="text-lg font-black font-mono text-pink-200">{formatCurrency(heritageResult.lfiTax)}</div>
                <div className="text-[11px] text-pink-300/80 mt-0.5">Net transmis : {formatCurrency(heritageResult.lfiNet)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
