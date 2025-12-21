function calculateBill() {
  const Units = Number(document.getElementById("units").value);
  const errorMsg = document.getElementById("errorMsg");

  if (isNaN(Units) || Units <= 0) {
    errorMsg.classList.remove("d-none");
    document.getElementById("billDetails").classList.add("d-none");
    return;
  } else {
    errorMsg.classList.add("d-none");
  }

  let slab1Charge = 0;
  let slab2Charge = 0;
  let slab3Charge = 0;
  let slab4Charge = 0;

  if (Units <= 50) {
    slab1Charge = Units * 0.5;
  } else if (Units <= 200) {
    slab1Charge = 50 * 0.5;
    slab2Charge = (Units - 50) * 0.75;
  } else if (Units <= 450) {
    slab1Charge = 50 * 0.5;
    slab2Charge = 150 * 0.75;
    slab3Charge = (Units - 200) * 1.2;
  } else {
    slab1Charge = 50 * 0.5;
    slab2Charge = 150 * 0.75;
    slab3Charge = 250 * 1.2;
    slab4Charge = (Units - 450) * 1.5;
  }

  let subtotal = slab1Charge + slab2Charge + slab3Charge + slab4Charge;
  let surcharge = subtotal * 0.2;
  let grandTotal = subtotal + surcharge;

  document.getElementById("slab1").textContent = `₹${slab1Charge.toFixed(2)}`;
  document.getElementById("slab2").textContent = `₹${slab2Charge.toFixed(2)}`;
  document.getElementById("slab3").textContent = `₹${slab3Charge.toFixed(2)}`;
  document.getElementById("slab4").textContent = `₹${slab4Charge.toFixed(2)}`;
  document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("surcharge").textContent = `₹${surcharge.toFixed(2)}`;
  document.getElementById("grandTotal").textContent = `₹${grandTotal.toFixed(2)}`;

  document.getElementById("billDetails").classList.remove("d-none");
}