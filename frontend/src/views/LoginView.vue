<script setup>
import {ref, computed, onMounted} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';


const router = useRouter();
const route  = useRoute();
const auth   = useAuthStore();

const form = ref({
  username: '',
  password: '',
  rememberMe: false
});

const ui = ref({
  isLoading: false,
  showPassword: false,
  error: '',
  fieldErrors: {}
});

const validateForm = () => {
  const errors = {};

  if (!form.value.username.trim()) {
    errors.username = 'Username is required';
  }

  if (!form.value.password) {
    errors.password = 'Password is required';
  } else if (form.value.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

const isFormValid = computed(() => {
  const errors = validateForm();
  return Object.keys(errors).length === 0;
});

const handleLogin = async () => {
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    ui.value.fieldErrors = errors;
    ui.value.error = 'Please fix the errors above';
    return;
  }

  ui.value.isLoading = true;
  ui.value.error = '';
  ui.value.fieldErrors = {};

  const { username, password, rememberMe } = form.value;
  const loginResult = await auth.login({
    username: username.trim(),
    password,
    rememberMe
  });

  ui.value.isLoading = false;

  if (loginResult.isSuccess) {
    await handleSuccessfulLogin();
  } else {
    handleLoginError(loginResult.error);
  }
};

const handleSuccessfulLogin = async () => {
  const redirectPath = route.query?.redirect;

  try {
    if (isValidRedirectPath(redirectPath)) {
      console.log('Redirecting to original path:', redirectPath);
      await router.replace(redirectPath);
    } else {
      const fallback = auth.defaultRoute;
      if (fallback) {
        console.log('Redirecting to default route:', fallback);
        await router.replace(fallback);
      } else {
        throw new Error('Unable to determine redirect destination');
      }
    }
  } catch (error) {
    console.error('Redirect failed:', error);
    ui.value.error = 'Login successful but redirect failed. Please navigate manually.';
  }
};

const isValidRedirectPath = (path) => {
  return typeof path === 'string' &&
      path.startsWith('/') &&
      !path.includes('://') &&
      !path.startsWith('/login') &&
      path.length > 1;
};

const handleLoginError = (error) => {
  console.error('Login error:', error);

  if (error.message?.includes('credentials')) {
    ui.value.error = 'Invalid username or password';
  } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
    ui.value.error = 'Network error. Please check your connection and try again.';
  } else if (error.message?.includes('rate limit')) {
    ui.value.error = 'Too many login attempts. Please wait a moment and try again.';
  } else {
    ui.value.error = error.message || 'Login failed. Please try again.';
  }

  form.value.password = '';
};

const togglePasswordVisibility = () => {
  ui.value.showPassword = !ui.value.showPassword;
};

const handleSubmit = (event) => {
  handleLogin();
};

// Redirect if already authenticated
onMounted(async () => {
  // Initialize auth if not already done
  if (!auth.isInitialized) {
    await auth.initializeAuth();
  }

  // Redirect if already logged in
  if (auth.isAuthenticated) {
    const redirectPath = route.query?.redirect;

    if (isValidRedirectPath(redirectPath)) {
      await router.replace(redirectPath);
    } else if (auth.defaultRoute) {
      await router.replace(auth.defaultRoute);
    }
  }
});
</script>

<template>
  <div class="flex min-h-full">
    <!-- Background Image -->
    <img class="absolute inset-0 size-full object-cover xl:-translate-x-90"
         src="../assets/images/login.png"
         alt=""/>

    <!-- Left Side: Login Form -->
    <div class="flex flex-1 flex-col justify-center xl:rounded-r-lg relative overflow-hidden xl:p-0.5">

      <!-- Overlay -->
      <div class="absolute inset-0 bg-softblue/70 backdrop-blur-lg"></div>

      <!-- Foreground content -->
      <div class="relative z-10 text-black">
        <div class="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div class="space-y-10 bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
              <img class="mx-auto h-10 w-auto"
                   src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                   alt="Your Company"/>
              <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your
                account</h2>
            </div>

            <!-- Error Message -->
            <div v-if="ui.error" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    {{ ui.error }}
                  </h3>
                </div>
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                <div class="mt-2">
                  <input
                      v-model="form.username"
                      type="email"
                      name="email"
                      id="email"
                      :disabled="ui.isLoading"
                      autocomplete="email"
                      required
                      :class="[
                        'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accentcolor sm:text-sm/6',
                        ui.fieldErrors.username ? 'outline-red-300' : 'outline-gray-300'
                      ]"/>
                  <span v-if="ui.fieldErrors.username" class="mt-2 text-sm text-red-600">
                    {{ ui.fieldErrors.username }}
                  </span>
                </div>
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                <div class="mt-2 relative">
                  <input v-model="form.password"
                         :type="ui.showPassword ? 'text' : 'password'"
                         name="password"
                         id="password"
                         :disabled="ui.isLoading"
                         autocomplete="current-password"
                         required
                         :class="[
                           'block w-full rounded-md bg-white px-3 py-1.5 pr-10 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accentcolor sm:text-sm/6',
                           ui.fieldErrors.password ? 'outline-red-300' : 'outline-gray-300'
                         ]"/>

                  <!-- Eye Toggle Button -->
                  <button
                      type="button"
                      @click="togglePasswordVisibility"
                      :disabled="ui.isLoading"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      aria-label="Toggle password visibility"
                  >
                    <svg v-if="ui.showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 011.363-3.175M9.375 5.175A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-1.363 3.175M4 4l16 16"/>
                    </svg>
                  </button>
                </div>
                <span v-if="ui.fieldErrors.password" class="mt-2 text-sm text-red-600">
                  {{ ui.fieldErrors.password }}
                </span>
              </div>

              <!-- Remember Me -->
              <div class="flex items-center justify-between">
                <div class="flex gap-3">
                  <div class="flex h-6 shrink-0 items-center">
                    <div class="group grid size-4 grid-cols-1">
                      <input
                          v-model="form.rememberMe"
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          :disabled="ui.isLoading"
                          class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-accentcolor checked:bg-accentcolor indeterminate:border-accentcolor indeterminate:bg-accentcolor focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"/>
                      <svg
                          class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                          viewBox="0 0 14 14" fill="none">
                        <path class="opacity-0 group-has-checked:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2"
                              stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="opacity-0 group-has-indeterminate:opacity-100" d="M3 7H11" stroke-width="2"
                              stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <label for="remember-me" class="block text-sm/6 text-gray-900">Remember me</label>
                </div>

                <div class="text-sm/6">
                  <a href="#" class="font-semibold text-accentcolor hover:text-indigo-500">Forgot password?</a>
                </div>
              </div>

              <!-- Submit Button -->
              <div>
                <button type="submit"
                        :disabled="!isFormValid || ui.isLoading"
                        class="flex w-full justify-center rounded-md bg-accentcolor px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="ui.isLoading">Signing in...</span>
                  <span v-else>Sign In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side: Image Panel -->
    <div class="relative hidden w-0 flex-1 xl:block">
      <img class="absolute inset-0 size-full object-cover" src="../assets/images/login.png" alt=""/>
    </div>
  </div>
</template>