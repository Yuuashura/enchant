const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const submitButton = document.getElementById('submit-button');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const downloadLink = document.getElementById('download-link');

// --- LOGIKA BARU DIMULAI DI SINI ---
// 1. Ambil elemen <p> yang baru kita buat
const fileNameDisplay = document.getElementById('file-name-display');

// 2. Event listener ini sekarang akan mengontrol elemen <p> tersebut
imageInput.addEventListener('change', () => {
    // 3. Cek apakah ada file yang dipilih
    if (imageInput.files.length > 0) {
        // Jika ada, ambil nama filenya
        const fileName = imageInput.files[0].name;

        // Tampilkan nama file dengan format yang Anda inginkan
        fileNameDisplay.textContent = `Gambar dipilih : ${fileName}`;
        
        // Hapus class 'hidden' agar elemen <p> terlihat
        fileNameDisplay.classList.remove('hidden');
    } else {
        // Jika tidak ada file, pastikan elemen <p> kembali tersembunyi
        fileNameDisplay.classList.add('hidden');
    }
});
// --- LOGIKA BARU SELESAI DI SINI ---


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Silakan pilih file gambar terlebih dahulu.');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

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

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        resultImage.src = imageUrl;
        downloadLink.href = imageUrl;
        
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    } finally {
        loadingDiv.classList.add('hidden');
        submitButton.disabled = false;
    }
});