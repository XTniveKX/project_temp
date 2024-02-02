import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import ModalUpsert from "./modal-upsert";
import ModalNonactive from "./modal-nonactive";

const ModalSchedule = ({
  hospital_doctor_id,
  hospitalSchedules,
  modalSchedule,
  setModalSchedule,
}) => {
  const [loading, setLoading] = useState(true);
  const [targetId, setTargetId] = useState("");
  const day = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const [modalUpsert, setModalUpsert] = useState(false);
  const [modalNonactive, setModalNonactive] = useState(false);

  const initialFormValues = {
    schedule_id: "",
    hospital_doctor_id: hospital_doctor_id,
    schedule_day: 0,
    start_hour: "00:00",
    end_hour: "00:00",
    schedule_status: "Aktif",
    service_interval: 0,
    max_patient: 0,
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  function clearForm() {
    setTargetId("");
    setFormValues(initialFormValues);
  }

  function getItemDetails(rowData) {
    setTargetId(rowData.schedule_id);
    setFormValues(rowData);
  }

  const actionButton = (rowData) => {
    return (
      <React.Fragment>
        <div className="grid gap-1 justify-content-center">
          <Button
            type="button"
            icon="pi pi-pencil"
            onClick={() => {
              getItemDetails(rowData);
              setModalUpsert(true);
            }}
            severity="secondary"
            outlined
            tooltip="Edit"
          ></Button>
          <Button
            type="button"
            icon="pi pi-trash"
            onClick={() => {
              setTargetId(rowData.schedule_id);
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
  }, [hospitalSchedules]);

  return (
    <>
      <Dialog
        header="Jadwal Dokter"
        visible={modalSchedule}
        style={{ width: "70vw" }}
        modal
        onHide={() => setModalSchedule(false)}
      >
        <div className="grid">
          <div className="col-12">
            <div className="card">
              <ModalUpsert
                targetId={targetId}
                formData={formValues}
                modalUpsert={modalUpsert}
                setModalUpsert={setModalUpsert}
              />
              <ModalNonactive
                targetId={targetId}
                modalNonactive={modalNonactive}
                setModalNonactive={setModalNonactive}
              />
              <div className="flex justify-content-end">
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
                value={hospitalSchedules}
                paginator
                className="p-datatable-gridlines"
                showGridlines
                rows={10}
                dataKey="schedule_id"
                filterDisplay="menu"
                loading={loading}
                emptyMessage="Tidak ada data ditemukan"
              >
                <Column
                  header="Jadwal"
                  body={(rowData) => day[rowData.schedule_day]}
                  sortable
                />
                <Column field="start_hour" header="Jam Mulai" sortable />
                <Column field="end_hour" header="Jam Selesai" sortable />
                <Column field="max_patient" header="Max Pasien" sortable />
                <Column field="schedule_status" header="Status" sortable />
                <Column header="Action" body={actionButton} />
              </DataTable>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ModalSchedule;
