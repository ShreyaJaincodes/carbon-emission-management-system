// Wait for the HTML content to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATABASE AND CONSTANTS --- //
    // In a real application, this data would come from a server.
    const MOCK_DATABASE = {
        mines: {} // This will store data for each mine entered by managers
    };

    // Emission factors (in tonnes of CO2e per unit)
    const EMISSION_FACTORS = {
        DIESEL_LITRE: 0.00268,   // tCO2e per litre
        ELECTRICITY_KWH: 0.00082, // tCO2e per kWh (India's grid average)
        METHANE_M3: 0.021       // tCO2e per cubic meter (GWP of 28)
    };
    
    // Sequestration data: tonnes of CO2 absorbed per hectare per year
    // This is highly simplified for this demo.
    const SEQUESTRATION_FACTORS = {
        "Barmer": { // Rajasthan - Arid species
            "Khejri": 7,
            "Neem": 9,
            "Rohida": 6
        },
        "Dhanbad": { // Jharkhand - More humid
            "Sal": 15,
            "Teak": 12,
            "Bamboo": 25
        }
    };

    const CURRENT_CARBON_CREDIT_RATE_USD = 15; // Mock price: $15 per tonne of CO2

    let currentMine = null; // Variable to keep track of the currently logged-in manager's mine

    // --- CORE FUNCTIONS --- //

    // Function to show a specific section and hide others
    window.showSection = (sectionId) => {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    };

    // Populate dropdowns on page load
    const populateDropdowns = () => {
        const mineLocationSelect = document.getElementById('mine-location');
        const treeSpeciesSelect = document.getElementById('tree-species');

        mineLocationSelect.addEventListener('change', () => {
            const selectedLocation = mineLocationSelect.value;
            treeSpeciesSelect.innerHTML = '<option value="">-- Select Dominant Tree Species --</option>'; // Clear previous options
            if (selectedLocation && SEQUESTRATION_FACTORS[selectedLocation]) {
                const species = Object.keys(SEQUESTRATION_FACTORS[selectedLocation]);
                species.forEach(s => {
                    const option = document.createElement('option');
                    option.value = s;
                    option.textContent = s;
                    treeSpeciesSelect.appendChild(option);
                });
            }
        });
    };
    
    // --- MANAGER FUNCTIONALITY --- //

    document.getElementById('manager-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        
        const mineName = document.getElementById('mine-name').value;
        const mineLocation = document.getElementById('mine-location').value;
        
        // Store mine details in our mock database
        MOCK_DATABASE.mines[mineName] = {
            manager: {
                name: document.getElementById('manager-name').value,
                email: document.getElementById('manager-email').value,
                contact: document.getElementById('manager-contact').value
            },
            details: {
                location: mineLocation,
                type: document.getElementById('mine-type').value,
                production: parseFloat(document.getElementById('annual-production').value),
                employees: parseInt(document.getElementById('num-employees').value)
            },
            emissionData: {},
            wasteData: {}
        };

        currentMine = mineName; // Set the current mine for this session
        
        // Welcome the manager and show the dashboard
        document.getElementById('manager-welcome').textContent = `Welcome, Manager of ${mineName}`;
        showSection('manager-dashboard');
        
        // Update other user views
        updatePublicSelects();
    });

    // Handle Carbon Emission Calculation
    document.getElementById('emission-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Get Inputs
        const diesel = parseFloat(document.getElementById('diesel-consumption').value);
        const electricity = parseFloat(document.getElementById('electricity-consumption').value);
        const methane = parseFloat(document.getElementById('methane-consumption').value);
        const hectares = parseFloat(document.getElementById('land-hectares').value);
        const species = document.getElementById('tree-species').value;
        const treeAge = parseFloat(document.getElementById('tree-age').value);

        // 2. Calculate Emissions
        const dieselEmissions = diesel * EMISSION_FACTORS.DIESEL_LITRE;
        const electricityEmissions = electricity * EMISSION_FACTORS.ELECTRICITY_KWH;
        const methaneEmissions = methane * EMISSION_FACTORS.METHANE_M3;
        const totalEmissions = dieselEmissions + electricityEmissions + methaneEmissions;
        const perCapitaEmissions = totalEmissions / MOCK_DATABASE.mines[currentMine].details.employees;
        
        // 3. Calculate Sequestration (Carbon Sink)
        const mineLocation = MOCK_DATABASE.mines[currentMine].details.location;
        const sequestrationFactor = SEQUESTRATION_FACTORS[mineLocation][species];
        // Simplified: sequestration increases with age up to a point. Let's cap at 20 years.
        const ageMultiplier = Math.min(treeAge / 20, 1); 
        const totalSequestration = hectares * sequestrationFactor * ageMultiplier;

        // 4. Gap Analysis
        const carbonGap = totalEmissions - totalSequestration;

        // Store results
        MOCK_DATABASE.mines[currentMine].emissionData = {
            totalEmissions: totalEmissions,
            totalSequestration: totalSequestration,
            carbonGap: carbonGap,
            perCapitaEmissions: perCapitaEmissions,
        };

        // 5. Generate AI Recommendations & Display Results
        const resultsDiv = document.getElementById('emission-results');
        let gapClass = carbonGap > 0 ? 'carbon-gap-positive' : 'carbon-gap-negative';
        let gapText = carbonGap > 0 ? `${carbonGap.toFixed(2)} tonnes of CO2e (Deficit)` : `${Math.abs(carbonGap).toFixed(2)} tonnes of CO2e (Surplus)`;

        // AI Suggestions
        let aiSuggestions = '';
        if (carbonGap > 0) {
            const hectaresNeeded = (carbonGap / sequestrationFactor).toFixed(2);
            aiSuggestions += `<h3>🎯 AI Recommendations for Carbon Neutrality</h3>
            <div class="ai-recommendations"><ul>`;

            // Afforestation
            aiSuggestions += `<li><strong>Afforestation:</strong> To offset the gap, you need to plant approximately <strong>${hectaresNeeded} more hectares</strong> of ${species} trees.</li>`;
            
            // Swadeshi Renewables (Atmanirbhar Bharat)
            if (mineLocation === 'Barmer') { // Rajasthan
                aiSuggestions += `<li><strong>Renewable Energy:</strong> Invest in solar plants from Indian companies like <strong>Adani Solar</strong> or <strong>Tata Power Solar</strong> to reduce grid electricity consumption. Rajasthan has excellent solar potential.</li>`;
            } else { // Jharkhand
                 aiSuggestions += `<li><strong>Renewable Energy:</strong> Explore options from Indian firms like <strong>Vikram Solar</strong>. Consider using mine-degraded land for solar farms.</li>`;
            }

            // EV Suggestions
            aiSuggestions += `<li><strong>Electric Vehicles (EVs):</strong> Replace diesel-powered transport vehicles with electric alternatives from Indian brands like <strong>Tata Motors (Electric)</strong> or <strong>Mahindra Electric</strong> to significantly cut diesel emissions.</li>`;
            
            aiSuggestions += `</ul></div>`;
        }
        
        // Carbon Credits
        const carbonCredits = carbonGap < 0 ? Math.abs(carbonGap) : 0;
        const potentialEarnings = carbonCredits * CURRENT_CARBON_CREDIT_RATE_USD;
        MOCK_DATABASE.mines[currentMine].emissionData.carbonCredits = carbonCredits;
        MOCK_DATABASE.mines[currentMine].emissionData.creditValue = potentialEarnings;

        resultsDiv.innerHTML = `
            <h3>Carbon Footprint Analysis Report</h3>
            <p><strong>Total Monthly Carbon Emissions:</strong> ${totalEmissions.toFixed(2)} tonnes of CO2e</p>
            <p><strong>Per Capita Emissions:</strong> ${perCapitaEmissions.toFixed(4)} tonnes of CO2e per employee</p>
            <p><strong>Total Annual Carbon Sequestration:</strong> ${totalSequestration.toFixed(2)} tonnes of CO2e</p>
            <p><strong>Net Carbon Gap:</strong> <span class="${gapClass}">${gapText}</span></p>
            <p><strong>Potential Carbon Credits Earned:</strong> ${carbonCredits.toFixed(2)} credits</p>
            <p><strong>Estimated Market Value:</strong> $${potentialEarnings.toFixed(2)} USD</p>
            ${aiSuggestions}
        `;
        resultsDiv.classList.remove('hidden');
    });

    // --- WASTE MANAGEMENT FUNCTIONALITY --- //

    // 1. Overburden
    document.getElementById('overburden-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const overburden = parseFloat(document.getElementById('overburden-produced').value);
        MOCK_DATABASE.mines[currentMine].wasteData.overburden = overburden;

        const mineLocation = MOCK_DATABASE.mines[currentMine].details.location;
        let speciesSuggestion = '';
        if (mineLocation === 'Barmer') {
            speciesSuggestion = 'drought-resistant species like <strong>Khejri, Neem, and native grasses</strong>';
        } else {
            speciesSuggestion = 'fast-growing native species like <strong>Bamboo and Sal</strong>';
        }
        
        const resultsDiv = document.getElementById('overburden-results');
        resultsDiv.innerHTML = `
            <h4>Overburden Analysis</h4>
            <p><strong>Annual Overburden:</strong> ${overburden} Tonnes</p>
            <div class="ai-recommendations">
            <p><strong>AI Recommendation:</strong> Use this overburden for land reclamation. A well-planned afforestation on this land is recommended. For your location (${mineLocation}), you should plant ${speciesSuggestion}. This supports ecological restoration and creates future carbon sinks.</p>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
    });
    
    // 2. Organic Waste
    document.getElementById('organic-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const organicWaste = parseFloat(document.getElementById('organic-waste').value);
        
        // Calculations (simplified formulas)
        const biogasProduction = organicWaste * 75; // 75 m^3 of biogas per tonne of waste
        const electricityGeneration = biogasProduction * 2; // 2 kWh of electricity per m^3 of biogas
        const emissionReduction = electricityGeneration * EMISSION_FACTORS.ELECTRICITY_KWH; // CO2e saved by not using grid power

        MOCK_DATABASE.mines[currentMine].wasteData.organic = {
            amount: organicWaste,
            biogas: biogasProduction,
            electricity: electricityGeneration,
            reduction: emissionReduction
        };

        const resultsDiv = document.getElementById('organic-results');
        resultsDiv.innerHTML = `
            <h4>Organic Waste to Energy Potential</h4>
            <p><strong>Annual Biogas Production:</strong> ${biogasProduction.toFixed(2)} cubic meters</p>
            <p><strong>Potential Electricity Generation:</strong> ${electricityGeneration.toFixed(2)} kWh per year</p>
            <p><strong>Annual Emission Reduction:</strong> ${emissionReduction.toFixed(2)} tonnes of CO2e</p>
        `;
        resultsDiv.classList.remove('hidden');
    });

    // 3. Inorganic Waste
    document.getElementById('inorganic-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const metal = parseFloat(document.getElementById('metal-waste').value);
        const plastic = parseFloat(document.getElementById('plastic-waste').value);
        const glass = parseFloat(document.getElementById('glass-waste').value);
        
        MOCK_DATABASE.mines[currentMine].wasteData.inorganic = { metal, plastic, glass };
        
        const resultsDiv = document.getElementById('inorganic-results');
        resultsDiv.innerHTML = `
            <h4>Inorganic Waste Logged</h4>
            <p><strong>Metal Waste:</strong> ${metal} Tonnes</p>
            <p><strong>Plastic Waste:</strong> ${plastic} Tonnes</p>
            <p><strong>Glass Waste:</strong> ${glass} Tonnes</p>
            <div class="ai-recommendations">
             <p><strong>AI Recommendation:</strong> Partner with local recycling units under the <strong>Swachh Bharat Mission</strong> to manage this waste effectively. This promotes a circular economy and proper sanitation.</p>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
    });

    // 4. Coal Rejects (FBC)
    document.getElementById('rejects-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const rejects = parseFloat(document.getElementById('coal-rejects').value);

        // Calculation: 1 tonne of rejects generates ~1 MWh (1000 kWh) via FBC
        const electricityFromRejects = rejects * 1000;
        MOCK_DATABASE.mines[currentMine].wasteData.rejects = {
            amount: rejects,
            electricity: electricityFromRejects
        };

        const resultsDiv = document.getElementById('rejects-results');
        resultsDiv.innerHTML = `
            <h4>Coal Rejects to Energy (FBC)</h4>
            <p><strong>Potential Electricity Generation:</strong> ${electricityFromRejects.toFixed(2)} kWh per year</p>
            <div class="ai-recommendations">
             <p><strong>AI Recommendation:</strong> Using Fluidized Bed Combustion (FBC) technology to convert waste coal rejects into energy is a key part of waste-to-wealth. This reduces waste and generates power for mine operations, supporting <strong>Atmanirbhar Bharat's</strong> energy goals.</p>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
    });


    // --- OTHER USER ROLES --- //

    const updatePublicSelects = () => {
        const mineNames = Object.keys(MOCK_DATABASE.mines);
        const ownerSelect = document.getElementById('owner-mine-select');
        const userSelect = document.getElementById('user-mine-select');
        
        ownerSelect.innerHTML = '<option value="">-- Select Your Mine --</option>';
        userSelect.innerHTML = '<option value="">-- Select Mine to View --</option>';

        mineNames.forEach(name => {
            ownerSelect.innerHTML += `<option value="${name}">${name}</option>`;
            userSelect.innerHTML += `<option value="${name}">${name}</option>`;
        });
    };
    
    // Owner View
    document.getElementById('owner-view-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const mineName = document.getElementById('owner-mine-select').value;
        const mine = MOCK_DATABASE.mines[mineName];
        const dashboard = document.getElementById('owner-dashboard');

        if (mine) {
            dashboard.innerHTML = `
                <h2>Dashboard for ${mineName}</h2>
                <div class="results-box">
                    <h3>Carbon Footprint Summary</h3>
                    <p><strong>Total Emissions:</strong> ${mine.emissionData.totalEmissions?.toFixed(2) ?? 'N/A'} tCO2e</p>
                    <p><strong>Total Sequestration:</strong> ${mine.emissionData.totalSequestration?.toFixed(2) ?? 'N/A'} tCO2e</p>
                    <p><strong>Carbon Credits Earned:</strong> ${mine.emissionData.carbonCredits?.toFixed(2) ?? 'N/A'}</p>
                    <p><strong>Potential Credit Value:</strong> $${mine.emissionData.creditValue?.toFixed(2) ?? 'N/A'}</p>
                </div>
                 <div class="results-box">
                    <h3>Waste Management Summary</h3>
                    <p><strong>Organic Waste to Energy:</strong> ${mine.wasteData.organic?.electricity.toFixed(2) ?? 'N/A'} kWh/year</p>
                    <p><strong>Coal Rejects to Energy:</strong> ${mine.wasteData.rejects?.electricity.toFixed(2) ?? 'N/A'} kWh/year</p>
                </div>
                <button type="button" onclick="showSection('owner-login')">Back</button>
            `;
            showSection('owner-dashboard');
        }
    });

    // Government View
    document.getElementById('gov-view-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const district = document.getElementById('gov-district-select').value;
        const dashboard = document.getElementById('gov-dashboard');
        
        let reportHTML = `<h2>Report for ${district} District</h2>`;
        let districtTotalEmissions = 0;
        let districtTotalSequestration = 0;

        Object.values(MOCK_DATABASE.mines).filter(mine => mine.details.location === district).forEach(mine => {
             const mineName = Object.keys(MOCK_DATABASE.mines).find(key => MOCK_DATABASE.mines[key] === mine);
             districtTotalEmissions += mine.emissionData.totalEmissions || 0;
             districtTotalSequestration += mine.emissionData.totalSequestration || 0;

             reportHTML += `
                <div class="results-box">
                    <h4>${mineName}</h4>
                    <p>Emissions: ${mine.emissionData.totalEmissions?.toFixed(2) ?? 'N/A'} tCO2e | Sequestration: ${mine.emissionData.totalSequestration?.toFixed(2) ?? 'N/A'} tCO2e | Credits: ${mine.emissionData.carbonCredits?.toFixed(2) ?? 'N/A'}</p>
                </div>
             `;
        });
        
        reportHTML += `
            <div class="results-box" style="background-color: #d4e6f1;">
                <h3>District Totals</h3>
                <p><strong>Total Emissions:</strong> ${districtTotalEmissions.toFixed(2)} tCO2e</p>
                <p><strong>Total Sequestration:</strong> ${districtTotalSequestration.toFixed(2)} tCO2e</p>
            </div>
            <button type="button" onclick="showSection('gov-login')">Back</button>
        `;

        dashboard.innerHTML = reportHTML;
        showSection('gov-dashboard');
    });

    // Public User View
    document.getElementById('user-view-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const mineName = document.getElementById('user-mine-select').value;
        const mine = MOCK_DATABASE.mines[mineName];
        const dashboard = document.getElementById('user-dashboard');
        
        if (mine) {
             dashboard.innerHTML = `
                <h2>Public Data for ${mineName}</h2>
                <div class="results-box">
                    <p><strong>Total Emissions:</strong> ${mine.emissionData.totalEmissions?.toFixed(2) ?? 'Data not available'} tCO2e</p>
                    <p><strong>Total Sequestration (via Afforestation):</strong> ${mine.emissionData.totalSequestration?.toFixed(2) ?? 'Data not available'} tCO2e</p>
                    <p><strong>Inorganic Waste Management (Annual):</strong> 
                        <ul>
                            <li>Metal: ${mine.wasteData.inorganic?.metal ?? 'N/A'} Tonnes</li>
                            <li>Plastic: ${mine.wasteData.inorganic?.plastic ?? 'N/A'} Tonnes</li>
                            <li>Glass: ${mine.wasteData.inorganic?.glass ?? 'N/A'} Tonnes</li>
                        </ul>
                    </p>
                    <p><strong>Carbon Credits Generated:</strong> ${mine.emissionData.carbonCredits?.toFixed(2) ?? 'Data not available'}</p>
                </div>
                <button type="button" onclick="showSection('user-login')">Back</button>
            `;
            showSection('user-dashboard');
        }
    });

    // --- INITIALIZATION --- //
    populateDropdowns();
    updatePublicSelects();
    showSection('login-section'); // Show login screen on start
});