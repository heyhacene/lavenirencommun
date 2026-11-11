import React from 'react';
import type { Budget } from '../types/programme';
import { IconClose, IconChevronDown, IconCalculator } from './Icons';

export type BudgetFicheKey = 'depenses' | 'recettes' | 'allegements' | 'investissement';

interface BudgetDetailModalProps {
  ficheKey: BudgetFicheKey | null;
  onClose: () => void;
  budget: Budget;
  onOpenSimulator?: () => void;
  onSelectTab?: (tab: BudgetFicheKey) => void;
}

export interface AllegementItem {
  title: string;
  amount: string;
  description: string;
  points: string[];
}

export const ALLEGEMENTS_DATA: AllegementItem[] = [
  {
    title: 'Baisse de la TVA & Blocage des prix essentiels',
    amount: '-14,8 Md€/an',
    description: 'Allègement direct sur la consommation du quotidien et restitution de pouvoir d’achat.',
    points: [
      'TVA à 0% sur un panier de produits alimentaires de première nécessité, bio et locaux, et sur les produits d’hygiène.',
      'Baisse de la TVA de 20% à 5,5% sur le gaz, l’électricité et les carburants pour contrer l’inflation.',
      'Gratuité des premiers mètres cubes d’eau indispensables à une vie digne et tarification progressive au-delà.',
      'Blocage d’urgence des marges des distributeurs et des prix de l’énergie et des carburants.'
    ]
  },
  {
    title: 'Baisse de l’Impôt sur le Revenu pour 90% des Français',
    amount: '-5,2 Md€/an',
    description: 'Un barème à 14 tranches progressives qui protège les classes populaires et moyennes.',
    points: [
      'Baisse d’impôt ou maintien pour 90% des foyers fiscaux (tous les célibataires gagnant jusqu’à 4 000 € net/mois).',
      'Augmentation de la tranche exonérée et des premières tranches à taux réduits pour relancer le pouvoir de vivre.',
      'Remplacement du quotient conjugal patriarcal par un crédit d’impôt par enfant accordé à toutes les familles.'
    ]
  },
  {
    title: 'Soutien & Allègements ciblés pour les TPE/PME',
    amount: '-4,7 Md€/an',
    description: 'Protéger le tissu économique local et les commerces de proximité.',
    points: [
      'Taux d’impôt sur les sociétés réduit pour les bénéfices réinvestis dans l’emploi et l’outil de production.',
      'Caisse de péréquation et de solidarité pour soutenir temporairement les TPE/PME dans la hausse du SMIC à 1 600 €.',
      'Modulation des cotisations patronales : allègement pour les entreprises créatrices d’emplois stables et écologiques.'
    ]
  },
  {
    title: 'Gratuité des services publics et frais scolaires',
    amount: 'Inclus dans les pôles',
    description: 'Suppression des dépenses contraintes pesant sur le budget des familles.',
    points: [
      'Gratuité intégrale de l’école publique : cantines scolaires 100% bio et gratuites, fournitures et sorties scolaires offertes.',
      'Transports collectifs du quotidien gratuits pour les jeunes de moins de 25 ans et tarifs réduits pour tous.'
    ]
  }
];

export const BudgetDetailModal: React.FC<BudgetDetailModalProps> = ({
  ficheKey,
  onClose,
  budget,
  onOpenSimulator,
  onSelectTab
}) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  if (!ficheKey) return null;

  const config = {
    depenses: {
      tag: 'Fiche Chiffrage n°1 • Dépenses prioritaires',
      title: 'Les Dépenses d’Urgence et de Reconstruction',
      amount: budget.balanceTotal.depensesAnnuelles,
      badgeColor: 'text-rose-300 bg-rose-950/80 border-rose-500/40',
      gradient: 'from-rose-500/20 via-purple-950/40 to-transparent',
      borderColor: 'border-rose-500/40',
      textColor: 'text-rose-400',
      intro: '106,4 milliards d’euros par an investis pour la bifurcation écologique, la refondation de l’hôpital public, la hausse des salaires et le sauvetage de l’école républicaine.'
    },
    recettes: {
      tag: 'Fiche Chiffrage n°2 • Recettes fiscales',
      title: 'Justice Fiscale : Financer le Bien Commun',
      amount: budget.balanceTotal.recettesAnnuelles,
      badgeColor: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40',
      gradient: 'from-emerald-500/20 via-purple-950/40 to-transparent',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
      intro: '81,7 milliards d’euros par an récupérés en faisant contribuer les profiteurs de crise, les superprofits et les ultra-riches, tout en luttant sans merci contre la fraude fiscale.'
    },
    allegements: {
      tag: 'Fiche Chiffrage n°3 • Allègements & Pouvoir d’achat',
      title: 'Baisses de Charges et d’Impôts pour 90% des Français',
      amount: budget.balanceTotal.baissesImpotsEtCouts,
      badgeColor: 'text-amber-300 bg-amber-950/80 border-amber-500/40',
      gradient: 'from-amber-500/20 via-purple-950/40 to-transparent',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-400',
      intro: '24,7 milliards d’euros restitués au pouvoir de vivre grâce à la baisse de la TVA, la baisse d’impôt sur le revenu pour 9 foyers sur 10 et les tarifs réglementés de l’énergie.'
    },
    investissement: {
      tag: 'Fiche Chiffrage n°4 • Pôle d’Investissement',
      title: 'Le Grand Pôle Public d’Investissement d’Avenir',
      amount: budget.balanceTotal.polePublicInvestissement,
      badgeColor: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/40',
      gradient: 'from-cyan-500/20 via-purple-950/40 to-transparent',
      borderColor: 'border-cyan-500/40',
      textColor: 'text-cyan-400',
      intro: '100 milliards d’euros mobilisés via la Banque Publique d’Investissement et la création monétaire écologique pour moderniser le rail, l’eau, l’énergie et relocaliser nos industries.'
    }
  }[ficheKey];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-purple-500/40 flex flex-col shadow-2xl overflow-hidden animate-scale"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className={`p-5 sm:p-6 border-b border-purple-900/50 bg-gradient-to-r ${config.gradient} relative flex-shrink-0`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white rounded-xl hover:bg-purple-900/50 transition-colors"
            style={{ touchAction: 'manipulation' }}
            title="Fermer la fiche détaillée"
          >
            <IconClose size={20} />
          </button>

          <div className="pr-10">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border mb-2 ${config.badgeColor}`}>
              {config.tag}
            </span>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {config.title}
              </h2>
              <span className={`text-2xl sm:text-3xl font-black tracking-tight ${config.textColor}`}>
                {config.amount}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-2 leading-relaxed">
              {config.intro}
            </p>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-4 flex-1">
          {/* FICHE 1 : DÉPENSES */}
          {ficheKey === 'depenses' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                Les 5 Pôles d’interventions prioritaires :
              </div>
              {budget.depensesCategories.map((cat, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="glass-panel rounded-2xl border border-purple-500/20 overflow-hidden shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors gap-3"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 shadow-sm flex-shrink-0" />
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-white">{cat.category}</h3>
                          <span className="text-xs font-black text-rose-300">{cat.amount}</span>
                        </div>
                      </div>
                      <IconChevronDown
                        className={`w-4 h-4 text-purple-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-purple-900/50 bg-[#120324]/80">
                        <ul className="space-y-2.5 mt-2">
                          {cat.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                              <span className="text-rose-400 font-black mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* FICHE 2 : RECETTES */}
          {ficheKey === 'recettes' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                Les 4 Grands Piliers de Recettes Fiscales :
              </div>
              {budget.recettesCategories.map((rec, idx) => (
                <div
                  key={idx}
                  className="glass-panel rounded-2xl p-4.5 border border-emerald-500/30 shadow-md bg-[#16052b]/80"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-white">{rec.source}</h3>
                    <span className="text-xs sm:text-sm font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full whitespace-nowrap">
                      {rec.amount}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {rec.details}
                  </p>
                </div>
              ))}

              {onOpenSimulator && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSimulator();
                  }}
                  className="w-full mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  style={{ touchAction: 'manipulation' }}
                >
                  <IconCalculator size={18} />
                  <span>Calculer votre impôt avec le simulateur officiel LFI (14 tranches) ➔</span>
                </button>
              )}
            </div>
          )}

          {/* FICHE 3 : ALLÈGEMENTS */}
          {ficheKey === 'allegements' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                Détail des baisses de coûts et allègements fiscaux (-24,7 Md€) :
              </div>
              {ALLEGEMENTS_DATA.map((item, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="glass-panel rounded-2xl border border-amber-500/30 overflow-hidden shadow-md bg-[#16052b]/80"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors gap-3"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm flex-shrink-0" />
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-white">{item.title}</h3>
                          <span className="text-xs font-black text-amber-300">{item.amount}</span>
                        </div>
                      </div>
                      <IconChevronDown
                        className={`w-4 h-4 text-purple-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-purple-900/50 bg-[#120324]/80 space-y-2">
                        <p className="text-xs text-purple-200/90 font-medium">
                          {item.description}
                        </p>
                        <ul className="space-y-2 mt-2">
                          {item.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                              <span className="text-amber-400 font-black mt-0.5">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              {onOpenSimulator && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSimulator();
                  }}
                  className="w-full mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  style={{ touchAction: 'manipulation' }}
                >
                  <IconCalculator size={18} />
                  <span>Tester vos économies sur le simulateur officiel LFI ➔</span>
                </button>
              )}
            </div>
          )}

          {/* FICHE 4 : PÔLE D'INVESTISSEMENT */}
          {ficheKey === 'investissement' && (
            <div className="space-y-4">
              <div className="glass-panel rounded-2xl p-4.5 border border-cyan-500/30 bg-[#120324]/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xl flex-shrink-0">
                    🏛️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Financement Stratégique Hors Marchés
                    </h3>
                    <p className="text-xs text-cyan-300 font-bold">
                      100 milliards d’euros pour le climat et l’industrie
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {budget.poleInvestissement.description}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Les 4 Grands Chantiers d’Urgence :
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                  <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>🚆</span> <span>Réseau ferroviaire &amp; Fret</span>
                    </div>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Réouverture des petites lignes de proximité et relance massive des trains de nuit.
                    </p>
                  </div>

                  <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>💧</span> <span>Réseaux d'eau potable</span>
                    </div>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Rénovation complète des canalisations pour en finir avec la perte d'un litre sur cinq.
                    </p>
                  </div>

                  <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>⚡</span> <span>Énergies renouvelables</span>
                    </div>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Parcs éoliens marins citoyens, énergie solaire sur toutes les toitures publiques et géothermie.
                    </p>
                  </div>

                  <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>🏭</span> <span>Relocalisations industrielles</span>
                    </div>
                    <p className="text-[11px] text-purple-200/80 leading-relaxed">
                      Souveraineté sur les médicaments essentiels, dispositifs médicaux et semi-conducteurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation vers les autres fiches du chiffrage */}
          <div className="pt-4 border-t border-purple-900/50">
            <span className="text-[11px] text-purple-300 font-bold uppercase tracking-wider block mb-2.5">
              Consulter les autres volets du chiffrage :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectTab?.('depenses');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                  ficheKey === 'depenses'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500/50'
                    : 'bg-[#18082f] border-purple-900/50 text-slate-300 hover:text-white hover:border-purple-600'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block text-[10px] text-rose-300 uppercase">Dépenses</span>
                <span className="font-black text-white">{budget.balanceTotal.depensesAnnuelles}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab?.('recettes');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                  ficheKey === 'recettes'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50'
                    : 'bg-[#18082f] border-purple-900/50 text-slate-300 hover:text-white hover:border-purple-600'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block text-[10px] text-emerald-300 uppercase">Recettes</span>
                <span className="font-black text-white">{budget.balanceTotal.recettesAnnuelles}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab?.('allegements');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                  ficheKey === 'allegements'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/50'
                    : 'bg-[#18082f] border-purple-900/50 text-slate-300 hover:text-white hover:border-purple-600'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block text-[10px] text-amber-300 uppercase">Allègements</span>
                <span className="font-black text-white">{budget.balanceTotal.baissesImpotsEtCouts}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab?.('investissement');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                  ficheKey === 'investissement'
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/50'
                    : 'bg-[#18082f] border-purple-900/50 text-slate-300 hover:text-white hover:border-purple-600'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block text-[10px] text-cyan-300 uppercase">Investissement</span>
                <span className="font-black text-white">{budget.balanceTotal.polePublicInvestissement}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-900/50 bg-[#100322] flex items-center justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md text-center"
            style={{ touchAction: 'manipulation' }}
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
