import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Trash2, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  coeff: number;
  credits: number;
  noteDs: string;
  noteExam: string;
}

const PRESETS: Record<string, { label: string; modules: Omit<ModuleItem, 'id' | 'noteDs' | 'noteExam'>[] }> = {
  lig: {
    label: "1ère Licence Informatique de Gestion (LIG)",
    modules: [
      { name: "Algorithmique & Structures de Données", coeff: 3, credits: 5 },
      { name: "Comptabilité Générale", coeff: 3, credits: 5 },
      { name: "Algèbre & Analyse Mathématique", coeff: 2.5, credits: 5 },
      { name: "Principes d'Économie & Gestion", coeff: 2, credits: 4 },
      { name: "Systèmes d'Exploitation & Architecture", coeff: 2, credits: 4 },
      { name: "Droit & Éthique du Numérique", coeff: 1.5, credits: 3 },
      { name: "Anglais Commercial & Tech", coeff: 1.5, credits: 4 },
    ]
  },
  eco: {
    label: "1ère Licence Sciences Économiques & Gestion",
    modules: [
      { name: "Microéconomie 1", coeff: 3, credits: 6 },
      { name: "Macroéconomie 1", coeff: 3, credits: 6 },
      { name: "Comptabilité Financière 1", coeff: 3, credits: 6 },
      { name: "Mathématiques pour l'Économie", coeff: 2.5, credits: 5 },
      { name: "Introduction au Droit", coeff: 1.5, credits: 3 },
      { name: "Anglais & Informatique", coeff: 1.5, credits: 4 },
    ]
  },
  info: {
    label: "1ère Licence Informatique (Sciences / FST / INSAT)",
    modules: [
      { name: "Programmation C / Python", coeff: 3.5, credits: 6 },
      { name: "Analyse Mathématique", coeff: 3, credits: 5 },
      { name: "Algèbre Linéaire", coeff: 2.5, credits: 5 },
      { name: "Logique & Circuits Numériques", coeff: 2.5, credits: 5 },
      { name: "Physique & Électronique", coeff: 2, credits: 4 },
      { name: "Anglais & Communication", coeff: 1.5, credits: 5 },
    ]
  }
};

interface GradeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradeCalculatorModal: React.FC<GradeCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('lig');
  const [activeTab, setActiveTab] = useState<'calc' | 'guide'>('calc');

  // Load modules according to preset
  const [modules, setModules] = useState<ModuleItem[]>(() => {
    return PRESETS.lig.modules.map((m, i) => ({
      ...m,
      id: `mod-${i}`,
      noteDs: '',
      noteExam: ''
    }));
  });

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    if (key !== 'custom' && PRESETS[key]) {
      setModules(
        PRESETS[key].modules.map((m, i) => ({
          ...m,
          id: `mod-${Date.now()}-${i}`,
          noteDs: '',
          noteExam: ''
        }))
      );
    }
  };

  const handleAddModule = () => {
    setModules(prev => [
      ...prev,
      {
        id: `mod-${Date.now()}`,
        name: `Matière ${prev.length + 1}`,
        coeff: 2,
        credits: 4,
        noteDs: '',
        noteExam: ''
      }
    ]);
  };

  const handleRemoveModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateModule = (id: string, field: keyof ModuleItem, value: any) => {
    setModules(prev => prev.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleReset = () => {
    setModules(prev => prev.map(m => ({ ...m, noteDs: '', noteExam: '' })));
  };

  // Calculations for Tunisian LMD system: DS 30% + Examen 70%
  const results = useMemo(() => {
    let totalWeightedPoints = 0;
    let totalCoeff = 0;
    let validatedCredits = 0;
    let totalCredits = 0;
    let modulesFilledCount = 0;

    const moduleCalculations = modules.map(m => {
      const ds = parseFloat(m.noteDs.replace(',', '.'));
      const exam = parseFloat(m.noteExam.replace(',', '.'));

      let avg: number | null = null;
      if (!isNaN(ds) && !isNaN(exam)) {
        avg = ds * 0.3 + exam * 0.7;
      } else if (!isNaN(exam)) {
        // If only exam is given
        avg = exam;
      } else if (!isNaN(ds)) {
        avg = ds;
      }

      if (avg !== null) {
        modulesFilledCount++;
        totalWeightedPoints += avg * m.coeff;
        totalCoeff += m.coeff;
        if (avg >= 10) {
          validatedCredits += m.credits;
        }
      }
      totalCredits += m.credits;

      return {
        id: m.id,
        avg
      };
    });

    const generalAverage = totalCoeff > 0 ? totalWeightedPoints / totalCoeff : null;

    let mention = '';
    if (generalAverage !== null) {
      if (generalAverage >= 16) mention = 'Très Bien';
      else if (generalAverage >= 14) mention = 'Bien';
      else if (generalAverage >= 12) mention = 'Assez Bien';
      else if (generalAverage >= 10) mention = 'Passable (Admis)';
      else mention = 'Rattrapage (Session de Contrôle)';
    }

    return {
      moduleCalculations,
      generalAverage,
      totalCoeff,
      validatedCredits,
      totalCredits,
      modulesFilledCount,
      mention
    };
  }, [modules]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Calculateur de Moyenne & Crédits LMD
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  🇹🇳 Tunisie
                </span>
              </div>
              <p className="text-xs text-red-100">
                Formule officielle des universités tunisiennes : DS (30%) + Examen (70%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 flex gap-4 bg-slate-50">
          <button
            onClick={() => setActiveTab('calc')}
            className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'calc'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculer mes Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guide des Examens & Rachat LMD TN</span>
          </button>
        </div>

        {activeTab === 'calc' ? (
          <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Presets Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50/60 p-3.5 rounded-xl border border-red-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Choisir une filière pré-configurée :
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRESETS).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectPreset(key)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedPreset === key
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleSelectPreset('custom')}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedPreset === 'custom'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Personnalisé
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-600 hover:text-red-600 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1.5 rounded-md border border-slate-200 shadow-2xs self-end sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Effacer les notes</span>
              </button>
            </div>

            {/* Results Score Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Moyenne Générale
                </span>
                <div className="my-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {results.generalAverage !== null ? results.generalAverage.toFixed(2) : '--.--'}
                  </span>
                  <span className="text-xs text-slate-400">/ 20</span>
                </div>
                <div className="text-[11px] font-semibold text-red-400">
                  {results.modulesFilledCount > 0 ? results.mention : 'Entrez vos notes DS et Examen'}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Crédits LMD Validés
                </span>
                <div className="my-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {results.validatedCredits}
                  </span>
                  <span className="text-xs text-slate-500">/ {results.totalCredits} Crédits</span>
                </div>
                <span className="text-[11px] text-slate-600">
                  {results.validatedCredits >= 30 
                    ? '🎉 Semestre complet validé !' 
                    : `${30 - results.validatedCredits} crédits restants`}
                </span>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                results.generalAverage !== null && results.generalAverage >= 10
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Décision Semestre
                </span>
                <div className="my-1 text-base font-extrabold flex items-center gap-1.5">
                  {results.generalAverage !== null && results.generalAverage >= 10 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Admis (Session Principale)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>{results.generalAverage === null ? 'En attente' : 'Session Contrôle'}</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] opacity-80">
                  {results.generalAverage !== null && results.generalAverage >= 10
                    ? 'Félicitations ! Semestre validé avec succès.'
                    : 'Rachat possible si moyenne annuelle ≥ 10.00'}
                </span>
              </div>
            </div>

            {/* Modules Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3 w-5/12">Matière / Module</th>
                      <th className="p-3 w-1/12 text-center">Coeff</th>
                      <th className="p-3 w-1/12 text-center">Crédits</th>
                      <th className="p-3 w-2/12 text-center">Note DS (30%)</th>
                      <th className="p-3 w-2/12 text-center">Note Examen (70%)</th>
                      <th className="p-3 w-2/12 text-center">Moyenne</th>
                      <th className="p-3 w-1/12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {modules.map((m, idx) => {
                      const modCalc = results.moduleCalculations.find(c => c.id === m.id);
                      const avg = modCalc?.avg;
                      const isPassing = avg !== null && avg !== undefined && avg >= 10;

                      return (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-800">
                            {selectedPreset === 'custom' ? (
                              <input
                                type="text"
                                value={m.name}
                                onChange={(e) => handleUpdateModule(m.id, 'name', e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-red-500"
                              />
                            ) : (
                              <span>{m.name}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {selectedPreset === 'custom' ? (
                              <input
                                type="number"
                                step="0.5"
                                min="0.5"
                                max="10"
                                value={m.coeff}
                                onChange={(e) => handleUpdateModule(m.id, 'coeff', parseFloat(e.target.value) || 1)}
                                className="w-14 text-center px-1 py-1 bg-white border border-slate-200 rounded text-xs"
                              />
                            ) : (
                              <span className="font-bold text-slate-600">{m.coeff}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {selectedPreset === 'custom' ? (
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={m.credits}
                                onChange={(e) => handleUpdateModule(m.id, 'credits', parseInt(e.target.value) || 1)}
                                className="w-14 text-center px-1 py-1 bg-white border border-slate-200 rounded text-xs"
                              />
                            ) : (
                              <span className="font-bold text-slate-600">{m.credits}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              placeholder="ex: 13.5"
                              value={m.noteDs}
                              onChange={(e) => handleUpdateModule(m.id, 'noteDs', e.target.value)}
                              className="w-20 text-center px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              placeholder="ex: 11.0"
                              value={m.noteExam}
                              onChange={(e) => handleUpdateModule(m.id, 'noteExam', e.target.value)}
                              className="w-20 text-center px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </td>
                          <td className="p-3 text-center">
                            {avg !== null && avg !== undefined ? (
                              <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-xs ${
                                isPassing 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {avg.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400">--</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {selectedPreset === 'custom' && (
                              <button
                                onClick={() => handleRemoveModule(m.id)}
                                className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                                title="Supprimer matière"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {selectedPreset === 'custom' && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={handleAddModule}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer px-2 py-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une matière</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Guide Tab */
          <div className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-2">
              <h4 className="font-extrabold text-red-950 flex items-center gap-2 text-sm">
                <GraduationCap className="w-5 h-5 text-red-600" />
                <span>Comment fonctionne le calcul des moyennes universitaires en Tunisie ?</span>
              </h4>
              <p className="text-slate-700">
                Dans le système <strong>LMD tunisien</strong> (Licence, Mastère, Doctorat) appliqué dans toutes les universités (ISG, INSAT, IHEC, FST, ESEN, FMT, etc.), chaque matière comporte deux évaluations principales :
              </p>
              <ul className="list-disc pl-5 space-y-1 font-semibold text-slate-800">
                <li><strong>Le Devoir Surveillé (DS) / Contrôle Continu :</strong> compte pour <strong>30%</strong> de la note finale.</li>
                <li><strong>L'Examen Final (Session Principale / Contrôle) :</strong> compte pour <strong>70%</strong> de la note finale.</li>
                <li><strong>Formule :</strong> <code>Moyenne Module = (Note DS × 0.3) + (Note Examen × 0.7)</code></li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Validation par Crédits (30 Crédits)</span>
                </h5>
                <p className="text-xs text-slate-600">
                  Un semestre compte <strong>30 crédits LMD</strong> (60 crédits par an). Dès qu'un module obtient une moyenne supérieure ou égale à <strong>10.00 / 20</strong>, ses crédits sont définitivement acquis et capitalisés, même si la moyenne générale du semestre est inférieure à 10.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>La Règle de Compensation (Rachat)</span>
                </h5>
                <p className="text-xs text-slate-600">
                  Si un étudiant a une note inférieure à 10 dans un module mais que sa <strong>moyenne générale annuelle (Semestre 1 + Semestre 2) est ≥ 10.00 / 20</strong>, il est <strong>Admis par compensation</strong> et valide l'intégralité de ses 60 crédits de l'année.
                </p>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl text-xs space-y-2">
              <h5 className="font-bold text-slate-800">💡 Conseil pour les Révisions CoursShare :</h5>
              <p className="text-slate-600">
                Puisque l'examen pèse <strong>70% de la note</strong>, concentrez vos révisions sur les <strong>Examens Corrigés des années précédentes</strong> de votre faculté. C'est le moyen le plus efficace de sécuriser une note supérieure à 12/20 !
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            CoursShare Tunisie · Outil d'aide académique pour les étudiants LMD
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
