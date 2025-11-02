<template>
  <div class="overflow-x-auto rounded-3xl shadow-sm">
    <table class="table-auto bg-white min-w-full border-collapse rounded-3xl">
      <thead>
        <tr class="border-b border-solid border-line-border text-tertiary-text">
          <th class="font-normal px-2 py-1 text-xs">No</th>
          <th class="font-normal px-2 py-1 text-xs">NIP</th>
          <th class="font-normal px-2 py-1 text-xs">Nama</th>
          <th class="font-normal px-2 py-1 text-xs">Tempat Lahir</th>
          <th class="font-normal px-2 py-1 text-xs">Alamat</th>
          <th class="font-normal px-2 py-1 text-xs">Tgl Lahir</th>
          <th class="font-normal px-2 py-1 text-xs">L/P</th>
          <th class="font-normal px-2 py-1 text-xs">Gol</th>
          <th class="font-normal px-2 py-1 text-xs">Eselon</th>
          <th class="font-normal px-2 py-1 text-xs">Jabatan</th>
          <th class="font-normal px-2 py-1 text-xs">Tempat Tugas</th>
          <th class="font-normal px-2 py-1 text-xs">Agama</th>
          <th class="font-normal px-2 py-1 text-xs">Unit Kerja</th>
          <th class="font-normal px-2 py-1 text-xs">No. HP</th>
          <th class="font-normal px-2 py-1 text-xs">NPWP</th>
          <th class="font-normal px-2 py-1 text-xs text-center" colspan="2">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(employee, index) in employees"
          :key="employee.id"
          class="border-b border-solid border-line-border"
        >
          <td class="px-2 py-1 text-xs">
            {{ (meta.current_page - 1) * meta.per_page + index + 1 }}
          </td>
          <td class="px-2 py-1 text-xs">{{ employee.nip }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.name }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.birth_place }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.address }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.birth_date }}</td>
          <td class="px-2 py-1 text-xs">
            {{ employee.gender == "Laki-laki" ? "L" : "P" }}
          </td>
          <td class="px-2 py-1 text-xs">{{ employee.golongan }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.eselon }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.position }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.work_place }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.religion }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.work_unit }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.phone_number }}</td>
          <td class="px-2 py-1 text-xs">{{ employee.npwp }}</td>
          <td class="px-2 py-1 text-xs">
            <NuxtLink :to="`/edit-employee/${employee.id}`">Edit</NuxtLink>
          </td>
          <td class="px-2 py-1 text-xs text-danger">
            <button
              @click="openConfirm(employee.id)"
              class="hover:underline text-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    v-if="meta"
    class="flex justify-center items-center gap-2 mt-6 text-sm text-secondary-text flex-wrap"
  >
    <button
      class="px-3 py-1 border rounded-lg disabled:opacity-50"
      :disabled="meta.current_page === 1"
      @click="changePage(meta.current_page - 1)"
    >
      Prev
    </button>

    <button
      v-for="page in meta.last_page"
      :key="page"
      class="px-3 py-1 border rounded-lg transition"
      :class="{
        'bg-primary text-white': meta.current_page === page,
        'hover:bg-gray-100': meta.current_page !== page,
      }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <button
      class="px-3 py-1 border rounded-lg disabled:opacity-50"
      :disabled="meta.current_page === meta.last_page"
      @click="changePage(meta.current_page + 1)"
    >
      Next
    </button>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Konfirmasi Hapus"
    message="Apakah Anda yakin ingin menghapus pegawai ini?"
    @cancel="showConfirm = false"
    @confirm="confirmDelete"
  />
</template>

<script setup>
const props = defineProps({
  employees: [],
  meta: Object,
  changePage: Function,
  afterDelete: Function,
});

const employeeStore = useEmployeeStore();

const showConfirm = ref(false);
const selectedEmployeeId = ref(null);

function openConfirm(id) {
  selectedEmployeeId.value = id;
  showConfirm.value = true;
}

async function confirmDelete() {
  await employeeStore.deleteEmployee(selectedEmployeeId.value);
  props.afterDelete();

  showConfirm.value = false;
  selectedEmployeeId.value = null;
}
</script>
