import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { httpPostUpsert } from "../../../pages/api/httpUtils";

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

  function handleFileChange(event) {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: file,
      }));
    }
  }

  useEffect(() => {
    setFormValues(formData);
    setError({});
  }, [formData]);

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = {};

    if (formValues.specialist_name === "") {
      newErrors.specialist_name = "Nama Spesialis diperlukan";
    }
    if (formValues.specialist_name_en === "") {
      newErrors.specialist_name_en = "Specialist Name diperlukan";
    }

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
      "http://103.87.78.74/mhg_api/api/admin/specialist/upsert",
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
        header={`${targetId ? "Update" : "Create"} Spesialisasi`}
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
          <label htmlFor="specialist_name">Nama Spesialisasi</label>
          <InputText
            type="text"
            placeholder="Nama Spesialisasi"
            name="specialist_name"
            className={`${error.specialist_name && "p-invalid"} w-full`}
            value={formValues.specialist_name}
            onChange={handleInputChange}
          />
          {error.specialist_name && (
            <small className="p-error">{error.specialist_name}</small>
          )}
        </div>
        <div className="field mt-3">
          <label htmlFor="specialist_name_en">Nama Spesialisasi (EN)</label>
          <InputText
            type="text"
            placeholder="Nama Spesialisasi (EN)"
            name="specialist_name_en"
            className={`${error.specialist_name_en && "p-invalid"} w-full`}
            value={formValues.specialist_name_en}
            onChange={handleInputChange}
          />
          {error.specialist_name_en && (
            <small className="p-error">{error.specialist_name_en}</small>
          )}
        </div>
        <div className="field mt-3">
          <InputText
            type="file"
            name="file"
            className="w-full"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </Dialog>

      <Dialog
        header={`${targetId ? "Update" : "Create"} Spesialisasi`}
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
          Apakah Anda ingin {targetId ? "mengubah" : "membuat"} data
          spesialisasi ini?
        </p>
      </Dialog>

      <Dialog
        header={`${targetId ? "Update" : "Create"} Spesialisasi`}
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
            ? `Data spesialisasi berhasil ${targetId ? "diubah" : "dibuat"}.`
            : "Terjadi kesalahan."}
        </p>
      </Dialog>
    </>
  );
};

export default ModalUpsert;
