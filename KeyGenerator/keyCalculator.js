async function generateSHA256Key(str1, str2, str3, str4) {
    // 1. Combine the 4 strings (you can add a separator like ':' if needed)
    const combinedString = str1 + str2 + str3 + str4;

    // 2. Encode the string into a byte array (Uint8Array)
    const msgUint8 = new TextEncoder().encode(combinedString);

    // 3. Use the Web Crypto API to hash the data
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);

    // 4. Convert the ArrayBuffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

async function handleCreate() {
    const s1 = document.getElementById('input1').value;
    const s2 = document.getElementById('input2').value;

    try {
        const hash = await generateSHA256Key(s1 + s2);

        // Show success message and start download
        document.getElementById('result').innerText = "Key generated and downloading...";
        downloadKeyFile(hash);
    } catch (error) {
        console.error("Hashing failed:", error);
        document.getElementById('result').innerText = "Error generating hash.";
    }
}

function downloadKeyFile(key) {
    const blob = new Blob([key], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    // Create a hidden link and click it to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_key.txt'; // Name of the file
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}