// Opcional: Registrar el plugin de datalabels si lo descomentaste en el HTML
// Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', function () {

    // --- Opciones comunes para gráficos ---
    const commonBarOptions = (indexAxis = 'x', aspectRatio = 1.5, legendDisplay = true, yTitle = '', xTitle = '') => ({
        indexAxis: indexAxis,
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: aspectRatio, // Este valor será crucial
        scales: {
            y: {
                beginAtZero: true,
                title: { display: !!yTitle, text: yTitle, font: { size: 10 } },
                ticks: { font: { size: 9 } }
            },
            x: {
                title: { display: !!xTitle, text: xTitle, font: { size: 10 } },
                ticks: { font: { size: 9 } }
            }
        },
        plugins: {
            legend: {
                display: legendDisplay,
                position: 'top',
                labels: { boxWidth: 12, font: { size: 10 }, padding: 8 }
            },
            title: { display: false }, // Usamos H2 en HTML
            // datalabels: { /* ... config datalabels si se usa ... */ }
        }
    });

    const commonPieOptions = (aspectRatio = 1.2, legendPosition = 'bottom') => ({
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: aspectRatio, // Este valor será crucial
        plugins: {
            legend: {
                display: true,
                position: legendPosition,
                labels: { boxWidth: 12, font: { size: 10 }, padding: 10, usePointStyle: true }
            },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed !== null) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) + '%' : '0%';
                            label += context.formattedValue + ' (' + percentage + ')';
                        }
                        return label;
                    }
                }
            },
            // datalabels: { /* ... config datalabels si se usa ... */ }
        }
    });


    // --- GRÁFICO 1: Edades (Vertical Bar - Fila superior) ---
    const dataEdades = {
        labels: ['13', '14', '15'],
        datasets: [{
            label: 'Cantidad',
            data: [115, 67, 22],
            backgroundColor: ['rgba(199, 182, 224, 0.7)', 'rgba(144, 238, 144, 0.7)', 'rgba(70, 130, 180, 0.7)'],
            borderColor: ['rgba(199, 182, 224, 1)', 'rgba(144, 238, 144, 1)', 'rgba(70, 130, 180, 1)'],
            borderWidth: 1
        }]
    };
    const configEdades = {
        type: 'bar',
        data: dataEdades,
        options: {
            // Para 3 items en fila, el gráfico será más estrecho. Reducir aspectRatio.
            ...commonBarOptions('x', 1.2, true, 'Cantidad', 'EDADES'), // EJ: 1.2 (más alto que ancho) o 1.3
            plugins: {
                ...commonBarOptions().plugins,
                legend: {
                    display: true, position: 'top', labels: { boxWidth: 12, font: { size: 10 }, padding: 8,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const meta = chart.getDatasetMeta(0);
                                    const style = meta.controller.getStyle(i);
                                    return { text: label, fillStyle: style.backgroundColor, strokeStyle: style.borderColor, lineWidth: style.borderWidth, hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden, index: i };
                                });
                            } return [];
                        }
                    }
                }
            }
        }
    };
    new Chart(document.getElementById('chartEdades'), configEdades);


    // --- GRÁFICO 2: Tipo de bebidas (Pie - Fila superior) ---
    const sortedLabelsBebidas = ['0 = No toma (71)', '1 = Cerveza (8)', '2 = Vino (36)', '3 = Gancia (11)','4 = Fernet (53)', '5 = Ron (4)', '6 = Vodka/Tequila (12)', '7 = Sidra (8)',  '8 = Otra (1)'];
    const sortedDataBebidas = [71, 8, 36, 11, 53, 4, 12, 8, 1];
    const sortedColorsBebidas = ['rgba(200, 200, 200, 0.8)', 'rgba(135, 206, 250, 0.8)', 'rgba(220, 20, 60, 0.8)', 'rgba(0, 255, 255, 0.8)', 'rgba(124, 252, 0, 0.8)', 'rgba(255, 223, 0, 0.8)', 'rgba(255, 192, 203, 0.8)', 'rgba(244, 164, 96, 0.8)', 'rgba(169, 169, 169, 0.8)'];
    const dataTipoBebidasReordered = {
        labels: sortedLabelsBebidas,
        datasets: [{ data: sortedDataBebidas, backgroundColor: sortedColorsBebidas, borderColor: '#fff', borderWidth: 1.5, hoverOffset: 8 }]
    };
    new Chart(document.getElementById('chartTipoBebidas'), {
        type: 'pie',
        data: dataTipoBebidasReordered,
        // Para 3 items en fila, el gráfico será más estrecho. Un aspectRatio cercano a 1 (cuadrado) puede ser bueno.
        options: commonPieOptions(1.0, 'bottom') // EJ: 1.0 (cuadrado) o 1.1
    });

    // --- Tabla Frecuencia de Consumo (Fila superior) - No requiere JS para el gráfico ---
    // Ya está en el HTML

    // --- Tabla Amigos Varones (Fila inferior) - No requiere JS para el gráfico ---
    // Ya está en el HTML

    // --- GRÁFICO 3: Consumo parental (Horizontal Bar - Fila inferior) ---
    const dataConsumoParental = {
        labels: ['0=No', '1=Sí'],
        datasets: [{
            label: 'Respuesta',
            data: [18, 186],
            backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(144, 238, 144, 0.7)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(144, 238, 144, 1)'],
            borderWidth: 1
        }]
    };
    const configConsumoParental = {
        type: 'bar',
        data: dataConsumoParental,
        // Para 2 items en fila, será más ancho que los de arriba. Puede tener un aspectRatio mayor.
        options: commonBarOptions('y', 1.8, false, '', 'Cantidad') // EJ: 1.8 o 2.0 (más ancho que alto)
    };
    new Chart(document.getElementById('chartConsumoParental'), configConsumoParental);

});