import { useRouter } from "next/router";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Swal from "sweetalert2";
import axios from "axios";
import {
  showSwalLoading,
  hideSwalLoading,
} from "../../../../../utils/loadingSwal";
import { convertFromHTML } from "draft-convert";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export async function getServerSideProps(req) {
  const basePath = process.env.basePath || "";
  try {
    const data = await axios.get(basePath + "/api/category/get/id", {
      params: { category_id: req.query.id },
    });

    return {
      props: { data: data.data[0] },
    };
  } catch (error) {
    throw error;
  }
}

const UpdateCategory = ({ data }) => {
  const router = useRouter();

  const [error, setError] = useState({});
  const [formValues, setFormValues] = useState(data);

  useEffect(() => {
    if (formValues.description) {
      const contentState = convertFromHTML(formValues.description);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    } else {
      setEditorState(EditorState.createEmpty());
    }
    setError({});
  }, [formValues.description]);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

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

  const redirectBack = () => {
    router.push("/auth/admin/category/");
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContentState);
    formValues.description = htmlContent;

    const newErrors = {};

    if (formValues.category_name === "") {
      newErrors.category_name = "Judul kategori diperlukan";
    }
    if (formValues.description === "") {
      newErrors.description = "Deskripsi diperlukan";
    }
    try {
      const catData = await axios.get("/api/category/get");
      if (
        catData.data.some(
          (item) =>
            item.category_name.toLowerCase() ===
            formValues.category_name.toLowerCase()
        )
      ) {
        newErrors.category_name = "Judul kategori sudah ada";
      }
    } catch (error) {}

    setError(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const tag = formValues.category_name.toLowerCase().replace(" ", "-");
      formValues.tag = tag;
      showSwalLoading();
      try {
        var response = await axios.post("/api/category/update", formValues);
        var result = response.data;
        hideSwalLoading();
        if (result.success) {
          Swal.fire({
            title: `Informasi`,
            text: `Update kategori berhasil dilakukan`,
            icon: "success",
            confirmButtonText: "Close",
          }).then(() => {
            redirectBack();
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
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="flex justify-content-between">
            <h5>Update Kategori</h5>
          </div>
          <div>
            <div className="field">
              <label htmlFor="category_name">Judul Kategori</label>
              <InputText
                type="text"
                placeholder="Judul Kategori"
                name="category_name"
                className={`${error.category_name && "p-invalid"} w-full`}
                value={formValues.category_name || ""}
                onChange={handleInputChange}
              />
              {error.category_name && (
                <small className="p-error">{error.category_name}</small>
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <div className="border-1 border-round-lg border-300 p-2">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
              />
              {error.description && (
                <small className="p-error">{error.description}</small>
              )}
            </div>
          </div>
          <div className="flex justify-content-end mt-5">
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              className="mr-2"
              onClick={redirectBack}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
