import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import sharp from "sharp";
import jsQR from "jsqr";

const VERIFIED_UPI_ID = "8299052548m@pnb";
const VERIFIED_PAYEE_NAME = "Ashish Foundation";
const VERIFIED_CURRENCY = "INR";

function buildTestUri(amount) {
  const parts = [
    `pa=${encodeURIComponent(VERIFIED_UPI_ID)}`,
    `pn=${encodeURIComponent(VERIFIED_PAYEE_NAME).replace(/%20/g, "%20")}`,
    `cu=${VERIFIED_CURRENCY}`,
  ];
  if (typeof amount === "number" && amount > 0) {
    const formatted = amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
    parts.push(`am=${formatted}`);
  }
  parts.push(`tn=${encodeURIComponent("Donation to Ashish Foundation").replace(/%20/g, "%20")}`);
  return `upi://pay?${parts.join("&")}`;
}

async function decodeImageBuffer(buffer) {
  const { data, info } = await sharp(buffer)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height);
}

function parseUpiParams(decodedStr) {
  if (!decodedStr.startsWith("upi://pay?")) {
    throw new Error(`Decoded string does not start with upi://pay?: "${decodedStr}"`);
  }
  const query = decodedStr.replace("upi://pay?", "");
  const searchParams = new URLSearchParams(query);
  return {
    pa: searchParams.get("pa"),
    pn: searchParams.get("pn"),
    cu: searchParams.get("cu"),
    am: searchParams.get("am"),
    tn: searchParams.get("tn"),
  };
}

async function runValidation() {
  console.log("============================================================");
  console.log("ASHISH FOUNDATION - UPI QR VALIDATION SUITE");
  console.log("============================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, testName, details = "") {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] ${testName}`);
    } else {
      console.error(`[FAIL] ${testName}: ${details}`);
    }
  }

  // TEST 1: Validate static public/images/donation-qr.png
  console.log("--- 1. Testing Static Assets in public/images ---");
  const pngPath = path.resolve("public/images/donation-qr.png");
  assert(fs.existsSync(pngPath), "public/images/donation-qr.png exists");

  const pngBuffer = fs.readFileSync(pngPath);
  const pngDecoded = await decodeImageBuffer(pngBuffer);
  assert(pngDecoded !== null, "donation-qr.png decodes successfully with jsQR");
  if (pngDecoded) {
    const params = parseUpiParams(pngDecoded.data);
    assert(params.pa === VERIFIED_UPI_ID, `PNG UPI ID matches (${params.pa} === ${VERIFIED_UPI_ID})`);
    assert(params.pn === VERIFIED_PAYEE_NAME, `PNG Payee matches (${params.pn} === ${VERIFIED_PAYEE_NAME})`);
    assert(params.cu === VERIFIED_CURRENCY, `PNG Currency matches (${params.cu} === ${VERIFIED_CURRENCY})`);
    console.log(`       Decoded URI: ${pngDecoded.data}`);
  }

  // TEST 2: Validate static public/images/donation-qr.jpg
  const jpgPath = path.resolve("public/images/donation-qr.jpg");
  assert(fs.existsSync(jpgPath), "public/images/donation-qr.jpg exists");

  const jpgBuffer = fs.readFileSync(jpgPath);
  const jpgDecoded = await decodeImageBuffer(jpgBuffer);
  assert(jpgDecoded !== null, "donation-qr.jpg decodes successfully with jsQR");
  if (jpgDecoded) {
    const params = parseUpiParams(jpgDecoded.data);
    assert(params.pa === VERIFIED_UPI_ID, `JPG UPI ID matches (${params.pa} === ${VERIFIED_UPI_ID})`);
    assert(params.pn === VERIFIED_PAYEE_NAME, `JPG Payee matches (${params.pn} === ${VERIFIED_PAYEE_NAME})`);
    assert(params.cu === VERIFIED_CURRENCY, `JPG Currency matches (${params.cu} === ${VERIFIED_CURRENCY})`);
    console.log(`       Decoded URI: ${jpgDecoded.data}`);
  }

  // TEST 3: Validate static public/images/donation-qr.svg
  const svgPath = path.resolve("public/images/donation-qr.svg");
  assert(fs.existsSync(svgPath), "public/images/donation-qr.svg exists");

  // TEST 4: Validate Dynamic QR Generation for various amounts
  console.log("\n--- 2. Testing Dynamic Amount QR Generation ---");
  const testAmounts = [null, 0, 500, 1000, 2500, 5000, 1250.75];

  for (const amount of testAmounts) {
    const expectedUri = buildTestUri(amount);
    const dynamicBuffer = await QRCode.toBuffer(expectedUri, {
      type: "png",
      margin: 4,
      width: 600,
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#ffffff" },
    });

    const decoded = await decodeImageBuffer(dynamicBuffer);
    const label = amount ? `₹${amount}` : "Open Amount (null/0)";

    assert(decoded !== null, `Dynamic QR decodes for ${label}`);
    if (decoded) {
      assert(decoded.data.startsWith("upi://pay?"), `URI protocol is upi://pay? for ${label}`);
      const params = parseUpiParams(decoded.data);
      assert(params.pa === VERIFIED_UPI_ID, `Payee Address matches for ${label}`);
      assert(params.pn === VERIFIED_PAYEE_NAME, `Payee Name matches for ${label}`);
      assert(params.cu === VERIFIED_CURRENCY, `Currency matches INR for ${label}`);

      if (amount && amount > 0) {
        const expectedAm = amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
        assert(params.am === expectedAm, `Amount parameter correctly encoded (${params.am} === ${expectedAm})`);
      } else {
        assert(params.am === null || params.am === undefined, `Amount parameter omitted for open amount`);
      }
    }
  }

  console.log("\n============================================================");
  console.log(`VALIDATION SUMMARY: ${passedTests}/${totalTests} checks passed.`);
  console.log("============================================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runValidation().catch((err) => {
  console.error("Validation failed with error:", err);
  process.exit(1);
});
