<script setup>
import { ref } from "vue";

const props = defineProps([]);
const emit = defineEmits([]);

const text = ref(null);

const Text = ref(null);

const userName = ref(null);

const authenticated = ref(null);

const handleBaseButtonClick = () => {};

const handleUserCardUserUpdate = () => {};
</script>
<template>
  <div>
    <div>App</div>
    <div>
      <UserCard
        :userName="userName"
        :authenticated="authenticated"
        @userUpdate="handleUserCardUserUpdate"
      />

      <BaseButton :Text="Text" @click="handleBaseButtonClick" />

      <BaseButton :text="text" @click="handleBaseButtonClick" />
    </div>
  </div>
</template>
