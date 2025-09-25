import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaCreditCard,
  FaHome,
  FaMoneyBillWave,
  FaUserTie,
} from "react-icons/fa";
import { PiBooksFill, PiStudentBold } from "react-icons/pi";
import { MdGroups, MdOutlinePayments } from "react-icons/md";
import { GrDocumentText, GrMoney } from "react-icons/gr";
import { IoAnalyticsSharp, IoBookOutline } from "react-icons/io5";
import { FiUserMinus } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import { Modal } from "antd";
import { IoMdSettings } from "react-icons/io";
const Layout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [logoutModal, setLogoutModal] = useState(false);
  return (
    <div className="layout">
      <Modal
        open={logoutModal}
        centered
        onCancel={() => setLogoutModal(false)}
        title="Hisobdan chiqish"
        okText="Ha"
        cancelText="Yo'q"
        onOk={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }}
      >
        <p>Chindan ham hisobdan chiqmoqchimisiz?</p>
      </Modal>
      <aside>
        <p onClick={() => (window.location.href = "/")}>
          {user.expense_category
            ? user.name
            : `${user.first_name} ${user.last_name}`}
        </p>
        <div className="aside-links">
          <Link className={location.pathname === "/" && "active"} to="/">
            <FaHome size={20} />
            Bosh sahifa
          </Link>
          <Link
            className={location.pathname === "/staff" && "active"}
            to="/staff"
          >
            <FaUserTie size={20} />
            Xodimlar
          </Link>
          <Link
            className={location.pathname === "/teacher" && "active"}
            to="/teacher"
          >
            <FaChalkboardTeacher size={20} />
            O'qituvchilar
          </Link>
          <Link
            className={location.pathname === "/student" && "active"}
            to="/student"
          >
            <PiStudentBold size={20} />
            O'quvchilar
          </Link>
          <Link
            className={location.pathname === "/attendance" && "active"}
            to="/attendance"
          >
            <FiUserMinus size={20} />
            Davomat
          </Link>
          <Link
            className={location.pathname === "/group" && "active"}
            to="/group"
          >
            <MdGroups size={20} />
            Guruhlar
          </Link>
          <Link
            className={location.pathname === "/lesson" && "active"}
            to="/lesson"
          >
            <IoBookOutline size={20} />
            Darslar
          </Link>
          <Link
            className={location.pathname === "/exam" && "active"}
            to="/exam"
          >
            <GrDocumentText size={20} />
            Imtihon
          </Link>
          <Link
            className={location.pathname === "/subject" && "active"}
            to="/subject"
          >
            <PiBooksFill size={20} />
            Fanlar
          </Link>
          <Link
            className={location.pathname === "/subscription" && "active"}
            to="/subscription"
          >
            <FaCreditCard size={20} />
            Abonement
          </Link>
          <Link
            className={location.pathname === "/payment" && "active"}
            to="/payment"
          >
            <MdOutlinePayments size={20} />
            To'lov
          </Link>
          <Link
            className={location.pathname === "/salary" && "active"}
            to="/salary"
          >
            <FaMoneyBillWave size={20} />
            Maosh
          </Link>
          <Link
            className={location.pathname === "/expense" && "active"}
            to="/expense"
          >
            <GrMoney size={20} />
            Chiqim
          </Link>
          <Link
            className={location.pathname === "/analytics" && "active"}
            to="/analytics"
          >
            <IoAnalyticsSharp size={20} />
            Analitika
          </Link>
          <Link
            className={location.pathname === "/settings" && "active"}
            to="/settings"
          >
            <IoMdSettings size={20} />
            Sozlamalar
          </Link>
        </div>
        <button onClick={() => setLogoutModal(true)}>
          <TbLogout />
          Chiqish
        </button>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
