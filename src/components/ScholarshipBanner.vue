<template>
  <div v-if="props.name" class="scholarship-banner">
    <div class="banner-content">
      <div class="banner-icon">
        <q-icon name="school" size="24px" />
      </div>
      <div class="banner-text">
        <div class="banner-label">Current Scholarship</div>
        <div class="banner-name">{{ props.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<style scoped>
.scholarship-banner {
  background: #a487e9; /* Lightened version of the original purple */
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(107, 70, 193, 0.15);
  position: relative;
  overflow: hidden;
}

.scholarship-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  position: relative;
  z-index: 1;
}

.banner-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.banner-icon .q-icon {
  color: white;
  font-size: 18px;
}

.banner-text {
  flex: 1;
}

.banner-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.banner-name {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .banner-content {
    padding: 10px 16px;
  }
  
  .banner-icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  
  .banner-icon .q-icon {
    font-size: 16px;
  }
  
  .banner-name {
    font-size: 1rem;
  }
}
</style> 