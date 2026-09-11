function escapeHtml(text) {
	if (text == null) return "";
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}

function renderContent(data) {
	if (!data) return;

	if (data.title) {
		document.title = data.title;
	}

	// Name & Subtitle
	const nameEl = document.getElementById("name");
	if (nameEl && data.name) {
		nameEl.textContent = data.name;
	}

	const subEl = document.getElementById("sub");
	if (subEl && data.sub) {
		subEl.textContent = data.sub;
	}

	// Contact details
	const contactListEl = document.getElementById("contact-list");
	if (contactListEl) {
		const contactItems = [];

		if (data.location) {
			const href = data.map_link ? escapeHtml(data.map_link) : "#";
			contactItems.push(
				`<li><a href="${href}">${escapeHtml(data.location)}</a></li>`
			);
		}
		if (data.email) {
			contactItems.push(
				`<li><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></li>`
			);
		}
		if (data.linkedin) {
			const displayLinkedin = data.linkedin.replace(/^https?:\/\//, "");
			contactItems.push(
				`<li><a href="${escapeHtml(data.linkedin)}">${escapeHtml(displayLinkedin)}</a></li>`
			);
		}
		if (data.github) {
			const displayGithub = data.github.replace(/^https?:\/\//, "");
			contactItems.push(
				`<li><a href="${escapeHtml(data.github)}">${escapeHtml(displayGithub)}</a></li>`
			);
		}
		if (data.phone) {
			contactItems.push(
				`<li><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></li>`
			);
		}

		contactListEl.innerHTML = contactItems.join("");
	}

	// Summary
	const summaryEl = document.getElementById("summary");
	if (summaryEl && data.summary) {
		summaryEl.textContent = data.summary;
	}

	// Experience
	const expListEl = document.getElementById("experience-list");
	if (expListEl && Array.isArray(data.experiences)) {
		expListEl.innerHTML = data.experiences
			.map((exp) => {
				const company = exp.company
					? `<strong>${escapeHtml(exp.company)}</strong>`
					: "";
				const title = exp.title ? escapeHtml(exp.title) : "";
				const heading =
					company && title
						? `${company} | ${title}`
						: company || title;

				const dates =
					exp.start_date && exp.end_date
						? `${escapeHtml(exp.start_date)} – ${escapeHtml(exp.end_date)}`
						: escapeHtml(exp.start_date || exp.end_date || "");

				const responsibilities =
					Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
						? `<ul>${exp.responsibilities.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>`
						: "";

				return `
					<article>
						<header>
							<h3>${heading}</h3>
							${dates ? `<p><em>${dates}</em></p>` : ""}
						</header>
						${responsibilities}
					</article>
				`.trim();
			})
			.join("");
	}

	// Projects
	const projectListEl = document.getElementById("project-list");
	if (projectListEl && Array.isArray(data.projects)) {
		projectListEl.innerHTML = data.projects
			.map((proj) => {
				const year = proj.year ? ` (${escapeHtml(proj.year)})` : "";
				const title = proj.title
					? `<strong>${escapeHtml(proj.title)}${year}:</strong> `
					: "";
				const desc = proj.description ? escapeHtml(proj.description) : "";
				const link = proj.link
					? ` <a href="${escapeHtml(proj.link)}">link</a>`
					: "";

				return `<li>${title}${desc}${link}</li>`;
			})
			.join("");
	}

	// Education
	const eduListEl = document.getElementById("education-list");
	if (eduListEl && Array.isArray(data.educations)) {
		eduListEl.innerHTML = data.educations
			.map((edu) => {
				const institution = edu.institution
					? `<strong>${escapeHtml(edu.institution)}</strong>`
					: "";
				const title = edu.title ? escapeHtml(edu.title) : "";
				const heading =
					institution && title
						? `${institution} | ${title}`
						: institution || title;

				const dates =
					edu.start_year && edu.end_year
						? `${escapeHtml(edu.start_year)} – ${escapeHtml(edu.end_year)}`
						: escapeHtml(edu.start_year || edu.end_year || "");

				const gpa = edu.gpa
					? ` | <strong>GPA: ${escapeHtml(edu.gpa)}</strong>`
					: "";

				return `
					<article>
						<header>
							<h3>${heading}</h3>
							${dates || gpa ? `<p><em>${dates}</em>${gpa}</p>` : ""}
						</header>
					</article>
				`.trim();
			})
			.join("");
	}

	// Technical Skills
	const skillListEl = document.getElementById("skill-list");
	if (skillListEl && Array.isArray(data.skills)) {
		skillListEl.innerHTML = data.skills
			.map((item) => {
				const title = item.title
					? `<strong>${escapeHtml(item.title)}:</strong> `
					: "";
				let skillsText = "";
				if (Array.isArray(item.skills)) {
					skillsText = item.skills.map((s) => escapeHtml(s)).join(", ");
				} else if (item.skills) {
					skillsText = escapeHtml(item.skills);
				}
				if (skillsText && !skillsText.endsWith(".")) {
					skillsText += ".";
				}
				return `<li>${title}${skillsText}</li>`;
			})
			.join("");
	}
}

async function loadContent() {
	try {
		const response = await fetch("src/config/content.json");
		if (!response.ok) {
			throw new Error(`Failed to load content.json: ${response.statusText}`);
		}
		const data = await response.json();
		renderContent(data);
	} catch (error) {
		console.error("Error loading CV content:", error);
	}
}

let initialized = false;
function init() {
	if (initialized) return;
	initialized = true;
	loadContent();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
