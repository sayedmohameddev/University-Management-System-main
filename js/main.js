
//* give event margin left if dir arabic * */
let days = document.getElementsByClassName('day');

// تحقق مما إذا كانت القيمة 'rtl'
if (localStorage.getItem("language") || "en" === 'rtl') {
    for (let i = 0; i < days.length; i++) {
        days[i].style.marginLeft = "20px"; // تطبيق الـ margin left إذا كانت الاتجاه 'rtl'
    }
}

// ==============================================================================================================
//  database for tranning 

let dbTraining;
let trainingCartona = []; // تعديل اسم المتغير

const dbTrainings = new Promise((resolve, reject) => {
    const request = indexedDB.open("trainingDatabase", 1);

    request.onerror = function (event) {
        console.error("خطأ في فتح قاعدة البيانات:", event);
        reject(event.target.error);
    };

    request.onsuccess = function (event) {
        dbTraining = event.target.result;
        console.log("تم فتح قاعدة البيانات بنجاح");
        resolve(dbTraining);
    };

    request.onupgradeneeded = function (event) {
        dbTraining = event.target.result;
        const trainingStore = dbTraining.createObjectStore("training", {
            keyPath: "id",
            autoIncrement: true,
        });
    };
});

function addTraining() {
    event.preventDefault(); // منع إعادة تحميل الصفحة عند الضغط على زر الإضافة

    // قراءة القيم من الحقول الجديدة للفورم
    const trainingName = document.getElementById("TrainingName").value;
    const mentorName = document.getElementById("MentorName").value;
    const studentsCount = parseInt(document.getElementById("StudentsCount").value);
    const articlesCount = parseInt(document.getElementById("ArticlesCount").value);
    const surveysCount = parseInt(document.getElementById("SurveysCount").value);

    // التحقق من تعبئة جميع الحقول
    if (!trainingName || !mentorName || isNaN(studentsCount) || isNaN(articlesCount) || isNaN(surveysCount)) {
        alert("Please fill out all fields.");
        return;
    }

    // الاتصال بقاعدة البيانات
    dbTrainings.then((dbTraining) => {
        const transaction = dbTraining.transaction("training", "readwrite");
        const trainingsStore = transaction.objectStore("training");

        // إعداد الكائن الذي سيتم إدخاله في قاعدة البيانات
        const newTraining = {
            name: trainingName,
            mentor: {
                name: mentorName,
                // image: mentorImage
            },
            studentsCount: studentsCount,
            articlesCount: articlesCount,
            surveysCount: surveysCount
        };

        // إضافة التدريب إلى قاعدة البيانات
        const addRequest = trainingsStore.add(newTraining);

        addRequest.onsuccess = function () {
            console.log("Training added successfully:", newTraining);
            // تحديث قائمة التدريبات
            fetchTraining();
            updateStatistics(); // استدعاء تحديث الإحصائيات هنا
        };

        // إفراغ الحقول بعد الإضافة
        document.getElementById("TrainingName").value = "";
        document.getElementById("MentorName").value = "";
        document.getElementById("StudentsCount").value = "";
        document.getElementById("ArticlesCount").value = "";
        document.getElementById("SurveysCount").value = "";

        toggleTrainingForm();

        addRequest.onerror = function (event) {
            console.error("Error adding training:", event.target.error);
        };
    });
}


function toggleTrainingForm() {
    const modal = document.getElementById("TrainingForm");

    if (!modal) {
        console.error("TrainingForm not found in the DOM");
        return;
    }

    modal.style.display = (modal.style.display === "none" || modal.style.display === "")
        ? "block"
        : "none";
}


function fetchTraining() {
    dbTrainings.then((dbTraining) => {
        const transaction = dbTraining.transaction("training", "readonly");
        const trainingsStore = transaction.objectStore("training");

        const getAllRequest = trainingsStore.getAll();

        getAllRequest.onsuccess = function (event) {
            const trainings = event.target.result;
            displayTraining(trainings); // عرض التدريبات باستخدام دالة العرض
        };

        getAllRequest.onerror = function (event) {
            console.error("Error fetching trainings:", event.target.error);
        };
    }).catch((error) => {
        console.error("خطأ في فتح قاعدة البيانات:", error);
    });
}

fetchTraining();

function displayTraining(trainings) {
    const trainingList = document.getElementById("trainingList");
    trainingList.innerHTML = ""; // إفراغ القائمة قبل إعادة العرض

    trainings.forEach(training => {
        // إنشاء عناصر البطاقة الرئيسية
        const card = document.createElement("div");
        card.className = "training-card";

        // عنوان التدريب
        const title = document.createElement("h2");
        title.className = "training-title";
        title.textContent = training.name || "Training Name"; // عرض اسم التدريب من البيانات

        // إنشاء عنصر لمعلومات المدرب
        const mentorSection = document.createElement("div");
        mentorSection.className = "mentor-section";

        const mentorImage = document.createElement("img");
        mentorImage.className = "mentor-image";
        mentorImage.src = training.image || "./media/2.jpg"; // عرض صورة المدرب من البيانات

        const mentorInfo = document.createElement("div");
        mentorInfo.className = "mentor-info";

        const mentorName = document.createElement("p");
        mentorName.className = "mentor-name";
        mentorName.textContent = training.mentor.name || "Mentor Name"; // عرض اسم المدرب من البيانات

        const mentorRole = document.createElement("p");
        mentorRole.className = "mentor-role";
        mentorRole.textContent = "Mentor";

        mentorInfo.appendChild(mentorName);
        mentorInfo.appendChild(mentorRole);

        mentorSection.appendChild(mentorImage);
        mentorSection.appendChild(mentorInfo);

        // إضافة معلومات التدريب الإضافية
        const statsSection = document.createElement("div");
        statsSection.className = "stats-section";

        const studentsStat = document.createElement("p");
        studentsStat.innerHTML = `<i class="fas fa-users"></i> ${training.studentsCount || 0} students`;

        const articlesStat = document.createElement("p");
        articlesStat.innerHTML = `<i class="fas fa-file-alt"></i> ${training.articlesCount || 0} articles`;

        const surveysStat = document.createElement("p");
        surveysStat.innerHTML = `<i class="fas fa-poll"></i> ${training.surveysCount || 0} surveys`;

        statsSection.appendChild(studentsStat);
        statsSection.appendChild(articlesStat);
        statsSection.appendChild(surveysStat);

        // تجميع العناصر
        card.appendChild(title);
        card.appendChild(mentorSection);
        card.appendChild(statsSection);

        // إضافة السهم للانتقال
        const arrowIcon = document.createElement("span");
        arrowIcon.className = "arrow-icon";
        arrowIcon.innerHTML = `<i class="fas fa-chevron-right"></i>`;
        card.appendChild(arrowIcon);

        // إضافة البطاقة إلى القائمة الرئيسية
        trainingList.appendChild(card);
    });
}


// search about traning name about search input 
document.getElementById("searchInput").addEventListener("keyup", function () {
    const searchValue = this.value.toLowerCase();
    const trainingCards = document.querySelectorAll(".training-card");

    trainingCards.forEach(card => {
        const trainingName = card.querySelector(".training-title").textContent.toLowerCase();

        if (trainingName.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});



// تحديث الإحصائيات
function updateStatistics() {
    // فتح معاملة للقراءة من جدول "training"
    const trainingTransaction = dbTraining.transaction(["training"], "readonly");
    const trainingStore = trainingTransaction.objectStore("training");

    // عدّ عدد السجلات في جدول "training"
    const trainingRequest = trainingStore.count();

    // تحديث عرض عدد التدريبات عند نجاح الطلب
    trainingRequest.onsuccess = function (event) {
        document.getElementById("TotalTrainings").textContent = event.target.result;
    };

    // التعامل مع الأخطاء إذا حدثت
    trainingRequest.onerror = function () {
        console.error("Failed to count trainings.");
    };
}
