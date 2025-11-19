function submitForm() {
  console.log("Form Submitted");

  const name = document.getElementById("personName").value;
  const phone = document.getElementById("contactNumber").value;
  const email = document.getElementById("email").value;
  const qual = document.getElementById("qualification").value;
  const college = document.getElementById("collegeSchool").value;
  const year = document.getElementById("year").value;
  const branch = document.getElementById("branch").value;
  const source = document.getElementById("source").value;
  const execName = document.getElementById("executive").value;
  const msg = document.getElementById("message").value;

  console.log("Name:", name);
  console.log("Phone:", phone);
  console.log("Email:", email);
  console.log("Qualification:", qual);
  console.log("College:", college);
  console.log("Year:", year);
  console.log("Branch:", branch);
  console.log("Source:", source);
  console.log("Executive:", execName);
  console.log("Message:", msg);

  alert("Form submitted successfully!");

  document.getElementById("personName").value = " ";
  document.getElementById("contactNumber").value = " ";
  document.getElementById("email").value = " ";
  document.getElementById("qualification").value = " ";
  document.getElementById("collegeSchool").value = " ";
  document.getElementById("year").value = " ";
  document.getElementById("branch").value = " ";
  document.getElementById("source").value = " ";
  document.getElementById("executive").value = " ";
  document.getElementById("message").value = "";
}
