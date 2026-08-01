import type { Product, SizeChartEntry, SizeRecommendation, UserBodyProfile, OrderItem } from '../types';

export const STANDARD_MENS_SIZE_CHART: SizeChartEntry[] = [
  { size: 'XS', chest: 88, waist: 72, hip: 89, length: 68, sleeve: 60 },
  { size: 'S', chest: 94, waist: 77, hip: 94, length: 70, sleeve: 62 },
  { size: 'M', chest: 100, waist: 83, hip: 100, length: 72, sleeve: 64 },
  { size: 'L', chest: 106, waist: 89, hip: 106, length: 74, sleeve: 65 },
  { size: 'XL', chest: 112, waist: 95, hip: 112, length: 76, sleeve: 66 },
  { size: 'XXL', chest: 118, waist: 101, hip: 118, length: 78, sleeve: 67 },
];

export const STANDARD_WOMENS_SIZE_CHART: SizeChartEntry[] = [
  { size: 'XS', chest: 82, waist: 64, hip: 88, length: 62, sleeve: 57 },
  { size: 'S', chest: 87, waist: 69, hip: 93, length: 64, sleeve: 58 },
  { size: 'M', chest: 92, waist: 74, hip: 98, length: 66, sleeve: 59 },
  { size: 'L', chest: 98, waist: 80, hip: 104, length: 68, sleeve: 60 },
  { size: 'XL', chest: 104, waist: 86, hip: 110, length: 70, sleeve: 61 },
  { size: 'XXL', chest: 110, waist: 92, hip: 116, length: 72, sleeve: 62 },
];

/**
 * Returns effective size chart for product or default standard chart if apparel.
 */
export function getEffectiveSizeChart(product: Product): SizeChartEntry[] | null {
  // If product explicitly defines a size chart and it's non-empty
  if (product.sizeChart && product.sizeChart.length > 0) {
    return product.sizeChart;
  }

  // Check if product is clothing
  const isClothing = product.category === 'men' || product.category === 'women';
  const hasClothingSizes = product.sizes.some((s) => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(s.toUpperCase()));

  if (!isClothing && !hasClothingSizes) {
    return null; // Shoes, bags, accessories without clothing size charts
  }

  // Fallback to standard chart based on gender/category
  if (product.gender === 'women' || product.category === 'women') {
    return STANDARD_WOMENS_SIZE_CHART.filter((entry) => product.sizes.includes(entry.size));
  }

  return STANDARD_MENS_SIZE_CHART.filter((entry) => product.sizes.includes(entry.size));
}

/**
 * Predicts optimal size based on user measurements, fit preference, and product size chart.
 */
export function predictSize(
  profile: UserBodyProfile,
  product: Product,
  pastPurchases: OrderItem[] = []
): SizeRecommendation | null {
  const chart = getEffectiveSizeChart(product);
  if (!chart || chart.length === 0) {
    return null;
  }

  const height = profile.heightCm;
  const weight = profile.weightKg;

  if (!height || !weight || height <= 0 || weight <= 0) {
    return null;
  }

  const gender = profile.gender || product.gender || 'men';
  const bodyType = profile.bodyType || 'regular';
  const fitPref = profile.preferredFit || 'regular';

  // 1. Calculate base estimated body dimensions
  let baseChest = 0;
  let baseWaist = 0;
  let baseHip = 0;

  if (gender === 'women') {
    baseChest = 78 + (weight - 45) * 0.68 + (height - 155) * 0.18;
    baseWaist = 64 + (weight - 45) * 0.72;
    baseHip = baseWaist + 24;
  } else if (gender === 'men') {
    baseChest = 80 + (weight - 50) * 0.72 + (height - 160) * 0.22;
    baseWaist = 68 + (weight - 50) * 0.78;
    baseHip = baseWaist + 16;
  } else {
    // Unisex
    baseChest = 79 + (weight - 47) * 0.70 + (height - 157) * 0.20;
    baseWaist = 66 + (weight - 47) * 0.75;
    baseHip = baseWaist + 20;
  }

  // 2. Adjust for Body Type
  switch (bodyType) {
    case 'slim':
      baseChest -= 2;
      baseWaist -= 3;
      baseHip -= 2;
      break;
    case 'athletic':
      baseChest += 4;
      baseWaist -= 2;
      break;
    case 'broad':
      baseChest += 5;
      baseWaist += 3;
      baseHip += 3;
      break;
    case 'plus_size':
      baseChest += 8;
      baseWaist += 8;
      baseHip += 8;
      break;
    case 'regular':
    default:
      break;
  }

  const estimatedChest = Math.round(baseChest);
  const estimatedWaist = Math.round(baseWaist);
  const estimatedHip = Math.round(baseHip);

  // 3. Desired garment ease target based on fit preference
  let easeRequired = 4; // default regular fit ease
  switch (fitPref) {
    case 'slim':
      easeRequired = 2;
      break;
    case 'regular':
      easeRequired = 5;
      break;
    case 'relaxed':
      easeRequired = 9;
      break;
    case 'oversized':
      easeRequired = 13;
      break;
  }

  const targetGarmentChest = estimatedChest + easeRequired;

  // 4. Past purchase influence
  const pastSizesForCategory = pastPurchases
    .filter((item) => item.size && ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(item.size.toUpperCase()))
    .map((item) => item.size.toUpperCase());

  // Count past size occurrences
  const pastSizeCounts: Record<string, number> = {};
  pastSizesForCategory.forEach((sz) => {
    pastSizeCounts[sz] = (pastSizeCounts[sz] || 0) + 1;
  });

  // 5. Evaluate best matching size in chart
  let bestEntry = chart[0];
  let minScore = Infinity;

  for (const entry of chart) {
    const garmentChest = entry.chest || 100;
    const garmentWaist = entry.waist || 80;

    let chestDiff = Math.abs(garmentChest - targetGarmentChest);

    // If waist is significantly tight relative to estimated waist, penalize
    if (garmentWaist < estimatedWaist + 1) {
      chestDiff += (estimatedWaist + 1 - garmentWaist) * 1.5;
    }

    // Past purchase discount factor
    const pastBonus = pastSizeCounts[entry.size] ? pastSizeCounts[entry.size] * 1.5 : 0;
    const finalScore = chestDiff - pastBonus;

    if (finalScore < minScore) {
      minScore = finalScore;
      bestEntry = entry;
    }
  }

  // 6. Compute Confidence
  let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
  const chestMatchDiff = Math.abs((bestEntry.chest || 100) - targetGarmentChest);
  const hasDetailedChart = Boolean(bestEntry.chest && bestEntry.waist);

  if (hasDetailedChart && chestMatchDiff <= 3) {
    confidence = 'High';
  } else if (chestMatchDiff > 8) {
    confidence = 'Low';
  } else {
    confidence = 'Medium';
  }

  // If user has past orders matching bestEntry size, boost confidence to High
  if (pastSizeCounts[bestEntry.size] && pastSizeCounts[bestEntry.size] >= 1) {
    confidence = 'High';
  }

  // 7. Formulate Reason Narrative
  const fitLabelMap: Record<string, string> = {
    slim: 'Slim Fit',
    regular: 'Regular Fit',
    relaxed: 'Relaxed Fit',
    oversized: 'Oversized Fit',
  };

  const bodyTypeLabelMap: Record<string, string> = {
    slim: 'Slim build',
    regular: 'Regular build',
    athletic: 'Athletic V-shape build',
    broad: 'Broad shoulders',
    plus_size: 'Plus Size',
  };

  let reason = `Recommended size ${bestEntry.size} based on height (${height} cm), weight (${weight} kg), ${bodyTypeLabelMap[bodyType]}, and a preference for ${fitLabelMap[fitPref]}.`;
  if (bestEntry.chest) {
    reason += ` Matches your estimated chest (${estimatedChest} cm) with optimal garment width (${bestEntry.chest} cm).`;
  }
  if (pastSizeCounts[bestEntry.size]) {
    reason += ` Aligns with your past purchase history (${bestEntry.size}).`;
  }

  return {
    recommendedSize: bestEntry.size,
    confidence,
    reason,
    bodyEstimates: {
      estimatedChestCm: estimatedChest,
      estimatedWaistCm: estimatedWaist,
      estimatedHipCm: estimatedHip,
    },
  };
}
