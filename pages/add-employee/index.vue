<script setup>
import MainFormInput from "~/components/MainFormInput.vue";

definePageMeta({
  middleware: ["sanctum:auth"],
});

const employeeStore = useEmployeeStore();

const form = ref({
  nip: "",
  name: "",
  birth_place: "",
  address: "",
  birth_date: "",
  gender_id: "",
  golongan_id: "",
  eselon_id: "",
  position: "",
  work_place: "",
  religion_id: "",
  work_unit: "",
  phone_number: "",
  npwp: "",
  photo: null,
});

const referenceData = ref({
  genders: [],
  golongans: [],
  eselons: [],
  religions: [],
});

const errors = ref({
  birth_date: "",
  gender_id: "",
  golongan_id: "",
  religion_id: "",
});

function validateForm() {
  errors.value = {
    birth_date: "",
    gender_id: "",
    golongan_id: "",
    religion_id: "",
  };

  let valid = true;

  if (!form.value.birth_date) {
    errors.value.birth_date = "Tanggal lahir harus diisi";
    valid = false;
  }
  if (!form.value.gender_id) {
    errors.value.gender_id = "Jenis kelamin harus dipilih";
    valid = false;
  }
  if (!form.value.golongan_id) {
    errors.value.golongan_id = "Golongan harus dipilih";
    valid = false;
  }
  if (!form.value.religion_id) {
    errors.value.religion_id = "Agama harus dipilih";
    valid = false;
  }

  return valid;
}

const response = await useSanctumFetch("/api/employee-create");
referenceData.value = response.data.value;

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  const formData = new FormData();
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  for (let [key, val] of formData.entries()) {
    console.log(key, val);
  }

  await employeeStore.addEmployee(formData);
}
</script>

<template>
  <div class="bg-background p-6">
    <div class="bg-white rounded-3xl p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-10 mb-5">
          <MainFormInput id="nip" label="NIP" v-model="form.nip" />
          <MainFormInput id="nama" label="Nama" v-model="form.name" />
        </div>
        <div class="grid grid-cols-2 gap-10 mb-5">
          <MainFormInput
            id="tempat-lahir"
            label="Tempat Lahir"
            v-model="form.birth_place"
          />
          <MainFormInput id="alamat" label="Alamat" v-model="form.address" />
        </div>
        <div class="grid grid-cols-2 gap-10 mb-5">
          <div>
            <p class="mb-3">Tanggal Lahir</p>
            <div class="relative">
              <input
                datepicker-format="yyyy-mm-dd"
                v-model="form.birth_date"
                id="default-datepicker"
                type="date"
                class="border border-line-border rounded-2xl text-sm focus:ring-primary focus:border-primary block w-full ps-10 p-2.5"
              />
              <span class="text-danger" v-if="errors.birth_date">
                {{ errors.birth_date }}
              </span>
            </div>
          </div>
          <div>
            <p class="mb-3">Jenis Kelamin:</p>
            <div
              v-for="gender in referenceData.genders"
              :key="gender.id"
              class="flex items-center mb-2"
            >
              <input
                v-model="form.gender_id"
                :id="'gender-' + gender.id"
                type="radio"
                :value="gender.id"
                name="gender"
                class="w-4 h-4 text-przimary focus:ring-primary"
              />
              <label :for="'gender-' + gender.id" class="ms-2">
                {{ gender.name }}
              </label>
            </div>

            <span class="text-danger" v-if="errors.gender_id">
              {{ errors.gender_id }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-10 mb-5">
          <div>
            <label for="golongan" class="block mb-2">Golongan</label>
            <select
              v-model="form.golongan_id"
              id="golongan"
              class="border border-line-border rounded-2xl focus:ring-primary focus:border-primary block w-full p-2.5"
            >
              <option value="" disabled>Pilih Golongan</option>
              <option
                v-for="gol in referenceData.golongans"
                :key="gol.id"
                :value="gol.id"
              >
                {{ gol.name }}
              </option>
            </select>
            <span class="text-danger" v-if="errors.golongan_id">
              {{ errors.golongan_id }}
            </span>
          </div>
          <div>
            <label for="eselon" class="block mb-2">Eselon</label>
            <select
              v-model="form.eselon_id"
              id="eselon"
              class="border border-line-border rounded-2xl focus:ring-primary focus:border-primary block w-full p-2.5"
            >
              <option value="" disabled>Pilih Eselon</option>
              <option
                v-for="es in referenceData.eselons"
                :key="es.id"
                :value="es.id"
              >
                {{ es.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-10 mb-5">
          <MainFormInput id="jabatan" label="Jabatan" v-model="form.position" />
          <MainFormInput
            id="tempat-tugas"
            label="Tempat Tugas"
            v-model="form.work_place"
          />
        </div>
        <div class="grid grid-cols-2 gap-10 mb-5">
          <div>
            <label for="agama" class="block mb-2">Agama</label>
            <select
              v-model="form.religion_id"
              id="agama"
              class="border border-line-border rounded-2xl focus:ring-primary focus:border-primary block w-full p-2.5"
            >
              <option value="" disabled>Pilih Agama</option>
              <option
                v-for="rel in referenceData.religions"
                :key="rel.id"
                :value="rel.id"
              >
                {{ rel.name }}
              </option>
            </select>
            <span class="text-danger" v-if="errors.religion_id">
              {{ errors.religion_id }}
            </span>
          </div>
          <MainFormInput
            id="unit-kerja"
            label="Unit Kerja"
            v-model="form.work_unit"
          />
        </div>
        <div class="grid grid-cols-2 gap-10 mb-5">
          <MainFormInput
            id="no-hp"
            label="Nomor HP"
            v-model="form.phone_number"
          />
          <MainFormInput id="npwp" label="NPWP" v-model="form.npwp" />
        </div>
        <div class="grid grid-cols-2 gap-10 mb-5">
          <div>
            <label class="block mb-3" for="file_input">Foto</label>
            <input
              class="block w-full border border-line-border rounded-2xl py-3 px-5 cursor-pointer"
              id="file_input"
              type="file"
              @change="form.photo = $event.target.files[0]"
              accept="image/*"
            />
          </div>
          <div class="flex items-end">
            <MainButton text="Submit" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
