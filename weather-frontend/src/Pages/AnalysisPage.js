import React, { useState } from 'react';
import { Button, Typography, Card, CardContent, Grid, MenuItem, Select, FormControl, InputLabel} from '@mui/material';

function AnalysisPage() {
    const [graph, setGraph] = useState(null);
    const [description, setDescription] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [groupByMonth, setGroupByMonth] = useState(false);

    const options = [
        { 
            label: 'Wind Distribution', 
            feature: 'wind', 
            plotType: 'box', 
            description: 'Shows how wind speeds are distributed. 🌬️ The boxplot helps identify typical and extreme wind conditions.' 
        },
        { 
            label: 'Weather Distribution', 
            feature: 'weather', 
            plotType: 'hist', 
            description: 'Shows how often each type of weather occurs. ☀️🌧️ A histogram gives a clear frequency count.' 
        },
        { 
            label: 'Temperature Distribution', 
            feature: 'temp_max', 
            plotType: 'box', 
            description: 'Displays the spread and outliers in maximum daily temperatures. 🔥❄️ Useful for spotting extreme hot or cold days.' 
        },
        { 
            label: 'Precipitation Distribution', 
            feature: 'precipitation', 
            plotType: 'box', 
            description: 'Shows how precipitation amounts vary. ☔ Helpful to understand rainy vs dry patterns.' 
        },
    ];

    const handleGenerate = async () => {
        const selected = options.find(opt => opt.label === selectedOption);
        if (!selected) return;
    
        const response = await fetch('http://localhost:5000/generate-graph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                feature: selected.feature, 
                plot_type: selected.plotType,
                group_by_month: groupByMonth
            })
        });
    
        const data = await response.json();
        const graphUrl = `http://localhost:5000/graphs/${data.filename}`;
    
        setGraph(graphUrl); 
        setDescription(selected.description);
    
        setTimeout(async () => {
            await fetch(`http://localhost:5000/delete-graph/${data.filename}`, {
                method: 'DELETE',
            });
        }, 3000);
    };

    

    return (
        <div style={{ padding: '30px' }}>
            <Typography variant="h3" gutterBottom>Weather Data Analysis 📊</Typography>

            {/* Dropdown for selecting analysis */}
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel>Select Analysis Option</InputLabel>
                <Select
                    value={selectedOption}
                    label="Select Analysis Option"
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    {options.map((option, idx) => (
                        <MenuItem key={idx} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Dropdown for Grouping */}
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel>Group by Month?</InputLabel>
                <Select
                    value={groupByMonth}
                    label="Group by Month?"
                    onChange={(e) => setGroupByMonth(e.target.value === 'true')}
                >
                    <MenuItem value={'false'}>No</MenuItem>
                    <MenuItem value={'true'}>Yes</MenuItem>
                </Select>
            </FormControl>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGenerate}
                disabled={!selectedOption}
            >
                Generate Graph
            </Button>

            {/* Display graph and description */}
            {graph && (
                <Grid container spacing={4} style={{ marginTop: '30px' }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent style={{ textAlign: 'center' }}>
                                <img src={graph} alt="Weather Graph" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
                                <Typography variant="body1" style={{ marginTop: '15px' }}>
                                    {description}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </div>
    );
}

export default AnalysisPage;
