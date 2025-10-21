<template>
  <div class="container my-4 macaron-theme">
    <!-- Hero Section -->
    <section class="hero-card gradient-hero p-5 mb-4">
      <div class="row align-items-center">
        <div class="col-12">
          <h1 class="display-5 fw-bold mb-3 title-shadow">Data Insight</h1>
          <p class="lead text-body-emphasis mb-4">
            Comprehensive analysis of female health and lifestyle data with advanced filtering and visualization
          </p>
          <div class="d-flex gap-3">
            <div class="pill peach"></div>
            <div class="pill pink"></div>
            <div class="pill lavender"></div>
            <div class="pill blue"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Female Health Overview Table -->
    <section class="mb-5">
      <div class="card-soft p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="table-title mb-0" style="color: #d4a5c7 !important;">Female Health Data</h2>
          <button
            @click="exportHealthToCSV"
            class="btn btn-primary btn-sm export-btn"
            aria-label="Export health data to CSV file"
            title="Export to CSV"
          >
            <i class="bi bi-download me-1"></i>Export CSV
          </button>
        </div>
        <p class="visually-hidden" id="health-sort-instructions">
          This table is sortable. Use Tab to navigate to column headers, then press Enter or Space to sort by that column.
          Press again to reverse the sort order. Currently sorted by {{ healthSortKey }} in {{ healthSortAsc ? 'ascending' : 'descending' }} order.
        </p>

      <!-- Global Search -->
      <div class="row mb-3">
        <div class="col-md-8">
          <label for="global-search-health" class="form-label visually-hidden">Global search for health data</label>
          <div class="d-flex gap-2">
            <input
              id="global-search-health"
              type="text"
              v-model="healthSearchQuery"
              class="form-control"
              placeholder="Global search..."
              aria-label="Search across all health data fields"
              aria-describedby="search-help-health"
            />
            <button
              @click="clearHealthFilters"
              class="btn btn-primary clear-btn"
              aria-label="Clear all health table filters and search"
              title="Clear All Filters"
            >
              Clear All
            </button>
          </div>
          <div id="search-help-health" class="form-text">Search across age, BMI, sleep hours, heart rate, and blood pressure</div>
        </div>
        <div class="col-md-4">
          <div class="d-flex justify-content-end align-items-center" role="status" aria-live="polite">
            <span class="badge bg-info me-2" aria-label="Total filtered results">{{ healthFilteredData.length }} results</span>
            <span class="badge bg-success" aria-label="Current page information">Page {{ healthCurrentPage }} of {{ healthTotalPages }}</span>
          </div>
        </div>
      </div>

      <!-- Health Data table -->
      <div class="table-responsive">
        <table
          class="table table-striped table-bordered table-hover"
          role="table"
          aria-label="Female Health Overview Data Table"
          aria-describedby="table-description-health health-sort-instructions"
        >
          <caption id="table-description-health" class="visually-hidden">
            Interactive table showing female health data including age, BMI, sleep hours, heart rate, and blood pressure.
            Use column headers to sort data. Use filters below headers to narrow results.
            Currently showing {{ healthFilteredData.length }} of {{ healthRawData.length }} total records.
          </caption>
          <thead class="table-dark">
            <tr role="row">
              <th
                @click="healthSortBy('age')"
                @keydown.enter="healthSortBy('age')"
                @keydown.space.prevent="healthSortBy('age')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="healthSortKey === 'age' ? (healthSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Age column, click to sort ascending or descending"
              >
                Age (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="healthSortKey === 'age'" :class="healthSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="healthSortBy('bmi')"
                @keydown.enter="healthSortBy('bmi')"
                @keydown.space.prevent="healthSortBy('bmi')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="healthSortKey === 'bmi' ? (healthSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="BMI column, click to sort ascending or descending"
              >
                BMI (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="healthSortKey === 'bmi'" :class="healthSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="healthSortBy('hours_of_sleep')"
                @keydown.enter="healthSortBy('hours_of_sleep')"
                @keydown.space.prevent="healthSortBy('hours_of_sleep')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="healthSortKey === 'hours_of_sleep' ? (healthSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Sleep hours column, click to sort"
              >
                Sleep (hrs) (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="healthSortKey === 'hours_of_sleep'" :class="healthSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="healthSortBy('heart_rate')"
                @keydown.enter="healthSortBy('heart_rate')"
                @keydown.space.prevent="healthSortBy('heart_rate')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="healthSortKey === 'heart_rate' ? (healthSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Heart rate column, click to sort"
              >
                Heart Rate (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="healthSortKey === 'heart_rate'" :class="healthSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="healthSortBy('blood_pressure')"
                @keydown.enter="healthSortBy('blood_pressure')"
                @keydown.space.prevent="healthSortBy('blood_pressure')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="healthSortKey === 'blood_pressure' ? (healthSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Blood pressure column, click to sort"
              >
                Blood Pressure (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="healthSortKey === 'blood_pressure'" :class="healthSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
            </tr>
            <!-- Column filters -->
            <tr class="table-light" role="row">
              <th role="columnheader">
                <label for="filter-age-health" class="visually-hidden">Filter by Age</label>
                <input
                  id="filter-age-health"
                  type="number"
                  v-model="healthColumnFilters.age"
                  class="form-control form-control-sm"
                  placeholder="Filter Age..."
                  aria-label="Filter table by age"
                  @input="applyHealthColumnFilter"
                />
              </th>
              <th role="columnheader">
                <label for="filter-bmi-health" class="visually-hidden">Filter by BMI</label>
                <select
                  id="filter-bmi-health"
                  v-model="healthColumnFilters.bmi"
                  class="form-select form-select-sm"
                  aria-label="Filter table by BMI category"
                  @change="applyHealthColumnFilter"
                >
                  <option value="">All BMI</option>
                  <option value="underweight">Underweight (&lt;18.5)</option>
                  <option value="normal">Normal (18.5-23.9)</option>
                  <option value="overweight">Overweight (24-27.9)</option>
                  <option value="obese">Obese (28-34.9)</option>
                  <option value="severely-obese">Severely Obese (&gt;=35)</option>
                </select>
              </th>
              <th role="columnheader">
                <label for="filter-sleep-health" class="visually-hidden">Filter by Sleep Category</label>
                <select
                  id="filter-sleep-health"
                  v-model="healthColumnFilters.hours_of_sleep"
                  class="form-select form-select-sm"
                  aria-label="Filter table by sleep category"
                  @change="applyHealthColumnFilter"
                >
                  <option value="">All Sleep</option>
                  <option value="low">Low (&lt;6h)</option>
                  <option value="medium">Medium (6-8h)</option>
                  <option value="high">High (&gt;=8h)</option>
                </select>
              </th>
              <th role="columnheader">
                <label for="filter-heart-rate-health" class="visually-hidden">Filter by Heart Rate Category</label>
                <select
                  id="filter-heart-rate-health"
                  v-model="healthColumnFilters.heart_rate"
                  class="form-select form-select-sm"
                  aria-label="Filter table by heart rate category"
                  @change="applyHealthColumnFilter"
                >
                  <option value="">All Heart Rate</option>
                  <option value="low">Low (&lt;60)</option>
                  <option value="medium">Medium (60-100)</option>
                  <option value="high">High (&gt;=100)</option>
                </select>
              </th>
              <th role="columnheader">
                <label for="filter-bp-health" class="visually-hidden">Filter by Blood Pressure</label>
                <input
                  id="filter-bp-health"
                  type="text"
                  v-model="healthColumnFilters.blood_pressure"
                  class="form-control form-control-sm"
                  placeholder="Filter BP..."
                  aria-label="Filter table by blood pressure"
                  @input="applyHealthColumnFilter"
                />
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            <tr
              v-for="(row, index) in healthPaginatedData"
              :key="row.id"
              role="row"
              :aria-rowindex="index + 1"
            >
              <td role="cell" :aria-label="`Age: ${row.age || 'N/A'}`">{{ row.age || 'N/A' }}</td>
              <td role="cell" :aria-label="`BMI: ${row.bmi || 'N/A'} - ${getBMICategory(row.bmi)}`">
                <div class="bmi-cell">
                  <div class="bmi-value">{{ row.bmi || 'N/A' }}</div>
                  <div class="bmi-category" :class="getBMICategoryClass(row.bmi)">{{ getBMICategory(row.bmi) }}</div>
                </div>
              </td>
              <td role="cell" :aria-label="`Sleep hours: ${row.hours_of_sleep || 'N/A'} - ${getSleepCategory(row.hours_of_sleep)}`">
                <div class="sleep-cell">
                  <div class="sleep-value">{{ row.hours_of_sleep || 'N/A' }}</div>
                  <div class="sleep-category" :class="getSleepCategoryClass(row.hours_of_sleep)">{{ getSleepCategory(row.hours_of_sleep) }}</div>
                </div>
              </td>
              <td role="cell" :aria-label="`Heart rate: ${row.heart_rate || 'N/A'} - ${getHeartRateCategory(row.heart_rate)}`">
                <div class="heart-rate-cell">
                  <div class="heart-rate-value">{{ row.heart_rate || 'N/A' }}</div>
                  <div class="heart-rate-category" :class="getHeartRateCategoryClass(row.heart_rate)">{{ getHeartRateCategory(row.heart_rate) }}</div>
                </div>
              </td>
              <td role="cell" :aria-label="`Blood pressure: ${row.blood_pressure || 'N/A'}`">{{ row.blood_pressure || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Health Pagination -->
      <nav aria-label="Health table pagination">
        <ul class="pagination" role="menubar">
          <li
            class="page-item"
            :class="{ disabled: healthCurrentPage === 1 }"
            role="none"
          >
            <button
              class="page-link"
              :disabled="healthCurrentPage === 1"
              @click="healthPreviousGroup"
              @keydown.enter="healthPreviousGroup"
              aria-label="Go to previous group of pages"
              :aria-disabled="healthCurrentPage === 1"
            >
              Previous
            </button>
          </li>

          <li
            v-for="page in healthPaginationPages"
            :key="page"
            class="page-item"
            :class="{ active: healthCurrentPage === page }"
            role="none"
          >
            <button
              class="page-link"
              @click="healthCurrentPage = page"
              @keydown.enter="healthCurrentPage = page"
              :aria-label="`Go to page ${page}`"
              :aria-current="healthCurrentPage === page ? 'page' : undefined"
            >
              {{ page }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: healthCurrentPage === healthTotalPages }"
            role="none"
          >
            <button
              class="page-link"
              :disabled="healthCurrentPage === healthTotalPages"
              @click="healthNextGroup"
              @keydown.enter="healthNextGroup"
              aria-label="Go to next group of pages"
              :aria-disabled="healthCurrentPage === healthTotalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      </div>
    </section>

    <!-- Female Lifestyle Table -->
    <section class="mb-5">
      <div class="card-soft p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="table-title mb-0" style="color: #d4a5c7 !important;">Female Lifestyle</h2>
          <button
            @click="exportLifestyleToCSV"
            class="btn btn-primary btn-sm export-btn"
            aria-label="Export lifestyle data to CSV file"
            title="Export to CSV"
          >
            <i class="bi bi-download me-1"></i>Export CSV
          </button>
        </div>
        <p class="visually-hidden" id="lifestyle-sort-instructions">
          This table is sortable. Use Tab to navigate to column headers, then press Enter or Space to sort by that column.
          Press again to reverse the sort order. Currently sorted by {{ lifestyleSortKey }} in {{ lifestyleSortAsc ? 'ascending' : 'descending' }} order.
        </p>

      <!-- Global Search -->
      <div class="row mb-3">
        <div class="col-md-8">
          <label for="global-search-lifestyle" class="form-label visually-hidden">Global search for lifestyle data</label>
          <div class="d-flex gap-2">
            <input
              id="global-search-lifestyle"
              type="text"
              v-model="lifestyleSearchQuery"
              class="form-control"
              placeholder="Global search..."
              aria-label="Search across all lifestyle data fields"
              aria-describedby="search-help-lifestyle"
            />
            <button
              @click="clearLifestyleFilters"
              class="btn btn-primary clear-btn"
              aria-label="Clear all lifestyle table filters and search"
              title="Clear All Filters"
            >
              Clear All
            </button>
          </div>
          <div id="search-help-lifestyle" class="form-text">Search across age, smoking status, alcohol consumption, daily steps, exercise hours, and calories</div>
        </div>
        <div class="col-md-4">
          <div class="d-flex justify-content-end align-items-center" role="status" aria-live="polite">
            <span class="badge bg-info me-2" aria-label="Total filtered results">{{ lifestyleFilteredData.length }} results</span>
            <span class="badge bg-success" aria-label="Current page information">Page {{ lifestyleCurrentPage }} of {{ lifestyleTotalPages }}</span>
          </div>
        </div>
      </div>

      <!-- Lifestyle Table -->
      <div class="table-responsive">
        <table
          class="table table-striped table-bordered table-hover"
          role="table"
          aria-label="Female Lifestyle & Risk Factors Data Table"
          aria-describedby="table-description-lifestyle lifestyle-sort-instructions"
        >
          <caption id="table-description-lifestyle" class="visually-hidden">
            Interactive table showing female lifestyle data including age, smoking status, alcohol consumption, daily steps, exercise hours, and calories.
            Use column headers to sort data. Use filters below headers to narrow results.
            Currently showing {{ lifestyleFilteredData.length }} of {{ lifestyleRawData.length }} total records.
          </caption>
          <thead class="table-dark">
            <tr role="row">
              <th
                @click="lifestyleSortBy('age')"
                @keydown.enter="lifestyleSortBy('age')"
                @keydown.space.prevent="lifestyleSortBy('age')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="lifestyleSortKey === 'age' ? (lifestyleSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Age column, click to sort ascending or descending"
              >
                Age (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="lifestyleSortKey === 'age'" :class="lifestyleSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="lifestyleSortBy('smoker')"
                @keydown.enter="lifestyleSortBy('smoker')"
                @keydown.space.prevent="lifestyleSortBy('smoker')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="lifestyleSortKey === 'smoker' ? (lifestyleSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Smoking status column, click to sort"
              >
                Smoking (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="lifestyleSortKey === 'smoker'" :class="lifestyleSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="lifestyleSortBy('alcohol_consumption_per_week')"
                @keydown.enter="lifestyleSortBy('alcohol_consumption_per_week')"
                @keydown.space.prevent="lifestyleSortBy('alcohol_consumption_per_week')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="lifestyleSortKey === 'alcohol_consumption_per_week' ? (lifestyleSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Alcohol consumption per week column, click to sort"
              >
                Alcohol/Week (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="lifestyleSortKey === 'alcohol_consumption_per_week'" :class="lifestyleSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="lifestyleSortBy('daily_steps')"
                @keydown.enter="lifestyleSortBy('daily_steps')"
                @keydown.space.prevent="lifestyleSortBy('daily_steps')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="lifestyleSortKey === 'daily_steps' ? (lifestyleSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Daily steps column, click to sort"
              >
                Daily Steps (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="lifestyleSortKey === 'daily_steps'" :class="lifestyleSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="lifestyleSortBy('exercise_hours_per_week')"
                @keydown.enter="lifestyleSortBy('exercise_hours_per_week')"
                @keydown.space.prevent="lifestyleSortBy('exercise_hours_per_week')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="lifestyleSortKey === 'exercise_hours_per_week' ? (lifestyleSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Exercise hours per week column, click to sort"
              >
                Exercise (hrs/week) (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="lifestyleSortKey === 'exercise_hours_per_week'" :class="lifestyleSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
              <th
                @click="lifestyleSortBy('calories_intake')"
                @keydown.enter="lifestyleSortBy('calories_intake')"
                @keydown.space.prevent="lifestyleSortBy('calories_intake')"
                class="sortable"
                role="columnheader"
                tabindex="0"
                :aria-sort="lifestyleSortKey === 'calories_intake' ? (lifestyleSortAsc ? 'ascending' : 'descending') : 'none'"
                aria-label="Calories intake column, click to sort"
              >
                Calories (Sort)
                <span class="sort-indicator" aria-hidden="true">
                  <i v-if="lifestyleSortKey === 'calories_intake'" :class="lifestyleSortAsc ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="active-sort"></i>
                  <i v-else class="bi bi-arrow-up-down inactive-sort"></i>
                </span>
              </th>
            </tr>
            <!-- Column filters -->
            <tr class="table-light" role="row">
              <th role="columnheader">
                <label for="filter-age-lifestyle" class="visually-hidden">Filter by Age</label>
                <input
                  id="filter-age-lifestyle"
                  type="number"
                  v-model="lifestyleColumnFilters.age"
                  class="form-control form-control-sm"
                  placeholder="Filter Age..."
                  aria-label="Filter table by age"
                  @input="applyLifestyleColumnFilter"
                />
              </th>
              <th role="columnheader">
                <label for="filter-smoker" class="visually-hidden">Filter by Smoking Status</label>
                <select
                  id="filter-smoker"
                  v-model="lifestyleColumnFilters.smoker"
                  class="form-select form-select-sm"
                  aria-label="Filter table by smoking status"
                  @change="applyLifestyleColumnFilter"
                >
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </th>
              <th role="columnheader">
                <label for="filter-alcohol-lifestyle" class="visually-hidden">Filter by Alcohol Category</label>
                <select
                  id="filter-alcohol-lifestyle"
                  v-model="lifestyleColumnFilters.alcohol_consumption_per_week"
                  class="form-select form-select-sm"
                  aria-label="Filter table by alcohol category"
                  @change="applyLifestyleColumnFilter"
                >
                  <option value="">All Alcohol</option>
                  <option value="none">None (0)</option>
                  <option value="light">Light (1-7)</option>
                  <option value="moderate">Moderate (8-14)</option>
                  <option value="heavy">Heavy (&gt;14)</option>
                </select>
              </th>
              <th role="columnheader">
                <label for="filter-steps" class="visually-hidden">Filter by Steps Category</label>
                <select
                  id="filter-steps"
                  v-model="lifestyleColumnFilters.daily_steps"
                  class="form-select form-select-sm"
                  aria-label="Filter table by steps category"
                  @change="applyLifestyleColumnFilter"
                >
                  <option value="">All Steps</option>
                  <option value="low">Low (&lt;5k)</option>
                  <option value="medium">Medium (5k-10k)</option>
                  <option value="high">High (&gt;=10k)</option>
                </select>
              </th>
              <th role="columnheader">
                <label for="filter-exercise" class="visually-hidden">Filter by Exercise Category</label>
                <select
                  id="filter-exercise"
                  v-model="lifestyleColumnFilters.exercise_hours_per_week"
                  class="form-select form-select-sm"
                  aria-label="Filter table by exercise category"
                  @change="applyLifestyleColumnFilter"
                >
                  <option value="">All Exercise</option>
                  <option value="low">Low (&lt;2h)</option>
                  <option value="medium">Medium (2-5h)</option>
                  <option value="high">High (&gt;=5h)</option>
                </select>
              </th>
              <th role="columnheader">
                <label for="filter-calories" class="visually-hidden">Filter by Calories Category</label>
                <select
                  id="filter-calories"
                  v-model="lifestyleColumnFilters.calories_intake"
                  class="form-select form-select-sm"
                  aria-label="Filter table by calories category"
                  @change="applyLifestyleColumnFilter"
                >
                  <option value="">All Calories</option>
                  <option value="low">Low (&lt;1200)</option>
                  <option value="medium">Medium (1200-2000)</option>
                  <option value="high">High (&gt;=2000)</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            <tr
              v-for="(row, index) in lifestylePaginatedData"
              :key="row.id"
              role="row"
              :aria-rowindex="index + 1"
            >
              <td role="cell" :aria-label="`Age: ${row.age || 'N/A'}`">{{ row.age || 'N/A' }}</td>
              <td role="cell" :aria-label="`Smoking status: ${row.smoker || 'No Data'}`">{{ row.smoker || 'No Data' }}</td>
              <td role="cell" :aria-label="`Alcohol consumption per week: ${row.alcohol_consumption_per_week ?? 0} - ${getAlcoholCategory(row.alcohol_consumption_per_week)}`">
                <div class="alcohol-cell">
                  <div class="alcohol-value">{{ row.alcohol_consumption_per_week ?? 0 }}</div>
                  <div class="alcohol-category" :class="getAlcoholCategoryClass(row.alcohol_consumption_per_week)">{{ getAlcoholCategory(row.alcohol_consumption_per_week) }}</div>
                </div>
              </td>
              <td role="cell" :aria-label="`Daily steps: ${row.daily_steps || 'N/A'} - ${getStepsCategory(row.daily_steps)}`">
                <div class="steps-cell">
                  <div class="steps-value">{{ row.daily_steps || 'N/A' }}</div>
                  <div class="steps-category" :class="getStepsCategoryClass(row.daily_steps)">{{ getStepsCategory(row.daily_steps) }}</div>
                </div>
              </td>
              <td role="cell" :aria-label="`Exercise hours per week: ${row.exercise_hours_per_week || 'N/A'} - ${getExerciseCategory(row.exercise_hours_per_week)}`">
                <div class="exercise-cell">
                  <div class="exercise-value">{{ row.exercise_hours_per_week || 'N/A' }}</div>
                  <div class="exercise-category" :class="getExerciseCategoryClass(row.exercise_hours_per_week)">{{ getExerciseCategory(row.exercise_hours_per_week) }}</div>
                </div>
              </td>
              <td role="cell" :aria-label="`Calories intake: ${row.calories_intake || 'N/A'} - ${getCaloriesCategory(row.calories_intake)}`">
                <div class="calories-cell">
                  <div class="calories-value">{{ row.calories_intake || 'N/A' }}</div>
                  <div class="calories-category" :class="getCaloriesCategoryClass(row.calories_intake)">{{ getCaloriesCategory(row.calories_intake) }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Lifestyle Pagination -->
      <nav aria-label="Lifestyle table pagination">
        <ul class="pagination" role="menubar">
          <li
            class="page-item"
            :class="{ disabled: lifestyleCurrentPage === 1 }"
            role="none"
          >
            <button
              class="page-link"
              :disabled="lifestyleCurrentPage === 1"
              @click="lifestylePreviousGroup"
              @keydown.enter="lifestylePreviousGroup"
              aria-label="Go to previous group of pages"
              :aria-disabled="lifestyleCurrentPage === 1"
            >
              Previous
            </button>
          </li>

          <li
            v-for="page in lifestylePaginationPages"
            :key="page"
            class="page-item"
            :class="{ active: lifestyleCurrentPage === page }"
            role="none"
          >
            <button
              class="page-link"
              @click="lifestyleCurrentPage = page"
              @keydown.enter="lifestyleCurrentPage = page"
              :aria-label="`Go to page ${page}`"
              :aria-current="lifestyleCurrentPage === page ? 'page' : undefined"
            >
              {{ page }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: lifestyleCurrentPage === lifestyleTotalPages }"
            role="none"
          >
            <button
              class="page-link"
              :disabled="lifestyleCurrentPage === lifestyleTotalPages"
              @click="lifestyleNextGroup"
              @keydown.enter="lifestyleNextGroup"
              aria-label="Go to next group of pages"
              :aria-disabled="lifestyleCurrentPage === lifestyleTotalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchHealthFemaleData } from '@/api/healthData'

// Health table data and state
const healthRawData = ref([])
const healthSearchQuery = ref('')
const healthCurrentPage = ref(1)
const healthItemsPerPage = 10
const healthSortKey = ref('age')
const healthSortAsc = ref(true)

// Health column filters
const healthColumnFilters = ref({
  age: '',
  bmi: '',
  hours_of_sleep: '',
  heart_rate: '',
  blood_pressure: ''
})

// Lifestyle table data and state
const lifestyleRawData = ref([])
const lifestyleSearchQuery = ref('')
const lifestyleCurrentPage = ref(1)
const lifestyleItemsPerPage = 10
const lifestyleSortKey = ref('age')
const lifestyleSortAsc = ref(true)

// Lifestyle column filters
const lifestyleColumnFilters = ref({
  age: '',
  smoker: '',
  alcohol_consumption_per_week: '',
  daily_steps: '',
  exercise_hours_per_week: '',
  calories_intake: ''
})

// Get data
onMounted(async () => {
  try {
    const data = await fetchHealthFemaleData()
    healthRawData.value = data
    lifestyleRawData.value = data
  } catch (error) {
    console.error('Failed to fetch health data:', error)
    healthRawData.value = []
    lifestyleRawData.value = []
  }
})

// BMI classification function
const getBMICategory = (bmi) => {
  if (!bmi || isNaN(bmi)) return 'Unknown'
  const bmiValue = parseFloat(bmi)

  if (bmiValue < 18.5) return 'Underweight (<18.5)'
  if (bmiValue >= 18.5 && bmiValue < 24) return 'Normal (18.5-23.9)'
  if (bmiValue >= 24 && bmiValue < 28) return 'Overweight (24-27.9)'
  if (bmiValue >= 28 && bmiValue < 35) return 'Obese (28-34.9)'
  if (bmiValue >= 35) return 'Severely Obese (>=35)'

  return 'Unknown'
}

// Sleep classification function
const getSleepCategory = (sleep) => {
  if (!sleep || isNaN(sleep)) return 'Unknown'
  const sleepValue = parseFloat(sleep)

  if (sleepValue < 6) return 'Low (<6h)'
  if (sleepValue >= 6 && sleepValue < 8) return 'Medium (6-8h)'
  if (sleepValue >= 8) return 'High (>=8h)'

  return 'Unknown'
}

// Heart rate classification function
const getHeartRateCategory = (heartRate) => {
  if (!heartRate || isNaN(heartRate)) return 'Unknown'
  const heartRateValue = parseFloat(heartRate)

  if (heartRateValue < 60) return 'Low (<60)'
  if (heartRateValue >= 60 && heartRateValue < 100) return 'Medium (60-100)'
  if (heartRateValue >= 100) return 'High (>=100)'

  return 'Unknown'
}


// Alcohol consumption classification function
const getAlcoholCategory = (alcohol) => {
  if (!alcohol || isNaN(alcohol)) return 'Unknown'
  const alcoholValue = parseFloat(alcohol)

  if (alcoholValue === 0) return 'None (0)'
  if (alcoholValue > 0 && alcoholValue <= 7) return 'Light (1-7)'
  if (alcoholValue > 7 && alcoholValue <= 14) return 'Moderate (8-14)'
  if (alcoholValue > 14) return 'Heavy (>14)'

  return 'Unknown'
}

// Daily steps classification function
const getStepsCategory = (steps) => {
  if (!steps || isNaN(steps)) return 'Unknown'
  const stepsValue = parseFloat(steps)

  if (stepsValue < 5000) return 'Low (<5k)'
  if (stepsValue >= 5000 && stepsValue < 10000) return 'Medium (5k-10k)'
  if (stepsValue >= 10000) return 'High (>=10k)'

  return 'Unknown'
}

// Exercise hours classification function
const getExerciseCategory = (exercise) => {
  if (!exercise || isNaN(exercise)) return 'Unknown'
  const exerciseValue = parseFloat(exercise)

  if (exerciseValue < 2) return 'Low (<2h)'
  if (exerciseValue >= 2 && exerciseValue < 5) return 'Medium (2-5h)'
  if (exerciseValue >= 5) return 'High (>=5h)'

  return 'Unknown'
}

// Calories classification function
const getCaloriesCategory = (calories) => {
  if (!calories || isNaN(calories)) return 'Unknown'
  const caloriesValue = parseFloat(calories)

  if (caloriesValue < 1200) return 'Low (<1200)'
  if (caloriesValue >= 1200 && caloriesValue < 2000) return 'Medium (1200-2000)'
  if (caloriesValue >= 2000) return 'High (>=2000)'

  return 'Unknown'
}

// BMI category CSS class function
const getBMICategoryClass = (bmi) => {
  if (!bmi || isNaN(bmi)) return 'bmi-unknown'
  const bmiValue = parseFloat(bmi)

  if (bmiValue < 18.5) return 'bmi-underweight'
  if (bmiValue >= 18.5 && bmiValue < 24) return 'bmi-normal'
  if (bmiValue >= 24 && bmiValue < 28) return 'bmi-overweight'
  if (bmiValue >= 28 && bmiValue < 35) return 'bmi-obese'
  if (bmiValue >= 35) return 'bmi-severely-obese'

  return 'bmi-unknown'
}

// Sleep category CSS class function
const getSleepCategoryClass = (sleep) => {
  if (!sleep || isNaN(sleep)) return 'sleep-unknown'
  const sleepValue = parseFloat(sleep)

  if (sleepValue < 6) return 'sleep-low'
  if (sleepValue >= 6 && sleepValue < 8) return 'sleep-medium'
  if (sleepValue >= 8) return 'sleep-high'

  return 'sleep-unknown'
}

// Heart rate category CSS class function
const getHeartRateCategoryClass = (heartRate) => {
  if (!heartRate || isNaN(heartRate)) return 'heart-rate-unknown'
  const heartRateValue = parseFloat(heartRate)

  if (heartRateValue < 60) return 'heart-rate-low'
  if (heartRateValue >= 60 && heartRateValue < 100) return 'heart-rate-medium'
  if (heartRateValue >= 100) return 'heart-rate-high'

  return 'heart-rate-unknown'
}


// Alcohol category CSS class function
const getAlcoholCategoryClass = (alcohol) => {
  if (!alcohol || isNaN(alcohol)) return 'alcohol-unknown'
  const alcoholValue = parseFloat(alcohol)

  if (alcoholValue === 0) return 'alcohol-none'
  if (alcoholValue > 0 && alcoholValue <= 7) return 'alcohol-light'
  if (alcoholValue > 7 && alcoholValue <= 14) return 'alcohol-moderate'
  if (alcoholValue > 14) return 'alcohol-heavy'

  return 'alcohol-unknown'
}

// Steps category CSS class function
const getStepsCategoryClass = (steps) => {
  if (!steps || isNaN(steps)) return 'steps-unknown'
  const stepsValue = parseFloat(steps)

  if (stepsValue < 5000) return 'steps-low'
  if (stepsValue >= 5000 && stepsValue < 10000) return 'steps-medium'
  if (stepsValue >= 10000) return 'steps-high'

  return 'steps-unknown'
}

// Exercise category CSS class function
const getExerciseCategoryClass = (exercise) => {
  if (!exercise || isNaN(exercise)) return 'exercise-unknown'
  const exerciseValue = parseFloat(exercise)

  if (exerciseValue < 2) return 'exercise-low'
  if (exerciseValue >= 2 && exerciseValue < 5) return 'exercise-medium'
  if (exerciseValue >= 5) return 'exercise-high'

  return 'exercise-unknown'
}

// Calories category CSS class function
const getCaloriesCategoryClass = (calories) => {
  if (!calories || isNaN(calories)) return 'calories-unknown'
  const caloriesValue = parseFloat(calories)

  if (caloriesValue < 1200) return 'calories-low'
  if (caloriesValue >= 1200 && caloriesValue < 2000) return 'calories-medium'
  if (caloriesValue >= 2000) return 'calories-high'

  return 'calories-unknown'
}

// Smart search function that supports exact matching for numbers and partial matching for text
const smartSearch = (value, searchTerm) => {
  if (!searchTerm) return true

  const valueStr = String(value || '')
  const searchStr = String(searchTerm)

  // If search term is a pure number, use exact match only
  if (!isNaN(searchStr) && searchStr.trim() !== '') {
    // For numbers, only match if the entire value equals the search term
    return valueStr === searchStr
  }

  // For text fields, use case-insensitive partial matching
  return valueStr.toLowerCase().includes(searchStr.toLowerCase())
}

// Health table functions
const applyHealthColumnFilter = () => {
  healthCurrentPage.value = 1
}

// Clear all health filters and search
const clearHealthFilters = () => {
  healthSearchQuery.value = ''
  healthColumnFilters.value = {
    age: '',
    bmi: '',
    hours_of_sleep: '',
    heart_rate: '',
    blood_pressure: ''
  }
  healthCurrentPage.value = 1
}

const healthFilteredData = computed(() => {
  return healthRawData.value.filter((item) => {
    const globalMatch = !healthSearchQuery.value || (
      smartSearch(item.age, healthSearchQuery.value) ||
      smartSearch(item.bmi, healthSearchQuery.value) ||
      smartSearch(item.hours_of_sleep, healthSearchQuery.value) ||
      smartSearch(item.heart_rate, healthSearchQuery.value) ||
      smartSearch(item.blood_pressure, healthSearchQuery.value)
    )

    const columnMatch = (
      (!healthColumnFilters.value.age || smartSearch(item.age, healthColumnFilters.value.age)) &&
      (!healthColumnFilters.value.bmi || getBMICategoryClass(item.bmi).includes(healthColumnFilters.value.bmi)) &&
      (!healthColumnFilters.value.hours_of_sleep || getSleepCategoryClass(item.hours_of_sleep).includes(healthColumnFilters.value.hours_of_sleep)) &&
      (!healthColumnFilters.value.heart_rate || getHeartRateCategoryClass(item.heart_rate).includes(healthColumnFilters.value.heart_rate)) &&
      (!healthColumnFilters.value.blood_pressure || smartSearch(item.blood_pressure, healthColumnFilters.value.blood_pressure))
    )

    return globalMatch && columnMatch
  })
})

const healthSortBy = (key) => {
  if (healthSortKey.value === key) {
    healthSortAsc.value = !healthSortAsc.value
  } else {
    healthSortKey.value = key
    healthSortAsc.value = true
  }
}

const healthSortedData = computed(() => {
  return [...healthFilteredData.value].sort((a, b) => {
    if (a[healthSortKey.value] < b[healthSortKey.value]) return healthSortAsc.value ? -1 : 1
    if (a[healthSortKey.value] > b[healthSortKey.value]) return healthSortAsc.value ? 1 : -1
    return 0
  })
})

const healthTotalPages = computed(() =>
  Math.ceil(healthSortedData.value.length / healthItemsPerPage)
)

// Health pagination pages
const healthPaginationPages = computed(() => {
  const total = healthTotalPages.value
  const current = healthCurrentPage.value
  const pages = []

  // Calculate which group of 10 pages to show
  const currentGroup = Math.floor((current - 1) / 10)
  const startPage = currentGroup * 10 + 1
  const endPage = Math.min(startPage + 9, total)

  // Show pages in current group (e.g., 1-10, 11-20, 21-30, etc.)
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const healthPaginatedData = computed(() => {
  const start = (healthCurrentPage.value - 1) * healthItemsPerPage
  return healthSortedData.value.slice(start, start + healthItemsPerPage)
})

// Lifestyle table functions
const applyLifestyleColumnFilter = () => {
  lifestyleCurrentPage.value = 1
}

// Clear all lifestyle filters and search
const clearLifestyleFilters = () => {
  lifestyleSearchQuery.value = ''
  lifestyleColumnFilters.value = {
    age: '',
    smoker: '',
    alcohol_consumption_per_week: '',
    daily_steps: '',
    exercise_hours_per_week: '',
    calories_intake: ''
  }
  lifestyleCurrentPage.value = 1
}

const lifestyleFilteredData = computed(() => {
  return lifestyleRawData.value.filter((item) => {
    const globalMatch = !lifestyleSearchQuery.value || (
      smartSearch(item.age, lifestyleSearchQuery.value) ||
      smartSearch(item.smoker, lifestyleSearchQuery.value) ||
      smartSearch(item.alcohol_consumption_per_week, lifestyleSearchQuery.value) ||
      smartSearch(item.daily_steps, lifestyleSearchQuery.value) ||
      smartSearch(item.exercise_hours_per_week, lifestyleSearchQuery.value) ||
      smartSearch(item.calories_intake, lifestyleSearchQuery.value)
    )

    const columnMatch = (
      (!lifestyleColumnFilters.value.age || smartSearch(item.age, lifestyleColumnFilters.value.age)) &&
      (!lifestyleColumnFilters.value.smoker || (item.smoker || '').toLowerCase() === lifestyleColumnFilters.value.smoker.toLowerCase()) &&
      (!lifestyleColumnFilters.value.alcohol_consumption_per_week || getAlcoholCategoryClass(item.alcohol_consumption_per_week).includes(lifestyleColumnFilters.value.alcohol_consumption_per_week)) &&
      (!lifestyleColumnFilters.value.daily_steps || getStepsCategoryClass(item.daily_steps).includes(lifestyleColumnFilters.value.daily_steps)) &&
      (!lifestyleColumnFilters.value.exercise_hours_per_week || getExerciseCategoryClass(item.exercise_hours_per_week).includes(lifestyleColumnFilters.value.exercise_hours_per_week)) &&
      (!lifestyleColumnFilters.value.calories_intake || getCaloriesCategoryClass(item.calories_intake).includes(lifestyleColumnFilters.value.calories_intake))
    )

    return globalMatch && columnMatch
  })
})

const lifestyleSortBy = (key) => {
  if (lifestyleSortKey.value === key) {
    lifestyleSortAsc.value = !lifestyleSortAsc.value
  } else {
    lifestyleSortKey.value = key
    lifestyleSortAsc.value = true
  }
}

const lifestyleSortedData = computed(() => {
  return [...lifestyleFilteredData.value].sort((a, b) => {
    if (a[lifestyleSortKey.value] < b[lifestyleSortKey.value]) return lifestyleSortAsc.value ? -1 : 1
    if (a[lifestyleSortKey.value] > b[lifestyleSortKey.value]) return lifestyleSortAsc.value ? 1 : -1
    return 0
  })
})

const lifestyleTotalPages = computed(() =>
  Math.ceil(lifestyleSortedData.value.length / lifestyleItemsPerPage)
)

// Lifestyle pagination pages
const lifestylePaginationPages = computed(() => {
  const total = lifestyleTotalPages.value
  const current = lifestyleCurrentPage.value
  const pages = []

  // Calculate which group of 10 pages to show
  const currentGroup = Math.floor((current - 1) / 10)
  const startPage = currentGroup * 10 + 1
  const endPage = Math.min(startPage + 9, total)

  // Show pages in current group (e.g., 1-10, 11-20, 21-30, etc.)
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const lifestylePaginatedData = computed(() => {
  const start = (lifestyleCurrentPage.value - 1) * lifestyleItemsPerPage
  return lifestyleSortedData.value.slice(start, start + lifestyleItemsPerPage)
})


// Health pagination group functions
const healthPreviousGroup = () => {
  const currentGroup = Math.floor((healthCurrentPage.value - 1) / 10)
  if (currentGroup > 0) {
    healthCurrentPage.value = (currentGroup - 1) * 10 + 1
  }
}

const healthNextGroup = () => {
  const currentGroup = Math.floor((healthCurrentPage.value - 1) / 10)
  const nextGroupStart = (currentGroup + 1) * 10 + 1
  if (nextGroupStart <= healthTotalPages.value) {
    healthCurrentPage.value = nextGroupStart
  }
}

// Lifestyle pagination group functions
const lifestylePreviousGroup = () => {
  const currentGroup = Math.floor((lifestyleCurrentPage.value - 1) / 10)
  if (currentGroup > 0) {
    lifestyleCurrentPage.value = (currentGroup - 1) * 10 + 1
  }
}

const lifestyleNextGroup = () => {
  const currentGroup = Math.floor((lifestyleCurrentPage.value - 1) / 10)
  const nextGroupStart = (currentGroup + 1) * 10 + 1
  if (nextGroupStart <= lifestyleTotalPages.value) {
    lifestyleCurrentPage.value = nextGroupStart
  }
}

// CSV Export Functions
const exportToCSV = (data, filename, headers) => {
  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const value = row[header] || ''
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportHealthToCSV = () => {
  const headers = ['Age', 'BMI', 'BMI Category', 'Sleep (hrs)', 'Sleep Category', 'Heart Rate', 'Heart Rate Category', 'Blood Pressure']
  const data = healthFilteredData.value.map(row => ({
    'Age': row.age || '',
    'BMI': row.bmi || '',
    'BMI Category': getBMICategory(row.bmi),
    'Sleep (hrs)': row.hours_of_sleep || '',
    'Sleep Category': getSleepCategory(row.hours_of_sleep),
    'Heart Rate': row.heart_rate || '',
    'Heart Rate Category': getHeartRateCategory(row.heart_rate),
    'Blood Pressure': row.blood_pressure || ''
  }))

  const timestamp = new Date().toISOString().split('T')[0]
  exportToCSV(data, `female-health-data-${timestamp}.csv`, headers)
}

const exportLifestyleToCSV = () => {
  const headers = ['Age', 'Smoking', 'Alcohol/Week', 'Alcohol Category', 'Daily Steps', 'Steps Category', 'Exercise Hours', 'Exercise Category', 'Calories', 'Calories Category']
  const data = lifestyleFilteredData.value.map(row => ({
    'Age': row.age || '',
    'Smoking': row.smoker || '',
    'Alcohol/Week': row.alcohol_consumption_per_week ?? 0,
    'Alcohol Category': getAlcoholCategory(row.alcohol_consumption_per_week),
    'Daily Steps': row.daily_steps || '',
    'Steps Category': getStepsCategory(row.daily_steps),
    'Exercise Hours': row.exercise_hours_per_week || '',
    'Exercise Category': getExerciseCategory(row.exercise_hours_per_week),
    'Calories': row.calories_intake || '',
    'Calories Category': getCaloriesCategory(row.calories_intake)
  }))

  const timestamp = new Date().toISOString().split('T')[0]
  exportToCSV(data, `female-lifestyle-data-${timestamp}.csv`, headers)
}
</script>

<style scoped>
/* Accessibility and WCAG 2.1 AA compliance */
.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background-color 0.2s ease;
}

.sortable:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sortable:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
  background-color: rgba(255, 255, 255, 0.2);
}

.sortable i {
  margin-left: 5px;
  font-size: 0.8em;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 0.8em;
}

.form-control-sm, .form-select-sm {
  font-size: 0.8em;
}

/* Enhanced focus styles for accessibility */
.form-control:focus, .form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Pagination accessibility */
.pagination {
  margin-bottom: 0;
}

.page-item {
  cursor: pointer;
}

.page-item.disabled {
  cursor: not-allowed;
}

.page-link {
  transition: all 0.2s ease;
}

.page-link:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
  z-index: 3;
}

.page-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .sortable:focus {
    outline: 3px solid;
    background-color: Highlight;
    color: HighlightText;
  }

  .page-link:focus {
    outline: 3px solid;
    background-color: Highlight;
    color: HighlightText;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .sortable, .page-link {
    transition: none;
  }
}

/* Table titles */
.macaron-theme h2.table-title,
.macaron-theme .table-title {
  color: #d4a5c7 !important;
  font-weight: 600 !important;
  text-shadow: 0 2px 4px rgba(212, 165, 199, 0.3) !important;
  border-bottom: 3px solid #d4a5c7 !important;
  padding-bottom: 0.5rem !important;
  margin-bottom: 1.5rem !important;
  display: block !important;
}

/* Table headers styling */
.macaron-theme th.sortable {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  font-weight: 600 !important;
  border: 2px solid var(--macaron-mint) !important;
  text-shadow: 0 1px 2px rgba(168, 230, 207, 0.3) !important;
  transition: all 0.3s ease !important;
}

.macaron-theme th.sortable:hover {
  background: linear-gradient(135deg, var(--macaron-lavender), var(--macaron-lilac)) !important;
  color: #4a2a4a !important;
  border-color: var(--macaron-lavender) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 8px rgba(212, 165, 199, 0.4) !important;
}

.macaron-theme th.sortable:focus {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border-color: var(--macaron-peach) !important;
  outline: 3px solid var(--macaron-peach) !important;
  outline-offset: 2px !important;
  box-shadow: 0 4px 12px rgba(255, 211, 165, 0.5) !important;
}

/* Sort indicators */
.macaron-theme .sort-indicator {
  margin-left: 8px;
  display: inline-block;
  vertical-align: middle;
}

.macaron-theme .sort-indicator i {
  font-size: 1.2em;
  transition: all 0.3s ease;
}

.macaron-theme .sort-indicator .active-sort {
  color: #fff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
  font-weight: bold !important;
  animation: pulse 1.5s ease-in-out infinite alternate !important;
  font-size: 1.3em !important;
}

.macaron-theme .sort-indicator .inactive-sort {
  color: rgba(45, 74, 45, 0.8) !important;
  opacity: 0.9 !important;
  font-size: 1.1em !important;
}

.macaron-theme th.sortable:hover .sort-indicator .inactive-sort {
  color: rgba(74, 42, 74, 1) !important;
  opacity: 1 !important;
  transform: scale(1.2) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

/* Make the (Sort) symbol more prominent */
/* Remove duplicate sort indicator from CSS since it's already in HTML */

/* Export button styling */
.macaron-theme .export-btn {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  border: 2px solid var(--macaron-rose) !important;
  color: #fff !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  transition: all 0.3s ease !important;
}

.macaron-theme .export-btn:hover {
  background: linear-gradient(135deg, var(--macaron-coral), var(--macaron-rose)) !important;
  border-color: var(--macaron-coral) !important;
  color: #fff !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 6px 12px rgba(253, 138, 138, 0.6) !important;
}

.macaron-theme .export-btn:focus {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  border-color: var(--macaron-rose) !important;
  color: #fff !important;
  box-shadow: 0 0 0 0.3rem rgba(253, 138, 138, 0.4) !important;
  outline: none !important;
}

.macaron-theme .export-btn:active {
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 6px rgba(253, 138, 138, 0.5) !important;
}

/* Clear All button styling */
.macaron-theme .clear-btn {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  border: 2px solid var(--macaron-peach) !important;
  color: #5a3a2a !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  transition: all 0.3s ease !important;
  min-width: 100px !important;
}

.macaron-theme .clear-btn:hover {
  background: linear-gradient(135deg, var(--macaron-coral), var(--macaron-peach)) !important;
  border-color: var(--macaron-coral) !important;
  color: #5a3a2a !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(255, 211, 165, 0.6) !important;
}

.macaron-theme .clear-btn:focus {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  border-color: var(--macaron-peach) !important;
  color: #5a3a2a !important;
  box-shadow: 0 0 0 0.3rem rgba(255, 211, 165, 0.4) !important;
  outline: none !important;
}

.macaron-theme .clear-btn:active {
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 6px rgba(255, 211, 165, 0.5) !important;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

/* Screen reader only content */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* BMI classification styles */
.bmi-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bmi-value {
  font-weight: 600;
  font-size: 0.9em;
}

.bmi-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.sleep-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sleep-value {
  font-weight: 600;
  font-size: 0.9em;
}

.sleep-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.heart-rate-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.heart-rate-value {
  font-weight: 600;
  font-size: 0.9em;
}

.heart-rate-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.age-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.age-value {
  font-weight: 600;
  font-size: 0.9em;
}

.age-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.alcohol-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alcohol-value {
  font-weight: 600;
  font-size: 0.9em;
}

.alcohol-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.steps-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.steps-value {
  font-weight: 600;
  font-size: 0.9em;
}

.steps-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.exercise-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.exercise-value {
  font-weight: 600;
  font-size: 0.9em;
}

.exercise-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.calories-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.calories-value {
  font-weight: 600;
  font-size: 0.9em;
}

.calories-category {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.macaron-theme .bmi-underweight {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(168, 230, 207, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .bmi-normal {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 2px solid var(--macaron-peach) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .bmi-overweight {
  background: linear-gradient(135deg, var(--macaron-lavender), var(--macaron-lilac)) !important;
  color: #4a2a4a !important;
  border: 2px solid var(--macaron-lavender) !important;
  box-shadow: 0 2px 8px rgba(212, 165, 199, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .bmi-obese {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  color: #fff !important;
  border: 2px solid var(--macaron-rose) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .bmi-severely-obese {
  background: linear-gradient(135deg, var(--macaron-lilac), var(--macaron-lavender)) !important;
  color: #3a2a4a !important;
  border: 2px solid var(--macaron-lilac) !important;
  box-shadow: 0 2px 8px rgba(199, 168, 230, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .bmi-unknown {
  background: var(--macaron-cream) !important;
  color: #6a5a5a !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(254, 247, 224, 0.4) !important;
  font-weight: 600 !important;
}

/* Sleep classification styles */
.macaron-theme .sleep-low {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  color: #fff !important;
  border: 2px solid var(--macaron-rose) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .sleep-medium {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 2px solid var(--macaron-peach) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .sleep-high {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(168, 230, 207, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .sleep-unknown {
  background: var(--macaron-cream) !important;
  color: #6a5a5a !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(254, 247, 224, 0.4) !important;
  font-weight: 600 !important;
}

/* Heart rate classification styles */
.macaron-theme .heart-rate-low {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(168, 230, 207, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .heart-rate-medium {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 2px solid var(--macaron-peach) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .heart-rate-high {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  color: #fff !important;
  border: 2px solid var(--macaron-rose) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .heart-rate-unknown {
  background: var(--macaron-cream) !important;
  color: #6a5a5a !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(254, 247, 224, 0.4) !important;
  font-weight: 600 !important;
}


/* Alcohol classification styles */
.macaron-theme .alcohol-none {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(168, 230, 207, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .alcohol-light {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 2px solid var(--macaron-peach) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .alcohol-moderate {
  background: linear-gradient(135deg, var(--macaron-lavender), var(--macaron-lilac)) !important;
  color: #4a2a4a !important;
  border: 2px solid var(--macaron-lavender) !important;
  box-shadow: 0 2px 8px rgba(212, 165, 199, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .alcohol-heavy {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  color: #fff !important;
  border: 2px solid var(--macaron-rose) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .alcohol-unknown {
  background: var(--macaron-cream) !important;
  color: #6a5a5a !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(254, 247, 224, 0.4) !important;
  font-weight: 600 !important;
}

/* Steps classification styles */
.macaron-theme .steps-low {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  color: #fff !important;
  border: 2px solid var(--macaron-rose) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .steps-medium {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 2px solid var(--macaron-peach) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .steps-high {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(168, 230, 207, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .steps-unknown {
  background: var(--macaron-cream) !important;
  color: #6a5a5a !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(254, 247, 224, 0.4) !important;
  font-weight: 600 !important;
}

/* Exercise classification styles */
.macaron-theme .exercise-low {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  color: #fff !important;
  border: 2px solid var(--macaron-rose) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .exercise-medium {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 2px solid var(--macaron-peach) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .exercise-high {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(168, 230, 207, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .exercise-unknown {
  background: var(--macaron-cream) !important;
  color: #6a5a5a !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(254, 247, 224, 0.4) !important;
  font-weight: 600 !important;
}

/* Calories classification styles */
.macaron-theme .calories-low {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  color: #fff !important;
  border: 2px solid var(--macaron-rose) !important;
  box-shadow: 0 2px 8px rgba(253, 138, 138, 0.4) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .calories-medium {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 2px solid var(--macaron-peach) !important;
  box-shadow: 0 2px 8px rgba(255, 211, 165, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .calories-high {
  background: linear-gradient(135deg, var(--macaron-lavender), var(--macaron-lilac)) !important;
  color: #4a2a4a !important;
  border: 2px solid var(--macaron-lavender) !important;
  box-shadow: 0 2px 8px rgba(212, 165, 199, 0.4) !important;
  font-weight: 600 !important;
}

.macaron-theme .calories-unknown {
  background: var(--macaron-cream) !important;
  color: #6a5a5a !important;
  border: 2px solid var(--macaron-mint) !important;
  box-shadow: 0 2px 8px rgba(254, 247, 224, 0.4) !important;
  font-weight: 600 !important;
}

/* Spacing between tables */
.mb-5 {
  margin-bottom: 3rem !important;
}

/* Macaron color palette - enhanced for better readability */
.macaron-theme {
  --macaron-mint: #a8e6cf;
  --macaron-lavender: #d4a5c7;
  --macaron-peach: #ffd3a5;
  --macaron-rose: #fd8a8a;
  --macaron-cream: #fef7e0;
  --macaron-lilac: #c7a8e6;
  --macaron-sage: #b8d4a8;
  --macaron-coral: #ffb3ba;
  --macaron-dark-text: #4a4a4a;
  --macaron-light-text: #6a6a6a;
}

/* Enhanced table styling with macaron colors - improved readability */
.macaron-theme .table-responsive {
  border-radius: 16px !important;
  overflow: hidden !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  background: #fff !important;
  border: 3px solid var(--macaron-mint) !important;
}

.macaron-theme .table {
  margin-bottom: 0 !important;
  background: #fff !important;
  color: var(--macaron-dark-text) !important;
}

.macaron-theme .table-dark {
  background: linear-gradient(135deg, var(--macaron-lavender), var(--macaron-lilac)) !important;
  color: #fff !important;
  border: none !important;
}

.macaron-theme .table-dark th {
  border-color: rgba(255, 255, 255, 0.3) !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
  color: #fff !important;
}

.macaron-theme .table-light {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: var(--macaron-dark-text) !important;
}

.macaron-theme .table-light th {
  border-color: rgba(255, 255, 255, 0.4) !important;
  font-weight: 500 !important;
  color: var(--macaron-dark-text) !important;
}

.macaron-theme .table-hover tbody tr:hover {
  background-color: var(--macaron-coral) !important;
  color: var(--macaron-dark-text) !important;
  transform: translateY(-1px) !important;
  transition: all 0.2s ease !important;
}

.macaron-theme .table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.8) !important;
  color: var(--macaron-dark-text) !important;
}

.macaron-theme .table-striped tbody tr:nth-of-type(even) {
  background-color: var(--macaron-peach) !important;
  color: var(--macaron-dark-text) !important;
}

.macaron-theme .table tbody tr td {
  color: var(--macaron-dark-text) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
}

/* Enhanced form controls with macaron colors */
.macaron-theme .form-control,
.macaron-theme .form-select {
  border-radius: 12px !important;
  border: 2px solid var(--macaron-mint) !important;
  background: var(--macaron-cream) !important;
  color: var(--macaron-dark-text) !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.macaron-theme .form-control:focus,
.macaron-theme .form-select:focus {
  border-color: var(--macaron-lavender) !important;
  box-shadow: 0 0 0 0.3rem rgba(212, 165, 199, 0.25) !important;
  background: #fff !important;
  transform: translateY(-1px) !important;
}

.macaron-theme .form-control::placeholder {
  color: var(--macaron-light-text) !important;
  opacity: 0.7 !important;
}

/* Enhanced badges with macaron colors - improved readability */
.macaron-theme .badge {
  border-radius: 16px !important;
  font-weight: 700 !important;
  padding: 0.5rem 1rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}

.macaron-theme .badge.bg-info {
  background: linear-gradient(135deg, var(--macaron-mint), var(--macaron-sage)) !important;
  color: #2d4a2d !important;
  border: 1px solid var(--macaron-mint) !important;
}

.macaron-theme .badge.bg-success {
  background: linear-gradient(135deg, var(--macaron-peach), var(--macaron-coral)) !important;
  color: #5a3a2a !important;
  border: 1px solid var(--macaron-peach) !important;
}

/* Enhanced pagination with macaron colors - improved readability */
.macaron-theme .pagination {
  margin-bottom: 0 !important;
}

.macaron-theme .page-link {
  border-radius: 12px !important;
  margin: 0 3px !important;
  border: 2px solid var(--macaron-mint) !important;
  background: #fff !important;
  color: var(--macaron-dark-text) !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  font-weight: 600 !important;
  padding: 0.5rem 0.75rem !important;
}

.macaron-theme .page-link:hover {
  background: linear-gradient(135deg, var(--macaron-lavender), var(--macaron-lilac)) !important;
  border-color: var(--macaron-lavender) !important;
  color: #fff !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .page-item.active .page-link {
  background: linear-gradient(135deg, var(--macaron-rose), var(--macaron-coral)) !important;
  border-color: var(--macaron-rose) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(253, 138, 138, 0.4) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.macaron-theme .page-link:disabled {
  background: var(--macaron-cream) !important;
  border-color: var(--macaron-mint) !important;
  color: var(--macaron-light-text) !important;
  opacity: 0.7 !important;
}
</style>
