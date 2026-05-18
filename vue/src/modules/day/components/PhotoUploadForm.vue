<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  selectedDay: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['save-data']);

const photoData = ref({
  photo: null,
  photoPreview: null,
  photoFile: null
});

const fileInputRef = ref(null);

const handleFileSelect = (event) => {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    photoData.value.photoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoData.value.photoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert('Prosím vyberte obrázek');
  }
};

const removePhoto = () => {
  photoData.value.photo = null;
  photoData.value.photoPreview = null;
  photoData.value.photoFile = null;

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const triggerFileInput = () => {
  fileInputRef.value.click();
};

watch(() => props.selectedDay, (newDay) => {
  console.log('Day changed to:', newDay);
  loadPhotoData(newDay);
});

const loadPhotoData = async (dayIndex) => {
  try {
    console.log(`Loading photo data for day ${dayIndex}`);

    const response = await axios.get(`/day-photo/get-photo/${dayIndex}`);

    if (response.data.status === 'success' && response.data.photo) {
      console.log('Photo data:', response.data.photo.file);
      photoData.value = {
        photo: response.data.photo.file,
        photoPreview: response.data.photo.file,
        photoFile: null
      };
    } else {
      photoData.value = {
        photo: null,
        photoPreview: null,
        photoFile: null
      };
    }
  } catch (error) {
    console.error('Error loading photo data:', error);
    photoData.value = {
      photo: null,
      photoPreview: null,
      photoFile: null
    };
  }
};

const uploadPhoto = async () => {
  if (!photoData.value.photoFile) {
    alert('Prosím nahrajte fotografii');
    return;
  }

  const formData = new FormData();
  formData.append('uploadFile', photoData.value.photoFile);
  formData.append('day', props.selectedDay);

  try {
    const response = await axios.post('/day-photo/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.status === 'success') {
      alert('Fotografie byla úspěšně nahrána');
      photoData.value.photo = response.data.fileUrl;
      // Reset file inputu
      photoData.value.photoFile = null;
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
    } else {
      alert(response.data.message || 'Chyba při nahrávání');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Došlo k chybě při nahrávání fotografie');
  }
};

const handleSubmit = (event) => {
  if (event) {
    event.preventDefault();
  }
  uploadPhoto();
};

onMounted(async () => {
  loadPhotoData(props.selectedDay);
});
</script>

<template>
  <div>
    <h2 class="with-image photo">Denní fotografie</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <label>Nahrajte dnešní fotografii pleti</label>
        <div v-if="photoData.photoPreview" class="photo-preview">
          <img :src="photoData.photoPreview" alt="Náhled fotografie" />
          <div class="photo-actions">
            <button type="button" class="btn-remove-photo" @click="removePhoto">
              Smazat fotku <img src="http://denikpleti.localhost/img/front/trash-icon.svg" alt="Smazat fotku">
            </button>
          </div>
        </div>
        <div v-else class="upload-area" @click="triggerFileInput">
          <div class="upload-icon">📷</div>
          <div class="upload-text">Klikněte pro nahrání fotografie</div>
          <div class="upload-hint">Podporované formáty: JPG, PNG, GIF</div>
        </div>
        <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileSelect"
        />
      </div>
      <div class="form-row">
        <button type="submit" class="btn-submit">
          Uložit
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.btn-submit {
  background-color: #9CFFBD;
  color: #013B53;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}

.btn-submit:hover {
  background-color: #74f89f;
}

.btn-remove-photo {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  margin-top: 15px;

  img {
    margin: 0 !important;
  }
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.form-row {
  flex-direction: column;
  margin-bottom: 20px;
}

h2 {
  &.with-image {
    padding-left: 20px;
    position: relative;
    &.photo {
      &:before {
        content: url(/img/front/photo-icon.svg);
        position: absolute;
        top: 0px;
        left: 0px;
      }
    }
  }
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.upload-area:hover {
  border-color: #28a745;
  background-color: #f0f8f0;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.upload-hint {
  font-size: 12px;
  color: #666;
}

.photo-preview {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}

.photo-preview img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
  max-height: 400px;
  object-fit: cover;
}

.photo-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.recomendation {
  background-color: #f0f8ff;
  border-left: 4px solid #007bff;
  padding: 15px;
  margin: 20px 0;
}

.recomendation .headline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  margin-bottom: 8px;
}

.recomendation .text {
  font-size: 14px;
  color: #555;
}
</style>