import { useState, useEffect, useMemo } from 'react';
import { X, Check, Ruler, Sparkles, RefreshCw, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import type { Product, UserBodyProfile, SizeRecommendation, OrderItem } from '../types';
import { predictSize, getEffectiveSizeChart } from '../lib/sizePredictor';
import { getUserBodyProfile, saveUserBodyProfile } from '../lib/userProfileService';
import { useAuth } from '../lib/authContext';

interface SizePredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSelectSize?: (size: string) => void;
  pastPurchases?: OrderItem[];
}

export default function SizePredictorModal({
  isOpen,
  onClose,
  product,
  onSelectSize,
  pastPurchases = [],
}: SizePredictorModalProps) {
  const auth = useAuth();
  const userId = auth?.user?.uid ?? null;

  const [step, setStep] = useState<'form' | 'result'>('form');
  const [heightCm, setHeightCm] = useState<number | ''>(175);
  const [weightKg, setWeightKg] = useState<number | ''>(70);
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>(
    product.gender === 'women' ? 'women' : 'men'
  );
  const [age, setAge] = useState<number | ''>('');
  const [bodyType, setBodyType] = useState<'slim' | 'regular' | 'athletic' | 'broad' | 'plus_size'>('regular');
  const [preferredFit, setPreferredFit] = useState<'slim' | 'regular' | 'relaxed' | 'oversized'>('regular');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load user body profile on mount/open
  useEffect(() => {
    if (isOpen) {
      getUserBodyProfile(userId).then((profile) => {
        if (profile) {
          if (profile.heightCm) setHeightCm(profile.heightCm);
          if (profile.weightKg) setWeightKg(profile.weightKg);
          if (profile.gender) setGender(profile.gender);
          if (profile.age) setAge(profile.age);
          if (profile.bodyType) setBodyType(profile.bodyType);
          if (profile.preferredFit) setPreferredFit(profile.preferredFit);
          // If we have height & weight already, show result right away
          if (profile.heightCm && profile.weightKg) {
            setStep('result');
          }
        }
      });
    }
  }, [isOpen, userId]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizeChart = useMemo(() => getEffectiveSizeChart(product), [product]);

  const currentProfile: UserBodyProfile = useMemo(
    () => ({
      heightCm: Number(heightCm) || 0,
      weightKg: Number(weightKg) || 0,
      gender,
      age: age ? Number(age) : undefined,
      bodyType,
      preferredFit,
    }),
    [heightCm, weightKg, gender, age, bodyType, preferredFit]
  );

  const recommendation: SizeRecommendation | null = useMemo(() => {
    if (!currentProfile.heightCm || !currentProfile.weightKg) return null;
    return predictSize(currentProfile, product, pastPurchases);
  }, [currentProfile, product, pastPurchases]);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heightCm || !weightKg || Number(heightCm) <= 0 || Number(weightKg) <= 0) return;
    saveUserBodyProfile(currentProfile, userId);
    setStep('result');
  };

  const handleApplySize = (sz: string) => {
    if (onSelectSize) {
      onSelectSize(sz);
    }
    onClose();
  };

  const handleSaveProfile = async () => {
    await saveUserBodyProfile(currentProfile, userId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 dark:border-ink-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gold-400/20 text-gold-600 dark:text-gold-400">
              <Ruler size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Smart Size Predictor</h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">Tailored fit recommendations for {product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-8 w-8 place-items-center rounded-full text-ink-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!sizeChart || sizeChart.length === 0 ? (
            <div className="py-10 text-center">
              <ShieldAlert size={40} className="mx-auto text-amber-500 mb-3" />
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">Size Recommendation Unavailable</h3>
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 max-w-sm mx-auto">
                Detailed size chart is not available for this item category ({product.category}). Please refer to general standard sizing or contact customer care.
              </p>
              <button onClick={onClose} className="mt-6 btn-outline text-xs">
                Close
              </button>
            </div>
          ) : step === 'form' ? (
            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Measurements row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    required
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 175"
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm font-medium text-ink-900 dark:text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 70"
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm font-medium text-ink-900 dark:text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Gender & Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-ink-800 px-3 py-2.5 text-sm font-medium text-ink-900 dark:text-white focus:border-gold-400 focus:outline-none"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5">
                    Age <span className="text-ink-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 28"
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm font-medium text-ink-900 dark:text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-2">
                  Body Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'slim', label: 'Slim' },
                    { id: 'regular', label: 'Regular' },
                    { id: 'athletic', label: 'Athletic' },
                    { id: 'broad', label: 'Broad' },
                    { id: 'plus_size', label: 'Plus Size' },
                  ].map((bt) => (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => setBodyType(bt.id as any)}
                      className={`rounded-xl border py-2 px-1 text-center text-xs font-semibold transition-all ${
                        bodyType === bt.id
                          ? 'border-gold-400 bg-gold-400/10 text-gold-600 dark:text-gold-400'
                          : 'border-black/10 dark:border-white/15 text-ink-600 dark:text-ink-300 hover:border-black/30'
                      }`}
                    >
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Fit */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-2">
                  Preferred Fit
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'slim', label: 'Slim Fit' },
                    { id: 'regular', label: 'Regular Fit' },
                    { id: 'relaxed', label: 'Relaxed Fit' },
                    { id: 'oversized', label: 'Oversized' },
                  ].map((pf) => (
                    <button
                      key={pf.id}
                      type="button"
                      onClick={() => setPreferredFit(pf.id as any)}
                      className={`rounded-xl border py-2 px-2 text-center text-xs font-semibold transition-all ${
                        preferredFit === pf.id
                          ? 'border-gold-400 bg-gold-400/10 text-gold-600 dark:text-gold-400'
                          : 'border-black/10 dark:border-white/15 text-ink-600 dark:text-ink-300 hover:border-black/30'
                      }`}
                    >
                      {pf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button type="submit" className="btn-dark w-full py-3 text-sm">
                  <Sparkles size={16} /> Predict My Size
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Recommendation Card */}
              {recommendation ? (
                <div className="rounded-2xl bg-gradient-to-br from-gold-400/10 via-amber-500/5 to-transparent border border-gold-400/30 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                        Recommended Size
                      </span>
                      <div className="mt-1 flex items-baseline gap-3">
                        <span className="font-display text-4xl font-extrabold text-ink-900 dark:text-white">
                          {recommendation.recommendedSize}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                            recommendation.confidence === 'High'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : recommendation.confidence === 'Medium'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {recommendation.confidence} Confidence
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplySize(recommendation.recommendedSize)}
                      className="btn-gold py-2.5 px-4 text-xs font-bold"
                    >
                      Apply Size {recommendation.recommendedSize} <ArrowRight size={14} />
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-ink-700 dark:text-ink-200">
                    {recommendation.reason}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-red-500">
                  Please check your input values to calculate a recommendation.
                </div>
              )}

              {/* Garment vs Body Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
                  Size Chart & Measurement Comparison
                </h4>
                <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 border-b border-black/10 dark:border-white/10 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Chest (cm)</th>
                        <th className="p-2.5">Waist (cm)</th>
                        <th className="p-2.5">Hip (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {/* Estimated User Body Row */}
                      {recommendation && (
                        <tr className="bg-gold-400/10 font-semibold text-gold-600 dark:text-gold-400">
                          <td className="p-2.5">Your Estimate</td>
                          <td className="p-2.5">{recommendation.bodyEstimates.estimatedChestCm}</td>
                          <td className="p-2.5">{recommendation.bodyEstimates.estimatedWaistCm}</td>
                          <td className="p-2.5">{recommendation.bodyEstimates.estimatedHipCm}</td>
                        </tr>
                      )}
                      {/* Chart Rows */}
                      {sizeChart.map((entry) => {
                        const isMatch = recommendation?.recommendedSize === entry.size;
                        return (
                          <tr
                            key={entry.size}
                            className={`transition-colors ${
                              isMatch ? 'bg-black/5 dark:bg-white/10 font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                          >
                            <td className="p-2.5 flex items-center gap-1.5">
                              {entry.size}
                              {isMatch && <Check size={13} className="text-gold-500" />}
                            </td>
                            <td className="p-2.5">{entry.chest ?? '-'}</td>
                            <td className="p-2.5">{entry.waist ?? '-'}</td>
                            <td className="p-2.5">{entry.hip ?? '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white"
                >
                  <RefreshCw size={14} /> Try Another Measurement
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 dark:text-gold-400 hover:underline"
                >
                  {savedSuccess ? (
                    <>
                      <Check size={14} /> Saved to Profile!
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} /> Save Profile to Account
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
