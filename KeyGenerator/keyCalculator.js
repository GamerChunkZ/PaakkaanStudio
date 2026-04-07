async function generateSHA256Key(str1, str2) {
    const combinedString = str1 + (str2 || "");
    var msgUint8 = new TextEncoder().encode(combinedString);
    console.log(msgUint8);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
async function handleCreate() {
    var s1 = document.getElementById('key').value;
    var s2 = document.getElementById('name').value;
    s2 = s2.toLowerCase();
    try {
        const hash = await generateSHA256Key(s1 + s2);
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
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_key.txt'; 
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
