const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const submitButton = document.getElementById('submit-button');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const downloadLink = document.getElementById('download-link');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form submit secara default

    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Silakan pilih file gambar terlebih dahulu.');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    // Tampilkan loading dan sembunyikan hasil sebelumnya
    submitButton.disabled = true;
    loadingDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    try {
        const response = await fetch('/enhance', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gagal memproses gambar: ${errorText}`);
        }

        // Dapatkan hasil gambar sebagai blob
        const imageBlob = await response.blob();
        
        // Buat URL dari blob untuk ditampilkan di <img> dan diunduh
        const imageUrl = URL.createObjectURL(imageBlob);
        
        resultImage.src = imageUrl;
        downloadLink.href = imageUrl;
        
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    } finally {
        // Sembunyikan loading dan aktifkan kembali tombol
        loadingDiv.classList.add('hidden');
        submitButton.disabled = false;
    }
});