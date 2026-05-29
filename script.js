const CURRENT_YEAR = 2024;
const NEXT_PATHWAY_YEAR = 2025;
const SCOPE12_2030_TARGET = 4.51;
const SCOPE3_2030_PLANNING_TARGET = 505.45;

const data = {
  scope1: { 2019: 1.09, 2020: 7.25, 2021: 4.79, 2022: 6.05, 2023: 4.84, 2024: 3.68 },
  scope2: { 2019: 1.56, 2020: 2.32, 2021: 2.54, 2022: 1.75, 2023: 1.77, 2024: 1.65 },
  scope12Totals: { 2019: 2.65, 2020: 9.57, 2021: 7.33, 2022: 7.80, 2023: 6.61, 2024: 5.33, 2025: 0.59 },
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
  "End of Life Waste Management"
];

const logisticsCategories = [
  "Transportation to the UK, Road",
  "Transportation to the UK, Rail",
  "Transportation to the UK, Ship",
  "Shipment and Distribution"
];

const chartPalette = [
  "#123c69", "#1b8a5a", "#1f6f9f", "#58b368", "#7c3aed", "#c77d00",
  "#0f766e", "#2563eb", "#84cc16", "#f97316", "#64748b", "#14b8a6", "#a855f7"
];

const charts = {};

function formatNumber(value, decimals = 2) {
  return Number(value).toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function calculateTotals() {
  const latestScope12Year = Math.max(...Object.keys(data.scope12Totals).map(Number));
  const scope12Latest = data.scope12Totals[latestScope12Year];
  const currentScope12 = data.scope12Totals[CURRENT_YEAR];
  const scope3Latest = data.scope3Totals[CURRENT_YEAR];
  const total2024 = currentScope12 + scope3Latest;
  const categories2024 = Object.entries(data.scope3Categories)
    .map(([category, values]) => ({ category, value: values[CURRENT_YEAR] }))
    .sort((a, b) => b.value - a.value);

  return {
    latestScope12Year,
    scope12Latest,
    currentScope12,
    scope3Latest,
    total2024,
    categories2024,
    largestScope3Category: categories2024[0]
  };
}

function calculateProductionIntensity() {
  const productionVolume = data.productionVolumes[CURRENT_YEAR];
  const rows = productionLinkedCategories.map((category) => {
    const emissions = data.scope3Categories[category][CURRENT_YEAR];
    const tonnesPerBox = emissions / productionVolume;
    return {
      category,
      emissions,
      tonnesPerBox,
      kgPerBox: tonnesPerBox * 1000
    };
  });

  return {
    productionVolume,
    linkedEmissions: rows.reduce((sum, row) => sum + row.emissions, 0),
    rows
  };
}

function getSliderValues() {
  return {
    productionGrowth: Number(document.getElementById("productionGrowth").value),
    manufacturingReduction: Number(document.getElementById("manufacturingReduction").value),
    rawMaterialsReduction: Number(document.getElementById("rawMaterialsReduction").value),
    packagingReduction: Number(document.getElementById("packagingReduction").value),
    logisticsReduction: Number(document.getElementById("logisticsReduction").value),
    endOfLifeReduction: Number(document.getElementById("endOfLifeReduction").value),
    operationalReduction: Number(document.getElementById("operationalReduction").value)
  };
}

function categoryReductionFor(category, values) {
  if (category === "Manufacturing and Processing") return values.manufacturingReduction;
  if (category === "Raw Materials Procurement") return values.rawMaterialsReduction;
  if (category === "Packaging") return values.packagingReduction;
  if (category === "End of Life Waste Management") return values.endOfLifeReduction;
  if (logisticsCategories.includes(category)) return values.logisticsReduction;
  return 0;
}

function runScenario() {
  const values = getSliderValues();
  const productionGrowthFactor = 1 + values.productionGrowth / 100;
  const projectedCategories = {};
  const growthOnlyCategories = {};

  Object.entries(data.scope3Categories).forEach(([category, yearlyValues]) => {
    const baseEmissions = yearlyValues[CURRENT_YEAR];
    const reductionFactor = 1 - categoryReductionFor(category, values) / 100;
    const growsWithProduction = productionLinkedCategories.includes(category) || logisticsCategories.includes(category);

    // Production-linked and logistics categories scale with growth; other categories remain at 2024 levels.
    const growthAdjusted = growsWithProduction ? baseEmissions * productionGrowthFactor : baseEmissions;
    growthOnlyCategories[category] = growthAdjusted;
    projectedCategories[category] = growthAdjusted * reductionFactor;
  });

  const projectedScope3 = Object.values(projectedCategories).reduce((sum, value) => sum + value, 0);
  const growthOnlyScope3 = Object.values(growthOnlyCategories).reduce((sum, value) => sum + value, 0);

  // Scope 1 + 2 simulation applies only the operational reduction lever to the 2024 actual value.
  const projectedScope12 = data.scope12Totals[CURRENT_YEAR] * (1 - values.operationalReduction / 100);
  const projectedTotal = projectedScope12 + projectedScope3;
  const total2024 = data.scope12Totals[CURRENT_YEAR] + data.scope3Totals[CURRENT_YEAR];
  const changeVs2024 = projectedTotal - total2024;

  const scope12Gap = Math.max(projectedScope12 - SCOPE12_2030_TARGET, 0);
  const scope12RequiredReduction = projectedScope12 > 0 ? (scope12Gap / projectedScope12) * 100 : 0;
  const scope3Gap = Math.max(projectedScope3 - SCOPE3_2030_PLANNING_TARGET, 0);
  const scope3RequiredReduction = projectedScope3 > 0 ? (scope3Gap / projectedScope3) * 100 : 0;

  const projectedCategoryList = Object.entries(projectedCategories)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  return {
    values,
    projectedProduction: data.productionVolumes[CURRENT_YEAR] * productionGrowthFactor,
    projectedCategories,
    projectedCategoryList,
    projectedScope3,
    growthOnlyScope3,
    projectedScope12,
    projectedTotal,
    changeVs2024,
    scope12Gap,
    scope12RequiredReduction,
    scope3Gap,
    scope3RequiredReduction,
    highestProjectedCategory: projectedCategoryList[0]
  };
}

function destroyChart(name) {
  if (charts[name]) {
    charts[name].destroy();
    delete charts[name];
  }
}

function createChart(name, canvasId, config) {
  destroyChart(name);
  charts[name] = new Chart(document.getElementById(canvasId), config);
}

function baseChartOptions(extraOptions = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#14213d", boxWidth: 14, font: { weight: "700" } } },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label || context.label}: ${formatNumber(context.parsed.y ?? context.parsed, 2)} tCO2e`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#5d6b82" } },
      y: { beginAtZero: true, grid: { color: "#e6edf3" }, ticks: { color: "#5d6b82" } }
    },
    ...extraOptions
  };
}

function updateKPIs() {
  const totals = calculateTotals();
  const currentPathway = data.scope12Pathway[CURRENT_YEAR];
  const delta = totals.currentScope12 - currentPathway;
  const ahead = delta <= 0;

  document.getElementById("kpiScope12").textContent = `${formatNumber(totals.scope12Latest)} tCO2e`;
  document.getElementById("kpiScope3").textContent = `${formatNumber(totals.scope3Latest)} tCO2e`;
  document.getElementById("kpiLargestCategory").textContent = totals.largestScope3Category.category;
  document.getElementById("kpiLargestCategoryValue").textContent = `${formatNumber(totals.largestScope3Category.value)} tCO2e in 2024`;
  document.getElementById("kpiTotal2024").textContent = `${formatNumber(totals.total2024)} tCO2e`;
  document.getElementById("kpiTarget2030").textContent = `${formatNumber(SCOPE12_2030_TARGET)} tCO2e`;
  document.getElementById("kpiPathwayStatus").textContent = ahead ? "Ahead of pathway" : "Behind pathway";
  document.getElementById("kpiPathwayDelta").textContent = `${formatNumber(Math.abs(delta))} tCO2e ${ahead ? "below" : "above"} the 2024 pathway`;

  const pill = document.getElementById("pathwayPill");
  pill.textContent = ahead ? "Ahead of 2024 pathway" : "Behind 2024 pathway";
  pill.classList.toggle("is-behind", !ahead);
}

function updateIntensityTable() {
  const intensity = calculateProductionIntensity();
  document.getElementById("productionVolume2024").textContent = `${formatNumber(intensity.productionVolume, 0)} boxes`;
  document.getElementById("linkedEmissions2024").textContent = `${formatNumber(intensity.linkedEmissions)} tCO2e`;
  document.getElementById("intensityTable").innerHTML = intensity.rows.map((row) => `
    <tr>
      <td>${row.category}</td>
      <td>${row.tonnesPerBox.toExponential(4)}</td>
      <td>${formatNumber(row.kgPerBox, 4)}</td>
    </tr>
  `).join("");
}

function updateScenarioOutputs(scenario) {
  document.getElementById("projectedProduction").textContent = `${formatNumber(scenario.projectedProduction, 0)} boxes`;
  document.getElementById("projectedScope3").textContent = `${formatNumber(scenario.projectedScope3)} tCO2e`;
  document.getElementById("projectedScope12").textContent = `${formatNumber(scenario.projectedScope12)} tCO2e`;
  document.getElementById("projectedTotal").textContent = `${formatNumber(scenario.projectedTotal)} tCO2e`;
  document.getElementById("changeVs2024").textContent = `${scenario.changeVs2024 >= 0 ? "+" : ""}${formatNumber(scenario.changeVs2024)} tCO2e`;
  document.getElementById("requiredReduction").textContent = `S1+2: ${formatNumber(scenario.scope12RequiredReduction)}% | S3: ${formatNumber(scenario.scope3RequiredReduction)}%`;
  document.getElementById("highestProjectedCategory").textContent = `${scenario.highestProjectedCategory.category} (${formatNumber(scenario.highestProjectedCategory.value)} tCO2e)`;
  const nearTermGap = Math.max(scenario.projectedScope12 - data.scope12Pathway[NEXT_PATHWAY_YEAR], 0);
  document.getElementById("gapAnalysis").textContent = `Projected Scope 1 + 2 is ${formatNumber(nearTermGap)} tCO2e above the ${NEXT_PATHWAY_YEAR} near-term pathway value of ${formatNumber(data.scope12Pathway[NEXT_PATHWAY_YEAR])} tCO2e and ${formatNumber(scenario.scope12Gap)} tCO2e above the 2030 target of ${formatNumber(SCOPE12_2030_TARGET)} tCO2e, requiring ${formatNumber(scenario.scope12RequiredReduction)}% further reduction by 2030. Projected Scope 3 is ${formatNumber(scenario.scope3Gap)} tCO2e above the planning benchmark of ${formatNumber(SCOPE3_2030_PLANNING_TARGET)} tCO2e, requiring ${formatNumber(scenario.scope3RequiredReduction)}% further reduction.`;
}

function updateCharts(scenario = runScenario()) {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const totals = calculateTotals();
  const sortedCategories = totals.categories2024;

  createChart("historical", "historicalChart", {
    type: "line",
    data: {
      labels: years,
      datasets: [
        { label: "Scope 1", data: years.map((year) => data.scope1[year]), borderColor: "#123c69", backgroundColor: "rgba(18, 60, 105, 0.12)", tension: 0.35, pointRadius: 4 },
        { label: "Scope 2", data: years.map((year) => data.scope2[year]), borderColor: "#1f6f9f", backgroundColor: "rgba(31, 111, 159, 0.12)", tension: 0.35, pointRadius: 4 },
        { label: "Scope 3", data: years.map((year) => data.scope3Totals[year]), borderColor: "#1b8a5a", backgroundColor: "rgba(27, 138, 90, 0.12)", tension: 0.35, pointRadius: 4 }
      ]
    },
    options: baseChartOptions()
  });

  createChart("hotspot", "hotspotChart", {
    type: "bar",
    data: {
      labels: sortedCategories.map((item) => item.category),
      datasets: [{
        label: "2024 Scope 3 emissions",
        data: sortedCategories.map((item) => item.value),
        backgroundColor: sortedCategories.map((_, index) => index < 3 ? chartPalette[index] : "#9fb2c2"),
        borderRadius: 12
      }]
    },
    options: baseChartOptions({
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => `${formatNumber(context.parsed.x)} tCO2e` } }
      }
    })
  });

  createChart("composition", "compositionChart", {
    type: "doughnut",
    data: {
      labels: sortedCategories.map((item) => item.category),
      datasets: [{ data: sortedCategories.map((item) => item.value), backgroundColor: chartPalette, borderColor: "#ffffff", borderWidth: 3 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: { position: "bottom", labels: { color: "#14213d", boxWidth: 12, font: { size: 11, weight: "700" } } },
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
        { label: "Actual Scope 1 + 2", data: pathwayYears.map((year) => data.scope12Totals[year] ?? null), borderColor: "#123c69", backgroundColor: "rgba(18, 60, 105, 0.12)", tension: 0.25, spanGaps: false, pointRadius: 5 },
        { label: "SBTi style pathway", data: pathwayYears.map((year) => data.scope12Pathway[year]), borderColor: "#1b8a5a", backgroundColor: "rgba(27, 138, 90, 0.10)", borderDash: [8, 6], tension: 0.25, pointRadius: 4 }
      ]
    },
    options: baseChartOptions()
  });

  createChart("scenario", "scenarioChart", {
    type: "bar",
    data: {
      labels: ["2024 actual", "Growth only", "Selected reductions", "2030 planning target"],
      datasets: [{
        label: "Scope 3 emissions",
        data: [data.scope3Totals[CURRENT_YEAR], scenario.growthOnlyScope3, scenario.projectedScope3, SCOPE3_2030_PLANNING_TARGET],
        backgroundColor: ["#123c69", "#c77d00", "#1b8a5a", "#1f6f9f"],
        borderRadius: 12
      }]
    },
    options: baseChartOptions({ plugins: { legend: { display: false } } })
  });
}

function generateRecommendations(scenario) {
  const category = scenario.highestProjectedCategory.category;
  const logisticsTotal = logisticsCategories.reduce((sum, item) => sum + scenario.projectedCategories[item], 0);
  const focusItems = [];

  if (category === "Manufacturing and Processing") {
    focusItems.push(["Manufacturing hotspot", "Prioritise supplier manufacturing efficiency, renewable process energy and lower energy intensity production routes."]);
  }
  if (category === "Raw Materials Procurement") {
    focusItems.push(["Raw materials hotspot", "Accelerate lower impact materials, supplier engagement and product specification changes that reduce embedded carbon."]);
  }
  if (category === "Packaging" || scenario.projectedCategories.Packaging > scenario.projectedScope3 * 0.12) {
    focusItems.push(["Packaging opportunity", "Advance packaging weight reduction, recycled content, fibre optimisation and design optimisation across the portfolio."]);
  }
  if (logisticsTotal > scenario.projectedScope3 * 0.08 || logisticsCategories.includes(category)) {
    focusItems.push(["Logistics opportunity", "Use route optimisation, lower emission freight choices, modal shift and load efficiency to reduce distribution emissions."]);
  }
  if (category === "End of Life Waste Management" || scenario.projectedCategories["End of Life Waste Management"] > scenario.projectedScope3 * 0.10) {
    focusItems.push(["End-of-life opportunity", "Improve recyclable design, compostability evidence, consumer disposal guidance and waste treatment outcomes."]);
  }
  if (!focusItems.length) {
    focusItems.push(["Balanced reduction plan", "Maintain a portfolio-wide reduction programme because no single non-logistics category dominates the simulated footprint."]);
  }

  document.getElementById("recommendations").innerHTML = focusItems.map(([title, text]) => `
    <div class="recommendation-item">
      <strong>${title}</strong>
      <span>${text}</span>
    </div>
  `).join("");
}

function updateSliderLabels() {
  Object.entries(getSliderValues()).forEach(([key, value]) => {
    const element = document.getElementById(`${key}Value`);
    if (element) element.textContent = `${value}%`;
  });
}

function refreshDashboard() {
  updateSliderLabels();
  const scenario = runScenario();
  updateKPIs();
  updateScenarioOutputs(scenario);
  updateCharts(scenario);
  generateRecommendations(scenario);
}

function initDashboard() {
  updateIntensityTable();
  document.querySelectorAll("input[type='range']").forEach((slider) => {
    slider.addEventListener("input", refreshDashboard);
  });
  refreshDashboard();
}

document.addEventListener("DOMContentLoaded", initDashboard);
