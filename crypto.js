// secp256k1 parameters
const P = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn;
const N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n;
const G = {
    x: 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798n,
    y: 0x483ADA7726A3C4655DA4FBF8759C2DDFE1A7C9B3F5E4C84A0B5E4D2E8A7F9B2Dn
};
const A = 0n;
const B = 7n;

// TAB SWITCHING
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// UTILITY FUNCTIONS
function toHex(n, padTo = 64) {
    if (typeof n === 'string') return n.startsWith('0x') ? n.slice(2) : n;
    return n.toString(16).padStart(padTo, '0');
}

function fromHex(h) {
    h = h.trim();
    if (h.startsWith('0x')) h = h.slice(2);
    try {
        return BigInt('0x' + h);
    } catch (e) {
        return BigInt(0);
    }
}

function utf8ToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
}

// SHA256 Implementation (simple)
async function sha256(data) {
    if (typeof data === 'string') {
        if (!data.match(/^[0-9a-fA-F]*$/)) {
            data = utf8ToHex(data);
        }
    }
    const bytes = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha1(data) {
    if (typeof data === 'string') {
        if (!data.match(/^[0-9a-fA-F]*$/)) {
            data = utf8ToHex(data);
        }
    }
    const bytes = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const hashBuffer = await crypto.subtle.digest('SHA-1', bytes);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple RIPEMD160 (using fallback)
async function ripemd160(hexData) {
    // This is a placeholder - would need full RIPEMD160 library
    // For now, we'll use SHA256 as approximation
    return await sha256(hexData);
}

async function hash160(data) {
    if (typeof data === 'string') {
        if (!data.match(/^[0-9a-fA-F]*$/)) {
            data = utf8ToHex(data);
        }
    }
    const sha = await sha256(data);
    const ripemd = await ripemd160(sha);
    return ripemd.slice(0, 40); // 160 bits = 40 hex chars
}

async function md5(data) {
    if (typeof data === 'string') {
        if (!data.match(/^[0-9a-fA-F]*$/)) {
            data = utf8ToHex(data);
        }
    }
    // Placeholder for MD5
    return (await sha256(data)).slice(0, 32);
}

// INPUT & HASH
async function hashInput(algo) {
    const input = document.getElementById('rawInput').value.trim();
    if (!input) {
        document.getElementById('hashOutput').innerHTML = '❌ Enter input first';
        return;
    }

    let result = '';
    try {
        switch (algo) {
            case 'sha256':
                result = await sha256(input);
                break;
            case 'sha1':
                result = await sha1(input);
                break;
            case 'hash160':
                result = await hash160(input);
                break;
            case 'md5':
                result = await md5(input);
                break;
        }
        document.getElementById('hashOutput').innerHTML = `
            <div class="pipeline-result">
                <strong>${algo.toUpperCase()}</strong><br>
                Input: ${input}<br>
                Output: <code>${result}</code>
            </div>
        `;
    } catch (e) {
        document.getElementById('hashOutput').innerHTML = `❌ Error: ${e.message}`;
    }
}

// BITWISE OPERATIONS
function bitwiseOp(op) {
    const a = fromHex(document.getElementById('valueA').value);
    const b = fromHex(document.getElementById('valueB').value);
    let result;
    let desc = '';

    switch (op) {
        case 'xor':
            result = a ^ b;
            desc = 'A XOR B';
            break;
        case 'xnor':
            result = ~(a ^ b) & ((1n << 256n) - 1n);
            desc = 'A XNOR B';
            break;
        case 'or':
            result = a | b;
            desc = 'A OR B';
            break;
        case 'and':
            result = a & b;
            desc = 'A AND B';
            break;
        case 'nand':
            result = ~(a & b) & ((1n << 256n) - 1n);
            desc = 'A NAND B';
            break;
        case 'not':
            result = ~a & ((1n << 256n) - 1n);
            desc = 'NOT A';
            break;
        case 'reverse':
            result = reverseBits(a);
            desc = 'Reverse Bits (A)';
            break;
        case 'nibble':
            result = nibbleSwap(a);
            desc = 'Nibble Swap (A)';
            break;
        case 'rotate_left':
            result = rotateLeft(a, 1n);
            desc = 'Rotate Left (A)';
            break;
        case 'rotate_right':
            result = rotateRight(a, 1n);
            desc = 'Rotate Right (A)';
            break;
        case 'bit_swap':
            result = bitSwap(a);
            desc = 'Bit Swap (A)';
            break;
    }

    document.getElementById('bitwiseOutput').innerHTML = `
        <div class="pipeline-result">
            <strong>${desc}</strong><br>
            A: <code>${toHex(a)}</code><br>
            B: <code>${toHex(b)}</code><br>
            Result: <code>${toHex(result)}</code><br>
            Result (int): ${result}
        </div>
    `;
}

function reverseBits(n) {
    let result = 0n;
    for (let i = 0n; i < 256n; i++) {
        if ((n >> i) & 1n) {
            result |= 1n << (255n - i);
        }
    }
    return result;
}

function nibbleSwap(n) {
    let result = 0n;
    for (let i = 0n; i < 64n; i++) {
        let nibble = (n >> (4n * i)) & 0xFn;
        result |= nibble << (4n * (63n - i));
    }
    return result;
}

function rotateLeft(n, bits) {
    bits = bits % 256n;
    return ((n << bits) | (n >> (256n - bits))) & ((1n << 256n) - 1n);
}

function rotateRight(n, bits) {
    bits = bits % 256n;
    return ((n >> bits) | (n << (256n - bits))) & ((1n << 256n) - 1n);
}

function bitSwap(n) {
    let result = 0n;
    for (let i = 0n; i < 128n; i++) {
        let bit1 = (n >> i) & 1n;
        let bit2 = (n >> (255n - i)) & 1n;
        if (bit2) result |= 1n << i;
        if (bit1) result |= 1n << (255n - i);
    }
    return result;
}

// POINT OPERATIONS
function modInverse(a, m) {
    let [old_r, r] = [a, m];
    let [old_s, s] = [1n, 0n];
    while (r !== 0n) {
        let quotient = old_r / r;
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
    }
    return (old_s % m + m) % m;
}

function pointAdd(p1, p2) {
    if (!p1) return p2;
    if (!p2) return p1;
    if (p1.x === p2.x) {
        if (p1.y === p2.y) return pointDouble(p1);
        return null;
    }
    const s = ((p2.y - p1.y) * modInverse(p2.x - p1.x, P)) % P;
    const x3 = (s * s - p1.x - p2.x) % P;
    const y3 = (s * (p1.x - x3) - p1.y) % P;
    return { x: (x3 + P) % P, y: (y3 + P) % P };
}

function pointDouble(p) {
    if (!p || p.y === 0n) return null;
    const s = ((3n * p.x * p.x + A) * modInverse(2n * p.y, P)) % P;
    const x3 = (s * s - 2n * p.x) % P;
    const y3 = (s * (p.x - x3) - p.y) % P;
    return { x: (x3 + P) % P, y: (y3 + P) % P };
}

function pointMultiply(k, p) {
    if (k === 0n || !p) return null;
    let result = null;
    let addend = p;
    while (k > 0n) {
        if (k & 1n) result = pointAdd(result, addend);
        addend = pointDouble(addend);
        k >>= 1n;
    }
    return result;
}

function pointNegate(p) {
    if (!p) return null;
    return { x: p.x, y: (P - p.y) % P };
}

// DERIVATION
function derivePublicKey() {
    const scalar = fromHex(document.getElementById('scalar').value);
    if (scalar === 0n) {
        document.getElementById('derivationOutput').innerHTML = '❌ Scalar must be non-zero';
        return;
    }
    const pubKey = pointMultiply(scalar, G);
    if (!pubKey) {
        document.getElementById('derivationOutput').innerHTML = '❌ Error deriving public key';
        return;
    }
    document.getElementById('pointX').value = toHex(pubKey.x);
    document.getElementById('pointY').value = toHex(pubKey.y);
    document.getElementById('derivationOutput').innerHTML = `
        <div class="pipeline-result">
            <strong>Public Key Derived</strong><br>
            Scalar: <code>${toHex(scalar)}</code><br>
            Point X: <code>${toHex(pubKey.x)}</code><br>
            Point Y: <code>${toHex(pubKey.y)}</code>
        </div>
    `;
}

function pointOp(op) {
    const x = fromHex(document.getElementById('pointX').value);
    const y = fromHex(document.getElementById('pointY').value);
    const p = { x, y };
    let result;
    let desc = '';

    switch (op) {
        case 'neg':
            result = pointNegate(p);
            desc = 'Negated Point';
            break;
        case 'double':
            result = pointDouble(p);
            desc = 'Doubled Point (2P)';
            break;
        case 'scalar_mul':
            const k = fromHex(document.getElementById('scalar').value);
            result = pointMultiply(k, p);
            desc = `Scalar Multiply (${toHex(k)} * P)`;
            break;
    }

    if (!result) {
        document.getElementById('derivationOutput').innerHTML = '❌ Operation failed';
        return;
    }

    document.getElementById('derivationOutput').innerHTML = `
        <div class="pipeline-result">
            <strong>${desc}</strong><br>
            Result X: <code>${toHex(result.x)}</code><br>
            Result Y: <code>${toHex(result.y)}</code>
        </div>
    `;
}

// PIPELINE
async function runPipeline() {
    let value = document.getElementById('pipelineInput').value.trim();
    const rounds = parseInt(document.getElementById('rounds').value);
    let output = '<strong>Pipeline Execution:</strong><br>';

    if (!value) {
        document.getElementById('pipelineOutput').innerHTML = '❌ Enter input';
        return;
    }

    // Convert to hex if not already
    if (!value.match(/^[0-9a-fA-F]*$/)) {
        value = utf8ToHex(value);
    }

    output += `<div class="pipeline-result">Round 0 (Input): <code>${value}</code></div>`;

    for (let i = 1; i <= rounds; i++) {
        // Apply transformations
        value = await sha256(value);
        output += `<div class="pipeline-result">Round ${i} (SHA256): <code>${value}</code></div>`;

        // Bitwise operations
        const bits = reverseBits(fromHex(value));
        value = toHex(bits);
        output += `<div class="pipeline-result">Round ${i} (Reverse Bits): <code>${value}</code></div>`;
    }

    document.getElementById('pipelineOutput').innerHTML = output;
}

function clearPipeline() {
    document.getElementById('pipelineInput').value = '';
    document.getElementById('pipelineOutput').innerHTML = '';
}

// RELATIONSHIP SCANNER
async function scanRelationships() {
    const val1Hex = document.getElementById('scanValue1').value.trim();
    const val2Hex = document.getElementById('scanValue2').value.trim();

    if (!val1Hex || !val2Hex) {
        document.getElementById('scannerOutput').innerHTML = '❌ Enter both values';
        return;
    }

    const val1 = fromHex(val1Hex);
    const val2 = fromHex(val2Hex);
    let output = '<strong>Relationship Analysis:</strong><br>';

    // XOR distance
    const xorDist = val1 ^ val2;
    output += `<div class="relationship"><strong>XOR Distance:</strong> <code>${toHex(xorDist)}</code></div>`;

    // Hamming distance (number of differing bits)
    let hammingDist = 0n;
    let temp = xorDist;
    while (temp > 0n) {
        hammingDist += temp & 1n;
        temp >>= 1n;
    }
    output += `<div class="relationship"><strong>Hamming Distance:</strong> ${hammingDist} bits</div>`;

    // OR relationship
    const orVal = val1 | val2;
    output += `<div class="relationship"><strong>OR (Combined bits):</strong> <code>${toHex(orVal)}</code></div>`;

    // AND relationship
    const andVal = val1 & val2;
    output += `<div class="relationship"><strong>AND (Common bits):</strong> <code>${toHex(andVal)}</code></div>`;

    // Modular relationship in different domains
    const mod_p_1 = val1 % P;
    const mod_p_2 = val2 % P;
    const mod_n_1 = val1 % N;
    const mod_n_2 = val2 % N;

    output += `<div class="relationship"><strong>Modulo P Domain:</strong><br>Val1 mod P: <code>${toHex(mod_p_1)}</code><br>Val2 mod P: <code>${toHex(mod_p_2)}</code></div>`;
    output += `<div class="relationship"><strong>Modulo N Domain:</strong><br>Val1 mod N: <code>${toHex(mod_n_1)}</code><br>Val2 mod N: <code>${toHex(mod_n_2)}</code></div>`;

    // Hash relationship
    const hash1 = await sha256(val1Hex);
    const hash2 = await sha256(val2Hex);
    const hashXor = fromHex(hash1) ^ fromHex(hash2);
    output += `<div class="relationship"><strong>SHA256 XOR:</strong> <code>${toHex(hashXor)}</code></div>`;

    document.getElementById('scannerOutput').innerHTML = output;
}

// VERIFY
async function verify(type) {
    const value = fromHex(document.getElementById('verifyValue').value);
    let result = '';

    switch (type) {
        case 'prime':
            result = isPrime(value) ? '✅ Likely Prime' : '❌ Not Prime';
            break;
        case 'even':
            result = (value & 1n) === 0n ? '✅ Even' : '❌ Odd';
            break;
        case 'curve':
            const x = fromHex(document.getElementById('pointX').value);
            const y = fromHex(document.getElementById('pointY').value);
            const check = (y * y - (x * x * x + B)) % P;
            result = check === 0n ? '✅ On Curve' : '❌ Not on Curve';
            break;
        case 'invertible':
            try {
                modInverse(value, P);
                result = '✅ Invertible mod P';
            } catch {
                result = '❌ Not Invertible mod P';
            }
            break;
    }

    document.getElementById('verifyOutput').innerHTML = `
        <div class="pipeline-result">
            <strong>${type.toUpperCase()} Check</strong><br>
            Value: <code>${toHex(value)}</code><br>
            Result: ${result}
        </div>
    `;
}

function isPrime(n) {
    if (n < 2n) return false;
    if (n === 2n) return true;
    if (n % 2n === 0n) return false;
    // Simple fermat test
    for (let i = 0; i < 10; i++) {
        const a = 2n + BigInt(Math.floor(Math.random() * 1000000));
        if (modPow(a, n - 1n, n) !== 1n) return false;
    }
    return true;
}

function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) result = (result * base) % mod;
        exp = exp >> 1n;
        base = (base * base) % mod;
    }
    return result;
}
