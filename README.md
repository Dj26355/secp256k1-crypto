# secp256k1 Crypto Transformation Suite

A comprehensive web-based tool for cryptographic operations on secp256k1 elliptic curve cryptography.

## Features

### 1. **Input & Hashing**
- Accept any input (text, hex, binary)
- SHA-256, SHA-1, HASH160 (SHA256+RIPEMD), MD5
- Automatic format detection

### 2. **Bitwise Operations**
- **Logical**: XOR, XNOR, OR, AND, NAND, NOT
- **Transformations**: Reverse bits, Nibble swap, Bit swap
- **Rotations**: Rotate left, Rotate right
- Full 256-bit precision with BigInt

### 3. **Point & Scalar Derivation**
- Derive public keys from private scalars (G * scalar)
- Point negation
- Point doubling (2P)
- Scalar point multiplication
- Full secp256k1 curve support

### 4. **Full Transformation Pipeline**
- Multi-round transformations
- SHA-256 hashing with bitwise operations
- Configurable number of rounds
- Complete audit trail

### 5. **Relationship Scanner**
- XOR distance between values
- Hamming distance (bit-level differences)
- OR/AND relationship analysis
- Modulo P and N domain comparisons
- Hash-based relationship detection

### 6. **Verification & Checks**
- Primality testing (Fermat test)
- Even/odd detection
- Curve point validation
- Modular invertibility checks

## Usage

1. Open `index.html` in a modern web browser
2. Select desired operation from tabs
3. Enter values (supports hex with/without 0x prefix, text, or raw data)
4. Click operation button to execute
5. View results in output boxes

## Technical Details

### secp256k1 Constants
- **Prime Field**: P = 2^256 - 2^32 - 977
- **Curve Order**: N = FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
- **Generator**: G = (0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798, 0x483ADA7726A3C4655DA4FBF8759C2DDFE1A7C9B3F5E4C84A0B5E4D2E8A7F9B2D)
- **Curve Equation**: y² = x³ + 7

### Bitwise Operations
- **XOR/XNOR/OR/AND/NAND**: Standard logical operations
- **Reverse Bits**: Complete bit reversal within 256-bit space
- **Nibble Swap**: Swaps 4-bit groups
- **Bit Swap**: Mirrors bits around the center
- **Rotate**: Circular left/right shift operations

### Modular Arithmetic
- All operations support both mod P and mod N domains
- Uses extended Euclidean algorithm for modular inverse
- BigInt for arbitrary precision

## Browser Compatibility
- Requires modern browser with:
  - BigInt support
  - Web Crypto API (for SHA-256, SHA-1)
  - ES6+ JavaScript

## Security Notes
- For educational and research purposes
- Not suitable for production key management
- Use proper cryptographic libraries for sensitive operations
- No server-side processing; all operations client-side

## Examples

### Deriving a Public Key
1. Go to **Derivation** tab
2. Enter scalar: `7a5c5a6ebae12812936f25177d246e7ef82906f92d8f30b8d72e97ec91f17285`
3. Click **Derive Public Key**
4. View resulting public key coordinates

### Bitwise Analysis
1. Go to **Bitwise Ops** tab
2. Enter Value A and B
3. Select operation (XOR, XNOR, etc.)
4. See immediate results

### Full Pipeline
1. Go to **Pipeline** tab
2. Enter input value
3. Set number of rounds (1-20)
4. Click **Run Pipeline**
5. See transformations at each stage

## Files
- `index.html` - Web UI and layout
- `crypto.js` - All cryptographic functions and operations
- `README.md` - This file

## License
MIT - Use freely for educational and research purposes
