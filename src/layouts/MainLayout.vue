<template>
  <q-layout view="hHh LpR fff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Quasar Notes</q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="add"
          aria-label="New todo"
          :to="{ name: 'todo.new' }"
        />
        <q-btn-dropdown flat color="white" no-caps>
          <template #label>
            <q-icon name="person" class="q-mr-sm" />
            {{ auth.user?.name || 'Account' }}
          </template>
          <q-list>
            <q-item v-if="auth.user" clickable v-close-popup>
              <q-item-section>
                <q-item-label>{{ auth.user.name }}</q-item-label>
                <q-item-label caption>{{ auth.user.email }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Log out</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Quasar Notes</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

async function onLogout() {
  await auth.logout()
  $q.notify({ type: 'info', message: 'Logged out' })
  router.replace({ name: 'login' })
}
</script>
