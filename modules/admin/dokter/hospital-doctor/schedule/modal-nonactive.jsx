import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { httpPostNonactive } from "../../../../../pages/api/httpUtils";

const ModalNonactive = ({ targetId, modalNonactive, setModalNonactive }) => {
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

  const handleNonactive = async () => {
    const result = await httpPostNonactive(
      "http://103.87.78.74/mhg_api/api/admin/hospital-schedule/nonactive",
      "schedule_id",
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
        header="Nonactive Jadwal Dokter"
        visible={modalNonactive}
        style={{ width: "30vw" }}
        modal
        footer={
          <>
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setModalNonactive(false)}
              severity="danger"
              outlined
            />
            <Button
              type="button"
              label="Confirm"
              icon="pi pi-check"
              onClick={() => {
                setModalNonactive(false);
                handleNonactive();
                setDialogModal(true);
              }}
              autoFocus
            />
          </>
        }
        onHide={() => setModalNonactive(false)}
      >
        <i
          className="pi pi-exclamation-triangle text-yellow-400 flex justify-content-center my-3"
          style={{ fontSize: "5rem" }}
        />
        <p>Apakah Anda ingin menonaktifkan data jadwal dokter ini?</p>
      </Dialog>

      <Dialog
        header="Nonactive Jadwal Dokter"
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
            ? "Data jadwal dokter berhasil dinonaktifkan."
            : "Terjadi kesalahan."}
        </p>
      </Dialog>
    </>
  );
};

export default ModalNonactive;
