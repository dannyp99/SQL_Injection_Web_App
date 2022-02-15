async function getStu() {
	const stuId = document.getElementById("studentId").value;
	console.log(stuId);
	let response = await fetch(`/${stuId}`);
	console.log(response);
	if (response.ok) {
		const res = await response.json();
		const content = res[0];
		console.log(content);
		alert(`StudentID: ${content.StudentID} \npassword: ${content.password}`);
	}
}
