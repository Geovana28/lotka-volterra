/* ============================================
   LOTKA-VOLTERRA SIMULATOR — ENGINE
   Numerical ODE solver + Chart.js visualization
   ============================================ */

(() => {
    'use strict';

    // --- Simulation Parameters ---
    const params = {
        prey0: 80,
        pred0: 30,
        alpha: 0.5,    // prey growth
        beta: 0.02,    // predation
        delta: 0.01,   // predator growth from eating
        gamma: 0.4,    // predator death
    };

    const SIM_DURATION = 120;  // time units
    const DT = 0.01;           // integration step (RK4)
    const SAMPLE_EVERY = 10;   // sample every N steps for charting

    // --- DOM ---
    const preySlider = document.getElementById('preySlider');
    const predSlider = document.getElementById('predSlider');
    const alphaSlider = document.getElementById('alphaSlider');
    const betaSlider = document.getElementById('betaSlider');
    const deltaSlider = document.getElementById('deltaSlider');
    const gammaSlider = document.getElementById('gammaSlider');

    const preyValue = document.getElementById('preyValue');
    const predValue = document.getElementById('predValue');
    const alphaValue = document.getElementById('alphaValue');
    const betaValue = document.getElementById('betaValue');
    const deltaValue = document.getElementById('deltaValue');
    const gammaValue = document.getElementById('gammaValue');

    const statPeakPrey = document.getElementById('statPeakPrey');
    const statPeakPred = document.getElementById('statPeakPred');
    const statMinPrey = document.getElementById('statMinPrey');
    const statMinPred = document.getElementById('statMinPred');
    const statPeriod = document.getElementById('statPeriod');
    const statEquilibrium = document.getElementById('statEquilibrium');

    const presetGrid = document.getElementById('presetGrid');

    // --- Runge-Kutta 4th Order Solver ---
    function lotkaVolterra(x, y, p) {
        const dxdt = p.alpha * x - p.beta * x * y;
        const dydt = p.delta * x * y - p.gamma * y;
        return [dxdt, dydt];
    }

    function rk4Step(x, y, dt, p) {
        const [k1x, k1y] = lotkaVolterra(x, y, p);
        const [k2x, k2y] = lotkaVolterra(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y, p);
        const [k3x, k3y] = lotkaVolterra(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y, p);
        const [k4x, k4y] = lotkaVolterra(x + dt * k3x, y + dt * k3y, p);

        const newX = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
        const newY = y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);

        return [Math.max(newX, 0), Math.max(newY, 0)];
    }

    function simulate() {
        const times = [];
        const preyData = [];
        const predData = [];
        const phaseX = [];
        const phaseY = [];

        let x = params.prey0;
        let y = params.pred0;
        let step = 0;

        const totalSteps = Math.ceil(SIM_DURATION / DT);

        for (let i = 0; i <= totalSteps; i++) {
            const t = i * DT;

            if (i % SAMPLE_EVERY === 0) {
                times.push(parseFloat(t.toFixed(2)));
                preyData.push(parseFloat(x.toFixed(2)));
                predData.push(parseFloat(y.toFixed(2)));
                phaseX.push(parseFloat(x.toFixed(2)));
                phaseY.push(parseFloat(y.toFixed(2)));
            }

            [x, y] = rk4Step(x, y, DT, params);

            // Safety: stop if populations explode
            if (x > 1e7 || y > 1e7 || isNaN(x) || isNaN(y)) break;
        }

        return { times, preyData, predData, phaseX, phaseY };
    }

    // --- Chart.js Setup ---
    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutCubic' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 24, 32, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleFont: { family: "'Inter', sans-serif", size: 12, weight: '600' },
                bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
            },
        },
    };

    // Time chart
    const timeCtx = document.getElementById('timeChart').getContext('2d');
    const timeChart = new Chart(timeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Prey (Rabbits)',
                    data: [],
                    borderColor: '#66bb6a',
                    backgroundColor: 'rgba(102, 187, 106, 0.08)',
                    fill: true,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    tension: 0.3,
                },
                {
                    label: 'Predators (Wolves)',
                    data: [],
                    borderColor: '#ff7043',
                    backgroundColor: 'rgba(255, 112, 67, 0.08)',
                    fill: true,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    tension: 0.3,
                },
            ],
        },
        options: {
            ...chartDefaults,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                        color: 'rgba(255,255,255,0.3)',
                        font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.25)',
                        font: { family: "'JetBrains Mono', monospace", size: 9 },
                        maxTicksLimit: 12,
                    },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    border: { color: 'rgba(255,255,255,0.08)' },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Population',
                        color: 'rgba(255,255,255,0.3)',
                        font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.25)',
                        font: { family: "'JetBrains Mono', monospace", size: 9 },
                    },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    border: { color: 'rgba(255,255,255,0.08)' },
                    beginAtZero: true,
                },
            },
        },
    });

    // Phase chart
    const phaseCtx = document.getElementById('phaseChart').getContext('2d');
    const phaseChart = new Chart(phaseCtx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Phase Orbit',
                    data: [],
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'transparent',
                    showLine: true,
                    borderWidth: 1.5,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    tension: 0.2,
                },
                {
                    label: 'Start',
                    data: [],
                    backgroundColor: '#66bb6a',
                    borderColor: '#66bb6a',
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    showLine: false,
                },
                {
                    label: 'Equilibrium',
                    data: [],
                    backgroundColor: '#ffd54f',
                    borderColor: '#ffd54f',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointStyle: 'crossRot',
                    showLine: false,
                },
            ],
        },
        options: {
            ...chartDefaults,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Prey Population',
                        color: 'rgba(102, 187, 106, 0.6)',
                        font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.25)',
                        font: { family: "'JetBrains Mono', monospace", size: 9 },
                    },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    border: { color: 'rgba(255,255,255,0.08)' },
                    beginAtZero: true,
                },
                y: {
                    title: {
                        display: true,
                        text: 'Predator Population',
                        color: 'rgba(255, 112, 67, 0.6)',
                        font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.25)',
                        font: { family: "'JetBrains Mono', monospace", size: 9 },
                    },
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    border: { color: 'rgba(255,255,255,0.08)' },
                    beginAtZero: true,
                },
            },
        },
    });

    // --- Update Charts ---
    function updateCharts() {
        const { times, preyData, predData, phaseX, phaseY } = simulate();

        // Time chart
        timeChart.data.labels = times;
        timeChart.data.datasets[0].data = preyData;
        timeChart.data.datasets[1].data = predData;
        timeChart.update();

        // Phase chart
        const phasePoints = phaseX.map((x, i) => ({ x, y: phaseY[i] }));
        phaseChart.data.datasets[0].data = phasePoints;

        // Start point
        phaseChart.data.datasets[1].data = [{ x: params.prey0, y: params.pred0 }];

        // Equilibrium point
        const eqX = params.gamma / params.delta;
        const eqY = params.alpha / params.beta;
        phaseChart.data.datasets[2].data = [{ x: eqX, y: eqY }];

        phaseChart.update();

        // Stats
        const maxPrey = Math.max(...preyData);
        const maxPred = Math.max(...predData);
        const minPrey = Math.min(...preyData);
        const minPred = Math.min(...predData);

        statPeakPrey.textContent = Math.round(maxPrey).toLocaleString();
        statPeakPred.textContent = Math.round(maxPred).toLocaleString();
        statMinPrey.textContent = Math.round(minPrey).toLocaleString();
        statMinPred.textContent = Math.round(minPred).toLocaleString();

        // Estimate period (time between first two prey peaks)
        const period = estimatePeriod(preyData, times);
        statPeriod.textContent = period ? period.toFixed(1) + ' t' : '—';

        // Equilibrium
        statEquilibrium.textContent = `${Math.round(eqX)} × ${Math.round(eqY)}`;
    }

    function estimatePeriod(data, times) {
        const peaks = [];
        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
                peaks.push(times[i]);
            }
        }
        if (peaks.length >= 2) {
            return peaks[1] - peaks[0];
        }
        return null;
    }

    // --- Slider Sync ---
    function syncSliders() {
        params.prey0 = parseInt(preySlider.value);
        params.pred0 = parseInt(predSlider.value);
        params.alpha = parseFloat(alphaSlider.value);
        params.beta = parseFloat(betaSlider.value);
        params.delta = parseFloat(deltaSlider.value);
        params.gamma = parseFloat(gammaSlider.value);

        preyValue.textContent = params.prey0;
        predValue.textContent = params.pred0;
        alphaValue.textContent = params.alpha.toFixed(2);
        betaValue.textContent = params.beta.toFixed(3);
        deltaValue.textContent = params.delta.toFixed(3);
        gammaValue.textContent = params.gamma.toFixed(2);

        updateCharts();
    }

    function setSliders(p) {
        preySlider.value = p.prey0;
        predSlider.value = p.pred0;
        alphaSlider.value = p.alpha;
        betaSlider.value = p.beta;
        deltaSlider.value = p.delta;
        gammaSlider.value = p.gamma;
    }

    // Attach slider events
    [preySlider, predSlider, alphaSlider, betaSlider, deltaSlider, gammaSlider]
        .forEach(s => s.addEventListener('input', syncSliders));

    // --- Presets ---
    presetGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.preset-btn');
        if (!btn) return;

        presetGrid.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        params.prey0 = parseInt(btn.dataset.prey);
        params.pred0 = parseInt(btn.dataset.pred);
        params.alpha = parseFloat(btn.dataset.alpha);
        params.beta = parseFloat(btn.dataset.beta);
        params.delta = parseFloat(btn.dataset.delta);
        params.gamma = parseFloat(btn.dataset.gamma);

        setSliders(params);
        syncSliders();
    });

    // --- Initial render ---
    syncSliders();

})();
