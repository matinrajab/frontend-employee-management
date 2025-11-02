<template>
  <div class="border border-line-border rounded-2xl mb-4">
    <div
      class="flex justify-between items-center px-5 py-3 cursor-pointer rounded-t-2xl"
      @click="toggleExpand"
    >
      <h2 class="text-lg font-semibold text-secondary-text">
        {{ unit.name }}
      </h2>
      <i class="material-icons text-secondary-text">
        {{ isExpanded ? "expand_less" : "expand_more" }}
      </i>
    </div>

    <transition name="expand">
      <div
        v-if="isExpanded"
        class="p-5 border-t border-line-border bg-background"
      >
        <div v-if="isLoading"><Loading /></div>

        <div v-else>
          <MainTable
            :employees="employees"
            :meta="meta"
            :changePage="fetchEmployees"
            :afterDelete="afterDelete"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import axiosClient from "~/axios";

const props = defineProps({
  unit: Object,
});

const workUnitStore = useWorkUnitStore();
const { expandeds } = storeToRefs(workUnitStore);

const employees = ref([]);
const meta = ref(expandeds.value[props.unit.id]?.meta);
const isLoading = ref(false);

const isExpanded = ref(expandeds.value[props.unit.id]?.isExpanded);
if (isExpanded.value) {
  fetchEmployees(meta.value?.current_page);
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    fetchEmployees(meta.value?.current_page);
  } else {
    expandeds.value[props.unit.id].isExpanded = false;
  }
}

async function fetchEmployees(page = 1) {
  try {
    isLoading.value = true;
    await axiosClient
      .get(`/api/work-unit/${props.unit.id}?page=${page}`)
      .then((response) => {
        employees.value = response.data.data;
        meta.value = response.data.meta;
      });
    expandeds.value[props.unit.id] = { meta: meta.value, isExpanded: true };
  } finally {
    isLoading.value = false;
  }
}

async function afterDelete() {
  fetchEmployees(
    employees.value.length == 1
      ? meta.value.current_page - 1
      : meta.value.current_page
  );
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
</style>
