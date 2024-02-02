import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { httpPostUpsert } from "../../../../pages/api/httpUtils";

const ModalCreate = ({
  targetId,
  formData,
  hospitals,
  modalCreate,
  setModalCreate,
}) => {
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

  useEffect(() => {
    setFormValues(formData);
    setError({});
  }, [formData]);

  function handleSubmit(event) {
    event.preventDefault();
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
      "http://103.87.78.74/mhg_api/api/admin/hospital-doctor/create",
      formSubmit
    );

    setDialogModal(true);
    if (result === 200) {
      setModalResponse("success");
    } else {
      setModalResponse("fail");
    }
  }

  return (
    <>
      <Dialog
        header={`${targetId ? "Update" : "Create"} Dokter RS`}
        visible={modalCreate}
        style={{ width: "30vw" }}
        modal
        footer={
          <>
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setModalCreate(false)}
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
        onHide={() => setModalCreate(false)}
      >
        <div className="field mt-3">
          <label htmlFor="hospital_id">Rumah Sakit</label>
          <Dropdown
            value={formValues.hospital_id}
            onChange={(e) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                hospital_id: e.target.value,
              }))
            }
            className="w-full"
            options={hospitals.map((item) => item.hospital_id)}
            optionLabel={(option) =>
              `${option} - ${
                hospitals.find((item) => item.hospital_id === option)
                  ?.hospital_name
              }`
            }
            placeholder={formValues.hospital_id}
          />
        </div>
      </Dialog>

      <Dialog
        header={`${targetId ? "Update" : "Create"} Dokter RS`}
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
                setModalCreate(false);
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
          Apakah Anda ingin {targetId ? "mengubah" : "membuat"} data dokter
          rumah sakit ini?
        </p>
      </Dialog>

      <Dialog
        header={`${targetId ? "Update" : "Create"} Dokter RS`}
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
            ? `Data dokter rumah sakit berhasil ${
                targetId ? "diubah" : "dibuat"
              }.`
            : "Terjadi kesalahan."}
        </p>
      </Dialog>
    </>
  );
};

export default ModalCreate;
