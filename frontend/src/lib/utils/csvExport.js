/**
 * Export consumption data to a CSV file.
 *
 * @param {Object} data - Consumption data from API
 * @param {String} period - Period label (e.g. last3Days, weekly, monthly)
 */
export const exportToCSV = (data, period) => {
    const periodLabels = {
        last3Days: "3 derniers jours",
        weekly: "Cette semaine",
        monthly: "Ce mois-ci",
    };

    const periodLabel = periodLabels[period] || period;
    const timestamp = new Date().toLocaleDateString("fr-FR");

    // CSV Header
    const headers = [
        "Période",
        "Nombre de consommations",
        "Sucre total (g)",
        "Calories totales (kcal)",
        "Caféine totale (mg)",
        "Date d'export",
    ];

    // CSV Data Row
    const row = [
        periodLabel,
        data.count || 0,
        data.totals?.sugar?.toFixed(2) || 0,
        data.totals?.calories?.toFixed(2) || 0,
        data.totals?.caffeine?.toFixed(2) || 0,
        timestamp,
    ];

    // Build CSV content
    const csvContent = [
        headers.join(";"), // Use semicolon for French Excel
        row.join(";"),
        "", // Empty line
        "--- Détail des consommations ---",
        "",
        "Produit;Marque;Quantité (ml);Sucre (g);Calories (kcal);Caféine (mg);Date",
    ];

    // Add individual consumptions if available
    if (data.consumptions && data.consumptions.length > 0) {
        data.consumptions.forEach((consumption) => {
            const consumptionRow = [
                consumption.productName || "N/A",
                consumption.brand || "N/A",
                consumption.quantity || 0,
                consumption.sugar?.toFixed(2) || 0,
                consumption.calories?.toFixed(2) || 0,
                consumption.caffeine?.toFixed(2) || 0,
                new Date(consumption.createdAt).toLocaleString("fr-FR"),
            ];
            csvContent.push(consumptionRow.join(";"));
        });
    }

    // Create Blob and download
    const blob = new Blob(["\ufeff" + csvContent.join("\n")], {
        type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const filename = `paramedic_${period}_${timestamp.replace(/\//g, "-")}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
