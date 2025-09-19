<template>
  <div class="rating-component">
    <div class="rating-display">
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ 'star-filled': star <= currentRating, 'star-hover': star <= hoverRating }"
          @mouseover="hoverRating = star"
          @mouseleave="hoverRating = 0"
          @click="setRating(star)"
        >
          ★
        </span>
      </div>
      <div class="rating-info">
        <span class="rating-score">{{ averageRating.toFixed(1) }}</span>
        <span class="rating-count"
          >({{ totalRatings }} {{ totalRatings === 1 ? 'rating' : 'ratings' }})</span
        >
      </div>
    </div>
    <div v-if="userRating > 0" class="user-rating">Your rating: {{ userRating }} stars</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { validateStorageData, sanitizeInput } from '@/utils/security'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    default: 'post',
  },
})

const { getCurrentUser } = useAuth()
const currentUser = getCurrentUser()

// Rating state
const currentRating = ref(0)
const hoverRating = ref(0)
const userRating = ref(0)
const ratings = ref([])

// Load ratings from localStorage with security validation
const loadRatings = () => {
  const savedRatings = localStorage.getItem(`ratings_${sanitizeInput(props.itemId)}`)
  if (savedRatings) {
    const validatedRatings = validateStorageData(savedRatings)
    if (validatedRatings && Array.isArray(validatedRatings)) {
      ratings.value = validatedRatings

      // Find user's existing rating
      const userRatingData = ratings.value.find((r) => r.userId === currentUser?.id)
      if (userRatingData) {
        userRating.value = userRatingData.rating
        currentRating.value = userRatingData.rating
      }
    }
  }
}

// Save ratings to localStorage
const saveRatings = () => {
  localStorage.setItem(`ratings_${props.itemId}`, JSON.stringify(ratings.value))
}

// Set user rating
const setRating = (rating) => {
  if (!currentUser) return

  currentRating.value = rating
  userRating.value = rating

  // Update or add user rating
  const existingRatingIndex = ratings.value.findIndex((r) => r.userId === currentUser.id)
  const ratingData = {
    userId: currentUser.id,
    userName: currentUser.name,
    rating: rating,
    timestamp: new Date().toISOString(),
  }

  if (existingRatingIndex >= 0) {
    ratings.value[existingRatingIndex] = ratingData
  } else {
    ratings.value.push(ratingData)
  }

  saveRatings()
}

// Computed properties
const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const sum = ratings.value.reduce((acc, rating) => acc + rating.rating, 0)
  return sum / ratings.value.length
})

const totalRatings = computed(() => ratings.value.length)

onMounted(() => {
  loadRatings()
})
</script>

<style scoped>
.rating-component {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.5rem;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.2s ease;
  user-select: none;
}

.star:hover {
  color: #fbbf24;
}

.star-filled {
  color: #f59e0b;
}

.star-hover {
  color: #fbbf24;
}

.rating-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.rating-score {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.rating-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.user-rating {
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
}

@media (max-width: 768px) {
  .rating-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
