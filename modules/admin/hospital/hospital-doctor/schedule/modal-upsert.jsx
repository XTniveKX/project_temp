import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { httpPostUpsert } from "../../../../../pages/api/httpUtils";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

const ModalUpsert = ({ targetId, formData, modalUpsert, setModalUpsert }) => {
  const [formValues, setFormValues] = useState(formData);
  const [error, setError] = useState({});
  const router = useRouter();

  const [modalConfirm, setModalConfirm] = useState(false);
  const [dialogModal, setDialogModal] = useState(false);
  const [modalResponse, setModalResponse] = useState("");

  const closeDialogModal = () => {
    setDialogModal(false);
    if (modalResponse === "success") {
      router.reload();
    } else {
      setModalResponse("");
    }
  };

  function handleInputChange(event) {
    const { name, value } = event.target;

    setError((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  useEffect(() => {
    setFormValues(formData);
    setError({});
  }, [formData]);

  const checkTime = (time, key) => {
    if (typeof time === "object") {
      setFormValues((prevValues) => ({
        ...prevValues,
        [key]:
          time.getHours().toString().padStart(2, "0") +
          ":" +
          time.getMinutes().toString().padStart(2, "0"),
      }));
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    checkTime(formValues.start_hour, "start_hour");
    checkTime(formValues.end_hour, "end_hour");

    const newErrors = {};

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setModalConfirm(true);
    }
  }

  async function handleUpsert() {
    const formSubmit = {
      ...formValues,
    };

    const result = await httpPostUpsert(
      "http://103.87.78.74/mhg_api/api/admin/hospital-schedule/upsert",
      formSubmit
    );

    setDialogModal(true);
    if (result === 200) {
      setModalResponse("success");
    } else {
      setModalResponse("fail");
    }
  }

  const daysOptions = [
    { label: "Minggu", value: 0 },
    { label: "Senin", value: 1 },
    { label: "Selasa", value: 2 },
    { label: "Rabu", value: 3 },
    { label: "Kamis", value: 4 },
    { label: "Jumat", value: 5 },
    { label: "Sabtu", value: 6 },
  ];

  const scheduleStatus = [
    { label: "Aktif", value: "Aktif" },
    { label: "Tidak Aktif", value: "Tidak Aktif" },
  ];

  return (
    <>
      <Dialog
        header={`${targetId ? "Update" : "Create"} Jadwal Dokter`}
        visible={modalUpsert}
        style={{ width: "30vw" }}
        modal
        footer={
          <>
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setModalUpsert(false)}
              severity="danger"
              outlined
            />
            <Button
              type="button"
              label="Confirm"
              icon="pi pi-check"
              onClick={handleSubmit}
              autoFocus
            />
          </>
        }
        onHide={() => setModalUpsert(false)}
      >
        <div className="field mt-3">
          <label htmlFor="schedule_day">Hari Praktik</label>
          <Dropdown
            value={formValues.schedule_day}
            onChange={(e) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                schedule_day: e.target.value,
              }))
            }
            className="w-full"
            options={daysOptions}
            optionLabel="label"
            placeholder={formValues.schedule_day}
          />
        </div>
        <div className="field mt-3">
          <label htmlFor="start_hour">Jam Mulai</label>
          <Calendar
            timeOnly
            showTime
            hourFormat="24"
            className="w-full"
            value={formValues.start_hour}
            onChange={(e) => {
              setFormValues((prevValues) => ({
                ...prevValues,
                start_hour: e.target.value,
              }));
            }}
            placeholder={formValues.start_hour}
          ></Calendar>
        </div>
        <div className="field mt-3">
          <label htmlFor="end_hour">Jam Selesai</label>
          <Calendar
            timeOnly
            showTime
            hourFormat="24"
            className="w-full"
            value={formValues.end_hour}
            onChange={(e) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                end_hour: e.target.value,
              }))
            }
            placeholder={formValues.end_hour}
          ></Calendar>
        </div>
        <div className="field mt-3">
          <label htmlFor="schedule_status">Status Jadwal</label>
          <Dropdown
            value={formValues.schedule_status}
            onChange={(e) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                schedule_status: e.target.value,
              }))
            }
            className="w-full"
            options={scheduleStatus}
            optionLabel="label"
            placeholder={formValues.schedule_status}
          />
        </div>
        <div className="field mt-3">
          <label htmlFor="service_interval">Interval</label>
          <InputText
            type="number"
            placeholder={formValues.service_interval}
            name="service_interval"
            className="w-full"
            value={formValues.service_interval}
            onChange={handleInputChange}
          />
        </div>

        <div className="field mt-3">
          <label htmlFor="max_patient">Max Pasien</label>
          <InputText
            type="number"
            placeholder={formValues.max_patient}
            name="max_patient"
            className="w-full"
            value={formValues.max_patient}
            onChange={handleInputChange}
          />
        </div>
      </Dialog>

      <Dialog
        header={`${targetId ? "Update" : "Create"} Jadwal Dokter`}
        visible={modalConfirm}
        style={{ width: "30vw" }}
        modal
        footer={
          <>
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setModalConfirm(false)}
              severity="danger"
              outlined
            />
            <Button
              type="button"
              label="Confirm"
              icon="pi pi-check"
              onClick={() => {
                setModalConfirm(false);
                setModalUpsert(false);
                handleUpsert();
              }}
              autoFocus
            />
          </>
        }
        onHide={() => setModalConfirm(false)}
      >
        <i
          className="pi pi-exclamation-triangle text-yellow-400 flex justify-content-center my-3"
          style={{ fontSize: "5rem" }}
        />
        <p>
          Apakah Anda ingin {targetId ? "mengubah" : "membuat"} data jadwal
          dokter ini?
        </p>
      </Dialog>

      <Dialog
        header={`${targetId ? "Update" : "Create"} Jadwal Dokter`}
        visible={dialogModal}
        style={{ width: "30vw" }}
        modal
        footer={
          <>
            <Button
              type="button"
              label="OK"
              onClick={closeDialogModal}
              outlined
              autoFocus
            />
          </>
        }
        onHide={closeDialogModal}
      >
        <i
          className={`pi ${
            modalResponse === "success"
              ? "pi-check-circle text-green-600"
              : "pi-times-circle text-red-500"
          } flex justify-content-center my-3`}
          style={{ fontSize: "5rem" }}
        />
        <p>
          {modalResponse === "success"
            ? `Data jadwal dokter berhasil ${targetId ? "diubah" : "dibuat"}.`
            : "Terjadi kesalahan."}
        </p>
      </Dialog>
    </>
  );
};

export default ModalUpsert;
