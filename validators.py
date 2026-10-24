
from dataclasses import field
import re
from datetime import date


# --------------------------------------------------
# 1. REGULAR EXPRESSION PATTERNS
# --------------------------------------------------

STUDENT_ID = re.compile(r"^\d{9}$")
FULLNAME = re.compile(r"^[A-Za-z][A-Za-z .'-]{1,79}$")

# USEK institutional email
EMAIL = re.compile(r"^[A-Za-z0-9._%+-]+@usek\.edu\.lb$")

# Lebanese phone number
PHONE = re.compile(r"^\+961\s?(?:3|70|71|76|78|79|81)\s?\d{6}$")

# GitHub profile URL
GITHUB = re.compile(r"^https://github\.com/[A-Za-z0-9-]{1,39}/?$")

# Any HTTPS URL
HTTPS_URL = re.compile(r"^https://[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?::\d+)?(?:/[^\s]*)?$")

# Graduation month: YYYY-MM
MONTH = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")

# Time: HH:MM, 24-hour format
TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")

# Hexadecimal color: #336699
HEXCOLOR = re.compile(r"^#[0-9A-Fa-f]{6}$")


# --------------------------------------------------
# 2. ALLOW-LISTS
# Change these values to match your HTML form.
# --------------------------------------------------

MAJORS = {"computer", "electrical", "biomedical", "telecommunications"}
GRADUATION = {"spring", "summer", "fall"}
YESNO = {"yes", "no"}

SKILLS = {"ai", "html", "css", "javascript", "python"}

SOFTWARE = {"matlab", "vscode", "git", "flask"}

PROJECT_AREAS = {"web", "ai", "software", "hardware"}

REQUIRED = {"student_id", "fullname", "email", "major", "graduation"}


# --------------------------------------------------
# 3. HELPER FUNCTIONS
# --------------------------------------------------

def parse_date(text):
    try:
        return date.fromisoformat(text)
    except ValueError:
        return None


def to_number(text):
    try:
        return float(text)
    except ValueError:
        return None


def to_int(text):
    try:
        if not re.fullmatch(r"\d+", text):
            return None
        return int(text)
    except ValueError:
        return None


# --------------------------------------------------
# 4. MAIN VALIDATION FUNCTION
# --------------------------------------------------

def validate_profile(form):
    errors = {}
    cleaned = {}

    # 1. Required fields
    for field in REQUIRED:
        if form.get(field, "").strip() == "":
            errors[field] = "This field is required."

    # 2. Student ID
    student_id = form.get("student_id", "").strip()
    if student_id and not STUDENT_ID.fullmatch(student_id):
        errors["student_id"] = "Student ID must be exactly 9 digits."
    cleaned["student_id"] = student_id

    # 3. Full name
    fullname = form.get("fullname", "").strip()
    if fullname and not FULLNAME.fullmatch(fullname):
        errors["fullname"] = "Use 2-80 valid characters."
    cleaned["fullname"] = fullname

    # 4. USEK email
    email = form.get("email", "").strip().lower()
    if email and not EMAIL.fullmatch(email):
        errors["email"] = "Use your USEK email (...@usek.edu.lb)."
    cleaned["email"] = email

    # 5. Lebanese phone number
    phone = form.get("phone", "").strip()
    if phone and not PHONE.fullmatch(phone):
        errors["phone"] = "Enter a valid Lebanese phone number."
    cleaned["phone"] = phone

    # 6. Date of birth
    birthdate = form.get("birthdate", "").strip()
    if birthdate != "":
        day = parse_date(birthdate)
        if day is None:
            errors["birthdate"] = "Not a valid date."
        elif day > date.today():
            errors["birthdate"] = "Date of birth cannot be in the future."
        else:
            age = (date.today() - day).days // 365
            if age < 15 or age > 100:
                errors["birthdate"] = "Age looks out of range."
    cleaned["birthdate"] = birthdate

    # 7. GitHub link
    portfolio = form.get("portfolio", "").strip()
    if portfolio and not GITHUB.fullmatch(portfolio):
        errors["portfolio"] = "Use a GitHub URL: https://github.com/username"
    cleaned["portfolio"] = portfolio

    # 8. GIN446 website link
    gin446 = form.get("gin446", "").strip()
    if gin446 and not HTTPS_URL.fullmatch(gin446):
        errors["gin446"] = "Enter a valid HTTPS link."
    cleaned["gin446"] = gin446

    # 9. Major
    major = form.get("major", "").strip().lower()
    if major != "" and major not in MAJORS:
        errors["major"] = "Choose a valid major."
    cleaned["major"] = major

    # 10. GPA: number between 40 and 100
    gpa = form.get("gpa", "").strip()
    if gpa != "":
        number = to_number(gpa)
        if number is None or number < 40 or number > 100:
            errors["gpa"] = "GPA must be a number between 40 and 100."
    cleaned["gpa"] = gpa

    # 11. Credits: number between 0 and 148
    credits = form.get("credits", "").strip()
    if credits != "":
        number = to_int(credits)
        if number is None or number < 0 or number > 148:
            errors["credits"] = "Credits must be a whole number between 0 and 148."
    cleaned["credits"] = credits

    # 12. Expected graduation: spring / summer / fall
    graduation = form.get("graduation", "").strip().lower()
    if graduation != "" and graduation not in GRADUATION:
        errors["graduation"] = "Choose spring, summer or fall."
    cleaned["graduation"] = graduation

    # 13. Graduation month: YYYY-MM
    graduation_month = form.get("graduation_month", "").strip()
    if graduation_month != "" and not MONTH.match(graduation_month):
        errors["graduation_month"] = "Use the month picker (YYYY-MM)."
    cleaned["graduation_month"] = graduation_month

    # 14. Internship completed
    internship = form.get("internship_completed", "").strip().lower()
    if internship and internship not in YESNO:
        errors["internship_completed"] = "Choose yes or no."
    cleaned["internship_completed"] = internship

    # 15. Primary language
    language = form.get("language", "").strip()
    if len(language) > 40:
        errors["language"] = "Keep it under 40 characters."
    cleaned["language"] = language

    #16. Skills: checkboxes -> a list. Keep only values we recognise.
    skills = form.getlist("skills")
    good_skills = []
    bad_skills = []
    for skill in skills:
        if skill in SKILLS:
            good_skills.append(skill)
        else:
            bad_skills.append(skill)
    if bad_skills:
        errors["skills"] = "Unknown skill(s): " + ", ".join(bad_skills)
    cleaned["skills"] = good_skills

    #17. Software: multi-select -> a list. Same idea as skills.
    software = form.getlist("software")
    used_software = []
    unused_software = []
    for soft in software:
        if soft in SOFTWARE:
            used_software.append(soft)
        else:
            unused_software.append(soft)
    if unused_software:
        errors["software"] = "Unknown software: " + ", ".join(unused_software)
    cleaned["software"] = used_software

    # 18. Project title: at most 120 characters
    project_title = form.get("project_title", "").strip()
    if len(project_title) >= 120:
        errors["project_title"] = "Title must be 120 characters or fewer."
    cleaned["project_title"] = project_title

    # 19. Project area
    project_area = form.get("project_area", "").strip().lower()
    if project_area and project_area not in PROJECT_AREAS:
        errors["project_area"] = "Choose a valid project area."
    cleaned["project_area"] = project_area

    # 20. Description: at most 1000 characters
    description = form.get("description", "").strip()
    if len(description) >= 1000:
        errors["description"] = "Description must be 1000 characters or fewer."
    cleaned["description"] = description

    # 21. Team size: a whole number from 1 to 4
    team_size = form.get("team_size", "").strip()
    if team_size != "":
        number = to_int(team_size)
        if number is None or number < 1 or number > 4:
            errors["team_size"] = "Team size must be a whole number from 1 to 4."
    cleaned["team_size"] = team_size

    # 22. Dashboard color
    project_color = form.get("project_color", "").strip()
    if project_color !="" and not HEXCOLOR.match(project_color):
        errors["project_color"] = "Use a colour like #336699."
    if not project_color == "":
        project_color = "#336699"
    cleaned["project_color"] = project_color

    # 23. Meeting date
    meeting_date = form.get("meeting_date", "").strip()
    if meeting_date and parse_date(meeting_date) is None:
        errors["meeting_date"] = "Not a valid date."
    cleaned["meeting_date"] = meeting_date

    #24. Meeting time: shape HH:MM, between 08:00 and 18:00
    meeting_time = form.get("meeting_time", "").strip()
    if meeting_time:
        if not TIME.match(meeting_time):
            errors["meeting_time"] = "Use HH:MM."
        elif not "08:00" <= meeting_time <= "18:00":
            errors["meeting_time"] = "Pick a time between 08:00 and 18:00."
    cleaned["meeting_time"] = meeting_time

    # 25. Confirmation
    confirmation = form.get("confirmation", "").strip().lower()
    if confirmation != "on":
        errors["confirmation"] = "You must confirm the information is accurate."
    cleaned["confirmation"] = confirmation

    # Return validation errors and cleaned data
    return errors, cleaned

    errors[field] = "This field is required."
    errors["student_id"] = "Student ID must be exactly 9 digits."
    errors["fullname"] = "Use letters, spaces, hyphens or apostrophes (2-80 chars)."
    errors["email"] = "Use your USEK email (...@usek.edu.lb)."
    errors["phone"] = "Enter a valid Lebanese number, e.g. +961 70 123456."
    errors["birthdate"] = "Not a valid date."
    errors["birthdate"] = "Date of birth cannot be in the future."
    errors["birthdate"] = "Age looks out of range."
    errors["portfolio"] = "Use a GitHub URL: https://github.com/username"
    errors["gin446"] = "Enter a valid https:// link."
    errors["major"] = "Choose a valid major."
    errors["gpa"] = "GPA must be a number between 40 and 100."
    errors["credits"] = "Credits must be a whole number between 0 and 148."
    errors["graduation"] = "Choose spring, summer or fall."
    errors["graduation_month"] = "Use the month picker (YYYY-MM)."
    errors["internship_completed"] = "Choose yes or no."
    errors["language"] = "Keep it under 40 characters."
    errors["skills"] = f"Unknown skill(s): {unknown_skills}"
    errors["software"] = f"Unknown software: {unknown_software}"
    errors["project_title"] = "Title must be 120 characters or fewer."
    errors["project_area"] = "Choose a valid project area."
    errors["description"] = "Description must be 1000 characters or fewer."
    errors["team_size"] = "Team size must be a whole number from 1 to 4."
    errors["project_color"] = "Use a colour like #336699."
    errors["meeting_date"] = "Not a valid date."
    errors["meeting_time"] = "Use HH:MM."
    errors["meeting_time"] = "Pick a time between 08:00 and 18:00."
    errors["confirmation"] = "You must confirm the information is accurate."
