<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 400px">
      <h4 class="q-my-md">Create an account</h4>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          v-model="form.name"
          label="Name"
          outlined
          :rules="[(v) => !!v || 'Name is required']"
        />
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          outlined
          :rules="[(v) => !!v || 'Email is required']"
        />
        <q-input
          v-model="form.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :rules="[(v) => !!v || 'Password is required']"
        >
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
        <q-input
          v-model="form.password_confirmation"
          label="Confirm password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :rules="[
            (v) => !!v || 'Please confirm your password',
            (v) => v === form.password || 'Passwords do not match',
          ]"
        />

        <div class="row items-center justify-between">
          <q-btn type="submit" color="primary" label="Sign up" :loading="auth.loading" no-caps />
          <q-btn flat label="Already have an account?" :to="{ name: 'login' }" no-caps />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const showPassword = ref(false)

async function onSubmit() {
  try {
    await auth.register(form.value)
    $q.notify({ type: 'positive', message: 'Account created' })
    router.replace({ name: 'home' })
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  }
}
</script>
