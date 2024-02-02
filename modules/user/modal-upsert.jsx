import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { hideSwalLoading, showSwalLoading } from "../../utils/loadingSwal";

const ModalUpsert = ({
  targetId,
  formData,
  modalUpsert,
  setModalUpsert,
  reloadData,
}) => {
  const [formValues, setFormValues] = useState(formData);
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState({});

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

  async function handleSubmit(event) {
    event.preventDefault();
    const newErrors = {};

    if (formValues.username === "") {
      newErrors.username = "Username diperlukan";
    }

    try {
      const userData = await axios.get("/api/user/get");
      if (userData.data.some((item) => item.username === formValues.username)) {
        newErrors.username = "Username sudah ada";
      }
    } catch (error) {}

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setModalUpsert(false);
      showSwalLoading();
      try {
        var response = await axios.post(
          `/api/user/${targetId ? "update" : "create"}`,
          formValues
        );
        var result = response.data;
        hideSwalLoading();
        if (result.success) {
          Swal.fire({
            title: `Informasi`,
            text: `${targetId ? "Update" : "Create"} user berhasil dilakukan`,
            icon: "success",
            confirmButtonText: "Close",
          }).then(() => {
            // router.reload();
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
  }

  return (
    <>
      <Dialog
        header={`${targetId ? "Update" : "Create"} User`}
        visible={modalUpsert}
        modal
        style={{ width: "60vw" }}
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
          <label htmlFor="username">Username</label>
          <InputText
            type="text"
            placeholder="Username"
            name="username"
            className={`${error.username && "p-invalid"} w-full`}
            value={formValues.username || ""}
            onChange={handleInputChange}
          />
          {error.username && (
            <small className="p-error">{error.username}</small>
          )}
        </div>
        {!targetId && (
          <div className="field mt-3">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <InputText
                type={hidePassword ? "password" : "text"}
                placeholder="Password"
                name="password"
                className={`${error.password && "p-invalid"} w-full`}
                value={formValues.password || ""}
                onChange={handleInputChange}
              />
              <i
                className="pi pi-fw pi-eye absolute"
                onClick={() => setHidePassword(!hidePassword)}
                style={{
                  top: "50%",
                  right: "1rem",
                  transform: "translateY(-40%)",
                }}
              />
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ModalUpsert;
