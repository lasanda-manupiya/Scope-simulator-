const CURRENT_YEAR = 2024;
const SCOPE12_2030_TARGET = 4.51;
const SCOPE3_2022_BASELINE = 871.47;
const SCOPE3_2030_PLANNING_TARGET = 505.45;
const SIMULATION_YEAR = CURRENT_YEAR + 1;

const data = {
  scope1: { 2019: 1.09, 2020: 7.25, 2021: 4.79, 2022: 6.05, 2023: 4.84, 2024: 3.68 },
  scope2: { 2019: 1.56, 2020: 2.32, 2021: 2.54, 2022: 1.75, 2023: 1.77, 2024: 1.65 },
  scope12Totals: { 2019: 2.65, 2020: 9.57, 2021: 7.33, 2022: 7.80, 2023: 6.61, 2024: 5.33 },
  scope12Pathway: { 2022: 6.95, 2023: 6.58, 2024: 6.24, 2025: 5.91, 2026: 5.60, 2027: 5.30, 2028: 5.03, 2029: 4.76, 2030: 4.51 },
  scope3Categories: {
    "Manufacturing and Processing": { 2019: 0, 2020: 0, 2021: 0, 2022: 278.13, 2023: 302.80, 2024: 458.13 },
    "Raw Materials Procurement": { 2019: 0, 2020: 0, 2021: 0, 2022: 244.21, 2023: 265.87, 2024: 402.25 },
    "Transportation to the UK, Road": { 2019: 0, 2020: 0, 2021: 8.72, 2022: 9.02, 2023: 12.86, 2024: 21.76 },
    "Transportation to the UK, Rail": { 2019: 0, 2020: 0, 2021: 0.41, 2022: 3.08, 2023: 2.90, 2024: 3.92 },
    "Transportation to the UK, Ship": { 2019: 0, 2020: 0, 2021: 0.01, 2022: 0.02, 2023: 0.02, 2024: 0.03 },
    "Warehouse and Storage": { 2019: 0, 2020: 0, 2021: 0, 2022: 7.40, 2023: 7.87, 2024: 7.69 },
    "Packaging": { 2019: 0, 2020: 0, 2021: 0, 2022: 134.77, 2023: 146.72, 2024: 221.98 },
    "Shipment and Distribution": { 2019: 0, 2020: 0, 2021: 0, 2022: 73.40, 2023: 79.90, 2024: 121.00 },
    "End of Life Waste Management": { 2019: 0, 2020: 0, 2021: 0, 2022: 112.88, 2023: 122.89, 2024: 185.93 },
    "Business Travel Air": { 2019: 1.69, 2020: 0, 2021: 1.52, 2022: 2.10, 2023: 3.34, 2024: 2.07 },
    "Business Travel Land": { 2019: 0.10, 2020: 0, 2021: 1.16, 2022: 1.16, 2023: 1.16, 2024: 0.80 },
    "Business Travel Rail": { 2019: 2.10, 2020: 0.20, 2021: 0.34, 2022: 0.06, 2023: 0.06, 2024: 0.07 },
    "Employee Commuting": { 2019: 22.60, 2020: 19.38, 2021: 7.35, 2022: 5.24, 2023: 4.14, 2024: 3.31 }
  },
  scope3Totals: { 2019: 26.49, 2020: 19.58, 2021: 19.51, 2022: 871.47, 2023: 950.53, 2024: 1428.93 },
  productionVolumes: { 2022: 1563420, 2023: 1702090, 2024: 2575210 }
};

const productionLinkedCategories = [
  "Manufacturing and Processing",
  "Raw Materials Procurement",
  "Packaging",
  "Shipment and Distribution",
  "End of Life Waste Management",
  "Transportation to the UK, Road",
  "Transportation to the UK, Rail",
  "Transportation to the UK, Ship"
];

const logisticsCategories = [
  "Transportation to the UK, Road",
  "Transportation to the UK, Rail",
  "Transportation to the UK, Ship",
  "Shipment and Distribution"
];

const reductionGroups = [
  {
    key: "manufacturing",
    title: "Manufacturing and Processing",
    baseline: 458.13,
    cap: 80,
    categories: ["Manufacturing and Processing"],
    levers: [
      { id: "manufacturingEnergyEfficiency", label: "Factory energy efficiency improvement", max: 40 },
      { id: "manufacturingRenewables", label: "Supplier renewable electricity transition", max: 40 },
      { id: "manufacturingProcessOptimisation", label: "Process optimisation and waste reduction", max: 30 },
      { id: "manufacturingTechnology", label: "Lower impact production technology", max: 30 }
    ]
  },
  {
    key: "rawMaterials",
    title: "Raw Materials Procurement",
    baseline: 402.25,
    cap: 75,
    categories: ["Raw Materials Procurement"],
    levers: [
      { id: "rawMaterialSubstitution", label: "Lower impact raw material substitution", max: 40 },
      { id: "rawSupplierReduction", label: "Supplier emissions reduction", max: 40 },
      { id: "rawCertifiedContent", label: "Recycled or certified material content", max: 35 },
      { id: "rawMaterialEfficiency", label: "Material efficiency per product", max: 30 }
    ]
  },
  {
    key: "packaging",
    title: "Packaging",
    baseline: 221.98,
    cap: 80,
    categories: ["Packaging"],
    levers: [
      { id: "packagingWeightReduction", label: "Cardboard weight reduction", max: 35 },
      { id: "packagingRecycledContent", label: "Recycled cardboard content", max: 40 },
      { id: "packagingSizeOptimisation", label: "Packaging size optimisation", max: 30 },
      { id: "packagingSecondaryRemoval", label: "Removal of unnecessary secondary packaging", max: 25 },
      { id: "packagingSupplierImprovement", label: "Supplier packaging process improvement", max: 30 }
    ]
  },
  {
    key: "logistics",
    title: "Logistics",
    baseline: 146.71,
    cap: 70,
    categories: logisticsCategories,
    levers: [
      { id: "logisticsRouteOptimisation", label: "Route optimisation", max: 25 },
      { id: "logisticsLoadConsolidation", label: "Load consolidation", max: 25 },
      { id: "logisticsModalShift", label: "Shift from road to lower emission transport", max: 35 },
      { id: "logisticsDeliveryPartners", label: "Lower emission delivery partners", max: 40 },
      { id: "logisticsRegionalDistribution", label: "Regional distribution optimisation", max: 25 }
    ]
  },
  {
    key: "endOfLife",
    title: "End of Life Waste Management",
    baseline: 185.93,
    cap: 75,
    categories: ["End of Life Waste Management"],
    levers: [
      { id: "eolRecyclability", label: "Improved recyclability", max: 35 },
      { id: "eolLowerImpactDesign", label: "Compostable or lower impact material design", max: 40 },
      { id: "eolDisposalGuidance", label: "Consumer disposal guidance", max: 20 },
      { id: "eolTreatmentImprovement", label: "Waste treatment improvement", max: 35 },
      { id: "eolPackagingImprovement", label: "Packaging end of life improvement", max: 25 }
    ]
  },
  {
    key: "operations",
    title: "Scope 1 and Scope 2 Operational Emissions",
    baseline: 5.33,
    cap: 90,
    categories: [],
    levers: [
      { id: "opsHeatingEfficiency", label: "Heating efficiency", max: 40 },
      { id: "opsReducedGas", label: "Reduced gas heating use", max: 50 },
      { id: "opsOfficeEfficiency", label: "Office energy efficiency", max: 35 },
      { id: "opsElectricityDemand", label: "Reduced electricity demand", max: 30 },
      { id: "opsSharedOffice", label: "Shared office or lower operational footprint", max: 60 }
    ]
  }
];

const chartPalette = ["#12304d", "#2563eb", "#14b8a6", "#22c55e", "#7c3aed", "#f59e0b", "#0f766e", "#38bdf8", "#84cc16", "#f97316", "#64748b", "#06b6d4", "#a855f7"];
const charts = {};

function formatNumber(value, decimals = 2) {
  return Number(value).toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function calculateTotals() {
  const currentScope12 = data.scope12Totals[CURRENT_YEAR];
  const scope3Latest = data.scope3Totals[CURRENT_YEAR];
  const categories2024 = Object.entries(data.scope3Categories)
    .map(([category, values]) => ({ category, value: values[CURRENT_YEAR] }))
    .sort((a, b) => b.value - a.value);

  return {
    currentScope12,
    scope12Latest: currentScope12,
    scope3Latest,
    total2024: currentScope12 + scope3Latest,
    categories2024,
    largestScope3Category: categories2024[0]
  };
}

function calculateScopeShares() {
  const total = data.scope3Totals[CURRENT_YEAR];
  return Object.entries(data.scope3Categories)
    .map(([category, values]) => ({ category, value: values[CURRENT_YEAR], share: (values[CURRENT_YEAR] / total) * 100 }))
    .sort((a, b) => b.value - a.value);
}

function calculateProductionIntensity() {
  const productionVolume = data.productionVolumes[CURRENT_YEAR];
  const rows = productionLinkedCategories.map((category) => {
    const emissions = data.scope3Categories[category][CURRENT_YEAR];
    const tonnesPerBox = emissions / productionVolume;
    return { category, emissions, tonnesPerBox, kgPerBox: tonnesPerBox * 1000 };
  });

  return {
    productionVolume,
    linkedEmissions: rows.reduce((sum, row) => sum + row.emissions, 0),
    rows
  };
}

function calculateCombinedReduction(values, cap) {
  const remainingFactor = values.reduce((factor, value) => factor * (1 - value / 100), 1);
  return Math.min((1 - remainingFactor) * 100, cap);
}

function getLeverValue(leverId) {
  const input = document.getElementById(leverId);
  return input ? Number(input.value) : 0;
}

function getReductionSummary() {
  return reductionGroups.reduce((summary, group) => {
    const values = group.levers.map((lever) => getLeverValue(lever.id));
    const combinedReduction = calculateCombinedReduction(values, group.cap);
    const bestLever = group.levers.reduce((best, lever) => {
      const value = getLeverValue(lever.id);
      return value > best.value ? { label: lever.label, value } : best;
    }, { label: "No lever selected", value: 0 });

    summary[group.key] = { values, combinedReduction, bestLever };
    return summary;
  }, {});
}

function reductionForCategory(category, reductions) {
  const group = reductionGroups.find((item) => item.categories.includes(category));
  return group ? reductions[group.key].combinedReduction : 0;
}

function runScenario() {
  const productionGrowth = Number(document.getElementById("productionGrowth")?.value ?? 10);
  const productionGrowthFactor = 1 + productionGrowth / 100;
  const reductions = getReductionSummary();
  const projectedCategories = {};
  const growthOnlyCategories = {};

  Object.entries(data.scope3Categories).forEach(([category, yearlyValues]) => {
    const baseEmissions = yearlyValues[CURRENT_YEAR];
    const growsWithProduction = productionLinkedCategories.includes(category);
    const growthAdjusted = growsWithProduction ? baseEmissions * productionGrowthFactor : baseEmissions;
    const reduction = reductionForCategory(category, reductions);

    growthOnlyCategories[category] = growthAdjusted;
    projectedCategories[category] = growthAdjusted * (1 - reduction / 100);
  });

  const projectedScope3 = Object.values(projectedCategories).reduce((sum, value) => sum + value, 0);
  const growthOnlyScope3 = Object.values(growthOnlyCategories).reduce((sum, value) => sum + value, 0);
  const operationalReduction = reductions.operations.combinedReduction;
  const projectedScope12 = data.scope12Totals[CURRENT_YEAR] * (1 - operationalReduction / 100);
  const growthOnlyTotal = data.scope12Totals[CURRENT_YEAR] + growthOnlyScope3;
  const projectedTotal = projectedScope12 + projectedScope3;
  const total2024 = data.scope12Totals[CURRENT_YEAR] + data.scope3Totals[CURRENT_YEAR];
  const emissionsSaved = Math.max(growthOnlyTotal - projectedTotal, 0);
  const changeVs2024 = projectedTotal - total2024;

  const scope12Gap = Math.max(projectedScope12 - SCOPE12_2030_TARGET, 0);
  const scope12RequiredReduction = projectedScope12 > 0 ? (scope12Gap / projectedScope12) * 100 : 0;
  const scope3Gap = Math.max(projectedScope3 - SCOPE3_2030_PLANNING_TARGET, 0);
  const scope3RequiredReduction = projectedScope3 > 0 ? (scope3Gap / projectedScope3) * 100 : 0;
  const projectedCategoryList = Object.entries(projectedCategories)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  const packagingBeforeReduction = growthOnlyCategories.Packaging;
  const packagingAfterReduction = projectedCategories.Packaging;
  const projectedProduction = data.productionVolumes[CURRENT_YEAR] * productionGrowthFactor;

  return {
    productionGrowth,
    productionGrowthFactor,
    reductions,
    projectedProduction,
    projectedCategories,
    growthOnlyCategories,
    projectedCategoryList,
    projectedScope3,
    growthOnlyScope3,
    projectedScope12,
    projectedTotal,
    emissionsSaved,
    changeVs2024,
    scope12Gap,
    scope12RequiredReduction,
    scope3Gap,
    scope3RequiredReduction,
    highestProjectedCategory: projectedCategoryList[0],
    packaging: {
      beforeReduction: packagingBeforeReduction,
      afterReduction: packagingAfterReduction,
      saved: packagingBeforeReduction - packagingAfterReduction,
      kgPerBoxBefore: (packagingBeforeReduction / projectedProduction) * 1000,
      kgPerBoxAfter: (packagingAfterReduction / projectedProduction) * 1000,
      bestLever: reductions.packaging.bestLever
    }
  };
}

function destroyChart(name) {
  if (charts[name]) {
    charts[name].destroy();
    delete charts[name];
  }
}

function createChart(name, canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;
  destroyChart(name);
  charts[name] = new Chart(canvas, config);
}

function baseChartOptions(extraOptions = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#334155", boxWidth: 14, font: { weight: "700" } } },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label || context.label}: ${formatNumber(context.parsed.y ?? context.parsed.x ?? context.parsed, 2)} tCO2e`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: { beginAtZero: true, grid: { color: "#e2e8f0" }, ticks: { color: "#64748b" } }
    },
    ...extraOptions
  };
}

function updateKPIs(scenario = runScenario()) {
  const totals = calculateTotals();
  const delta = totals.currentScope12 - data.scope12Pathway[CURRENT_YEAR];
  const ahead = delta <= 0;

  setText("kpiScope12", `${formatNumber(totals.scope12Latest)} tCO2e`);
  setText("kpiScope3", `${formatNumber(totals.scope3Latest)} tCO2e`);
  setText("kpiLargestCategory", totals.largestScope3Category.category);
  setText("kpiLargestCategoryValue", `${formatNumber(totals.largestScope3Category.value)} tCO2e in 2024`);
  setText("kpiTotal2024", `${formatNumber(totals.total2024)} tCO2e`);
  setText("kpiTarget2030", `${formatNumber(SCOPE12_2030_TARGET)} tCO2e`);
  setText("kpiPathwayStatus", ahead ? "Ahead of pathway" : "Behind pathway");
  setText("kpiPathwayDelta", `${formatNumber(Math.abs(delta))} tCO2e ${ahead ? "below" : "above"} the 2024 pathway`);
  setText("overviewProjectedScope3", `${formatNumber(scenario.projectedScope3)} tCO2e`);
  setText("overviewProjectedTotal", `${formatNumber(scenario.projectedTotal)} tCO2e`);
  setText("overviewEmissionsSaved", `${formatNumber(scenario.emissionsSaved)} tCO2e`);
  setText("overviewLargestRemaining", scenario.highestProjectedCategory.category);
  setText("sideLargestCategory", scenario.highestProjectedCategory.category);
  setText("sideLargestCategoryValue", `${formatNumber(scenario.highestProjectedCategory.value)} tCO2e remaining`);
  setText("sideScenarioHealth", scenario.scope3Gap > 0 ? "Further action needed" : "On planning track");
  setText("sideScenarioHealthText", scenario.scope3Gap > 0 ? `${formatNumber(scenario.scope3Gap)} tCO2e Scope 3 gap remains.` : "Scope 3 is within the planning benchmark.");

  const pill = document.getElementById("pathwayPill");
  if (pill) {
    pill.textContent = ahead ? "Ahead of 2024 pathway" : "Behind 2024 pathway";
    pill.classList.toggle("is-positive", ahead);
    pill.classList.toggle("is-warning", !ahead);
  }
}

function updateTotalsTable() {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const rows = years.map((year) => {
    const scope12 = data.scope12Totals[year];
    const scope3 = data.scope3Totals[year];
    return `<tr><td>${year}</td><td>${formatNumber(scope12)}</td><td>${formatNumber(scope3)}</td><td>${formatNumber(scope12 + scope3)}</td></tr>`;
  });
  const table = document.getElementById("totalsTable");
  if (table) table.innerHTML = rows.join("");
}

function updateIntensityTable(scenario = runScenario()) {
  const intensity = calculateProductionIntensity();
  setText("productionVolume2024", `${formatNumber(intensity.productionVolume, 0)} boxes`);
  setText("linkedEmissions2024", `${formatNumber(intensity.linkedEmissions)} tCO2e`);
  setText("intensityProjectedProduction", `${formatNumber(scenario.projectedProduction, 0)} boxes`);
  setText("intensityPackagingAfter", `${formatNumber(scenario.packaging.kgPerBoxAfter, 4)} kgCO2e`);

  const table = document.getElementById("intensityTable");
  if (table) {
    table.innerHTML = intensity.rows.map((row) => `
      <tr>
        <td>${row.category}</td>
        <td>${row.tonnesPerBox.toExponential(4)}</td>
        <td>${formatNumber(row.kgPerBox, 4)}</td>
      </tr>
    `).join("");
  }
}

function updateScenarioOutputs(scenario) {
  const changePrefix = scenario.changeVs2024 >= 0 ? "+" : "";
  setText("projectedProduction", `${formatNumber(scenario.projectedProduction, 0)} boxes`);
  setText("projectedScope3Before", `${formatNumber(scenario.growthOnlyScope3)} tCO2e`);
  setText("projectedScope3", `${formatNumber(scenario.projectedScope3)} tCO2e`);
  setText("projectedScope12", `${formatNumber(scenario.projectedScope12)} tCO2e`);
  setText("projectedTotal", `${formatNumber(scenario.projectedTotal)} tCO2e`);
  setText("changeVs2024", `${changePrefix}${formatNumber(scenario.changeVs2024)} tCO2e`);
  setText("emissionsSaved", `${formatNumber(scenario.emissionsSaved)} tCO2e`);
  setText("highestProjectedCategory", `${scenario.highestProjectedCategory.category} (${formatNumber(scenario.highestProjectedCategory.value)} tCO2e)`);
  setText("scope12Gap", `${formatNumber(scenario.scope12Gap)} tCO2e | ${formatNumber(scenario.scope12RequiredReduction)}% required`);
  setText("scope3Gap", `${formatNumber(scenario.scope3Gap)} tCO2e | ${formatNumber(scenario.scope3RequiredReduction)}% required`);
  setText("scope3GapDetail", `${formatNumber(scenario.scope3Gap)} tCO2e above 505.45 tCO2e (${formatNumber(scenario.scope3RequiredReduction)}% further reduction)`);
  setText("scope12GapDetail", `${formatNumber(scenario.scope12Gap)} tCO2e above 4.51 tCO2e (${formatNumber(scenario.scope12RequiredReduction)}% further reduction)`);
  setText("packagingProjected", `${formatNumber(scenario.packaging.afterReduction)} tCO2e`);
  setText("packagingSaved", `${formatNumber(scenario.packaging.saved)} tCO2e`);
  setText("packagingKgBefore", `${formatNumber(scenario.packaging.kgPerBoxBefore, 4)} kgCO2e`);
  setText("packagingKgAfter", `${formatNumber(scenario.packaging.kgPerBoxAfter, 4)} kgCO2e`);
  setText("packagingBestLever", scenario.packaging.bestLever.value > 0 ? `${scenario.packaging.bestLever.label} (${scenario.packaging.bestLever.value}%)` : "No lever selected");
  setText("gapAnalysis", `Projected Scope 1 and Scope 2 is ${formatNumber(scenario.scope12Gap)} tCO2e above the 2030 target of ${formatNumber(SCOPE12_2030_TARGET)} tCO2e, requiring ${formatNumber(scenario.scope12RequiredReduction)}% further reduction. Projected Scope 3 is ${formatNumber(scenario.scope3Gap)} tCO2e above the planning benchmark of ${formatNumber(SCOPE3_2030_PLANNING_TARGET)} tCO2e, requiring ${formatNumber(scenario.scope3RequiredReduction)}% further reduction. Scope 3 pathway is shown for planning and scenario analysis only. Formal SBTi requirements may depend on final target boundary, coverage and approved target wording.`);
}

function updateCharts(scenario = runScenario()) {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const simulationYearLabel = `${SIMULATION_YEAR} scenario`;
  const timelineLabels = [...years, simulationYearLabel];
  const scenarioCategoryOrder = [...scenario.projectedCategoryList];

  createChart("historical", "historicalChart", {
    type: "line",
    data: {
      labels: timelineLabels,
      datasets: [
        { label: "Scope 1", data: [...years.map((year) => data.scope1[year]), null], borderColor: "#12304d", backgroundColor: "rgba(18, 48, 77, 0.12)", tension: 0.35, pointRadius: 4 },
        { label: "Scope 2", data: [...years.map((year) => data.scope2[year]), null], borderColor: "#2563eb", backgroundColor: "rgba(37, 99, 235, 0.12)", tension: 0.35, pointRadius: 4 },
        { label: "Scope 3 actual", data: [...years.map((year) => data.scope3Totals[year]), null], borderColor: "#14b8a6", backgroundColor: "rgba(20, 184, 166, 0.12)", tension: 0.35, pointRadius: 4 },
        { label: "Scenario Scope 3 after levers", data: [...years.slice(0, -1).map(() => null), data.scope3Totals[CURRENT_YEAR], scenario.projectedScope3], borderColor: "#f59e0b", backgroundColor: "rgba(245, 158, 11, 0.14)", borderDash: [8, 6], tension: 0.35, pointRadius: 5 },
        { label: "Scenario Scope 1 + 2 after levers", data: [...years.slice(0, -1).map(() => null), data.scope12Totals[CURRENT_YEAR], scenario.projectedScope12], borderColor: "#7c3aed", backgroundColor: "rgba(124, 58, 237, 0.12)", borderDash: [5, 5], tension: 0.35, pointRadius: 5 }
      ]
    },
    options: baseChartOptions()
  });

  createChart("hotspot", "hotspotChart", {
    type: "bar",
    data: {
      labels: scenarioCategoryOrder.map((item) => item.category),
      datasets: [
        {
          label: "2024 actual",
          data: scenarioCategoryOrder.map((item) => data.scope3Categories[item.category][CURRENT_YEAR]),
          backgroundColor: "rgba(148, 163, 184, 0.72)",
          borderRadius: 12
        },
        {
          label: "Scenario after levers",
          data: scenarioCategoryOrder.map((item) => item.value),
          backgroundColor: scenarioCategoryOrder.map((_, index) => index < 3 ? chartPalette[index] : "#14b8a6"),
          borderRadius: 12
        }
      ]
    },
    options: baseChartOptions({
      indexAxis: "y",
      plugins: { tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatNumber(context.parsed.x)} tCO2e` } } }
    })
  });

  createChart("composition", "compositionChart", {
    type: "doughnut",
    data: {
      labels: scenarioCategoryOrder.map((item) => item.category),
      datasets: [{
        label: "Scenario Scope 3 composition",
        data: scenarioCategoryOrder.map((item) => item.value),
        backgroundColor: chartPalette,
        borderColor: "#ffffff",
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: { position: "bottom", labels: { color: "#334155", boxWidth: 12, font: { size: 11, weight: "700" } } },
        tooltip: { callbacks: { label: (context) => `${context.label}: ${formatNumber(context.parsed)} tCO2e` } }
      }
    }
  });

  const pathwayYears = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  createChart("pathway", "pathwayChart", {
    type: "line",
    data: {
      labels: pathwayYears,
      datasets: [
        { label: "Actual Scope 1 + 2", data: pathwayYears.map((year) => data.scope12Totals[year] ?? null), borderColor: "#12304d", backgroundColor: "rgba(18, 48, 77, 0.12)", tension: 0.25, spanGaps: false, pointRadius: 5 },
        { label: "Scenario after operational levers", data: [null, null, data.scope12Totals[CURRENT_YEAR], scenario.projectedScope12, null, null, null, null, null], borderColor: "#7c3aed", backgroundColor: "rgba(124, 58, 237, 0.12)", borderDash: [5, 5], tension: 0.25, pointRadius: 5 },
        { label: "SBTi style pathway", data: pathwayYears.map((year) => data.scope12Pathway[year] ?? null), borderColor: "#22c55e", backgroundColor: "rgba(34, 197, 94, 0.10)", borderDash: [8, 6], tension: 0.25, pointRadius: 4 }
      ]
    },
    options: baseChartOptions()
  });

  createChart("scenario", "scenarioChart", {
    type: "bar",
    data: {
      labels: ["2024 actual Scope 3", "Growth + no reductions", "After selected levers", "2030 planning benchmark"],
      datasets: [{
        label: "Scope 3 emissions",
        data: [data.scope3Totals[CURRENT_YEAR], scenario.growthOnlyScope3, scenario.projectedScope3, SCOPE3_2030_PLANNING_TARGET],
        backgroundColor: ["#12304d", "#f59e0b", "#14b8a6", "#22c55e"],
        borderRadius: 12
      }]
    },
    options: baseChartOptions({ plugins: { legend: { display: false } } })
  });

  createChart("scope12Scenario", "scope12ScenarioChart", {
    type: "bar",
    data: {
      labels: ["2024 actual", "Projected after operational reductions", "2030 SBTi pathway target"],
      datasets: [{
        label: "Scope 1 + 2 emissions",
        data: [data.scope12Totals[CURRENT_YEAR], scenario.projectedScope12, SCOPE12_2030_TARGET],
        backgroundColor: ["#12304d", "#2563eb", "#22c55e"],
        borderRadius: 12
      }]
    },
    options: baseChartOptions({ plugins: { legend: { display: false } } })
  });
}

function updateReductionCards(scenario = runScenario()) {
  reductionGroups.forEach((group) => {
    setText(`${group.key}Combined`, `${formatNumber(scenario.reductions[group.key].combinedReduction, 1)}%`);
    group.levers.forEach((lever) => setText(`${lever.id}Value`, `${getLeverValue(lever.id)}%`));
  });
}

function generateRecommendations(scenario) {
  const category = scenario.highestProjectedCategory.category;
  const logisticsTotal = logisticsCategories.reduce((sum, item) => sum + scenario.projectedCategories[item], 0);
  const growthLogistics = logisticsCategories.reduce((sum, item) => sum + scenario.growthOnlyCategories[item], 0);
  const baselineLogistics = logisticsCategories.reduce((sum, item) => sum + data.scope3Categories[item][CURRENT_YEAR], 0);
  const focusItems = [];

  if (category === "Manufacturing and Processing") {
    focusItems.push(["Manufacturing remains the largest contributor", "Prioritise supplier energy efficiency, process optimisation and lower impact production technology."]);
  }
  if (category === "Raw Materials Procurement" || scenario.projectedCategories["Raw Materials Procurement"] > scenario.projectedScope3 * 0.20) {
    focusItems.push(["Raw materials procurement remains a major hotspot", "Increase supplier engagement, lower impact material substitution and certified or recycled inputs."]);
  }
  if (category === "Packaging" || scenario.projectedCategories.Packaging > scenario.projectedScope3 * 0.12) {
    focusItems.push(["Packaging remains a material hotspot", "Increase cardboard weight reduction, recycled content and packaging size optimisation."]);
  }
  if (growthLogistics > baselineLogistics * 1.08 || logisticsTotal > scenario.projectedScope3 * 0.08) {
    focusItems.push(["Production growth is increasing logistics emissions", "Consider route optimisation, load consolidation and lower emission freight partners."]);
  }
  if (scenario.scope3Gap > 0) {
    focusItems.push(["Projected Scope 3 remains above the 2030 planning benchmark", "Additional reductions are required across manufacturing, raw materials and packaging."]);
  }
  if (scenario.scope12Gap === 0) {
    focusItems.push(["Scope 1 and Scope 2 remain ahead of the pathway", "Continue annual monitoring to confirm the reduction is structural and not temporary."]);
  } else {
    focusItems.push(["Scope 1 and Scope 2 require further operational reductions", "Prioritise heating efficiency, reduced gas heating use and shared-office footprint optimisation."]);
  }

  const recommendations = document.getElementById("recommendations");
  if (recommendations) {
    recommendations.innerHTML = focusItems.map(([title, text]) => `
      <div class="recommendation-item">
        <strong>${title}</strong>
        <span>${text}</span>
      </div>
    `).join("");
  }
}

function buildReductionCards() {
  const container = document.getElementById("reductionCards");
  if (!container) return;

  container.innerHTML = reductionGroups.map((group, index) => `
    <details class="reduction-card" ${index < 3 ? "open" : ""}>
      <summary class="lever-top">
        <div>
          <span>${group.title}</span>
          <h3>Baseline ${CURRENT_YEAR}: ${formatNumber(group.baseline)} tCO2e</h3>
          <p>Multiplicative reductions capped at ${group.cap}%.</p>
        </div>
        <strong id="${group.key}Combined" class="combined-reduction">0.0%</strong>
      </summary>
      <div class="lever-body">
        ${group.levers.map((lever) => `
          <label class="lever-slider" for="${lever.id}">
            <span>${lever.label}</span>
            <strong id="${lever.id}Value" class="lever-value">0%</strong>
            <input id="${lever.id}" type="range" min="0" max="${lever.max}" value="0" />
          </label>
        `).join("")}
      </div>
    </details>
  `).join("");
}

function switchPage(pageId) {
  document.querySelectorAll(".page-section").forEach((section) => section.classList.toggle("is-active", section.id === pageId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.page === pageId));

  const activeSection = document.getElementById(pageId);
  const title = activeSection?.dataset.title ?? "Overview";
  setText("activePageName", title);
  document.body.classList.remove("nav-open");
}

function refreshDashboard() {
  const scenario = runScenario();
  setText("productionGrowthValue", `${scenario.productionGrowth}%`);
  updateKPIs(scenario);
  updateIntensityTable(scenario);
  updateScenarioOutputs(scenario);
  updateReductionCards(scenario);
  updateCharts(scenario);
  generateRecommendations(scenario);
}

function initialiseDashboard() {
  buildReductionCards();
  updateTotalsTable();

  document.querySelectorAll("input[type='range']").forEach((slider) => {
    slider.addEventListener("input", refreshDashboard);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchPage(button.dataset.page));
  });

  document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });

  refreshDashboard();
}

document.addEventListener("DOMContentLoaded", initialiseDashboard);
