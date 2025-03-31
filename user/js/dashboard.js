document.addEventListener('DOMContentLoaded', function () {
    const CHART_MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Hide legend by default
            },
            tooltip: {
                enabled: true // Enable tooltips
            }
        },
        scales: {
            x: {
                display: true, // Show x-axis labels
                grid: {
                    display: false // Hide vertical grid lines
                },
                ticks: {
                    color: '#a0a0a0', // Light grey ticks
                    font: { size: 10 }
                },
                border: {
                    display: false
                }
            },
            y: {
                display: false, // Hide y-axis completely
                beginAtZero: true
            }
        },
        elements: {
            line: {
                tension: 0.4 // Makes lines curved
            },
            point: {
                radius: 0 // Hide points on the line
            }
        }
    };

    // --- 1. Receita Operacional Chart (Area Chart) ---
    const receitaCtx = document.getElementById('receitaChart').getContext('2d');
    // Create gradient
    const receitaGradient = receitaCtx.createLinearGradient(0, 0, 0, 80); // x0, y0, x1, y1
    receitaGradient.addColorStop(0, 'rgba(13, 110, 253, 0.6)'); // Start color (accent-blue)
    receitaGradient.addColorStop(1, 'rgba(13, 110, 253, 0.05)'); // End color (transparent)

    new Chart(receitaCtx, {
        type: 'line', // Use 'line' type with fill enabled
        data: {
            labels: CHART_MONTHS,
            datasets: [{
                label: 'Receita Operacional',
                data: [50, 60, 80, 75, 90, 85, 95, 100, 98, 110, 120, 115], // Sample data
                borderColor: 'rgba(13, 110, 253, 1)', // accent-blue
                borderWidth: 2,
                fill: true, // Enable fill
                backgroundColor: receitaGradient // Apply gradient
            }]
        },
        options: commonChartOptions
    });

    // --- 2. Margem de Contribuição Chart (Area Chart) ---
    const margemCtx = document.getElementById('margemChart').getContext('2d');
    // Create gradient
    const margemGradient = margemCtx.createLinearGradient(0, 0, 0, 80);
    margemGradient.addColorStop(0, 'rgba(25, 135, 84, 0.6)'); // Start color (accent-green)
    margemGradient.addColorStop(1, 'rgba(25, 135, 84, 0.05)'); // End color

    new Chart(margemCtx, {
        type: 'line',
        data: {
            labels: CHART_MONTHS,
            datasets: [{
                label: 'Margem Contribuição',
                data: [15, 18, 22, 20, 25, 23, 28, 30, 29, 33, 35, 34], // Sample data
                borderColor: 'rgba(25, 135, 84, 1)', // accent-green
                borderWidth: 2,
                fill: true,
                backgroundColor: margemGradient
            }]
        },
        options: commonChartOptions
    });

    // --- 3. % MC Geral Chart (Area Chart) ---
    const mcPercentCtx = document.getElementById('mcPercentChart').getContext('2d');
     // Create gradient
    const mcGradient = mcPercentCtx.createLinearGradient(0, 0, 0, 80);
    mcGradient.addColorStop(0, 'rgba(214, 51, 132, 0.6)'); // Start color (accent-pink)
    mcGradient.addColorStop(1, 'rgba(214, 51, 132, 0.05)'); // End color

    new Chart(mcPercentCtx, {
        type: 'line',
        data: {
            labels: CHART_MONTHS,
            datasets: [{
                label: '% MC Geral',
                data: [22, 21, 20, 21.5, 20.5, 19, 20, 19.5, 21, 20, 21, 20.5], // Sample data %
                borderColor: 'rgba(214, 51, 132, 1)', // accent-pink
                borderWidth: 2,
                fill: true,
                backgroundColor: mcGradient
            }]
        },
        options: commonChartOptions
    });

     // --- 4. Receita por Equipe Vendas e Linha Produto (Grouped Bar Chart) ---
    const equipeLinhaCtx = document.getElementById('equipeLinhaChart').getContext('2d');
    new Chart(equipeLinhaCtx, {
        type: 'bar',
        data: {
            labels: ['Varejo', 'Distribuidoras', 'Online'], // Categories (Sales Teams/Channels)
            datasets: [
                {
                    label: 'Alimentos',
                    data: [3.9, 3.0, 2.0], // Sample data in Millions
                    backgroundColor: 'rgba(13, 110, 253, 0.8)', // accent-blue slightly transparent
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 1
                },
                 {
                    label: 'Bebidas',
                    data: [0.6, 0.4, 0], // Sample data in Millions (Online has no Bebidas bar)
                    backgroundColor: 'rgba(13, 202, 240, 0.8)', // accent-cyan slightly transparent
                    borderColor: 'rgba(13, 202, 240, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y', // Make it horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                   display: false // We created a custom HTML legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.x !== null) {
                                // Format as R$ X.Y Mi
                                label += 'R$' + context.parsed.x.toFixed(1) + ' Mi';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true, // Show value axis
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)', // Lighter grid lines
                         drawBorder: false,
                    },
                     ticks: {
                        color: '#a0a0a0',
                        callback: function(value, index, values) {
                             return 'R$' + value + ' Mi'; // Add Mi suffix
                        }
                    }
                },
                y: {
                    display: true, // Show category axis
                    grid: {
                        display: false // Hide category grid lines
                    },
                     ticks: {
                        color: '#e0e0e0' // Main text color
                    }
                }
            }
        }
    });

});