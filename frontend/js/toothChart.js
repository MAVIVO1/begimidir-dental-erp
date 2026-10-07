// FDI (Universal) tooth numbering: quadrants 1-4, teeth 1-8 each = 32 teeth.
const FDI_QUADRANTS = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
  lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
};

const CONDITIONS = ["healthy", "cavity", "filled", "missing", "crown"];

function renderToothChart(container, toothRecords, onToothClick) {
  const recordMap = {};
  toothRecords.forEach((r) => (recordMap[r.toothNumberFDI] = r.condition));

  function row(numbers) {
    const row = document.createElement("div");
    row.className = "tooth-row";
    numbers.forEach((num) => {
      const condition = recordMap[num] || "healthy";
      const el = document.createElement("div");
      el.className = `tooth ${condition}`;
      el.textContent = num;
      el.title = `Tooth ${num} — ${condition}`;
      el.onclick = () => onToothClick(String(num), condition);
      row.appendChild(el);
    });
    return row;
  }

  container.innerHTML = "";
  container.className = "tooth-chart";
  container.appendChild(row(FDI_QUADRANTS.upperRight.concat(FDI_QUADRANTS.upperLeft)));
  container.appendChild(row(FDI_QUADRANTS.lowerRight.concat(FDI_QUADRANTS.lowerLeft)));
}

function cycleCondition(current) {
  const idx = CONDITIONS.indexOf(current);
  return CONDITIONS[(idx + 1) % CONDITIONS.length];
}
