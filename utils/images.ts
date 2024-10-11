const generateBlobUrls = (files: File[]) => {
  if (!files || files.length === 0) {

    return [];
  }

  return files.map(file => URL.createObjectURL(file));
}

function createFileName(name: string): string {
  const date = new Date();

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

  return `${formattedDate}-${name}`
}

// import axios from 'axios';
//
// const uploadImages = async (files: FileList, resource: string) => {
//   const formData = create FormData();
//
//   for (let i = 0; i < files.length; i++) {
//     formData.append(resource, files[i]);
//   }
//
//   try {
//     const response = await axios.post('https://webhook.site/71f363eb-747b-4053-a58f-e9d31a9d9287', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//
//     console.log('Archivos subidos exitosamente:', response.data);
//   } catch (error) {
//     console.error('Error al subir las imágenes:', error);
//   }
// };
//
// export { uploadImages };
export {generateBlobUrls,createFileName};
