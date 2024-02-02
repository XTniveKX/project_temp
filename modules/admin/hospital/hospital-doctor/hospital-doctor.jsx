import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import ModalNonactive from "./modal-nonactive";
import ModalActive from "./modal-active";
import ModalCreate from "./modal-create";
import ModalSchedule from "./schedule/modal-schedule";

const HospitalDoctors = ({
  hospital_id,
  doctors,
  hospitalDoctors,
  hospitalSchedules,
}) => {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  const [targetId, setTargetId] = useState("");
  const [modalSchedule, setModalSchedule] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalNonactive, setModalNonactive] = useState(false);

  const initialFormValues = {
    hospital_doctor_id: "",
    hospital_id: hospital_id,
    doctor_id: doctors[0]?.doctor_id,
    doctor_name: "",
    specialist_name: "",
    hospital_name: "",
    active: true,
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  function clearForm() {
    setTargetId("");
    setFormValues(initialFormValues);
  }

  const renderSearch = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Cari Dokter RS"
          />
        </span>
      </div>
    );
  };

  const activeTemplate = (rowData) => {
    if (rowData.active) {
      return <span>Aktif</span>;
    } else {
      return <span>Tidak Aktif</span>;
    }
  };

  const actionButton = (rowData) => {
    return (
      <React.Fragment>
        <div className="grid gap-1 justify-content-center">
          <Button
            type="button"
            icon="pi pi-list"
            onClick={() => {
              setTargetId(rowData.hospital_doctor_id);
              setModalSchedule(true);
            }}
            severity="help"
            outlined
            tooltip="Jadwal"
          ></Button>
          {rowData.active ? (
            <Button
              type="button"
              icon="pi pi-ban"
              onClick={() => {
                setTargetId(rowData.hospital_doctor_id);
                setModalNonactive(true);
              }}
              severity="danger"
              outlined
              tooltip="Nonactive"
            ></Button>
          ) : (
            <Button
              type="button"
              icon="pi pi-check"
              onClick={() => {
                setTargetId(rowData.hospital_doctor_id);
                setModalActive(true);
              }}
              severity="success"
              outlined
              tooltip="Active"
            ></Button>
          )}
        </div>
      </React.Fragment>
    );
  };

  const checkSchedule = (index, row) => {
    const match = hospitalSchedules.filter(
      (item) =>
        item.hospital_doctor_id === row.hospital_doctor_id &&
        item.schedule_day === index
    );

    if (match.length > 0) {
      return match
        .sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.start_hour}`).getTime();
          const timeB = new Date(`1970-01-01T${b.start_hour}`).getTime();
          return timeA - timeB;
        })
        .map((item, index2) => (
          <div key={index2}>
            {item.start_hour}-{item.end_hour}
          </div>
        ));
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [hospitalDoctors]);

  return (
    <>
      <ModalSchedule
        hospital_doctor_id={targetId}
        hospitalSchedules={hospitalSchedules.filter(
          (item) => item.hospital_doctor_id === targetId
        )}
        modalSchedule={modalSchedule}
        setModalSchedule={setModalSchedule}
      />
      <ModalCreate
        targetId={targetId}
        formData={formValues}
        doctors={doctors}
        modalCreate={modalCreate}
        setModalCreate={setModalCreate}
      />
      <ModalActive
        targetId={targetId}
        modalActive={modalActive}
        setModalActive={setModalActive}
      />
      <ModalNonactive
        targetId={targetId}
        modalNonactive={modalNonactive}
        setModalNonactive={setModalNonactive}
      />
      <div className="flex justify-content-between">
        <h5>Dokter</h5>
        <Button
          type="button"
          icon="pi pi-plus"
          label="Create"
          onClick={() => {
            clearForm();
            setModalCreate(true);
          }}
          className="-mt-2 mb-2"
          severity="primary"
        ></Button>
      </div>
      <DataTable
        value={hospitalDoctors.filter((item) =>
          item.doctor_name.toLowerCase().includes(filterText.toLowerCase())
        )}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="hospital_doctor_id"
        filterDisplay="menu"
        loading={loading}
        emptyMessage="Tidak ada data ditemukan"
        header={renderSearch}
      >
        <Column field="doctor_id" header="Nama Dokter" sortable />
        <Column field="doctor_name" header="Nama Dokter" sortable />
        <Column field="specialist_name" header="Spesialisasi" sortable />
        <Column field="active" header="Active" body={activeTemplate} sortable />
        <Column header="Minggu" body={(rowData) => checkSchedule(0, rowData)} />
        <Column header="Senin" body={(rowData) => checkSchedule(1, rowData)} />
        <Column header="Selasa" body={(rowData) => checkSchedule(2, rowData)} />
        <Column header="Rabu" body={(rowData) => checkSchedule(3, rowData)} />
        <Column header="Kamis" body={(rowData) => checkSchedule(4, rowData)} />
        <Column header="Jumat" body={(rowData) => checkSchedule(5, rowData)} />
        <Column header="Sabtu" body={(rowData) => checkSchedule(6, rowData)} />
        <Column header="Action" body={actionButton} />
      </DataTable>
    </>
  );
};

export default HospitalDoctors;
