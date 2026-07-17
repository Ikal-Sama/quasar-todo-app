<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 400px">
      <h4 class="q-my-md">Log in</h4>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
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

        <div class="row items-center justify-between">
          <q-btn
            type="submit"
            color="primary"
            label="Log in"
            :loading="auth.loading"
            no-caps
          />
          <q-btn flat label="Create an account" :to="{ name: 'register' }" no-caps />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({ email: '', password: '' })
const showPassword = ref(false)

async function onSubmit() {
  try {
    await auth.login(form.value)
    $q.notify({ type: 'positive', message: 'Welcome back!' })
    const redirect = route.query.redirect || { name: 'home' }
    router.replace(redirect)
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  }
}
</script>
