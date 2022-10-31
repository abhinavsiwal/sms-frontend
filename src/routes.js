// import Alternative from 'views/pages/dashboards/Alternative.js';
// import Buttons from 'views/pages/components/Buttons.js';
// import Calendar from 'views/pages/Calendar.js';
// import Cards from 'views/pages/components/Cards.js';
// import Charts from 'views/pages/Charts.js';
// import Components from 'views/pages/forms/Components.js';
// import Elements from 'views/pages/forms/Elements.js';
// import Google from 'views/pages/maps/Google.js';
// import Grid from 'views/pages/components/Grid.js';
// import Icons from 'views/pages/components/Icons.js';
// import Lock from 'views/pages/examples/Lock.js';
// import Notifications from 'views/pages/components/Notifications.js';
// import Profile from 'views/pages/examples/Profile.js';
// import ReactBSTables from 'views/pages/tables/ReactBSTables.js';
// import Register from 'views/pages/examples/Register.js';
// import RTLSupport from 'views/pages/examples/RTLSupport.js';
// import Sortable from 'views/pages/tables/Sortable.js';
// import Tables from 'views/pages/tables/Tables.js';
// import Timeline from 'views/pages/examples/Timeline.js';
// import Typography from 'views/pages/components/Typography.js';
// import Validation from 'views/pages/forms/Validation.js';
// import Vector from 'views/pages/maps/Vector.js';
// import Widgets from 'views/pages/Widgets.js';

// import Login from 'views/pages/Login/Login.js';
import Dashboard from "views/pages/dashboards/Dashboard.js";
import DepartmentList from "views/pages/department/DepartmentList";
import DepartmentHead from "views/pages/department/DepartmentHead";
import AddStaff from "views/pages/staffManagement/AddStaff";
import AddStudent from "views/pages/studentManagement/AddStudent";
import SchoolProfile from "views/pages/schoolProfile/SchoolProfile";
import StudentProfile from "views/pages/studentProfile/StudentProfile";
import StaffProfile from "views/pages/Staff Profile/StaffProfile";
import Profile from "views/pages/Staff Profile/Profile";
import Support from "views/pages/support/Support";
import Session from "views/pages/session/AddSession";
import AddSection from "./views/pages/section/AddSection";
import ClassTeacher from "views/pages/class/ClassTeacher";
import AddClass from "views/pages/class/AddClass";
import AddSubject from "views/pages/subject/AddSubject";
import AllStudents from "views/pages/studentManagement/AllStudents";
// import UpdateStudent from "views/pages/studentManagementp/UpdateStuden t";
import AllStaffs from "views/pages/staffManagement/AllStaffs";
import UpdateStaff from "views/pages/staffManagement/UpdateStaff";
import Calendar from "views/pages/Calendar/Calendar.js";
import Attendance from "views/pages/Attendance/Attendance";
// import TimeTable from "views/pages/Time Table/TimeTable";
import AddTimeTable from "views/pages/Time Table/AddTimeTable";
import ViewTimeTable from "views/pages/Time Table/ViewTimeTable";
import RolePermissions from "views/pages/Roles&Permissions/RolePermissions";
import AddCanteen from "views/pages/Canteen/AddCanteen";
import ViewCanteen from "views/pages/Canteen/ViewCanteen";
import ViewAllCanteen from "views/pages/Canteen/ViewAllCanteen";
import ViewRoute from "views/pages/Transportation/ViewRoute";
import AddRoute from "views/pages/Transportation/AddRoute";
import Viewproduct from "views/pages/Ecommerce/Viewproduct";
import Addproduct from "views/pages/Ecommerce/Addproduct";
import StudentCredentials from "views/pages/credentials/StudentCredentials";
// import StaffAttendance from "views/pages/staffManagement/StaffAttendance";
import FeesMaster from "views/pages/FeesManagement/feesmaster";
import PenaltyMaster from "views/pages/FeesManagement/penalty";
import AddBuilding from "views/pages/Hostel/AddBuildingFloor";
import AddShelf from "views/pages/Library/AddShelf";
import AddBooks from "views/pages/Library/AddBooks";
import AllocationManager from "views/pages/Library/AllocationManager";
import HostelAllocation from "views/pages/Hostel/AllocationManager";
import ViewAllocations from "views/pages/Library/ViewAllocations";
import ViewHostelAllocations from "views/pages/Hostel/ViewAllocations";
import ApplyLeave from "./views/pages/LeaveManagement/ApplyLeave";
import ViewAllLeaves from "./views/pages/LeaveManagement/ViewAllLeaves";
import ViewLeaves from "./views/pages/LeaveManagement/ViewLeaves";
import SiblingMaster from "views/pages/FeesManagement/sibling";
import ViewFees from "./views/pages/FeesManagement/view";
import CollectionMaster from "./views/pages/CollectionMaster";
import AllProducts from "./views/pages/Ecommerce/AllProducts";
import StaffCredentials from "views/pages/credentials/StaffCredentials";
import PenaltyMaster1 from "views/pages/FeesManagement/Penalty1";
import FeesMaster1 from "views/pages/FeesManagement/FeesMaster1";
import BudgetMaster from "./views/pages/Accounts/Budget";
import DeptBudgetMaster from "views/pages/Accounts/DeptBudget";
import BudgetUsesDetails from "views/pages/Accounts/BudgetUsesDetails";
import SalaryBreakup from "views/pages/Accounts/SalaryBreakup";
import ApplySalaryAdvance from "views/pages/Accounts/ApplySalaryAdvance";
import SalaryAdvanceApprover from "views/pages/Accounts/SalaryAdvanceApprover";
import LinkStudent from "views/pages/Accounts/LinkStudent";
import PaySalary from "views/pages/Accounts/PaySalary";
import CouponMaster from "views/pages/FeesManagement/CouponMaster";
import StaffDocuments from "views/pages/staffManagement/StaffDocuments";
import StudentDocuments from "views/pages/studentManagement/StudentDocuments";
import PendingFees from "views/pages/FeesManagement/PendingFees";
import GradingMaster from "views/pages/Result/GradingMaster";
import ExamMaster from "views/pages/Result/ExamMaster";
import MarksMaster from "views/pages/Result/MarksMaster";
import Attendance1 from "views/pages/Attendance-Refactor/Attendance1"
import Attendance2 from "views/pages/Attendance-Refactor/Attendance2"
import TimeTable from 'views/pages/TimeTable-Refactor/TimeTable'
import TimeTable1 from 'views/pages/TimeTable-Refactor/TimeTable1'
import Assignment from 'views/pages/Assignment/Assignment'
import Promotion from 'views/pages/Result/Promotion'
import Hostel from "views/pages/FeesManagement/Hostel";
import Transport from "views/pages/FeesManagement/Transport";
import StaffAttendance from 'views/pages/Staff-Attendance/StaffAttendance'
export const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-shop text-primary",
    component: Dashboard,
    layout: "/admin",
    module: "Dashboard",
  },
  {
    collapse: true,
    name: "Staff Management",
    icon: "ni ni-single-02 text-orange",
    state: "examplesCollapse",
    module: "Staff Management",
    views: [
      {
        path: "/add-staff",
        name: "Add Staff",
        miniName: "A",
        component: AddStaff,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/all-staffs",
        name: "All Staffs",
        miniName: "A",
        component: AllStaffs,
        layout: "/admin",
        permission: "view",
      },
      {
        path: "/staff-attendance",
        name: "Staff Attendance",
        miniName: "S",
        component: StaffAttendance,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/staff-documents",
        name: "Staff Documents",
        miniName: "S",
        component: StaffDocuments,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/staff-attenadance",
        name: "Staff Attendance",
        miniName: "S",
        component: StaffAttendance,
        layout: "/admin",
        permission: "add",
      },
    ],
  },
  {
    collapse: true,
    name: "Credential Master",
    icon: "ni ni-settings-gear-65 text-red",
    state: "credentialCollapse",
    module: "Credentials Master",
    views: [
      {
        path: "/student-credentials",
        name: "Student",
        miniName: "A",
        component: StudentCredentials,
        layout: "/admin",
        permission: "view",
      },
      {
        path: "/staff-credentials",
        name: "Staff",
        miniName: "S",
        component: StaffCredentials,
        layout: "/admin",
        permission: "view",
      },
    ],
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "ni ni-shop text-primary",
    component: Profile,
    layout: "/admin",
    module: "Staff Management",
  },
  { 
    collapse: true,
    name: "Class Management",
    icon: "fa fa-users",
    state: "classCollapse",
    module: "Class, section and subject master",
    views: [
      {
        path: "/add-class",
        name: "Add Class ",
        miniName: "ACs",
        component: AddClass,
        layout: "/admin",
        permission: "view",
      },
     
      {
        path: "/add-subject",
        name: "Add Subject",
        miniName: "AS",
        component: AddSubject,
        layout: "/admin",
        permission: "view",
      },
      {
        path: "/add-section",
        name: "Add Section",
        miniName: "AS",
        component: AddSection,
        layout: "/admin",
        permission: "view",
      },
      {
        path: "/class-teacher",
        name: "Class Teacher",
        miniName: "CT",
        component: ClassTeacher,
        layout: "/admin",
        permission: "add",
      },
    ],
  },
  {
    collapse: true,
    name: "Department",
    icon: "fa fa-users",
    state: "departmentsCollapse",
    module: "Department",
    views: [
      {
        path: "/department-list",
        name: "Department List",
        miniName: "DL",
        component: DepartmentList,
        layout: "/admin",
        permission: "view",
      },
      {
        path: "/department-head",
        name: "Department Head",
        miniName: "DH",
        component: DepartmentHead,
        layout: "/admin",
        permission: "add",
      },
    ],
  },
  {
    path: "/school-profile",
    name: "School Profile",
    icon: "ni ni-shop text-primary",
    component: SchoolProfile,
    layout: "/admin",
    module: "School Profile Module",
  },
  {
    collapse: true,
    name: "Student Management",
    icon: "ni ni-single-02 text-orange",
    state: "studentsCollapse",
    module: "Student Management",
    views: [
      {
        path: "/add-student",
        name: "Add Student",
        miniName: "A",
        component: AddStudent,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/all-students",
        name: "All Students",
        miniName: "A",
        component: AllStudents,
        layout: "/admin",
        permission: "view",
      },
      {
        path: "/attendance",
        name: "Attendance",
        miniName: "A",
        component:Attendance1,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/student-documents",
        name: "Student Documents",
        miniName: "SD",
        component: StudentDocuments,
        layout: "/admin",
        permission: "add",
      },
    ],
  },
  {
    path: "/student-profile",
    name: "Student Profile",
    icon: "ni ni-shop text-primary",
    component: StudentProfile,
    layout: "/admin",
    module: "Student Profile",
  },
  {
    path: "/session",
    name: "Session",
    icon: "ni ni-shop text-primary",
    component: Session,
    layout: "/admin",
    module: "Session",
  },
  {
    path: "/support",
    name: "Support",
    icon: "ni ni-shop text-primary",
    component: Support,
    layout: "/admin",
    module: "Support",
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: "ni ni-calendar-grid-58 text-red",
    component: Calendar,
    layout: "/admin",
    module: "School Calendar",
  },

  {
    path: "/assignment",
    name: "Assignment Master",
    icon: "ni ni-badge",
    component: Assignment,
    layout: "/admin",
    module: "Assignment",
  },
  // {
  //   path: "/timeTable",
  //   name: "Time Table",
  //   icon: "ni ni-calendar-grid-58 text-black",
  //   component: TimeTable,
  //   layout: "/admin",
  // },

  {
    collapse: true,
    name: "Time Table",
    icon: "ni ni-calendar-grid-58 text-black",
    state: "timetableCollapse",
    module: "Time table Management",
    views: [
      {
        path: "/add_time_table",
        name: "Add Time Table",
        miniName: "A",
        component: TimeTable,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/time_table",
        name: "Time Table",
        miniName: "A",
        component: TimeTable1,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view_time_table",
        name: "View Time Table",
        miniName: "V",
        component: ViewTimeTable,
        layout: "/admin",
        permission: "view",
      },
    ],
  },

  {
    collapse: true,
    name: "Canteen Management",
    icon: "ni ni-basket text-yellow",
    state: "canteenCollapse",
    module: "Canteen Management",
    views: [
      {
        path: "/add-canteen",
        name: "Add Canteen",
        miniName: "A",
        component: AddCanteen,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-canteen",
        name: "View Canteen",
        miniName: "V",
        component: ViewCanteen,
        layout: "/admin",
        permission: "view",
      },
      {
        path: "/view-all-canteen",
        name: "View All Canteen",
        miniName: "V",
        component: ViewAllCanteen,
        layout: "/admin",
        permission: "view",
      },
    ],
  },
  {
    path: "/rolesPermissions",
    name: "Roles&Permissions",
    icon: "ni ni-settings-gear-65 text-blue",
    component: RolePermissions,
    layout: "/admin",
    module: "Role and Permissions",
  },

  {
    collapse: true,
    name: "Transportation",
    icon: "ni ni-bus-front-12 text-red",
    state: "transportationCollapse",
    module: "Transportation management",
    views: [
      {
        path: "/add-route",
        name: "Add Route",
        miniName: "A",
        component: AddRoute,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-route",
        name: "View Route",
        miniName: "V",
        component: ViewRoute,
        layout: "/admin",
        permission: "view",
      },
    ],
  },

  {
    collapse: true,
    name: "Ecommerce",
    icon: "ni ni-bag-17 text-pink",
    state: "ecommerceCollapse",
    module: "Ecommerce",
    views: [
      {
        path: "/add-products",
        name: "Add Product",
        miniName: "A",
        component: Addproduct,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-all-products",
        name: "View All Products",
        miniName: "A",
        component: AllProducts,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-products",
        name: "View Products",
        miniName: "V",
        component: Viewproduct,
        layout: "/admin",
        permission: "view",
      },
    ],
  },
  {
    collapse: true,
    name: "Library Management",
    icon: "ni ni-bag-17 text-pink",
    state: "libraryCollapse",
    module: "Library Management",
    views: [
      {
        path: "/add-shelf",
        name: "Add Section and Shelf",
        miniName: "A",
        component: AddShelf,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/add-books",
        name: "Add Books",
        miniName: "V",
        component: AddBooks,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/book-allocations",
        name: "Allocations",
        miniName: "V",
        component: AllocationManager,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-allocations",
        name: "View Allocations",
        miniName: "V",
        component: ViewAllocations,
        layout: "/admin",
        permission: "view",
      },
    ],
  },
  {
    collapse: true,
    name: "Hostel Management",
    icon: "ni ni-bag-17 text-pink",
    state: "HostelCollapse",
    module: "Hostel Management",
    views: [
      {
        path: "/add-building-floor",
        name: "Add Building and Floor",
        miniName: "ABF",
        component: AddBuilding,
        layout: "/admin",
        permission: "add",
      },

      {
        path: "/hostel-allocations",
        name: "Allocations",
        miniName: "V",
        component: HostelAllocation,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-hostel-allocations",
        name: "View Allocations",
        miniName: "V",
        component: ViewHostelAllocations,
        layout: "/admin",
        permission: "view",
      },
    ],
  },
  // {
  //   path: "/collectionmaster",
  //   name: "Collection Master",
  //   icon: "ni ni-shop text-primary",
  //   component: CollectionMaster,
  //   layout: "/admin",
  //   module:"collectionMaster"
  // },
  {
    collapse: true,
    name: "Fees Management",
    icon: "ni ni-single-02 text-orange",
    state: "feesCollapse",
    module: "feesManagement",
    views: [
      {
        path: "/feesmaster",
        name: "Fees Master",
        miniName: "FM",
        component: FeesMaster,
        layout: "/admin",
        permission: "view",
      },

      // {
      //   path: "/viewfees",
      //   name: "View Fees",
      //   miniName: "VF",
      //   component: ViewFees,
      //   layout: "/admin",
      //   permission:"view"
      // },
      {
        path: "/Penaltymaster",
        name: "Penalty Master",
        miniName: "PM",
        component: PenaltyMaster,
        layout: "/admin",
        permission: "add",
      },

      {
        path: "/siblingmaster",
        name: "Sibling Master",
        miniName: "SM",
        component: SiblingMaster,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/coupon-master",
        name: "Coupon Master",
        miniName: "CM",
        component: CouponMaster,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/pending-fees",
        name: "Pending Fees",
        miniName: "PF",
        component: PendingFees,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/hostel-fees",
        name: "Hostel Fees",
        miniName: "HF",
        component: Hostel,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/transportation-fees",
        name: "Transportation Fees",
        miniName: "TF",
        component: Transport,
        layout: "/admin",
        permission: "add",
      },
    ],
  },
  {
    collapse: true,
    name: "Leave Management",
    icon: "ni ni-bag-17 text-pink",
    state: "leaveCollapse",
    module: "Leave Management",
    views: [
      {
        path: "/apply-leave ",
        name: "Apply Leave",
        miniName: "a",
        component: ApplyLeave,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-leaves",
        name: "View Leaves",
        miniName: "a",
        component: ViewLeaves,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-allleaves",
        name: "View All Leave",
        miniName: "a",
        component: ViewAllLeaves,
        layout: "/admin",
        permission: "edit",
      },
    ],
  },
  {
    collapse: true,
    name: "Accounts Management",
    icon: "ni ni-bag-17",
    state: "accountsCollapse",
    module: "Accounts Management",
    views: [
      {
        path: "/staff-budget-allocations ",
        name: "Staff Budget Allocations",
        miniName: "SBA",
        component: BudgetMaster,
        layout: "/admin",
        permission: "edit",
      },
      {
        path: "/dept-budget-allocations ",
        name: "Dept Budget Allocations",
        miniName: "DBA",
        component: DeptBudgetMaster,
        layout: "/admin",
        permission: "edit",
      },
      {
        path: "/budget-uses--details ",
        name: "Budget Uses Details",
        miniName: "BUD",
        component: BudgetUsesDetails,
        layout: "/admin",
        permission: "edit",
      },
      {
        path: "/salary-breakup",
        name: "Salary Breakup",
        miniName: "SB",
        component: SalaryBreakup,
        layout: "/admin",
        permission: "edit",
      },
      {
        path: "/apply-salary-advance",
        name: "Apply Salary Advance",
        miniName: "ASA",
        component: ApplySalaryAdvance,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/salary-advance-approver",
        name: "Salary Advance Approver",
        miniName: "SAA",
        component: SalaryAdvanceApprover,
        layout: "/admin",
        permission: "edit",
      },
      {
        path: "/link-student",
        name: "Link Student With Salary",
        miniName: "LS",
        component: LinkStudent,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/pay-salary",
        name: "Pay Salary",
        miniName: "PS",
        component: PaySalary,
        layout: "/admin",
        permission: "add",
      },
    ],
  },
  {
    collapse: true,
    name: "Result Management",
    icon: "ni ni-bag-17",
    state: "resultCollapse",
    module: "Result Management",
    views: [
      {
        path: "/grade-master ",
        name: "Grade Master",
        miniName: "GM",
        component: GradingMaster,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/exam-master ",
        name: "Exam Master",
        miniName: "EM",
        component: ExamMaster,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/marks-master ",
        name: "Marks Master",
        miniName: "MM",
        component: MarksMaster,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/promotions ",
        name: "Promotions",
        miniName: "P",
        component: Promotion,
        layout: "/admin",
        permission: "add",
      },
     
    ],
  },
];

export const adminRoutes1=[
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-shop text-primary",
    component: Dashboard,
    layout: "/admin",
    module: "Dashboard",
  },
  {
    collapse: true,
    name: "Configuration",
    icon: "ni ni-single-02 text-orange",
    state: "examplesCollapse",
    module: "Configuration",
    views: [
      {
        path: "/add-session",
        name: "Create Session",
        miniName: "CS",
        component: Session,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/department",
        name: "Department",
        miniName: "D",
        component: DepartmentList,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/staff-attendance",
        name: "Staff Attendance",
        miniName: "S",
        component: StaffAttendance,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/staff-documents",
        name: "Staff Documents",
        miniName: "S",
        component: StaffDocuments,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/staff-attenadance",
        name: "Staff Attendance",
        miniName: "S",
        component: StaffAttendance,
        layout: "/admin",
        permission: "add",
      },
    ],
  },
]

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-shop text-primary",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/collectionmaster",
    name: "Collection Master",
    icon: "ni ni-shop text-primary",
    component: CollectionMaster,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Fees Management",
    icon: "ni ni-single-02 text-orange",
    state: "feesCollapse",
    views: [
      {
        path: "/feesmaster",
        name: "Fees Master",
        miniName: "FM",
        component: FeesMaster,
        layout: "/admin",
      },
      {
        path: "/viewfees",
        name: "View Fees",
        miniName: "VF",
        component: ViewFees,
        layout: "/admin",
      },
      {
        path: "/Penaltymaster",
        name: "Penalty Master",
        miniName: "PM",
        component: PenaltyMaster,
        layout: "/admin",
      },
      {
        path: "/siblingmaster",
        name: "Sibling Master",
        miniName: "SM",
        component: SiblingMaster,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Staff Management",
    icon: "ni ni-single-02 text-orange",
    state: "examplesCollapse",
    views: [
      {
        path: "/add-staff",
        name: "Add Staff",
        miniName: "A",
        component: AddStaff,
        layout: "/admin",
      },
      {
        path: "/all-staffs",
        name: "All Staffs",
        miniName: "A",
        component: AllStaffs,
        layout: "/admin",
      },
      {
        path: "/staff-attendance",
        name: "Staff Attendance",
        miniName: "S",
        component: StaffAttendance,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "ni ni-shop text-primary",
    component: Profile,
    layout: "/admin",
    module: "Profile",
  },
  {
    collapse: true,
    name: "Class Management",
    icon: "fa fa-users",
    state: "classCollapse",
    views: [
      {
        path: "/add-class",
        name: "Add Class",
        miniName: "AC",
        component: AddClass,
        layout: "/admin",
      },
      {
        path: "/add-section",
        name: "Add Section",
        miniName: "AS",
        component: AddSection,
        layout: "/admin",
      },
      {
        path: "/add-subject",
        name: "Add Subject",
        miniName: "AS",
        component: AddSubject,
        layout: "/admin",
      },
      {
        path: "/class-teacher",
        name: "Class Teacher",
        miniName: "CT",
        component: ClassTeacher,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Department",
    icon: "fa fa-users",
    state: "departmentsCollapse",
    views: [
      {
        path: "/department-list",
        name: "Department List",
        miniName: "DL",
        component: DepartmentList,
        layout: "/admin",
      },
      {
        path: "/department-head",
        name: "Department Head",
        miniName: "DH",
        component: DepartmentHead,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/school-profile",
    name: "School Profile",
    icon: "ni ni-shop text-primary",
    component: SchoolProfile,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Student Management",
    icon: "ni ni-single-02 text-orange",
    state: "studentsCollapse",
    views: [
      {
        path: "/add-student",
        name: "Add Student",
        miniName: "A",
        component: AddStudent,
        layout: "/admin",
      },
      {
        path: "/all-students",
        name: "All Students",
        miniName: "A",
        component: AllStudents,
        layout: "/admin",
      },
    ],
  },

  {
    path: "/session",
    name: "Session",
    icon: "ni ni-shop text-primary",
    component: Session,
    layout: "/admin",
  },
  {
    path: "/support",
    name: "Support",
    icon: "ni ni-shop text-primary",
    component: Support,
    layout: "/admin",
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: "ni ni-calendar-grid-58 text-red",
    component: Calendar,
    layout: "/admin",
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: "ni ni-badge",
    component: Attendance,
    layout: "/admin",
  },
  // {
  //   path: "/timeTable",
  //   name: "Time Table",
  //   icon: "ni ni-calendar-grid-58 text-black",
  //   component: TimeTable,
  //   layout: "/admin",
  // },
  {
    collapse: true,
    name: "Time Table",
    icon: "ni ni-calendar-grid-58 text-black",
    state: "timetableCollapse",
    views: [
      {
        path: "/add_time_table",
        name: "Add Time Table",
        miniName: "A",
        component: AddTimeTable,
        layout: "/admin",
      },
      {
        path: "/view_time_table",
        name: "View Time Table",
        miniName: "V",
        component: ViewTimeTable,
        layout: "/admin",
      },
    ],
  },

  {
    collapse: true,
    name: "Canteen",
    icon: "ni ni-basket text-yellow",
    state: "canteenCollapse",
    views: [
      {
        path: "/add-canteen",
        name: "Add Canteen",
        miniName: "A",
        component: AddCanteen,
        layout: "/admin",
      },
      {
        path: "/view-canteen",
        name: "View Canteen",
        miniName: "V",
        component: ViewCanteen,
        layout: "/admin",
      },
      {
        path: "/view-all-canteen",
        name: "View All Canteen",
        miniName: "V",
        component: ViewAllCanteen,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/rolesPermissions",
    name: "Roles&Permissions",
    icon: "ni ni-settings-gear-65 text-blue",
    component: RolePermissions,
    layout: "/admin",
  },

  {
    collapse: true,
    name: "Transport",
    icon: "ni ni-bus-front-12 text-red",
    state: "transportationCollapse",
    views: [
      {
        path: "/add-route",
        name: "Add Route",
        miniName: "A",
        component: AddRoute,
        layout: "/admin",
      },
      {
        path: "/view-route",
        name: "View Route",
        miniName: "V",
        component: ViewRoute,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Credential Master",
    icon: "ni ni-settings-gear-65 text-red",
    state: "credentialCollapse",
    views: [
      {
        path: "/student-credentials",
        name: "Student",
        miniName: "A",
        component: StudentCredentials,
        layout: "/admin",
      },
      {
        path: "/staff-credentials",
        name: "Staff",
        miniName: "S",
        component: StaffCredentials,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Ecommerce",
    icon: "ni ni-bag-17 text-pink",
    state: "ecommerceCollapse",
    views: [
      {
        path: "/add-products",
        name: "Add Product",
        miniName: "A",
        component: Addproduct,
        layout: "/admin",
      },
      {
        path: "/view-all-products",
        name: "View All Products",
        miniName: "A",
        component: AllProducts,
        layout: "/admin",
      },
      {
        path: "/view-products",
        name: "View Products",
        miniName: "V",
        component: Viewproduct,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Library Management",
    icon: "ni ni-bag-17 text-pink",
    state: "libraryCollapse",
    views: [
      {
        path: "/add-shelf",
        name: "Add Section and Shelf",
        miniName: "A",
        component: AddShelf,
        layout: "/admin",
      },
      {
        path: "/add-books",
        name: "Add Books",
        miniName: "V",
        component: AddBooks,
        layout: "/admin",
      },
      {
        path: "/book-allocations",
        name: "Allocations",
        miniName: "V",
        component: AllocationManager,
        layout: "/admin",
      },
      {
        path: "/view-allocations",
        name: "View Allocations",
        miniName: "V",
        component: ViewAllocations,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Hostel Management",
    icon: "ni ni-bag-17 text-pink",
    state: "HostelCollapse",
    module: "Hostel Management",
    views: [
      {
        path: "/add-building-floor",
        name: "Add Building and Floor",
        miniName: "ABF",
        component: AddBuilding,
        layout: "/admin",
        permission: "add",
      },

      {
        path: "/hostel-allocations",
        name: "Allocations",
        miniName: "V",
        component: HostelAllocation,
        layout: "/admin",
        permission: "add",
      },
      {
        path: "/view-hostel-allocations",
        name: "View Allocations",
        miniName: "V",
        component: ViewHostelAllocations,
        layout: "/admin",
        permission: "view",
      },
    ],
  },
  {
    collapse: true,
    name: "Leave Management",
    icon: "ni ni-bag-17 text-pink",
    state: "leaveCollapse",
    views: [
      {
        path: "/apply-leave",
        name: "Apply Leave",
        miniName: "a",
        component: ApplyLeave,
        layout: "/admin",
      },
      {
        path: "/view-leaves",
        name: "View Leaves",
        miniName: "a",
        component: ViewLeaves,
        layout: "/admin",
      },
      {
        path: "/view-allleaves",
        name: "View All Leave",
        miniName: "a",
        component: ViewAllLeaves,
        layout: "/admin",
      },
    ],
  },
];

export default routes;
