<script setup lang="ts"></script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="mt-4 text-lg text-gray-600">Page Not Found</p>
      <router-link
        to="/"
        class="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </router-link>
    </div>
  </div>
</template>
