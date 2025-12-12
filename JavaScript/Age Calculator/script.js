function calculate() {
  const db = document.getElementById("dob").value;
  const cd = document.getElementById("cd").value;

  if (!db || !cd) {
    document.getElementById("result").innerText = "Invalid Input*";
    return;
  }

  let age = new Date(cd).getFullYear() - new Date(db).getFullYear();
  const m = new Date(cd).getMonth() - new Date(db).getMonth();

  if (m < 0 || (m === 0 && new Date(cd).getDate() < new Date(db).getDate())) {
    age--;
  }

  document.getElementById("result").innerText = `Your Age is: ${age} Years`;
  
  document.getElementById("dob").value = "";
  document.getElementById("cd").value = "";
}
