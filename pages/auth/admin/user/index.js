import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import Swal from "sweetalert2";
import axios from "axios";
import {
  showSwalLoading,
  hideSwalLoading,
} from "../../../../utils/loadingSwal";
import { Menu } from "primereact/menu";
import ModalUpsert from "../../../../modules/user/modal-upsert";
import ModalPassword from "../../../../modules/user/modal-password";

export async function getServerSideProps() {
  const basePath = process.env.basePath || "";
  try {
    const data = await axios.get(basePath + "/api/user/get/");

    return {
      props: { data: data.data },
    };
  } catch (error) {
    throw error;
  }
}

const UserData = ({ data }) => {
  const [filterText, setFilterText] = useState("");
  const [targetId, setTargetId] = useState("");
  const [user, setUser] = useState(data);

  const [modalUpsert, setModalUpsert] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [dataRow, setDataRow] = useState(null);
  const menu = createRef();

  const toggleMenu = (event, rowData) => {
    menu.current.toggle(event);
    setDataRow(rowData);
  };

  const initialFormValues = {
    user_id: "",
    username: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const reloadData = async () => {
    try {
      const users = await axios.get("/api/user/get");
      setUser(users.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  function clearForm() {
    setTargetId("");
    setFormValues(initialFormValues);
  }

  const getItemDetails = useCallback(async (rowData, type) => {
    setTargetId(rowData.user_id);
    try {
      const userDetail = await axios.get("/api/user/detail", {
        params: { user_id: rowData.user_id },
      });
      setFormValues(userDetail.data[0]);
      if (type === "upsert") {
        setModalUpsert(true);
      } else if (type === "password") {
        setModalPassword(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderSearch = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterText}
            className="w-10 sm:w-full"
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Cari User"
          />
        </span>
      </div>
    );
  };

  const dropdownButton = (rowData) => {
    return (
      <div className="grid gap-1 justify-content-center">
        <Menu ref={menu} model={overlayMenuItems} popup />
        <Button
          type="button"
          onClick={(e) => toggleMenu(e, rowData)}
          style={{ width: "auto" }}
          size="small"
          severity="secondary"
          outlined
          icon="pi pi-align-justify"
          tooltip="Option"
        />
      </div>
    );
  };

  const handleNonactive = useCallback((rowData) => {
    Swal.fire({
      title: "Nonactive User",
      text: "Apakah Anda ingin menonaktifkan data user ini?",
      icon: "warning",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#dd3333",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        var data = {
          user_id: rowData.user_id,
        };
        showSwalLoading();
        try {
          var response = await axios.post("/api/user/nonactive", data);
          var result = response.data;
          hideSwalLoading();
          if (result.success) {
            Swal.fire({
              title: `Sukses`,
              text: `User berhasil dinonaktifkan`,
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
              // router.reload();
              reloadData();
            });
          } else {
            Swal.fire({
              title: `Gagal`,
              text: result.message,
              icon: "error",
            });
          }
        } catch (e) {
          hideSwalLoading();
          Swal.fire({
            title: `Gagal`,
            text: e.message,
            icon: "error",
          });
        }
      }
    });
  }, []);

  const overlayMenuItems = useMemo(
    function () {
      let menuList = [];
      menuList.push({
        label: "Edit",
        icon: "pi pi-fw pi-user-edit",
        command: () => getItemDetails(dataRow, "upsert"),
      });
      menuList.push({
        label: "Change Password",
        icon: "pi pi-fw pi-user-edit",
        command: () => getItemDetails(dataRow, "password"),
      });
      menuList.push({
        label: "Nonactive",
        icon: "pi pi-trash",
        command: () => handleNonactive(dataRow),
      });
      return menuList;
    },
    [dataRow, getItemDetails, handleNonactive]
  );

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          {/* <ModalUpsert
            targetId={targetId}
            formData={formValues}
            modalUpsert={modalUpsert}
            setModalUpsert={setModalUpsert}
            reloadData={reloadData}
          />
          <ModalPassword
            formData={formValues}
            modalUpsert={modalPassword}
            setModalUpsert={setModalPassword}
          />
          <div className="flex justify-content-between">
            <h5>User</h5>
            <Button
              type="button"
              icon="pi pi-plus"
              label="Create"
              onClick={() => {
                clearForm();
                setModalUpsert(true);
              }}
              className="-mt-2 mb-2"
              severity="primary"
            ></Button>
          </div>
          <DataTable
            value={user?.filter((item) =>
              item.username?.toLowerCase().includes(filterText.toLowerCase())
            )}
            showGridlines
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            sortField="username"
            sortOrder={1}
            dataKey="user_id"
            filterDisplay="menu"
            emptyMessage="Tidak ada data ditemukan"
            header={renderSearch}
          >
            <Column field="username" header="Username" sortable />
            <Column header="Action" body={dropdownButton} />
          </DataTable> */}
        </div>
      </div>
    </div>
  );
};

export default UserData;
