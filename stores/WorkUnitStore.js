import axiosClient from "~/axios";

export const useWorkUnitStore = defineStore("workUnitStore", () => {
  const workUnits = ref([]);
  const isLoading = ref(false);
  const expandeds = ref([]);

  async function getWorkUnits() {
    try {
      isLoading.value = true;
      await axiosClient.get("/api/work-units").then((response) => {
        workUnits.value = response.data.work_units;
      });
    } finally {
      isLoading.value = false;
    }
  }

  return { workUnits, isLoading, expandeds, getWorkUnits };
});
