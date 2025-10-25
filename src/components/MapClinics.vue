<template>
  <div class="map-page container py-4">
    <section class="hero-card gradient-hero p-4 mb-4">
      <div class="row align-items-center">
        <div class="col-12">
          <h1 class="h2 mb-2 text-white">Find Nearby Medical Services</h1>
          <p class="text-white-50 mb-0">Powered by OpenStreetMap data via Overpass API</p>
        </div>
      </div>
    </section>

    <div class="card-soft p-4 mb-4">
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-3">
          <button class="btn btn-soft btn-lavender w-100" @click="locateMe" aria-label="Use my current location">
            Use my location
          </button>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <input
            v-model="manualQuery"
            @keydown.enter="geocodeAddress"
            class="form-control"
            placeholder="Enter an Australian address or suburb"
            aria-label="Address input"
          />
        </div>
        <div class="col-12 col-md-6 col-lg-2">
          <button class="btn btn-soft btn-peach w-100" @click="geocodeAddress" :disabled="!manualQuery">
            Search
          </button>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <select v-model="radiusKm" class="form-select" aria-label="Search radius">
            <option :value="1">Radius: 1 km</option>
            <option :value="2">Radius: 2 km</option>
            <option :value="5">Radius: 5 km</option>
            <option :value="10">Radius: 10 km</option>
            <option :value="20">Radius: 20 km</option>
            <option :value="50">Radius: 50 km</option>
          </select>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- Map Section -->
      <div class="col-lg-8">
        <div class="card-soft p-0 overflow-hidden">
          <div ref="mapEl" class="mapbox" role="region" aria-label="Map showing clinics"></div>
        </div>
        <div v-if="routeInfo" class="metric-box mt-3" role="status">
          <div class="d-flex align-items-center">
            <div class="pill lavender me-3"></div>
            <div>
              <div class="fw-semibold">Route Information</div>
              <div class="small text-muted">
                Distance: <strong>{{ routeInfo.distanceKm.toFixed(2) }} km</strong> •
                Duration: <strong>{{ routeInfo.durationMin.toFixed(0) }} min</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="col-lg-4">
        <div class="card-soft">
          <div class="p-4 border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-0">Medical Services</h5>
                <small class="text-muted">Sorted by distance (nearest first)</small>
              </div>
              <span class="badge bg-lavender text-white">{{ clinics.length }} found</span>
            </div>
          </div>
          <div class="p-0">
            <div class="list-group list-group-flush" role="listbox" aria-label="Clinics results">
              <button
                v-for="(p, index) in paginatedClinics"
                :key="p.id"
                class="list-group-item list-group-item-action border-0"
                role="option"
                @click="gotoPlace(p)"
                @keydown.enter="gotoPlace(p)"
                style="border-radius: 0 !important;"
              >
                <div class="d-flex align-items-start">
                  <div class="d-flex flex-column align-items-center me-3">
                    <div class="pill pink mb-1" style="width: 12px; height: 12px;"></div>
                    <span class="badge bg-lavender text-white" style="font-size: 0.7rem; padding: 0.2rem 0.4rem;">
                      #{{ (currentPage - 1) * itemsPerPage + index + 1 }}
                    </span>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold text-dark">{{ p.text }}</div>
                    <div class="small text-muted">{{ p.place_name }}</div>
                    <div class="small text-info">Distance: {{ distanceFromUser(p) }}</div>
                    <div v-if="p.properties.phone" class="small text-primary">Phone: {{ p.properties.phone }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div v-if="totalPages > 1" class="p-4 border-top">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <button
                class="btn btn-soft btn-blue btn-sm"
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="{ 'opacity-50': currentPage === 1 }"
              >
                ← Previous
              </button>
              <span class="text-muted small">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                class="btn btn-soft btn-blue btn-sm"
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="{ 'opacity-50': currentPage === totalPages }"
              >
                Next →
              </button>
            </div>
            <div class="d-flex justify-content-center">
              <!-- Show first page -->
              <button
                v-if="currentPage > 3"
                class="btn btn-sm me-1 btn-outline-lavender"
                @click="goToPage(1)"
                style="border-radius: 50%; width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center;"
              >
                1
              </button>
              <span v-if="currentPage > 4" class="me-1 d-flex align-items-center">...</span>

              <!-- Show pages around current page -->
              <button
                v-for="page in visiblePages"
                :key="page"
                class="btn btn-sm me-1"
                :class="page === currentPage ? 'btn-lavender text-white' : 'btn-outline-lavender'"
                @click="goToPage(page)"
                style="border-radius: 50%; width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center;"
              >
                {{ page }}
              </button>

              <!-- Show last page -->
              <span v-if="currentPage < totalPages - 3" class="me-1 d-flex align-items-center">...</span>
              <button
                v-if="currentPage < totalPages - 2"
                class="btn btn-sm me-1 btn-outline-lavender"
                @click="goToPage(totalPages)"
                style="border-radius: 50%; width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center;"
              >
                {{ totalPages }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = MAPBOX_TOKEN

const mapEl = ref(null)
let map
let userMarker
let clinicMarkers = []
let routeLayerId = 'route-line'

const userLngLat = ref(null)
const manualQuery = ref('')
const radiusKm = ref(5)
const clinics = ref([])
const routeInfo = ref(null)
const currentPage = ref(1)
const itemsPerPage = 5

const initMap = () => {
  if (!mapEl.value) {
    console.error('Map container not found')
    return
  }

  map = new mapboxgl.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [144.9631, -37.8136],
    zoom: 12,
    attributionControl: true,
    maxBounds: [
      [113.0, -44.0],
      [154.0, -10.0]
    ]
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' }))

  map.once('load', () => {
    const canvas = map.getCanvas()
    canvas.setAttribute('tabindex', '0')
    canvas.setAttribute('aria-label', 'Interactive map')
    console.log('Map loaded successfully')
  })

  map.on('error', (e) => {
    console.error('Map error:', e)
  })
}

const setUserMarker = (lngLat) => {
  if (!map || !map.getContainer()) {
    console.warn('Map not ready for user marker')
    return
  }

  try {
    if (userMarker) userMarker.remove()
    userMarker = new mapboxgl.Marker({ color: '#1d4ed8' })
      .setLngLat(lngLat)
      .setPopup(new mapboxgl.Popup().setHTML('<b>You are here</b>'))
      .addTo(map)
  } catch (error) {
    console.error('Error setting user marker:', error)
  }
}

const locateMe = () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported. Please type an address.')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lngLat = [pos.coords.longitude, pos.coords.latitude]
      userLngLat.value = lngLat
      map.flyTo({ center: lngLat, zoom: 14 })
      setUserMarker(lngLat)
      searchClinics()
    },
    () => alert('Failed to get location. Please type an address.'),
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

const geocodeAddress = async () => {
  if (!manualQuery.value) return
  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(manualQuery.value)}.json`)
  url.searchParams.set('access_token', MAPBOX_TOKEN)
  url.searchParams.set('limit', '1')
  url.searchParams.set('country', 'AU') // Restrict search to Australia
  url.searchParams.set('bbox', '113.0,-44.0,154.0,-10.0') // Australia bounding box
  const r = await fetch(url)
  const j = await r.json()
  if (j.features?.length) {
    const [lng, lat] = j.features[0].center
    userLngLat.value = [lng, lat]
    map.flyTo({ center: userLngLat.value, zoom: 13 })
    setUserMarker(userLngLat.value)
    searchClinics()
  } else {
    alert('Address not found in Australia. Please try a different address.')
  }
}


const searchClinics = async () => {
  if (!userLngLat.value) return

  // Clear old data
  clinicMarkers.forEach(m => m.remove())
  clinicMarkers = []
  clinics.value = []
  routeInfo.value = null
  removeRoute()

  try {
    // Use Overpass API to get medical facilities from OpenStreetMap
    const [lng, lat] = userLngLat.value
    const radius = radiusKm.value * 1000 // Convert km to meters

    // Overpass QL query for medical facilities
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"~"^(hospital|clinic|doctors|pharmacy|dentist)$"](around:${radius},${lat},${lng});
        way["amenity"~"^(hospital|clinic|doctors|pharmacy|dentist)$"](around:${radius},${lat},${lng});
        relation["amenity"~"^(hospital|clinic|doctors|pharmacy|dentist)$"](around:${radius},${lat},${lng});
      );
      out center meta;
    `

    const overpassUrls = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass.openstreetmap.ru/api/interpreter'
    ]

    let overpassData = null
    let lastError = null

    // Try each Overpass API endpoint
    for (const url of overpassUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(overpassQuery)}`
        })

        if (response.ok) {
          overpassData = await response.json()
          console.log('Overpass API success:', url)
          break
        }
      } catch (error) {
        console.warn('Overpass API failed:', url, error.message)
        lastError = error
      }
    }

    if (!overpassData || !overpassData.elements) {
      throw new Error('All Overpass API endpoints failed. ' + (lastError ? lastError.message : ''))
    }

    // Convert Overpass data to our format
    const feats = overpassData.elements.map(element => {
      // Handle different coordinate formats from Overpass API
      let center
      if (element.center) {
        // For ways and relations, use center coordinates
        center = [element.center.lon, element.center.lat]
      } else if (element.lon && element.lat) {
        // For nodes, use direct coordinates
        center = [element.lon, element.lat]
      } else {
        console.warn('Invalid coordinates for element:', element)
        return null
      }

      const name = element.tags?.name || element.tags?.amenity || 'Medical Facility'
      const amenity = element.tags?.amenity || 'medical'

      return {
        id: element.id,
        text: name,
        place_name: `${name} (${amenity})`,
        center: center,
        properties: element.tags || {}
      }
    }).filter(item => item !== null) // Remove invalid entries

    // Sort by distance from user location (nearest first)
    feats.sort((a, b) => {
      const distanceA = haversineKm(userLngLat.value, a.center)
      const distanceB = haversineKm(userLngLat.value, b.center)
      return distanceA - distanceB
    })

    clinics.value = feats
    currentPage.value = 1 // Reset to first page

    if (feats.length === 0) {
      alert(`No medical facilities found within ${radiusKm.value} km. Try increasing the search radius or try a different location.`)
      return
    }

    // Add markers only if map is ready
    if (map && map.getContainer()) {
      feats.forEach(f => {
        try {
          const mk = new mapboxgl.Marker({ color: '#059669' })
            .setLngLat(f.center)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <b>${f.text}</b><br>
              <small>${f.place_name}</small>
              ${f.properties.phone ? `<br>📞 ${f.properties.phone}` : ''}
              ${f.properties.website ? `<br>🌐 <a href="${f.properties.website}" target="_blank">Website</a>` : ''}
            `))
            .addTo(map)
          clinicMarkers.push(mk)
        } catch (error) {
          console.error('Error adding marker:', error, f)
        }
      })
    } else {
      console.warn('Map not ready, skipping markers')
    }

    // Adjust map view only if map is ready
    if (map && map.getContainer()) {
      try {
        const b = new mapboxgl.LngLatBounds()
        b.extend(userLngLat.value)
        feats.forEach(f => b.extend(f.center))
        map.fitBounds(b, { padding: 60, duration: 600 })
      } catch (error) {
        console.error('Error adjusting map view:', error)
      }
    }

  } catch (error) {
    console.error('Error searching for clinics:', error)
    alert('Error searching for clinics: ' + error.message)
  }
}

const gotoPlace = async (place) => {
  if (!userLngLat.value || !map || !map.getContainer()) {
    console.warn('Map or user location not ready')
    return
  }

  try {
    map.flyTo({ center: place.center, zoom: 14 })
    await drawRoute(userLngLat.value, place.center)
  } catch (error) {
    console.error('Error navigating to place:', error)
  }
}

const drawRoute = async (from, to) => {
  // Directions API (driving)
  const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/driving/${from.join(',')};${to.join(',')}`)
  url.searchParams.set('alternatives', 'false')
  url.searchParams.set('geometries', 'geojson')
  url.searchParams.set('overview', 'full')
  url.searchParams.set('access_token', MAPBOX_TOKEN)

  const r = await fetch(url)
  const j = await r.json()
  const route = j.routes?.[0]
  if (!route) return

  const geo = { type: 'Feature', properties: {}, geometry: route.geometry }

  if (map.getSource('route-src')) {
    map.getSource('route-src').setData(geo)
  } else {
    map.addSource('route-src', { type: 'geojson', data: geo })
    map.addLayer({
      id: routeLayerId,
      type: 'line',
      source: 'route-src',
      paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.8 }
    })
  }

  routeInfo.value = {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60
  }
}

const removeRoute = () => {
  if (map?.getLayer(routeLayerId)) map.removeLayer(routeLayerId)
  if (map?.getSource('route-src')) map.removeSource('route-src')
}

const distanceFromUser = (p) => {
  if (!userLngLat.value || !p || !p.center) return 'Unknown distance'
  const km = haversineKm(userLngLat.value, p.center)
  if (km === Infinity) return 'Invalid coordinates'
  return `${km.toFixed(2)} km`
}

// Pagination computed properties
const totalPages = computed(() => {
  const total = Math.ceil(clinics.value.length / itemsPerPage)
  console.log('Total pages calculated:', total, 'from', clinics.value.length, 'clinics')
  return total
})

const paginatedClinics = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  const result = clinics.value.slice(start, end)
  console.log('Paginated clinics:', result.length, 'items for page', currentPage.value)
  return result
})

const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const pages = []

  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (page) => {
  console.log('Going to page:', page, 'Total pages:', totalPages.value)
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    console.log('Current page updated to:', currentPage.value)
  }
}

const nextPage = () => {
  console.log('Next page clicked. Current:', currentPage.value, 'Total:', totalPages.value)
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    console.log('Page incremented to:', currentPage.value)
  }
}

const prevPage = () => {
  console.log('Previous page clicked. Current:', currentPage.value, 'Total:', totalPages.value)
  if (currentPage.value > 1) {
    currentPage.value--
    console.log('Page decremented to:', currentPage.value)
  }
}

const haversineKm = (a, b) => {
  // Validate input parameters
  if (!a || !b || !Array.isArray(a) || !Array.isArray(b)) {
    console.error('Invalid coordinates for haversine calculation:', { a, b })
    return Infinity
  }

  if (a.length < 2 || b.length < 2) {
    console.error('Insufficient coordinates for haversine calculation:', { a, b })
    return Infinity
  }

  const [lng1, lat1] = a
  const [lng2, lat2] = b

  // Validate coordinate values
  if (typeof lng1 !== 'number' || typeof lat1 !== 'number' ||
      typeof lng2 !== 'number' || typeof lat2 !== 'number') {
    console.error('Non-numeric coordinates:', { lng1, lat1, lng2, lat2 })
    return Infinity
  }

  const toRad = d => d * Math.PI / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const s = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(s))
}

onMounted(() => initMap())
onBeforeUnmount(() => {
  removeRoute()
  clinicMarkers.forEach(m => m.remove())
  userMarker?.remove?.()
  map?.remove?.()
})
</script>

<style scoped>
.map-page {
  background: var(--c-ivory);
  min-height: 100vh;
}

.mapbox {
  height: 500px;
  border-radius: var(--radius);
  overflow: hidden;
}

.hero-card {
  background: linear-gradient(135deg, var(--c-pink), var(--c-lavender) 45%, var(--c-babyblue));
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
}

.btn-outline-lavender {
  border: 2px solid var(--c-lavender);
  color: var(--c-lavender);
  background: transparent;
}

.btn-outline-lavender:hover {
  background: var(--c-lavender);
  color: white;
}

.bg-lavender {
  background-color: var(--c-lavender) !important;
}

.list-group-item:hover {
  background-color: rgba(205, 182, 246, 0.1);
  transform: translateX(4px);
  transition: all 0.2s ease;
}

.metric-box {
  background: linear-gradient(135deg, #fff, var(--c-lavender));
  border-radius: 16px;
  box-shadow: var(--shadow-inset);
  padding: 1rem 1.25rem;
}

.pill {
  border-radius: 50%;
  box-shadow: var(--shadow-soft);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.card-soft {
  background: #fff;
  border: 0;
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
}

.form-control, .form-select {
  border-radius: 12px;
  border: 2px solid rgba(205, 182, 246, 0.2);
  transition: all 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--c-lavender);
  box-shadow: 0 0 0 0.2rem rgba(205, 182, 246, 0.25);
}

.badge {
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
}

.map-page :focus {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
</style>
