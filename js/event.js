let dbEvent;
let eventCartona = [];

// فتح قاعدة البيانات وإنشاء التخزين
const dbEvents = new Promise((resolve, reject) => {
    const request = indexedDB.open("eventDatabase", 1);

    request.onerror = function (event) {
        console.error("خطأ في فتح قاعدة البيانات:", event);
        reject(event.target.error);
    };

    request.onsuccess = function (event) {
        dbEvent = event.target.result;
        console.log("تم فتح قاعدة البيانات بنجاح");
        resolve(dbEvent);
    };

    request.onupgradeneeded = function (event) {
        dbEvent = event.target.result;
        const eventStore = dbEvent.createObjectStore("event", {
            keyPath: "id",
            autoIncrement: true,
        });
    };
});

// إضافة حدث جديد إلى قاعدة البيانات
function addEvent() {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const meetingName = document.getElementById("MeetingName").value;
    const meetingDay = document.getElementById("Day").value;
    const meetingTime = document.getElementById("Time").value;

    if (!meetingName || !meetingDay || !meetingTime) {
        alert("Please fill out all fields.");
        return;
    }

    dbEvents.then((dbEvent) => {
        const transaction = dbEvent.transaction("event", "readwrite");
        const eventsStore = transaction.objectStore("event");

        const newEvent = { name: meetingName, date: meetingDay, time: meetingTime };

        const addRequest = eventsStore.add(newEvent);

        addRequest.onsuccess = function () {
            console.log("Event added successfully:", newEvent);
            fetchEvent(); // تحديث قائمة الأحداث
        };

        document.getElementById("MeetingName").value = "";
        document.getElementById("Day").value = "";
        document.getElementById("Time").value = "";

        toggleEventForm(); // إغلاق النموذج بعد الإضافة

        addRequest.onerror = function (event) {
            console.error("Error adding event:", event.target.error);
        };
    });
}

// فتح وإغلاق النموذج
function toggleEventForm() {
    const modal = document.getElementById("EventForm");
    modal.style.display = (modal.style.display === "none" || modal.style.display === "")
        ? "block"
        : "none";
}

// جلب جميع الأحداث من قاعدة البيانات
function fetchEvent() {
    dbEvents.then((dbEvent) => {
        const transaction = dbEvent.transaction("event", "readonly");
        const instractorobjectStore = transaction.objectStore("event");

        const instractorUni = instractorobjectStore.getAll();

        instractorUni.onsuccess = function (event) {
            const dataInstractor = event.target.result;
            eventCartona = dataInstractor;
            document.getElementById("TotalEvents").textContent = dataInstractor.length;
            displayEvent(dataInstractor); // عرض الأحداث
        };

        instractorUni.onerror = function (event) {
            console.error("حدث خطأ في جلب الأحداث:", event.target.error);
        };
    }).catch((error) => {
        console.error("خطأ في فتح قاعدة البيانات:", error);
    });
}

// عرض الأحداث في الصفحة
function displayEvent(Events) {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = ""; // إفراغ القائمة قبل إعادة العرض

    Events.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";

        const daySection = document.createElement("div");
        daySection.className = "day-section";

        const dayName = document.createElement("div");
        dayName.className = "day-name";
        dayName.textContent = new Date(event.date).toLocaleString('en-US', { weekday: 'short' });

        const dayNumber = document.createElement("div");
        dayNumber.className = "day-number";
        dayNumber.textContent = new Date(event.date).getDate();

        daySection.appendChild(dayName);
        daySection.appendChild(dayNumber);

        const contentSection = document.createElement("div");
        contentSection.className = "content-section";

        const meetingTitle = document.createElement("h3");
        meetingTitle.className = "meeting-title";
        meetingTitle.textContent = event.name;

        const timeInfo = document.createElement("p");
        timeInfo.className = "meeting-time";
        timeInfo.innerHTML = `<i class="fas fa-clock"></i> ${event.time}`;

        const meetingIcon = document.createElement("p");
        meetingIcon.className = "meeting-icon";
        meetingIcon.innerHTML = `<i class="fas fa-video"></i> Google Meeting`;

        contentSection.appendChild(meetingTitle);
        contentSection.appendChild(timeInfo);
        contentSection.appendChild(meetingIcon);

        card.appendChild(daySection);
        card.appendChild(contentSection);

        eventList.appendChild(card);
    });
}

// دالة تصفية الأحداث حسب التاريخ
function filterEventsByDate() {
    const selectedDate = document.getElementById("filterDate").value;

    fetchAllEvents().then((events) => {
        if (Array.isArray(events)) {
            const filteredEvents = events.filter((event) => event.date === selectedDate);
            displayEvent(filteredEvents);
        } else {
            console.error("Fetched data is not an array:", events);
        }
    }).catch((error) => {
        console.error("Error in filtering events:", error);
    });
}

// جلب جميع الأحداث عند بدء التشغيل
function fetchAllEvents() {
    return dbEvents.then((dbEvent) => {
        const transaction = dbEvent.transaction("event", "readonly");
        const eventsStore = transaction.objectStore("event");

        return new Promise((resolve, reject) => {
            const request = eventsStore.getAll();

            request.onsuccess = function (event) {
                console.log("Fetched events:", event.target.result); // تصحيح: عرض البيانات في الـ console
                resolve(event.target.result); // إرجاع مصفوفة الأحداث
            };

            request.onerror = function (event) {
                console.error("Error fetching events:", event.target.error);
                reject(event.target.error);
            };
        });
    });
}


// تحديث الإحصائيات
function updateStatistics() {
    const clientTransaction = dbEvent.transaction(["event"], "readonly");
    const clientStore = clientTransaction.objectStore("event");
    const clientRequest = clientStore.count();

    clientRequest.onsuccess = function (event) {
        document.getElementById("totalStudents").textContent = event.target.result;
    };
}

// جلب الأحداث عند تحميل الصفحة
fetchEvent();
