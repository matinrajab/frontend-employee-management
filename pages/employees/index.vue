<script setup>
import { useEmployeeStore } from "~/stores/EmployeeStore";

definePageMeta({
  // layout: false,
  middleware: ["sanctum:auth"],
});

const employeeStore = useEmployeeStore();
const { employees, meta, isLoading, pageBeforeEdit } =
  storeToRefs(employeeStore);

pageBeforeEdit.value = "/employees";

employeeStore.getEmployees(meta.value?.current_page);

async function afterDelete() {
  await employeeStore.getEmployees(
    employees.value.length == 1
      ? meta.value.current_page - 1
      : meta.value.current_page
  );
}
</script>

<template>
  <div class="bg-background">
    <h1 class="p-6 text-primary-text font-medium text-2xl">Employees table</h1>

    <div v-if="isLoading">
      <Loading />
    </div>

    <div v-else class="px-6 pb-6">
      <MainTable
        :employees="employees"
        :meta="meta"
        :changePage="employeeStore.getEmployees"
        :afterDelete="afterDelete"
      />
    </div>
  </div>
</template>
