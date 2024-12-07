
let dbinst;
let instructorCartona = []



const dbInstrructor = new Promise((resolve, reject) => {
    const request = indexedDB.open("instractorDatabase", 1);

    request.onerror = function (event) {
        console.error("خطأ في فتح قاعدة البيانات:", event);
        reject(event.target.error);
    };

    request.onsuccess = function (event) {
        dbinst = event.target.result;
        console.log("تم فتح قاعدة البيانات بنجاح");
        resolve(dbinst);
    };

    request.onupgradeneeded = function (event) {
        dbinst = event.target.result;
        const instractorStore = dbinst.createObjectStore("instractor", {
            keyPath: "id",
            autoIncrement: true,
        });
        // doctorStore.createIndex("email", "email", {
        // unique: false,
        // });


    }

})




function addinstractor() {
    event.preventDefault();
    const instractorName = document.getElementById("fullName").value;
    const instractorEmail = document.getElementById("email").value;
    const instractorPhone = document.getElementById("phone").value;
    const instractorspecialization = document.getElementById("specialization").value;
    const instractorexperience = document.getElementById("experience").value;

    if (!instractorName || !instractorEmail || !instractorPhone || !instractorspecialization || !instractorexperience) {
        alert("Please fill out all fields.");
        return;
    }

    dbInstrructor.then((dbinst) => {
        const transaction = dbinst.transaction("instractor", "readwrite");
        const instractorsStore = transaction.objectStore("instractor");

        const newinstractor = {
            name: instractorName,
            email: instractorEmail,
            phone: instractorPhone,
            specialization: instractorspecialization,
            experience: instractorexperience  // ا��تخدم الحقول الموجودة في القا��دة لتحويلها ��لى المتغيرات كما في المثال التالي: name, email, phone
        };

        const addRequest = instractorsStore.add(newinstractor); // استخدم add لإضافة بيانات جديدة دائماً

        addRequest.onsuccess = function () {
            console.log("تمت إضافة العميل بنجاح:", newinstractor);
            fetchDoctorsDentistry();  // تحديث القائمة هنا
        };

        addRequest.onerror = function (event) {
            console.error("خطأ في إضافة العميل:", event.target.error);
        };
    });
    // empty the input

    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("specialization").value = "";
    document.getElementById("experience").value = "";

    toggleEventForm()


}

// دالة لفتح وإغلاق الفورم (Toggle)
function toggleEventForm() {
    const modal = document.getElementById("InstructorForm");
    modal.style.display = (modal.style.display === "none" || modal.style.display === "")
        ? "block"
        : "none";
}

// Function to display the list of client
function fetchDoctorsDentistry() {
    dbInstrructor.then((dbinst) => {
        const transaction = dbinst.transaction('instractor', 'readonly');
        const instractorobjectStore = transaction.objectStore('instractor');

        const instractorUni = instractorobjectStore.getAll();

        instractorUni.onsuccess = function (event) {
            console.log(event.target.result)

            let dataInstractor = event.target.result

            instructorCartona = dataInstractor
            document.getElementById("TotalInstructors").textContent = dataInstractor.length
            displayInstractor(event.target.result)
        };

        instractorUni.onerror = function (event) {
            console.error("حدث خطأ في جلب دكاترة الأسنان:", event.target.error);
        };
    }).catch((error) => {
        console.error("خطأ في فتح قاعدة البيانات:", error);
    });
}
fetchDoctorsDentistry();




function displayInstractor(Instractors) {
    instructorList.innerHTML = "";  // إفراغ القائمة قبل إعادة العرض
    Instractors.map(instractor => {
        const card = document.createElement("div");
        card.className = "card-show";
        card.dataset.clientId = instractor.id; // إضافة data-client-id


        const cardBody = document.createElement("div");
        cardBody.className = "small-card-body";

        const name = document.createElement("p");
        name.className = "card-email";
        name.textContent = `Name: ${instractor.name}`;

        const email = document.createElement("p");
        email.className = "card-password";
        email.textContent = `Email: ${instractor.email}`;

        const phone = document.createElement("p");
        phone.className = "card-password";
        phone.textContent = `Phone : ${instractor.phone}`;

        const specialization = document.createElement("p");
        specialization.className = "card-password";
        specialization.textContent = `specialization : ${instractor.specialization}`;

        const experience = document.createElement("p");
        experience.className = "card-password";
        experience.textContent = `specialization : ${instractor.experience}`;


        cardBody.appendChild(name);
        cardBody.appendChild(email);
        cardBody.appendChild(phone);
        cardBody.appendChild(specialization);
        cardBody.appendChild(experience);

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
            const modal = document.getElementById("InstructorForm");
            modal.style.display = "block";
            document.getElementById("fullName").value = instractor.name;
            document.getElementById("email").value = instractor.email;
            document.getElementById("phone").value = instractor.phone;
            document.getElementById("specialization").value = instractor.specialization;
            document.getElementById("experience").value = instractor.experience;
            // ��نشا�� ��ر الحف��
            const updateBtn = document.getElementById("updateBtn");
            const addBTn = document.getElementById("add-student-btn");
            addBTn.style.display = "none";
            updateBtn.style.display = "block";
            // حفظ معرف الطالب في زر التحديث
            updateBtn.dataset.clientId = instractor.id; // حفظ id الطالب في data-client-id

            // إضافة حدث زر التحديث
            updateBtn.addEventListener("click", (event) => {
                const clientId = event.target.dataset.clientId; // استرجاع معرف الطالب من data-client-id

                if (!clientId) {
                    console.error("الطالب ID غير موجود أو غير صالح:", clientId);
                    return;
                }

                dbInstrructor.then((dbinst) => {
                    const transaction = dbinst.transaction("instractor", "readwrite");
                    const clientStore = transaction.objectStore("instractor");

                    // جلب الطالب المحدد من قاعدة البيانات
                    const clientToUpdateRequest = clientStore.get(parseInt(clientId));

                    clientToUpdateRequest.onsuccess = function (event) {
                        const clientToUpdate = event.target.result; // الكائن الفعلي للطالب

                        // تحديث بيانات المعلم

                        clientToUpdate.email = document.getElementById("email").value;
                        clientToUpdate.phone = document.getElementById("phone").value;
                        clientToUpdate.specialization = document.getElementById("specialization").value;
                        clientToUpdate.experience = document.getElementById("experience").value;

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
            // ��لغا�� النافذة التي سيتم تعديل المعلومات
            const closeBtn = document.getElementById("closeFormBtn");
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };
        });


        // تعريف زر الحذف
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        // حذف الطلاب
        deleteBtn.addEventListener("click", () => {
            if (confirm("Do you want to delete the instractor?")) {
                dbInstrructor.then((dbinst) => {
                    const transaction = dbinst.transaction("instractor", "readwrite");
                    const clientStore = transaction.objectStore("instractor");
                    const clientToDelete = clientStore.get(instractor.id);
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
        instructorList.appendChild(card);
    });

}

function updateStatistics() {


    const clientTransaction = dbinst.transaction(["instractor"], "readonly");
    const clientStore = clientTransaction.objectStore("instractor");
    const clientRequest = clientStore.count();

    clientRequest.onsuccess = function (event) {
        document.getElementById("totalStudents").textContent = event.target.result; // Update total courses count
    };
}

// search the name


document.getElementById("search").addEventListener("input", filterStudents);
function filterStudents() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filteredStudents = instructorCartona.filter(student => student.name.toLowerCase().includes(searchTerm));
    displayInstractor(filteredStudents);
}

