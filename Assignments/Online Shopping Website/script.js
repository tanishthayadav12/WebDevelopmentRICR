function submitRegistration() {

  const name = document.getElementById("regName").value;
  const address = document.getElementById("regAddress").value;
  const phone = document.getElementById("regPhone").value;
  const email = document.getElementById("regEmail").value;

  let payment = "Not selected";
  if (document.getElementById("upi").checked) payment = "UPI";
  if (document.getElementById("cod").checked) payment = "COD";
  if (document.getElementById("bank").checked) payment = "Bank";


  console.log("Name:", name);
  console.log("Address:", address);
  console.log("Phone:", phone);
  console.log("Email:", email);
  console.log("Payment:", payment);
  

}


function submitContact() {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);


  document.getElementById("successMsg").textContent =
    "Message sent successfully!";
}
