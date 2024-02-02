import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { httpPostActive } from "../../../../pages/api/httpUtils";

const ModalActive = ({ targetId, modalActive, setModalActive }) => {
  const [dialogModal, setDialogModal] = useState(false);
  const [modalResponse, setModalResponse] = useState("");
  const router = useRouter();

  const closeDialogModal = () => {
    setDialogModal(false);
    if (modalResponse === "success") {
      router.reload();
    } else {
      setModalResponse("");
    }
  };

  const handleActive = async () => {
    const result = await httpPostActive(
      "http://103.87.78.74/mhg_api/api/admin/hospital-doctor/active",
      "hospital_doctor_id",
      targetId
    );

    if (result === 200) {
      setModalResponse("success");
    } else {
      setModalResponse("fail");
    }
  };

  return (
    <>
      <Dialog
        header="Active Dokter RS"
        visible={modalActive}
        style={{ width: "30vw" }}
        modal
        footer={
          <>
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setModalActive(false)}
              severity="danger"
              outlined
            />
            <Button
              type="button"
              label="Confirm"
              icon="pi pi-check"
              onClick={() => {
                setModalActive(false);
                handleActive();
                setDialogModal(true);
              }}
              autoFocus
            />
          </>
        }
        onHide={() => setModalActive(false)}
      >
        <i
          className="pi pi-exclamation-triangle text-yellow-400 flex justify-content-center my-3"
          style={{ fontSize: "5rem" }}
        />
        <p>Apakah Anda ingin mengaktifkan data dokter rumah sakit ini?</p>
      </Dialog>

      <Dialog
        header="Active Dokter RS"
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
            ? "Data dokter rumah sakit berhasil diaktifkan."
            : "Terjadi kesalahan."}
        </p>
      </Dialog>
    </>
  );
};

export default ModalActive;
