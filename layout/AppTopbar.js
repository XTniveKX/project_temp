import Link from "next/link";
import Router, { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Menu } from "primereact/menu";
import axios from "axios";
import { Toast } from "primereact/toast";

const AppTopbar = forwardRef((props, ref) => {
  const menu = useRef(null);
  const router = useRouter();
  const toast = useRef();

  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const handleLogOut = async () => {
    await axios.get("/api/auth/logout");
    toast.current.show({
      severity: "success",
      summary: "Logout",
      detail: "Berhasil logout",
      life: 3000,
    });
    router.push("/auth/login");
  };

  const overlayMenuItems = [
    {
      label: "Setting",
      icon: "pi pi-cog",
      command: () => {
        console.log("Setting");
      },
    },
    {
      separator: true,
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        handleLogOut();
      },
    },
  ];

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} widt={'true'} alt="logo" />
      </Link>
      <Toast ref={toast} />

      {/* <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button> */}

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        {/* <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button> */}
        {/* <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={(e) => menu.current.toggle(e)}
        >
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button> */}
        {/* <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-cog"></i>
          <span>Settings</span>
        </button> */}
        <Menu ref={menu} model={overlayMenuItems} popup />
      </div>
    </div>
  );
});

export default AppTopbar;
