<template>
  <div class="container mt-4">
    <h2 class="mb-4">Female Health Data - BMI vs Age Relationship</h2>

    <!-- Analysis Summary -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="analysis-card">
          <h5>Total Records</h5>
          <p class="number">{{ totalRecords }}</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="analysis-card">
          <h5>Correlation</h5>
          <p class="number">{{ correlation.toFixed(3) }}</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="analysis-card">
          <h5>Age Range</h5>
          <p class="number">{{ ageRange }}</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="analysis-card">
          <h5>BMI Range</h5>
          <p class="number">{{ bmiRange }}</p>
        </div>
      </div>
    </div>

    <!-- Chart Controls -->
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label">Show Trend Line:</label>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="showTrendLine" @change="updateChart">
          <label class="form-check-label">Display trend line</label>
        </div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Age Group Analysis:</label>
        <select class="form-select" v-model="selectedAgeGroup" @change="updateChart">
          <option value="all">All Ages</option>
          <option value="young">18-30 years</option>
          <option value="middle">31-50 years</option>
          <option value="senior">51+ years</option>
        </select>
      </div>
    </div>

    <canvas id="bmiAgeChart" height="120"></canvas>

    <!-- Age Group Statistics -->
    <div class="row mt-4">
      <div class="col-md-4" v-for="group in ageGroupStats" :key="group.name">
        <div class="stats-card">
          <h6>{{ group.name }}</h6>
          <p><strong>Count:</strong> {{ group.count }}</p>
          <p><strong>Avg BMI:</strong> {{ group.avgBmi.toFixed(2) }}</p>
          <p><strong>BMI Range:</strong> {{ group.bmiRange }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import { fetchHealthFemaleData } from '@/api/healthData'

// Reactive data
const rawData = ref([])
const showTrendLine = ref(false)
const selectedAgeGroup = ref('all')
let chart = null

// Computed properties for analysis
const totalRecords = computed(() => rawData.value.length)

const correlation = computed(() => {
  if (rawData.value.length < 2) return 0

  const n = rawData.value.length
  const sumX = rawData.value.reduce((sum, item) => sum + item.age, 0)
  const sumY = rawData.value.reduce((sum, item) => sum + item.bmi, 0)
  const sumXY = rawData.value.reduce((sum, item) => sum + item.age * item.bmi, 0)
  const sumX2 = rawData.value.reduce((sum, item) => sum + item.age * item.age, 0)
  const sumY2 = rawData.value.reduce((sum, item) => sum + item.bmi * item.bmi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
})

const ageRange = computed(() => {
  if (rawData.value.length === 0) return 'N/A'
  const ages = rawData.value.map(item => item.age)
  return `${Math.min(...ages)}-${Math.max(...ages)}`
})

const bmiRange = computed(() => {
  if (rawData.value.length === 0) return 'N/A'
  const bmis = rawData.value.map(item => item.bmi)
  return `${Math.min(...bmis).toFixed(1)}-${Math.max(...bmis).toFixed(1)}`
})

const ageGroupStats = computed(() => {
  const groups = [
    { name: 'Young (18-30)', min: 18, max: 30 },
    { name: 'Middle (31-50)', min: 31, max: 50 },
    { name: 'Senior (51+)', min: 51, max: 100 }
  ]

  return groups.map(group => {
    const groupData = rawData.value.filter(item => item.age >= group.min && item.age <= group.max)
    const bmis = groupData.map(item => item.bmi)

    return {
      name: group.name,
      count: groupData.length,
      avgBmi: groupData.length > 0 ? bmis.reduce((sum, bmi) => sum + bmi, 0) / groupData.length : 0,
      bmiRange: bmis.length > 0 ? `${Math.min(...bmis).toFixed(1)}-${Math.max(...bmis).toFixed(1)}` : 'N/A'
    }
  })
})

// Filter data based on selected age group
const filteredData = computed(() => {
  if (selectedAgeGroup.value === 'all') return rawData.value

  const ageRanges = {
    young: { min: 18, max: 30 },
    middle: { min: 31, max: 50 },
    senior: { min: 51, max: 100 }
  }

  const range = ageRanges[selectedAgeGroup.value]
  return rawData.value.filter(item => item.age >= range.min && item.age <= range.max)
})

// Calculate trend line
const calculateTrendLine = (data) => {
  if (data.length < 2) return []

  const n = data.length
  const sumX = data.reduce((sum, item) => sum + item.x, 0)
  const sumY = data.reduce((sum, item) => sum + item.y, 0)
  const sumXY = data.reduce((sum, item) => sum + item.x * item.y, 0)
  const sumX2 = data.reduce((sum, item) => sum + item.x * item.x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const minX = Math.min(...data.map(item => item.x))
  const maxX = Math.max(...data.map(item => item.x))

  return [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept }
  ]
}

// Update chart function
const updateChart = () => {
  if (!chart) return

  const chartData = filteredData.value.map(item => ({
    x: item.age,
    y: item.bmi
  }))

  const datasets = [{
    label: 'BMI vs Age',
    data: chartData,
    backgroundColor: 'rgba(255, 99, 132, 0.6)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1,
    pointRadius: 4,
    pointHoverRadius: 6
  }]

  if (showTrendLine.value && chartData.length > 1) {
    const trendData = calculateTrendLine(chartData)
    datasets.push({
      label: 'Trend Line',
      data: trendData,
      type: 'line',
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      fill: false
    })
  }

  chart.data.datasets = datasets
  chart.update()
}

onMounted(async () => {
  const data = await fetchHealthFemaleData()

  // Filter data with both age and BMI
  rawData.value = data.filter(item => item.age && item.bmi)

  // Sort by age for better visualization
  rawData.value.sort((a, b) => a.age - b.age)

  // Create scatter plot
  chart = new Chart(document.getElementById('bmiAgeChart'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'BMI vs Age',
        data: filteredData.value.map(item => ({
          x: item.age,
          y: item.bmi
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'BMI vs Age Relationship in Female Health Data'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Age: ${context.parsed.x}, BMI: ${context.parsed.y.toFixed(2)}`
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Age (years)'
          },
          beginAtZero: false
        },
        y: {
          title: {
            display: true,
            text: 'BMI'
          },
          beginAtZero: true
        }
      },
      interaction: {
        intersect: false,
        mode: 'point'
      }
    }
  })
})
</script>

<style scoped>
.container {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #d4a5c7;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(212, 165, 199, 0.3);
  border-bottom: 3px solid #d4a5c7;
  padding-bottom: 0.5rem;
}

.analysis-card {
  background: linear-gradient(135deg, #d4a5c7, #c8a2c8);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(212, 165, 199, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(212, 165, 199, 0.4);
}

.analysis-card h5 {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.analysis-card .number {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

.stats-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #d4a5c7;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-card h6 {
  color: #d4a5c7;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.stats-card p {
  margin-bottom: 0.5rem;
  color: #666;
}

.form-label {
  color: #d4a5c7;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-check-input:checked {
  background-color: #d4a5c7;
  border-color: #d4a5c7;
}

.form-select {
  border-color: #d4a5c7;
}

.form-select:focus {
  border-color: #d4a5c7;
  box-shadow: 0 0 0 0.2rem rgba(212, 165, 199, 0.25);
}

canvas {
  max-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
