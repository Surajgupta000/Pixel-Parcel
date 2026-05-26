const fs = require('fs');
const path = require('path');
const http = require('https'); // for downloading files

const products = [
  { id: "chronos-horizon", url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000" },
  { id: "quantum-stealth", url: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1000" },
  { id: "vanguard-classic", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000" },
  { id: "onyx-spectre", url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000" },
  { id: "celestial-eclipse", url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000" },
  { id: "apex-mariner", url: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1000" },
  { id: "aero-tourbillon", url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000" },
  { id: "nomad-gmt", url: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1000" }
];

const dir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log("Starting image downloads...");

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image. Status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function downloadAll() {
  for (const prod of products) {
    const dest = path.join(dir, `${prod.id.replace(/-/g, '_')}.jpg`);
    console.log(`Downloading ${prod.id} from ${prod.url} to ${dest}...`);
    try {
      await download(prod.url, dest);
      console.log(`Successfully downloaded ${prod.id}`);
    } catch (err) {
      console.error(`Error downloading ${prod.id}:`, err.message);
      // Create a simple placeholder fallback if it fails
      fs.writeFileSync(dest, ""); // write empty file
    }
  }
  console.log("All image downloads completed.");
}

downloadAll();
