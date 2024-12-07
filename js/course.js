
let dbcourse;
let courseCartona = []



const cousePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("courseDatabase", 1);

    request.onerror = function (event) {
        console.error("خطأ في فتح قاعدة البيانات:", event);
        reject(event.target.error);
    };

    request.onsuccess = function (event) {
        dbcourse = event.target.result;
        console.log("تم فتح قاعدة البيانات بنجاح");
        resolve(dbcourse);
    };

    request.onupgradeneeded = function (event) {
        dbcourse = event.target.result;
        const coursesStore = dbcourse.createObjectStore("course", {
            keyPath: "id",
            autoIncrement: true,
        });
        // doctorStore.createIndex("email", "email", {
        // unique: false,
        // });


    }

})




function addCourse() {
    event.preventDefault();
    const courseName = document.getElementById("courseName").value;
    const courseHours = document.getElementById("courseHours").value;
    const courseLevel = document.getElementById("courseLevel").value;

    if (!courseName || !courseHours || !courseLevel) {
        alert("Please fill out all fields.");
        return;
    }

    cousePromise.then((dbcourse) => {
        const transaction = dbcourse.transaction("course", "readwrite");
        const courseStore = transaction.objectStore("course");

        const newCourse = {
            name: courseName,
            hours: courseHours,
            level: courseLevel,
        };

        const addRequest = courseStore.add(newCourse);

        addRequest.onsuccess = function () {
            console.log("تمت إضافة الدورة بنجاح:", newCourse);
            fetchCourses();  // تحديث قائمة الدورات
        };

        addRequest.onerror = function (event) {
            console.error("خطأ في إضافة الدورة:", event.target.error);
        };
    });

    // إفراغ الحقول بعد الإضافة
    document.getElementById("courseName").value = "";

    document.getElementById("courseHours").value = "";
    document.getElementById("courseLevel").value = "";
    toggleEventForm()
}
// دالة لفتح وإغلاق الفورم (Toggle)
function toggleEventForm() {
    const modal = document.getElementById("courseForm");
    modal.style.display = (modal.style.display === "none" || modal.style.display === "")
        ? "block"
        : "none";
}


function fetchCourses() {
    cousePromise.then((dbcourse) => {
        const transaction = dbcourse.transaction("course", "readonly");
        const courseStore = transaction.objectStore("course");
        const getAllCourses = courseStore.getAll();

        getAllCourses.onsuccess = function (event) {
            console.log(event.target.result)

            let dataClient = event.target.result

            courseCartona = dataClient
            document.getElementById("TotalCourses").textContent = dataClient.length

            displayCourses(event.target.result);  // عرض الدورات
        };
    });
}
fetchCourses();

function displayCourses(courses) {
    courseList.innerHTML = "";  // إفراغ القائمة قبل إعادة العرض
    courses.map(course => {
        const card = document.createElement("div");
        card.className = "card-show";
        card.dataset.courseId = course.id; // إضافة data-course-id

        const cardBody = document.createElement("div");
        cardBody.className = "small-card-body";

        const name = document.createElement("p");
        name.className = "card-email";
        name.textContent = `Course Name: ${course.name}`;

        const hours = document.createElement("p");
        hours.className = "card-password";
        hours.textContent = `Course Hours: ${course.hours}`;

        const level = document.createElement("p");
        level.className = "card-password";
        level.textContent = `Course Level: ${course.level}`;

        cardBody.appendChild(name);
        cardBody.appendChild(hours);
        cardBody.appendChild(level);

        // إنشاء زر التحديث والحذف
        const cardActions = document.createElement("div");
        cardActions.className = "card-show-actions";

        // تعريف زر التعديل
        const editBtn = document.createElement("button");
        editBtn.className = "refresh-btn";
        editBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';

        // تعديل معلومات الدورة
        editBtn.addEventListener("click", () => {
            // فتح النموذج الذي سيتم تعديل المعلومات فيه
            const modal = document.getElementById("courseForm");
            modal.style.display = "block";
            document.getElementById("courseName").value = course.name;
            document.getElementById("courseHours").value = course.hours;
            document.getElementById("courseLevel").value = course.level;

            // إخفاء زر الإضافة وإظهار زر التحديث
            const updateBtn = document.getElementById("updateBtn");
            const addBtn = document.getElementById("add-course-btn");
            addBtn.style.display = "none";
            updateBtn.style.display = "block";
            updateBtn.dataset.courseId = course.id; // حفظ id الدورة في data-course-id

            // إضافة حدث زر التحديث
            updateBtn.addEventListener("click", (event) => {
                const courseId = event.target.dataset.courseId; // استرجاع معرف الدورة من data-course-id

                if (!courseId) {
                    console.error("الدورة ID غير موجود أو غير صالح:", courseId);
                    return;
                }

                cousePromise.then((dbcourse) => {
                    const transaction = dbcourse.transaction("course", "readwrite");
                    const courseStore = transaction.objectStore("course");

                    // جلب الدورة المحددة من قاعدة البيانات
                    const courseToUpdateRequest = courseStore.get(parseInt(courseId));

                    courseToUpdateRequest.onsuccess = function (event) {
                        const courseToUpdate = event.target.result; // الكائن الفعلي للدورة

                        // تحديث بيانات الدورة
                        courseToUpdate.name = document.getElementById("courseName").value;
                        courseToUpdate.hours = document.getElementById("courseHours").value;
                        courseToUpdate.level = document.getElementById("courseLevel").value;

                        // وضع الدورة المحدثة في قاعدة البيانات
                        const updateRequest = courseStore.put(courseToUpdate);

                        updateRequest.onsuccess = function () {
                            console.log("تم تحديث الدورة بنجاح:", courseToUpdate);
                            modal.style.display = "none"; // إخفاء النموذج بعد التحديث
                            fetchCourses(); // إعادة جلب القائمة المحدثة
                        };

                        updateRequest.onerror = function (event) {
                            console.error("خطأ في تحديث الدورة:", event.target.error);
                        };
                    };

                    courseToUpdateRequest.onerror = function (event) {
                        console.error("خطأ في جلب الدورة:", event.target.error);
                    };
                });
            });

        });

        // تعريف زر الحذف
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

        // حذف الدورة
        deleteBtn.addEventListener("click", () => {
            if (confirm("Do you want to delete the course?")) {
                cousePromise.then((dbcourse) => {
                    const transaction = dbcourse.transaction("course", "readwrite");
                    const courseStore = transaction.objectStore("course");
                    const courseToDelete = courseStore.get(course.id);

                    courseToDelete.onsuccess = function (event) {
                        courseStore.delete(event.target.result.id);
                        console.log("تم حذف الدورة بنجاح:", event.target.result);
                        fetchCourses(); // إعادة عرض الدورات بعد الحذف
                    };

                    courseToDelete.onerror = function (event) {
                        console.error("خطأ في حذف الدورة:", event.target.error);
                    };
                });
            }
        });

        // إضافة الأزرار إلى cardActions
        cardActions.appendChild(editBtn);
        cardActions.appendChild(deleteBtn);

        // إضافة محتويات البطاقة والأزرار إلى البطاقة الرئيسية
        card.appendChild(cardBody);
        card.appendChild(cardActions);

        // إضافة البطاقة إلى القائمة
        courseList.appendChild(card);
    });
}


function updateStatistics() {


    const clientTransaction = dbcourse.transaction(["course"], "readonly");
    const clientStore = clientTransaction.objectStore("course");
    const clientRequest = clientStore.count();

    clientRequest.onsuccess = function (event) {
        document.getElementById("totalStudents").textContent = event.target.result; // Update total courses count
    };
}



// search the name


document.getElementById("search").addEventListener("input", filterStudents);
function filterStudents() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filteredStudents = courseCartona.filter(student => student.name.toLowerCase().includes(searchTerm));
    displayCourses(filteredStudents);
}

