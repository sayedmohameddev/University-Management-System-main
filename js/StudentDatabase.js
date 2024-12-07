
let db;
let studentList = []



const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("studentDatabase", 1);

    request.onerror = function (event) {
        console.error("خطأ في فتح قاعدة البيانات:", event);
        reject(event.target.error);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("تم فتح قاعدة البيانات بنجاح");
        resolve(db);
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const doctorStore = db.createObjectStore("client", {
            keyPath: "id",
            autoIncrement: true,
        });
        // doctorStore.createIndex("email", "email", {
        // unique: false,
        // });


    }

})




function addClient() {
    event.preventDefault();
    const studentName = document.getElementById("studentName").value;
    const StudentResult = document.getElementById("StudentResult").value;
    const StudentPerformance = document.getElementById("StudentPerformance").value;

    if (!studentName || !StudentResult || !StudentPerformance) {
        alert("Please fill out all fields.");
        return;
    }

    dbPromise.then((db) => {
        const transaction = db.transaction("client", "readwrite");
        const clientStore = transaction.objectStore("client");

        const newClient = {
            name: studentName,
            result: StudentResult,
            performance: StudentPerformance
        };

        const addRequest = clientStore.add(newClient); // استخدم add لإضافة بيانات جديدة دائماً

        addRequest.onsuccess = function () {
            console.log("تمت إضافة العميل بنجاح:", newClient);
            fetchDoctorsDentistry();  // تحديث القائمة هنا
        };

        addRequest.onerror = function (event) {
            console.error("خطأ في إضافة العميل:", event.target.error);
        };
    });
    // empty the input

    document.getElementById("studentName").value = "";
    document.getElementById("StudentResult").value = "";
    document.getElementById("StudentPerformance").value = "";
    toggleEventForm()

}
// دالة لفتح وإغلاق الفورم (Toggle)
function toggleEventForm() {
    const modal = document.getElementById("studentForm");
    modal.style.display = (modal.style.display === "none" || modal.style.display === "")
        ? "block"
        : "none";
}

// Function to display the list of client
function fetchDoctorsDentistry() {
    dbPromise.then((db) => {
        const transaction = db.transaction('client', 'readonly');
        const doctorObjectStore = transaction.objectStore('client');

        const dentistDoctors = doctorObjectStore.getAll();

        dentistDoctors.onsuccess = function (event) {
            console.log(event.target.result)

            let dataClient = event.target.result

            studentList = dataClient
            document.getElementById("totalStudents").textContent = dataClient.length
            displayClients(event.target.result)
        };

        dentistDoctors.onerror = function (event) {
            console.error("حدث خطأ في جلب دكاترة الأسنان:", event.target.error);
        };
    }).catch((error) => {
        console.error("خطأ في فتح قاعدة البيانات:", error);
    });
}
fetchDoctorsDentistry();




function displayClients(clients) {
    clientList.innerHTML = "";  // إفراغ القائمة قبل إعادة العرض
    clients.map(client => {
        const card = document.createElement("div");
        card.className = "card-show";
        card.dataset.clientId = client.id; // إضافة data-client-id


        const cardBody = document.createElement("div");
        cardBody.className = "small-card-body";

        const name = document.createElement("p");
        name.className = "card-email";
        name.textContent = `Name: ${client.name}`;

        const result = document.createElement("p");
        result.className = "card-password";
        result.textContent = `Result: ${client.result}`;

        const performance = document.createElement("p");
        performance.className = "card-password";
        performance.textContent = `Student performance: ${client.performance}`;


        cardBody.appendChild(name);
        cardBody.appendChild(result);
        cardBody.appendChild(performance);

        // إنشاء زر التحديث والحذف
        const cardActions = document.createElement("div");
        cardActions.className = "card-show-actions";

        // تعريف زر التعديل
        const editBtn = document.createElement("button");
        editBtn.className = "refresh-btn";
        editBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';

        // تعديل معلومات الطلاب
        editBtn.addEventListener("click", () => {
            // فتح النافذة التي سيتم تعديل المعلومات
            const modal = document.getElementById("studentForm");
            modal.style.display = "block";
            document.getElementById("studentName").value = client.name;
            document.getElementById("StudentResult").value = client.result;
            document.getElementById("StudentPerformance").value = client.performance;

            // ��نشا�� ��ر الحف��
            const updateBtn = document.getElementById("updateBtn");
            const addBTn = document.getElementById("add-student-btn");
            addBTn.style.display = "none";
            updateBtn.style.display = "block";
            // حفظ معرف الطالب في زر التحديث
            updateBtn.dataset.clientId = client.id; // حفظ id الطالب في data-client-id

            // إضافة حدث زر التحديث
            updateBtn.addEventListener("click", (event) => {
                const clientId = event.target.dataset.clientId; // استرجاع معرف الطالب من data-client-id

                if (!clientId) {
                    console.error("الطالب ID غير موجود أو غير صالح:", clientId);
                    return;
                }

                dbPromise.then((db) => {
                    const transaction = db.transaction("client", "readwrite");
                    const clientStore = transaction.objectStore("client");

                    // جلب الطالب المحدد من قاعدة البيانات
                    const clientToUpdateRequest = clientStore.get(parseInt(clientId));

                    clientToUpdateRequest.onsuccess = function (event) {
                        const clientToUpdate = event.target.result; // الكائن الفعلي للطالب

                        // تحديث بيانات الطالب
                        clientToUpdate.result = document.getElementById("StudentResult").value;
                        clientToUpdate.performance = document.getElementById("StudentPerformance").value;

                        // وضع الطالب المحدث في قاعدة البيانات
                        const updateRequest = clientStore.put(clientToUpdate);

                        updateRequest.onsuccess = function () {
                            console.log("تم تحديث الطالب بنجاح:", clientToUpdate);
                            modal.style.display = "none"; // إخفاء الـ modal بعد التحديث
                            fetchDoctorsDentistry(); // إعادة جلب القائمة المحدثة
                        };

                        updateRequest.onerror = function (event) {
                            console.error("خطأ في تحديث الطالب:", event.target.error);
                        };
                    };

                    clientToUpdateRequest.onerror = function (event) {
                        console.error("خطأ في جلب الطالب:", event.target.error);
                    };

                    transaction.oncomplete = function () {
                        console.log("تمت عملية التحديث بنجاح");
                    };

                    transaction.onerror = function (event) {
                        console.error("خطأ في عملية التحديث:", event.target.error);
                    };
                });
            });

        });


        // تعريف زر الحذف
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        // حذف الطلاب
        deleteBtn.addEventListener("click", () => {
            if (confirm("Do you want to delete the student?")) {
                dbPromise.then((db) => {
                    const transaction = db.transaction("client", "readwrite");
                    const clientStore = transaction.objectStore("client");
                    const clientToDelete = clientStore.get(client.id);
                    clientToDelete.onsuccess = function (event) {
                        clientStore.delete(event.target.result.id);
                        console.log("تم حذف الطالب بنجا��:", event.target.result);
                        fetchDoctorsDentistry();
                    };
                    clientToDelete.onerror = function (event) {
                        console.error("خطأ في حذف الطالب:", event.target.error);
                    };

                    transaction.oncomplete = function () {
                        console.log("تم حذف الطالب بنجا��");
                    };
                    transaction.onerror = function (event) {
                        console.error("خطأ في عملية الحذف:", event.target.error);
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
        clientList.appendChild(card);
    });

}

function updateStatistics() {


    const clientTransaction = db.transaction(["client"], "readonly");
    const clientStore = clientTransaction.objectStore("client");
    const clientRequest = clientStore.count();

    clientRequest.onsuccess = function (event) {
        document.getElementById("totalStudents").textContent = event.target.result; // Update total courses count
    };
}

// إضافة حدث click للزر
document.getElementById("sortButton").addEventListener("click", sortStudentsAZ);

// دالة لفرز الطلاب 
function sortStudentsAZ() {
    studentList.sort((a, b) => a.name.localeCompare(b.name));
    console.log("sort students");

    displayClients(studentList);
}

// search the name


document.getElementById("search").addEventListener("input", filterStudents);
function filterStudents() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filteredStudents = studentList.filter(student => student.name.toLowerCase().includes(searchTerm));
    displayClients(filteredStudents);
}


// حذف الطلاب
function deleteStudent(id) {
    dbPromise.then((db) => {
        const transaction = db.transaction('client', 'readwrite');
        const clientStore = transaction.objectStore('client');
        clientStore.delete(id);
        transaction.oncomplete = function () {
            console.log('تم حذف الطالب بنجا��');
            fetchDoctorsDentistry();
        };
        transaction.onerror = function (event) {
            console.error('حدث خطأ في حذف الطالب:', event.target.error);
        };


    }).catch((error) => {
        console.error('خطأ في فتح قا��دة البيانات:', error);
    });
}

// فلتر الطلاب ما هم اعلي من 60 
document.getElementById("filterButton").addEventListener("click", filterAbove60);
function filterAbove60() {
    const filteredStudents = studentList.filter(student => student.result >= 60);
    displayClients(filteredStudents);
}   
