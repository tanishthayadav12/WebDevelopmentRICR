function submitRegistration() {

  const name = document.getElementById("regName").value;
  const college = document.getElementById("regCollege").value;
  const branch = document.getElementById("regBranch").value;
  const semester = document.getElementById("regSemester").value;
  const phone = document.getElementById("regPhone").value;
  const email = document.getElementById("regEmail").value;
  const course = document.getElementById("courseField").value;

  let gender = "Not selected";
  if (document.getElementById("male").checked) gender = "Male";
  if (document.getElementById("female").checked) gender = "Female";
  if (document.getElementById("other").checked) gender = "Other";


  console.log("Name:", name);
  console.log("College:", college);
  console.log("Branch:", branch);
  console.log("Semester:", semester);
  console.log("Phone:", phone);
  console.log("Email:", email);
  console.log("Gender:", gender);
  console.log("Course:", course);

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
