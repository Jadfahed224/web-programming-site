var form = document.getElementById('profile-form');

var reviewPanel = document.createElement('section');
reviewPanel.id = 'review-panel';
reviewPanel.classList.add('panel');

var reviewContent = document.createElement('div');
reviewContent.id = 'review-content';
reviewPanel.appendChild(reviewContent);

var editButton = document.createElement('input');
editButton.type = 'button';
editButton.id = 'edit-button';
editButton.value = 'Edit Form';
reviewPanel.appendChild(editButton);

var confirmButton = document.createElement('input');
confirmButton.type = 'button';
confirmButton.id = 'confirm-button';
confirmButton.value = 'Confirm Submission';
reviewPanel.appendChild(confirmButton);

form.parentNode.appendChild(reviewPanel);

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    if (!form.checkValidity()) {
        form.reportValidity(); // Show validation messages if any
        return;
    }

    const stdId = document.getElementById('StdId').value;
    const fullName = document.getElementById('FullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthdate = document.getElementById('birthdate').value;
    const githubURL = document.getElementById('GithubUrl').value;
    const renderLink = document.getElementById('RenderLink').value;
    const major = document.getElementById('EngMajor').value;
    const gpa = document.getElementById('GPA').value;
    const credits = document.getElementById('CreditsCompleted').value;
    const grad = document.querySelector('input[name="graduation"]:checked')?.value;
    const expectedGrad = document.getElementById('ExpectedGraduationMandY').value;
    const internship = document.querySelector('input[name="internship_completed"]:checked')?.value;
    const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(cb => cb.value);
    const language = document.getElementById('PrimaryProgLang').value;
    const softwareUsed = [...document.getElementById('EngSoftwareUsed').selectedOptions].map(opt => opt.value);
    const pTitle = document.getElementById('ProjectTitle').value;
    const pArea = document.getElementById('ProjectArea').value;
    const pDesc = document.getElementById('ProjectDescription').value;
    const teamSize = document.getElementById('TeamSize').value;
    const pColor = document.getElementById('ProjDashboardColor').value;
    const meetingDate = document.getElementById('MeetingDate').value;
    const meetingTime = document.getElementById('MeetingTime').value;
    const confirmation = [...document.querySelectorAll('input[name="confirmation"]:checked')].map(cb => cb.value);

    reviewContent.textContent = "";

        const studentId = document.createElement("p");
        studentId.textContent = "Student ID: " + stdId;
        reviewContent.appendChild(studentId);

        const fullname = document.createElement("p");
        fullname.textContent = "Full Name: " + fullName;
        reviewContent.appendChild(fullname);

        const emailAddress = document.createElement("p");
        emailAddress.textContent = "Email: " + email;
        reviewContent.appendChild(emailAddress);

        const phoneNumber = document.createElement("p");
        phoneNumber.textContent = "Phone: " + phone;
        reviewContent.appendChild(phoneNumber);

        const birthDate = document.createElement("p");
        birthDate.textContent = "Birthdate: " + birthdate;
        reviewContent.appendChild(birthDate);

        const github = document.createElement("p");
        github.textContent = "GitHub URL: " + githubURL;
        reviewContent.appendChild(github);

        const render = document.createElement("p");
        render.textContent = "Render Link: " + renderLink;
        reviewContent.appendChild(render);

        const majorField = document.createElement("p");
        majorField.textContent = "Engineering Major: " + major;
        reviewContent.appendChild(majorField);

        const gpaField = document.createElement("p");
        gpaField.textContent = "GPA: " + gpa;
        reviewContent.appendChild(gpaField);

        const creditsField = document.createElement("p");
        creditsField.textContent = "Credits Completed: " + credits;
        reviewContent.appendChild(creditsField);

        const gradField = document.createElement("p");
        gradField.textContent = "Graduation Season: " + grad;
        reviewContent.appendChild(gradField);

        const expectedGradField = document.createElement("p");
        expectedGradField.textContent = "Expected Graduation: " + expectedGrad;
        reviewContent.appendChild(expectedGradField);

        const internshipField = document.createElement("p");
        internshipField.textContent = "Internship Completed: " + (internship || "Not selected");
        reviewContent.appendChild(internshipField);

        // Display each selected skill separately
        skills.forEach(function(skill) {
            const skillsField = document.createElement("p");
            skillsField.textContent = "Skill: " + skill;
            reviewContent.appendChild(skillsField);
        });

        const languageField = document.createElement("p");
        languageField.textContent = "Primary Programming Language: " + language;
        reviewContent.appendChild(languageField);

        // Display each selected software separately
        softwareUsed.forEach(function(software) {
            const softwareField = document.createElement("p");
            softwareField.textContent = "Engineering Software: " + software;
            reviewContent.appendChild(softwareField);
        });

        const projectTitleField = document.createElement("p");
        projectTitleField.textContent = "Project Title: " + pTitle;
        reviewContent.appendChild(projectTitleField);

        const projectAreaField = document.createElement("p");
        projectAreaField.textContent = "Project Area: " + pArea;
        reviewContent.appendChild(projectAreaField);

        const projectDescField = document.createElement("p");
        projectDescField.textContent = "Project Description: " + (pDesc || "Not provided");
        reviewContent.appendChild(projectDescField);

        const teamSizeField = document.createElement("p");
        teamSizeField.textContent = "Team Size: " + teamSize;
        reviewContent.appendChild(teamSizeField);

        const projectColorField = document.createElement("p");
        projectColorField.textContent = "Project Dashboard Color: " + pColor;
        reviewContent.appendChild(projectColorField);

        const meetingDateField = document.createElement("p");
        meetingDateField.textContent = "Meeting Date: " + meetingDate;
        reviewContent.appendChild(meetingDateField);

        const meetingTimeField = document.createElement("p");
        meetingTimeField.textContent = "Meeting Time: " + meetingTime;
        reviewContent.appendChild(meetingTimeField);

        const confirmationField = document.createElement("p");
        confirmationField.textContent = "Confirmation: " + (confirmation ? "Confirmed" : "Not confirmed");
        reviewContent.appendChild(confirmationField);

        form.style.display = "none";
        reviewPanel.classList.add("open");
});

editButton.addEventListener('click', function() {
    reviewPanel.classList.remove('open');
    form.style.display = 'block';
});

confirmButton.addEventListener('click', function() {
    form.submit();
});