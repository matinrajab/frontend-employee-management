import { defineStore } from "pinia";
import { ref } from "vue";
import axiosClient from "~/axios";

export const useEmployeeStore = defineStore("employeeStore", () => {
  const employees = ref([]);
  const meta = ref(null);
  const metaForSearch = ref(null);
  const isLoading = ref(true);
  const pageBeforeEdit = ref("");

  const filters = ref({
    name: "",
    nip: "",
    phone_number: "",
    npwp: "",
    golongan_id: "",
    eselon_id: "",
    position_id: "",
    work_unit_id: "",
  });

  async function addEmployee(formData) {
    try {
      isLoading.value = true;
      await axiosClient.post("/api/employee", formData);

      navigateTo("/employees");
    } catch (error) {
      console.error("Gagal menambahkan pegawai:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getEmployees(page = 1) {
    try {
      isLoading.value = true;
      await axiosClient.get(`/api/employees?page=${page}`).then((response) => {
        employees.value = response.data.data;
        meta.value = response.data.meta;
      });
    } finally {
      isLoading.value = false;
    }
  }

  async function searchEmployees(query, page = 1) {
    try {
      isLoading.value = true;
      const params = new URLSearchParams({ ...query, page }).toString();
      await axiosClient
        .get(`/api/search-employees?${params}`)
        .then((response) => {
          employees.value = response.data.data;
          metaForSearch.value = response.data.meta;
        });
    } catch (error) {
      console.error("Gagal mencari pegawai:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getEmployeeById(id) {
    try {
      isLoading.value = true;
      return await axiosClient.get(`/api/employee/${id}`).then((response) => {
        console.log("==============response===============");
        console.log(response.data.data);
        return response.data.data;
      });
    } catch (error) {
      console.error("Gagal mengambil data pegawai:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateEmployee(id, formData) {
    try {
      isLoading.value = true;

      formData.append("_method", "PUT");
      await axiosClient.post(`/api/employee/${id}`, formData);

      navigateTo(pageBeforeEdit.value);
    } catch (error) {
      console.error("Gagal mengupdate pegawai:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteEmployee(id) {
    try {
      isLoading.value = true;
      await axiosClient.delete(`/api/employee/${id}`);
    } catch (error) {
      console.error("Gagal menghapus pegawai: ", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    employees,
    meta,
    metaForSearch,
    isLoading,
    pageBeforeEdit,
    filters,
    addEmployee,
    getEmployees,
    searchEmployees,
    deleteEmployee,
    getEmployeeById,
    updateEmployee,
  };
});
