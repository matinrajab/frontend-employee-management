<template>
  <div class="bg-background p-6">
    <form
      @submit.prevent="handleSearch"
      class="bg-white rounded-3xl p-6 shadow-sm mb-6 grid grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <MainFormInput
        label="Nama"
        v-model="filters.name"
        placeholder="Masukkan nama"
      />
      <MainFormInput
        label="NIP"
        v-model="filters.nip"
        placeholder="Masukkan NIP"
      />
      <MainFormInput
        label="Nomor HP"
        v-model="filters.phone_number"
        placeholder="Masukkan nomor HP"
      />
      <MainFormInput
        label="NPWP"
        v-model="filters.npwp"
        placeholder="Masukkan NPWP"
      />

      <div>
        <label class="block mb-2 text-primary-text">Golongan</label>
        <select
          v-model="filters.golongan_id"
          class="w-full border border-line-border rounded-2xl p-2.5 focus:ring-primary focus:border-primary"
        >
          <option value="">Semua</option>
          <option
            v-for="item in references.golongans"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-2 text-primary-text">Eselon</label>
        <select
          v-model="filters.eselon_id"
          class="w-full border border-line-border rounded-2xl p-2.5 focus:ring-primary focus:border-primary"
        >
          <option value="">Semua</option>
          <option
            v-for="item in references.eselons"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-2 text-primary-text">Jabatan</label>
        <select
          v-model="filters.position_id"
          class="w-full border border-line-border rounded-2xl p-2.5 focus:ring-primary focus:border-primary"
        >
          <option value="">Semua</option>
          <option
            v-for="item in references.positions"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-2 text-primary-text">Unit Kerja</label>
        <select
          v-model="filters.work_unit_id"
          class="w-full border border-line-border rounded-2xl p-2.5 focus:ring-primary focus:border-primary"
        >
          <option value="">Semua</option>
          <option
            v-for="item in references.work_units"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="col-span-full flex justify-end w-28">
        <MainButton text="Search" />
      </div>
    </form>

    <div v-if="isLoading">
      <Loading />
    </div>

    <div v-else-if="employees.length > 0">
      <MainTable
        :employees="employees"
        :meta="metaForSearch"
        :changePage="changePage"
        :afterDelete="afterDelete"
      />
    </div>

    <div v-else class="text-center text-secondary-text py-10">
      Tidak ada pegawai dengan filter tersebut
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["sanctum:auth"],
});

const employeeStore = useEmployeeStore();
const { employees, metaForSearch, isLoading, pageBeforeEdit, filters } =
  storeToRefs(employeeStore);

pageBeforeEdit.value = "/search-employees";

employeeStore.searchEmployees(filters.value, metaForSearch.value?.current_page);

const references = ref({
  golongans: [],
  eselons: [],
  positions: [],
  work_units: [],
});

async function handleSearch() {
  await employeeStore.searchEmployees(filters.value);
}

function changePage(page) {
  employeeStore.searchEmployees(filters.value, page);
}

async function afterDelete() {
  changePage(
    employees.value.length == 1
      ? metaForSearch.value.current_page - 1
      : metaForSearch.value.current_page
  );
}

const response = await useSanctumFetch("/api/filter");
const data = response.data.value;

references.value.golongans = data.golongans || [];
references.value.eselons = data.eselons || [];
references.value.positions = data.positions || [];
references.value.work_units = data.work_units || [];
</script>
