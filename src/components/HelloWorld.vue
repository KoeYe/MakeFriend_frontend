<script lang="ts" setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
  />
  <div class="wrapper">
    <div class="greetings">
      <h1 class="green">{{ msg }}</h1>
      <h3>
        This is the website for my coursework by using
        <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      </h3>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
.wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
