<template>
  <div class="p-6 bg-background min-h-screen">
    <div class="bg-white rounded-3xl p-6">
      <div v-if="isLoading"><Loading /></div>

      <div v-else>
        <WorkUnitItem v-for="unit in workUnits" :key="unit.id" :unit="unit" />
      </div>
    </div>
  </div>
</template>

<script setup>
const employeeStore = useEmployeeStore();
const { pageBeforeEdit } = storeToRefs(employeeStore);

pageBeforeEdit.value = "/work-unit";

const workUnitStore = useWorkUnitStore();
const { workUnits, isLoading } = storeToRefs(workUnitStore);

workUnitStore.getWorkUnits();
</script>
