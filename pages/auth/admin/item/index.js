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
import { useRouter } from "next/router";

export async function getServerSideProps() {
  const basePath = process.env.basePath || "";
  try {
    const data = await axios.get(basePath + "/api/item/get/");

    return {
      props: { data: data.data },
    };
  } catch (error) {
    throw error;
  }
}

const ItemData = ({ data }) => {
  const [filterText, setFilterText] = useState("");
  const router = useRouter();
  const url = router.asPath;

  const [item, setItem] = useState(data);
  const [dataRow, setDataRow] = useState(null);
  const menu = createRef();

  const toggleMenu = (event, rowData) => {
    menu.current.toggle(event);
    setDataRow(rowData);
  };

  const reloadData = async () => {
    try {
      const cat = await axios.get("/api/item/get");
      setItem(cat.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reloadData();
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
            placeholder="Cari Artikel"
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
      title: "Nonactive Artikel",
      text: "Apakah Anda ingin menonaktifkan data artikel ini?",
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
          item_id: rowData.item_id,
        };
        showSwalLoading();
        try {
          var response = await axios.post("/api/item/nonactive", data);
          var result = response.data;
          hideSwalLoading();
          if (result.success) {
            Swal.fire({
              title: `Sukses`,
              text: `Artikel berhasil dinonaktifkan`,
              icon: "success",
              confirmButtonText: "Close",
            }).then(() => {
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
        command: () => router.push(url + "/update/" + dataRow.item_id),
      });
      menuList.push({
        label: "Nonactive",
        icon: "pi pi-trash",
        command: () => handleNonactive(dataRow),
      });
      return menuList;
    },
    [dataRow, router, url, handleNonactive]
  );

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="flex justify-content-between">
            <h5>Artikel</h5>
            <Button
              type="button"
              icon="pi pi-plus"
              label="Create"
              onClick={() => {
                router.push(url + "/create");
              }}
              className="-mt-2 mb-2"
              severity="primary"
            ></Button>
          </div>
          <DataTable
            value={item?.filter((item) =>
              item.item_name?.toLowerCase().includes(filterText.toLowerCase())
            )}
            showGridlines
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            sortField="item_name"
            sortOrder={1}
            dataKey="item_id"
            filterDisplay="menu"
            emptyMessage="Tidak ada data ditemukan"
            header={renderSearch}
          >
            <Column field="item_name" header="Nama Artikel" sortable />
            <Column field="category_name" header="Nama Kategori" sortable />
            <Column header="Action" body={dropdownButton} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ItemData;
