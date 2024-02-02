import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { hideSwalLoading, showSwalLoading } from "../../utils/loadingSwal";
import axios from "axios";

const ModalPassword = ({ formData, modalUpsert, setModalUpsert }) => {
  const [formValues, setFormValues] = useState(formData);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword2, setHidePassword2] = useState(true);
  const [error, setError] = useState({});

  useEffect(() => {
    setFormValues(formData);
    setPassword("");
    setConfirmPass("");
    setError({});
  }, [formData]);

  async function handleSubmit(event) {
    event.preventDefault();
    const newErrors = {};

    if (password !== confirmPass) {
      newErrors.password = "Password tidak sama";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      formValues.password = password;
      setModalUpsert(false);
      showSwalLoading();
      try {
        var response = await axios.post(
          "/api/user/change-password",
          formValues
        );
        var result = response.data;
        hideSwalLoading();
        if (result.success) {
          Swal.fire({
            title: `Informasi`,
            text: `Ganti password berhasil dilakukan`,
            icon: "success",
            confirmButtonText: "Close",
          }).then(() => {
            // router.reload();
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
  }

  return (
    <>
      <Dialog
        header="Change Password"
        visible={modalUpsert}
        modal
        style={{ width: "30vw" }}
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
          <label htmlFor="password">Password</label>
          <div className="relative">
            <InputText
              type={hidePassword ? "password" : "text"}
              placeholder="Password"
              name="password"
              className={`${error.password && "p-invalid"} w-full`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`pi pi-fw pi-${
                hidePassword ? "eye" : "eye-slash"
              } absolute`}
              onClick={() => setHidePassword(!hidePassword)}
              style={{
                top: "50%",
                right: "1rem",
                transform: "translateY(-40%)",
              }}
            />
          </div>
        </div>
        <div className="field mt-3">
          <label htmlFor="confirm">Confirm Password</label>
          <div className="relative">
            <InputText
              type={hidePassword2 ? "password" : "text"}
              placeholder="Password"
              name="confirm"
              className={`${error.password && "p-invalid"} w-full`}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <i
              className={`pi pi-fw pi-${
                hidePassword2 ? "eye" : "eye-slash"
              } absolute`}
              onClick={() => setHidePassword2(!hidePassword2)}
              style={{
                top: "50%",
                right: "1rem",
                transform: "translateY(-40%)",
              }}
            />
          </div>
          {error.password && (
            <small className="p-error">{error.password}</small>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default ModalPassword;
