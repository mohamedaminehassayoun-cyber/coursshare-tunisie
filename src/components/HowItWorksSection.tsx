import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  UploadCloud, 
  Award, 
  ArrowRight, 
  ChevronDown, 
  Star, 
  Quote, 
  GraduationCap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { FAQS, TESTIMONIALS } from '../data/coursesData';

interface HowItWorksSectionProps {
  onOpenShareModal: () => void;
  onOpenContactModal: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onOpenShareModal,
  onOpenContactModal,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: 'Trouve',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      desc: 'Recherche par matière, code d’UE, diplôme (L1, L2, Master, CPGE, PASS) ou navigue parmi nos 5 catégories de documents.',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      step: '02',
      title: 'Révise',
      icon: <BookOpen className="w-6 h-6 text-teal-600" />,
      desc: 'Ouvre l’aperçu interactif, mémorise les points clés d’examens, ou télécharge le fichier complet en PDF pour réviser hors-connexion.',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      step: '03',
      title: 'Partage',
      icon: <UploadCloud className="w-6 h-6 text-orange-600" />,
      desc: 'Partage tes devoirs notés A+, résumés de chapitres ou fiches de formules pour soutenir les étudiants méritants de ta fac.',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      step: '04',
      title: 'Réussis',
      icon: <Award className="w-6 h-6 text-purple-600" />,
      desc: 'Améliore ta moyenne générale, sécurise tes partiels et décroche ta mention grâce à l’intelligence collective.',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="bg-slate-50 border-t border-slate-200">
      {/* How it works steps */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Méthode & Valeurs
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comment fonctionne CoursShare ?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Une boucle vertueuse où chaque étudiant bénéficie de l'expérience de ses pairs et contribue en retour.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-200 font-mono">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% accessible et sans frais</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Témoignages
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ce que disent les étudiants
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Des milliers d'étudiants en droit, éco-gestion, santé et prépa révisent chaque jour avec CoursShare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-black flex items-center justify-center text-sm shadow-xs">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-red-600 font-medium">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Questions Fréquentes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Foire Aux Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-700 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold">
            Tu possèdes d'excellents cours ou des fiches soignées ?
          </h3>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Rejoins notre communauté d'étudiants solidaires. Partage tes fiches en 1 minute et aide les promotions suivantes à réussir.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenShareModal}
              className="px-6 py-3 bg-white text-blue-800 hover:bg-blue-50 active:bg-blue-100 text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Partager un document maintenant</span>
            </button>
            <button
              onClick={onOpenContactModal}
              className="px-5 py-3 bg-blue-900/50 hover:bg-blue-900/80 text-white text-sm font-semibold rounded-xl border border-blue-400/30 transition-all cursor-pointer"
            >
              Demander un cours manquant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
