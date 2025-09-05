<template>
  <nav class="nav-soft navbar navbar-expand-custom navbar-light px-3 my-3">
    <div class="container-fluid align-items-center d-flex">
      <!-- Left: Brand -->
      <RouterLink class="navbar-brand d-flex align-items-center gap-2 fw-semibold" to="/">
        <span class="brand-dot"></span> Sheswell
      </RouterLink>

      <!-- Center: Menu (same line as brand) -->
      <ul class="navbar-nav nav-center d-none d-custom-flex gap-3">
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/">Home</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/learn">Learn</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/record">Record</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/reminder">Reminder</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/my-plan">My Plan</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/community">Community</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/profile">Profile</RouterLink>
        </li>
      </ul>

      <!-- Right: Button group -->
      <div class="d-flex align-items-center gap-2 ms-auto">
        <!-- Desktop buttons -->
        <div class="d-none d-custom-flex gap-2">
          <RouterLink class="btn btn-ghost" to="/signup">Sign up</RouterLink>
          <RouterLink class="btn btn-cta" to="/login">Log in</RouterLink>
        </div>

        <!-- Hamburger menu button -->
        <button
          class="navbar-toggler d-custom-none"
          type="button"
          @click="toggleCollapse"
          aria-controls="mainNav"
          :aria-expanded="!isCollapsed"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Collapsed menu content -->
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/learn">Learn</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/record">Record</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/reminder">Reminder</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/my-plan">My Plan</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/community">Community</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/profile">Profile</RouterLink>
          </li>
          <li class="nav-item d-custom-none">
            <RouterLink class="btn btn-ghost w-100" to="/signup">Sign up</RouterLink>
          </li>
          <li class="nav-item d-custom-none">
            <RouterLink class="btn btn-cta w-100" to="/login">Log in</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

// Hamburger menu state management
const isCollapsed = ref(true)

// Toggle hamburger menu show/hide
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  const collapseElement = document.getElementById('mainNav')
  if (collapseElement) {
    if (isCollapsed.value) {
      collapseElement.classList.remove('show')
    } else {
      collapseElement.classList.add('show')
    }
  }
}

// Initialize Bootstrap collapse after component mount
onMounted(() => {
  const collapseElement = document.getElementById('mainNav')
  if (collapseElement) {
    collapseElement.addEventListener('show.bs.collapse', () => {
      isCollapsed.value = false
    })
    collapseElement.addEventListener('hide.bs.collapse', () => {
      isCollapsed.value = true
    })
  }
})
</script>

<style scoped>
.nav-soft {
  background: #fff;
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
}
.brand-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--c-pink),
    var(--c-lavender) 60%,
    var(--c-peach)
  );
  box-shadow: var(--shadow-soft);
}

.nav-center {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: center;
  flex: 1;
}
/* Custom breakpoint: 1100px and above */
@media (min-width: 1100px) {
  .d-custom-flex {
    display: flex !important;
  }

  .d-custom-none {
    display: none !important;
  }
}

/* Small screens show hamburger menu */
@media (max-width: 1099px) {
  .d-custom-flex {
    display: none !important;
  }

  .d-custom-none {
    display: block !important;
  }
}

/* Custom navbar expand breakpoint control */
@media (min-width: 1100px) {
  .navbar-expand-custom .navbar-collapse {
    display: none !important;
  }

  .navbar-expand-custom .navbar-toggler {
    display: none !important;
  }
}

/* Navigation link styles & active state scale and bold effects */
.nav-link-soft {
  color: #2f3b52 !important;
  opacity: 0.9;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    font-weight 0.18s ease,
    color 0.18s ease;
}
.nav-link-soft:hover {
  transform: scale(1.05);
}
.nav-link-soft.is-exact {
  font-weight: 700;
  transform: scale(1.08);
  color: #111827 !important;
}

/* Button styles */
.btn-cta {
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  box-shadow: var(--shadow-soft);
}
.btn-ghost {
  background: #fff;
  border: 0;
  border-radius: 999px; 
  padding: 0.55rem 1rem;
  box-shadow: var(--shadow-soft);
}
</style>
