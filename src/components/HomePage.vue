<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const loading = ref(true)
const error = ref(null)
const data = ref({
  hero: {
    title: "Sheswell — Women's Holistic Health",
    subtitle: 'Personalized health management · Smart reminders · Community support',
    kpi: { label: 'Wellness', unit: 'score' },
  },
  today: { title: "Today's Overview" },
  quickActions: [
    { icon: 'lavender', title: 'Symptom Log', to: '/record' },
    { icon: 'peach', title: 'Cycle Tracking', to: '/learn' },
    { icon: 'blue', title: 'Posture Library', to: '/learn' },
    { icon: 'pink', title: 'Ask Community', to: '/community' },
  ],
  reminders: {
    title: 'Smart Reminders & To-dos',
    cta: { text: 'View All Reminders', to: '/reminder' },
  },
  tags: [
    'Parenting & Pelvic Floor',
    'Fertility & Pregnancy',
    'Young Women',
    'Perimenopause',
    'Post-op Recovery',
  ],
})

onMounted(async () => {
  try {
    const res = await fetch('/data/home.json', { cache: 'no-store' })
    if (res.ok) data.value = await res.json()
  } catch {
    error.value = 'Failed to load remote content; showing defaults.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container my-4 homepage">
    <!-- Hero -->
    <section class="hero-card gradient-hero p-5 mb-4">
      <div class="row align-items-center gx-5 gy-4">
        <div class="col-12 col-lg-7">
          <h1 class="display-5 fw-bold mb-3 title-shadow">{{ data.hero.title }}</h1>
          <p class="lead text-body-emphasis mb-4">{{ data.hero.subtitle }}</p>
          <div class="d-flex gap-2 mb-4">
            <RouterLink class="btn btn-cta me-2" to="/login">Log in</RouterLink>
            <RouterLink class="btn btn-ghost" to="/signup">Sign up</RouterLink>
          </div>
          <div class="d-flex gap-3">
            <div class="pill peach"></div>
            <div class="pill pink"></div>
            <div class="pill lavender"></div>
            <div class="pill blue"></div>
          </div>
        </div>

        <!-- Circular statistics on the right -->
        <div class="col-12 col-lg-5 d-flex justify-content-lg-end">
          <div class="stat-bubble text-center">
            <div class="value">--</div>
            <div class="label">Log in to view</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Three cards -->
    <section class="row g-4">
      <!-- Today's Health Overview -->
      <div class="col-12 col-lg-4">
        <div class="card-soft p-4 h-100">
          <h5 class="mb-3">{{ data.today.title }}</h5>
          <div class="text-muted text-center py-5">
            Please log in to view your personalized health data
          </div>
        </div>
      </div>

      <!-- Quick function -->
      <div class="col-12 col-lg-4">
        <div class="card-soft p-4 h-100">
          <h5 class="mb-3">Quick Actions</h5>
          <div class="d-grid gap-2">
            <RouterLink
              v-for="action in data.quickActions"
              :key="action.title"
              :to="action.to"
              class="btn btn-outline-primary d-flex align-items-center gap-2"
            >
              <div
                :class="`pill ${action.icon}`"
                style="width: 12px; height: 12px; border-radius: 50%"
              ></div>
              {{ action.title }}
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- reminders and to-do lists -->
      <div class="col-12 col-lg-4">
        <div class="card-soft p-4 h-100">
          <h5 class="mb-3">{{ data.reminders.title }}</h5>
          <div class="text-muted text-center py-4">
            <p>Log in to view your personalized reminders</p>
            <RouterLink :to="data.reminders.cta?.to || '/reminder'" class="btn btn-cta w-100">
              {{ data.reminders.cta?.text || 'View All Reminders' }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- tag -->
    <section class="mt-4 d-flex flex-wrap gap-2">
      <span v-for="(tag, index) in data.tags" :key="index" class="tag">{{ tag }}</span>
    </section>
  </div>
</template>

<style scoped>
.hero-card {
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
}
.title-shadow {
  text-shadow: 0 2px 12px rgba(255, 255, 255, 0.35);
}

.stat-bubble {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--c-babyblue),
    var(--c-lavender) 55%,
    var(--c-pink)
  );
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
}
.stat-bubble .value {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
}
.stat-bubble .label {
  opacity: 0.9;
}

.tile {
  color: inherit;
}
.tile:hover {
  filter: brightness(0.98);
}

.mini-bars .bar {
  width: 10px;
  border-radius: 8px;
  background: #eee;
}
.bar-1 {
  height: 18px;
  background: var(--c-babyblue);
}
.bar-2 {
  height: 28px;
  background: var(--c-peach);
}
.bar-3 {
  height: 22px;
  background: var(--c-lavender);
}
.bar-4 {
  height: 30px;
  background: var(--c-babyblue);
}
.bar-5 {
  height: 16px;
  background: var(--c-peach);
}
.bar-6 {
  height: 24px;
  background: var(--c-lavender);
}
.bar-7 {
  height: 20px;
  background: var(--c-babyblue);
}

/* color of cards */
.card-soft {
  border: 0;
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card-soft:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.card-soft:nth-child(1) {
  background: linear-gradient(135deg, var(--c-peach), #ffd4c4);
  color: #8b4513;
}

.card-soft:nth-child(2) {
  background: linear-gradient(135deg, var(--c-lavender), #e6d7f7);
  color: #4a4a6a;
}

.card-soft:nth-child(3) {
  background: linear-gradient(135deg, var(--c-pink), #f8c8d8);
  color: #8b2c5d;
}

.tag {
  padding: 0.25rem 0.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #6c757d;
  border: 1px solid #e9ecef;
}
</style>
