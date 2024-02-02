import { useRouter } from "next/router";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
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
    const data = await axios.get(basePath + "/api/item/get/id", {
      params: { item_id: req.query.id },
    });

    const data2 = await axios.get(basePath + "/api/category/get");

    return {
      props: { data: data.data[0], data2: data2.data },
    };
  } catch (error) {
    throw error;
  }
}

const UpdateItem = ({ data, data2 }) => {
  const router = useRouter();

  const [error, setError] = useState({});
  const [tagList, setTagList] = useState(data2);

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
    router.push("/auth/admin/item/");
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContentState);
    formValues.description = htmlContent;

    const newErrors = {};

    if (formValues.item_name === "") {
      newErrors.item_name = "Judul artikel diperlukan";
    }
    if (formValues.category_id === "") {
      newErrors.category_id = "Kategori diperlukan";
    }
    if (formValues.description === "") {
      newErrors.description = "Deskripsi diperlukan";
    }
    try {
      const artData = await axios.get("/api/item/get");
      if (
        artData.data.some(
          (item) =>
            item.item_name.toLowerCase() === formValues.item_name.toLowerCase()
        )
      ) {
        newErrors.item_name = "Judul artikel sudah ada";
      }
    } catch (error) {}

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const slug = formValues.item_name.toLowerCase().replace(" ", "-");
      formValues.slug = slug;
      showSwalLoading();
      try {
        var response = await axios.post("/api/item/update", formValues);
        var result = response.data;
        hideSwalLoading();
        if (result.success) {
          Swal.fire({
            title: `Informasi`,
            text: `Update artikel berhasil dilakukan`,
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
            <h5>Update Artikel</h5>
          </div>
          <div>
            <div className="field">
              <label htmlFor="item_name">Judul Artikel</label>
              <InputText
                type="text"
                placeholder="Judul Artikel"
                name="item_name"
                className={`${error.item_name && "p-invalid"} w-full`}
                value={formValues.item_name || ""}
                onChange={handleInputChange}
              />
              {error.item_name && (
                <small className="p-error">{error.item_name}</small>
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="item_name">Kategori Artikel</label>
            <Dropdown
              value={formValues.category_id}
              onChange={(e) => {
                setError((prevErrors) => ({
                  ...prevErrors,
                  category_id: "",
                }));
                setFormValues((prevValues) => ({
                  ...prevValues,
                  category_id: e.value,
                }));
              }}
              className={`${error.category_id && "p-invalid"} w-full`}
              options={tagList.map((item) => item.category_id)}
              optionLabel={(option) =>
                `${
                  tagList.find((item) => item.category_id === option)
                    ?.category_name
                }`
              }
              placeholder="Kategori"
            />
            {error.category_id && (
              <small className="p-error">{error.category_id}</small>
            )}
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

export default UpdateItem;
