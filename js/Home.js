//untuk mengambil data dari API dan juga menampilkannya di halaman
async function ambil_data() {
    try {
        //mengambil data menggunakan Fetch
        const response = await fetch("https://fakestoreapi.com/products"); 
        const data = await response.json();
        const container = document.getElementById("data-product");
        const newproduk = document.getElementById("New-produk");

        data.slice(0, 8).forEach((post) => {
            const postElement = document.createElement("div");
            postElement.className = " border-2 border-[#B7B7B7] rounded-md p-8 w-full h-full";
            postElement.innerHTML = `
            <a href="Detail-produk.html?id=${post.id}">\
            <img src="${post.image}" alt="${post.title}" class="w-full h-44 object-contain mb-4 mt-4" />
            <h2 class="text-xl font-semibold mb-1 truncate">${post.title}</h2>
            <h3 class="text-xl font-bold mb-2">$${post.price}</h3>
            <p class="text-base truncate mb-4">${post.description}</p>
            </a>
            `;
            container.appendChild(postElement);
        });    

        data.slice(9, 17).forEach((post) => {
            const postElement = document.createElement("div");
            postElement.className = " border-2 border-[#B7B7B7] rounded-md p-8 w-full h-full";
            postElement.innerHTML = `
            <a href="Detail-produk.html?id=${post.id}">\
            <img src="${post.image}" alt="${post.title}" class="w-full h-44 object-contain mb-4 mt-4" />
            <h2 class="text-xl font-semibold mb-1 truncate">${post.title}</h2>
            <h3 class="text-xl font-bold mb-2">$${post.price}</h3>
            <p class="text-base truncate mb-4">${post.description}</p>
            </a>
            `;
            newproduk.appendChild(postElement);
        });    

        console.log("Data post :" , data);
    } catch (error) {
        //menangani error saat fetch atau proses yang lain gagal
        console.log("Data error : " , error);
    }
} 

ambil_data();