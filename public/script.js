document.addEventListener('DOMContentLoaded', () => {

    // === System Info Logic ===
    function saveAndDisplaySysInfo() {
        const ua = navigator.userAgent;
        let os = "Невідома ОС";
        let browser = "Невідомий браузер";

        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "MacOS";
        else if (ua.includes("Linux")) os = "Linux";

        if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Edg")) browser = "Edge";

        const sysInfoString = `ОС: ${os}, Браузер: ${browser}`;
        localStorage.setItem('userSysInfo', sysInfoString);
        const savedInfo = localStorage.getItem('userSysInfo');
        document.getElementById('sys-info-display').textContent = `Ваша система: ${savedInfo}`;
    }
    saveAndDisplaySysInfo();

    // === API Comments Logic ===
    const variantNumber = 1; 
    const apiUrl = `https://jsonplaceholder.typicode.com/posts/${variantNumber}/comments`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(comments => {
            const container = document.getElementById('comments-container');
            container.innerHTML = ''; 

            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `
                    <h4>${comment.name} (${comment.email})</h4>
                    <p>${comment.body}</p>
                `;
                container.appendChild(commentDiv);
            });
        })
        .catch(error => console.error(error));

    // === Modal Logic ===
    const modal = document.getElementById('feedback-modal');
    const closeModalBtn = document.getElementById('close-modal');

    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10000); 

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // === Theme Logic ===
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    function setAutoTheme() {
        const currentHour = new Date().getHours();
        if (currentHour >= 7 && currentHour < 21) {
            body.classList.remove('dark-mode');
        } else {
            body.classList.add('dark-mode');
        }
    }
    setAutoTheme();

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    // === NEW FORM SUBMISSION LOGIC ===
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the page from reloading

            // Gather data from the form inputs
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };

            try {
                // Send the data to your Koa backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Повідомлення успішно відправлено!');
                    contactForm.reset(); // Clear the form
                    modal.style.display = 'none'; // This will now successfully close the modal!
                } else {
                    alert('Помилка: Перевірте чи всі поля заповнені.');
                }
            } catch (error) {
                console.error('Помилка сервера:', error);
                alert('Не вдалося зв\'язатися з сервером.');
            }
        });
    }
});