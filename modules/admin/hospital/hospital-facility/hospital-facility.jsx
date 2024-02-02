import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import ModalNonactive from "./modal-nonactive";

const HospitalFacility = ({ hospital_id, hospitalFacility }) => {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  const [targetId, setTargetId] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [modalNonactive, setModalNonactive] = useState(false);

  const router = useRouter();
  const currUrl = router.asPath;
  const url = currUrl.replace(/\/[^/]+\/[^/]+$/, "/");

  const renderSearch = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Cari Fasilitas RS"
          />
        </span>
      </div>
    );
  };

  const previewButton = (rowData) => {
    return (
      <React.Fragment>
        <Button
          type="button"
          label="Preview"
          onClick={() =>
            window.open(
              `http://103.87.78.74/mhg_api/api/admin/file-server/${rowData.file_key}`,
              "_blank"
            )
          }
          severity="primary"
          outlined
        ></Button>
      </React.Fragment>
    );
  };

  const actionButton = (rowData) => {
    return (
      <React.Fragment>
        <div className="grid gap-1 justify-content-center">
          <Link href={`${url}fasilitas/update/${rowData.facility_id}`}>
            <Button
              type="button"
              icon="pi pi-pencil"
              severity="secondary"
              outlined
              tooltip="Edit"
            ></Button>
          </Link>
          <Button
            type="button"
            icon="pi pi-trash"
            onClick={() => {
              setTargetId(rowData.facility_id);
              setModalNonactive(true);
            }}
            severity="danger"
            outlined
            tooltip="Nonactive"
          ></Button>
        </div>
      </React.Fragment>
    );
  };

  useEffect(() => {
    setLoading(false);
  }, [hospitalFacility]);

  return (
    <>
      <ModalNonactive
        targetId={targetId}
        modalNonactive={modalNonactive}
        setModalNonactive={setModalNonactive}
      />
      <div className="flex justify-content-between">
        <h5>Fasilitas</h5>
        <Link
          href={`${url}fasilitas/create?hospital_id=${hospital_id}`}
          as={`${url}fasilitas/create`}
        >
          <Button
            type="button"
            icon="pi pi-plus"
            label="Create"
            className="-mt-2 mb-2"
            severity="primary"
          ></Button>
        </Link>
      </div>
      <DataTable
        value={hospitalFacility.filter((item) =>
          item.name.toLowerCase().includes(filterText.toLowerCase())
        )}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="facility_id"
        filterDisplay="menu"
        loading={loading}
        emptyMessage="Tidak ada data ditemukan"
        header={renderSearch}
      >
        <Column field="name" header="Nama Fasilitas" sortable />
        <Column field="type" header="Tipe Fasilitas" sortable />
        <Column field="description" header="Deskripsi" sortable />
        <Column header="Preview" body={previewButton} />
        <Column header="Action" body={actionButton} />
      </DataTable>
    </>
  );
};

export default HospitalFacility;
