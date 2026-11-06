// Mathematical Calculation Engine for DTY Indorama HPP

export function calculateBatchHPP(batch, masterCost) {
  if (!batch || !batch.shifts || batch.shifts.length === 0) {
    return null;
  }

  // 1. Agregasi Data Fisik dari seluruh shift
  const totalPoyKg = batch.shifts.reduce((acc, s) => acc + Number(s.poyInputKg || 0), 0);
  const totalDtyKg = batch.shifts.reduce((acc, s) => acc + Number(s.dtyOutputKg || 0), 0);
  const totalWasteKg = batch.shifts.reduce((acc, s) => acc + Number(s.wasteBettesKg || 0), 0);
  const totalRunHours = batch.shifts.reduce((acc, s) => acc + Number(s.runHours || 0), 0);
  const totalDowntimeHours = batch.shifts.reduce((acc, s) => acc + Number(s.downtimeHours || 0), 0);
  const totalOperatorManHours = batch.shifts.reduce(
    (acc, s) => acc + Number(s.operatorCount || 0) * Number(s.runHours || 0),
    0
  );

  // 2. PILAR 1: Biaya Bahan Baku Langsung (BBBL)
  const poyCost = totalPoyKg * masterCost.poyPricePerKg;
  const oilNeededKg = totalDtyKg * (masterCost.oilPickupPercent / 100);
  const oilCost = oilNeededKg * masterCost.coningOilPricePerKg;
  const wasteCredit = totalWasteKg * masterCost.scrapWastePricePerKg;
  const netBbbl = poyCost + oilCost - wasteCredit;

  // 3. PILAR 2: Biaya Tenaga Kerja Langsung (BTKL)
  const totalBtkl = totalOperatorManHours * masterCost.laborRatePerHour;

  // 4. PILAR 3: Biaya Langsung Mesin & Energi (BLM)
  const totalConnectedPowerKw = Number(masterCost.dayaHeatersKw) + Number(masterCost.dayaMotorKw);
  const machineKwh = totalConnectedPowerKw * totalRunHours * Number(masterCost.loadFactor);
  const machineElectricityCost = machineKwh * masterCost.electricityTariffAvg;
  const wearDiscCost = totalRunHours * masterCost.wearDiscCostPerHour;
  const totalBlm = machineElectricityCost + wearDiscCost;

  // 5. PILAR 4: Biaya Tidak Langsung / Overhead Pabrik (BOP)
  const machineDepreciationCost = totalRunHours * masterCost.depreciationRatePerHour;
  const plantUtilityCost = totalRunHours * masterCost.supportUtilityPerHour;
  const maintenanceCost = totalRunHours * masterCost.maintenanceRatePerHour;
  const totalBop = machineDepreciationCost + plantUtilityCost + maintenanceCost;

  // 6. LEVEL 0: TOTAL HPP & HPP PER KG
  const totalHpp = netBbbl + totalBtkl + totalBlm + totalBop;
  const hppPerKg = totalDtyKg > 0 ? totalHpp / totalDtyKg : 0;

  // 7. LEVEL 3: KPI PRODUKTIVITAS PABRIK
  const yieldPercent = totalPoyKg > 0 ? (totalDtyKg / totalPoyKg) * 100 : 0;
  const wastePercent = totalPoyKg > 0 ? (totalWasteKg / totalPoyKg) * 100 : 0;
  const secKwhPerKg = totalDtyKg > 0 ? machineKwh / totalDtyKg : 0;
  const costVariancePerKg = hppPerKg - (batch.targetHppPerKg || 0);

  // Proporsi Biaya (%)
  const pctBbbl = totalHpp > 0 ? (netBbbl / totalHpp) * 100 : 0;
  const pctBtkl = totalHpp > 0 ? (totalBtkl / totalHpp) * 100 : 0;
  const pctBlm = totalHpp > 0 ? (totalBlm / totalHpp) * 100 : 0;
  const pctBop = totalHpp > 0 ? (totalBop / totalHpp) * 100 : 0;

  return {
    physical: {
      totalPoyKg,
      totalDtyKg,
      totalWasteKg,
      totalRunHours,
      totalDowntimeHours,
      totalOperatorManHours,
      oilNeededKg
    },
    costs: {
      poyCost,
      oilCost,
      wasteCredit,
      netBbbl,
      totalBtkl,
      totalConnectedPowerKw,
      machineKwh,
      machineElectricityCost,
      wearDiscCost,
      totalBlm,
      machineDepreciationCost,
      plantUtilityCost,
      maintenanceCost,
      totalBop,
      totalHpp,
      hppPerKg
    },
    kpi: {
      yieldPercent,
      wastePercent,
      secKwhPerKg,
      costVariancePerKg,
      pctBbbl,
      pctBtkl,
      pctBlm,
      pctBop
    }
  };
}

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function formatNumber(value, decimals = 1) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value || 0);
}
