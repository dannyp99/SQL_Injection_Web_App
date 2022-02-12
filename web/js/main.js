async function getGrade() {
	const stuId = document.getElementById("studentId").value;
	const passwd = document.getElementById("passwd").value;
	let response = await fetch(`/students/${stuId},${passwd}`)
	console.log(response);
	if (response.ok) {
		let content = await response.json();
		console.log(content);
		if (document.getElementById('resultGrades') === null && content) {
			let gradeDisplay = document.createElement('div');
			gradeDisplay.className = 'center';
			gradeDisplay.id = 'resultGrades';
			gradeDisplay.innerHTML = `<p>${content}</p>`;
		}
	}
}
