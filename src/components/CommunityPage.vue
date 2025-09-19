<template>
  <div class="container my-4">
    <!-- Hero Section -->
    <section class="hero-card gradient-hero p-5 mb-4">
      <div class="row align-items-center">
        <div class="col-12">
          <h1 class="display-5 fw-bold mb-3 title-shadow">Platform Rating</h1>
          <p class="lead text-body-emphasis mb-4">
            Help us improve by rating different aspects of our service
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

    <!-- Rating Categories -->
    <section class="row g-4">
      <div v-for="(category, index) in ratingCategories" :key="category.id" class="col-12 col-md-6">
        <div class="rating-card p-4 h-100" :class="category.colorClass">
          <div class="rating-category">
            <div class="category-info">
              <h5 class="mb-3">{{ category.name }}</h5>
              <p class="category-description mb-4">{{ category.description }}</p>
            </div>
            <RatingComponent :item-id="category.id" :item-type="'platform-feature'" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RatingComponent from './RatingComponent.vue'

// Platform rating categories
const ratingCategories = ref([
  {
    id: 'user-experience',
    name: 'User Experience',
    description: 'Overall ease of use and interface design',
    colorClass: 'card-peach',
  },
  {
    id: 'content-quality',
    name: 'Content Quality',
    description: 'Quality and usefulness of learning materials',
    colorClass: 'card-lavender',
  },
  {
    id: 'community-support',
    name: 'Community Support',
    description: 'Helpfulness and responsiveness of the community',
    colorClass: 'card-blue',
  },
  {
    id: 'features',
    name: 'Features & Tools',
    description: 'Usefulness of tracking, reminders, and planning tools',
    colorClass: 'card-pink',
  },
])
</script>

<style scoped>
/* Hero Section Styles - matching HomePage */
.hero-card {
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
}

.title-shadow {
  text-shadow: 0 2px 12px rgba(255, 255, 255, 0.35);
}

/* Rating Card Styles */
.rating-card {
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  border: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.rating-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Color-themed cards */
.card-peach {
  background: linear-gradient(135deg, #fff5f0 0%, #fed7c3 100%);
  border-left: 4px solid var(--c-peach);
}

.card-lavender {
  background: linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%);
  border-left: 4px solid var(--c-lavender);
}

.card-blue {
  background: linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%);
  border-left: 4px solid var(--c-babyblue);
}

.card-pink {
  background: linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%);
  border-left: 4px solid var(--c-pink);
}

/* Rating Category Content */
.rating-category {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-info {
  flex: 1;
  margin-bottom: 1.5rem;
}

.category-info h5 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.category-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4b5563;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-card {
    padding: 2rem !important;
  }

  .display-5 {
    font-size: 2rem;
  }

  .rating-card {
    margin-bottom: 1rem;
  }

  .category-info h5 {
    font-size: 1.1rem;
  }
}
</style>
