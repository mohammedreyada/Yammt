async function displayAreaPanel() {
  const panelArea = document.getElementById('panelArea');
  panelArea.innerHTML = `<h2>Areas</h2><div id="areasList" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px"></div>`;
  const areasList = document.getElementById('areasList');

  const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const data = await res.json();

  data.meals.forEach(a => {
    const btn = document.createElement('button');
    btn.textContent = a.strArea;
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '6px';
    btn.style.border = '1px solid #ddd';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => displayMealsByArea(a.strArea));
    areasList.appendChild(btn);
  });
}

async function displayMealsByArea(area) {
  const panelArea = document.getElementById('panelArea');
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  const data = await res.json();
  displayMeals(data.meals.slice(0,20), panelArea);
}
