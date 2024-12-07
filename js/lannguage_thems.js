//* translation:  */
let currentTheme = 'dark';
let currentLanguage = 'en';


const translations = {
    en: {

        navBrand: "University Management",
        navOverview: "Overview",
        navStudents: "Students",
        navinstructors: "Instructors",
        navCourses: "Courses",
        navEvent: "Event",
        OverviewStudents: "Total Students",
        OverviewNewStudents: "New Students",
        OverviewSubmissions: "Submissions",
        OverviewEvents: "Events",
        My_Events: "My Events",
        AddMy_Events: "+ Add Event",
        MyTrainings: "My Trainings",
        AddTraining: "+ Add Training",
        Mentor: "Mentor",
        Viewmore: " View more ",
        OverviewAddedStudent: " Added Student ",
        navStudents: " Students ",
        StudentNama: " Student Nama ",
        StudentID: " ID ",
        StudentResult: " Result ",
        StudentPerformance: " Performance ",
        TotalInstructors: "Total Instructors",
        AddedInstructors: "Added Instructors",
        TotalCourses: "Total Courses",
        AddedCourses: "Added Courses",
        EventCreated: "Event Created",
        EventForThisWeek: "Event For You This Week",
        ToPlanWeek: "To Plan Your Week",
        UsernameStudent: "Username",
        ResultStudent: "Result",
        ResultPerformance: "Performance",
        Delete: "Delete",
        OverviewTraninig: "Traninig",
        Events: "My Events",
        addTraninig: "Add Traninig",
        nameTraninig: "Name of Training",
        MentorName: "Mentor Name",
        NumberStudents: " Number of Students",
        NumberArticles: " Number of Articles",
        NumberSurveys: " Number of Surveys",
        AddUser: "Add",
        UpdateUser: "Update",
        Close: "Close",
        AddStudent: "Add Student",
        Programming: "programming(Web)",
        Accounting: "accounting",
        Flutter: "programming(flutter)",
        Static: "static",
        PhoneNumber: "Phone Number",
        Email: "Email",
        FullName: "Full Name",
        ExperienceYears: "Experience Years",
        AddedInstructors: "Add Instructors",
        NameOfMeeting: "Name Of Meeting",
        AddEvent: "Add Event",
        AddCourse: "Add Course",
        CourseName: "Course Name",
        CourseHours: "Course Hours",
        Beginner: "Beginner",
        Intermediate: "Intermediate",
        Advanced: "Advanced",
    },
    ar: {
        Intermediate: "متوسط",
        Beginner: "مبتدئ",
        Advanced: "متقدم",
        CourseHours: "ساعات الدورة",
        CourseName: "اسم الدورة",
        AddCourse: "إضافة دورة",
        AddEvent: "إضافة حدث",
        NameOfMeeting: "اسم الاجتماع",
        AddInstructors: "اضافة المعلمون ",
        ExperienceYears: "سنوات الخبرة",
        FullName: "الاسم الكامل",
        Email: "البريد الإلكتروني",
        PhoneNumber: "رقم الهاتف",
        Programming: " برمجة مواقع",
        Accounting: "محاسبة",
        Flutter: "برمجة تطبيقات",
        Static: "احصاء",
        AddStudent: "إضافة طالب",
        Close: "إغلاق",
        UpdateUser: "تحديث",
        AddUser: "إضافة",
        NumberSurveys: " عدد الخدمات",
        NumberArticles: " عدد المقالات",
        NumberStudents: " عدد الطلاب",
        MentorName: "اسم المدرب ",
        nameTraninig: "اسم التدريب",
        Events: "الجداول",
        addTraninig: "اضافة تدريب",
        OverviewTraninig: "التدريب",
        navBrand: "نظام ادارة الجامعة",
        navOverview: "نظرة عامة",
        navStudents: "الطلاب",
        navinstructors: "المعلمون",
        navCourses: "الكورسات",
        navEvent: "الاحداث",
        OverviewStudents: "اجمالي الطلاب",
        OverviewNewStudents: "الطلاب الجدد",
        OverviewSubmissions: "التقديمات",
        OverviewEvents: " الجداول",
        My_Events: " الجدول الزمني",
        AddMy_Events: "اضافة موعد",
        MyTrainings: "تدريباتي",
        AddTraining: "اضافة تدريب",
        Mentor: "معلم",
        Viewmore: "عرض المزيد",
        OverviewAddedStudent: " اضافة طالب ",
        navStudents: " الطلاب ",
        StudentNama: " اسم الطالب ",
        StudentID: " رقم الطالب ",
        StudentResult: " نتيجة الطالب ",
        StudentPerformance: " اداء الطالب ",
        TotalInstructors: "اجمالي المعلمون",
        AddedInstructors: "اضافة معلمون",
        TotalCourses: "اجمالي عدد الكورسات",
        AddedCourses: "اضافة كورس",
        EventCreated: "الجداول المضافة",
        EventForThisWeek: "الجداول المتاحة هذا الاسبوع",
        ToPlanWeek: "خطط لاسبوعك الجديد",
        UsernameStudent: " اسم الطالب",
        ResultStudent: "النتيجة",
        ResultPerformance: "اداء الطالب",
        Delete: "حذف",



    },

};

function setLanguage(language) {
    const textElements = translations[language];

    // العثور على جميع العناصر التي تحتوي على خاصية data-translate
    const translateElements = document.querySelectorAll("[data-translate]");

    translateElements.forEach((element) => {
        const keyOfLanguage = element.getAttribute("data-translate"); // الحصول على المفتاح
        if (textElements[keyOfLanguage]) {
            element.textContent = textElements[keyOfLanguage]; // تعيين النص بناءً على المفتاح
        }
    });
    currentLanguage = language; // Update the current language
    localStorage.setItem("language", language); // تخزين اللغة المختارة في localStorage

    const dropdowns = document.querySelectorAll(".dropdown-menu");

    if (language === "ar") {
        document.documentElement.setAttribute("lang", "ar");
        document.body.dir = "rtl";
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("dropdown-menu-lg-end");
            dropdown.classList.add("dropdown-menu-lg-start");
        });
    } else {
        document.documentElement.setAttribute("lang", "en");
        document.body.dir = "ltr";
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("dropdown-menu-lg-start");
            dropdown.classList.add("dropdown-menu-lg-end");
        });
    }
}
//* themes:  */
function toggleTheme() {
    // تحقق من الثيم الحالي وقم بالتبديل بين 'dark' و 'light'
    let currentTheme = document.documentElement.getAttribute("data-bs-theme");
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // تغيير الثيم في الـ DOM
    document.documentElement.setAttribute("data-bs-theme", currentTheme);

    // تغيير أيقونة الثيم
    document.getElementById("theme-icon").className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    // تخزين الثيم الجديد في Local Storage
    localStorage.setItem("theme", currentTheme);


}

// استعادة اللغة المخزنة عند تحميل الصفحة
window.onload = function () {
    const savedLanguage = localStorage.getItem("language") || "en"; // استخدام اللغة المحفوظة أو الافتراضية (en)
    setLanguage(savedLanguage);

    // استعادة ثيم المخزن عند تحميل الصفحة
    const savedTheme = localStorage.getItem("theme") || 'dark'; // استخدام الثيم المخزن أو الافتراضي (dark)

    // تعيين الثيم على الصفحة
    document.documentElement.setAttribute("data-bs-theme", savedTheme);

    // تحديث أيقونة الثيم بناءً على الثيم المخزن
    document.getElementById("theme-icon").className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

};
